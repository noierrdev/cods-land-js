const mongoose=require('mongoose')

const schema=mongoose.Schema;

const ProductSchema=new schema({
    title:{
        type:String,
    },
    category:{
        type:String,
    },
    description:{
        type:String
    },
    detail:{
        type:Object,
        default:null
    },
    image:{
        type:Object
    }
},
{
    timestamps: true,
});
const Product=mongoose.model('Product',ProductSchema)
module.exports=Product;