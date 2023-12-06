const router=require('express').Router();
const membersController=require('../controllers/members.controller');
router.post('/save',membersController.saveMember);
module.exports=router