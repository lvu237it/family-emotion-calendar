const User = require('../models/userModel');
const Comment = require('../models/commentModel');

// Lấy danh sách comment của các thành viên trong gia đình trong một ngày cụ thể
exports.getAllCommentsOfFamilyInDay = async (req, res, next) => {
  try {
    const { familyId, dateString } = req.params; // Lấy familyId từ URL

    // Lấy danh sách các thành viên của gia đình từ cơ sở dữ liệu
    const members = await User.find({ familyId });

    // Nếu không tìm thấy thành viên nào trong gia đình
    if (!members || members.length === 0) {
      return res.status(404).json({
        message: 'Không có thành viên nào trong gia đình',
        status: 404,
      });
    }

    // Lọc các comment của các thành viên trong gia đình vào ngày cụ thể
    const comments = await Comment.find({
      userId: { $in: members.map((member) => member._id) }, // Lọc theo userId của các thành viên trong gia đình
      dateString, // Lọc theo dateString để lấy comment trong ngày
      isDeleted: false, // Lọc các comment chưa bị xóa
    }).populate('userId', 'username avatar email'); // Populate để lấy thông tin người dùng

    // Trả về danh sách comment
    return res.status(200).json({
      message: 'Danh sách comment của các thành viên trong gia đình',
      status: 200,
      data: comments,
    });
  } catch (err) {
    // Xử lý lỗi
    res.status(500).json({
      message: 'Lỗi khi lấy danh sách comment của gia đình',
      status: 500,
      error: err.message,
    });
  }
};

//Thêm bình luận vào trong đoạn hội thoại của gia đình vào ngày này
exports.addComment = async (req, res, next) => {
  try {
    const { content, photo, dateString } = req.body;
    const { userId } = req.params;

    if (!content || !dateString || !userId) {
      return res.status(400).json({ message: 'Thiếu thông tin cần thiết!' });
    }

    const newComment = new Comment({
      content,
      photo,
      dateString,
      userId,
    });

    await newComment.save();

    res.status(201).json({
      message: 'Thêm bình luận thành công!',
      data: newComment,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi thêm bình luận!',
      error: error.message,
    });
  }
};
