const mongoose=require("mongoose");

const schema=mongoose.Schema;

const GranderProductSchema=new schema({
    title:{
        type:String
    },
    price:{
        type:Number,
        null:true
    },
    category:{
        type:String,
        null:true
    },
    product_no:{
        type:String,
        null:true
    },
    public:{
        type:Boolean
    },
    sugg_retail:{
        type:Number,
        null:true
    },
    reseller_price:{
        type:Number,
        null:true
    },
    description:{
        type:String,
        default:""
    },
    image:{
        type:Object,
        null:true
    },
    image_url:{
        type:String,
        null:true
    },

},{
    timestamps:true
})
const GranderProduct=mongoose.model("GranderProduct",GranderProductSchema);
module.exports=GranderProduct;