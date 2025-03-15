const mongoose = require('mongoose');
const SpecialDay = require('../models/specialDayModel');
const User = require('../models/userModel');

// Lấy danh sách ngày đặc biệt theo familyId
const getSpecialDaysByFamily = async (req, res) => {
	try {
		const { familyId } = req.params;
		const specialDays = await SpecialDay.find({ familyId })
			.populate('joined_users', 'username email')
			.populate('createdBy', 'username email');

		res.status(200).json(specialDays);
	} catch (error) {
		res.status(500).json({ message: 'Lỗi server', error: error.message });
	}
};

// Thêm ngày lễ đặc biệt
const addSpecialDay = async (req, res) => {
	try {
		const { name, notes, dateString, joined_users, status, createdBy, familyId } = req.body;


		// Kiểm tra nếu thiếu thông tin bắt buộc
		if (!name || !notes || !dateString || !familyId) {
			return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin!' });
		}

		// Kiểm tra xem familyId có hợp lệ không
		if (!mongoose.Types.ObjectId.isValid(familyId)) {
			return res.status(400).json({ message: 'familyId không hợp lệ!' });
		}

		// Kiểm tra danh sách joined_users và chuyển đổi thành ObjectId
		let validJoinedUsers = [];
		if (Array.isArray(joined_users) && joined_users.length > 0) {
			const users = await User.find({
				_id: { $in: joined_users.map(id => new mongoose.Types.ObjectId(id)) }
			});
			

			validJoinedUsers = users.map(user => user._id);
		}


		// Tạo mới ngày lễ đặc biệt
		const newSpecialDay = new SpecialDay({
			name,
			notes,
			dateString,
			joined_users: validJoinedUsers, // ✅ Lưu danh sách ObjectId
			status: status || 'Future',
			createdBy,
			familyId
		});

		await newSpecialDay.save();

		return res.status(201).json({ 
			message: 'Thêm ngày lễ thành công!', 
			specialDay: newSpecialDay 
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Lỗi server', error: error.message });
	}
};

module.exports = { getSpecialDaysByFamily, addSpecialDay };
