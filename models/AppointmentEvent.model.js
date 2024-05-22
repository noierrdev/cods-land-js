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
        type:Number,
        min:0,
        max:24
    },
    end_time:{
        type:Number,
        min:0,
        max:24
    },
    location:{
        type:String
    },
    start_dow:{
        type:Number,
        min:0,
        max:6
    },
    phonenumber:{
        type:String
    },
    end_dow:{
        type:Number,
        min:0,
        max:6
    },
    repeat:{
        type:Boolean,
        default:false
    }
},
{
    timestamps: true,
});
const AppointmentEvent=mongoose.model('AppointmentEvent',AppointmentEventSchema);
module.exports=AppointmentEvent;