const mongoose=require('mongoose')

const schema=mongoose.Schema;

const ProductSchema=new schema({
    title:{
        type:String,
    },
    category:{
        type:schema.ObjectId,
        ref:'ProductCategory',
        default:null
    },
    category_1:{
        type:schema.ObjectId,
        ref:'ProductCategory',
        default:null,
    },
    category_2:{
        type:schema.ObjectId,
        ref:'ProductCategory',
        default:null,
    },
    category_3:{
        type:schema.ObjectId,
        ref:'ProductCategory',
        default:null,
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
    public:{
        type:Boolean,
        default:false
    },
    category1:{
        type:String
    },
    category2:{
        type:String
    },
    category3:{
        type:String
    },
    weight:{
        type:Number,
    },
    length:{
        type:Number
    },
    height:{
        type:Number
    },
    
},
{
    timestamps: true,
});
const Product=mongoose.model('Product',ProductSchema)
module.exports=Product;