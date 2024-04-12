const router=require('express').Router()
const isMember = require("../middlewares/member.middleware")

router.get('/',(req,res)=> res.json({status:"success"}));
router.use('/auth',require('./auth.router'));
router.use('/appointments',require('./appointments.router'));
router.use('/shared-contents',require('./sharedcontents.router'))
router.use('/members',require('./members.router'))
router.use('/shop', require('./shop.router'))
router.use('/test',require('./test.router'))
router.use('/admin',require('./admin.router'))
router.use('/events',require('./events.router'))

///////////////////////
router.use('/grander',require('../apps/grander/routers'));
////////////////////////

module.exports=router;