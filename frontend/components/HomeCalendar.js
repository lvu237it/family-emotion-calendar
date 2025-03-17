import { useState } from 'react';
import Header from './Header';
import IndexEmotionCalendar from './IndexEmotionCalendar';
import IndexSpecialDaysCalendar from './IndexSpecialDaysCalendar';
import BottomBar from './BottomBar';
import FamilyInformation from './FamilyInformation';
import {
  StyleSheet,
  StatusBar,
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from 'react-native';
import { useCommon } from '../contexts/CommonContext';

function HomeCalendar({ setCalendarType }) {
  return (
    <View style={styles.navigationCalendarWrapper}>
      <TouchableOpacity
        style={styles.navigationCalendarEmotionButton}
        onPress={() => {
          setCalendarType('emotion');
        }}
      >
        <Text style={styles.navigationCalendarButtonText}>Nhật ký cảm xúc</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navigationCalendarSpecialDaysButton}
        onPress={() => {
          setCalendarType('special days');
        }}
      >
        <Text style={styles.navigationCalendarButtonText}>Dịp quan trọng</Text>
      </TouchableOpacity>
    </View>
  );
}

export default HomeCalendar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'center',
  },

  containerWrapper: {
    flex: 1,
    width: '100%',
  },
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
