const mongoose = require('mongoose');

const calendarSchema = new mongoose.Schema({
  dateStringArray: [
    {
      type: String, // Định dạng 'YYYY-MM-DD'
      required: true,
    },
  ],
  familyId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Family',
    required: true,
  },
  calendarType: {
    type: String,
    enum: ['emotion', 'special days'],
  },
});

const Calendar = mongoose.model('Calendar', calendarSchema);
module.exports = Calendar;
