import express from "express";
import { validationCreateProduct, vv } from "../middleware/validat.js";
import { createProduct,getproducts } from "../controllers/productController.js";
import { multer4server } from "../service/multer/multerServer.js";
const productRoutes = express.Router();

productRoutes.post(
  "/",
  multer4server().fields([{ name: "image" }, { name: "coverImages" }]),

    validationCreateProduct,
    vv,
  createProduct
);
productRoutes.get("/",getproducts)

export default productRoutes;
