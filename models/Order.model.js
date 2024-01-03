const mongoose=require('mongoose')

const schema=mongoose.Schema;

const OrderSchema=new schema({
    user:{
        type:schema.ObjectId,
        ref:"User"
    },
    products:[
        {
            type:schema.ObjectId,
            ref:"CartProduct"
        },
    ]
},{
    timestamps:true
});

const Order=mongoose.model("Order",OrderSchema)
module.exports=Order;