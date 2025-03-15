import { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CommonContext = createContext();

export const useCommon = () => useContext(CommonContext);

export const Common = ({ children }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [myFamilyIdToSeparate, setMyFamilyIdToSeparate] = useState(null);
  const [myFamily, setMyFamily] = useState({});
  const [myFamilyMembers, setMyFamilyMembers] = useState([]);
  const [emotionCalendarDataTotal, setEmotionCalendarDataTotal] = useState({});
  const [userLoggedIn, setUserLoggedIn] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isSuccessCreateAccount, setIsSuccessCreateAccount] = useState(false);
  const [familyData, setFamilyData] = useState(null);

  const myip = process.env.EXPO_PUBLIC_IPV4_ADDRESS;

  const getApiBaseUrl = () => {
    if (Platform.OS === 'ios') {
      return `${myip}:3000`;
    } else if (Platform.OS === 'android') {
      return '10.0.2.2:3000';
    }
    return 'localhost:3000';
  };

  const apiBaseUrl = getApiBaseUrl();

  useEffect(() => {
    if (Platform.OS === 'ios') {
      console.log('Thiết bị đang chạy iOS');
    } else if (Platform.OS === 'android') {
      console.log('Thiết bị đang chạy Android');
    }
    console.log('getApiBaseUrl', getApiBaseUrl());
  }, []);

  useEffect(() => {
    // Lấy danh sách các thành viên trong gia đình
    if (myFamily && myFamily._id && userLoggedIn) {
      console.log('Fetching members for family:', myFamily._id);
      fetch(`http://${apiBaseUrl}/families/${myFamily._id}/members`)
        .then((response) => response.json())
        .then((members) => {
          const formattedMembers = members.map((member) => ({
            id: member._id,
            name: member.username,
            avatar: member.avatar,
          }));
          console.log('Members fetched:', formattedMembers);
          setMyFamilyMembers(formattedMembers);
        })
        .catch((error) => {
          console.error('Error fetching members:', error);
          setMyFamilyMembers([]);
        });
    }

    // Lấy thông tin calendar của gia đình
    if (myFamily && myFamily._id && userLoggedIn) {
      console.log('Fetching calendar data for family:', myFamily._id);
      fetch(
        `http://${apiBaseUrl}/calendars/get-calendar-of-family/${myFamily._id}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log('Calendar data fetched:', data);
          setEmotionCalendarDataTotal(data);
        })
        .catch((error) => {
          console.error('Error fetching calendar data:', error);
          setEmotionCalendarDataTotal({});
        });
    }

    //Trường hợp login - khi chưa có family data trước đó mà chỉ có userLoggedIn
    if (!myFamily && !myFamily._id && userLoggedIn) {
      // Lấy dữ liệu gia đình
      const fetchFamilyDataByUserId = async () => {
        try {
          if (userLoggedIn && !myFamily._id) {
            const response = await axios.get(
              `http://${apiBaseUrl}/families/by-userId/${userLoggedIn._id}`
            );
            if (response.data) {
              setMyFamily(response.data);
            }
          }
        } catch (error) {
          console.error('Lỗi khi lấy dữ liệu family từ người dùng:', error);
        }
      };

      fetchFamilyDataByUserId(); //Lấy được family để sử dụng cho việc fetchData từ

      // Sau đó lấy dữ liệu calendar
      fetch(
        `http://${apiBaseUrl}/calendars/get-calendar-of-family/${myFamily._id}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log('Calendar data fetched:', data);
          // setEmotionCalendarDataTotal(data);
          setFamilyData(data[myFamily._id]);
        })
        .catch((error) => {
          console.error('Error fetching calendar data:', error);
          setEmotionCalendarDataTotal({});
        });

      // setFamilyData(emotionCalendarDataTotal[myFamily._id]);
    }
  }, [myFamily, userLoggedIn]);

  useEffect(() => {
    console.log('apiBaseUrl', apiBaseUrl);

    const removeItemFirstRender = async () => {
      const getUserLoggedIn = await AsyncStorage.getItem('userLoggedIn');
      console.log('getuserlogin', getUserLoggedIn);
      if (getUserLoggedIn) {
        await AsyncStorage.removeItem('userLoggedIn');
      }
    };
    removeItemFirstRender();
  }, []);

  useEffect(() => {
    console.log('userlogin', userLoggedIn);
  }, [userLoggedIn]);

  return (
    <CommonContext.Provider
      value={{
        axios,
        myip,
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
        apiBaseUrl,
        myFamilyIdToSeparate,
        setMyFamilyIdToSeparate,
        userLoggedIn,
        setUserLoggedIn,
        isSuccessCreateAccount,
        setIsSuccessCreateAccount,
        familyData,
        setFamilyData,
        setEmotionCalendarDataTotal,
      }}
    >
      {children}
    </CommonContext.Provider>
  );
};
