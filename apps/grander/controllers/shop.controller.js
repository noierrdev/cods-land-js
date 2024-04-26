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
exports.pageGranderOrders=(req,res)=>{
    const page=req.body.page;
    const pagesize=req.body.pagesize;
    grander_models.GranderOrder.find().populate('products.product','title description price image_url').skip(page*pagesize).limit(pagesize).lean().exec()
    .then(async gotOrders=>{
        const totalNumbers=await grander_models.GranderOrder.countDocuments();
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
exports.saveGranderOrder=(req,res)=>{
    const gotCartProducts=req.body.products;
    var orderProducts=[];
    var totalPrice=0;
    gotCartProducts.forEach((oneCartProduct)=>{
        orderProducts.push({
            product:oneCartProduct._id,
            count:oneCartProduct.count
        });
        totalPrice+=oneCartProduct.product.price*oneCartProduct.count
    });
    const newOrder=new grander_models.GranderOrder({
        fullname:req.body.fullname,
        email:req.body.email,
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
            
        });
    })
    .catch(e=>res.json({status:"error",error:"SAVE_FAILED"}))
}

exports.deleteGranderOrder=(req,res)=>{
    const id=req.params.id;
    grander_models.GranderOrder.findByIdAndDelete(id)
    .then(()=>res.json({status:"success"}))
    .catch(()=>res.json({status:"error",error:e}))
}

exports.selectShippingRate=(req,res)=>{
    const rate=req.body.rate;
    const order_id=req.body.order_id;  
    grander_models.GranderOrder.findByIdAndUpdate(order_id,{$set:{shipping_rate:rate}})
    .then(()=>{
        return res.json({status:"success"})
    }).catch((err)=>res.json({status:"error",error:err}))  
};
exports.sendShippingRequest=(req,res)=>{
    const order_id=req.body.order;
    grander_models.GranderOrder.findById(order_id)
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
            grander_models.GranderOrder.findByIdAndUpdate(order_id,{$set:{shipping_transaction:transaction,accepted:true}})
            .then(()=>{
                return res.json({status:"success",data:transaction})
            }).catch((err)=>res.json({status:"error",error:err}))  
        })
    })
    .catch(e=>res.json({status:"error",error:e}))
}

exports.purchase=(req,res)=>{
    const order_id=req.body.order;
    models.Order.findByIdAndUpdate(order_id,{$set:{purchase_info:req.body,paid:true}})
    .then(()=>{
        return res.json({status:"success"})
    })
    .catch(e=>res.json({status:"error",error:e}))
}

