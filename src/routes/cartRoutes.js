import express from "express";
import { addtoCart, clearCart, deleteFromCart } from "../controllers/cartController.js";
import { addtocartValidate } from "../middleware/validat.js";

const cartroutes = express.Router();
cartroutes.post("/", addtocartValidate, addtoCart);
cartroutes.delete("/:id",  deleteFromCart);
cartroutes.delete("/",  clearCart);
export default cartroutes;
