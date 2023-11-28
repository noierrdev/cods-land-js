const mongoose=require('mongoose')

const schema=mongoose.Schema;

const AppointmentTypeSchema=new schema({
    name:{
        type:String
    },
    price:{
        type:Number
    },
    length:{
        type:Number
    }
},
{
    timestamps: true,
});
const AppointmentType=mongoose.model('AppointmentType',AppointmentTypeSchema)
module.exports=AppointmentType;