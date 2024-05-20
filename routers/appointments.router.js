const router=require('express').Router()
const appointmentsController=require('../controllers/appointments.controller');
router.get("/",(req,res)=>res.json({status:"success"}));

router.post('/appointment-types/save',appointmentsController.saveAppointmentType);
router.get('/appointment-types/',appointmentsController.allAppointmentTypes);

router.post('/events', appointmentsController.saveAppointmentEvent);
router.post('/events/page', appointmentsController.pageAppointmentEvents);
router.delete('/events/:id', appointmentsController.deleteAppointmentEvent);
router.post('/events/vaild',appointmentsController.vaildateDate)


router.post("/calendar",appointmentsController.getFromRange)

router.post("/meetings",appointmentsController.saveMeeting)
router.post("/meetings/page",appointmentsController.pageMeetings)
router.delete("/meetings/:id",appointmentsController.deleteMeeting)

router.post('/save',appointmentsController.newSaveAppointment);
router.get('/my',appointmentsController.allAppointments)
router.post('/page',appointmentsController.pageAppointment)
router.put('/:id/accept',appointmentsController.acceptAppointment)
router.put('/:id/cancel',appointmentsController.cancelAppointment)
router.get('/:id/complete',appointmentsController.completeAppointment)
router.get('/:id',appointmentsController.getAppointment)
router.delete('/:id',appointmentsController.deleteAppointment)


module.exports=router;