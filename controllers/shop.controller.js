const models=require('../models');
const stripe=require('stripe')(process.env.STRIPE_KEY)
var shippo = require('shippo')(process.env.SHIPPO_KEY);
const brevo=require('@getbrevo/brevo');
const path=require('path')
const axios =require('axios')
const {Storage}=require('megajs');
const fs = require('fs');

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
exports.pageCategories=(req,res)=>{
    const page=req.body.page;
    const pagesize=req.body.pagesize;
    models.ProductCategory.find({}).sort({title:1}).skip(page*pagesize).limit(pagesize)
    .then(async gotProductCategories=>{
        const totalNumbers=await models.ProductCategory.countDocuments().lean().exec();
        const total=Math.ceil(totalNumbers/pagesize);
        return res.json({status:"success",data:{
            pagedata:gotProductCategories,
            page,
            pagesize,
            totalNumbers,
            total
        }})
    })
    .catch(e=>res.json({status:"error",error:e}))
}
exports.deleteCategory=(req,res)=>{
    const category=req.params.category_id;
    models.ProductCategory.findByIdAndDelete(category)
    .then(()=>res.json({status:"success"}))
    .catch(e=>res.json({status:"error"}))
}
exports.allCategories=(req,res)=>{
    models.ProductCategory.find().sort({title:1})
    .then(gotCategories=>res.json({status:"success",data:gotCategories}))
    .catch(e=>res.json({status:"error",error:e}))
}
exports.productsPage=(req,res)=>{
    const page=req.body.page;
    const pagesize=req.body.pagesize;
    const category=req.body.category;
    const search=req.body.search;
    const searchFilter=new RegExp(search,"i");
    var filter={};
    if(category) filter={
        ...filter,
        $or:[
            {category_1:category},
            {category_2:category},
            {category_3:category}
        ]
    }
    if(search) filter={
        ...filter,
        $or:[
            {title:searchFilter},
            {description:searchFilter}
        ]
    }
    models.Product.find(filter,{
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
    }).sort({createdAt:-1}).skip(page*pagesize).limit(pagesize).populate('category category_1 category_2 category_3','title')
    .then(async gotProducts=>{
        const totalNumbers=await models.Product.countDocuments(filter).lean().exec();
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
exports.editProduct=(req,res)=>{
    const {id, ...others}=req.body;
    models.Product.findByIdAndUpdate(id,{$set:{...others}})
    .then(()=>{
        return res.json({status:"success"})
    })
    .catch((e)=>res.json({status:"error",error:e}))
}
const getMegaSession=async (fileObj)=>{
    try {
        // Create a new Storage instance and wait for it to be ready
        const storage = await new Storage({
          email: process.env.MEGA_EMAIL,
          password: process.env.MEGA_PASSWORD
        }).ready;
    
        // Log the buffer from fileObj
        // console.log(storage.upload);
    
        // Upload the file to MEGA
        const uploadResult = await storage.upload(
          { name: fileObj.name, size: fileObj.size },
          Buffer.from(fileObj.data)
        ).complete;
    
        console.log('Upload Result:', uploadResult);
      } catch (error) {
        console.error('Error uploading file to MEGA:', error);
      }
}

exports.saveProduct=async (req,res)=>{
    const title=req.body.title;
    const description=req.body.description;
    const price=req.body.price;
    const image=req.files?req.files.image:null;
    const category=req.body.category;
    const category_1=req.body.category_1;
    const category_2=req.body.category_2;
    const category_3=req.body.category_3;
    const video=req.files?req.files.video:null;
    const images=req.files?req.files.images:null;

    // await getMegaSession(image)
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
            .then(async (savedProduct)=>{
                if(images.length)
                images.forEach(async (oneProductImage)=>{
                    const newProductImage=new models.ProductImage({
                        product:savedProduct._id,
                        image:oneProductImage
                    })
                    await newProductImage.save()
                })
                else if(images){
                    const newProductImage=new models.ProductImage({
                        product:savedProduct._id,
                        image:images
                    })
                    await newProductImage.save()
                }
                return res.json({status:"success"})
            })
            .catch(e=>res.json({status:"error",error:e}))
        })
    }else{
        const newProduct=new models.Product({
            title:title,
            description:description,
            category:category?category:null,
            category_1:category_1?category_1:null,
            category_2:category_2?category_2:null,
            category_3:category_3?category_3:null,
            length:req.body.length,
            width:req.body.width,
            height:req.body.height,
            weight:req.body.weight,
            public:req.body.public,
            price:price,
            detail:req.body.detail?req.body.detail:null,
            image:image?image:null,
            count:req.body.count?req.body.count:null
        });
        newProduct.save()
        .then(async (savedProduct)=>{
            if(images.length)
            images.forEach(async (oneProductImage)=>{
                const newProductImage=new models.ProductImage({
                    product:savedProduct._id,
                    image:oneProductImage
                })
                await newProductImage.save()
            })
            else if(images){
                const newProductImage=new models.ProductImage({
                    product:savedProduct._id,
                    image:images
                })
                await newProductImage.save()
            }
            return res.json({status:"success"});
        })
        .catch(e=>res.json({status:"error",error:e}))
    }
    
}

exports.getProduct=(req,res)=>{
    const product=req.params.product_id;
    models.Product.findById(product).populate('category category_1 category_2 category_3','title')
    .then(gotProduct=>res.json({status:"success",data:gotProduct}))
    .catch(e=>res.json({status:"error",error:e}))
}
exports.getProductImages=(req,res)=>{
    const product=req.params.id;
    models.ProductImage.find({product:product},{image:false})
    .then(gotImages=>{
        if(!gotImages) return res.json({status:'error',error:"NO_IMAGES"})
        return res.json({status:"success",data:gotImages});
    })
    .catch(e=>res.json({status:"error",error:e}))
}
exports.getProductImage=(req,res)=>{
    const id=req.params.id;
    models.ProductImage.findById(id,{image:true})
    .then(gotImage=>{
        if(!gotImage) return res.json({status:'error',error:"NO_IMAGE"})
        return res.setHeader("Content-Type",gotImage.image.mimetype).send(gotImage.image.data.buffer);
    })
    .catch(e=>res.json({status:"error",error:e}))
}
exports.addProductImage=(req,res)=>{
    const image=req.files.image;
    const product=req.body.product;
    const newProductImage=new models.ProductImage({
        image:image,
        product:product
    });
    newProductImage.save()
    .then(()=>{
        return res.json({status:"success"});
    })
    .catch(e=>res.json({status:"error",error:e}))
}
exports.deleteProductImage=(req,res)=>{
    const id=req.params.id;
    models.ProductImage.findByIdAndDelete(id,{image:true})
    .then(()=>{
        return res.json({status:"success"});
    })
    .catch(e=>res.json({status:"error",error:e}))
}
exports.deleteProduct=(req,res)=>{
    const product=req.params.product_id;
    models.Product.findByIdAndDelete(product)
    .then(()=>res.json({status:"success"}))
    .catch(e=>res.json({status:"error",error:e}))
}

exports.categoryPage=(req,res)=>{
    const category=req.params.category_id;
    const page=req.body.page;
    const pagesize=req.body.pagesize;
    models.Product.find({$or:[
        {category_1:category},
        {category_2:category},
        {category_3:category},
    ]}).sort({createdAt:-1}).skip(page*pagesize).limit(pagesize).populate('category category_1 category_2 category_3','title')
    .then(async gotProducts=>{
        const totalNumbers=await models.Product.countDocuments({$or:[
            {category_1:category},
            {category_2:category},
            {category_3:category},
        ]}).lean().exec()
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
        if(!gotImage.image) return res.setHeader("Content-Type","image/png").sendFile(path.resolve(__dirname,"../static/images/default-product.png"))
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
            address:req.body.location?req.body.location:"Earth",
            street:req.body.street,
            city:req.body.city,
            state:req.body.state,
            country:req.body.country,
            phone:req.body.phone,
            zip:req.body.zip,
            shipingDate: req.body.date,
            paid:false,
            accepted:false,
        });
        newOrder.save()
        .then(async (gotOrder)=>{
            console.log(gotOrder)
            await models.CartProduct.deleteMany({user:req.userId});
            var addressFrom  = {
                "name": process.env.SHIPPO_NAME,
                "street1": process.env.SHIPPO_STREET1,
                "city": process.env.SHIPPO_CITY,
                "state": process.env.SHIPPO_STATE,
                "zip": process.env.SHIPPO_ZIP,
                "country": process.env.SHIPPO_COUNTRY,
                "phone":process.env.SHIPPO_PHONE,
            };
            
            var addressTo = {
                "name": req.fullname,
                "street1": req.body.street,
                "city": req.body.city,
                "state": req.body.state,
                "zip": req.body.zip,
                "country": req.body.country,
                "phone":req.body.phone
            };
            
            var parcel = {
                "length": "5",
                "width": "5",
                "height": "5",
                "distance_unit": "in",
                "weight": "2",
                "mass_unit": "lb"
            };
            
            shippo.shipment.create({
                "address_from": addressFrom,
                "address_to": addressTo,
                "parcels": [parcel],
                "async": false
            },async function(err, shipment){
                if (err) {
                    return res.status(500).send({
                        status: "error",
                        message: err
                    });
                }
                let defaultClient = brevo.ApiClient.instance;
                let apiKey = defaultClient.authentications['api-key'];
                apiKey.apiKey = process.env.BREVO_KEY;
                let apiInstance = new brevo.TransactionalEmailsApi();
                let sendSmtpEmail = new brevo.SendSmtpEmail();
                sendSmtpEmail.subject = "New Order Arrived from "+req.email;
                sendSmtpEmail.htmlContent = `
                <html>
                    <body>
                        <h2>New order arrived form ${req.email}</h2>
                        <h2>The Id of new order is ${gotOrder._id}</h2>
                        <h2>The address of buyer is ${req.body.street} ${req.body.city} ${req.body.state} ${req.body.country}</h2>
                        ${
                            gotCartProducts.map((oneProduct)=>{
                                return `
                                <img width="100" src="https://cods.land/api/shop/products/${oneProduct.product._id}/image" />
                                <h3>${oneProduct.product.title}(${oneProduct.product._id})X${oneProduct.count}</h3>
                                `
                            })
                        }
                        <a href="http://cods.land:3001/" ><h2>Cods.Land-shopping-admin</h2></a>
                    </body>
                </html>`;
                sendSmtpEmail.sender = { "name": "Cods.Land", "email": "info@cods.land" };
                sendSmtpEmail.to = [

                    {
                        "email": "noierrdev@proton.me", "name": "Vander Moleker"
                    },
                    {
                        "email": "noierrdev@gmail.com", "name": "Vander Moleker"
                    },
                    {
                        "email": "ncrdean@gmail.com", "name": "Dean Howell"
                    },
                    {
                        "email": "dean@cods.land", "name": "Dean Howell"
                    }
                ];
                sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
                sendSmtpEmail.params = { "parameter": "My param value", "subject": "common subject" };


                apiInstance.sendTransacEmail(sendSmtpEmail).then(async function (data) {
                    // return res.json({ status: "success", data: data });
                    await models.Order.findByIdAndUpdate(gotOrder._id,{$set:{shipping_info:shipment}});
                    return res.json({status:"success",data:{
                        ...shipment,
                        order_id:gotOrder._id,
                        email:data
                    }})
                }, function (error) {
                    return res.json({ status: "error",error:error });
                });
                
                // return res.json({status:"success",data:{
                //     ...shipment,
                //     order_id:gotOrder._id,
                // }})
                
            });
        })
        .catch(e=>res.json({status:"error",error:"SAVE_FAILED"}))
    })
}

exports.myOrders=(req,res)=>{
    if(!req.userId) return res.json({status:'error',error:"AUTH_ERROR"});
    models.Order.find({user:req.userId}).populate('products.product user','image_url email fullname title description price')
    .then(gotOrders=>{
        return res.json({status:"success",data:gotOrders})
    })
    .catch(e=>res.json({status:"error",error:"DB_ERROR"}))
}

exports.pageOrders=(req,res)=>{
    
    const page=req.body.page;
    const pagesize=req.body.pagesize;
    models.Order.find().populate('user products.product','fullname email title description price image_url').skip(page*pagesize).limit(pagesize).lean().exec()
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




exports.acceptOrder=async (req,res)=>{
    const order_id=req.body.order;
    const gotOrder=await models.Order.findById(order_id).populate('user','fullname').exec();
    var addressFrom  = {
        "name": process.env.SHIPPO_NAME,
        "street1": process.env.SHIPPO_STREET1,
        "city": process.env.SHIPPO_CITY,
        "state": process.env.SHIPPO_STATE,
        "zip": process.env.SHIPPO_ZIP,
        "country": process.env.SHIPPO_COUNTRY,
        "phone":process.env.SHIPPO_PHONE,
    };
    
    var addressTo = {
        "name": gotOrder.user.fullname,
        "street1": gotOrder.street&&gotOrder.street,
        "city": gotOrder.city&&gotOrder.city,
        "state": gotOrder.state&&gotOrder.state,
        "zip": gotOrder.zip&&gotOrder.zip,
        "country": gotOrder.country&&gotOrder.country,
        "phone":gotOrder.phone&&gotOrder.phone
    };
    
    var parcel = {
        "length": "5",
        "width": "5",
        "height": "5",
        "distance_unit": "in",
        "weight": "2",
        "mass_unit": "lb"
    };
    
    shippo.shipment.create({
        "address_from": addressFrom,
        "address_to": addressTo,
        "parcels": [parcel],
        "async": false
    }, function(err, shipment){
        if (err) {
            console.error("Error creating shipment:", err);
            return res.status(500).send({
                status: "error",
                message: "Error creating shipment"
            });
        }
    
        var rate = shipment.rates[3];
        console.log(shipment)
        shippo.transaction.create({
            "rate": rate.object_id,
            "label_file_type": "PDF",
            "async": false
        }, function(err, transaction) {
            if (err) {
                console.error("Error creating transaction:", err);
                return res.status(500).send({
                    status: "error",
                    message: "Error creating transaction"
                });
            }
            
            models.Order.findByIdAndUpdate(order_id,{$set:{accepted:true,shipping_transaction:transaction}},{new:true}).
            then(()=>{
                return res.send({
                    status: "success",
                    transaction: transaction,
                    shipment: shipment
                });
            }).catch(e=>res.json({status:"error",error:e}))
            
        });
    });
    
}



exports.selectShipmentRate=(req,res)=>{
    const rate=req.body.rate;
    const order_id=req.body.order_id;  
    models.Order.findByIdAndUpdate(order_id,{$set:{shipping_rate:rate}})
    .then(()=>{
        return res.json({status:"success"})
    }).catch((err)=>res.json({status:"error",error:err}))  
};

exports.sendShippingRequest=(req,res)=>{
    const order_id=req.body.order;
    models.Order.findById(order_id)
    .then(gotOrder=>{
        if(!gotOrder.shipping_rate) return res.json({status:"error",error:"NO_SELECTED_SHIPMENT_RATE"});
        shippo.transaction.create({
            "rate": gotOrder.shipping_rate.object_id,
            "label_file_type": "PDF",
            "async": false
        }, function(err, transaction) {
            if (err) {
                console.error("Error creating transaction:", err);
                return res.status(500).send({
                    status: "error",
                    message: "Error creating transaction"
                });
            }
            if(transaction.status!="SUCCESS") return res.json({status:"error",data:transaction})
            models.Order.findByIdAndUpdate(order_id,{$set:{shipping_transaction:transaction,accepted:true}})
            .then(()=>{
                return res.json({status:"success",data:transaction})
            }).catch((err)=>res.json({status:"error",error:err}))  
        })
    })
    .catch(e=>res.json({status:"error",error:e}))
}

exports.purchase=(req,res)=>{
    const order_id=req.body.order;
    models.Order.findByIdAndUpdate(order_id,{$set:{purchase_info:req.body}})
    .then(()=>{
        return res.json({status:"success"})
    })
    .catch(e=>res.json({status:"error",error:e}))
}