const mongoose=require('mongoose')
const schema=mongoose.Schema;

const MemberSchema=new schema({
    user:{
        type:schema.ObjectId,
        ref:"User"
    },
    type:{
        type:String
    },
    fullname:{
        type:String
    },
    birthday:{
        type:String
    },
    email:{
        type:String
    },
    phonenumber:{
        type:String
    },
    gender:{
        type:String
    },
    billing:{
        type:String
    },
    shipping:{
        type:String
    },
    allow:{
        type:Boolean,
        default:true
    },
    creditcard:{
        type:String
    },
    expired:{
        type:Date,
    }
},{
    timestamps:true
})

const Member=mongoose.model('Member',MemberSchema);
module.exports=Member;