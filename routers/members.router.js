const router=require('express').Router();
const membersController=require('../controllers/members.controller');
router.post('/save',membersController.saveMember);
router.delete('/:id',membersController.deleteMember);
module.exports=router