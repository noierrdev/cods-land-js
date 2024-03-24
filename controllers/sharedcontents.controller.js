const models=require('../models')
const fs=require('fs');
const path=require('path');
exports.saveContent=(req,res)=>{
    // if(!req.userId) return res.json({status:'error',error:"AUTH_ERROR"})
    const title=req.body.title;
    const description=req.body.description;
    const type=req.body.type;
    const uploading=req.files&&req.files.upload;
    const content=req.body.content;
    const author=req.userId;
    const category=req.body.category;
    if(uploading)
        return uploading.mv(path.resolve(__dirname,"../temp",uploading.md5),async (err)=>{
            const newSharedContent=new models.SharedContent({
                category:category,
                title:title,
                description:description,
                content:content,
                type:type,
                media:{
                    name:uploading&&uploading.filename,
                    size:uploading&&uploading.length,
                    md5:uploading&&uploading.md5,
                    mimetype:uploading&&uploading.mimetype
                },
                author:author
            });
            newSharedContent.save()
            .then(()=>res.json({status:"success"}))
            .catch(e=>res.json({status:"error",error:"DB_ERROR"}))            
        })
    const newSharedContent=new models.SharedContent({
        category:category,
        title:title,
        description:description,
        content:content,
        type:type,
        author:author
    });
    newSharedContent.save()
    .then(()=>res.json({status:"success"}))
    .catch(e=>res.json({status:"error",error:"DB_ERROR"}))
    
};

exports.getContent=(req,res)=>{
    const contentId=req.params.id;
    models.SharedContent.findById(contentId).populate('category author','title fullname')
    .then(gotContent=>res.json({status:"success",data:gotContent}))
    .catch(e=>res.json({status:"error",error:"DB_ERROR"}))
}

exports.deleteContent= (req,res)=>{
    // if(!req.superuser) return res.json({status:"error",error:"ACCESS_DENIED"})
    const contentId=req.params.id;
    models.SharedContent.findByIdAndDelete(contentId)
    .then(async (gotContent)=>{
        await models.Like.deleteMany({content:contentId});
        await models.Share.deleteMany({content:contentId});
        if(gotContent.media) await fs.unlinkSync(path.resolve(__dirname,"../temp",gotContent.media.md5));
        res.json({status:"success"})
    })
    .catch(e=>res.json({status:"error",error:"DB_ERROR"}))
}

exports.likeContent=async (req,res)=>{
    if(!req.userId) return res.json({status:'error',error:"AUTH_ERROR"})
    const contentId=req.params.id;
    const gotLike=await models.Like.findOne({content:contentId,user:req.userId});
    if(gotLike) return res.json({status:"error",error:"ALREADY_LIKE"});
    const newLike=new models.Like({
        content:contentId,
        user:req.userId
    });
    newLike.save()
    .then(()=>{
        models.SharedContent.findByIdAndUpdate(contentId,{$inc:{likes:1}})
        .then(()=>res.json({status:"success"}))
        .catch(e=>res.json({status:'error',error:"DB_ERROR"}))
    })
};

exports.shareContent=async (req,res)=>{
    if(!req.userId) return res.json({status:"error",error:"AUTH_ERROR"});
    const contentId=req.params.id;
    const gotShare=await models.Share.findOne({content:contentId,user:req.userId});
    if(gotShare) return res.json({status:'error',error:"ALREADY_SHARED"})
    const newShare=new models.Share({
        content:contentId,
        user:req.userId
    });
    newShare.save()
    .then(()=>{
        models.SharedContent.findByIdAndUpdate(contentId,{$inc:{shares:1}})
        .then(()=>res.json({status:'success'}))
        .catch(e=>res.json({status:"error",error:"SAVE_FAILED"}))
    })
    .catch(e=>res.json({status:"error",error:'DB_ERROR'}))
};
exports.allContents=(req,res)=>{
    return models.SharedContent.find().sort({createdAt:-1}).populate('author category','email fullname title')
    .then(gotContents=>{
        return res.json({status:"success",data:gotContents});
    })
    .catch(e=>res.json({status:"error",data:e}))
}
exports.saveCategory=(req,res)=>{
    if(!req.userId) return res.json({status:"error",error:"AUTH_ERROR"})
    const newCategory=new models.SharedContentCategory({
        title:req.body.title,
        description:req.body.description
    });
    newCategory.save()
    .then(()=>res.json({status:"success"}))
    .catch(e=>res.json({status:"error",error:"SAVE_FAILED"}));
};
exports.allCategories=(req,res)=>{
    // if(!req.userId) return res.json({status:"error",data:"AUTH_ERROR"});
    models.SharedContentCategory.find()
    .then(gotCategories=>res.json({status:"success",data:gotCategories}))
    .catch(e=>res.json({status:"error",error:e}));
};

exports.deleteCategory=(req,res)=>{
    if(!req.superuser) return res.json({status:"error",data:"ACCESS_DENIED"});
    const categoryId=req.params.categoryId;
    models.SharedContentCategory.findByIdAndDelete(categoryId)
    .then(()=>res.json({status:"success"}))
    .catch(e=>res.json({status:"error",error:"DB_ERROR"}));
};

exports.sendContentMedia=(req,res)=>{
    const contentId=req.params.id;
    models.SharedContent.findById(contentId)
    .then(gotContent=>{
        if(!gotContent) return res.json({status:"error",error:"NO_CONTENT"})
        if(!gotContent.media) return res.json({status:"error",error:"NO_MEDIA"})
        return res.setHeader("Content-Type",gotContent.media.mimetype?gotContent.media.mimetype:"application/octet-stream").sendFile(path.resolve(__dirname,"../temp",gotContent.media.md5))
    })
    .catch(e=>res.json({status:"error",error:e}))
}

exports.pageContents=(req,res)=>{
    const page=req.body.page;
    const pagesize=req.body.pagesize;
    models.SharedContent.find({}).skip(page*pagesize).sort({createdAt:-1}).limit(pagesize).populate("author category","fullname email title")
    .then(async gotContents=>{
        const totalNumbers=await models.SharedContent.countDocuments().lean().exec();
        const total=Math.ceil(totalNumbers/pagesize);
        return res.json({status:"success",data:{
            pagedata:gotContents,
            page,
            pagesize,
            totalNumbers,
            total
        }})
    })
    .catch(e=>res.json({status:"error",error:e}))
}

exports.pageCategories=(req,res)=>{
    const page=req.body.page;
    const pagesize=req.body.pagesize;
    models.SharedContentCategory.find({}).skip(page*pagesize).sort({createdAt:-1}).limit(pagesize)
    .then(async gotCategories=>{
        const totalNumbers=await models.SharedContentCategory.countDocuments().lean().exec();
        const total=Math.ceil(totalNumbers/pagesize);
        return res.json({status:"success",data:{
            pagedata:gotCategories,
            page,
            pagesize,
            totalNumbers,
            total
        }})
    })
    .catch(e=>res.json({status:"error",error:e}))
}