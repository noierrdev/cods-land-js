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
    street:{
        type:String
    },
    city:{
        type:String
    },
    state:{
        type:String
    },
    country:{
        type:String
    },
    zip:{
        type:String
    },
    label:{
        type:String
    },
    phone:{
        type:String
    },
    shipping_info:{
        type:Object
    },
    accepted:{
        type:Boolean,
        default:false
    },
    shipped:{
        type:Boolean,
        default:false
    },
    detail:{
        type:Object
    },
    shipingDate:{
        type:Date,
    }
},{
    timestamps:true
});


const Order=mongoose.model("Order",OrderSchema)
module.exports=Order;