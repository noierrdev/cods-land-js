const mongoose=require("mongoose");
const schema=mongoose.Schema;

const GranderOrderSchema=new schema({
    products:[
        {
            type:schema.ObjectId,
            ref:"GranderProduct"
        }
    ],
    user:{
        type:schema.ObjectId,
        ref:"User"
    },
    price:{
        type:Number
    },
    shipping_order:{
        type:Object
    },
    shipping_rates:{
        type:Object
    },
    
    shipping_transaction:{
        type:Object
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
    phone:{
        type:String
    }
},{
    timestamps:true
});

const GranderOrder=mongoose.model("GranderOrder",GranderOrderSchema);
module.exports=GranderOrder;