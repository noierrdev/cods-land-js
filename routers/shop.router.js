const router=require('express').Router();
const shopController=require('../controllers/shop.controller')
const isSignIn=require('../middlewares/isSignIn.middleware')
router.get("/",(req,res)=>{
    return res.json({status:"success"})
});
router.post('/categories',isSignIn,shopController.saveCategory);
router.get('/categories/',shopController.allCategories)
router.post('/categories/page',shopController.pageCategories)
router.delete('/categories/:category_id',shopController.deleteCategory);
router.post('/categories/:category_id/products/page',shopController.categoryPage);
router.post('/products',isSignIn,shopController.saveProduct);
router.post('/products/page',shopController.productsPage);
router.get('/products/:product_id/image',shopController.productImage)
router.delete('/products/:product_id',isSignIn,shopController.deleteProduct)
router.get('/products/:product_id',shopController.getProduct);
router.post('/cart',isSignIn,shopController.addToCart);
router.get('/cart',shopController.myCart);
router.get('/cart/count',isSignIn,shopController.countOfCartProducts);
router.post('/cart/:cartproduct_id/count',isSignIn,shopController.setCartCount)
router.delete('/cart/:cartproduct_id',isSignIn,shopController.deleteCartProduct);
router.post('/orders/save',isSignIn,shopController.saveOrder)
router.get('/orders',isSignIn,shopController.myOrders)
router.post('/orders/page',isSignIn,shopController.pageOrders)
router.post('/orders/start-pay',isSignIn,shopController.startPayment)
router.get('/orders/:order_id',isSignIn,shopController.getOrder)
router.delete('/orders/:order_id',isSignIn,shopController.deleteOrder);

module.exports=router;