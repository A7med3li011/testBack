import express from "express";
import {
  createBrand,
  deleteBrand,
  updatedBrand,
} from "../controllers/brandControllers.js";
import {
  validationCreateBrandBody,
  validationCreateBrandFiles,
} from "../middleware/validat.js";
import { multer4server } from "./../service/multer/multerServer.js";
const brandRoutes = express.Router();

brandRoutes.post(
  "/",
  multer4server().array("images"),
  validationCreateBrandBody,
  validationCreateBrandFiles,
  createBrand
);
brandRoutes.put("/:id", multer4server().array("images"), updatedBrand);
brandRoutes.delete("/:id", deleteBrand);

export default brandRoutes;
