const mongoose = require('mongoose');

const familySchema = new mongoose.Schema(
  {
    familyName: {
      type: String,
      unique: true,
      required: true,
      trim: true, // Loại bỏ khoảng trắng dư thừa
    },
  },
  { timestamps: true } // Tự động thêm createdAt & updatedAt
);

const Family = mongoose.model('Family', familySchema);
module.exports = Family;
