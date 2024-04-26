const models=require('../models');


exports.saveSubscriber=(req,res)=>{
    const fullname=req.body.fullname;
    const email=req.body.email;
    const newSubscriber=new models.Subscriber({
        fullname,
        email
    });
    newSubscriber.save()
    .then(()=>res.json({status:"success"}))
    .catch((e)=>res.json({status:"error",error:e}))
}

exports.pageSubscribers=(req,res)=>{
    const page=req.body.page;
    const pagesize=req.body.pagesize;
    const search=req.body.search;
    var filter={};
    if(search){
        const searchFilter=new RegExp(search,"i");
        filter={
            ...filter,
            $or:[
                {email:searchFilter},
                {fullname:searchFilter},
                {country:searchFilter},
                {state:searchFilter},
                {city:searchFilter}
            ]
        };
    };
    models.Subscriber.find(filter).skip(page*pagesize).sort({createdAt:-1}).limit(pagesize)
    .then(async gotSubscribers=>{
        const totalNumbers=await models.Subscriber.countDocuments(filter).lean().exec();
        const total=Math.ceil(totalNumbers/pagesize);
        return res.json({status:"success",data:{
            pagedata:gotSubscribers,
            page,
            pagesize,
            totalNumbers,
            total
        }})
    })
    .catch(e=>res.json({status:"error",error:e}))
    
}

exports.deleteSubscribers=(req,res)=>{
    const id=req.params.id;
    models.Subscriber.findByIdAndDelete(id)
    .then(()=>res.json({status:"success"}))
    .catch(e=>res.json({status:"error",error:e}))
}

exports.uploadCSV=async (req,res)=>{
    const csvFile=req.files.csv;
    const csvData=String(csvFile.data).split("\n");
    csvData.splice(0,1);//Remove headline
    for(var oneLine of csvData){
        var oneSubscriber=oneLine.split(",");
        const oneNewSubscriber=new models.Subscriber({
            fullname:oneSubscriber[2],
            email:oneSubscriber[3],
            country:oneSubscriber[12],
            state:oneSubscriber[13],
            city:oneSubscriber[14],
            continent_code:oneSubscriber[14],
            country_code:oneSubscriber[15],
            state_code:oneSubscriber[16],
            zipcode:oneSubscriber[17],
            homephone:oneSubscriber[28],
            mobilephone:oneSubscriber[31],
            detail:{raw:oneSubscriber},
        })
        await oneNewProduct.save()

    }
    return res.json({status:"success"})
}