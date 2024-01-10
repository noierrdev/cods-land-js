const router=require('express').Router()
const adminController=require('../controllers/admin.controller');

router.post('/signin',adminController.adminSignIn);

module.exports=router;