import appError from "../service/handlers/errorHandle.js";
import {
  addCategorySchemaBody,
  addCategorySchemaFile,
  addsubCategoryBody,
  addSubCategorySchemaFile,
  SchemaSignUp,
  signInSchema,
  createBrandSChemabody,
  createBrandFiles,
  createprodutSchema,
  createProductFile,
  createCouponSChema,
  updateCouponSChema,
  addtocartSchema,
  orderSchema,
  createReviewSchema,
} from "./validationSchema.js";

const validationSignUp = (req, res, next) => {
  const { error, value } = SchemaSignUp.validate(req.body, {
    abortEarly: false,
  });
  if (error) return next(new appError(error.message, 400));
  next();
};

const validationSignIn = (req, res, next) => {
  const { error, value } = signInSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) return next(new appError(error.message, 400));
  next();
};

const validationCreatecategorybody = (req, res, next) => {
  const { error, value } = addCategorySchemaBody.validate(req.body);

  if (error) return next(new appError(error.message, 400));
  next();
};
const validationaddsubCategoryBody = (req, res, next) => {
  const { error, value } = addsubCategoryBody.validate(req.body);

  if (error) return next(new appError(error.message, 400));
  next();
};
const validationCreatecategoryFile = (req, res, next) => {
  const { error, value } = addCategorySchemaFile.validate(req.file);

  if (error) return next(new appError(error.message, 400));
  next();
};
const validationCreateSubcategoryFile = (req, res, next) => {
  const { error, value } = addSubCategorySchemaFile.validate(req.files);

  if (error) return next(new appError(error.message, 400));
  next();
};

const validationCreateBrandBody = (req, res, next) => {
  const { error } = createBrandSChemabody.validate(req.body);

  if (error) next(new appError(error.message, 400));
  next();
};
const validationCreateBrandFiles = (req, res, next) => {
  const { error } = createBrandFiles.validate(req.files);

  if (error) next(new appError(error.message, 400));

  next();
};

const validationCreateProduct = (req, res, next) => {
  const { error } = createprodutSchema.body.validate(req.body, {
    abortEarly: false,
  });
  if (error) return next(new appError(error.message, 400));

  next();
};

const vv = (req, res, next) => {
  const { error } = createProductFile.validate(req.files, {
    abortEarly: false,
  });
  if (error) return next(new appError(error.message, 400));
  next();
};

const couponValidation = (req, res, next) => {
  const { error } = createCouponSChema.validate(req.body,{abortEarly:false});
  if (error) return next(new appError(error.message, 400));
  next();
};
const UpdateCouponValidation = (req, res, next) => {
  const { error } = updateCouponSChema.validate(req.body,{abortEarly:false});
  if (error) return next(new appError(error.message, 400));
  next();
};
const addtocartValidate = (req, res, next) => {
  const { error } = addtocartSchema.validate(req.body,{abortEarly:false});
  if (error) return next(new appError(error.message, 400));
  next();
};
const orderValidate = (req, res, next) => {
  const { error } = orderSchema.validate(req.body,{abortEarly:false});
  if (error) return next(new appError(error.message, 400));
  next();
};
const reviewValidate = (req, res, next) => {
  const { error } = createReviewSchema.validate(req.body,{abortEarly:false});
  if (error) return next(new appError(error.message, 400));
  next();
};
export {
  reviewValidate,
  orderValidate,
  addtocartValidate,
  UpdateCouponValidation,
  couponValidation,
  vv,
  validationCreateProduct,
  validationSignUp,
  validationSignIn,
  validationCreatecategorybody,
  validationCreatecategoryFile,
  validationCreateSubcategoryFile,
  validationaddsubCategoryBody,
  validationCreateBrandBody,
  validationCreateBrandFiles,
};
