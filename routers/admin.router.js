const router=require('express').Router()
const adminController=require('../controllers/admin.controller');

router.post('/signin',adminController.adminSignIn);
router.post('/users/page',adminController.usersPage);
router.delete('/users/:user_id',adminController.deleteUser)
router.post('/upload-csv',adminController.uploadCSV)
module.exports=router;