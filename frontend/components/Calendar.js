import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import {
  formatDate,
  isToday,
  isPastDate,
  formatDisplayDate,
} from '../utils/emotionUtils';

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Calendar = ({ datesWithEntries = [], onSelectDate, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);

  useEffect(() => {
    buildCalendar(currentMonth);
  }, [currentMonth, datesWithEntries]);

  const buildCalendar = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dayOffset = firstDayOfMonth.getDay();

    const days = Array(dayOffset).fill(null);

    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      const dateString = formatDate(dayDate);

      days.push({
        date: dateString,
        dayOfMonth: i,
        isCurrentMonth: true,
        isToday: isToday(dateString),
        isPast: isPastDate(dateString),
        hasEntry: datesWithEntries.includes(dateString),
      });
    }

    const remainingDays = 7 - (days.length % 7);
    if (remainingDays < 7) {
      for (let i = 1; i <= remainingDays; i++) {
        days.push(null);
      }
    }

    setCalendarDays(days);
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleDayClick = (day) => {
    if (!day || day.isPast) return;
    onSelectDate(day.date);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={prevMonth} style={styles.navButton}>
          <AntDesign name='arrowleft' size={20} color='black' />
        </Pressable>

        <View style={styles.headerTitle}>
          <Feather name='calendar' size={18} color='black' />
          <Text style={styles.headerText}>
            {currentMonth.toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </Text>
        </View>

        <Pressable onPress={nextMonth} style={styles.navButton}>
          <AntDesign name='arrowright' size={20} color='black' />
        </Pressable>
      </View>

      <View style={styles.weekDays}>
        {weekDays.map((day) => (
          <Text key={day} style={styles.weekDay}>
            {day}
          </Text>
        ))}
      </View>

      <View style={styles.daysGrid}>
        {calendarDays.map((day, index) => (
          <Pressable
            key={index}
            style={[
              styles.day,
              day?.isToday && styles.today,
              day?.isPast && styles.pastDay,
              selectedDate === day?.date && styles.selectedDay,
              day?.hasEntry && styles.hasEntry,
            ]}
            onPress={() => day && handleDayClick(day)}
          >
            <Text style={styles.dayText}>{day?.dayOfMonth}</Text>
          </Pressable>
        ))}
      </View>

      {selectedDate && (
        <View style={styles.selectedDateContainer}>
          <Text style={styles.selectedDateText}>
            {formatDisplayDate(selectedDate)}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    margin: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  navButton: {
    padding: 8,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '500',
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  weekDay: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    width: 32,
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
  },
  day: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    margin: 4,
  },
  dayText: {
    fontSize: 14,
  },
  today: {
    borderWidth: 2,
    borderColor: '#007bff',
  },
  pastDay: {
    opacity: 0.5,
  },
  selectedDay: {
    backgroundColor: '#007bff',
  },
  hasEntry: {
    backgroundColor: '#f0f0f0',
  },
  selectedDateContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default Calendar;
