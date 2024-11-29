import mongoose, { Types } from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    require: [true, "Name is required"],
    minLength: 3,
    maxLength: 30,
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    require: [true, "Name is required"],
    minLength: 3,
    maxLength: 30,
    trim: true,
  },
  slug: {
    type: String,
    minLength: 3,
    maxLength: 60,
    trim: true,
    unique: true,
    require: [true, "Name is required"],
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  image: {
    secure_url: String,
    public_id: String,
  },
  coverImages: [
    {
      secure_url: String,
      public_id: String,
    },
  ],
  customId: String,
  price: {
    type: Number,
    min: 1,
    required: true,
  },
  discount: {
    type: Number,
    default: 1,
    min: 1,
    max: 100,
    required: true,
  },

  rateAvg: {
    type: Number,
    default: 0,
  },
  stock: {
    type: Number,
    default: 1,
    required: true,
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  subCategory: {
    type: mongoose.Types.ObjectId,
    ref: "subCategory",
    required: true,
  },
  brand: {
    type: mongoose.Types.ObjectId,
    ref: "brand",
    required: true,
  },
});

const productModel = mongoose.model("product", productSchema);

export default productModel;
