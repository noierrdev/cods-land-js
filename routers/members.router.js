const router=require('express').Router();
const membersController=require('../controllers/members.controller');
router.post('/save',membersController.saveMember);
router.use('/check',membersController.memberCheck);
router.post('/page',membersController.pageMembers)
router.delete('/:id',membersController.deleteMember);
router.post('/start-payment', membersController.startPayment);
module.exports=router