const models=require('../models');

exports.saveCategory=(req, res)=>{
    const title=req.body.title;
    const description=req.body.description;
    const newCategory=new models.ProductCategory({
        title:title,
        description:description
    });
    newCategory.save()
    .then(()=>res.json({status:"success"}))
    .catch(e=>res.json({status:"error"}))
}

exports.deleteCategory=(req,res)=>{
    const category=req.params.category_id;
    models.ProductCategory.findByIdAndDelete(category)
    .then(()=>res.json({status:"success"}))
    .catch(e=>res.json({status:"error"}))
}
exports.allCategories=(req,res)=>{
    models.ProductCategory.find()
    .then(gotCategories=>res.json({status:"success",data:gotCategories}))
    .catch(e=>res.json({status:"error",error:e}))
}
exports.productsPage=(req,res)=>{
    const page=req.body.page;
    const pagesize=req.body.pagesize;
    models.Product.find().skip(page*pagesize).limit(pagesize).populate('category')
    .then(async gotProducts=>{
        const totalNumbers=await models.Product.countDocuments().lean().exec();
        const total=Math.ceil(totalNumbers/pagesize);
        return res.json({status:"success",data:{
            pagedata:gotProducts,
            page,
            pagesize,
            totalNumbers,
            total
        }})
    })
    .catch(e=>res.json({status:"error",error:e}))
}

exports.saveProduct=(req,res)=>{
    const title=req.body.title;
    const description=req.body.description;
    const price=req.body.price;
    const image=req.files?req.files.image:null;
    const category=req.body.category;
    const newProduct=new models.Product({
        title:title,
        description:description,
        category:category?category:null,
        price:price,
        detail:req.body.detail?req.body.detail:null,
        image:image?image:null
    });
    newProduct.save()
    .then(()=>res.json({status:"success"}))
    .catch(e=>res.json({status:"error",error:e}))
}

exports.getProduct=(req,res)=>{
    const product=req.params.product_id;
    models.Product.findById(product).populate('category')
    .then(gotProduct=>res.json({status:"success",data:gotProduct}))
    .catch(e=>res.json({status:"error",error:e}))
}

exports.deleteProduct=(req,res)=>{
    const product=req.params.product_id;
    models.Product.findByIdAndDelete(product).populate('category')
    .then(()=>res.json({status:"success"}))
    .catch(e=>res.json({status:"error",error:e}))
}

exports.categoryPage=(req,res)=>{
    const category=req.params.category_id;
    const page=req.body.page;
    const pagesize=req.body.pagesize;
    models.Product.find({category:category}).skip(page*pagesize).limit(pagesize).populate('category')
    .then(async gotProducts=>{
        const totalNumbers=await models.Product.countDocuments({category:category}).skip(page*pagesize).limit(pagesize).lean().exec()
        const total=Math.ceil(totalNumbers);
        return res.json({status:"success",data:{
            pagedata:gotProducts,
            page,
            pagesize,
            totalNumbers,
            total
        }})
    })
    .catch(e=>res.json({status:"error",error:e}))
}

exports.addToCart=(req,res)=>{
    if(!req.userId) return res.json({status:"error",error:"AUTH_ERROR"});
    const product=req.body.product;
    const count=req.body.count;
    const newCartProduct=new models.CartProduct({
        user:req.userId,
        product:product,
        count:count?count:1
    });
    newCartProduct.save()
    .then(()=>res.json({status:"success"}))
    .catch(e=>res.json({status:"error",error:e}))
}
exports.setCartCount=(req,res)=>{
    // if(!req.userId) return res.json({status:"error",error:"AUTH_ERROR"});
    const product=req.params.cartproduct_id;
    const count=req.body.count;
    models.CartProduct.findByIdAndUpdate(product,{
        count:count
    })
    .then(()=>res.json({status:"success"}))
    .catch(e=>res.json({status:"error",error:e}))
}

exports.deleteCartProduct=(req,res)=>{
    const product=req.params.cartproduct_id;
    models.CartProduct.findByIdAndDelete(product)
    .then(()=>res.json({status:"success"}))
    .catch(e=>res.json({status:"error",error:e}))
}

exports.countOfCartProducts=(req,res)=>{
    if(!req.userId) return res.json({status:"error",error:"AUTH_ERROR"});
    models.CartProduct.countDocuments({user:req.userId})
    .then(gotCount=>res.json({status:"success",data:gotCount}))
    .catch(e=>res.json({status:"error",error:e}))
}

exports.myCart=(req,res)=>{
    if(!req.userId) return res.json({status:"error",error:"AUTH_ERROR"});
    models.CartProduct.find({user:req.userId}).populate('product')
    .then(gotProducts=>res.json({status:"success",data:gotProducts}))
    .catch(e=>res.json({status:"error",error:e}))
}

exports.productImage=(req,res)=>{
    const product=req.params.product_id;
    models.Product.findById(product,{image:true})
    .then(gotImage=>{
        return res.setHeader("Content-Type",gotImage.image.mimetype).send(gotImage.image.data.buffer);
    })
    .catch(e=>res.json({status:"error",error:e}))
}