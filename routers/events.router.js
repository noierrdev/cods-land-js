const router=require("express").Router();
const eventsController=require("../controllers/events.controller");

router.post("/",eventsController.saveEvent);
router.get("/:id/logo",eventsController.logoEvent);
router.get("/:id",eventsController.getEvent);
router.post("/page",eventsController.pageEvents);
router.put("/:id/join",eventsController.joinEvent);
router.delete("/:id",eventsController.deleteEvent);

module.exports=router;
