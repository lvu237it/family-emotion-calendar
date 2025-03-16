const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
    },
    dateString: {
      type: String,
      required: true,
      index: true, // Tạo index để truy vấn nhanh hơn
    },
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
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
  },
  { timestamps: true } // Tự động thêm createdAt & updatedAt
);

// Middleware để cập nhật updatedAt khi chỉnh sửa
commentSchema.pre('save', function (next) {
  if (!this.isNew) {
    this.updatedAt = Date.now();
  }
  next();
});

// Plugin soft delete
commentSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
