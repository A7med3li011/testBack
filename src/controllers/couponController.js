import couponModle from "../../db/models/coupon.js";
import appError from "../service/handlers/errorHandle.js";
import { handelAsync } from "../service/handlers/handelAsync.js";

export const createCoupon = handelAsync(async (req, res, next) => {
  const { code } = req.body;

  const couponIsExist = await couponModle.findOne({ code });
  if (couponIsExist) return next(new appError("Coupon is already exist", 409));

  const newCoupon = await couponModle.create({
    ...req.body,
    createdBy: req.user._id,
  });

  res.json({ message: "success", newCoupon });
});

export const updateCoupon = handelAsync(async (req, res, next) => {
  const { id } = req.params;
  const { code, amount, fromDate, toDate } = req.body;

  const coupon = await couponModle.findByIdAndUpdate(
    { _id: id },
    { code, amount, fromDate, toDate },
    { new: true }
  );
  if (!coupon) return next(new appError("Coupon not exist", 404));

  

  res.json({ message: "success", coupon });
});
