const router=require('express').Router()
const appointmentsController=require('../controllers/appointments.controller');
router.get("/",(req,res)=>res.json({status:"success"}));

router.post('/appointment-types/save',appointmentsController.saveAppointmentType);
router.get('/appointment-types/',appointmentsController.allAppointmentTypes);

router.post('/save',appointmentsController.saveAppointment);
router.get('/my',appointmentsController.allAppointments)
router.post('/page',appointmentsController.pageAppointment)
router.put('/:id/accept',appointmentsController.acceptAppointment)
router.put('/:id/cancel',appointmentsController.cancelAppointment)
router.get('/:id',appointmentsController.getAppointment)
router.delete('/:id',appointmentsController.deleteAppointment)
router.get('/:id/complete',appointmentsController.completeAppointment)


router.post("/calendar",appointmentsController.getFromRange)

router.post("/meetings",appointmentsController.saveMeeting)
router.post("/meetings/page",appointmentsController.pageMeetings)
router.delete("/meetings/:id",appointmentsController.deleteMeeting)

module.exports=router;