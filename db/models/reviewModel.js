





import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
  comment:{
    type: 'string',
    required:true
  },
  createBy:{
    type:mongoose.Types.ObjectId,
    ref:"User",
    required:true
  },
  productId:{
    type:mongoose.Types.ObjectId,
    ref:"product",
    required:true
  },
  rate:{
    type:Number,
    required:true
  }
  
});

const reviewModel = mongoose.model("review", orderSchema);

export default reviewModel;
