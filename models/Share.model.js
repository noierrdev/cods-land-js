const mongoose=require('mongoose');
const schema=mongoose.Schema;

const ShareSchema=new schema({
    content:{
        type:schema.ObjectId,
        ref:"SharedContent"
    },
    user:{
        type:schema.ObjectId,
        ref:"User"
    },
},{
    timestamps:true
});
const Share=mongoose.model('Share',ShareSchema)
module.exports=Share;