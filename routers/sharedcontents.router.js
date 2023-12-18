const router=require('express').Router();
const sharedcontentsController=require('../controllers/sharedcontents.controller')
router.post('/save',sharedcontentsController.saveContent);
router.get('/categories',sharedcontentsController.allCategories);
router.post('/categories',sharedcontentsController.saveCategory);
router.get('/:id',sharedcontentsController.getContent);
router.delete('/:id',sharedcontentsController.deleteContent);

module.exports=router;