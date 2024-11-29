import appError from "./errorHandle.js"

export const handelAsync = fn =>{
    return (req,res,next)=>{
        fn(req,res,next).catch(err=> next(new appError(err.message,400)))
    }
}