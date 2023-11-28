const mongoose=require('mongoose')

const schema=mongoose.Schema;

const NotificationSchema=new schema({
    from:{
        type:schema.ObjectId,
        ref:"User"
    },
    type:{
        type:String,
        default:"follow"
    },
    detail:{
        type:Object,
        default:null
    },
    to:{
        type:schema.ObjectId,
        ref:"User"
    }
},
{
    timestamps: true,
});
const Notification=mongoose.model('Notification',NotificationSchema)
module.exports=Notification;