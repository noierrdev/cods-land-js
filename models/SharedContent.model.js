const mongoose =require('mongoose')
const schema=mongoose.Schema;

const SharedContentSchema=new schema({
    title:{
        type:String
    },
    category:{
        type:schema.ObjectId,
        ref:"SharedContentCategory"
    },
    content:{
        type:String
    },
    description:{
        type:String
    },
    media:{
        type:Object
    },
    author:{
        type:schema.ObjectId,
        ref:"User"
    },
    type:{
        type:String
    },
    likes:{
        type:Number,
        default:0
    },
    shares:{
        type:Number,
        default:0
    }
},{
    timestamps:true
});

const SharedContent=mongoose.model('SharedContent',SharedContentSchema);
module.exports=SharedContent;