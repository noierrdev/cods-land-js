const router=require('express').Router();
const shopController=require('../controllers/shop.controller')
router.get("/",(req,res)=>{
    return res.json({status:"success"})
});
router.post('/categories',shopController.saveCategory);
router.get('/categories/all',shopController.allCategories)
router.delete('/categories/:category_id',shopController.deleteCategory);
router.post('/categories/:category_id/page',shopController.categoryPage);
router.post('/products',shopController.saveProduct);
router.post('/products/page',shopController.productsPage);
router.delete('/products/:product_id',shopController.deleteProduct)
router.get('/products/:product_id',shopController.getProduct);



module.exports=router;