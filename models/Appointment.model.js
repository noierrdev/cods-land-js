const mongoose=require('mongoose')

const schema=mongoose.Schema;

const AppointmentSchema=new schema({
    user:{
        type:schema.ObjectId,
        ref:"User"
    },
    type:{
        type:schema.ObjectId,
        ref:"AppointmentType"
    },
    event:{
        type:schema.ObjectId,
        ref:"Event"
    },
    time:{
        type:String
    }
},
{
    timestamps: true,
});
const Appointment=mongoose.model('Appointment',AppointmentSchema)
module.exports=Appointment;