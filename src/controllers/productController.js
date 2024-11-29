import { nanoid } from "nanoid";
import categoryModel from "../../db/models/categoryModel.js";
import productModel from "../../db/models/productModel.js";
import subCategoryModel from "../../db/models/subCategoryModel.js";
import cloudinary from "../service/cloundairy/cloundairy.js";
import appError from "../service/handlers/errorHandle.js";
import { handelAsync } from "../service/handlers/handelAsync.js";
import brandModel from "./../../db/models/brandModel.js";
import slugify from "slugify";
import { query } from "express";
import { APiFEATURES } from "../service/apiFeatcures.js";

export const createProduct = handelAsync(async (req, res, next) => {
  const { image } = req.files;
  const { coverImages } = req.files;

  let {
    title,
    description,
    price,
    discount,
    stock,
    category,
    subCategory,
    brand,
  } = req.body;

  const productisExsit = await productModel.findOne({ title });

  if (productisExsit)
    return next(new appError("Product is already exsit", 409));

  const categoryisExsit = await categoryModel.findOne({ _id: category });

  if (!categoryisExsit) return next(new appError("category is not found", 404));

  const subCategoryisExsit = await subCategoryModel.findOne({
    _id: subCategory,
  });

  if (!subCategoryisExsit)
    return next(new appError("Subcategory is not found", 404));

  const brandisExsit = await brandModel.findOne({ _id: brand });

  if (!brandisExsit) return next(new appError("brand is not found", 404));

  if (discount) {
    price -= price * (discount / 100);
  }

  const customId = nanoid(5);
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.files.image[0].path,
    {
      folder: `Ecommerce/categories/${
        categoryisExsit.customId + categoryisExsit.name
      }/subCategroy/${
        subCategoryisExsit.customId + subCategoryisExsit.name
      }/product/${customId + title}`,
    }
  );
  const list = [];
  for (const image of coverImages) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      image.path,
      {
        folder: `Ecommerce/categories/${
          categoryisExsit.customId + categoryisExsit.name
        }/subCategroy/${
          subCategoryisExsit.customId + subCategoryisExsit.name
        }/product/${customId + title}`,
      }
    );
    list.push({ public_id, secure_url });
  }

  let newProduct = await productModel.create({
    title,
    description,
    price,
    discount,
    stock,
    category,
    subCategory,
    brand,
    customId,
    image: { public_id, secure_url },
    coverImages: list,
    createdBy: req.user._id,
    slug: slugify(title, "_"),
  });

  res.json({ message: "done", data: newProduct });
});

export const getproducts = handelAsync(async (req, res, next) => {
  
  
  const apiFeature = new APiFEATURES(productModel.find(),req.query).pagination().filter().sort()
  
   

  const excute = await apiFeature.mongooesQuery
  res.json({ message: "success", data: excute });
});
