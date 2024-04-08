const router=require('express').Router()
const shopController=require("../controllers/shop.controller");

router.post("/page",shopController.pageGranderProducts);

router.post("/products",shopController.saveGranderProduct);
router.delete("/products/:id",shopController.deleteGranderProduct);
router.put("/products/:id",shopController.updateGranderProduct);

router.post("/orders",shopController.saveGranderOrder);

router.put("/orders/:id",shopController.selectShippingRate);
router.post("/orders/:id",shopController.sendShippingRequest);

router.delete("/orders/:id",shopController.deleteGranderOrder)

module.exports=router;