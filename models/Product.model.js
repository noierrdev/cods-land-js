const mongoose=require('mongoose')

const schema=mongoose.Schema;

const ProductSchema=new schema({
    title:{
        type:String,
    },
    category:{
        type:schema.ObjectId,
        ref:'ProductCategory'
    },
    description:{
        type:String
    },
    price:{
        type:Number
    },
    detail:{
        type:Object,
        default:null
    },
    image:{
        type:Object
    },
    video:{
        type:Object
    },
    image_url:{
        type:String
    },
    count:{
        type:Number
    },
    category1:{
        type:String
    },
    category2:{
        type:String
    },
    category3:{
        type:String
    }
},
{
    timestamps: true,
});
const Product=mongoose.model('Product',ProductSchema)
module.exports=Product;