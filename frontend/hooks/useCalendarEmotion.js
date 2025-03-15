import { useState } from 'react';
import { getTodayDate } from '../utils/emotionUtils.js';
import { useCommon } from '../contexts/CommonContext.js';

export function useCalendarEmotion() {
  const {
    familyData,
    userId,
    setUserId,
    emotionCalendarDataTotal,
    setEmotionCalendarDataTotal,
    myFamily,
    apiBaseUrl,
    axios,
  } = useCommon();

  const [currentDate, setCurrentDate] = useState(getTodayDate());

  // Get current day's data
  const getCurrentDayData = () => {
    if (!familyData?.calendar?.[currentDate]) {
      return {
        members: {},
        discussion: { comments: [] },
      };
    }
    return {
      ...familyData.calendar[currentDate],
      discussion: familyData.calendar[currentDate].discussion || {
        comments: [],
      },
    };
  };

  // Get user's emotion for current date
  const getUserEmotion = () => {
    const dayData = getCurrentDayData();
    return dayData[userId] || { emoji: null, note: '' };
  };

  // Update user's emotion
  const updateUserEmotion = async (emoji, note) => {
    if (!familyData || !userId || !myFamily) return;

    try {
      // Update on server
      await axios.post(`http://${apiBaseUrl}/calendars/update-emotion`, {
        familyId: myFamily._id,
        userId,
        date: currentDate,
        emotion: { emoji, note },
      });

      // Update local state
      const updatedCalendarData = { ...emotionCalendarDataTotal };
      if (!updatedCalendarData[myFamily._id].calendar[currentDate]) {
        updatedCalendarData[myFamily._id].calendar[currentDate] = {};
      }
      updatedCalendarData[myFamily._id].calendar[currentDate][userId] = {
        emoji,
        note,
      };
      setEmotionCalendarDataTotal(updatedCalendarData);
    } catch (error) {
      console.error('Error updating emotion:', error);
      throw error;
    }
  };

  // Add a comment to the discussion
  const addComment = async (text) => {
    if (!familyData || !userId || !myFamily) return;

    try {
      const newComment = {
        userId,
        text,
        timestamp: new Date().toISOString(),
      };

      // Update on server
      await axios.post(`http://${apiBaseUrl}/calendars/add-comment`, {
        familyId: myFamily._id,
        date: currentDate,
        comment: newComment,
      });

      // Update local state
      const updatedCalendarData = { ...emotionCalendarDataTotal };
      if (!updatedCalendarData[myFamily._id].calendar[currentDate]) {
        updatedCalendarData[myFamily._id].calendar[currentDate] = {
          discussion: { comments: [] },
        };
      }
      if (!updatedCalendarData[myFamily._id].calendar[currentDate].discussion) {
        updatedCalendarData[myFamily._id].calendar[currentDate].discussion = {
          comments: [],
        };
      }
      updatedCalendarData[myFamily._id].calendar[
        currentDate
      ].discussion.comments.push(newComment);
      setEmotionCalendarDataTotal(updatedCalendarData);
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
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
