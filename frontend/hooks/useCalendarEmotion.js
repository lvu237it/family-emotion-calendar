// // import { useState, useEffect } from 'react';
// // import { getTodayDate } from '../utils/emotionUtils.js';
// // import { useCommon } from '../contexts/CommonContext.js';

// // // Sample mock data - in a real app, this would be replaced with database calls

// // //Cần tạo thêm model Calendar để có thể tạo ra được familyData sau cùng như thế này

// // //Điều kiện:
// // // Có được familyId //ok
// // // Có được danh sách các thành viên với thông tin cụ thể //ok
// // // Có calendar của gia đình đó theo mảng (chứa nhiều ngày và sẽ update thường xuyên - thêm ngày liên tục trong tương lai nếu có thành viên trong gia đình hoạt động) //ok
// // //   Tuy nhiên định dạng ở dưới đây chỉ lấy theo từng ngày để xác định - nhưng vẫn có model theo dateStringArray
// // // Có discussion là phần bao gồm các comments của các thành viên trong gia đình trong cùng 1 ngày

// // // CHỐT LẠI: Khi nào đầy đủ các thành phần từ backend và frontend có thể tạo được format dưới đây thì mới có thể hoàn chỉnh

// // const mockFamilyData = {
// //   familyID123: {
// //     members: [
// //       { id: 'user1', name: 'Alex', avatar: '/placeholder.svg' },
// //       { id: 'user2', name: 'Jordan', avatar: '/placeholder.svg' },
// //       { id: 'user3', name: 'Casey', avatar: '/placeholder.svg' },
// //       { id: 'user4', name: 'Taylor', avatar: '/placeholder.svg' },
// //     ],
// //     calendar: {
// //       // Pre-populate with some sample data
// //       '2023-10-20': {
// //         user1: { emoji: '😊', note: 'Had a great day at the park!' },
// //         user2: { emoji: '🤔', note: 'Thinking about a big decision' },
// //         user3: { emoji: '😴', note: 'Very tired today' },
// //         user4: { emoji: '😂', note: 'Watched a funny movie' },
// //         discussion: {
// //           comments: [
// //             {
// //               userId: 'user1',
// //               text: 'We should go to the park again soon!',
// //               timestamp: '2023-10-20T14:22:00Z',
// //             },
// //             {
// //               userId: 'user4',
// //               text: 'Absolutely! The weather was perfect.',
// //               timestamp: '2023-10-20T15:45:00Z',
// //             },
// //           ],
// //         },
// //       },
// //     },
// //   },
// // };

// // export function useCalendarEmotion(familyId = 'familyID123') {
// //   const [familyData, setFamilyData] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [currentDate, setCurrentDate] = useState(getTodayDate());
// //   const [userId, setUserId] = useState('user1'); // Default user for demo

// //   const { emotionCalendarDataTotal } = useCommon();

// //   // In a real app, this would fetch from a database
// //   useEffect(() => {
// //     const fetchData = async () => {
// //       // Simulate API call delay
// //       await new Promise((resolve) => setTimeout(resolve, 500));
// //       setFamilyData(mockFamilyData[familyId]);
// //       setLoading(false);
// //     };

// //     fetchData();
// //   }, [familyId]);

// //   // Get current day's data
// //   const getCurrentDayData = () => {
// //     if (!familyData?.calendar?.[currentDate]) {
// //       return {
// //         members: {},
// //         discussion: { comments: [] },
// //       };
// //     }

// //     const dayData = { ...familyData.calendar[currentDate] };

// //     // Ensure discussion exists
// //     if (!dayData.discussion) {
// //       dayData.discussion = { comments: [] };
// //     }

// //     return dayData;
// //   };

// //   // Get user's emotion for current date
// //   const getUserEmotion = () => {
// //     const dayData = getCurrentDayData();
// //     return dayData[userId] || { emoji: null, note: '' };
// //   };

// //   // Update user's emotion
// //   const updateUserEmotion = (emoji, note) => {
// //     if (!familyData) return;

// //     const updatedFamilyData = { ...familyData };

// //     // Initialize the day if it doesn't exist
// //     if (!updatedFamilyData.calendar[currentDate]) {
// //       updatedFamilyData.calendar[currentDate] = {};
// //     }

// //     // Update user's emotion
// //     updatedFamilyData.calendar[currentDate] = {
// //       ...updatedFamilyData.calendar[currentDate],
// //       [userId]: { emoji, note },
// //     };

// //     // Ensure discussion exists
// //     if (!updatedFamilyData.calendar[currentDate].discussion) {
// //       updatedFamilyData.calendar[currentDate].discussion = { comments: [] };
// //     }

// //     setFamilyData(updatedFamilyData);

// //     // In a real app, you would save to database here
// //     console.log('Updated emotion:', { date: currentDate, userId, emoji, note });
// //   };

// //   // Add a comment to the discussion
// //   const addComment = (text) => {
// //     if (!familyData) return;

// //     const updatedFamilyData = { ...familyData };

// //     // Initialize the day if it doesn't exist
// //     if (!updatedFamilyData.calendar[currentDate]) {
// //       updatedFamilyData.calendar[currentDate] = {};
// //     }

// //     // Initialize discussion if it doesn't exist
// //     if (!updatedFamilyData.calendar[currentDate].discussion) {
// //       updatedFamilyData.calendar[currentDate].discussion = { comments: [] };
// //     }

// //     // Add comment
// //     const newComment = {
// //       userId,
// //       text,
// //       timestamp: new Date().toISOString(),
// //     };

// //     updatedFamilyData.calendar[currentDate].discussion.comments = [
// //       ...updatedFamilyData.calendar[currentDate].discussion.comments,
// //       newComment,
// //     ];

// //     setFamilyData(updatedFamilyData);

// //     // In a real app, you would save to database here
// //     console.log('Added comment:', { date: currentDate, userId, text });
// //   };

// //   // Get all dates that have entries
// //   const getDatesWithEntries = () => {
// //     if (!familyData?.calendar) return [];
// //     return Object.keys(familyData.calendar);
// //   };

// //   // Change current date
// //   const changeDate = (date) => {
// //     setCurrentDate(date);
// //   };

// //   return {
// //     familyData,
// //     loading,
// //     currentDate,
// //     userId,
// //     changeDate,
// //     getCurrentDayData,
// //     getUserEmotion,
// //     updateUserEmotion,
// //     addComment,
// //     getDatesWithEntries,
// //     setUserId,
// //   };
// // }

// import { useState, useEffect } from 'react';
// import { getTodayDate } from '../utils/emotionUtils.js';
// import { useCommon } from '../contexts/CommonContext.js';

// export function useCalendarEmotion(familyId = '67d2bed97b36eb9903fb29a8') {
//   const { emotionCalendarDataTotal } = useCommon();
//   const [familyData, setFamilyData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [currentDate, setCurrentDate] = useState(getTodayDate());
//   const [userId, setUserId] = useState('67d2c31fbfe50197d043aca9'); // Default user for demo

//   // Fetch data from emotionCalendarDataTotal
//   useEffect(() => {
//     const fetchData = async () => {
//       // Simulate API call delay
//       await new Promise((resolve) => setTimeout(resolve, 500));

//       // Set familyData from emotionCalendarDataTotal
//       if (emotionCalendarDataTotal && emotionCalendarDataTotal[familyId]) {
//         setFamilyData(emotionCalendarDataTotal[familyId]);
//       } else {
//         setFamilyData({
//           members: [],
//           calendar: {},
//         });
//       }

//       setLoading(false);
//     };

//     fetchData();
//   }, [familyId, emotionCalendarDataTotal]);

//   // Get current day's data
//   const getCurrentDayData = () => {
//     if (!familyData?.calendar?.[currentDate]) {
//       return {
//         members: {},
//         discussion: { comments: [] },
//       };
//     }

//     const dayData = { ...familyData.calendar[currentDate] };

//     // Ensure discussion exists
//     if (!dayData.discussion) {
//       dayData.discussion = { comments: [] };
//     }

//     return dayData;
//   };

//   // Get user's emotion for current date
//   const getUserEmotion = () => {
//     const dayData = getCurrentDayData();
//     return dayData[userId] || { emoji: null, note: '' };
//   };

//   // Update user's emotion
//   const updateUserEmotion = (emoji, note) => {
//     if (!familyData) return;

//     const updatedFamilyData = { ...familyData };

//     // Initialize the day if it doesn't exist
//     if (!updatedFamilyData.calendar[currentDate]) {
//       updatedFamilyData.calendar[currentDate] = {};
//     }

//     // Update user's emotion
//     updatedFamilyData.calendar[currentDate] = {
//       ...updatedFamilyData.calendar[currentDate],
//       [userId]: { emoji, note },
//     };

//     // Ensure discussion exists
//     if (!updatedFamilyData.calendar[currentDate].discussion) {
//       updatedFamilyData.calendar[currentDate].discussion = { comments: [] };
//     }

//     setFamilyData(updatedFamilyData);

//     // In a real app, you would save to database here
//     console.log('Updated emotion:', { date: currentDate, userId, emoji, note });
//   };

//   // Add a comment to the discussion
//   const addComment = (text) => {
//     if (!familyData) return;

//     const updatedFamilyData = { ...familyData };

//     // Initialize the day if it doesn't exist
//     if (!updatedFamilyData.calendar[currentDate]) {
//       updatedFamilyData.calendar[currentDate] = {};
//     }

//     // Initialize discussion if it doesn't exist
//     if (!updatedFamilyData.calendar[currentDate].discussion) {
//       updatedFamilyData.calendar[currentDate].discussion = { comments: [] };
//     }

//     // Add comment
//     const newComment = {
//       userId,
//       text,
//       timestamp: new Date().toISOString(),
//     };

//     updatedFamilyData.calendar[currentDate].discussion.comments = [
//       ...updatedFamilyData.calendar[currentDate].discussion.comments,
//       newComment,
//     ];

//     setFamilyData(updatedFamilyData);

//     // In a real app, you would save to database here
//     console.log('Added comment:', { date: currentDate, userId, text });
//   };

//   // Get all dates that have entries
//   const getDatesWithEntries = () => {
//     if (!familyData?.calendar) return [];
//     return Object.keys(familyData.calendar);
//   };

//   // Change current date
//   const changeDate = (date) => {
//     setCurrentDate(date);
//   };

//   return {
//     familyData,
//     loading,
//     currentDate,
//     userId,
//     changeDate,
//     getCurrentDayData,
//     getUserEmotion,
//     updateUserEmotion,
//     addComment,
//     getDatesWithEntries,
//     setUserId,
//   };
// }

/*

Giải thích chi tiết
1. Theo dõi userId hiện tại:

Sử dụng state userId để lưu trữ ID của user đang tương tác.

Khi fetch dữ liệu, nếu userId chưa được set, set userId mặc định là ID của thành viên đầu tiên trong danh sách.

2. Phân biệt dữ liệu theo userId:

Khi cập nhật cảm xúc (updateUserEmotion), đảm bảo rằng cảm xúc được ghi lại bởi user hiện tại (userId).

Khi thêm bình luận (addComment), đảm bảo rằng bình luận được ghi lại bởi user hiện tại (userId).

3. Cập nhật logic để phù hợp với nhiều user:

Dữ liệu cảm xúc và bình luận được lưu trữ riêng biệt cho từng user.

Khi lấy dữ liệu (getCurrentDayData, getUserEmotion), chỉ trả về dữ liệu của user hiện tại.

4. Đảm bảo tính tương thích:

Các hàm vẫn hoạt động với cấu trúc dữ liệu mới từ emotionCalendarDataTotal.

*/

// import { useState, useEffect } from 'react';
// import { getTodayDate } from '../utils/emotionUtils.js';
// import { useCommon } from '../contexts/CommonContext.js';

// export function useCalendarEmotion(familyId = '67d2bed97b36eb9903fb29a8') {
//   const { emotionCalendarDataTotal } = useCommon();
//   const [familyData, setFamilyData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [currentDate, setCurrentDate] = useState(getTodayDate());
//   const [userId, setUserId] = useState(null); // State để lưu userId hiện tại

//   // Fetch data from emotionCalendarDataTotal
//   useEffect(() => {
//     const fetchData = async () => {
//       // Simulate API call delay
//       await new Promise((resolve) => setTimeout(resolve, 500));

//       // Set familyData from emotionCalendarDataTotal
//       if (emotionCalendarDataTotal && emotionCalendarDataTotal[familyId]) {
//         setFamilyData(emotionCalendarDataTotal[familyId]);
//         // Set default userId to the first member if not set
//         if (!userId && emotionCalendarDataTotal[familyId].members.length > 0) {
//           setUserId(emotionCalendarDataTotal[familyId].members[0].id);
//         }
//       } else {
//         setFamilyData({
//           members: [],
//           calendar: {},
//         });
//       }

//       setLoading(false);
//     };

//     fetchData();
//   }, [familyId, emotionCalendarDataTotal, userId]);

//   // Get current day's data
//   const getCurrentDayData = () => {
//     if (!familyData?.calendar?.[currentDate]) {
//       return {
//         members: {},
//         discussion: { comments: [] },
//       };
//     }

//     const dayData = { ...familyData.calendar[currentDate] };

//     // Ensure discussion exists
//     if (!dayData.discussion) {
//       dayData.discussion = { comments: [] };
//     }

//     return dayData;
//   };

//   // Get user's emotion for current date
//   const getUserEmotion = () => {
//     const dayData = getCurrentDayData();
//     return dayData[userId] || { emoji: null, note: '' };
//   };

//   // Update user's emotion
//   const updateUserEmotion = (emoji, note) => {
//     if (!familyData || !userId) return;

//     const updatedFamilyData = { ...familyData };

//     // Initialize the day if it doesn't exist
//     if (!updatedFamilyData.calendar[currentDate]) {
//       updatedFamilyData.calendar[currentDate] = {};
//     }

//     // Update user's emotion
//     updatedFamilyData.calendar[currentDate] = {
//       ...updatedFamilyData.calendar[currentDate],
//       [userId]: { emoji, note },
//     };

//     // Ensure discussion exists
//     if (!updatedFamilyData.calendar[currentDate].discussion) {
//       updatedFamilyData.calendar[currentDate].discussion = { comments: [] };
//     }

//     setFamilyData(updatedFamilyData);

//     // In a real app, you would save to database here
//     console.log('Updated emotion:', { date: currentDate, userId, emoji, note });
//   };

//   // Add a comment to the discussion
//   const addComment = (text) => {
//     if (!familyData || !userId) return;

//     const updatedFamilyData = { ...familyData };

//     // Initialize the day if it doesn't exist
//     if (!updatedFamilyData.calendar[currentDate]) {
//       updatedFamilyData.calendar[currentDate] = {};
//     }

//     // Initialize discussion if it doesn't exist
//     if (!updatedFamilyData.calendar[currentDate].discussion) {
//       updatedFamilyData.calendar[currentDate].discussion = { comments: [] };
//     }

//     // Add comment
//     const newComment = {
//       userId,
//       text,
//       timestamp: new Date().toISOString(),
//     };

//     updatedFamilyData.calendar[currentDate].discussion.comments = [
//       ...updatedFamilyData.calendar[currentDate].discussion.comments,
//       newComment,
//     ];

//     setFamilyData(updatedFamilyData);

//     // In a real app, you would save to database here
//     console.log('Added comment:', { date: currentDate, userId, text });
//   };

//   // Get all dates that have entries
//   const getDatesWithEntries = () => {
//     if (!familyData?.calendar) return [];
//     return Object.keys(familyData.calendar);
//   };

//   // Change current date
//   const changeDate = (date) => {
//     setCurrentDate(date);
//   };

//   return {
//     familyData,
//     loading,
//     currentDate,
//     userId,
//     changeDate,
//     getCurrentDayData,
//     getUserEmotion,
//     updateUserEmotion,
//     addComment,
//     getDatesWithEntries,
//     setUserId,
//   };
// }

import { useState, useEffect } from 'react';
import { getTodayDate } from '../utils/emotionUtils.js';
import { useCommon } from '../contexts/CommonContext.js';

export function useCalendarEmotion(familyId = '67d2bed97b36eb9903fb29a8') {
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
