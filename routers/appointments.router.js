const router=require('express').Router()
const appointmentsController=require('../controllers/appointments.controller');
router.get("/",(req,res)=>res.json({status:"success"}));

router.post('/events/save',appointmentsController.saveEvent);
router.get('/events/',appointmentsController.allEvents);

router.post('/appointment-types/save',appointmentsController.saveAppointmentType);
router.get('/appointment-types/',appointmentsController.allAppointmentTypes);

router.post('/save',appointmentsController.saveAppointment);
router.get('/{id}',appointmentsController.getAppointment)

module.exports=router;