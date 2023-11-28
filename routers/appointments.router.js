const router=require('express').Router()
const appointmentsController=require('../controllers/appointments.controller');
router.get("/",(req,res)=>res.json({status:"success"}));
router.post('/events/save',appointmentsController.saveEvent);
router.get('/events/',appointmentsController.allEvents);

module.exports=router;