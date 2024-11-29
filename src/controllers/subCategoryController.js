import { nanoid } from "nanoid";
import appError from "../service/handlers/errorHandle.js";
import { handelAsync } from "../service/handlers/handelAsync.js";
import subCategoryModel from "./../../db/models/subCategoryModel.js";
import cloudinary from "./../service/cloundairy/cloundairy.js";
import slugify from "slugify";
import mongoose from "mongoose";
import { addSubCategorySchemaFile } from "../middleware/validationSchema.js";
import categoryModel from "./../../db/models/categoryModel.js";

const createSub = handelAsync(async (req, res, next) => {
  const images = req.files;
  const { name } = req.body;
  console.log(req.params.categoryId);
  if (!mongoose.Types.ObjectId.isValid(req.params.categoryId)) {
    return next(new appError("Id is not valid", 404));
  }
  const isExistCat = await categoryModel.findOne({
    _id: req.params.categoryId,
  });
  if (!isExistCat) return next(new appError("catgeory not exists", 409));
  const isExistsub = await subCategoryModel.findOne({ name });
  if (isExistsub) return next(new appError("subCategory already exists", 409));
  const customId = nanoid(5);
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    images[0].path,
    {
      folder: `Ecommerce/categories/subCategory/${customId}`,
    }
  );
  if (!public_id)
    return next(new appError("failure while uploading image", 404));

  const newSubCategory = await subCategoryModel.create({
    name,
    image: {
      public_id,
      secure_url,
    },
    customId,
    slug: slugify(name, "_"),
    category: req.params.categoryId,
    createdBy: req.user._id,
  });

  res.status(200).json({ message: "success", newSubCategory });
});

const updatedSub = handelAsync(async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;
  const images = req.files;

  if (!images?.length && !name)
    return next(new appError("nothing to update", 404));
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new appError("Id is not valid", 404));
  }
  const subCategory = await subCategoryModel.findById(id);

  if (!subCategory) next(new appError("subCategory is not found", 404));
  if (name) {
    if (await subCategoryModel.findOne({ name }))
      return next(new appError("subCategory is aready Exist", 404));
    if (name === subCategory.name)
      return next(new appError("name must be changed", 404));
    subCategory.name = name;
    subCategory.slug = slugify(name, "_");
  }

  if (req.files.length) {
    const { error, value } = addSubCategorySchemaFile.validate(req.files);
    console.log(value);
    if (error) return next(new appError(error.message, 400));

    await cloudinary.uploader.destroy(subCategory.image.public_id);
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.files[0].path,
      {
        folder: `Ecommerce/categories/subCategory/${subCategory.customId}`,
      }
    );

    subCategory.image = { public_id, secure_url };
  }

  const newUpdated = await subCategory.save();
  res.json({ message: "hi", data: newUpdated });
});

const getsubCategories = handelAsync(async (req, res, next) => {
  const categories = await subCategoryModel.find().populate([
    {
      path:"createdBy",

      select : "name -_id"
    },
    {
      path:"category"
    }
  ]);
  res.status(200).json({ message: "success",data:categories})
});
export { createSub, updatedSub,getsubCategories };
