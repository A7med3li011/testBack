import { handelAsync } from "./../service/handlers/handelAsync.js";
import productModel from "./../../db/models/productModel.js";
import appError from "../service/handlers/errorHandle.js";
import orderModel from "./../../db/models/orderModel.js";
import reviewModel from "./../../db/models/reviewModel.js";
import mongoose from "mongoose";

async function chnageRateProduct(id) {
  const allReviews = await reviewModel.find({ productId: id });
  const allRates = allReviews.reduce((acc, curr) => acc + curr.rate, 0);

  const avRate = allRates / allReviews.length;

  await productModel.findByIdAndUpdate(id, { rateAvg: avRate || 0 });
}

export const createReview = handelAsync(async (req, res, next) => {
  const { id } = req.params;
  const { rate, comment } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new appError("Product id is not valid", 404));
  }

  const product = await productModel.findOne({ _id: id });

  if (!product) return next(new appError("Product not found", 404));

  const order = await orderModel.findOne({
    user: req.user._id,
    status: "deliverd",
    "products.productId": id,
  });
  if (!order) return next(new appError("Order not found", 404));

  const reviewExist = await reviewModel.findOne({
    createBy: req.user._id,
    productId: id,
  });
  if (reviewExist)
    return next(new appError("you already reviewd this product  ", 409));

  const review = await reviewModel.create({
    rate,
    productId: id,
    comment,
    createBy: req.user._id,
  });

  await chnageRateProduct(id);

  res.status(201).json({ message: "success", review });
});

export const deleteReview = handelAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new appError("review id is not valid", 404));
  }

  const reveiw = await reviewModel.findByIdAndDelete(id);
  if (!reveiw) return next(new appError("review not found", 404));
  
  await chnageRateProduct(reveiw.productId);

  res.json({ message: "success" });
});
