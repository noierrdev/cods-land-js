const mongoose=require('mongoose')

const schema=mongoose.Schema;

const AppointmentSchema=new schema({
    user:{
        type:schema.ObjectId,
        ref:"User"
    },
    type:{
        type:schema.ObjectId,
        ref:"AppointmentType",
        default:null
    },
    // event:{
    //     type:schema.ObjectId,
    //     ref:"Event",
    //     default:null
    // },
    time:{
        type:Date
    },
    from:{
        type:Date
    },
    to:{
        type:Date
    },
    status:{
        type:String,
        default:"pending"
    }
},
{
    timestamps: true,
});
const Appointment=mongoose.model('Appointment',AppointmentSchema)
module.exports=Appointment;