import { handelAsync } from "../service/handlers/handelAsync.js";
import brandModel from "./../../db/models/brandModel.js";
import appError from "./../service/handlers/errorHandle.js";
import { nanoid } from "nanoid";
import cloudinary from "./../service/cloundairy/cloundairy.js";
import slugify from "slugify";
import { createBrandFiles } from "../middleware/validationSchema.js";
import mongoose from "mongoose";

export const createBrand = handelAsync(async (req, res, next) => {
  const { name } = req.body;

  const brandisExist = await brandModel.findOne({ name });
  if (brandisExist) return next(new appError("brand is already exist", 409));
  const customId = nanoid(5);
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.files[0].path,
    {
      folder: `Ecommerce/Brands/${customId}`,
    }
  );

  if (!secure_url) return next(new appError("failed to upload", 404));

  const newBrand = await brandModel.create({
    name,
    slug: slugify(name, "_"),
    customId,
    image: { public_id, secure_url },
    createdBy: req.user._id,
  });

  res.status(200).json({ message: "success", data: newBrand });
});

export const updatedBrand = handelAsync(async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;
  // const images = req.files;
  if (!name && !req.files?.length)
    return next(new appError("nothing to update", 400));
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new appError("Id is not valid", 404));
  }

  const brand = await brandModel.findById(id);

  if (!brand) return next(new appError("brand is not exsit", 404));

  if (name) {
    if (await brandModel.findOne({ name }))
      return next(new appError("brand is already exsit", 404));
    if (name == brand.name)
      return next(new appError("name must be changed", 400));
    brand.name = name;
    brand.slug = slugify(name, "_");
  }

  if (req.files?.length) {
    const { error, value } = createBrandFiles.validate(req.files);

    if (error) return next(new appError(error.message, 400));

    await cloudinary.uploader.destroy(brand.image.public_id);

    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.files[0].path,
      {
        folder: `Ecommerce/Brands/${brand.customId}`,
      }
    );

    brand.image = { public_id, secure_url };
  }
  const updatedBrand = await brand.save();
  res.json({ messahe: "hi", data: updatedBrand });
});

export const deleteBrand = handelAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new appError("Id is not valid", 404));
  }

  const brandIsExsit = await brandModel.findById(id);
  if (!brandIsExsit) return next(new appError("brand not found", 404));

  await brandModel.findByIdAndDelete(id);
  res.json({ message: "success" });
});
