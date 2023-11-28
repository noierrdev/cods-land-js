const router=require('express').Router()

router.get('/',(req,res)=>{
    return res.json({
        status:"success"
    })
});
router.use('/auth',require('./auth.router'))

module.exports=router;