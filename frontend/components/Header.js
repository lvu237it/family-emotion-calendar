import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Alert } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useCommon } from '../contexts/CommonContext';
import { useCalendarEmotion } from '../hooks/useCalendarEmotion';
import { useNavigation } from '@react-navigation/native';

function Header() {
  const { familyData } = useCalendarEmotion();
  const {
    userMenuOpen,
    setUserMenuOpen,
    userId,
    setUserId,
    userLoggedIn,
    handleLogout,
  } = useCommon();
  const navigation = useNavigation();

  const onLogout = async () => {
    const success = await handleLogout();
    if (success) {
      navigation.replace('Introduction');
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Family Calendars</Text>

        <View style={styles.userMenuContainer}>
          <Pressable
            onPress={() => setUserMenuOpen(!userMenuOpen)}
            style={styles.userButton}
          >
            <View style={styles.userIcon}>
              <Feather name='user' size={16} color='black' />
            </View>
            <Text style={styles.userName}>
              {userLoggedIn?.username || 'User'}
            </Text>
          </Pressable>

          <Pressable onPress={onLogout} style={styles.logoutButton}>
            <Feather name='log-out' size={20} color='black' />
          </Pressable>
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
