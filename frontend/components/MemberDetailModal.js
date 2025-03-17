import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { emotions, categorizeEmotion } from '../utils/emotionUtils';

const MemberDetailModal = ({ visible, onClose, member, familyData }) => {
  const [stats, setStats] = useState({
    total: 0,
    emotions: {},
    categories: {
      positive: 0,
      neutral: 0,
      negative: 0,
    },
  });

  useEffect(() => {
    if (member && familyData) {
      calculateEmotionStats();
    }
  }, [member, familyData]);

  const calculateEmotionStats = () => {
    const stats = {
      total: 0,
      emotions: {},
      categories: {
        positive: 0,
        neutral: 0,
        negative: 0,
      },
    };

    // Khởi tạo số đếm cho tất cả emoji
    emotions.forEach((emotion) => {
      stats.emotions[emotion.emoji] = 0;
    });

    // Đếm số lần sử dụng mỗi emoji
    Object.values(familyData.calendar).forEach((dayData) => {
      if (dayData[member.name] && dayData[member.name].emoji) {
        const emotion = dayData[member.name].emoji;
        stats.total++;
        if (stats.emotions.hasOwnProperty(emotion)) {
          stats.emotions[emotion]++;
          const category = categorizeEmotion(emotion);
          stats.categories[category]++;
        }
      }
    });

    setStats(stats);
  };

  const getEmotionColor = (emoji) => {
    const emotion = emotions.find((e) => e.emoji === emoji);
    if (!emotion) return '#757575';

    switch (categorizeEmotion(emoji)) {
      case 'positive':
        return '#4CAF50';
      case 'negative':
        return '#F44336';
      case 'neutral':
        return '#FFC107';
      default:
        return '#757575';
    }
  };

  const renderCategoryStats = () => {
    return (
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>Phân loại cảm xúc:</Text>
        {Object.entries(stats.categories).map(([category, count]) => {
          const percentage =
            stats.total > 0 ? ((count / stats.total) * 100).toFixed(1) : '0.0';
          const color =
            category === 'positive'
              ? '#4CAF50'
              : category === 'negative'
              ? '#F44336'
              : '#FFC107';
          const label =
            category === 'positive'
              ? 'Tích cực'
              : category === 'negative'
              ? 'Tiêu cực'
              : 'Trung tính';

          return (
            <View key={category} style={styles.categoryItem}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryLabel}>{label}</Text>
                <Text style={styles.categoryPercentage}>{percentage}%</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${percentage}%`,
                      backgroundColor: color,
                    },
                  ]}
                />
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  const renderEmotionBar = (emoji, count) => {
    const percentage =
      stats.total > 0 ? ((count / stats.total) * 100).toFixed(1) : '0.0';
    const emotion = emotions.find((e) => e.emoji === emoji);

    return (
      <View key={emoji} style={styles.emotionBar}>
        <View style={styles.emotionInfo}>
          <View style={styles.emotionLabel}>
            <Text style={styles.emotionEmoji}>{emoji}</Text>
            <Text style={styles.emotionName}>{emotion?.label || ''}</Text>
          </View>
          <Text style={styles.emotionPercentage}>{percentage}%</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${percentage}%`,
                backgroundColor: getEmotionColor(emoji),
              },
            ]}
          />
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType='slide'
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{member?.name}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <AntDesign name='close' size={24} color='#666' />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.statsContainer}>
            <Text style={styles.totalDays}>
              Số ngày đã chia sẻ cảm xúc: {stats.total} ngày
            </Text>

            {renderCategoryStats()}

            <Text style={styles.sectionTitle}>Chi tiết từng cảm xúc:</Text>
            <View style={styles.emotionStats}>
              {Object.entries(stats.emotions)
                .filter(([, count]) => count > 0)
                .sort(([, a], [, b]) => b - a)
                .map(([emotion, count]) => renderEmotionBar(emotion, count))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '50%',
    maxHeight: '80%',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  closeButton: {
    padding: 5,
  },
  statsContainer: {
    flex: 1,
  },
  totalDays: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  categoryContainer: {
    marginBottom: 25,
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    color: '#2c3e50',
  },
  categoryItem: {
    marginBottom: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  categoryLabel: {
    fontSize: 14,
    color: '#666',
  },
  categoryPercentage: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 15,
  },
  emotionStats: {
    marginTop: 10,
  },
  emotionBar: {
    marginBottom: 15,
  },
  emotionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  emotionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emotionEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  emotionName: {
    fontSize: 14,
    color: '#666',
  },
  emotionPercentage: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
});

export default MemberDetailModal;
