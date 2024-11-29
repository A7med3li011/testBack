



import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema({
  user:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
  },
  products:[{
  productId:{type:mongoose.Types.ObjectId,required:true,ref:"product"},
    quantity:{type:Number,required:true}
  }]
});

const cartModel = mongoose.model("cart", cartSchema);

export default cartModel;
