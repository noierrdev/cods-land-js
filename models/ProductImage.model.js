const mongoose=require('mongoose')

const schema=mongoose.Schema;

const ProductImageSchema=new schema({
    product:{
        type:schema.ObjectId,
        ref:"Product"
    },
    image:{
        type:Object
    }
},{
    timestamps:true
});

const ProductImage=mongoose.model("ProductImage",ProductImageSchema)
module.exports=ProductImage;