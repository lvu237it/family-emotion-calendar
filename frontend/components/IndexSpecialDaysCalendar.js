import React, { useEffect, useState } from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useCommon } from '../contexts/CommonContext';
import AddSpecialDay from '../components/AddSpecialDay';

const CalendarScreen = () => {
  const { myFamilyMembers, userId, familyId, apiBaseUrl } = useCommon();
  const [markedDates, setMarkedDates] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventDetails, setEventDetails] = useState({});
  const [specialDays, setSpecialDays] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(
        `http://${apiBaseUrl}/special-days/${familyId}`
      );
      const data = await response.json();

      const formattedDates = {};
      const eventsMap = {};

      data.forEach((event) => {
        formattedDates[event.dateString] = {
          marked: true,
          dotColor: 'red',
          customStyles: {
            container: { backgroundColor: '#ffeb3b', borderRadius: 10 },
            text: { color: 'black', fontWeight: 'bold' },
          },
        };
        eventsMap[event.dateString] = event;
      });

      setMarkedDates(formattedDates);
      setEventDetails(eventsMap);
      setLoading(false);
    } catch (error) {
      // console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const handleEventAdded = (newEvent) => {
    setSpecialDays((prev) => [...prev, newEvent]);

    // Cập nhật hiển thị ngay lập tức
    setMarkedDates((prev) => ({
      ...prev,
      [newEvent.dateString]: {
        marked: true,
        dotColor: 'red',
        customStyles: {
          container: { backgroundColor: '#ffeb3b', borderRadius: 10 },
          text: { color: 'black', fontWeight: 'bold' },
        },
      },
    }));

    setEventDetails((prev) => ({
      ...prev,
      [newEvent.dateString]: newEvent,
    }));

    // Gọi API để cập nhật danh sách sự kiện
    fetchEvents();
  };

  const handleJoinEvent = async () => {
    if (!userId || !selectedDate || !eventDetails[selectedDate]) return;

    try {
      const currentUsers = eventDetails[selectedDate]?.joined_users || [];

      // Chỉ lấy danh sách ID thay vì object user
      const currentUserIds = currentUsers.map((user) =>
        typeof user === 'object' ? user._id : user
      );

      const updatedUsers = currentUserIds.includes(userId)
        ? currentUserIds
        : [...currentUserIds, userId];

      const response = await fetch(
        `http://${apiBaseUrl}/special-days/update/${eventDetails[selectedDate]._id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            joined_users: updatedUsers, // Chỉ gửi danh sách ID
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Lỗi API: ${response.status} - ${errorText}`);
      }

      const updatedEvent = await response.json();

      if (!updatedEvent?.specialDay?.joined_users) {
        throw new Error('Dữ liệu trả về từ API không hợp lệ!');
      }

      // Cập nhật state từ dữ liệu phản hồi của backend
      setEventDetails((prevDetails) => ({
        ...prevDetails,
        [selectedDate]: updatedEvent.specialDay,
      }));

      alert('Bạn đã tham gia sự kiện thành công!');
    } catch (error) {
      console.error('Lỗi khi tham gia sự kiện:', error);
      alert(`Tham gia sự kiện thất bại! ${error.message}`);
    }
  };

  if (loading) {
    return (
      <ActivityIndicator
        style={styles.activityIndicatorStyle}
        size='large'
        color='#0000ff'
      />
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}
    >
      <FlatList
        data={(selectedDate && eventDetails[selectedDate]?.joined_users) || []}
        keyExtractor={(item) => item._id}
        keyboardShouldPersistTaps='handled'
        ListHeaderComponent={
          <>
            <View style={styles.calendarWrapper}>
              <Calendar
                markingType={'custom'}
                markedDates={markedDates}
                onDayPress={onDayPress}
              />
            </View>

            <AddSpecialDay
              userId={userId}
              familyId={familyId}
              onEventAdded={handleEventAdded}
            />
          </>
        }
        ListEmptyComponent={
          selectedDate && !eventDetails[selectedDate] ? (
            <Text style={styles.noEventText}>
              Không có sự kiện nào vào ngày này
            </Text>
          ) : null
        }
        ListFooterComponent={
          selectedDate && eventDetails[selectedDate] ? (
            <View style={styles.eventContainer}>
              <Text style={styles.eventTitle}>
                {eventDetails[selectedDate].name}
              </Text>
              <Text style={styles.eventText}>
                📌 Ghi chú: {eventDetails[selectedDate].notes}
              </Text>
              <Text style={styles.eventText}>
                📅 Ngày diễn ra: {selectedDate}
              </Text>

              <Text style={styles.sectionTitle}>👥 Người tham gia:</Text>
              <FlatList
                data={eventDetails[selectedDate].joined_users}
                keyExtractor={(item) => item._id}
                nestedScrollEnabled={true}
                renderItem={({ item }) => (
                  <Text style={styles.userText}>- {item.username} </Text>
                )}
              />

              {!eventDetails[selectedDate].joined_users.some(
                (user) => user._id === userId
              ) && (
                <TouchableOpacity
                  style={styles.joinButton}
                  onPress={handleJoinEvent}
                >
                  <Text style={styles.joinButtonText}>Tham gia sự kiện</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  activityIndicatorStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarWrapper: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginVertical: 20,
    marginHorizontal: 10,
  },
  eventContainer: {
    margin: 20,
    padding: 10,
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  eventTitle: { fontSize: 18, fontWeight: 'bold', color: '#1976d2' },
  eventText: { fontSize: 14, color: '#333', marginBottom: 5 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
  },
  userText: { fontSize: 14, color: '#555' },
  noEventText: {
    marginVertical: 20,
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  joinButton: {
    backgroundColor: '#ff5722',
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  joinButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default CalendarScreen;
