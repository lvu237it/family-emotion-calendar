import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { categorizeEmotion } from '../utils/emotionUtils';
import { useCalendarEmotion } from '../hooks/useCalendarEmotion';
import { useCommon } from '../contexts/CommonContext';

const EmotionSummary = ({ dayData, familyMembers }) => {
  // const { emotionPercentages } = useCalendarEmotion(); //trả về [chứa các thành viên và emoji của hôm nay]
  // const { emojiOfEachMemberInDay } = useCommon(); //non-use

  // useEffect(() => {
  //   console.log('emotionpercentage', emotionPercentages);
  //   console.log('emojiOfEachMemberInDay', emojiOfEachMemberInDay);
  // }, [emotionPercentages]);
  // //Lấy số liệu thống kê (mới nhất sau khi được cập nhật - sau khi người dùng vote mood)

  if (
    !dayData ||
    Object.keys(dayData).filter((key) => key !== 'discussion')?.length === 0
  ) {
    return null;
  }

  const emotionCounts = { positive: 0, neutral: 0, negative: 0 };
  const memberCount = familyMembers?.length || 0;
  let recordedCount = 0;

  familyMembers?.forEach((member) => {
    const memberData = dayData[member.id];
    if (memberData?.emoji) {
      const category = categorizeEmotion(memberData.emoji);
      emotionCounts[category]++;
      recordedCount++;
    }
  });

  const getPercentage = (count) => {
    return recordedCount === 0 ? 0 : Math.round((count / recordedCount) * 100);
  };

  const getOverallMood = () => {
    if (recordedCount === 0) return null;

    const { positive, neutral, negative } = emotionCounts;

    if (positive > neutral && positive > negative) return 'positive';
    if (negative > neutral && negative > positive) return 'negative';
    return 'neutral';
  };

  const overallMood = getOverallMood();

  const getMoodInfo = () => {
    if (!overallMood) return { message: 'Không có số liệu', color: '#666' };

    switch (overallMood) {
      case 'positive':
        return {
          message: 'Mọi người cảm thấy hôm nay là một ngày rất vui!',
          color: '#22c55e',
        };
      case 'negative':
        return {
          message: 'Các thành viên trong gia đình đang cảm thấy không vui',
          color: '#ef4444',
        };
      default:
        return {
          message: 'Tâm trạng chung của gia đình bạn hôm nay ở mức cân bằng',
          color: '#3b82f6',
        };
    }
  };

  const { message, color } = getMoodInfo();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome name='heart-o' size={18} color='black' />
        <Text style={styles.headerTitle}>Thống kê tâm trạng hôm nay</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.moodMessage}>
          <Text style={[styles.moodText, { color }]}>{message}</Text>
          <Text style={styles.moodSubtext}>
            {recordedCount} / {memberCount} thành viên trong gia đình đã chia sẻ
            cảm xúc của họ
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.statItem, { backgroundColor: '#dcfce7' }]}>
            <Text style={[styles.statValue, { color: '#22c55e' }]}>
              {getPercentage(emotionCounts.positive)}%
            </Text>
            <Text style={styles.statLabel}>Tích cực</Text>
          </View>

          <View style={[styles.statItem, { backgroundColor: '#dbeafe' }]}>
            <Text style={[styles.statValue, { color: '#3b82f6' }]}>
              {getPercentage(emotionCounts.neutral)}%
            </Text>
            <Text style={styles.statLabel}>Bình thường</Text>
          </View>

          <View style={[styles.statItem, { backgroundColor: '#fee2e2' }]}>
            <Text style={[styles.statValue, { color: '#ef4444' }]}>
              {getPercentage(emotionCounts.negative)}%
            </Text>
            <Text style={styles.statLabel}>Tiêu cực</Text>
          </View>
        </View>

        {recordedCount > 0 && (
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressSegment,
                {
                  backgroundColor: '#22c55e',
                  width: `${getPercentage(emotionCounts.positive)}%`,
                },
              ]}
            />
            <View
              style={[
                styles.progressSegment,
                {
                  backgroundColor: '#3b82f6',
                  width: `${getPercentage(emotionCounts.neutral)}%`,
                },
              ]}
            />
            <View
              style={[
                styles.progressSegment,
                {
                  backgroundColor: '#ef4444',
                  width: `${getPercentage(emotionCounts.negative)}%`,
                },
              ]}
            />
          </View>
        )}

        {recordedCount === 0 && (
          <View style={styles.noData}>
            <Text style={styles.noDataText}>
              Chưa có thành viên nào cập nhật trạng thái của họ trong ngày hôm
              nay
            </Text>
          </View>
        )}
      </View>
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
    // alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  content: {
    padding: 16,
  },
  moodMessage: {
    alignItems: 'center',
    marginBottom: 24,
  },
  moodText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
  },
  moodSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    // paddingHorizontal: 10s,
    borderRadius: 12,
    marginHorizontal: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '500',
    // paddingHorizontal: 10,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  progressSegment: {
    height: '100%',
  },
  noData: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  noDataText: {
    textAlign: 'center',
    color: '#666',
  },
});

export default EmotionSummary;
