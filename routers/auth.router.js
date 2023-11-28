const router=require('express').Router();
const authController=require('../controllers/auth.controller')

router.get('/',authController.verify);

router.post('/signup',authController.signup);
router.post('/signin',authController.signin);
router.get('/signout',authController.signout);

module.exports=router;