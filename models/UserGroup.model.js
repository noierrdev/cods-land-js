const mongoose =require('mongoose')
const schema=mongoose.Schema;

const UserGroupSchema=new schema({
    title:{
        type:String
    },
    description:{
        type:String
    },
    logo:{
        type:Object
    }
},{
    timestamps:true
});

const UserGroup=mongoose.model('UserGroup',UserGroupSchema);
module.exports=UserGroup;