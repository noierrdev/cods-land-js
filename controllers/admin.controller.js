const models=require('../models')
const jwt=require('jsonwebtoken')

const getMegaSession=async ()=>{
    try {
        const response = await axios.post('https://eu.api.mega.co.nz/cs', {
            a: 'us',
            user: process.env.MEGA_EMAIL, // Replace with your MEGA email
            uh: process.env.MEGA_PASSWORD, // Replace with your MEGA password
            });
        
            return response.data[0];
        } catch (error) {
        console.error('Error obtaining session ID:', error.response.data);
        throw new Error('Failed to obtain session ID');
    }
}

exports.adminSignIn=async (req,res)=>{
    const gotUser=await models.User.findOne({email:req.body.email},{superuser:1,fullname:1,_id:1,email:1,allow:1,verified:1,password:1});
    if(!gotUser) return res.json({status:"error",error:"NO_USER"});
    if(!gotUser.allow) return res.json({status:"error",error:"BLOCKED_USER"});
    if(!gotUser.comparePassword(req.body.password)) return res.json({status:"error",error:"WRONG_PASSWORD"});
    if(!gotUser.verified) return res.json({status:"error",error:"NOT_VERIFIED_USER"});
    if(!gotUser.superuser) return res.json({status:"error",error:"NOT_SUPERUSER"})
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

exports.usersPage=(req,res)=>{
    const page=req.body.page;
    const pagesize=req.body.pagesize;
    models.User.find({},
        {
            email:true,
            neonid:true,
            superuser:true,
            allow:true,
            verified:true,
            gender:true,
            city:true,
            fullname:true,
            country:true,
            createdAt:true
        })
    .skip(page*pagesize).limit(pagesize)
    .then(async gotUsers=>{
        const totalNumbers=await models.User.countDocuments();
        const total=Math.ceil(totalNumbers/pagesize);
        return res.json({status:"success",data:{
            pagedata:gotUsers,
            page:page,
            pagesize:pagesize,
            totalNumbers,
            total
        }})
    })
    .catch(e=>res.json({status:"error",error:e}))
}

exports.deleteUser=(req,res)=>{
    models.User.findByIdAndDelete(req.params.user_id)
    .then(()=>{
        return res.json({status:"success"})
    })
    .catch(e=>res.json({status:"error",error:e}))
}
exports.uploadCSV=async (req,res)=>{
    //name
    //sku
    //subtitle
    //description
    //category1
    //category2
    //category3
    //image
    //ribbon
    //ribbonColor
    //weight
    //price
    //recommended_price
    //quantity
    //enabled
    //taxClassCode
    //shipping_freight
    //fixed_shipping_rate_only
    //shippingType
    //shippingMethodMarkup
    //shippingFlatRate
    //shippingDisabledMethods
    //shippingEnabledMethods
    //upc
    //brand
    //seo_title
    //seo_description
    //product_url
    //product_id
    const csvFile=req.files.csv;
    const csvData=String(csvFile.data).split("\n");
    csvData.splice(0,1);
    console.log(csvData.length)
    for(var oneLine of csvData){
        var oneProduct=oneLine.split(";cartdata;,");
        // var image_url=oneProduct[7];
        var image_possible=oneProduct.find((oneFiled)=>oneFiled.includes('https://d2j6dbq0eux0bg.cloudfront.net/images/'))
        const oneNewProduct=new models.Product({
            title:oneProduct[0],
            description:oneProduct[3],
            image_url:image_possible?image_possible:"",
            price:Number(oneProduct[11])?Number(oneProduct[11]):0,
            detail:{raw:oneProduct},
        })
        await oneNewProduct.save()

    }
    return res.json({status:"success"})
}