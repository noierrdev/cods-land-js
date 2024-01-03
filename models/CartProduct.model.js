const mongoose=require('mongoose')

const schema=mongoose.Schema;

const CartProductSchema=new schema({
    user:{
        type:schema.ObjectId,
        ref:"User"
    },
    product:{
        type:schema.ObjectId,
        ref:"Product"
    },
    count:{
        type:Number
    }
},
{
    timestamps: true,
});
const CartProduct=mongoose.model('CartProduct',CartProductSchema)
module.exports=CartProduct;