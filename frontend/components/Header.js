// import React, { useEffect } from 'react';
// import { StyleSheet, View, Text, Pressable } from 'react-native';
// import Feather from '@expo/vector-icons/Feather';
// import { useCommon } from '../contexts/CommonContext';
// import { useCalendarEmotion } from '../hooks/useCalendarEmotion';

// function Header() {
//   const { familyData } = useCalendarEmotion(); // Lấy familyData từ useCalendarEmotion
//   const { userMenuOpen, setUserMenuOpen, userId, setUserId } = useCommon(); // Lấy userId và setUserId từ CommonContext

//   useEffect(() => {
//     console.log('familyData', familyData);
//   }, [familyData]);

//   const switchUser = (id) => {
//     setUserId(id); // Cập nhật userId trong CommonContext
//     setUserMenuOpen(false); // Đóng menu sau khi chọn user
//   };

//   return (
//     <View style={styles.header}>
//       <View style={styles.headerContent}>
//         <Text style={styles.headerTitle}>Family Calendars</Text>

//         <View style={styles.userMenuContainer}>
//           <Pressable
//             onPress={() => setUserMenuOpen(!userMenuOpen)}
//             style={styles.userButton}
//           >
//             <View style={styles.userIcon}>
//               <Feather name='user' size={16} color='black' />
//             </View>
//             <Text style={styles.userName}>
//               {familyData?.members.find((member) => member.id === userId)
//                 ?.name || 'User'}
//             </Text>
//           </Pressable>

//           {userMenuOpen && (
//             <View style={styles.userMenu}>
//               {familyData?.members?.map((member) => (
//                 <Pressable
//                   key={member?.id}
//                   onPress={() => switchUser(member.id)}
//                   style={[
//                     styles.userMenuItem,
//                     userId === member?.id && styles.userMenuItemActive,
//                   ]}
//                 >
//                   <Text style={styles.userMenuItemText}>{member?.name}</Text>
//                 </Pressable>
//               ))}
//             </View>
//           )}
//         </View>
//       </View>
//     </View>
//   );
// }

// export default Header;

// const styles = StyleSheet.create({
//   header: {
//     zIndex: 1,
//     width: '100%',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//     paddingVertical: 10,
//   },
//   headerContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     maxWidth: '100%',
//     marginHorizontal: 'auto',
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '500',
//     color: '#007bff',
//   },
//   userMenuContainer: {
//     position: 'relative',
//   },
//   userButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     padding: 8,
//     borderRadius: 8,
//   },
//   userIcon: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: 'rgba(0, 123, 255, 0.1)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   userName: {
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   userMenu: {
//     position: 'absolute',
//     right: 0,
//     top: 40,
//     width: 192,
//     backgroundColor: 'white',
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//     paddingVertical: 8,
//   },
//   userMenuItem: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//   },
//   userMenuItemActive: {
//     backgroundColor: 'rgba(0, 123, 255, 0.05)',
//   },
//   userMenuItemText: {
//     fontSize: 14,
//   },
// });

import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Alert } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useCommon } from '../contexts/CommonContext';
import { useCalendarEmotion } from '../hooks/useCalendarEmotion';
import { useNavigation } from '@react-navigation/native'; // Thêm hook useNavigation

function Header() {
  const { familyData } = useCalendarEmotion(); // Lấy familyData từ useCalendarEmotion
  const {
    userMenuOpen,
    setUserMenuOpen,
    userId,
    setUserId,
    myFamily,
    setMyFamily,
    myFamilyMembers,
    setMyFamilyMembers,
    userLoggedIn,
    setUserLoggedIn,
    AsyncStorage,
    setFamilyData,
  } = useCommon(); // Lấy các giá trị cần thiết từ CommonContext
  const navigation = useNavigation(); // Sử dụng hook useNavigation để điều hướng

  useEffect(() => {
    console.log('familyData', familyData);
  }, [familyData]);

  const switchUser = (id) => {
    setUserId(id); // Cập nhật userId trong CommonContext
    setUserMenuOpen(false); // Đóng menu sau khi chọn user
  };

  // Hàm xử lý đăng xuất
  const handleLogout = async () => {
    try {
      // Xóa thông tin người dùng khỏi AsyncStorage
      await AsyncStorage.removeItem('userLoggedIn');
      // Đặt lại trạng thái người dùng đã đăng nhập
      setUserLoggedIn(null);

      // Chuyển hướng về màn hình Introduction
      navigation.navigate('Introduction');
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi đăng xuất. Vui lòng thử lại.');
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Family Calendars</Text>

        <View style={styles.userMenuContainer}>
          {/* Nút đăng xuất */}

          <Pressable
            onPress={() => setUserMenuOpen(!userMenuOpen)}
            style={styles.userButton}
          >
            <View style={styles.userIcon}>
              <Feather name='user' size={16} color='black' />
            </View>
            <Text style={styles.userName}>
              {familyData?.members.find((member) => member.id === userId)
                ?.name || 'User'}
            </Text>
          </Pressable>
          <Pressable onPress={handleLogout} style={styles.logoutButton}>
            <Feather name='log-out' size={20} color='black' />
          </Pressable>

          {userMenuOpen && (
            <View style={styles.userMenu}>
              {familyData?.members?.map((member) => (
                <Pressable
                  key={member?.id}
                  onPress={() => switchUser(member.id)}
                  style={[
                    styles.userMenuItem,
                    userId === member?.id && styles.userMenuItemActive,
                  ]}
                >
                  <Text style={styles.userMenuItemText}>{member?.name}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

export default Header;

const styles = StyleSheet.create({
  header: {
    zIndex: 1,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    paddingVertical: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Căn giữa các phần tử
    paddingHorizontal: 25, // Thêm padding ngang để không bị dính vào viền
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#007bff',
  },
  userMenuContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16, // Khoảng cách giữa nút đăng xuất và nút user
  },
  logoutButton: {
    padding: 8,
  },
  userButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    borderRadius: 8,
  },
  userIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 14,
    fontWeight: '500',
  },
  userMenu: {
    position: 'absolute',
    right: 0,
    top: 40,
    width: 192,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    paddingVertical: 8,
  },
  userMenuItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  userMenuItemActive: {
    backgroundColor: 'rgba(0, 123, 255, 0.05)',
  },
  userMenuItemText: {
    fontSize: 14,
  },
});
