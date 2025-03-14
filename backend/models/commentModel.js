const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  photo: {
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
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
  },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
