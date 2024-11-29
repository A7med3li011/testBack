import  mongoose from "mongoose" 

const userSchema = new mongoose.Schema({
        name:{
            type:String,
            require:[true,"Name is required"],
            minLength:3,
            maxLength:15,
            trim:true

        },
        email:{
            type:String,
            require:[true,"Name is required"],
            trim:true,
            unique:true,
            lowecase:true,

        },
        password:{
            type:String,
            require:[true,"Name is required"],
            trim:true,
           
        },
        age:{
            type:Number,
            require:[true,"Name is required"],
            
        },
        phone:[String],
        address:[String],
        confirmed:{
            type:Boolean,
            default:false
        },
        loggedIn:{
            type:Boolean,
            default:false
        },
        role:{
            type:String,
            enum:["admin","user"],
            default:"user"
        },
        wishList:[{
            type:mongoose.Types.ObjectId,
            ref:"product"
        }],
        
        forgetcode:String


})

const userModel = mongoose.model("User",userSchema)


export default userModel