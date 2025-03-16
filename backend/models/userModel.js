const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true, // Loại bỏ khoảng trắng đầu & cuối
    },
    avatar: {
      type: String,
      default: '/placeholder.svg',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true, // Loại bỏ khoảng trắng đầu & cuối
      // lowercase: true, // Chuyển về chữ thường
      // match: [
      //   /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      //   'Please enter a valid email address',
      // ], // Regex kiểm tra email hợp lệ
    },
    password: {
      type: String,
      required: true,
      // minlength: 6, // Độ dài tối thiểu cho mật khẩu
    },
    familyId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Family',
      required: true,
    },
  },
  { timestamps: true } // Tự động quản lý createdAt & updatedAt
);

const User = mongoose.model('User', userSchema);

module.exports = User;
