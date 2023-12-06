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
    allow:{
        type:Boolean
    },
    creditcard:{
        type:String
    }
},{
    timestamps:true
})

const Member=mongoose.model('Member',MemberSchema);
module.exports=Member;