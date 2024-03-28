const models=require("../../../models");

exports.pageProducts=(req,res)=>{
    const page=req.body.page;
    const pagesize=req.body.pagesize;
    models.Product.find({public:true},{
        title:true,
        image_url:true,
        description:true,
        createdAt:true,
        price:true,
        count:true,
        category_1:true,
        category_2:true,
        category_3:true,
        public:true,
        width:true,
        length:true,
        height:true,
        weight:true
    }).skip(page*pagesize).limit(pagesize).populate("category_1 category_2 category_3","title")
    .then(async gotProducts=>{
        const totalNumbers=await models.Product.countDocuments().lean().exec();
        const total=Math.ceil(totalNumbers/pagesize);
        return res.json({status:"success",data:{
            pagedata:gotProductCategories,
            page,
            pagesize,
            totalNumbers,
            total
        }})
    })
}

