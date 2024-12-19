import appError from "../service/handlers/errorHandle.js";
import { handelAsync } from "../service/handlers/handelAsync.js";
import productModel from "./../../db/models/productModel.js";
import couponModle from "./../../db/models/coupon.js";
import cartModel from "./../../db/models/cartModel.js";
import orderModel from "../../db/models/orderModel.js";
import mongoose from "mongoose";

export const createOrder = handelAsync(async (req, res, next) => {
  const { productId, address, phone, cuoponCode, quantity, paymnetMethod } =
    req.body;

  if (cuoponCode) {
    const coupon = await couponModle.findOne({
      code: cuoponCode,
      toDate: { $gte: Date.now() },
      useBy: { $nin: [req.user._id] },
    });

    if (!coupon) return next(new appError("coupon not found or expired", 404));

    coupon.useBy.push(req.user._id);

    const updateCoupon = await couponModle.findOneAndUpdate(
      { code: cuoponCode },
      { $push: { useBy: req.user._id } },
      { new: true }
    );
    req.body.coupon = coupon;
  }

  let products = [];
  let flag = false;
  if (productId) {
    const product = await productModel.findOne({
      _id: productId,
      stock: { $gte: quantity },
    });

    if (!product)
      return next(new appError("product not found or out of stock", 404));
    products = [{ productId, quantity }];
  } else {
    const cart = await cartModel.findOne({ user: req.user._id });
    if (!cart || !cart.products.length)
      return next(new appError("cart is empty please select product", 404));
    products = cart.products;
    flag = true;
  }
  let finalProducts = [];
  for (let product of products) {
    let checkProduct = await productModel.findOne({
      _id: product.productId,
      stock: { $gte: product.quantity },
    });
    if (!checkProduct)
      return next(new appError("product not found or out of stock", 404));
    if (flag) {
      product = product.toObject();
    }
    (product.title = checkProduct.title),
      (product.price = checkProduct.price * product.quantity);

    finalProducts.push(product);
  }
  const subPrice = finalProducts.reduce((acc, curr) => acc + curr.price, 0);
  const order = await orderModel.create({
    user: req.user._id,
    products: finalProducts,
    subPrice,
    totalPrice: req.body?.coupon?.amount
      ? subPrice * (req.body?.coupon.amount / 100)
      : subPrice,
    phone,
    address,
    paymnetMethod,
    status: paymnetMethod == "cash" ? "placed" : "waitpayment",
    couponId: req.body?.coupon?._id,
  });

  for (const product of finalProducts) {
    await productModel.findOneAndUpdate(
      { _id: product.productId },
      { $inc: { stock: -product.quantity } },
      { new: true }
    );
  }
  if (flag) {
    await cartModel.findOneAndUpdate({ user: req.user._id }, { products: [] });
  }
  res.json({ message: "success", data: order });
});

export const cancleOrder = handelAsync(async (req, res, next) => {
  const { id } = req.params;
  const { reason } = req.body;
  if(!mongoose.Types.ObjectId.isValid(id)){
    return next(new appError("invalid order id",400))
  }

  const order = await orderModel.findOne({ _id: id, user: req.user._id });
  if (!order) return next(new appError("order not found", 404));

  if (
    (order.status != "placed" && order.paymnetMethod == "cash") ||
    (order.status != "waitpayment" && order.paymnetMethod == "card")
  ) {
    return next(new appError("can not cancled this order", 400));
  }

  await orderModel.findOneAndUpdate(
    { _id: id, user: req.user._id },
    { status: "cancelled", cancelBy: req.user._id, reasonCancellation: reason }
  );
  if (order?.couponId) {
    await couponModle.findOneAndUpdate({_id:order?.couponId}, {
      $pull: { useBy: req.user._id },
    });
  }

  for (const product of order.products) {
      await productModel.findOneAndUpdate({_id:product.productId},{$inc:{stock:product.quantity}})
  }

  res.json("message:success")
});
