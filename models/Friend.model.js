const mongoose =require('mongoose')
const schema=mongoose.Schema;

const FriendSchema=new schema({
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

const Friend=mongoose.model('Friend',FriendSchema);
module.exports=Friend;