const router=require('express').Router();
const sharedcontentsController=require('../controllers/sharedcontents.controller')
router.post('/save',sharedcontentsController.saveContent);
module.exports=router;