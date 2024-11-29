import { nanoid } from "nanoid";
import categoryModel from "../../db/models/categoryModel.js";
import appError from "../service/handlers/errorHandle.js";
import { handelAsync } from "./../service/handlers/handelAsync.js";
import cloudinary from "./../service/cloundairy/cloundairy.js";
import slugify from "slugify";
import mongoose from "mongoose";
import subCategoryModel from "../../db/models/subCategoryModel.js";

export const createCategory = handelAsync(async (req, res, next) => {
  const { name } = req.body;

  if (!req.file) return next(new appError("image is required", 400));
  const existCategory = await categoryModel.findOne({ name });
  if (existCategory) return next(new appError("Category already exists", 409));

  const customId = nanoid(5);

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `Ecommerce/categories/${customId}`,
    }
  );

  const newCategory = await categoryModel.create({
    name,
    createdBy: req.user._id,
    slug: slugify(name, "_"),
    image: { secure_url, public_id },
    customId,
  });

  res.status(201).json({ message: "hi", data: newCategory });
});

export const updateCategroy = handelAsync(async (req, res, next) => {
  const { name } = req.body;

  if (!name && !req.file) return next(new appError("nothing to update", 404));
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new appError("Id is not valid", 404));
  }
  const category = await categoryModel.findOne({
    _id: req.params.id,
    createdBy: req.user._id,
  });
  if (!category) return next(new appError("category not found", 404));

  if (name) {
    if (name.toLowerCase() === category.name.toLowerCase()) {
      return next(new appError("name must be changed ", 409));
    } else {
      if (await categoryModel.findOne({ name })) {
        return next(new appError("category name already exists", 409));
      } else {
        category.name = name;
        category.slug = slugify(name, "_");
      }
    }
  }

  if (req.file) {
    await cloudinary.uploader.destroy(category.image.public_id);
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `Ecommerce/categories/${category.customId}`,
      }
    );
    category.image = { secure_url, public_id };
  }
  await category.save();
  res.status(200).json({ message: "success", data: category });
});

export const getCategories = handelAsync(async (req, res, next) => {
  const categories = await categoryModel.find().populate("subCategory");

  res.status(200).json({ message: "success", data: categories });
});

export const deleteCategories = handelAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return next(new appError("invalid id", 400));

  const category = await categoryModel.findOneAndDelete({
    _id: id,
    createdBy: req.user._id,
  });
  if (!category) return next(new appError("category not found", 404));

  await subCategoryModel.deleteMany({ category: id });

  await cloudinary.api.delete_resources_by_prefix(`Ecommerce/categories/${category.customId}`)
  await cloudinary.api.delete_folder(`Ecommerce/categories/${category.customId}`)

  res.status(200).json({message:"success"})
});
