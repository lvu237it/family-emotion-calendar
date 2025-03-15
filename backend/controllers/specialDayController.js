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

// Lấy danh sách ngày đặc biệt theo ngày
const getSpecialDaysByDate = async (req, res) => {
    try {
        const { date } = req.query; // Nhận ngày từ query params (format: YYYY-MM-DD)

        if (!date) {
            return res.status(400).json({ message: 'Vui lòng cung cấp ngày hợp lệ!' });
        }

        // Tìm kiếm sự kiện có dateString trùng với ngày được chọn
        const specialDays = await SpecialDay.find({ dateString: date })
            .populate('joined_users', 'username avatar') // Lấy thông tin user tham gia
            .populate('createdBy', 'username avatar') // Lấy thông tin người tạo
            .lean(); // Trả về Object thuần JSON

        if (specialDays.length === 0) {
            return res.status(404).json({ message: 'Không có sự kiện nào vào ngày này!' });
        }

        return res.status(200).json({ specialDays });
    } catch (error) {
        return res.status(500).json({ message: 'Lỗi server', error: error.message });
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

// thêm thành viên tham gia hoặc cập nhật name, notes ngày đặc biệt
const updateSpecialDay = async (req, res) => {
    try {
        const { id } = req.params; // ID của SpecialDay
        const { name, notes, joined_users } = req.body; // Dữ liệu cần cập nhật

        // Kiểm tra ID hợp lệ
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID ngày đặc biệt không hợp lệ!' });
        }

        // Tìm SpecialDay theo ID
        const specialDay = await SpecialDay.findById(id).populate('joined_users', 'familyId');
        if (!specialDay) {
            return res.status(404).json({ message: 'Không tìm thấy ngày đặc biệt!' });
        }

        // Tạo object chứa các trường cần cập nhật
        let updateFields = {};
        if (name) updateFields.name = name;
        if (notes) updateFields.notes = notes;

        if (joined_users && Array.isArray(joined_users)) {
            // Lấy danh sách user hiện tại trong SpecialDay
            const existingUserIds = specialDay.joined_users.map(user => user._id.toString());
            const familyId = specialDay.joined_users[0]?.familyId; // Lấy `familyId` của user đầu tiên

            // Lọc user hợp lệ: 
            // - Không trùng lặp 
            // - Phải thuộc cùng `familyId`
            const validUserIds = [];
            for (const userId of joined_users) {
                const user = await User.findById(userId);
                if (!user) continue; // Bỏ qua user không tồn tại

                if (existingUserIds.includes(userId)) {
                    console.log(`User ${userId} đã có trong danh sách, bỏ qua.`);
                    continue; // Bỏ qua user đã có trong danh sách
                }

                if (user.familyId.toString() !== familyId.toString()) {
                    console.log(`User ${userId} không thuộc cùng gia đình, bỏ qua.`);
                    continue; // Bỏ qua user không cùng familyId
                }

                validUserIds.push(user._id);
            }

            updateFields.joined_users = [...existingUserIds, ...validUserIds];
        }

        // Kiểm tra nếu không có gì thay đổi
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: 'Không có thông tin nào để cập nhật!' });
        }

        // Cập nhật SpecialDay
        const updatedSpecialDay = await SpecialDay.findByIdAndUpdate(
            id, 
            { $set: updateFields }, 
            { new: true } // Trả về document sau khi update
        ).populate('joined_users', 'username avatar');

        return res.status(200).json({ 
            message: 'Cập nhật ngày đặc biệt thành công!',
            specialDay: updatedSpecialDay 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};





module.exports = { getSpecialDaysByFamily, addSpecialDay ,getSpecialDaysByDate, updateSpecialDay};
