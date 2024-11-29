
import express from "express";
import { addToWishList } from "../controllers/wishListController.js";

const wishListRoutes = express.Router()
wishListRoutes.post("/:id",addToWishList)
export default wishListRoutes