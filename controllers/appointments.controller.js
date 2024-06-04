const models=require('../models')
const brevo=require('@getbrevo/brevo');
const stripe=require('stripe')(process.env.STRIPE_KEY)

exports.saveAppointmentType=(req,res)=>{
    // if(!req.userId) return  res.json({status:"error",error:"AUTH_ERROR"});
    const newAppointmentType=new models.AppointmentType({
        title:req.body.title,
        price:req.body.price,
        length:req.body.length
    });
    newAppointmentType.save()
    .then(()=>{
        return res.json({status:"success"})
    })
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
    const duplicatedAppointments=await models.Appointment.find({from:date}).lean().exec();
    if(duplicatedAppointments.length>0) return res.json({status:"error",error:"TIME_DUPLICATED"})
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
    .then((gotAppointment)=>{
        let defaultClient = brevo.ApiClient.instance;
        let apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = process.env.BREVO_KEY;
        let apiInstance = new brevo.TransactionalEmailsApi();
        let sendSmtpEmail = new brevo.SendSmtpEmail();
        sendSmtpEmail.subject = "New Appointment Requested from "+req.email;
        sendSmtpEmail.htmlContent = `
        <html>
            <body>
                <h2>New Appointment Requested from ${req.email}</h2>
                <h2>The Id of new appointment is ${gotAppointment._id}</h2>
                <h2>The address of booker is ${req.body.address}</h2>
                
                <a href="http://cods.land:3001/" ><h2>Cods.Land-admin</h2></a>
            </body>
        </html>`;
        sendSmtpEmail.sender = { "name": "Cods.Land", "email": "info@cods.land" };
        sendSmtpEmail.to = [

            {
                "email": "noierrdev@proton.me", "name": "Vander Moleker"
            },
            {
                "email": "noierrdev@gmail.com", "name": "Vander Moleker"
            },
            {
                "email": "ncrdean@gmail.com", "name": "Dean Howell"
            },
            {
                "email": "dean@cods.land", "name": "Dean Howell"
            }
        ];
        sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
        sendSmtpEmail.params = { "parameter": "My param value", "subject": "common subject" };


        apiInstance.sendTransacEmail(sendSmtpEmail).then(async function (data) {
            // return res.json({ status: "success", data: data });
            return res.json({status:"success",data:data})
        })
        // return res.json({status:"success"});
    })
    .catch((e)=>res.json({status:"error",error:"SAVE_FAILED"}));
}
exports.acceptAppointment=(req,res)=>{
    const appointment=req.params.id;
    models.Appointment.findByIdAndUpdate(appointment,{$set:{accepted:true,status:"accepted"}}).populate('user type','fullname email length price title')
    .then((gotAppointment)=>{
        let defaultClient = brevo.ApiClient.instance;
        let apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = process.env.BREVO_KEY;
        let apiInstance = new brevo.TransactionalEmailsApi();
        let sendSmtpEmail = new brevo.SendSmtpEmail();
        sendSmtpEmail.subject = "Cods.Land accepted your appointment request.";
        sendSmtpEmail.htmlContent = `
        <html>
            <body>
                <h2>Dear ${gotAppointment.user.fullname}.</h2>
                <h2>Your appointment for Meeting with Dr Dean is accepted.</h2>
                <h2>The Id of new appointment is ${appointment}</h2>
                <h2>The meeting will be from ${gotAppointment.time} for ${gotAppointment.type.length/(60000)} minutes.</h2>
                <h2>at ${gotAppointment.address} </h2>
                <h2>Thanks</h2>
                
            </body>
        </html>`;
        sendSmtpEmail.sender = { "name": "Cods.Land", "email": "info@cods.land" };
        sendSmtpEmail.to = [
            {
                "email": gotAppointment.user.email, "name": gotAppointment.user.fullname
            },
            {
                "email": "vandermoleker@gmail.com", "name": "Vander Moleker"
            },
            {
                "email": "noierrdev@gmail.com", "name": "Vander Moleker"
            },
        ];
        sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
        sendSmtpEmail.params = { "parameter": "My param value", "subject": "common subject" };


        apiInstance.sendTransacEmail(sendSmtpEmail).then(async function (data) {
            // return res.json({ status: "success", data: data });
            return res.json({status:"success",data:data})
        })
    })
    .catch(e=>res.json({status:'error',error:e}))
}

exports.cancelAppointment=(req,res)=>{
    const appointment=req.params.id;
    models.Appointment.findByIdAndUpdate(appointment,{$set:{accepted:false,status:"canceled"}}).populate('user type','fullname email length price title')
    .then((gotAppointment)=>{
        let defaultClient = brevo.ApiClient.instance;
        let apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = process.env.BREVO_KEY;
        let apiInstance = new brevo.TransactionalEmailsApi();
        let sendSmtpEmail = new brevo.SendSmtpEmail();
        sendSmtpEmail.subject = "Cods.Land canceled your appointment request.";
        sendSmtpEmail.htmlContent = `
        <html>
            <body>
                <h2>Dear ${gotAppointment.user.fullname}.</h2>
                <h2>Your appointment for Meeting with Dr Dean is canceled. We are really sorry about that.</h2>
                <h2>The Id of new appointment is ${appointment}</h2>
                <h2>The meeting would be from ${gotAppointment.time} for ${gotAppointment.type.length/(60000)} minutes.</h2>
                <h2>at ${gotAppointment.address} </h2>
                
            </body>
        </html>`;
        sendSmtpEmail.sender = { "name": "Cods.Land", "email": "info@cods.land" };
        sendSmtpEmail.to = [
            {
                "email": gotAppointment.user.email, "name": gotAppointment.user.fullname
            },
            {
                "email": "vandermoleker@gmail.com", "name": "Vander Moleker"
            },
            {
                "email": "noierrdev@gmail.com", "name": "Vander Moleker"
            },
        ];
        sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
        sendSmtpEmail.params = { "parameter": "My param value", "subject": "common subject" };


        apiInstance.sendTransacEmail(sendSmtpEmail).then(async function (data) {
            // return res.json({ status: "success", data: data });
            return res.json({status:"success",data:data})
        })
    })
    .catch(e=>res.json({status:'error',error:e}))
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
    const page=req.body.page;
    const pagesize=req.body.pagesize;
    const search=req.body.search;
    const searchFilter=new RegExp(search,"i");
    var filter={};
    if(search) filter={
        ...filter,
        $or:[
            {'user.fullname':searchFilter},
            {'user.email':searchFilter},
            {address:searchFilter}
        ]
    }
    models.Appointment.find(filter).sort({createdAt:-1}).skip(page*pagesize).limit(pagesize).populate('user','fullname email')
    .then(async gotAppointments=>{
        const totalNumbers=await models.Appointment.countDocuments({filter}).lean().exec();
        const total=Math.ceil(totalNumbers/pagesize);
        return res.json({status:"success",data:{
            pagedata:gotAppointments,
            page,
            pagesize,
            totalNumbers,
            total
        }})
    })
    .catch(e=>res.json({status:"error",error:e}))
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
    var eventFilter={}
    if(rangeLength==7){
        const startDate=new Date(range[0]);
        const endDate=new Date(range[6]);
        filter={
            time:{$gte:startDate,$lte:endDate}
        }
        eventFilter={
            $or:[
                {
                    $and:[
                        {
                            start_date:{$gte:startDate}
                        },
                        {
                            start_date:{$lte:endDate}
                        }
                    ]
                },
                {
                    $and:[
                        {
                            end_date:{$gte:startDate}
                        },
                        {
                            end_date:{$lte:endDate}
                        }
                    ]
                }
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
        eventFilter={
            $and:[
                {
                    start_date:{$lte:selectedDate},
                    end_date:{$gte:selectedDate}
                }
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
        };
        eventFilter={
            $or:[
                {
                    $and:[
                        {
                            start_date:{$gte:startDate}
                        },
                        {
                            start_date:{$lte:endDate}
                        }
                    ]
                },
                {
                    $and:[
                        {
                            end_date:{$gte:startDate}
                        },
                        {
                            end_date:{$lte:endDate}
                        }
                    ]
                }
            ]
        };
    }
    models.Appointment.find(filter).populate("type user","fullname email phonenumber city country title length price")
    .then(async gotAppointments=>{
        const events=await models.AppointmentEvent.find(eventFilter).lean().exec();
        return res.json({status:"success",data:{appointments:gotAppointments,events:events}})
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

exports.saveAppointmentEvent=async (req,res)=>{
    const title=req.body.title;
    const description=req.body.description;
    const start_date=req.body.start_date;
    const end_date=req.body.end_date;
    const start_time=req.body.start_time;
    const end_time=req.body.end_time;
    const location=req.body.location;
    const startTimeArray=start_time.split(":");
    const endTimeArray=end_time.split(":");
    const startTime=parseInt(startTimeArray[0])+(parseInt(startTimeArray[1])/60);
    const endTime=parseInt(endTimeArray[0])+(parseInt(endTimeArray[1])/60);
    // const duplicatedDates=await models.AppointmentEvent.find({$and:[
    //     {start_date:{$lte:start_date}},
    //     {end_date:{$gte:start_date}}
    // ]}).lean().exec();
    // if(duplicatedDates.length>0) return res.json({status:"error",error:"DUPLICATED"})
    const newEvent=new models.AppointmentEvent({
        title,
        description,
        start_date,
        end_date,
        start_time:startTime,
        end_time:endTime,
        location
    })
    newEvent.save()
    .then((gotEvent)=>{
        return res.json({status:"success"});
    })
    .catch(e=>res.json({status:"error",error:e}))
}

exports.deleteAppointmentEvent=(req,res)=>{
    const id=req.params.id;
    models.AppointmentEvent.findByIdAndDelete(id)
    .then(()=>{
        return res.json({status:"success"})
    })
    .catch(()=>res.json({status:"error",error:e}))
}

exports.pageAppointmentEvents=(req,res)=>{
    const page=req.body.page;
    const pagesize=req.body.pagesize;
    const search=req.body.search;
    const searchFilter=new RegExp(search,"i");
    var filter={};
    if(search) filter={
        ...filter,
        $or:[
            {title:searchFilter},
            {description:searchFilter},
            {location:searchFilter}
        ]
    }
    models.AppointmentEvent.find(filter).sort({createdAt:-1}).skip(page*pagesize).limit(pagesize)
    .then(async gotAppointmentEvents=>{
        const totalNumbers=await models.AppointmentEvent.countDocuments({filter}).lean().exec();
        const total=Math.ceil(totalNumbers/pagesize);
        return res.json({status:"success",data:{
            pagedata:gotAppointmentEvents,
            page,
            pagesize,
            totalNumbers,
            total
        }})
    })
    .catch(e=>res.json({status:"error",error:e}))
}
exports.newSaveAppointment=async (req,res)=>{
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

    const parentEvent=await models.AppointmentEvent.findOne({$and:[{start_date:{$lte:date}},{end_date:{$gte:date}}]}).lean().exec();
    if(parentEvent.length==0) return res.json({status:"error",error:"NO_EVENT"});


    const hour=date.getHours();
    const minutes=date.getMinutes();
    const timeNumber=hour+(minutes/60);

    if(timeNumber<parentEvent.start_time|timeNumber>parentEvent.end_time) return res.json({status:"error",error:"NOT_MATCH_TO_EVENT_TIME"});

    const duplicatedAppointments=await models.Appointment.find({from:date}).lean().exec();
    if(duplicatedAppointments.length>0) return res.json({status:"error",error:"TIME_DUPLICATED"})
    
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
    .then((gotAppointment)=>{
        let defaultClient = brevo.ApiClient.instance;
        let apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = process.env.BREVO_KEY;
        let apiInstance = new brevo.TransactionalEmailsApi();
        let sendSmtpEmail = new brevo.SendSmtpEmail();
        sendSmtpEmail.subject = "New Appointment Requested from "+req.email;
        sendSmtpEmail.htmlContent = `
        <html>
            <body>
                <h2>New Appointment Requested from ${req.email}</h2>
                <h2>The Id of new appointment is ${gotAppointment._id}</h2>
                <h2>The address of booker is ${req.body.address}</h2>
                
                <a href="http://cods.land:3001/" ><h2>Cods.Land-admin</h2></a>
            </body>
        </html>`;
        sendSmtpEmail.sender = { "name": "Cods.Land", "email": "info@cods.land" };
        sendSmtpEmail.to = [

            {
                "email": "noierrdev@proton.me", "name": "Vander Moleker"
            },
            {
                "email": "noierrdev@gmail.com", "name": "Vander Moleker"
            },
            {
                "email": "ncrdean@gmail.com", "name": "Dean Howell"
            },
            {
                "email": "dean@cods.land", "name": "Dean Howell"
            }
        ];
        sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
        sendSmtpEmail.params = { "parameter": "My param value", "subject": "common subject" };


        apiInstance.sendTransacEmail(sendSmtpEmail).then(async function (data) {
            // return res.json({ status: "success", data: data });
            return res.json({status:"success",data:data})
        })
        // return res.json({status:"success"});
    })
    .catch((e)=>res.json({status:"error",error:"SAVE_FAILED"}));
}

exports.vaildateDate=(req,res)=>{
    const date=new Date(req.body.date);
    models.AppointmentEvent.findOne({$and:[{start_date:{$lte:date}},{end_date:{$gte:date}}]})
    .then(gotEvent=>{
        if(!gotEvent) return res.json({status:'error',error:"NO_EVENT"});
        return res.json({status:"success",data:gotEvent});
    })
    .catch((e)=>res.json({status:"error",error:e}))
}

exports.startPayment=async (req,res)=>{
    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.price,
        currency: 'usd',
      });
    
      return res.send({
        status:"success",
        data:{
            clientSecret: paymentIntent.client_secret,
        } 
      });
}

exports.getAllFromMonth=(req,res)=>{
    const year=req.body.year;
    const month=req.bpdy.month;

    models.Appointment.find({$and:[
        {year:{}}
    ]})
}