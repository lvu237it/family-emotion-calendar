const AppError = require('../utils/appError');
const Family = require('../models/familyModel');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/userModel'); // Import User model

exports.registerFamily = async (req, res, next) => {
  try {
    const { familyName } = req.body;

    // Tạo familyName với định dạng familyName + "-" + uuid
    const formattedFamilyName = `${familyName}-${uuidv4()}`;

    const resultCreated = await Family.create({
      familyName: formattedFamilyName,
    });

    // Trả về kết quả hiển thị dưới dạng json
    return res.status(200).json(resultCreated);
  } catch (error) {
    console.log('Lỗi khi tạo family', error);
    return res.status(500).json({
      message: 'error',
      status: 500,
      error,
    });
  }
};

// Lấy danh sách tất cả các gia đình
exports.getAllFamilies = async (req, res, next) => {
  try {
    const families = await Family.find();
    res.status(200).json(families);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getYourFamilyByFamilyId = async (req, res, next) => {
  try {
    const { familyId } = req.params;

    const family = await Family.findById(familyId);

    if (!family)
      return res.status(404).json({ message: 'Không tìm thấy family' });
    res.status(200).json(family);
  } catch (error) {
    console.log('Lỗi khi lấy thông tin family', error);
    return res.status(500).json({
      message: 'Lỗi khi lấy thông tin family',
      status: 500,
      error: error.message,
    });
  }
};

exports.getYourFamilyByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Tìm user dựa trên userId để lấy familyId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    // Dùng familyId từ user để tìm family
    const family = await Family.findById(user.familyId);
    if (!family) {
      return res.status(404).json({ message: 'Không tìm thấy gia đình' });
    }

    res.status(200).json(family);
  } catch (error) {
    console.error('Lỗi khi lấy thông tin gia đình:', error);
    return res.status(500).json({
      message: 'Lỗi khi lấy thông tin gia đình',
      error: error.message,
    });
  }
};

//Lấy danh sách các thành viên trong 1 gia đình
exports.getFamilyMembers = async (req, res, next) => {
  try {
    const { familyId } = req.params;

    // Lấy danh sách thành viên của gia đình theo familyId
    const members = await User.find({ familyId }).select(
      'username avatar email createdAt updatedAt'
    );

    if (members.length === 0) {
      return res.status(404).json({
        message: 'Không có thành viên nào trong gia đình',
        status: 404,
      });
    }

    return res.status(200).json(members);
  } catch (err) {
    res.status(500).json({
      message: 'Lỗi khi lấy danh sách thành viên gia đình',
      status: 500,
      error: err.message,
    });
  }
};

//Cập nhật family name
exports.updateFamily = async (req, res, next) => {
  try {
    const { familyId } = req.params;
    const { familyName } = req.body;

    // Tìm family bằng familyId
    const family = await Family.findById(familyId);

    if (!family) {
      return res.status(404).json({
        message: 'Không tìm thấy gia đình',
        status: 404,
      });
    }

    // Tách familyName cũ thành 6 phần
    const currentFamilyName = family.familyName;
    const familyNameParts = currentFamilyName.split('-');

    // Thay phần tử đầu tiên của mảng với familyName mới
    familyNameParts[0] = familyName;

    // Ghép lại thành familyName mới
    const updatedFamilyName = familyNameParts.join('-');

    // Cập nhật lại familyName với tên mới
    family.familyName = updatedFamilyName;

    // Lưu lại đối tượng gia đình với familyName mới
    await family.save();

    // Trả về kết quả cập nhật thành công
    return res.status(200).json({
      message: 'Cập nhật gia đình thành công',
      status: 200,
      data: family,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Lỗi khi cập nhật gia đình',
      status: 500,
      error: err.message,
    });
  }
};
