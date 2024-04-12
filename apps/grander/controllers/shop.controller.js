const models=require("../../../models");
const grander_models=require("../models");
const stripe=require('stripe')(process.env.STRIPE_KEY)
var shippo = require('shippo')(process.env.SHIPPO_KEY);
const path=require('path')


exports.pageProducts=(req,res)=>{
    const page=req.body.page;
    const pagesize=req.body.pagesize;
    models.Product.find({},{
        title:true,
        image_url:true,
        description:true,
        createdAt:true,
        price:true,
        count:true,
        category_1:true,
        category_2:true,
        category_3:true,
        public:true,
        width:true,
        length:true,
        height:true,
        weight:true
    }).skip(page*pagesize).limit(pagesize).populate("category_1 category_2 category_3","title")
    .then(async gotProducts=>{
        const totalNumbers=await models.Product.countDocuments({}).lean().exec();
        const total=Math.ceil(totalNumbers/pagesize);
        return res.json({status:"success",data:{
            pagedata:gotProducts,
            page,
            pagesize,
            totalNumbers,
            total
        }})
    })
}
exports.pageGranderProducts=(req,res)=>{
    const page=req.body.page;
    const pagesize=req.body.pagesize;
    grander_models.GranderProduct.find({public:true},{
        title:true,
        image_url:true,
        description:true,
        createdAt:true,
        product_no:true,
        price:true,
        category:true,
    }).skip(page*pagesize).limit(pagesize)
    .then(async gotProducts=>{
        const totalNumbers=await grander_models.GranderProduct.countDocuments({public:true}).lean().exec();
        const total=Math.ceil(totalNumbers/pagesize);
        return res.json({status:"success",data:{
            pagedata:gotProducts,
            page,
            pagesize,
            totalNumbers,
            total
        }})
    })
}
exports.saveGranderProduct=(req,res)=>{
    const title=req.body.title;
    const description=req.body.description;
    const price=req.body.price;
    const sugg_retail=req.body.sugg_retail;
    const reseller_price=req.body.reseller_price;
    const image_url=req.body.image_url;
    const image=req.files?req.files.image:null;
    const product_no=req.body.product_no;
    const category=req.body.category;
    const public=req.body.public;
    const newProduct=new grander_models.GranderProduct({
        title,
        description,
        price,
        sugg_retail,
        reseller_price,
        image_url,
        image,
        product_no,
        category,
        public
    });
    newProduct.save()
    .then(()=>res.json({status:"success"}))
    .catch((e)=>res.json({status:"error",error:e}))
}
exports.deleteGranderProduct=(req,res)=>{
    const id=req.params.id;
    grander_models.GranderProduct.findByIdAndRemove(id)
    .then(()=>res.json({status:"success"}))
    .catch((e)=>res.json({status:"success",error:e}))
}
exports.updateGranderProduct=(req,res)=>{
    const id=req.params.id;
    const {...data}=req.body;
    grander_models.GranderProduct.findByIdAndUpdate(id,{
        $set:{
            ...data
        }
    })
    .then(()=>res.json({status:"success"}))
    .catch(e=>res.json({status:"error",error:e}))
}
exports.getGranderProduct=(req,res)=>{
    const id=req.params.id;
    grander_models.GranderProduct.findById(id)
    .then(gotProduct=>{
        return res.json({status:'success',data:gotProduct})
    })
    .catch(e=>res.json({status:"error",error:e}))
}

exports.getGranderProductImage=(req,res)=>{
    const product=req.params.id;
    models.GranderProduct.findById(product,{image:true})
    .then(gotImage=>{
        if(!gotImage.image) return res.setHeader("Content-Type","image/png").sendFile(path.resolve(__dirname,"../../../static/images/default-product.png"))
        return res.setHeader("Content-Type",gotImage.image.mimetype).send(gotImage.image.data.buffer);
    })
    .catch(e=>res.json({status:"error",error:e}))
}

exports.saveOrder=(req,res)=>{
    
}
exports.pageOrder=(req,res)=>{
    const page=req.body.page;
    const pagesize=req.body.pagesize;
    grander_models
}
exports.saveGranderOrder=(req,res)=>{

}

exports.deleteGranderOrder=(req,res)=>{

}

exports.selectShippingRate=(req,res)=>{

}
exports.sendShippingRequest=(req,res)=>{

}

