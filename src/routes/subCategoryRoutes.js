import express from "express";
import { createSub, getsubCategories, updatedSub } from "../controllers/subCategoryController.js";
import { multer4server } from "./../service/multer/multerServer.js";
import {
  validationaddsubCategoryBody,
  validationCreateSubcategoryFile,
} from "../middleware/validat.js";

const subCategoryRoutes = express.Router({ mergeParams: true });

subCategoryRoutes.post(
  "/",
  multer4server().array("images"),
  validationCreateSubcategoryFile,
  validationaddsubCategoryBody,
  createSub
);

subCategoryRoutes.put("/:id", multer4server().array("images"), updatedSub);
subCategoryRoutes.get("/", getsubCategories);
export default subCategoryRoutes;
