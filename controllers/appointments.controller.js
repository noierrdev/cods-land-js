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
    const address=req.body.address;
    const location=req.body.location;
    const detail=req.body.detail;
    const date=new Date(Number(req.body.time));
    const year=date.getFullYear();
    const month=date.getMonth();
    const day=date.getDate();
    const untilTime=Number(req.body.time)+gotAppointmentType.length;
    
    const newAppointment=new models.Appointment({
        user:req.userId,
        type:req.body.appointmenttype,
        time:date,
        from:date,
        to:untilTime,
        year,
        month,
        day,
        address,
        location,
        detail
    });
    newAppointment.save()
    .then(()=>res.json({status:"success"}))
    .catch((e)=>res.json({status:"error",error:"SAVE_FAILED"}));
}

exports.getAppointment=async (req,res)=>{
    if(!req.userId) return  res.json({status:"error",error:"AUTH_ERROR"});
    const appointmentId=req.params.id;
    const gotAppointment=await models.Appointment.findById(appointmentId).populate('type user','fullname email phonenumber city country title price length').lean();
    if(!gotAppointment) return res.json({status:"error",error:"NO_APPOINTMENT"});
    const membership=await models.Member.find({user:gotAppointment.user._id}).lean();
    return res.json({status:"success",data:{...gotAppointment,membership}});
}
exports.deleteAppointment=async (req,res)=>{
    if(!req.userId) return  res.json({status:"error",error:"AUTH_ERROR"});
    const appointmentId=req.params.id;
    models.Appointment.findByIdAndDelete(appointmentId)
    .then(()=>{
        return res.json({status:"success"});
        
    })
    .catch(e=>res.json({status:"error",error:e}))
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
exports.allAppointments=(req,res)=>{
    if(!req.userId) return res.json({status:"error",error:"AUTH_ERROR"});
    models.Appointment.find({user:req.userId}).populate('user type','fullname email title length price')
    .then(gotAppointments=>{
        return res.json({status:"success",data:gotAppointments})
    })
    .catch(e=>res.json({status:"error",error:e}))
}
exports.getFromRange=(req,res)=>{
    const range=req.body.range;
    const rangeLength=range.length;
    var filter={};
    if(rangeLength==7){
        const startDate=new Date(range[0]);
        const startYear=startDate.getFullYear()
        const startMonth=startDate.getMonth();
        const startDay=startDate.getDate()
        const endDate=new Date(range[6]);
        const endYear=endDate.getFullYear()
        const endMonth=endDate.getMonth();
        const endDay=endDate.getDate();
        filter={
            $and:[
                {
                    year:{$gte:startYear,$lte:endYear}
                },
                {
                    month:{$gte:startMonth,$lte:endMonth}
                },
                {
                    day:{$gte:startDay,$lte:endDay}
                },
            ]
        }
    }else if(rangeLength==1){
        const selectedDate=new Date(range[0]);
        const selectedYear=selectedDate.getFullYear()
        const selectedMonth=selectedDate.getMonth();
        const selectedDay=selectedDate.getDate();
        filter={
            $and:[
                {
                    year:selectedYear
                },
                {
                    month:selectedMonth
                },
                {
                    day:selectedDay
                },
            ]
        }
    }else{
        const startDate=new Date(range.start);
        const startYear=startDate.getFullYear()
        const startMonth=startDate.getMonth();
        const startDay=startDate.getDate()
        const endDate=new Date(range.end);
        const endYear=endDate.getFullYear()
        const endMonth=endDate.getMonth();
        const endDay=endDate.getDate();
        filter={
            $and:[
                {
                    year:{$gte:startYear,$lte:endYear}
                },
                {
                    month:{$gte:startMonth,$lte:endMonth}
                },
            ]
        }
    }
    models.Appointment.find(filter).populate("type user","fullname email phonenumber city country title length price")
    .then(gotAppointments=>{
        return res.json({status:"success",data:gotAppointments})
    })
    .catch(e=>res.json({status:"error",error:e}))
}

exports.saveMeeting=(req,res)=>{
    const email=req.body.email;
    const phone=req.body.phone;
    const address=req.body.address;
    const fullname=req.body.fullname;
    const year=req.body.year;
    const month=req.bpdy.month;
    const day=req.body.day;
    const from=req.body.from;
    const to=req.body.to;
    const newMeeting=new models.MeetingAppointment({
        fullname,
        email,
        phone,
        address,
        year,
        month,
        day,
        from,
        to
    });
    newMeeting.save()
    .then(()=>{
        return res.json({status:"success"})
    })
    .catch(e=>res.json({status:"error",error:e}))
}
exports.deleteMeeting=(req,res)=>{
    const id=req.params.id;
    models.MeetingAppointment.findByIdAndDelete(id)
    .then(()=>res.json({status:"success"}))
    .catch((e)=>res.json({status:"error",error:e}))
}
exports.pageMeetings=(req,res)=>{
    const page=req.body.page;
    const pagesize=req.body.pagesize;
    const search=req.body.search;
    const searchFilter=new RegExp(search,"i");
    var filter={};
    if(search) filter={
        ...filter,
        $or:[
            {fullname:searchFilter},
            {email:searchFilter},
            {address:searchFilter}
        ]
    }
    models.MeetingAppointment.find(filter).sort({createdAt:-1}).skip(page*pagesize).limit(pagesize)
    .then(async gotMeetings=>{
        const totalNumbers=await models.MeetingAppointment.countDocuments().lean().exec();
        const total=Math.ceil(totalNumbers/pagesize);
        return res.json({status:"success",data:{
            pagedata:gotMeetings,
            page,
            pagesize,
            totalNumbers,
            total
        }})
    })
    .catch(e=>res.json({status:"error",error:e}))
}
exports.meetingsFromRange=(req,res)=>{
    return res.json(req.body);
}