const express = require('express');
const router = express.Router();
const { getSpecialDaysByFamily, addSpecialDay} = require('../controllers/specialDayController');

router.get('/:familyId', getSpecialDaysByFamily);
router.post("/add", addSpecialDay);


module.exports = router;
