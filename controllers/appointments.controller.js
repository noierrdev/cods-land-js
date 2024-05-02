const models=require('../models')

exports.saveAppointmentType=(req,res)=>{
    // if(!req.userId) return  res.json({status:"error",error:"AUTH_ERROR"});
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
    // if(!req.userId) return  res.json({status:"error",data:"AUTH_ERROR"});
    models.AppointmentType.find({},{title:1,price:1,start:1,length:1})
    .then(gotAppointmentTypes=>res.json({status:"success",data:gotAppointmentTypes}))
    .catch(e=>res.json({status:'error',error:"DB_ERROR"}))
}

exports.saveAppointment=async (req,res)=>{
    if(!req.userId) return  res.json({status:"error",error:"AUTH_ERROR"});
    const gotAppointmentType=await models.AppointmentType.findById(req.body.appointmenttype);
    if(!gotAppointmentType) return res.json({status:"error",data:"NO_APPOINTMENTTYPE"});
    const untilTime=req.body.time+gotAppointmentType.length;
    const alreayExist=await models.Appointment.findOne({
        $or:[
            {
                $and:[
                    {
                        from:{$lt:req.body.from}
                    },
                    {
                        to:{$gt:req.body.from}
                    },
                ]
            },
            {
                $and:[
                    {
                        from:{$lt:untilTime}
                    },
                    {
                        to:{$gt:untilTime}
                    },
                ]
            },
            {
                $and:[
                    {
                        from:{$gt:req.body.from},
                        to:{$lt:untilTime}
                    }
                ]
            }
        ]
    });

    if(alreayExist.length>0) return res.json({status:"error",error:"ALREADY_OCCUPIED"})
    
    const newAppointment=new models.Appointment({
        user:req.userId,
        type:req.body.appointmenttype,
        time:req.body.time,
        from:req.body.time,
        to:to
    });
    newAppointment.save()
    .then(()=>res.json({status:"success"}))
    .catch((e)=>res.json({status:"error",error:"SAVE_FAILED"}));
}

exports.getAppointment=async (req,res)=>{
    if(!req.userId) return  res.json({status:"error",error:"AUTH_ERROR"});
    const appointmentId=req.params.id;
    const gotAppointment=await models.Appointment.findById(appointmentId).populate('type');
    if(!gotAppointment) return res.json({status:"error",error:"NO_APPOINTMENT"})
    return res.json({status:"success",data:gotAppointment});
}

exports.pageAppointment=(req,res)=>{
    if(!req.userId) return  res.json({status:"error",error:"AUTH_ERROR"});
    const page= req.body.page;
    const pagesize= req.body.pagesize;
    models.Appointment.find({user:req.userId}).skip(pagesize*page).limit(pagesize)
    .then(gotAppointments=>{
        return res.json({status:"success",data:gotAppointments})
    })
    .catch(e=>res.json({status:"error",error:"DB_ERROR"}))
}
exports.completeAppointment=(req,res)=>{
    if(!req.userId) return res.json({status:"error",error:"AUTH_ERROR"});
    if(!req.superadmin) return res.json({status:"error",error:"ACCESS_DENIED"});
    models.Appointment.findByIdAndUpdate(req.params.id,{
        status:'completed'
    })
    .then(()=>res.json({status:"success"}))
    .catch(e=>res.json({status:"error",error:"DB_ERROR"}))
}
exports.getFromRange=(req,res)=>{
    const range=req.body.range;
    const rangeLength=range.length;
    return res.json({status:"success",data:range});
}