import { useState, useEffect } from 'react';
import { getTodayDate } from '../utils/emotionUtils.js';
import { useCommon } from '../contexts/CommonContext.js';

export function useCalendarEmotion(familyId = '6794f1bb4e687e91ace99e87') {
  const { emotionCalendarDataTotal, userId, setUserId } = useCommon(); // Lấy userId từ CommonContext
  const [familyData, setFamilyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(getTodayDate());

  // Fetch data from emotionCalendarDataTotal
  useEffect(() => {
    const fetchData = async () => {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Set familyData from emotionCalendarDataTotal
      if (emotionCalendarDataTotal && emotionCalendarDataTotal[familyId]) {
        setFamilyData(emotionCalendarDataTotal[familyId]);
        // Set default userId to the first member if not set
        if (!userId && emotionCalendarDataTotal[familyId].members.length > 0) {
          setUserId(emotionCalendarDataTotal[familyId].members[0].id);
        }
      } else {
        setFamilyData({
          members: [],
          calendar: {},
        });
      }

      setLoading(false);
    };

    fetchData();
  }, [familyId, emotionCalendarDataTotal, userId, setUserId]);

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
    if (!familyData || !userId) return;

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
    if (!familyData || !userId) return;

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
