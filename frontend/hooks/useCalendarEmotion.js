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
    emotionPercentages,
    setEmotionPercentages,
  } = useCommon();

  // const [currentDate, setCurrentDate] = useState(getTodayDate());
  const [emotionStats, setEmotionStats] = useState({});

  // Calculate emotion statistics for current date
  const calculateEmotionStats = (dayData) => {
    if (!dayData) return {};

    const stats = {};
    let totalVotes = 0;

    // Count votes for each emotion
    Object.values(dayData).forEach((userData) => {
      if (userData.emoji) {
        stats[userData.emoji] = (stats[userData.emoji] || 0) + 1;
        totalVotes++;
      }
    });

    // Calculate percentages
    const percentages = {};
    Object.entries(stats).forEach(([emoji, count]) => {
      percentages[emoji] = Math.round((count / totalVotes) * 100);
    });

    return percentages;
  };

  // // Get current day's data
  // const getCurrentDayData = () => {
  //   if (!familyData?.calendar?.[currentDate]) {
  //     return {
  //       members: {},
  //       discussion: { comments: [] },
  //       emotionStats: {},
  //     };
  //   }

  //   const dayData = {
  //     ...familyData.calendar[currentDate],
  //     discussion: familyData.calendar[currentDate].discussion || {
  //       comments: [],
  //     },
  //   };

  //   // Calculate and add emotion statistics
  //   dayData.emotionStats = calculateEmotionStats(dayData);
  //   return dayData;
  // };

  // // Get user's emotion for current date
  // const getUserEmotion = () => {
  //   const dayData = getCurrentDayData();
  //   return {
  //     userEmotion: dayData[userId] || { emoji: null, note: '' },
  //     emotionStats: dayData.emotionStats,
  //   };
  // };

  const [currentDate, setCurrentDate] = useState(getTodayDate());
  // const [emotionPercentages, setEmotionPercentages] = useState([]);

  // Lấy dữ liệu cảm xúc của ngày hôm đó và tỷ lệ cảm xúc
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

  // Lấy cảm xúc của người dùng trong ngày
  const getUserEmotion = () => {
    const dayData = getCurrentDayData();
    return dayData[userId] || { emoji: null, note: '' };
  };

  // Cập nhật cảm xúc người dùng //cần có familyData và myFamily
  const updateUserEmotion = async (emoji, note) => {
    //ok
    if (!userId) return;

    // Chuyển emoji thành text trước khi gửi lên server
    let emojiText;
    switch (emoji) {
      case '😊':
        emojiText = 'Happy';
        break;
      case '😢':
        emojiText = 'Sad';
        break;
      case '😡':
        emojiText = 'Angry';
        break;
      case '😴':
        emojiText = 'Tired';
        break;
      case '😂':
        emojiText = 'Joyful';
        break;
      case '😮':
        emojiText = 'Surprised';
        break;
      case '😰':
        emojiText = 'Anxious';
        break;
      case '❤️':
        emojiText = 'Loved';
        break;
      case '😌':
        emojiText = 'Peaceful';
        break;
      case '🤔':
        emojiText = 'Thoughtful';
        break;
      default:
        emojiText = 'Unknown'; // Nếu không có emoji khớp, trả về "Unknown"
        break;
    }

    try {
      // Cập nhật cảm xúc người dùng vào backend và nhận tỷ lệ cảm xúc tổng hợp
      const response = await axios.post(
        `http://${apiBaseUrl}/emotions/update-emotion/family/${myFamily._id}/user/${userId}`,
        {
          dateString: currentDate,
          emoji: emojiText,
          note,
        }
      );

      // Cập nhật lại dữ liệu cảm xúc của người dùng và tỷ lệ cảm xúc
      const updatedCalendarData = { ...emotionCalendarDataTotal };
      if (!updatedCalendarData[myFamily._id].calendar[currentDate]) {
        updatedCalendarData[myFamily._id].calendar[currentDate] = {};
      }
      updatedCalendarData[myFamily._id].calendar[currentDate][userId] = {
        emoji,
        note,
      };

      setEmotionCalendarDataTotal(updatedCalendarData);
      // console.log(
      //   'response.data.emotionPercentages',
      //   response.data.emotionPercentages
      // );
      setEmotionPercentages(response.data.emotionPercentages); // Cập nhật tỷ lệ cảm xúc cho frontend
    } catch (error) {
      console.error('Error updating emotion:', error);
      throw error;
    }
  };

  // Add a comment to the discussion
  const addComment = async (text) => {
    if (!familyData || !userId || !myFamily) return;
    if (!userId) return;

    try {
      const newComment = {
        userId,
        text,
        timestamp: new Date().toISOString(),
      };

      // Update on server
      const response = await axios.post(
        `http://${apiBaseUrl}/calendars/add-comment`,
        {
          familyId: myFamily._id,
          date: currentDate,
          comment: newComment,
        }
      );

      // Update local state with the complete response from server
      if (response.data && response.data[myFamily._id]) {
        const updatedCalendarData = { ...emotionCalendarDataTotal };
        updatedCalendarData[myFamily._id] = response.data[myFamily._id];
        setEmotionCalendarDataTotal(updatedCalendarData);
      }
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
    if (familyData?.calendar?.[date]) {
      const newStats = calculateEmotionStats(familyData.calendar[date]);
      setEmotionStats(newStats);
    } else {
      setEmotionStats({});
    }
  };

  // Update emotion stats whenever familyData changes
  useEffect(() => {
    if (familyData?.calendar?.[currentDate]) {
      const newStats = calculateEmotionStats(familyData.calendar[currentDate]);
      setEmotionStats(newStats);
    }
  }, [familyData, currentDate]);

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
    emotionStats,
    setUserId,
    emotionPercentages,
    setEmotionPercentages,
  };
}
