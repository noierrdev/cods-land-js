const mongoose=require('mongoose')

const schema=mongoose.Schema;

const FollowingSchema=new schema({
    follower:{
        type:schema.ObjectId,
        ref:"User"
    },
    followed:{
        type:schema.ObjectId,
        ref:"User"
    }
},{timestamps:true})
const Following=mongoose.model('Following',FollowingSchema);
module.exports=Following;