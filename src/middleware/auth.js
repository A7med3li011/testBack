import jwt from "jsonwebtoken";
import appError from "../service/handlers/errorHandle.js";

export const auth = (req, res, next) => {

  
  const token = req.headers.token;
  if (!token) return next(new appError("token is required", 400));
  jwt.verify(token, process.env.TOKENKEY, (err, decode) => {
    if (err) {
      next(new appError("invalid token", 401));
    } else {
      req.user = decode.checkUser;

      next();
    }
  });
};
