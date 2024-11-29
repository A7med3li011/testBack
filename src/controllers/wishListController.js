import mongoose from "mongoose";
import productModel from "../../db/models/productModel.js";
import userModel from "../../db/models/userModel.js";
import appError from "../service/handlers/errorHandle.js";
import { handelAsync } from "../service/handlers/handelAsync.js";

export const addToWishList = handelAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new appError("product id is not valid", 400));
  }
  const product = await productModel.findById(id);

  if (!product) return next(new appError("Product not found", 404));

  const updateduser = await userModel.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { wishList: id } },
    { new: true }
  );


  res.json({ message: "success", data: updateduser });
});
