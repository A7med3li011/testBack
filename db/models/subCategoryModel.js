import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
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
  category: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  image: {
    secure_url: String,
    public_id: String,
  },
  customId: String,
});

const subCategoryModel = mongoose.model("subCategory", subCategorySchema);

export default subCategoryModel;
