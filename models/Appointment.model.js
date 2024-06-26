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
    detail:{
        type:String
    },
    name:{
        type:String
    },
    address:{
        type:String
    },
    location:{
        type:String
    },
    year:{
        type:Number,
        default:2023
    },
    month:{
        type:Number,
        default:12
    },
    day:{
        type:Number
    },
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
    },
    accepted:{
        type:Boolean,
        default:false
    }
},
{
    timestamps: true,
});

const Appointment=mongoose.model('Appointment',AppointmentSchema)
module.exports=Appointment;