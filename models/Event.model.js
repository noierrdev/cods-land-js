const mongoose=require('mongoose')

const schema=mongoose.Schema;

const EventSchema=new schema({
    title:{
        type:String
    },
    description:{
        type:String
    },
    start:{
        type:String
    },
    end:{
        type:String
    },
    location:{
        type:String
    },
    logo:{
        type:Object,
        default:null
    }
},
{
    timestamps: true,
});
const Event=mongoose.model('Event',EventSchema)
module.exports=Event;