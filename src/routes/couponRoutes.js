import express from "express";
import { createCoupon ,updateCoupon} from "../controllers/couponController.js";
import { couponValidation, UpdateCouponValidation } from "../middleware/validat.js";



const couponRoutes = express.Router()

couponRoutes.post("/",couponValidation,createCoupon)
couponRoutes.put("/:id",UpdateCouponValidation,updateCoupon)
export default couponRoutes