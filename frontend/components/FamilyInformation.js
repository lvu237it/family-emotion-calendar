import React from 'react';
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

const FamilyInformation = () => {
  const {
    familyData,
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

  const { myFamily, myFamilyMembers } = useCommon();

  if (!myFamily) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#007bff' />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.familyInfoContainer}>
        <Text style={styles.familyName}>{myFamily.name}</Text>
        <Text style={styles.memberCount}>
          {myFamilyMembers.length} thành viên
        </Text>

        <View style={styles.membersList}>
          <Text style={styles.sectionTitle}>Thành viên gia đình</Text>
          {myFamilyMembers.map((member) => (
            <View key={member.id} style={styles.memberItem}>
              <Text style={styles.memberName}>{member.name}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default FamilyInformation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  familyInfoContainer: {
    padding: 16,
  },
  familyName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  memberCount: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  membersList: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  memberName: {
    fontSize: 16,
  },
});
