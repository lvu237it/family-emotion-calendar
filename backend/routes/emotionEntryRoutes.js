const express = require('express');
const router = express.Router();
const emotionEntryController = require('../controllers/emotionEntryController');
// const { protect } = require('../utils/auth');

//Router for business logic here
//default: /admin

// router.get('/recipes', protect, adminController.getAllRecipe);
// router.get('/recipes/:recipeId', protect, adminController.getRecipeDetails);
// router.patch(
//   '/recipes/:recipeId/status',
//   protect,
//   adminController.updateRecipeStatus
// );

module.exports = router;
