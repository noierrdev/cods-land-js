const router=require('express').Router()
const shopController=require("../controllers/shop.controller");

router.get("/",(req,res)=>{
    res.json({status:"success",data:"API of theessenceoflife.com"});
})

router.post("/products/page",shopController.pageGranderProducts);
router.post("/products",shopController.saveGranderProduct);
router.delete("/products/:id",shopController.deleteGranderProduct);
router.put("/products/:id",shopController.updateGranderProduct);
router.get("/products/:id/image",shopController.getGranderProductImage)
router.get("/products/:id",shopController.getGranderProduct);


router.post("/orders",shopController.saveGranderOrder);
router.post("/orders/page",shopController.pageOrders);
router.post('/orders/purchase',shopController.purchase);
router.put("/orders/:id",shopController.selectShippingRate);
router.post("/orders/:id",shopController.sendShippingRequest);
router.delete("/orders/:id",shopController.deleteGranderOrder)

module.exports=router;