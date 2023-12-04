const mongoose=require('mongoose')

const schema=mongoose.Schema;

const LikeSchema=new schema({
    content:{
        type:schema.ObjectId,
        ref:"SharedContent"
    },
    user:{
        type:schema.ObjectId,
        ref:"User"
    }
},{
    timestamps:true
});

const Like=mongoose.model("Like",LikeSchema)
module.exports=Like;