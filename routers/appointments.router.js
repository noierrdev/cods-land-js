const router=require('express').Router()

router.get("/",(req,res)=>res.json({status:"success"}));


module.exports=router;