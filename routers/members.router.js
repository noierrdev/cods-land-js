const router=require('express').Router();
const membersController=require('../controllers/members.controller');
router.post('/save',membersController.saveMember);
router.use('/check',membersController.memberCheck)
router.delete('/:id',membersController.deleteMember);
module.exports=router