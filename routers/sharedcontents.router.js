const router=require('express').Router();
const sharedcontentsController=require('../controllers/sharedcontents.controller')
router.post('/save',sharedcontentsController.saveContent);
router.get('/all',sharedcontentsController.allContents);
router.post('/page',sharedcontentsController.pageContents);
router.get('/categories',sharedcontentsController.allCategories);
router.post('/categories',sharedcontentsController.saveCategory);
router.get('/media/:id',sharedcontentsController.sendContentMedia);
router.get('/:id',sharedcontentsController.getContent);
router.delete('/:id',sharedcontentsController.deleteContent);

module.exports=router;