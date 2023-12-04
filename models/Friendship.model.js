const mongoose =require('mongoose')
const schema=mongoose.Schema;

const FriendshipSchema=new schema({
    from:{
        type:schema.ObjectId,
        ref:"User"
    },
    to:{
        type:schema.ObjectId,
        ref:"User"
    },
    allow:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
});

const Friendship=mongoose.model('Friendship',FriendshipSchema);
module.exports=Friendship;