const express = require('express');
const router = express.Router();
const emotionEntryController = require('../controllers/emotionEntryController');

// Lấy danh sách các emoji (emotion entries) của các thành viên trong gia đình trong một ngày
router.get(
  '/emojis-of-family/:familyId/:dateString',
  emotionEntryController.getFamilyEmojisInDay
); //ok

//Ghi lại emotion của bạn trong ngày
router.post(
  '/record-your-emoji-in-day/:userId',
  emotionEntryController.addYourEmotionInDay
); //ok

// Route để cập nhật cảm xúc của người dùng và tính toán tỷ lệ cảm xúc tổng hợp của gia đình
router.post(
  '/update-emotion/family/:familyId/user/:userId',
  emotionEntryController.updateUserEmotion
);

// Cập nhật lại cảm xúc của bạn trong ngày
router.patch(
  '/update-your-emoji-in-day/:userId',
  emotionEntryController.updateYourEmotionInDay
); //ok

module.exports = router;
