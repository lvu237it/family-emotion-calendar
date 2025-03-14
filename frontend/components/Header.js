import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useCommon } from '../contexts/CommonContext';
import { useCalendarEmotion } from '../hooks/useCalendarEmotion';

function Header() {
  const { familyData } = useCalendarEmotion(); // Lấy familyData từ useCalendarEmotion
  const { userMenuOpen, setUserMenuOpen, userId, setUserId } = useCommon(); // Lấy userId và setUserId từ CommonContext

  const switchUser = (id) => {
    setUserId(id); // Cập nhật userId trong CommonContext
    setUserMenuOpen(false); // Đóng menu sau khi chọn user
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
              {familyData?.members.find((m) => m.id === userId)?.name || 'User'}
            </Text>
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
    gap: 6,
    maxWidth: '100%',
    marginHorizontal: 'auto',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#007bff',
  },
  userMenuContainer: {
    position: 'relative',
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
