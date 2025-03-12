import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { categorizeEmotion } from '../utils/emotionUtils';

const EmotionSummary = ({ dayData, familyMembers }) => {
  if (
    !dayData ||
    Object.keys(dayData).filter((key) => key !== 'discussion').length === 0
  ) {
    return null;
  }

  const emotionCounts = { positive: 0, neutral: 0, negative: 0 };
  const memberCount = familyMembers.length;
  let recordedCount = 0;

  familyMembers.forEach((member) => {
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
    if (!overallMood) return { message: 'No data yet', color: '#666' };

    switch (overallMood) {
      case 'positive':
        return {
          message: 'The family is having a good day!',
          color: '#22c55e',
        };
      case 'negative':
        return {
          message: 'The family is having a challenging day',
          color: '#ef4444',
        };
      default:
        return {
          message: 'The family mood is balanced today',
          color: '#3b82f6',
        };
    }
  };

  const { message, color } = getMoodInfo();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome name='heart-o' size={18} color='black' />
        <Text style={styles.headerTitle}>Family Mood Summary</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.moodMessage}>
          <Text style={[styles.moodText, { color }]}>{message}</Text>
          <Text style={styles.moodSubtext}>
            {recordedCount} of {memberCount} family members have shared their
            feelings
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.statItem, { backgroundColor: '#dcfce7' }]}>
            <Text style={[styles.statValue, { color: '#22c55e' }]}>
              {getPercentage(emotionCounts.positive)}%
            </Text>
            <Text style={styles.statLabel}>Positive</Text>
          </View>

          <View style={[styles.statItem, { backgroundColor: '#dbeafe' }]}>
            <Text style={[styles.statValue, { color: '#3b82f6' }]}>
              {getPercentage(emotionCounts.neutral)}%
            </Text>
            <Text style={styles.statLabel}>Neutral</Text>
          </View>

          <View style={[styles.statItem, { backgroundColor: '#fee2e2' }]}>
            <Text style={[styles.statValue, { color: '#ef4444' }]}>
              {getPercentage(emotionCounts.negative)}%
            </Text>
            <Text style={styles.statLabel}>Negative</Text>
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
              No emotions recorded yet for this day
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
    alignItems: 'center',
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
    fontSize: 18,
    fontWeight: '500',
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
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '500',
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
    color: '#666',
  },
});

export default EmotionSummary;
