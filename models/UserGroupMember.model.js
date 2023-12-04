const mongoose =require('mongoose')
const schema=mongoose.Schema;

const UserGroupMemberSchema=new schema({
    group:{
        type:schema.ObjectId,
        ref:"UserGroup"
    },
    user:{
        type:schema.ObjectId,
        ref:"User"
    }
},{
    timestamps:true
});

const UserGroupMember=mongoose.model('UserGroupMember',UserGroupMemberSchema);
module.exports=UserGroupMember;