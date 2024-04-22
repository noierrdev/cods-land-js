const models=require('../models');
const stripe=require('stripe')(process.env.STRIPE_KEY)

exports.saveMember=(req,res)=>{
    // if(!req.userId) return  res.json({status:"error",error:"AUTH_ERROR"});
    models.Member.findOne({user:req.userId})
    .then(gotMember=>{
        if(gotMember) return res.json({status:"error",error:"ALREADY_IS_MEMBER"})
        const now=Date.now();
        const newMember=new models.Member({
            user:req.userId,
            type:req.body.type,
            creditcard:req.body.creditcard?req.body.creditcard:null,
            fullname:req.body.fullname?req.body.fullname:null,
            birthday:req.body.birthday?req.body.birthday:null,
            email:req.body.email?req.body.email:null,
            phonenumber:req.body.phonenumber?req.body.phonenumber:null,
            gender:req.body.gender?req.body.gender:null,
            billing:req.body.billing?req.body.billing:null,
            shipping:req.body.shipping?req.body.shipping:null,
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

 exports.startPayment=async (req,res)=>{
    const type =  req.body.type;
    let amount = 0;
    if(type == '1') amount = 750;
    else amount = 10000;
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'usd',
      });
    
      return res.send({
        status:"success",
        data:{
            clientSecret: paymentIntent.client_secret,
        } 
      });
}

exports.pageMembers=(req,res)=>{
    const page=req.body.page;
    const pagesize=req.body.pagesize;
    const search=req.body.search;
    
    models.Member.find({}).skip(page*pagesize).sort({createdAt:-1}).limit(pagesize).populate("user","fullname email")
    .then(async gotMembers=>{
        const totalNumbers=await models.Member.countDocuments().lean().exec();
        const total=Math.ceil(totalNumbers/pagesize);
        return res.json({status:"success",data:{
            pagedata:gotMembers,
            page,
            pagesize,
            totalNumbers,
            total
        }})
    })
    .catch(e=>res.json({status:"error",error:e}))
}