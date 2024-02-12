const router=require('express').Router();
const shopController=require('../controllers/shop.controller')
const isSignIn=require('../middlewares/isSignIn.middleware')
const isMember=require('../middlewares/member.middleware')
router.get("/",(req,res)=>{
    return res.json({status:"success"})
});
router.post('/categories',isSignIn, isMember, shopController.saveCategory);
router.get('/categories/',isSignIn, isMember, shopController.allCategories)
router.post('/categories/page',isSignIn, isMember, shopController.pageCategories)
router.delete('/categories/:category_id',isSignIn, isMember, shopController.deleteCategory);
router.post('/categories/:category_id/products/page',isSignIn, isMember, shopController.categoryPage);
router.post('/products',isSignIn, isMember, shopController.saveProduct);
router.post('/products/page',isSignIn,isMember, shopController.productsPage);
router.get('/products/:product_id/image',isSignIn, isMember, shopController.productImage)
router.delete('/products/:product_id',isSignIn, isMember, shopController.deleteProduct)
router.get('/products/:product_id',isSignIn, isMember, shopController.getProduct);
router.post('/cart',isSignIn, isMember, shopController.addToCart);
router.get('/cart',isSignIn, isMember, shopController.myCart);
router.get('/cart/count',isSignIn, isMember, shopController.countOfCartProducts);
router.post('/cart/:cartproduct_id/count',isSignIn, isMember, shopController.setCartCount)
router.delete('/cart/:cartproduct_id',isSignIn, isMember, shopController.deleteCartProduct);
router.post('/orders/save',isSignIn, isMember, shopController.saveOrder)
router.get('/orders',isSignIn, isMember, shopController.myOrders)
router.post('/orders/page',isSignIn, isMember, shopController.pageOrders)
router.post('/orders/start-pay',isSignIn, isMember, shopController.startPayment)
router.get('/orders/:order_id',isSignIn, isMember, shopController.getOrder)
router.delete('/orders/:order_id',isSignIn, isMember, shopController.deleteOrder);
router.post('/shipOrder', isSignIn, isMember, shopController.shipOrder);

module.exports=router;