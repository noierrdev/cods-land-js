const mongoose=require('mongoose')

const schema=mongoose.Schema;

const AppointmentEventSchema=new schema({
    title:{
        type:String
    },
    description:{
        type:String
    },
    start_date:{
        type:Date
    },
    end_date:{
        type:Date
    },
    start_time:{
        type:Date
    },
    end_time:{
        type:Date
    },
    location:{
        type:String
    },
},
{
    timestamps: true,
});
const AppointmentEvent=mongoose.model('AppointmentEvent',AppointmentEventSchema)
module.exports=AppointmentEvent;