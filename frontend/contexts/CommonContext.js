import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
const CommonContext = createContext();

export const useCommon = () => useContext(CommonContext);

export const Common = ({ children }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const exampleFamilyId = '67d2bed97b36eb9903fb29a8';
  const [myFamily, setMyFamily] = useState(null);
  const [myFamilyMembers, setMyFamilyMembers] = useState([]);
  const [emotionCalendarDataTotal, setEmotionCalendarDataTotal] = useState({});
  const [userId, setUserId] = useState(null); // Thêm state để quản lý userId
  const myip = process.env.EXPO_PUBLIC_MY_PRIVATE_IP;

  // useEffect(() => {
  //   // fetch(`http://10.0.2.2:3000/families/${exampleFamilyId}`)
  //   // NOTE -----------------------10.0.2.2: Chỉ hoạt động trên thiết bị Android----------------------------
  //     .then((response) => response.json()) // Đợi đến khi dữ liệu JSON được phân tích
  //     .then((responseAfterJsonParse) => {
  //       console.log('response', responseAfterJsonParse.data);
  //       console.log('response', responseAfterJsonParse.data.data);
  //       setMyFamily(responseAfterJsonParse.data.data); // Cập nhật state với dữ liệu nhận được
  //     })
  //     .catch((error) => console.error('Error fetching recipes:', error));
  // }, []);

  // useEffect(() => {
  //   //Lấy family by id
  //   fetch(`http://${myip}:3000/families/${exampleFamilyId}`)
  //     .then((response) => response.json()) // Đợi đến khi dữ liệu JSON được phân tích
  //     .then((responseAfterJsonParse) => {
  //       setMyFamily(responseAfterJsonParse); // Cập nhật state với dữ liệu nhận được
  //     })
  //     .catch((error) => console.error('Error fetching family by id:', error));

  //   //Lấy family members
  //   fetch(`http://${myip}:3000/families/${exampleFamilyId}/members`)
  //     .then((response) => response.json()) // Đợi đến khi dữ liệu JSON được phân tích
  //     .then((responseAfterJsonParse) => {
  //       console.log('responseAfterJsonParse', responseAfterJsonParse);
  //       setMyFamilyMembers(responseAfterJsonParse); // Cập nhật state với dữ liệu nhận được
  //     })
  //     .catch((error) => console.error('Error fetching family members:', error));
  // }, []);

  // Fetch family info và members
  useEffect(() => {
    // Fetch family info
    fetch(`http://${myip}:3000/families/${exampleFamilyId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('fam', data);
        setMyFamily(data);
      })
      .catch((error) => console.error('Error fetching family:', error));

    // Fetch family members
    fetch(`http://${myip}:3000/families/${exampleFamilyId}/members`)
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
    fetch(
      `http://${myip}:3000/calendars/get-calendar-of-family/${exampleFamilyId}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log('data total', data);
        setEmotionCalendarDataTotal(data);
      })
      .catch((error) =>
        console.error('Error fetching total of emotion calendar data:', error)
      );
  }, []);

  // useEffect(() => {
  //   console.log('myFamily', myFamily);
  //   const famData = {
  //     family: {
  //       id: myFamily?._id, //additional
  //       name: myFamily?.familyName, //additional
  //       members: myFamilyMembers,

  //       // Tổng hợp các mood entry của các thành viên trong gia đình vào 1 ngày cụ thể
  //       // calendar: {
  //       //   // Pre-populate with some sample data
  //       //   '2023-10-20': {
  //       //     user1: { emoji: '😊', note: 'Had a great day at the park!' },
  //       //     user2: { emoji: '🤔', note: 'Thinking about a big decision' },
  //       //     user3: { emoji: '😴', note: 'Very tired today' },
  //       //     user4: { emoji: '😂', note: 'Watched a funny movie' },
  //       //     discussion: {
  //       //       comments: [
  //       //         {
  //       //           userId: 'user1',
  //       //           text: 'We should go to the park again soon!',
  //       //           timestamp: '2023-10-20T14:22:00Z',
  //       //         },
  //       //         {
  //       //           userId: 'user4',
  //       //           text: 'Absolutely! The weather was perfect.',
  //       //           timestamp: '2023-10-20T15:45:00Z',
  //       //         },
  //       //       ],
  //       //     },
  //       //   },
  //       // },
  //       emotionCalendarDataTotal,
  //     },
  //   };

  //   setFamilyData(famData);
  // }, [myFamilyMembers, myFamily]);

  useEffect(() => {
    console.log('famdata', emotionCalendarDataTotal);
  }, [emotionCalendarDataTotal]);

  /*

  
//Cần tạo thêm model Calendar (ok) để có thể tạo ra được familyData sau cùng như thế này

//Điều kiện:
// Có được familyId //ok
// Có được danh sách các thành viên với thông tin cụ thể //ok
// Có calendar của gia đình đó theo mảng (chứa nhiều ngày và sẽ update thường xuyên - thêm ngày liên tục trong tương lai nếu có thành viên trong gia đình hoạt động) //ok
//   Tuy nhiên định dạng ở dưới đây chỉ lấy theo từng ngày để xác định - nhưng vẫn có model theo dateStringArray
// Có discussion là phần bao gồm các comments của các thành viên trong gia đình trong cùng 1 ngày

// CHỐT LẠI: Khi nào đầy đủ các thành phần từ backend và frontend có thể tạo được format dưới đây thì mới có thể hoàn chỉnh

  const mockFamilyData = {
    familyID123: {
      members: [
        { id: 'user1', name: 'Alex', avatar: '/placeholder.svg' },
        { id: 'user2', name: 'Jordan', avatar: '/placeholder.svg' },
        { id: 'user3', name: 'Casey', avatar: '/placeholder.svg' },
        { id: 'user4', name: 'Taylor', avatar: '/placeholder.svg' },
      ],
      calendar: {
        // Pre-populate with some sample data
        '2023-10-20': {
          user1: { emoji: '😊', note: 'Had a great day at the park!' },
          user2: { emoji: '🤔', note: 'Thinking about a big decision' },
          user3: { emoji: '😴', note: 'Very tired today' },
          user4: { emoji: '😂', note: 'Watched a funny movie' },
          discussion: {
            comments: [
              {
                userId: 'user1',
                text: 'We should go to the park again soon!',
                timestamp: '2023-10-20T14:22:00Z',
              },
              {
                userId: 'user4',
                text: 'Absolutely! The weather was perfect.',
                timestamp: '2023-10-20T15:45:00Z',
              },
            ],
          },
        },
      },
    },
  };

  */

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
      }}
    >
      {children}
    </CommonContext.Provider>
  );
};
