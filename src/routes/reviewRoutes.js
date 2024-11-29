
import express from "express";
import { createReview, deleteReview } from "../controllers/reviewController.js";
import { reviewValidate } from "../middleware/validat.js";

const reviewRoutes = express.Router()

reviewRoutes.post("/:id",reviewValidate,createReview)
reviewRoutes.delete("/:id",deleteReview)
export default reviewRoutes