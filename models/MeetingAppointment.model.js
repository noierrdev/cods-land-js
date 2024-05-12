const mongoose=require('mongoose')

const schema=mongoose.Schema;

const MeetingAppointmentSchema=new schema({
    // user:{
    //     type:schema.ObjectId,
    //     ref:"User"
    // },
    // type:{
    //     type:schema.ObjectId,
    //     ref:"AppointmentType",
    //     default:null
    // },
    // event:{
    //     type:schema.ObjectId,
    //     ref:"Event",
    //     default:null
    // },
    email:{
        type:String
    },
    fullname:{
        type:String
    },
    phone:{
        type:String
    },
    address:{
        type:String
    },
    zip:{
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
    from:{
        type:Number
    },
    to:{
        type:Number,
    },
    // time:{
    //     type:Date
    // },
    // from:{
    //     type:Date
    // },
    // to:{
    //     type:Date
    // },
    detail:{
        type:String
    },
    status:{
        type:String,
        default:"pending"
    }
},
{
    timestamps: true,
});

const MeetingAppointment=mongoose.model('MeetingAppointment',MeetingAppointmentSchema)
module.exports=MeetingAppointment;