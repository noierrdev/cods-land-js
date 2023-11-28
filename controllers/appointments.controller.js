const models=require('../models')

exports.saveEvent=(req,res)=>{
    if(!req.userId) return  res.json({status:"error",error:"AUTH_ERROR"});
    const newEvent=new models.Event({
        title:req.body.title,
        description:req.body.description,
        start:req.body.start,
        end:req.body.end,
        location:req.body.location,
    });
    newEvent.save()
    .then(()=>res.json({status:"success"}))
    .catch((e)=>res.json({status:"error",error:"SAVE_FAILED"}));
}

exports.allEvents=(req,res)=>{
    if(!req.userId) return  res.json({status:"error",data:"AUTH_ERROR"});
    models.Event.find({},{title:1,description:1,start:1,end:1,logo:1})
    .then(gotEvents=>res.json({status:"success",data:gotEvents}))
    .catch(e=>res.json({status:'error',error:"DB_ERROR"}))
}

exports.saveAppointmentType=(req,res)=>{
    if(!req.userId) return  res.json({status:"error",error:"AUTH_ERROR"});
    const newAppointmentType=new models.AppointmentType({
        title:req.body.title,
        price:req.body.price,
        length:req.body.length
    });
    newAppointmentType.save()
    .then(()=>res.json({status:"success"}))
    .catch((e)=>res.json({status:"error",error:"SAVE_FAILED"}));
}

exports.allAppointmentTypes=(req,res)=>{
    if(!req.userId) return  res.json({status:"error",data:"AUTH_ERROR"});
    models.AppointmentType.find({},{title:1,price:1,start:1,length:1})
    .then(gotAppointmentTypes=>res.json({status:"success",data:gotAppointmentTypes}))
    .catch(e=>res.json({status:'error',error:"DB_ERROR"}))
}

exports.saveAppointment=async (req,res)=>{
    if(!req.userId) return  res.json({status:"error",error:"AUTH_ERROR"});
    const gotEvent=await models.Event.findById(req.body.event);
    if(!gotEvent) return res.json({status:"error",data:"NO_EVENT"});
    const gotAppointmentType=await models.Event.findById(req.body.appointmenttype);
    if(!gotAppointmentType) return res.json({status:"error",data:"NO_APPOINTMENTTYPE"});
    const newAppointment=new models.Appointment({
        user:req.userId,
        type:req.body.appointmenttype,
        event:req.body.event,
        time:req.body.time,
    });
    newAppointment.save()
    .then(()=>res.json({status:"success"}))
    .catch((e)=>res.json({status:"error",error:"SAVE_FAILED"}));
}