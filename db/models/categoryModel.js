import mongoose, { Types } from "mongoose";

const categorySChema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Name is required"],
      minLength: 3,
      maxLength: 30,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      minLength: 3,
      maxLength: 30,
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
    customId: String,
  },
  {
    toJSON: { virtuals: true },
  }
);
categorySChema.virtual("subCategory", {
  ref: "subCategory",
  localField: "_id",
  foreignField: "category",
});
const categoryModel = mongoose.model("Category", categorySChema);

export default categoryModel;
