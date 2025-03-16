const EmotionEntry = require('../models/emotionEntryModel');
const Calendar = require('../models/calendarModel');
const User = require('../models/userModel');
const Comment = require('../models/commentModel');

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

// Helper function to map emoji text to display emoji
const mapEmojiToDisplay = (emojiText) => {
  const emojiMap = {
    Happy: '😊',
    Sad: '😢',
    Angry: '😡',
    Tired: '😴',
    Joyful: '😂',
    Surprised: '😮',
    Anxious: '😰',
    Loved: '❤️',
    Peaceful: '😌',
    Thoughtful: '🤔',
  };
  return emojiMap[emojiText] || '';
};

// Helper function to get complete family data
const getFamilyData = async (familyId, date) => {
  // Get all family members
  const familyMembers = await User.find({ familyId });
  const userIds = familyMembers.map((member) => member._id);

  // Get all emotion entries for this date
  const emotionEntries = await EmotionEntry.find({
    dateString: date,
    userId: { $in: userIds },
  });

  // Get all comments for this date
  const comments = await Comment.find({
    dateString: date,
    userId: { $in: userIds },
  }).sort({ createdAt: 1 });

  // Format member emotions and calculate statistics
  const memberEmotions = {};
  const emotionStats = {
    Happy: 0,
    Sad: 0,
    Angry: 0,
    Tired: 0,
    Joyful: 0,
    Surprised: 0,
    Anxious: 0,
    Loved: 0,
    Peaceful: 0,
    Thoughtful: 0,
  };

  emotionEntries.forEach((entry) => {
    const member = familyMembers.find(
      (m) => m._id.toString() === entry.userId.toString()
    );
    if (member) {
      // Add member emotion
      memberEmotions[member.username] = {
        emoji: mapEmojiToDisplay(entry.emoji),
        note: entry.notes,
        username: member.username,
      };
      // Count emotions
      emotionStats[entry.emoji] = (emotionStats[entry.emoji] || 0) + 1;
    }
  });

  // Calculate percentages
  const totalVotes = emotionEntries.length;
  const emotionPercentages = {};
  Object.entries(emotionStats).forEach(([emoji, count]) => {
    if (count > 0) {
      // Only include emotions that have votes
      emotionPercentages[emoji] = Math.round((count / totalVotes) * 100);
    }
  });

  // Debug information
  console.log('getFamilyData Debug:');
  console.log('Family Members:', familyMembers.length);
  console.log('Emotion Entries:', emotionEntries.length);
  console.log('Member Emotions:', memberEmotions);
  console.log('Emotion Stats:', emotionStats);
  console.log('Emotion Percentages:', emotionPercentages);

  return {
    members: familyMembers.map((member) => ({
      id: member._id,
      name: member.username,
      avatar: member.avatar,
    })),
    calendar: {
      [date]: {
        ...memberEmotions,
        emotionStats: emotionPercentages,
        discussion: {
          comments: comments.map((comment) => ({
            userId: comment.userId,
            text: comment.content,
            timestamp: comment.createdAt,
          })),
        },
      },
    },
  };
};

// Cập nhật hoặc tạo mới cảm xúc của người dùng và tính toán cảm xúc tổng hợp cho gia đình
exports.updateUserEmotion = async (req, res) => {
  try {
    const { dateString, emoji, notes } = req.body;
    const { userId, familyId } = req.params;

    if (!userId || !familyId || !dateString || !emoji) {
      return res.status(400).json({
        message: 'Missing required fields',
        status: 400,
      });
    }

    // Get or create emotion calendar
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

    // Update or create emotion entry
    await EmotionEntry.findOneAndUpdate(
      { userId, dateString },
      {
        emoji,
        notes,
        dateString,
        userId,
      },
      { upsert: true, new: true }
    );

    // Get complete updated family data
    const familyData = await getFamilyData(familyId, dateString);

    res.status(200).json({
      message: 'Emotion updated successfully',
      data: {
        [familyId]: familyData,
      },
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
exports.getFamilyEmojisInDay = async (req, res) => {
  try {
    const { familyId, dateString } = req.params;
    const familyData = await getFamilyData(familyId, dateString);

    res.status(200).json({
      data: {
        [familyId]: familyData,
      },
    });
  } catch (error) {
    console.error('Error getting family emojis:', error);
    res.status(500).json({
      message: 'Error getting family emojis',
      error: error.message,
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
