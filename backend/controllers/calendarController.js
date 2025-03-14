const Calendar = require('../models/calendarModel');
const Family = require('../models/familyModel');
const Comment = require('../models/commentModel');
const EmotionEntry = require('../models/emotionEntryModel');
const User = require('../models/userModel');

// exports.getEmotionCalendarDataOfFamily = async (req, res, next) => {
//   try {
//     const { familyId } = req.params;
//     console.log('famid', familyId);

//     // Bước 1: Tìm tất cả User thuộc gia đình này
//     const users = await User.find({ familyId });
//     const userIds = users.map((user) => user._id); // Lấy danh sách userId

//     // Bước 2: Truy vấn tất cả EmotionEntry và Comment của các User này
//     const emotionEntries = await EmotionEntry.find({
//       userId: { $in: userIds },
//     });
//     const comments = await Comment.find({ userId: { $in: userIds } });

//     console.log('comments', comments);
//     console.log('emotionEntries', emotionEntries);

//     // Bước 3: Tạo một map để lưu thông tin user (username và avatar)
//     const userMap = {};
//     users.forEach((user) => {
//       userMap[user._id] = {
//         username: user.username,
//         avatar: user.avatar,
//       };
//     });

//     // Bước 4: Hàm ánh xạ emoji thành biểu tượng mặt
//     const mapEmoji = (emoji) => {
//       switch (emoji) {
//         case 'Happy':
//           return '😊';
//         case 'Sad':
//           return '😢';
//         case 'Angry':
//           return '😡';
//         case 'Tired':
//           return '😴';
//         case 'Joyful':
//           return '😂';
//         case 'Surprised':
//           return '😮';
//         case 'Anxious':
//           return '😰';
//         case 'Loved':
//           return '❤️';
//         case 'Peaceful':
//           return '😌';
//         case 'Thoughtful':
//           return '🤔';
//         default:
//           return '';
//       }
//     };

//     // Bước 5: Nhóm dữ liệu theo dateString
//     const calendarData = {};

//     // Xử lý EmotionEntry
//     emotionEntries.forEach((entry) => {
//       const { dateString, userId, emoji, note } = entry;

//       if (!calendarData[dateString]) {
//         calendarData[dateString] = {
//           discussion: { comments: [] },
//         };
//       }

//       // Thêm thông tin user và ánh xạ emoji
//       calendarData[dateString][userMap[userId].username] = {
//         emoji: mapEmoji(emoji),
//         note,
//         username: userMap[userId].username, // Thêm username của user
//       };
//     });

//     // Xử lý Comment
//     comments.forEach((comment) => {
//       const { dateString, userId, content, createdAt } = comment;

//       if (!calendarData[dateString]) {
//         calendarData[dateString] = {
//           discussion: { comments: [] },
//         };
//       }

//       calendarData[dateString].discussion.comments.push({
//         userId,
//         text: content,
//         timestamp: createdAt,
//         username: userMap[userId].username, // Thêm username của user
//       });
//     });

//     return res.status(200).json({ calendar: calendarData });
//   } catch (error) {
//     console.error('Lỗi khi lấy dữ liệu calendar', error);
//     return res.status(500).json({
//       message: 'Lỗi máy chủ',
//       status: 500,
//     });
//   }
// };

///new
exports.getEmotionCalendarDataOfFamily = async (req, res, next) => {
  try {
    const { familyId } = req.params;
    console.log('famid', familyId);

    // Bước 1: Tìm tất cả User thuộc gia đình này
    const users = await User.find({ familyId });
    const userIds = users.map((user) => user._id); // Lấy danh sách userId

    // Bước 2: Truy vấn tất cả EmotionEntry và Comment của các User này
    const emotionEntries = await EmotionEntry.find({
      userId: { $in: userIds },
    });
    const comments = await Comment.find({ userId: { $in: userIds } });

    console.log('comments', comments);
    console.log('emotionEntries', emotionEntries);

    // Bước 3: Tạo một map để lưu thông tin user (username và avatar)
    const userMap = {};
    users.forEach((user) => {
      userMap[user._id] = {
        username: user.username,
        avatar: user.avatar,
      };
    });

    // Bước 4: Hàm ánh xạ emoji thành biểu tượng mặt
    const mapEmoji = (emoji) => {
      switch (emoji) {
        case 'Happy':
          return '😊';
        case 'Sad':
          return '😢';
        case 'Angry':
          return '😡';
        case 'Tired':
          return '😴';
        case 'Joyful':
          return '😂';
        case 'Surprised':
          return '😮';
        case 'Anxious':
          return '😰';
        case 'Loved':
          return '❤️';
        case 'Peaceful':
          return '😌';
        case 'Thoughtful':
          return '🤔';
        default:
          return '';
      }
    };

    // Bước 5: Nhóm dữ liệu theo dateString
    const calendarData = {};

    // Xử lý EmotionEntry
    // emotionEntries.forEach((entry) => {
    //   const { dateString, userId, emoji, note } = entry;

    //   if (!calendarData[dateString]) {
    //     calendarData[dateString] = {
    //       discussion: { comments: [] },
    //     };
    //   }

    //   // Thêm thông tin user và ánh xạ emoji
    //   calendarData[dateString][userId] = {
    //     emoji: mapEmoji(emoji),
    //     note,
    //   };
    // });

    // Xử lý EmotionEntry
    emotionEntries.forEach((entry) => {
      const { dateString, userId, emoji, note } = entry;

      if (!calendarData[dateString]) {
        calendarData[dateString] = {
          discussion: { comments: [] },
        };
      }

      // Thêm thông tin user và ánh xạ emoji
      calendarData[dateString][userMap[userId].username] = {
        emoji: mapEmoji(emoji),
        note,
        username: userMap[userId].username, // Thêm username của user
      };
    });

    // Xử lý Comment
    comments.forEach((comment) => {
      const { dateString, userId, content, createdAt } = comment;

      if (!calendarData[dateString]) {
        calendarData[dateString] = {
          discussion: { comments: [] },
        };
      }

      calendarData[dateString].discussion.comments.push({
        userId,
        text: content,
        timestamp: createdAt.toISOString(), // Đảm bảo định dạng ISO string
      });
    });

    // Bước 6: Tạo response với định dạng giống mockFamilyData
    const responseData = {
      [familyId]: {
        members: users.map((user) => ({
          id: user._id,
          name: user.username,
          avatar: user.avatar,
        })),
        calendar: calendarData,
      },
    };

    return res.status(200).json(responseData);
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu calendar', error);
    return res.status(500).json({
      message: 'Lỗi máy chủ',
      status: 500,
    });
  }
};

// Tạo 2 calendar mặc định cho gia đình mới
exports.createCalendarForNewFamily = async (req, res, next) => {
  try {
    const { familyId } = req.params;

    // Kiểm tra gia đình có tồn tại không
    const existingFamily = await Family.findById(familyId);
    if (!existingFamily) {
      return res.status(404).json({
        message: 'Gia đình không tồn tại',
        status: 404,
      });
    }

    // Kiểm tra xem đã có Calendar nào cho gia đình này chưa
    const existingCalendars = await Calendar.find({ familyId });
    if (existingCalendars.length > 0) {
      return res.status(400).json({
        message: 'Gia đình đã có Calendar, không thể tạo mới',
        status: 400,
      });
    }

    // Tạo 2 bản ghi Calendar mặc định
    const emotionCalendar = await Calendar.create({
      dateStringArray: [], // Mảng rỗng
      calendarType: 'emotion', // Loại Calendar: emotion
      familyId,
    });

    const specialDaysCalendar = await Calendar.create({
      dateStringArray: [], // Mảng rỗng
      calendarType: 'special days', // Loại Calendar: special days
      familyId,
    });

    // Trả về kết quả
    return res.status(200).json({
      message: 'Tạo thành công 2 Calendar mặc định',
      emotionCalendar,
      specialDaysCalendar,
    });
  } catch (error) {
    console.error('Lỗi khi tạo calendar', error);
    return res.status(500).json({
      message: 'Lỗi máy chủ',
      status: 500,
    });
  }
};

exports.updateSpecialDaysCalendar = async (req, res, next) => {
  try {
    const { familyId } = req.params;
    const { dateStringArray } = req.body; // Mảng chứa các ngày mới cần thêm

    // Kiểm tra gia đình có tồn tại không
    const existingFamily = await Family.findById(familyId);
    if (!existingFamily) {
      return res.status(404).json({
        message: 'Gia đình không tồn tại',
        status: 404,
      });
    }

    // Tìm Calendar loại "special days" của gia đình này
    const specialDaysCalendar = await Calendar.findOne({
      familyId,
      calendarType: 'special days',
    });

    if (!specialDaysCalendar) {
      return res.status(404).json({
        message: 'Không tìm thấy Calendar loại special days',
        status: 404,
      });
    }

    // Kiểm tra xem các ngày mới có trùng với ngày đã tồn tại không
    const duplicateDates = dateStringArray.filter((dateString) =>
      specialDaysCalendar.dateStringArray.includes(dateString)
    );

    if (duplicateDates.length > 0) {
      return res.status(400).json({
        message: `Các ngày sau đã tồn tại trong lịch: ${duplicateDates.join(
          ', '
        )}`,
        status: 400,
      });
    }

    // Thêm các ngày mới vào mảng dateStringArray
    specialDaysCalendar.dateStringArray.push(...dateStringArray);
    await specialDaysCalendar.save();

    return res.status(200).json({
      message: 'Cập nhật thành công Calendar loại special days',
      specialDaysCalendar,
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật Calendar loại special days', error);
    return res.status(500).json({
      message: 'Lỗi máy chủ',
      status: 500,
    });
  }
};

exports.updateEmotionCalendar = async (req, res, next) => {
  try {
    const { familyId } = req.params;
    const { dateStringArray } = req.body; // Mảng chứa các ngày mới cần thêm

    // Kiểm tra gia đình có tồn tại không
    const existingFamily = await Family.findById(familyId);
    if (!existingFamily) {
      return res.status(404).json({
        message: 'Gia đình không tồn tại',
        status: 404,
      });
    }

    // Tìm Calendar loại "emotion" của gia đình này
    const emotionCalendar = await Calendar.findOne({
      familyId,
      calendarType: 'emotion',
    });

    if (!emotionCalendar) {
      return res.status(404).json({
        message: 'Không tìm thấy Calendar loại emotion',
        status: 404,
      });
    }

    // Kiểm tra xem các ngày mới có trùng với ngày đã tồn tại không
    const duplicateDates = dateStringArray.filter((dateString) =>
      emotionCalendar.dateStringArray.includes(dateString)
    );

    if (duplicateDates.length > 0) {
      return res.status(400).json({
        message: `Các ngày sau đã tồn tại trong lịch: ${duplicateDates.join(
          ', '
        )}`,
        status: 400,
      });
    }

    // Thêm các ngày mới vào mảng dateStringArray
    emotionCalendar.dateStringArray.push(...dateStringArray);
    await emotionCalendar.save();

    return res.status(200).json({
      message: 'Cập nhật thành công Calendar loại emotion',
      emotionCalendar,
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật Calendar loại emotion', error);
    return res.status(500).json({
      message: 'Lỗi máy chủ',
      status: 500,
    });
  }
};
