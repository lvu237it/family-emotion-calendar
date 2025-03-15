const User = require('../models/userModel');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

exports.getUserInformation = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return res.status(404).json({
        message: 'Người dùng không tồn tại',
        status: 404,
      });
    }

    return res.status(200).json({
      message: 'Lấy thông tin người dùng thành công',
      status: 200,
      data: existingUser,
    });
  } catch (error) {
    console.error('Lỗi khi kiểm tra tài khoản người dùng', error);
    return res.status(500).json({
      message: 'Lỗi máy chủ',
      status: 500,
    });
  }
};

exports.checkUserIsExist = async (req, res, next) => {
  try {
    const { username, email, password, familyId } = req.body;

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Email đã tồn tại. Hãy sử dụng email khác',
        status: 400,
      });
    }

    req.username = username;
    req.email = email;
    req.password = password;
    req.familyId = familyId;

    next();
  } catch (error) {
    console.error('Lỗi khi kiểm tra tài khoản người dùng', error);
    return res.status(500).json({
      message: 'Lỗi máy chủ',
      status: 500,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body; // Chú ý lấy thông tin từ req.body thay vì req.email

    // Kiểm tra xem email có tồn tại không
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: 'Email không tồn tại trong hệ thống',
        status: 400,
      });
    }

    // Kiểm tra mật khẩu
    if (user.password !== password) {
      return res.status(400).json({
        message: 'Mật khẩu không đúng',
        status: 400,
      });
    }

    // Trả về kết quả khi đăng nhập thành công
    return res.status(200).json({
      message: 'Đăng nhập thành công',
      status: 200,
      data: user,
    });
  } catch (error) {
    console.log('Lỗi khi đăng nhập tài khoản người dùng', error);
    return res.status(500).json({
      message: 'Lỗi khi đăng nhập tài khoản người dùng',
      status: 500,
      error,
    });
  }
};

exports.registerUser = async (req, res, next) => {
  // "username": "vulv","password": "123456","email": "luuvanvua7k16vt@gmail.com","familyId": "67d2bed97b36eb9903fb29a8"
  try {
    const { username, email, password, familyId } = req.body;

    // Cast familyId thành ObjectId
    const familyObjectId = ObjectId.createFromHexString(familyId);

    const resultCreated = await User.create({
      username,
      email,
      password,
      familyId: familyObjectId,
    });

    // Trả về kết quả hiển thị dưới dạng json
    return res.status(200).json({
      message: 'success',
      status: 200,
      data: resultCreated,
    });
  } catch (error) {
    console.log('Lỗi khi tạo tài khoản người dùng', error);
    return res.status(500).json({
      message: 'Lỗi khi tạo tài khoản người dùng',
      status: 500,
      error,
    });
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { username, email, password, avatar } = req.body;
    const { userId } = req.params;

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    // Cập nhật dữ liệu người dùng
    const updateData = {
      username,
      email,
      password,
      avatar,
      updatedAt: Date.now(),
    };

    // Thực hiện cập nhật
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    return res.status(200).json({
      message: 'Cập nhật thông tin thành công',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin:', error);
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message });
  }
};
