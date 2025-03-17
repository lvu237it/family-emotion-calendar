import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { Input, Button, Card } from 'react-native-elements';
import { DatePickerModal } from 'react-native-paper-dates';
import { Provider } from 'react-native-paper';
import { useCommon } from '../contexts/CommonContext';

const AddSpecialDay = ({ userId, onEventAdded, familyId }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState(null);
  const [notes, setNotes] = useState('');
  const [open, setOpen] = useState(false);
  const { apiBaseUrl } = useCommon();

  const handleCreateSpecialDay = async () => {
    if (!name || !date || !familyId || !userId) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    const formattedDate = date
      ? new Date(date.getTime() - date.getTimezoneOffset() * 60000)
          .toISOString()
          .split('T')[0]
      : null;

    // Đảm bảo `joined_users` và `notes` có giá trị hợp lệ
    const requestBody = {
      name,
      notes: notes || null, // Nếu rỗng, gửi `null`
      dateString: formattedDate,
      joined_users: [], // Bạn có thể cập nhật danh sách này nếu có dữ liệu
      createdBy: userId,
      familyId,
    };

    try {
      const response = await fetch(`http://${apiBaseUrl}/special-days/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      Alert.alert('Thành công', 'Ngày đặc biệt đã được thêm!');
      onEventAdded(data.specialDay);

      setName('');
      setDate(null);
      setNotes('');
    } catch (error) {
      Alert.alert('Lỗi', `Không thể tạo sự kiện: ${error.message}`);
    }
  };

  return (
    <Provider>
      <Card containerStyle={styles.card}>
        <Text style={styles.title}>Thêm Ngày Đặc Biệt</Text>

        <Input
          label='Tên sự kiện'
          placeholder='Nhập tên sự kiện'
          value={name}
          onChangeText={setName}
          leftIcon={{
            type: 'font-awesome',
            name: 'calendar',
            color: '#2E86C1',
          }}
        />

        <Button
          title='Chọn Ngày'
          onPress={() => setOpen(true)}
          buttonStyle={styles.dateButton}
        />
        <Text style={styles.dateText}>
          {date
            ? new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                .toISOString()
                .split('T')[0]
            : 'Chưa chọn ngày'}
        </Text>

        <DatePickerModal
          locale='vi'
          mode='single'
          visible={open}
          onDismiss={() => setOpen(false)}
          date={date}
          onConfirm={(params) => {
            setDate(params.date);
            setOpen(false);
          }}
        />

        <Input
          label='Ghi chú'
          placeholder='Nhập ghi chú (nếu có)'
          value={notes}
          onChangeText={setNotes}
          multiline={true}
          leftIcon={{ type: 'font-awesome', name: 'pencil', color: '#2E86C1' }}
        />

        <Button
          title='Thêm Ngày Đặc Biệt'
          onPress={handleCreateSpecialDay}
          buttonStyle={styles.button}
        />
      </Card>
    </Provider>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#2E86C1',
  },
  dateButton: {
    backgroundColor: '#2E86C1',
    borderRadius: 8,
    marginTop: 10,
    paddingVertical: 10,
  },
  dateText: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#2E86C1',
    borderRadius: 8,
    paddingVertical: 12,
  },
});

export default AddSpecialDay;
