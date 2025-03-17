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
  Image,
  TextInput,
} from 'react-native';
import { useCommon } from '../contexts/CommonContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

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

  const { myFamily, myFamilyMembers, apiBaseUrl } = useCommon();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('members'); // 'members', 'events', 'tasks'

  if (!myFamily) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#007bff' />
      </View>
    );
  }

  const filteredMembers = myFamilyMembers.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderFamilyHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.familyInfo}>
        <Text style={styles.familyName}>{myFamily.name}</Text>
        <Text style={styles.memberCount}>
          {myFamilyMembers.length} thành viên
        </Text>
      </View>
      <View style={styles.searchContainer}>
        <MaterialIcons name='search' size={24} color='#666' />
        <TextInput
          style={styles.searchInput}
          placeholder='Tìm kiếm thành viên...'
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
    </View>
  );

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      {/* <TouchableOpacity
        style={[styles.tab, activeTab === 'members' && styles.activeTab]}
        onPress={() => setActiveTab('members')}
      >
        <MaterialIcons
          name='people'
          size={24}
          color={activeTab === 'members' ? '#007bff' : '#666'}
        />
        <Text
          style={[
            styles.tabText,
            activeTab === 'members' && styles.activeTabText,
          ]}
        >
          Thành viên
        </Text>
      </TouchableOpacity> */}
      {/* <TouchableOpacity
        style={[styles.tab, activeTab === 'events' && styles.activeTab]}
        onPress={() => setActiveTab('events')}
      >
        <FontAwesome
          name='calendar'
          size={24}
          color={activeTab === 'events' ? '#007bff' : '#666'}
        />
        <Text
          style={[
            styles.tabText,
            activeTab === 'events' && styles.activeTabText,
          ]}
        >
          Sự kiện
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'tasks' && styles.activeTab]}
        onPress={() => setActiveTab('tasks')}
      >
        <Ionicons
          name='checkmark-circle-outline'
          size={24}
          color={activeTab === 'tasks' ? '#007bff' : '#666'}
        />
        <Text
          style={[
            styles.tabText,
            activeTab === 'tasks' && styles.activeTabText,
          ]}
        >
          Công việc
        </Text>
      </TouchableOpacity> */}
    </View>
  );

  const renderMembersList = () => (
    <View style={styles.membersList}>
      {filteredMembers.map((member) => (
        <TouchableOpacity key={member.id} style={styles.memberItem}>
          {/* <Image
            source={require('../public/')}
            style={styles.memberAvatar}
          /> */}
          <AntDesign
            style={styles.memberAvatar}
            name='user'
            size={28}
            color='black'
          />

          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>{member.name}</Text>
            <Text style={styles.memberEmail}>
              {member.email || 'Chưa có email'}
            </Text>
          </View>
          <MaterialIcons name='chevron-right' size={24} color='#666' />
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderEventsList = () => (
    <View style={styles.eventsList}>
      <TouchableOpacity style={styles.addEventButton}>
        <MaterialIcons name='add-circle-outline' size={24} color='#007bff' />
        <Text style={styles.addEventText}>Thêm sự kiện mới</Text>
      </TouchableOpacity>
      <View style={styles.eventItem}>
        <View style={styles.eventDate}>
          <Text style={styles.eventDay}>15</Text>
          <Text style={styles.eventMonth}>Tháng 3</Text>
        </View>
        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle}>Sinh nhật mẹ</Text>
          <Text style={styles.eventDescription}>Chuẩn bị bữa tối gia đình</Text>
        </View>
      </View>
    </View>
  );

  const renderTasksList = () => (
    <View style={styles.tasksList}>
      <TouchableOpacity style={styles.addTaskButton}>
        <MaterialIcons name='add-circle-outline' size={24} color='#007bff' />
        <Text style={styles.addTaskText}>Thêm công việc mới</Text>
      </TouchableOpacity>
      <View style={styles.taskItem}>
        <MaterialIcons name='check-box-outline-blank' size={24} color='#666' />
        <Text style={styles.taskText}>Dọn dẹp nhà cửa</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {renderFamilyHeader()}
      {/* {renderTabBar()} */}
      {activeTab === 'members' && renderMembersList()}
      {/* {activeTab === 'events' && renderEventsList()}
      {activeTab === 'tasks' && renderTasksList()} */}
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
  headerContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  familyInfo: {
    marginBottom: 16,
  },
  familyName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  memberCount: {
    marginHorizontal: 20,
    fontSize: 16,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
    borderRadius: 12,
    padding: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#2c3e50',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#e3f2fd',
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#007bff',
    fontWeight: '600',
  },
  membersList: {
    padding: 16,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  memberAvatar: {
    padding: 10,
    borderRadius: 25,
    marginRight: 16,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  memberEmail: {
    fontSize: 14,
    color: '#666',
  },
  eventsList: {
    padding: 16,
  },
  addEventButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#007bff',
    borderStyle: 'dashed',
  },
  addEventText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#007bff',
  },
  eventItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventDate: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 16,
    borderRightWidth: 1,
    borderRightColor: '#eee',
  },
  eventDay: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  eventMonth: {
    fontSize: 14,
    color: '#666',
  },
  eventInfo: {
    flex: 1,
    marginLeft: 16,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
  },
  tasksList: {
    padding: 16,
  },
  addTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#007bff',
    borderStyle: 'dashed',
  },
  addTaskText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#007bff',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#2c3e50',
  },
});
