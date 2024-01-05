const router=require('express').Router();
const shopController=require('../controllers/shop.controller')
router.get("/",(req,res)=>{
    return res.json({status:"success"})
});
router.post('/categories',shopController.saveCategory);
router.get('/categories/',shopController.allCategories)
router.delete('/categories/:category_id',shopController.deleteCategory);
router.post('/categories/:category_id/products/page',shopController.categoryPage);
router.post('/products',shopController.saveProduct);
router.post('/products/page',shopController.productsPage);
router.get('/products/:product_id/image',shopController.productImage)
router.delete('/products/:product_id',shopController.deleteProduct)
router.get('/products/:product_id',shopController.getProduct);
router.post('/cart',shopController.addToCart);
router.get('/cart',shopController.myCart);
router.get('/cart/count',shopController.countOfCartProducts);
router.post('/cart/:cartproduct_id/count',shopController.setCartCount)
router.delete('/cart/:cartproduct_id',shopController.deleteCartProduct);
router.post('/orders/save',shopController.saveOrder)
router.get('/orders',shopController.myOrders)
router.post('/orders/page',shopController.pageOrders)
router.get('/orders/:order_id',shopController.getOrder)
router.delete('/orders/:order_id',shopController.deleteOrder)
module.exports=router;