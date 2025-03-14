const mongoose = require('mongoose');

const specialDaySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    required: true,
  },
  dateString: {
    //Ngày diễn ra event - sự kiện quan trọng
    type: String,
    required: true,
  },
  joined_users: [
    //Danh sách các thành viên tham gia ngày quan trọng
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
  ],
  status: {
    //Quá khứ, Hiện tại, Tương lai
    type: String,
    enum: ['Past', 'Today', 'Future'],
    default: 'Future',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
  },
  createdBy: {
    //Người tạo
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
  },
});

const SpecialDay = mongoose.model('SpecialDay', specialDaySchema);

module.exports = SpecialDay;
