const mongoose = require('mongoose');

const emotionEntrySchema = new mongoose.Schema({
  emoji: {
    type: String, //Happy: 😊 , Sad: 😢 , Angry: 😡, Tired: 😴, Joyful: 😂, Surprised: 😮, Anxious: 😰, Loved: ❤️, Peaceful: 😌, Thoughtful: 🤔
  },
  notes: {
    type: String,
  },
  dateString: {
    //so sánh với comment.dateString === emotionEntry.dateString để lấy danh sách emoji hoặc comment của các thành viên trong ngày
    type: String, //chỉ cần là kiểu String để so sánh
    required: true,
  },
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
  },
});

const EmotionEntry = mongoose.model('EmotionEntry', emotionEntrySchema);

module.exports = EmotionEntry;
