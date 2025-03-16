const mongoose = require('mongoose');

const emotionEntrySchema = new mongoose.Schema(
  {
    emoji: {
      type: String,
      enum: [
        'Happy',
        'Sad',
        'Angry',
        'Tired',
        'Joyful',
        'Surprised',
        'Anxious',
        'Loved',
        'Peaceful',
        'Thoughtful',
      ],
      required: true, // Cảm xúc không nên để trống
    },
    notes: {
      type: String,
      trim: true, // Loại bỏ khoảng trắng thừa
    },
    dateString: {
      type: String,
      required: true,
      index: true, // Tạo index để tìm kiếm nhanh hơn
    },
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true } // Tự động thêm createdAt & updatedAt
);

// Middleware để cập nhật updatedAt khi chỉnh sửa
emotionEntrySchema.pre('save', function (next) {
  if (!this.isNew) {
    this.updatedAt = Date.now();
  }
  next();
});

const EmotionEntry = mongoose.model('EmotionEntry', emotionEntrySchema);
module.exports = EmotionEntry;
