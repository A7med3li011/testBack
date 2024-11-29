import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      title: { type: String, required: true },
      productId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "product",
      },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      // finalPrice: { type: Number, required: true },
    },
  ],
  subPrice: { type: Number, required: true },

  couponId: { type: mongoose.Types.ObjectId, ref: "coupon" },
  totalPrice: { type: Number, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  paymnetMethod: { type: String, required: true, enum: ["card", "cash"] },
  status: {
    type: String,
    default: "placed",
    enum: [
      "placed",
      "waitpayment",
      "deliverd",
      "onway",
      "cancelled",
      "rejected",
    ],
  },
  cancelBy: { type: mongoose.Types.ObjectId, ref: "User" },
  reasonCancellation: { type: String },
});

const orderModel = mongoose.model("order", orderSchema);

export default orderModel;
