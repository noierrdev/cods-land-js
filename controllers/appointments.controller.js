const models=require('../models')

exports.saveEvent=(req,res)=>{
    if(!req.userId) return  res.json({status:"error",data:"AUTH_ERROR"});
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

exports.saveAppointment=(req,res)=>{
    if(!req.userId) return  res.json({status:"error",data:"AUTH_ERROR"});

}