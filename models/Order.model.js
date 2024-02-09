const mongoose=require('mongoose')

const schema=mongoose.Schema;

const OrderSchema=new schema({
    user:{
        type:schema.ObjectId,
        ref:"User"
    },
    products:[
        {
            product:{
                type:schema.ObjectId,
                ref:"Product"
            },
            count:{
                type:Number
            }
        },
    ],
    price:{
        type:Number
    },
    paid:{
        type:Boolean
    },
    address:{
        type:String
    },
    status:{
        type:String
    },
    detail:{
        type:Object
    }
},{
    timestamps:true
});


const Order=mongoose.model("Order",OrderSchema)
module.exports=Order;