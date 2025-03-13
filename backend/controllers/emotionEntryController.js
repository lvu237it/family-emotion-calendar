const EmotionEntry = require('../models/emotionEntryModel');
const User = require('../models/userModel');

//Ghi lại emotion của bạn
exports.addYourEmotionInDay = async (req, res, next) => {
  try {
    const { emoji, notes, dateString } = req.body;
    const { userId } = req.params;

    if (!emoji || !dateString || !userId) {
      return res.status(400).json({ message: 'Thiếu thông tin cần thiết' });
    }

    // Kiểm tra xem người dùng đã chọn emoji vào ngày này chưa
    const existingEmotion = await EmotionEntry.findOne({ userId, dateString });

    if (existingEmotion) {
      return res
        .status(400)
        .json({ message: 'Bạn đã chọn emoji cho ngày này rồi!' });
    }

    // Tạo mới một emotion entry
    const newEmotion = new EmotionEntry({
      emoji,
      notes,
      dateString,
      userId,
    });

    await newEmotion.save();

    res.status(201).json({
      message: 'Cảm xúc của bạn đã được lưu thành công!',
      data: newEmotion,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi lưu cảm xúc!',
      error: error.message,
    });
  }
};

exports.updateYourEmotionInDay = async (req, res, next) => {
  try {
    const { emoji, notes, dateString } = req.body;
    const { userId } = req.params;

    if (!emoji || !dateString || !userId) {
      return res.status(400).json({ message: 'Thiếu thông tin cần thiết' });
    }

    // Tìm cảm xúc của người dùng trong ngày này
    const existingEmotion = await EmotionEntry.findOne({ userId, dateString });

    if (!existingEmotion) {
      return res
        .status(404)
        .json({ message: 'Không tìm thấy cảm xúc của bạn trong ngày này!' });
    }

    // Cập nhật emoji và ghi chú mới
    existingEmotion.emoji = emoji;
    existingEmotion.notes = notes || existingEmotion.notes; // Nếu có ghi chú mới thì cập nhật

    await existingEmotion.save();

    res.status(200).json({
      message: 'Cập nhật cảm xúc thành công!',
      data: existingEmotion,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi cập nhật cảm xúc!',
      error: error.message,
    });
  }
};

// Lấy danh sách các emoji (emotion entries) của các thành viên trong gia đình trong một ngày
exports.getFamilyEmojisInDay = async (req, res, next) => {
  try {
    const { familyId, dateString } = req.params;

    // Lấy danh sách thành viên của gia đình
    const members = await User.find({ familyId });
    console.log('members:', members);

    // Nếu không tìm thấy thành viên nào trong gia đình
    if (!members || members.length === 0) {
      return res.status(404).json({
        message: 'Không có thành viên nào trong gia đình',
        status: 404,
      });
    }

    const emojis = await EmotionEntry.find({
      userId: { $in: members.map((member) => member._id) },
      dateString, // Kiểm tra nếu dateString trong EmotionEntry có khớp
    }).populate('userId', 'username avatar email');

    return res.status(200).json({
      message: 'Danh sách emoji của các thành viên trong gia đình',
      status: 200,
      data: emojis,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Lỗi khi lấy danh sách emoji của gia đình',
      status: 500,
      error: err.message,
    });
  }
};
