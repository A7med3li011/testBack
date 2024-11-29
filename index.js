import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connection from "./db/connection.js";
import userRoutes from "./src/routes/userRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";
import { auth } from "./src/middleware/auth.js";
import appError from "./src/service/handlers/errorHandle.js";
import subCategoryRoutes from "./src/routes/subCategoryRoutes.js";
import brandRoutes from "./src/routes/brandRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import couponRoutes from "./src/routes/couponRoutes.js";
import cartroutes from "./src/routes/cartRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import reviewRoutes from "./src/routes/reviewRoutes.js";
import wishListRoutes from "./src/routes/wishlistRoutes.js";
import cors from "cors"
const app = express();
connection();
app.use(cors())
app.use(express.json());
app.get("/",(req,res)=>{
  res.status(200).json({message:"hello from online"})
})
app.use("/api/v1/ecommerce/users", userRoutes);
app.use("/api/v1/ecommerce/category", auth, categoryRoutes);
app.use("/api/v1/ecommerce/subcategory", auth, subCategoryRoutes);
app.use("/api/v1/ecommerce/brand", auth, brandRoutes);
app.use("/api/v1/ecommerce/product", auth, productRoutes);
app.use("/api/v1/ecommerce/coupon", auth, couponRoutes);
app.use("/api/v1/ecommerce/cart", auth, cartroutes);
app.use("/api/v1/ecommerce/order", auth, orderRoutes);
app.use("/api/v1/ecommerce/review", auth, reviewRoutes);
app.use("/api/v1/ecommerce/wishList", auth, wishListRoutes);

app.all("*", (req, res, next) => {
  next(new appError(`invalid url:${req.originalUrl}`, 404));
});
app.use(function (err, req, res, next) {
  if (err) {
    res.status(err.statusCode).json({ message: err.message });
  }
});

let port = process.env.Port
app.listen(port, () => {
  console.log("server is running");
});
