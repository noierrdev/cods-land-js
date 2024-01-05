const models=require('../models');

exports.saveMember=(req,res)=>{
    // if(!req.userId) return  res.json({status:"error",error:"AUTH_ERROR"});
    models.Member.findOne({user:req.userId})
    .then(gotMember=>{
        if(gotMember) return res.json({status:"error",error:"ALREADY_IS_MEMBER"})
        const now=Date.now();
        const newMember=new models.Member({
            user:req.userId,
            type:req.body.type,
            creditcard:req.body.creditcard,
            expired:now+req.body.period*24*60*60*1000
        });
        newMember.save()
        .then(()=>res.json({status:"success"}))
        .catch(e=>res.json({status:"error",error:e}))
    })
    .catch(e=>res.json({status:"error",error:e}))
}

exports.updateMember=(req,res)=>{
    // if(!req.userId) return  res.json({status:"error",error:"AUTH_ERROR"});
    models.Member.find({user:req.userId})
    .then(gotMember=>{
        if(!gotMember) return res.json({status:"error",error:"NO_MEMBER"})
        const lastDay=new Date(gotMember.expired);
        models.Member.findByIdAndUpdate(gotMember._id,{
            expired:lastDay+req.body.period*24*60*60*1000
        })
        .then(()=>res.json({status:"success"}))
        .catch(e=>res.json({status:"error",error:e}))
    })
    .catch(e=>res.json({status:"error",error:e}))
}

exports.deleteMember=(req,res)=>{
    // if(!req.userId) return res.json({status:"error",error:"AUTH_ERROR"});
    // if(!req.superuser) return res.json({status:"error",error:"ACCESS_DENIED"})
    models.Member.findByIdAndDelete(req.params.id)
    .then(()=>res.json({status:"success"}))
    .catch((e)=>res.json({status:'error',error:e}))
}
 exports.memberCheck=(req,res)=>{
    if(!req.userId) return res.json({status:"error",error:"AUTH_ERROR"});
    models.Member.find({user:req.userId}).populate('user','fullname email')
    .then(gotMember=>{
        if(!gotMember) return res.json({status:"error",data:"NO_MEMBER"})
        return res.json({status:"success",data:gotMember})
    })
    .catch(e=>res.json({status:"error",data:e}))
 }