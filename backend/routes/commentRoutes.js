const express = require('express');
const router = express.Router();

const commentController = require('../controllers/commentController');

// lấy danh sách các comment của các thành viên trong gia đình trong 1 ngày
router.get(
  '/comments-of-family/:familyId/:dateString',
  commentController.getAllCommentsOfFamilyInDay
); //ok

module.exports = router;
