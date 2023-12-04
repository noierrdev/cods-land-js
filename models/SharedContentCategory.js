const mongoose=require('mongoose')
const schema=mongoose.Schema;

const SharedContentCategorySchema=new schema({
    title:{
        type:String
    },
    description:{
        type:String
    }
},{
    timestamps:true
})

const SharedContentCategory=mongoose.model('SharedContentCategory',SharedContentCategorySchema);
module.exports=SharedContentCategory;