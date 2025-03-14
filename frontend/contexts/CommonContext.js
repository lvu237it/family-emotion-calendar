import { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CommonContext = createContext();

export const useCommon = () => useContext(CommonContext);

export const Common = ({ children }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const exampleFamilyId = '67d2bed97b36eb9903fb29a8';
  const [myFamily, setMyFamily] = useState(null);
  const [myFamilyMembers, setMyFamilyMembers] = useState([]);
  const [emotionCalendarDataTotal, setEmotionCalendarDataTotal] = useState({});
  const [userId, setUserId] = useState(null); // Thêm state để quản lý userId
  // Sử dụng cho thiết bị iOS khi call api
  const myip = process.env.EXPO_PUBLIC_IPV4_ADDRESS;

  const getApiBaseUrl = () => {
    if (Platform.OS === 'ios') {
      return `${myip}:3000`;
      // Mở cmd, nhập 'ipconfig' => lấy IPv4
      // 'http://<IP-của-máy-host>:3000'; // Thay <IP-của-máy-host> bằng IP thực của máy host
    } else if (Platform.OS === 'android') {
      return '10.0.2.2:3000'; // Android Emulator sử dụng 10.0.2.2 để truy cập localhost
    }
    return 'localhost:3000';
  };

  useEffect(() => {
    if (Platform.OS === 'ios') {
      console.log('Thiết bị đang chạy iOS');
    } else if (Platform.OS === 'android') {
      console.log('Thiết bị đang chạy Android');
    }
    console.log('getApiBaseUrl', getApiBaseUrl());
  }, []);

  // Fetch family info và members
  useEffect(() => {
    const ip = getApiBaseUrl();
    // Fetch family info
    fetch(`http://${ip}/families/${exampleFamilyId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('fam', data);
        setMyFamily(data);
      })
      .catch((error) => console.error('Error fetching family:', error));

    // Fetch family members
    fetch(`http://${ip}/families/${exampleFamilyId}/members`)
      .then((response) => response.json())
      .then((members) => {
        // Định dạng lại thành viên để khớp với mock data
        const formattedMembers = members.map((member) => ({
          id: member._id,
          name: member.username,
          avatar: member.avatar,
        }));
        console.log('members', formattedMembers);
        setMyFamilyMembers(formattedMembers);
      })
      .catch((error) => console.error('Error fetching members:', error));

    //Lấy dữ liệu calendar tổng hợp của 1 gia đình qua từng ngày
    fetch(`http://${ip}/calendars/get-calendar-of-family/${exampleFamilyId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('data total', data);
        setEmotionCalendarDataTotal(data);
      })
      .catch((error) =>
        console.error('Error fetching total of emotion calendar data:', error)
      );
  }, []);

  useEffect(() => {
    console.log('famdata', emotionCalendarDataTotal);
  }, [emotionCalendarDataTotal]);

  return (
    <CommonContext.Provider
      value={{
        axios,
        myip,
        exampleFamilyId,
        userMenuOpen,
        setUserMenuOpen,
        myFamily,
        setMyFamily,
        myFamilyMembers,
        setMyFamilyMembers,
        emotionCalendarDataTotal,
        userId,
        setUserId,
        AsyncStorage,
      }}
    >
      {children}
    </CommonContext.Provider>
  );
};
