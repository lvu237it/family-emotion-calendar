const EmotionEntry = require('../models/emotionEntryModel');
const Calendar = require('../models/calendarModel');
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

// Cập nhật hoặc tạo mới cảm xúc của người dùng và tính toán cảm xúc tổng hợp cho gia đình
exports.updateUserEmotion = async (req, res) => {
  try {
    const { dateString, emoji, notes } = req.body;
    const { userId, familyId } = req.params;

    // Validate required fields
    if (!userId || !familyId || !dateString || !emoji) {
      return res.status(400).json({
        message: 'Missing required fields',
        status: 400,
      });
    }

    // Step 1: Get or create emotion calendar for the family
    let calendar = await Calendar.findOne({
      familyId,
      calendarType: 'emotion',
    });

    if (!calendar) {
      calendar = await Calendar.create({
        familyId,
        calendarType: 'emotion',
        dateStringArray: [dateString],
      });
    } else if (!calendar.dateStringArray.includes(dateString)) {
      calendar.dateStringArray.push(dateString);
      await calendar.save();
    }

    // Step 2: Update or create emotion entry
    await EmotionEntry.findOneAndUpdate(
      { userId, dateString: dateString },
      {
        emoji,
        notes,
        dateString: dateString,
        userId,
      },
      { upsert: true, new: true }
    );

    // Step 3: Get all family members
    const familyMembers = await User.find({ familyId });
    const userIds = familyMembers.map((member) => member._id);

    // Step 4: Get all emotion entries for this date
    const allEmotionEntries = await EmotionEntry.find({
      dateString: dateString,
      userId: { $in: userIds },
    });

    // Step 5: Tạo danh sách cảm xúc theo người dùng
    const emotionDetails = allEmotionEntries.map((entry) => {
      const member = familyMembers.find(
        (m) => m._id.toString() === entry.userId.toString()
      );
      return {
        _id: member?._id,
        username: member?.username,
        avatar: member?.avatar,
        email: member?.email,
        createdAt: member?.createdAt,
        updatedAt: member?.updatedAt || null,
        emoji: entry.emoji,
        note: entry.notes,
      };
    });

    // Step 6: Format response data
    const formattedData = {
      [familyId]: {
        members: familyMembers.map((member) => ({
          id: member._id,
          name: member.username,
          avatar: member.avatar,
        })),
        calendar: {
          [dateString]: {
            emotionStats: emotionDetails, // Trả về danh sách chi tiết thay vì phần trăm
            memberEmotions: allEmotionEntries.reduce((acc, entry) => {
              const member = familyMembers.find(
                (m) => m._id.toString() === entry.userId.toString()
              );
              if (member) {
                acc[member.username] = {
                  emoji: entry.emoji,
                  note: entry.notes,
                  username: member.username,
                };
              }
              return acc;
            }, {}),
          },
        },
      },
    };

    // Step 7: Send response
    res.status(200).json({
      message: 'Emotion updated successfully',
      data: formattedData,
      emotionPercentages: emotionDetails, // Trả về dạng mảng như mong muốn
    });
  } catch (error) {
    console.error('Error updating emotion:', error);
    res.status(500).json({
      message: 'Error updating emotion',
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

    return res.status(200).json(emojis);
  } catch (err) {
    res.status(500).json({
      message: 'Lỗi khi lấy danh sách emoji của gia đình',
      status: 500,
      error: err.message,
    });
  }
};

// Get emotion entries for a specific date and family
exports.getEmotionsByDate = async (req, res) => {
  try {
    const { familyId, date } = req.params;

    // Get all family members
    const familyMembers = await User.find({ familyId });
    const userIds = familyMembers.map((member) => member._id);

    // Get all emotion entries for the date
    const emotionEntries = await EmotionEntry.find({
      dateString: date,
      userId: { $in: userIds },
    });

    // Calculate statistics
    const emotionStats = {};
    let totalVotes = emotionEntries.length;

    emotionEntries.forEach((entry) => {
      emotionStats[entry.emoji] = (emotionStats[entry.emoji] || 0) + 1;
    });

    const emotionPercentages = {};
    Object.entries(emotionStats).forEach(([emoji, count]) => {
      emotionPercentages[emoji] = Math.round((count / totalVotes) * 100);
    });

    // Format response
    const formattedData = {
      date,
      emotionStats: emotionPercentages,
      entries: emotionEntries.map((entry) => {
        const member = familyMembers.find(
          (m) => m._id.toString() === entry.userId.toString()
        );
        return {
          userId: entry.userId,
          username: member ? member.username : 'Unknown',
          emoji: entry.emoji,
          note: entry.notes,
          timestamp: entry.createdAt,
        };
      }),
    };

    res.status(200).json(formattedData);
  } catch (error) {
    console.error('Error getting emotions:', error);
    res.status(500).json({
      message: 'Error getting emotions',
      error: error.message,
    });
  }
};
