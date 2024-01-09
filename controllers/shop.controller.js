const models=require('../models');
const stripe=require('stripe')(process.env.STRIPE_KEY)

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
    models.Product.find({},{title:true,description:true,createdAt:true,price:true,count:true,}).skip(page*pagesize).limit(pagesize).populate('category')
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
    const video=req.files?req.files.video:null
    if(video){
        video.mv(path.resolve(__dirname,"../temp",video.md5),async ()=>{
            const newProduct=new models.Product({
                title:title,
                description:description,
                category:category?category:null,
                price:price,
                detail:req.body.detail?req.body.detail:null,
                image:image?image:null,
                video:{
                    name:video&&video.filename,
                    size:video&&video.length,
                    md5:video&&video.md5,
                    mimetype:video&&video.mimetype
                }
            });
            newProduct.save()
            .then(()=>res.json({status:"success"}))
            .catch(e=>res.json({status:"error",error:e}))
        })
    }else{
        const newProduct=new models.Product({
            title:title,
            description:description,
            category:category?category:null,
            price:price,
            detail:req.body.detail?req.body.detail:null,
            image:image?image:null,
            count:req.body.count?req.body.count:null
        });
        newProduct.save()
        .then(()=>res.json({status:"success"}))
        .catch(e=>res.json({status:"error",error:e}))
    }
    
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
    return models.CartProduct.find({user:req.userId,product:req.body.product}).lean().exec()
    .then(async gotCartProducts=>{
        if(gotCartProducts.length==0){
            const newCartProduct=new models.CartProduct({
                user:req.userId,
                product:product,
                count:count?count:1
            });
            return newCartProduct.save()
            .then(()=>res.json({status:"success"}))
            .catch(e=>res.json({status:"error",error:e}))
        }else{
            models.CartProduct.findByIdAndUpdate(gotCartProducts[0]._id,{ $inc: { count: count?count:1 } })
            .then(()=>res.json({status:"success"}))
            .catch(e=>res.json({status:"error",error:e}))
        }
    })
    .catch(e=>res.json({status:"error",error:"DB_ERROR"}))
    
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
    models.CartProduct.find({user:req.userId})
    .populate('product')
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

exports.saveOrder=(req,res)=>{
    if(!req.userId) return res.json({status:'error',error:"AUTH_ERROR"});
    models.CartProduct.find({user:req.userId},{_id:true,product:true,count:true}).populate('product').lean().exec()
    .then(gotCartProducts=>{
        if(gotCartProducts==[]) return res.json({status:"error",error:"EMPTY_CART"})
        var orderProducts=[];
        var totalPrice=0;
        gotCartProducts.forEach((oneCartProduct)=>{
            orderProducts.push({
                product:oneCartProduct.product,
                count:oneCartProduct.count
            });
            totalPrice+=oneCartProduct.product.price*oneCartProduct.count
        });
        const newOrder=new models.Order({
            user:req.userId,
            products:orderProducts,
            price:totalPrice,
            detail:req.body.detail?req.body.detail:null,
            paid:true
        });
        newOrder.save()
        .then(async ()=>{
            await models.CartProduct.deleteMany({user:req.userId});
            return res.json({status:"success"})
        })
        .catch(e=>res.json({status:"error",error:"SAVE_FAILED"}))
    })
}

exports.myOrders=(req,res)=>{
    if(!req.userId) return res.json({status:'error',error:"AUTH_ERROR"});
    models.Order.find({user:req.userId}).populate('products.product user','email fullname title description price')
    .then(gotOrders=>{
        return res.json({status:"success",data:gotOrders})
    })
    .catch(e=>res.json({status:"error",error:"DB_ERROR"}))
}

exports.pageOrders=(req,res)=>{
    const page=req.body.page;
    const pagesize=req.body.pagesize;
    models.Order.find().populate('user products.product','fullname email title description price').skip(page*pagesize).limit(pagesize).lean().exec()
    .then(async gotOrders=>{
        const totalNumbers=await models.Order.countDocuments();
        const total=Math.ceil(totalNumbers/pagesize)
        return res.json({status:"success",data:{
            pagedata:gotOrders,
            page:page,
            pagesize:pagesize,
            total,
            totalNumbers
        }})
    })
    .catch(e=>res.json({status:"error",error:"DB_ERROR"}))
}

exports.getOrder=(req,res)=>{
    const order=req.params.order_id;
    models.Order.findById(order).populate('user products.product','fullname email title description price')
    .then(gotOrder=>res.json({status:'success',data:gotOrder}))
    .catch(e=>res.json({status:"error",error:"DB_ERROR"}))
}
exports.deleteOrder=(req,res)=>{
    const order=req.params.order_id;
    models.Order.findByIdAndDelete(order)
    .then(()=>res.json({status:'success'}))
    .catch(e=>res.json({status:"error",error:"DB_ERROR"}))
}

exports.startPayment=async (req,res)=>{
    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.price,
        currency: 'usd',
      });
    
      return res.send({
        status:"success",
        data:{
            clientSecret: paymentIntent.client_secret,
        } 
      });
}

