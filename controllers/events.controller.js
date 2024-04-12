const models =require("../models")

exports.saveEvent=(req,res)=>{
    const title=req.body.title;
    const description=req.body.description;
    const start=req.body.start;
    const end=req.body.end;
    const location=req.body.location;
    const logo=req.files.logo;
    const date=req.body.date;
    const newEvent=new models.Event({
        title,
        description,
        start,
        end,
        location,
        logo,
        date
    });
    newEvent.save()
    .then(()=>res.json({status:"success"}))
    .catch(e=>res.json({status:"error",error:e}))
}
exports.getEvent=(req,res)=>{
    const event_id=req.params.id;
    models.Event.findById(event_id).populate("users","fullname")
    .then(gotEvent=>res.json({status:"success",data:gotEvent}))
    .catch(e=>res.json({status:"error",error:e}))

}
exports.deleteEvent=(req,res)=>{
    const event_id=req.params.id;
    models.Event.findByIdAndRemove(event_id)
    .then(()=>res.json({status:"success"}))
    .catch(e=>res.json({status:"error",error:e}))
}
exports.pageEvents=(req,res)=>{
    const page=req.body.page;
    const pagesize=req.body.pagesize;
    models.Event.find({}).skip(page*pagesize).sort({createdAt:-1}).limit(pagesize).populate("users","fullname")
    .then(async gotEvents=>{
        const totalNumbers=await models.Event.countDocuments().lean().exec();
        const total=Math.ceil(totalNumbers/pagesize);
        return res.json({status:"success",data:{
            pagedata:gotEvents,
            page,
            pagesize,
            totalNumbers,
            total
        }})
    })
    .catch(e=>res.json({status:"error",error:e}))
}

exports.joinEvent=(req,res)=>{
    const event_id=req.params.id;
    const user_id=req.userId;
    models.Event.findByIdAndUpdate(event_id,{
        $push:{users:user_id}
    },{
        new:true
    })
    .then(()=>res.json({status:"success"}))
    .catch(e=>res.json({status:"error",error:e}))
}