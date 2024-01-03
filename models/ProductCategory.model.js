const mongoose=require('mongoose')

const schema=mongoose.Schema;

const ProductCategorySchema=new schema({
    title:{
        type:String
    },
    description:{
        type:String
    }
},{
    timestamps:true
});

const ProductCategory=mongoose.model("ProductCategory",ProductCategorySchema)
module.exports=ProductCategory;