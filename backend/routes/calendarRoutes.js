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
module.exports = router;
