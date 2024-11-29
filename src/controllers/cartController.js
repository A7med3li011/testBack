import { handelAsync } from "./../service/handlers/handelAsync.js";
import productModel from "./../../db/models/productModel.js";
import appError from "../service/handlers/errorHandle.js";
import cartModel from "../../db/models/cartModel.js";
import mongoose from "mongoose";

export const addtoCart = handelAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;

  const productIsExist = await productModel.findOne({
    _id: productId,
    stock: { $gte: quantity },
  });

  if (!productIsExist)
    return next(
      new appError(
        "not found product or quantity is greater than quantity in stock",
        404
      )
    );

  const cartisExsit = await cartModel.findOne({ user: req.user._id });
  if (!cartisExsit) {
    const cart = await cartModel.create({
      user: req.user._id,
      products: [{ productId, quantity }],
    });
    return res.status(201).json({ message: "success", cart });
  }

  let flag = false;
  for (const product of cartisExsit.products) {
    if (product.productId == productId) {
      product.quantity = quantity;
      flag = true;
      console.log("xzz");
    }
  }

  if (!flag) {
    cartisExsit.products.push({ productId, quantity });
    console.log("noooo");
  }
  await cartisExsit.save();
  res.json({ message: "success", cart: cartisExsit });
});

export const deleteFromCart = handelAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return next(new appError("id is not valid", 400));

  let cart = await cartModel.findOne({ user: req.user._id });

  if (!cart) {
    return next(new appError("product not found in cart", 404));
  }

  const prodcuts = cart.products.filter((ele) => ele.productId != id);

  const newcart = await cartModel.findOneAndUpdate(
    { user: req.user._id },
    { products: prodcuts },
    { new: true }
  );

  res.json({ message: "secccess", newcart });
});

export const clearCart = handelAsync(async (req, res, next) => {
  const cart = await cartModel.findOneAndUpdate(
    { user: req.user._id },
    { products: [] },
    { new: true }
  );
  if(!cart) return next(new appError("cart not found ", 404));
  res.status(200).json({ message: "success", cart });
});
