import React, { useState } from 'react';
import { useCalendarEmotion } from '../hooks/useCalendarEmotion';
import Calendar from './Calendar';
import EmotionModal from './EmotionModal';
import FamilyDiscussion from './FamilyDiscussion';
import EmotionSummary from '../components/EmotionSummary';
import { isToday } from '../utils/emotionUtils';

import Entypo from '@expo/vector-icons/Entypo';
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useCommon } from '../contexts/CommonContext';

const IndexEmotionCalendar = () => {
  const {
    familyData,
    loading,
    currentDate,
    userId,
    changeDate,
    getCurrentDayData,
    getUserEmotion,
    updateUserEmotion,
    addComment,
    getDatesWithEntries,
    setUserId,
  } = useCalendarEmotion();
  const { userMenuOpen, setUserMenuOpen } = useCommon();

  const [isEmotionModalOpen, setIsEmotionModalOpen] = useState(false);
  const [calendarType, setCalendarType] = useState('emotion');
  const [isUpdating, setIsUpdating] = useState(false);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <View style={styles.loadingIcon}></View>
          <View style={styles.loadingText}></View>
        </View>
      </View>
    );
  }

  const dayData = getCurrentDayData();
  const userEmotion = getUserEmotion();
  const datesWithEntries = getDatesWithEntries();
  const isTodaySelected = isToday(currentDate);

  const handleEmotionUpdate = async (emoji) => {
    setIsUpdating(true);
    try {
      await updateUserEmotion(emoji);
      // Thêm delay nhỏ để tránh flickering
      await new Promise((resolve) => setTimeout(resolve, 800));
    } catch (error) {
      console.error('Error updating emotion:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCommentAdd = async (text) => {
    if (!text.trim()) return;

    setIsUpdating(true);
    try {
      await addComment(text);
      await new Promise((resolve) => setTimeout(resolve, 800));
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {isUpdating && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator
            style={styles.activityIndicatorStyle}
            size='large'
            color='#007bff'
          />
          <Text style={styles.loadingText}>Đang cập nhật...</Text>
        </View>
      )}

      <View style={styles.mainContent}>
        <View style={styles.gridContainer}>
          <View style={styles.calendarSection}>
            <Calendar
              datesWithEntries={datesWithEntries}
              onSelectDate={changeDate}
              selectedDate={currentDate}
            />

            {isTodaySelected && (
              <View style={styles.moodButtonContainer}>
                <TouchableOpacity
                  onPress={() => setIsEmotionModalOpen(true)}
                  style={[
                    styles.moodButton,
                    userEmotion.emoji
                      ? styles.moodButtonUpdate
                      : styles.moodButtonRecord,
                  ]}
                >
                  {userEmotion.emoji ? (
                    <>
                      <Text style={styles.moodButtonEmoji}>
                        {userEmotion.emoji}
                      </Text>
                      <Text style={styles.moodButtonText}>
                        Cập nhật trạng thái
                      </Text>
                    </>
                  ) : (
                    <>
                      <Entypo name='plus' size={18} color='black' />
                      <Text style={styles.moodButtonText}>
                        Ghi lại cảm xúc của bạn
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.detailsSection}>
            {isTodaySelected ? (
              <>
                <EmotionSummary
                  dayData={dayData}
                  familyMembers={familyData?.members}
                  isToday={isTodaySelected}
                />

                <FamilyDiscussion
                  discussion={dayData.discussion || { comments: [] }}
                  familyMembers={familyData?.members}
                  userId={userId}
                  onAddComment={handleCommentAdd}
                  isToday={isTodaySelected}
                />
              </>
            ) : (
              <View style={styles.notTodayMessage}>
                <Text style={styles.notTodayText}>
                  Thông tin chi tiết chưa khả dụng cho ngày này
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Mở emotionModal khi click vào record hoặc update emotion */}
      <EmotionModal
        isOpen={isEmotionModalOpen}
        onClose={() => setIsEmotionModalOpen(false)}
        currentEmotion={userEmotion}
        onSave={handleEmotionUpdate}
      />
    </ScrollView>
  );
};

export default IndexEmotionCalendar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  activityIndicatorStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
    marginBottom: 16,
  },
  loadingText: {
    height: 16,
    width: 128,
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
    borderRadius: 4,
  },
  navigationCalendarWrapper: {
    width: '100%',
    flexDirection: 'row',
    gap: 20,
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
    fontWeight: 500,
    fontSize: 14,
  },
  mainContentNavigationCalendarWrapper: {
    paddingHorizontal: 16,
    marginTop: 16,
    maxWidth: '100%',
    marginHorizontal: 'auto',
  },
  mainContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    maxWidth: '100%',
    marginHorizontal: 'auto',
  },
  gridContainer: {
    gap: 24,
  },
  calendarSection: {
    gap: 16,
  },
  moodButtonContainer: {
    marginTop: 24,
  },
  moodButton: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  moodButtonUpdate: {
    backgroundColor: '#CBE5FA',
  },
  moodButtonRecord: {
    backgroundColor: '#007bff',
  },
  moodButtonEmoji: {
    fontSize: 20,
  },
  moodButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  detailsSection: {
    gap: 24,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#007bff',
  },
  notTodayMessage: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notTodayText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
