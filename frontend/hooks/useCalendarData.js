import { useState, useEffect } from 'react';
import { getTodayDate } from '../utils/emotionUtils.js';

// Sample mock data - in a real app, this would be replaced with database calls
const mockFamilyData = {
  familyID123: {
    members: [
      { id: 'user1', name: 'Alex', avatar: '/placeholder.svg' },
      { id: 'user2', name: 'Jordan', avatar: '/placeholder.svg' },
      { id: 'user3', name: 'Casey', avatar: '/placeholder.svg' },
      { id: 'user4', name: 'Taylor', avatar: '/placeholder.svg' },
    ],
    calendar: {
      // Pre-populate with some sample data
      '2023-10-20': {
        user1: { emoji: '😊', note: 'Had a great day at the park!' },
        user2: { emoji: '🤔', note: 'Thinking about a big decision' },
        user3: { emoji: '😴', note: 'Very tired today' },
        user4: { emoji: '😂', note: 'Watched a funny movie' },
        discussion: {
          comments: [
            {
              userId: 'user1',
              text: 'We should go to the park again soon!',
              timestamp: '2023-10-20T14:22:00Z',
            },
            {
              userId: 'user4',
              text: 'Absolutely! The weather was perfect.',
              timestamp: '2023-10-20T15:45:00Z',
            },
          ],
        },
      },
    },
  },
};

export function useCalendarData(familyId = 'familyID123') {
  const [familyData, setFamilyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(getTodayDate());
  const [userId, setUserId] = useState('user1'); // Default user for demo

  // In a real app, this would fetch from a database
  useEffect(() => {
    const fetchData = async () => {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      setFamilyData(mockFamilyData[familyId]);
      setLoading(false);
    };

    fetchData();
  }, [familyId]);

  // Get current day's data
  const getCurrentDayData = () => {
    if (!familyData?.calendar?.[currentDate]) {
      return {
        members: {},
        discussion: { comments: [] },
      };
    }

    const dayData = { ...familyData.calendar[currentDate] };

    // Ensure discussion exists
    if (!dayData.discussion) {
      dayData.discussion = { comments: [] };
    }

    return dayData;
  };

  // Get user's emotion for current date
  const getUserEmotion = () => {
    const dayData = getCurrentDayData();
    return dayData[userId] || { emoji: null, note: '' };
  };

  // Update user's emotion
  const updateUserEmotion = (emoji, note) => {
    if (!familyData) return;

    const updatedFamilyData = { ...familyData };

    // Initialize the day if it doesn't exist
    if (!updatedFamilyData.calendar[currentDate]) {
      updatedFamilyData.calendar[currentDate] = {};
    }

    // Update user's emotion
    updatedFamilyData.calendar[currentDate] = {
      ...updatedFamilyData.calendar[currentDate],
      [userId]: { emoji, note },
    };

    // Ensure discussion exists
    if (!updatedFamilyData.calendar[currentDate].discussion) {
      updatedFamilyData.calendar[currentDate].discussion = { comments: [] };
    }

    setFamilyData(updatedFamilyData);

    // In a real app, you would save to database here
    console.log('Updated emotion:', { date: currentDate, userId, emoji, note });
  };

  // Add a comment to the discussion
  const addComment = (text) => {
    if (!familyData) return;

    const updatedFamilyData = { ...familyData };

    // Initialize the day if it doesn't exist
    if (!updatedFamilyData.calendar[currentDate]) {
      updatedFamilyData.calendar[currentDate] = {};
    }

    // Initialize discussion if it doesn't exist
    if (!updatedFamilyData.calendar[currentDate].discussion) {
      updatedFamilyData.calendar[currentDate].discussion = { comments: [] };
    }

    // Add comment
    const newComment = {
      userId,
      text,
      timestamp: new Date().toISOString(),
    };

    updatedFamilyData.calendar[currentDate].discussion.comments = [
      ...updatedFamilyData.calendar[currentDate].discussion.comments,
      newComment,
    ];

    setFamilyData(updatedFamilyData);

    // In a real app, you would save to database here
    console.log('Added comment:', { date: currentDate, userId, text });
  };

  // Get all dates that have entries
  const getDatesWithEntries = () => {
    if (!familyData?.calendar) return [];
    return Object.keys(familyData.calendar);
  };

  // Change current date
  const changeDate = (date) => {
    setCurrentDate(date);
  };

  return {
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
  };
}
