// import React, { useState } from 'react';
// import { useCalendarEmotion } from '../hooks/useCalendarEmotion';
// import Calendar from './Calendar';
// import EmotionModal from './EmotionModal';
// import FamilyDiscussion from './FamilyDiscussion';
// import EmotionSummary from '../components/EmotionSummary';
// import { isToday, formatDisplayDate } from '../utils/emotionUtils';

// import Entypo from '@expo/vector-icons/Entypo';
// import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
// import { useCommon } from '../contexts/CommonContext';

// const Index = () => {
//   const {
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
//   } = useCalendarEmotion();
//   const { userMenuOpen, setUserMenuOpen } = useCommon();

//   const [isEmotionModalOpen, setIsEmotionModalOpen] = useState(false);
//   // const [userMenuOpen, setUserMenuOpen] = useState(false);

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <View style={styles.loadingContent}>
//           <View style={styles.loadingIcon}></View>
//           <View style={styles.loadingText}></View>
//         </View>
//       </View>
//     );
//   }

//   const dayData = getCurrentDayData();
//   const userEmotion = getUserEmotion();
//   const datesWithEntries = getDatesWithEntries();
//   const isTodaySelected = isToday(currentDate);

//   const handleEmotionUpdate = (emoji, note) => {
//     updateUserEmotion(emoji, note);
//   };

//   const handleCommentAdd = (text) => {
//     addComment(text);
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <View>
//         {/* Thêm 2 button hoặc 2 touchable ở đây để điều hướng người dùng chuyển sang calendar khác */}
//       </View>
//       <View style={styles.mainContent}>
//         <View style={styles.gridContainer}>
//           <View style={styles.calendarSection}>
//             <Calendar
//               datesWithEntries={datesWithEntries}
//               onSelectDate={changeDate}
//               selectedDate={currentDate}
//             />

//             {isTodaySelected && (
//               <View style={styles.moodButtonContainer}>
//                 <Pressable
//                   onPress={() => setIsEmotionModalOpen(true)}
//                   style={[
//                     styles.moodButton,
//                     userEmotion.emoji
//                       ? styles.moodButtonUpdate
//                       : styles.moodButtonRecord,
//                   ]}
//                 >
//                   {userEmotion.emoji ? (
//                     <>
//                       <Text style={styles.moodButtonEmoji}>
//                         {userEmotion.emoji}
//                       </Text>
//                       <Text style={styles.moodButtonText}>
//                         Cập nhật trạng thái
//                       </Text>
//                     </>
//                   ) : (
//                     <>
//                       <Entypo name='plus' size={18} color='black' />
//                       <Text style={styles.moodButtonText}>
//                         Ghi lại cảm xúc của bạn
//                       </Text>
//                     </>
//                   )}
//                 </Pressable>
//               </View>
//             )}
//           </View>

//           <View style={styles.detailsSection}>
//             {/* <Text style={styles.dateTitle}>
//               {formatDisplayDate(currentDate)}
//             </Text> */}

//             <EmotionSummary
//               dayData={dayData}
//               familyMembers={familyData.members}
//             />

//             <FamilyDiscussion
//               discussion={dayData.discussion || { comments: [] }}
//               familyMembers={familyData.members}
//               userId={userId}
//               onAddComment={handleCommentAdd}
//               isToday={isTodaySelected}
//             />
//           </View>
//         </View>
//       </View>

//       <EmotionModal
//         isOpen={isEmotionModalOpen}
//         onClose={() => setIsEmotionModalOpen(false)}
//         currentEmotion={userEmotion}
//         onSave={handleEmotionUpdate}
//       />
//     </ScrollView>
//   );
// };

// export default Index;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f0f4f8',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f0f4f8',
//   },
//   loadingContent: {
//     alignItems: 'center',
//   },
//   loadingIcon: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: 'rgba(0, 123, 255, 0.1)',
//     marginBottom: 16,
//   },
//   loadingText: {
//     height: 16,
//     width: 128,
//     backgroundColor: 'rgba(0, 123, 255, 0.1)',
//     borderRadius: 4,
//   },
//   mainContent: {
//     paddingHorizontal: 16,
//     paddingVertical: 32,
//     maxWidth: '100%',
//     marginHorizontal: 'auto',
//   },
//   gridContainer: {
//     gap: 24,
//   },
//   calendarSection: {
//     gap: 16,
//   },
//   moodButtonContainer: {
//     marginTop: 24,
//   },
//   moodButton: {
//     width: '100%',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderRadius: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 8,
//   },
//   moodButtonUpdate: {
//     backgroundColor: 'rgba(0, 123, 255, 0.1)',
//   },
//   moodButtonRecord: {
//     backgroundColor: '#007bff',
//   },
//   moodButtonEmoji: {
//     fontSize: 20,
//   },
//   moodButtonText: {
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   detailsSection: {
//     gap: 24,
//   },
//   dateTitle: {
//     fontSize: 18,
//     fontWeight: '500',
//     marginTop: 10,
//     textAlign: 'center',
//   },
// });
import React, { useState } from 'react';
import { useCalendarEmotion } from '../hooks/useCalendarEmotion';
import Calendar from './Calendar';
import EmotionModal from './EmotionModal';
import FamilyDiscussion from './FamilyDiscussion';
import EmotionSummary from '../components/EmotionSummary';
import { isToday } from '../utils/emotionUtils';

import Entypo from '@expo/vector-icons/Entypo';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useCommon } from '../contexts/CommonContext';

const Index = () => {
  const {
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
  } = useCalendarEmotion();
  const { userMenuOpen, setUserMenuOpen } = useCommon();

  const [isEmotionModalOpen, setIsEmotionModalOpen] = useState(false);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <View style={styles.loadingIcon}></View>
          <View style={styles.loadingText}></View>
        </View>
      </View>
    );
  }

  const dayData = getCurrentDayData();
  const userEmotion = getUserEmotion();
  const datesWithEntries = getDatesWithEntries();
  const isTodaySelected = isToday(currentDate);

  const handleEmotionUpdate = (emoji, note) => {
    updateUserEmotion(emoji, note);
  };

  const handleCommentAdd = (text) => {
    addComment(text);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.mainContent}>
        <View style={styles.gridContainer}>
          <View style={styles.calendarSection}>
            <Calendar
              datesWithEntries={datesWithEntries}
              onSelectDate={changeDate}
              selectedDate={currentDate}
            />

            {isTodaySelected && (
              <View style={styles.moodButtonContainer}>
                <Pressable
                  onPress={() => setIsEmotionModalOpen(true)}
                  style={[
                    styles.moodButton,
                    userEmotion.emoji
                      ? styles.moodButtonUpdate
                      : styles.moodButtonRecord,
                  ]}
                >
                  {userEmotion.emoji ? (
                    <>
                      <Text style={styles.moodButtonEmoji}>
                        {userEmotion.emoji}
                      </Text>
                      <Text style={styles.moodButtonText}>
                        Cập nhật trạng thái
                      </Text>
                    </>
                  ) : (
                    <>
                      <Entypo name='plus' size={18} color='black' />
                      <Text style={styles.moodButtonText}>
                        Ghi lại cảm xúc của bạn
                      </Text>
                    </>
                  )}
                </Pressable>
              </View>
            )}
          </View>

          <View style={styles.detailsSection}>
            <EmotionSummary
              dayData={dayData}
              familyMembers={familyData.members}
            />

            <FamilyDiscussion
              discussion={dayData.discussion || { comments: [] }}
              familyMembers={familyData.members}
              userId={userId}
              onAddComment={handleCommentAdd}
              isToday={isTodaySelected}
            />
          </View>
        </View>
      </View>

      <EmotionModal
        isOpen={isEmotionModalOpen}
        onClose={() => setIsEmotionModalOpen(false)}
        currentEmotion={userEmotion}
        onSave={handleEmotionUpdate}
      />
    </ScrollView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
    marginBottom: 16,
  },
  loadingText: {
    height: 16,
    width: 128,
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
    borderRadius: 4,
  },
  mainContent: {
    paddingHorizontal: 16,
    paddingVertical: 32,
    maxWidth: '100%',
    marginHorizontal: 'auto',
  },
  gridContainer: {
    gap: 24,
  },
  calendarSection: {
    gap: 16,
  },
  moodButtonContainer: {
    marginTop: 24,
  },
  moodButton: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  moodButtonUpdate: {
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
  },
  moodButtonRecord: {
    backgroundColor: '#007bff',
  },
  moodButtonEmoji: {
    fontSize: 20,
  },
  moodButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  detailsSection: {
    gap: 24,
  },
});
