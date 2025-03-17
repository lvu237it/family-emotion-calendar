import { useState } from 'react';
import Header from './Header';
import IndexEmotionCalendar from './IndexEmotionCalendar';
import IndexSpecialDaysCalendar from './IndexSpecialDaysCalendar';
import BottomBar from './BottomBar';
import {
  StyleSheet,
  StatusBar,
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from 'react-native';

function Home() {
  const [calendarType, setCalendarType] = useState('emotion');

  return (
    <SafeAreaView style={styles.container}>
      {/*  Đây là component bao bọc toàn bộ ứng dụng, giúp SafeAreaView hoạt động chính xác. */}
      <Header />
      <View style={styles.containerWrapper}>
        <View style={styles.navigationCalendarWrapper}>
          <TouchableOpacity
            style={styles.navigationCalendarEmotionButton}
            onPress={() => {
              setCalendarType('emotion');
            }}
          >
            <Text style={styles.navigationCalendarButtonText}>
              Nhật ký cảm xúc
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navigationCalendarSpecialDaysButton}
            onPress={() => {
              setCalendarType('special days');
            }}
          >
            <Text style={styles.navigationCalendarButtonText}>
              Dịp quan trọng
            </Text>
          </TouchableOpacity>
        </View>
        {calendarType === 'emotion' && <IndexEmotionCalendar />}
        {calendarType === 'special days' && <IndexSpecialDaysCalendar />}
        <StatusBar style='auto' />
      </View>
      <BottomBar />
    </SafeAreaView>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'center',
  },

  containerWrapper: { flex: 1 },
  headerSafeArea: {
    backgroundColor: '#fff',
  },
  navigationCalendarWrapper: {
    width: '90%',
    flexDirection: 'row',
    gap: 20,
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'center',
  },
  navigationCalendarEmotionButton: {
    flex: 1,
    backgroundColor: '#E9D0ED',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  navigationCalendarSpecialDaysButton: {
    flex: 1,
    backgroundColor: '#9EE5EE',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  navigationCalendarButtonText: {
    textAlign: 'center',
    color: 'black',
    fontWeight: '500',
    fontSize: 14,
  },
});
