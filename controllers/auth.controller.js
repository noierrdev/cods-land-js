const models=require('../models');
const jwt=require('jsonwebtoken');

exports.signup=async (req,res)=>{
    try {
        const gotUser=await models.User.findOne({email:req.body.email});
        if(gotUser) return res.json({status:"error",error:"ALREADY_EXIST"});
        const newUser=new models.User({
            fullname:req.body.fullname,
            email:req.body.email,
            gender:req.body.gender,
            birthday:req.body.birthday,
            city:req.body.city,
            country:req.body.country,
            password:req.body.password, 
        })
        newUser.save()
        .then(()=>{
            return res.json({status:"success"});
        })
        .catch(e=>{
            return res.json({status:"error",error:"CREATION_ERROR"})
        })
    } catch (error) {
        return  res.status(500).json({status:"error",error:"DB_ERROR"});
    }
}

exports.signin=async (req,res)=>{
    const gotUser=await models.User.findOne({email:req.body.email});
    if(!gotUser) return res.json({status:"error",error:"NO_USER"});
    if(!gotUser.allow) return res.json({status:"error",error:"BLOCKED_USER"});
    if(!gotUser.comparePassword(req.body.password)) return res.json({status:"error",error:"WRONG_PASSWORD"});
    if(!gotUser.verified) return res.json({status:"error",error:"NOT_VERIFIED_USER"});
    const gotToken=await models.Token.findOne({user:gotUser._id});
    //delete existing token
    if(gotToken) await models.Token.findByIdAndDelete(gotToken._id);
    //prepare for a new token
    const tokenDetail={
        email:gotUser.email
    };
    const tokenEncoded=jwt.sign(tokenDetail,process.env.AUTH_KEY,{expiresIn:60*parseInt(process.env.JWT_PERIOD)});
    const newToken=new models.Token({
        user:gotUser._id,
        token:tokenEncoded
    });
    newToken.save()
    .then(()=>res.json({status:"success",data:{
        fullname:gotUser.fullname,
        token:tokenEncoded,
        email:gotUser.email
    }}))
    .catch((e)=>res.json({status:"error",error:e}))
}

exports.signout=(req,res)=>{
    const token=req.headers.token;
    models.Token.deleteOne({token:token})
    .then(()=>res.json({status:"success"}))
    .catch(e=>res.json({status:"error",error:e}))
}

exports.verify=(req,res)=>{
    if(req.userId)
    return res.json({
        status:"success",
        data:{
            fullname:req.fullname,
            email:req.email,
            token:req.headers.token
        }
    });
    else return res.json({status:"error",data:"AUTH_ERROR"})
}