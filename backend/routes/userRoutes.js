const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/:userId', userController.getUserInformation);

router.post(
  '/register-user',
  userController.checkUserIsExist,
  userController.registerUser
); //ok

router.post('/login', userController.login); //ok

router.patch('/:userId/edit-information', userController.updateProfile); //ok

module.exports = router;
