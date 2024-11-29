import express from "express";
import {
  createCategory,
  deleteCategories,
  getCategories,
  updateCategroy,
} from "../controllers/categoryController.js";
import { multer4server } from "../service/multer/multerServer.js";
import {
  validationCreatecategorybody,
  validationCreatecategoryFile,
} from "../middleware/validat.js";
import subCategoryRoutes from "./subCategoryRoutes.js";

const categoryRoutes = express.Router();

categoryRoutes.use("/:categoryId/subCategory", subCategoryRoutes);

categoryRoutes.post(
  "/",
  multer4server().single("image"),
  validationCreatecategorybody,
  validationCreatecategoryFile,
  createCategory
);
categoryRoutes.put("/:id", multer4server().single("image"), updateCategroy);
categoryRoutes.delete("/:id",deleteCategories);
categoryRoutes.get("/", getCategories);

export default categoryRoutes;
