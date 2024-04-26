const router=require("express").Router();
const subscribersController=require("../controllers/subscribers.controller")
router.post("/",subscribersController.saveSubscriber);
router.post("/page",subscribersController.pageSubscribers);
router.post("/upload",subscribersController.uploadCSV);
router.delete("/:id",subscribersController.deleteSubscribers);

module.exports=router;