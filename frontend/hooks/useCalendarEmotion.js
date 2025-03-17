import { useState, useEffect } from 'react';
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
    fetchFamilyData,
  } = useCommon();

  const [currentDate, setCurrentDate] = useState(getTodayDate());
  const [isLoading, setIsLoading] = useState(false);

  // Get current day's data
  const getCurrentDayData = () => {
    if (!familyData?.calendar?.[currentDate]) {
      return {
        members: {},
        discussion: { comments: [] },
        emotionStats: {},
      };
    }

    // Get the day's data
    const dayData = {
      ...familyData.calendar[currentDate],
      discussion: familyData.calendar[currentDate].discussion || {
        comments: [],
      },
    };

    // Debug information
    console.log('getCurrentDayData Debug:');
    console.log('Current Date:', currentDate);
    console.log('Family Data:', familyData);
    console.log('Day Data:', dayData);

    return dayData;
  };

  // Get user's emotion for current date
  const getUserEmotion = () => {
    const dayData = getCurrentDayData();
    const userEmotion = familyData?.members?.find(
      (member) => member.id === userId
    );
    return dayData[userEmotion?.name] || { emoji: null, note: '' };
  };

  // Map emoji display to backend format
  const mapEmojiToBackend = (emoji) => {
    const emojiMap = {
      '😊': 'Happy',
      '😢': 'Sad',
      '😡': 'Angry',
      '😴': 'Tired',
      '😂': 'Joyful',
      '😮': 'Surprised',
      '😰': 'Anxious',
      '❤️': 'Loved',
      '😌': 'Peaceful',
      '🤔': 'Thoughtful',
    };
    return emojiMap[emoji] || 'Unknown';
  };

  // Update user's emotion
  const updateUserEmotion = async (emoji, note) => {
    if (!userId || !myFamily) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        `http://${apiBaseUrl}/emotions/update-emotion/family/${myFamily._id}/user/${userId}`,
        {
          dateString: currentDate,
          emoji: mapEmojiToBackend(emoji),
          notes: note,
        }
      );

      if (response.data && response.data.data) {
        // Update the complete family data
        setEmotionCalendarDataTotal((prevData) => ({
          ...prevData,
          ...response.data.data,
        }));

        // Refresh family data to ensure everything is in sync
        await fetchFamilyData();
      }
    } catch (error) {
      console.error('Error updating emotion:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Add a comment to the discussion
  const addComment = async (text) => {
    if (!userId || !myFamily) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        `http://${apiBaseUrl}/calendars/add-comment`,
        {
          familyId: myFamily._id,
          date: currentDate,
          comment: {
            userId,
            text,
            timestamp: new Date().toISOString(),
          },
        }
      );

      if (response.data && response.data[myFamily._id]) {
        // Update the complete family data
        setEmotionCalendarDataTotal((prevData) => ({
          ...prevData,
          [myFamily._id]: response.data[myFamily._id],
        }));

        // Refresh family data to ensure everything is in sync
        await fetchFamilyData();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Get all dates with entries
  const getDatesWithEntries = () => {
    if (!familyData?.calendar) return [];
    return Object.keys(familyData.calendar);
  };

  // Change current date
  const changeDate = async (date) => {
    setCurrentDate(date);
    if (myFamily) {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://${apiBaseUrl}/emotions/emojis-of-family/${myFamily._id}/${date}`
        );

        if (response.data && response.data.data) {
          setEmotionCalendarDataTotal((prevData) => ({
            ...prevData,
            ...response.data.data,
          }));
        }
      } catch (error) {
        console.error('Error fetching date data:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Auto-refresh data periodically when viewing today's date
  // useEffect(() => {
  //   if (currentDate === getTodayDate() && myFamily) {
  //     const interval = setInterval(fetchFamilyData, 30000); // Refresh every 30 seconds
  //     return () => clearInterval(interval);
  //   }
  // }, [currentDate, myFamily]);

  return {
    familyData,
    currentDate,
    userId,
    isLoading,
    changeDate,
    getCurrentDayData,
    getUserEmotion,
    updateUserEmotion,
    addComment,
    getDatesWithEntries,
    setUserId,
  };
}
