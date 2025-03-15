const express = require('express');
const router = express.Router();
const { getSpecialDaysByFamily, addSpecialDay , getSpecialDaysByDate, updateSpecialDay} = require('../controllers/specialDayController');

router.get('/by-date', getSpecialDaysByDate);
router.get('/:familyId', getSpecialDaysByFamily);
router.put('/update/:id', updateSpecialDay);
router.post("/add", addSpecialDay);


module.exports = router;
