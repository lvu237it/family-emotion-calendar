const mongoose = require('mongoose');

const calendarSchema = new mongoose.Schema(
  {
    dateStringArray: [
      {
        type: String, // Định dạng 'YYYY-MM-DD'
        required: true,
        validate: {
          validator: function (v) {
            return /^\d{4}-\d{2}-\d{2}$/.test(v); // Regex kiểm tra đúng format
          },
          message: (props) =>
            `${props.value} không phải là ngày hợp lệ (YYYY-MM-DD)!`,
        },
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
      required: true, // Đảm bảo luôn có giá trị hợp lệ
    },
  },
  { timestamps: true } // Tự động cập nhật createdAt & updatedAt
);

const Calendar = mongoose.model('Calendar', calendarSchema);
module.exports = Calendar;
