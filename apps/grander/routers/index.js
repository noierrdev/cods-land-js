const router=require("express").Router()

router.use('/shop',require('./shop.router'))

module.exports=router;