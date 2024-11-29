import Joi from "joi";
import mongoose from "mongoose";

const SchemaSignUp = Joi.object({
  name: Joi.string().min(3).max(25).required(),
  password: Joi.string().required().min(5).max(50),
  phone: Joi.array()
    .items(Joi.string().pattern(/^(01[0125])[0-9]{8}$/))
    .required(),

  age: Joi.number().min(15).max(80).required(),
  email: Joi.string().email().required(),

  address: Joi.array().items(Joi.string()),
});
const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(5).max(50),
});

const addCategorySchemaBody = Joi.object({
  name: Joi.string().min(3).max(30).required(),
});

const addCategorySchemaFile = Joi.object({
  fieldname: Joi.string().required(),
  originalname: Joi.string().required(),
  encoding: Joi.string().required(),
  mimetype: Joi.string().required(), // Restrict MIME types
  filename: Joi.string().required(), // Restrict MIME types
  destination: Joi.string().required(), // Restrict MIME types
  path: Joi.string().required(), // Restrict MIME types
  size: Joi.number().positive().required(), // Max size of 5MB
});
const addSubCategorySchemaFile = Joi.array()
  .length(1)
  .items(
    Joi.object({
      fieldname: Joi.string().required(),
      originalname: Joi.string().required(),
      encoding: Joi.string().required(),
      mimetype: Joi.string()
        .required()
        .custom((value, helper) => {
          if (!value.startsWith("image")) {
            return helper.message("invalid image");
          }
        }), // Restrict MIME types
      filename: Joi.string().required(), // Restrict MIME types
      destination: Joi.string().required(), // Restrict MIME types
      path: Joi.string().required(), // Restrict MIME types
      size: Joi.number().positive().required(), // Max size of 5MB
    }).required()
  );

const addsubCategoryBody = Joi.object({
  name: Joi.string().required().min(4).max(30),
});

const createBrandSChemabody = Joi.object({
  name: Joi.string().required().min(3).max(15),
});

const createBrandFiles = Joi.array()
  .length(1)
  .items(
    Joi.object({
      fieldname: Joi.string().required(),
      originalname: Joi.string().required(),
      encoding: Joi.string().required(),
      mimetype: Joi.string()
        .required()
        .custom((value, helper) => {
          if (!value.startsWith("image")) {
            return helper.message("invalid image");
          }
        }), // Restrict MIME types
      filename: Joi.string().required(), // Restrict MIME types
      destination: Joi.string().required(), // Restrict MIME types
      path: Joi.string().required(), // Restrict MIME types
      size: Joi.number().positive().required(), // Max size of 5MB
    }).required()
  );

const createprodutSchema = {
  body: Joi.object({
    title: Joi.string().required().min(3),
    description: Joi.string().min(3),
    price: Joi.number().required().positive(),
    discount: Joi.number().min(1).max(100),

    stock: Joi.number().min(1).max(100).positive().integer(),
    category: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helpers.message("Invalid category Id");
        }
      }),
    subCategory: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helpers.message("Invalid subCategory Id");
        }
      }),
    brand: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helpers.message("Invalid brand Id");
        }
      }),
  }),
};

const createProductFile = Joi.object({
  image: Joi.array()
    .length(1)
    .items(
      Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string()
          .required()
          .custom((value, helper) => {
            if (!value.startsWith("image")) {
              return helper.message("invalid image");
            }
          }), // Restrict MIME types
        filename: Joi.string().required(), // Restrict MIME types
        destination: Joi.string().required(), // Restrict MIME types
        path: Joi.string().required(), // Restrict MIME types
        size: Joi.number().positive().required(),
      }).required()
    )
    .required(),
  coverImages: Joi.array()
    .max(3)
    .min(1)
    .items(
      Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string()
          .required()
          .custom((value, helper) => {
            if (!value.startsWith("image")) {
              return helper.message("invalid image");
            }
          }), // Restrict MIME types
        filename: Joi.string().required(), // Restrict MIME types
        destination: Joi.string().required(), // Restrict MIME types
        path: Joi.string().required(), // Restrict MIME types
        size: Joi.number().positive().required(),
      }).required()
    )
    .required(),
});

const createCouponSChema = Joi.object({
  code: Joi.string().required().min(3).max(30),

  amount: Joi.number().required().min(1).max(100).integer().positive(),
  fromDate: Joi.date().required().greater(Date.now()),

  toDate: Joi.date().required().greater(Joi.ref("fromDate")),
});
const updateCouponSChema = Joi.object({
  code: Joi.string().min(3).max(30),

  amount: Joi.number().min(1).max(100).integer().positive(),
  fromDate: Joi.date().greater(Date.now()),

  toDate: Joi.date().greater(Joi.ref("fromDate")),
});
const addtocartSchema = Joi.object({
  productId: Joi.string()
    .required()
    .custom((value, helper) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helper.message("invalid product id");
      }
    }),
  quantity: Joi.number().required().positive().integer(),
});

const orderSchema = Joi.object({
  productId: Joi.string().custom((value, helper) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helper.message("invalid product id");
    }
  }),
  address: Joi.string().required(),
  phone: Joi.string().required(),
  cuoponCode: Joi.string().min(3),
  quantity: Joi.number().positive().integer(),
  paymnetMethod: Joi.string().valid("cash", "card").required(),
});

const createReviewSchema = Joi.object({
  rate: Joi.number().required().positive().integer().min(1).max(5),

  comment: Joi.string().required().min(3),
});
export {
  createReviewSchema,
  orderSchema,
  addtocartSchema,
  updateCouponSChema,
  createProductFile,
  createCouponSChema,
  SchemaSignUp,
  signInSchema,
  addCategorySchemaBody,
  addCategorySchemaFile,
  addSubCategorySchemaFile,
  addsubCategoryBody,
  createBrandSChemabody,
  createBrandFiles,
  createprodutSchema,
};
