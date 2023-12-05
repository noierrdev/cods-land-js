const models=require('../models');
const jwt=require('jsonwebtoken');
const brevo=require('@getbrevo/brevo')
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
            avatar:req.files?req.files.upload:null
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
    const tokenEncoded=jwt.sign(tokenDetail,process.env.AUTH_KEY,);
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

exports.forgotPassword=async (req,res)=>{
    const email=req.body.email;
    const gotUser=await models.User.findOne({email:email}).lean().exec();
    if(!gotUser) return res.json({status:"error",error:"NO_USER"})
    await models.Token.deleteMany({user:gotUser.id});
    const tokenDetail={
        email:gotUser.email
    };
    const tokenEncoded=jwt.sign(tokenDetail,process.env.AUTH_KEY,);
    const otp=String(parseInt(Math.random()*10))+String(parseInt(Math.random()*10))+String(parseInt(Math.random()*10))+String(parseInt(Math.random()*10))
    const newToken=new models.Token({
        user:gotUser._id,
        token:tokenEncoded,
        otp:otp
    });
    newToken.save()
    .then(()=>{
        return res.json({status:"success",data:otp})
        // let defaultClient = brevo.ApiClient.instance;
        // let apiKey = defaultClient.authentications['api-key'];
        // apiKey.apiKey = process.env.BREVO_KEY;
        // let apiInstance = new brevo.TransactionalEmailsApi();
        // let sendSmtpEmail = new brevo.SendSmtpEmail();
        // sendSmtpEmail.subject = "Forgot Password";
        // sendSmtpEmail.htmlContent = `
        // <html>
        //     <body>
        //         <h2>Following OTP code is valid for ${process.env.JWT_PERIOD} minutes.</h2>
        //         <h1>
        //             ${otp}
        //         </h1>
        //     </body>
        // </html>`;
        // sendSmtpEmail.sender = { "name": "Cods.Land", "email": "noierrdev@gmail.com" };
        // sendSmtpEmail.to = [

        //     {
        //     "email": email, "name": gotUser.fullname
        //     }
        // ];
        // sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
        // sendSmtpEmail.params = { "parameter": "My param value", "subject": "common subject" };


        // apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
        //     return res.json({ status: "success", data: data });
        // }, function (error) {
        //     return res.json({ status: "error",error:error });
        // });
    })
    .catch((e)=>res.json({status:"error",error:e}))
};
exports.resetPassword=async (req,res)=>{
    const otp=req.body.otp;
    const password=req.body.password;
    const gotToken=await models.Token.findOne({otp:otp}).populate('user','fullname');
    if(!gotToken) return res.json({ status: "error",error:"INVALID_OTP" });
    if((Date.now()-gotToken.lastactive)>(60*1000*process.env.JWT_PERIOD)) return res.json({ status: "error",error:"EXPIRED" });
    models.User.findById(gotToken.user._id)
    .then(async (gotUser)=>{
        gotUser.password=password;
        await models.Token.deleteMany({user:gotUser._id});
        gotUser.save()
        .then(()=>res.json({status:"success"}))
        .catch(e=>res.json({status:"error",error:e})) 
    })
    .catch(e=>res.json({status:"error",error:e}))
}

exports.verifyOTP=async (req,res)=>{
    const otp=req.body.otp;
    const gotToken=await models.Token.findOne({otp:otp});
    if(!gotToken) return res.json({status:"error",error:"NO_TOKEN"});
    if((Date.now()-gotToken.lastactive)>(60*1000*process.env.JWT_PERIOD)) return res.json({ status: "error",error:"EXPIRED" });
    return res.json({status:"success"})
}