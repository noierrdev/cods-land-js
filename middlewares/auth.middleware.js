const models=require('../models')
const jwt=require('jsonwebtoken')
module.exports=async (req,res,next)=>{
    const token=req.headers.token;
    if(!token) return  next();
    const gotToken=await models.Token.findOne({ token:token});
    if(!gotToken) return next();
    try {
        const tokenDetail=jwt.verify(token,process.env.AUTH_KEY);
        const gotUser=await models.User.findById(gotToken.user);
        req.userId=gotUser._id;
        req.email=gotUser.email;
        req.fullname=gotUser.fullname;
        return next();
    } catch (error) {
        console.log(error)
        return next()
    }
}