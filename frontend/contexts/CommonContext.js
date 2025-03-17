import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { Platform } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTodayDate } from '../utils/emotionUtils';

const CommonContext = createContext();

export const useCommon = () => useContext(CommonContext);

export const Common = ({ children }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [myFamily, setMyFamily] = useState(null);
  const [familyId, setFamilyId] = useState(null);
  const [myFamilyMembers, setMyFamilyMembers] = useState([]);
  const [emotionCalendarDataTotal, setEmotionCalendarDataTotal] = useState({});
  const [userLoggedIn, setUserLoggedIn] = useState(null);
  const [userId, setUserId] = useState(null);
  const [familyData, setFamilyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const myip = process.env.EXPO_PUBLIC_IPV4_ADDRESS;

  const getApiBaseUrl = useCallback(() => {
    if (Platform.OS === 'ios') {
      return `${myip}:3000`;
    } else if (Platform.OS === 'android') {
      return '10.0.2.2:3000';
    }
    return 'localhost:3000';
  }, [myip]);

  const apiBaseUrl = getApiBaseUrl();

  // Check for stored user data on app start
  useEffect(() => {
    const checkStoredUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('userLoggedIn');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUserLoggedIn(userData);
          setUserId(userData._id);
        }
      } catch (error) {
        console.error('Error checking stored user:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkStoredUser();
  }, []);

  const fetchFamilyData = useCallback(async () => {
    if (!userLoggedIn?._id) return;

    try {
      setIsLoading(true);

      // Get family data
      const familyResponse = await axios.get(
        `http://${apiBaseUrl}/families/by-userId/${userLoggedIn._id}`
      );

      if (familyResponse.data) {
        setMyFamily(familyResponse.data);
        setFamilyId(familyResponse.data._id);

        // Get family members
        const membersResponse = await axios.get(
          `http://${apiBaseUrl}/families/${familyResponse.data._id}/members`
        );

        const formattedMembers = membersResponse.data.map((member) => ({
          id: member._id,
          name: member.username,
          avatar: member.avatar,
        }));
        setMyFamilyMembers(formattedMembers);

        // Get emotion calendar data
        const calendarResponse = await axios.get(
          `http://${apiBaseUrl}/calendars/get-calendar-of-family/${familyResponse.data._id}`
        );

        if (calendarResponse.data) {
          setEmotionCalendarDataTotal(calendarResponse.data);
          setFamilyData(calendarResponse.data[familyResponse.data._id]);
        }
      }
    } catch (error) {
      console.error('Error fetching family data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userLoggedIn, apiBaseUrl]);

  // Fetch family data when user is logged in
  useEffect(() => {
    if (userLoggedIn && userId) {
      fetchFamilyData();
    }
  }, [userLoggedIn, userId]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userLoggedIn');
      setUserLoggedIn(null);
      setUserId(null);
      setMyFamily(null);
      setMyFamilyMembers([]);
      setEmotionCalendarDataTotal({});
      setFamilyData(null);
      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      return false;
    }
  };

  return (
    <CommonContext.Provider
      value={{
        axios,
        myip,
        familyId,
        userMenuOpen,
        setUserMenuOpen,
        myFamily,
        setMyFamily,
        myFamilyMembers,
        setMyFamilyMembers,
        emotionCalendarDataTotal,
        setEmotionCalendarDataTotal,
        userId,
        setUserId,
        AsyncStorage,
        apiBaseUrl,
        userLoggedIn,
        setUserLoggedIn,
        familyData,
        setFamilyData,
        handleLogout,
        isLoading,
        fetchFamilyData,
      }}
    >
      {children}
    </CommonContext.Provider>
  );
};
