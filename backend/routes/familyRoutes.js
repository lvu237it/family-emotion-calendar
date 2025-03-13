const express = require('express');
const router = express.Router();
const familyController = require('../controllers/familyController');

router.get('/', familyController.getAllFamilies); //ok
router.get('/:familyId', familyController.getYourFamilyByFamilyId); //ok
router.get('/:familyId/members', familyController.getFamilyMembers); //ok
router.post('/register-family', familyController.registerFamily); //ok
router.patch('/:familyId/edit-information', familyController.updateFamily); //ok

module.exports = router;
