import { customAlphabet } from "nanoid";
import { sendEmail } from "../service/email/sendEmail.js";
import userModel from "./../../db/models/userModel.js";
import appError from "../service/handlers/errorHandle.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmailForget } from "./../service/email/sendEmail_forgetPassword.js";
import { handelAsync } from "../service/handlers/handelAsync.js";

const signUp = handelAsync(async (req, res, next) => {
  const { name, email, password, age, phone, address } = req.body;

  const exsitUser = await userModel.findOne({ email });

  if (exsitUser) return next(new appError("email already exsit", 409));

  const hasPassword = await bcrypt.hash(
    password,
    Number(process.env.SLATROUND)
  );

  const newUser = await userModel.insertMany({
    name,
    email,
    password: hasPassword,
    age,
    phone,
    address,
  });

  const token = jwt.sign({ email }, process.env.VRIFAYCODE);
  sendEmail({
    email,
    api: `${req.protocol}://${req.headers.host}/api/v1/ecommerce/users/verify/${token}`,
  });

  res.status(201).json({ message: "done", newUser });
});

const verifyEmail = (req, res, next) => {
  const { token } = req.params;

  jwt.verify(
    token,
    process.env.VRIFAYCODE,
    handelAsync(async (err, decode) => {
      if (err) return next(new appError(err.message, 404));

      const { email } = decode;
      const updated = await userModel.findOneAndUpdate(
        { email, confirmed: false },
        { confirmed: true },
        { new: true }
      );
      if (updated) {
        res.json({ message: "vrified successfuly" });
      } else {
        next(new appError("already vrified", 409));
      }
    })
  );
};

const signIn = handelAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const checkUser = await userModel.findOne({ email });

  if (checkUser) {
    const matchedpassword = await bcrypt.compare(password, checkUser.password);
    if (matchedpassword) {
      if (matchedpassword && !checkUser.confirmed)
        return next(new appError("verify Frist", 401));
      if (matchedpassword && checkUser.loggedIn)
        return next(new appError("already loggedIn", 409));
      const token = jwt.sign({ checkUser }, process.env.TOKENKEY);
      await userModel.findOneAndUpdate({ email }, { loggedIn: true });
      return res.json({ message: "loggedIN", token });
    } else {
      return next(new appError("wrong password", 404));
    }
  } else {
    return next(new appError("Rehister First", 409));
  }
});

const forgetPassword = handelAsync(async (req, res, next) => {
  const { email } = req.body;

  const nanoid = customAlphabet("0123456789", 6);
  let code = nanoid();
  const user = await userModel.findOne({ email });
  if (user) {
    await userModel.findOneAndUpdate({ email }, { forgetcode: code });
    sendEmailForget({ email, code });
    res.json({ message: "done" });
  } else {
    return next(new appError("not founded email", 404));
  }
});
const resetPassword = handelAsync(async (req, res, next) => {
  const { email, code, password } = req.body;
  const user = await userModel.findOne({ email });
  if (user && user.forgetcode !== "") {
    if (user.forgetcode === code) {
      const hash = await bcrypt.hash(password, +process.env.SLATROUND);
      await userModel.findOneAndUpdate(
        { email },
        { password: hash, forgetcode: "" }
      );
      res.json({ message: "done" });
    } else {
      return next(new appError("invalid Code", 404));
    }
  } else {
    return next(new appError("not founded email", 404));
  }
});
export { signUp, verifyEmail, signIn, forgetPassword, resetPassword };
