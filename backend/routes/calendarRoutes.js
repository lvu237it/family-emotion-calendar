const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');

router.get(
  '/get-calendar-of-family/:familyId',
  calendarController.getEmotionCalendarDataOfFamily
);

router.post(
  '/family/:familyId/create-calendar',
  calendarController.createCalendarForNewFamily
);

router.patch(
  '/family/:familyId/update-special-days-calendar',
  calendarController.updateSpecialDaysCalendar
);

router.patch(
  '/family/:familyId/update-emotion-calendar',
  calendarController.updateEmotionCalendar
);

// Add new routes for emotion updates and comments
router.post('/update-emotion', calendarController.updateEmotion);
router.post('/add-comment', calendarController.addComment);

module.exports = router;
