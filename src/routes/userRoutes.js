import express from "express";
import { signUp, verifyEmail, signIn, forgetPassword,resetPassword } from "../controllers/userController.js";
import { validationSignIn, validationSignUp } from "../middleware/validat.js";
const userRoutes = express.Router();

userRoutes.post("/signup", validationSignUp, signUp);
userRoutes.get("/verify/:token", verifyEmail);
userRoutes.post("/signin",validationSignIn, signIn);
userRoutes.post("/forgetPassword", forgetPassword);
userRoutes.patch("/resetPassword", resetPassword);

export default userRoutes;
