



// // this work with work anniversary content
// import React, { useEffect, useState } from 'react';
// import {
//   View, Text, StyleSheet, TouchableOpacity,
//   SafeAreaView, StatusBar, ActivityIndicator, 
//   Alert, FlatList
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { Calendar } from 'react-native-calendars';

// const ERP_BASE_URL = 'https://erpnextcloud.cbditsolutions.com';
// const ATTENDANCE_ENDPOINT = '/api/resource/Attendance';
// const HOLIDAY_LIST_ENDPOINT = '/api/resource/Holiday List';
// const EMPLOYEE_ENDPOINT = '/api/resource/Employee';
// const STATUS_COLORS = {
//   Present: '#4CAF50',
//   Absent: '#F44336',
//   'Half Day': '#FF9800',
//   'On Leave': '#2196F3',
//   'Work From Home': '#9C27B0',
//   Holiday: '#87CEEB',
//   Weekend: '#9E9E9E'
// };

// const DAILY_QUOTES = [
//   "Believe in yourself and all that you are.",
//   "Push yourself, because no one else is going to do it for you.",
//   "Success is not for the lazy.",
//   "Dream it. Wish it. Do it.",
// ];

// const HomeScreen = ({ route, navigation }) => {
//   const { sid, employeeData } = route.params;
//   const [markedDates, setMarkedDates] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [quote, setQuote] = useState(DAILY_QUOTES[0]);
//   const [todaysCelebrations, setTodaysCelebrations] = useState({
//     anniversaries: [],
//     birthdays: []
//   });
//   const [joiningInfo, setJoiningInfo] = useState({
//     date: null,
//     yearsOfService: 0,
//     isTodayAnniversary: false
//   });
//   const [isLoadingCelebrations, setIsLoadingCelebrations] = useState(true);

//   const getTodaysQuote = () => {
//     const now = new Date();
//     const start = new Date(now.getFullYear(), 0, 0);
//     const diff = now - start;
//     const oneDay = 1000 * 60 * 60 * 24;
//     const dayOfYear = Math.floor(diff / oneDay);
//     return DAILY_QUOTES[dayOfYear % DAILY_QUOTES.length];
//   };

//   const fetchCelebrations = async () => {
//     try {
//       setIsLoadingCelebrations(true);
//       const response = await fetch(
//         `${ERP_BASE_URL}${EMPLOYEE_ENDPOINT}?fields=["name","employee_name","date_of_joining","date_of_birth"]&filters=[["status","=","Active"]]&limit_page_length=0`,
//         { headers: { Cookie: `sid=${sid}` } }
//       );

//       const json = await response.json();
//       if (json.data) {
//         const today = new Date();
//         const currentMonth = today.getMonth();
//         const currentDate = today.getDate();

//         const anniversaries = [];
//         const birthdays = [];
//         let currentUserJoiningInfo = {
//           date: null,
//           yearsOfService: 0,
//           isTodayAnniversary: false
//         };

//         json.data.forEach(employee => {
//           // Process current user's info first
//           if (employee.name === employeeData.name) {
//             if (employee.date_of_joining) {
//               try {
//                 const joinDate = new Date(employee.date_of_joining);
//                 const years = today.getFullYear() - joinDate.getFullYear();

//                 currentUserJoiningInfo = {
//                   date: employee.date_of_joining,
//                   yearsOfService: years,
//                   isTodayAnniversary: joinDate.getMonth() === currentMonth && 
//                                     joinDate.getDate() === currentDate
//                 };
//               } catch (e) {
//                 console.error('Error parsing current user joining date:', employee.date_of_joining);
//               }
//             }
//           }

//           // Check work anniversary for all employees
//           if (employee.date_of_joining) {
//             try {
//               const joinDate = new Date(employee.date_of_joining);
//               const years = today.getFullYear() - joinDate.getFullYear();

//               if (joinDate.getMonth() === currentMonth && joinDate.getDate() === currentDate) {
//                 anniversaries.push({
//                   name: employee.employee_name || employee.name,
//                   years: years,
//                   employeeId: employee.name,
//                   isCurrentUser: employee.name === employeeData.name,
//                   date: employee.date_of_joining,
//                   type: 'anniversary'
//                 });
//               }
//             } catch (e) {
//               console.error('Error parsing joining date:', employee.date_of_joining);
//             }
//           }

//           // Check birthday for all employees
//           if (employee.date_of_birth) {
//             try {
//               const birthDate = new Date(employee.date_of_birth);
//               if (birthDate.getMonth() === currentMonth && birthDate.getDate() === currentDate) {
//                 const age = today.getFullYear() - birthDate.getFullYear();
//                 birthdays.push({
//                   name: employee.employee_name || employee.name,
//                   age: age,
//                   employeeId: employee.name,
//                   isCurrentUser: employee.name === employeeData.name,
//                   date: employee.date_of_birth,
//                   type: 'birthday'
//                 });
//               }
//             } catch (e) {
//               console.error('Error parsing birth date:', employee.date_of_birth);
//             }
//           }
//         });

//         setTodaysCelebrations({
//           anniversaries,
//           birthdays
//         });

//         setJoiningInfo(currentUserJoiningInfo);
//       }
//     } catch (err) {
//       console.error('Failed to fetch celebrations:', err);
//       Alert.alert('Error', 'Failed to fetch employee data');
//     } finally {
//       setIsLoadingCelebrations(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'Unknown';
//     try {
//       const date = new Date(dateString);
//       return isNaN(date) ? dateString : date.toLocaleDateString();
//     } catch (e) {
//       return dateString;
//     }
//   };

//   const fetchHolidays = async () => {
//     try {
//       const holidayList = employeeData.holiday_list;
//       if (!holidayList) return {};

//       const response = await fetch(
//         `${ERP_BASE_URL}${HOLIDAY_LIST_ENDPOINT}/${encodeURIComponent(holidayList)}`,
//         { headers: { Cookie: `sid=${sid}` } }
//       );

//       const json = await response.json();
//       if (!json.data) throw new Error("Invalid holiday list response");

//       const holidayMarks = {};
//       json.data.holidays.forEach(holiday => {
//         const date = holiday.holiday_date;
//         const isWeeklyOff = holiday.weekly_off === 1;

//         holidayMarks[date] = {
//           selected: true,
//           selectedColor: isWeeklyOff ? STATUS_COLORS['Weekend'] : STATUS_COLORS['Holiday'],
//           customStyles: {
//             container: {
//               backgroundColor: isWeeklyOff ? STATUS_COLORS['Weekend'] : STATUS_COLORS['Holiday'],
//               borderRadius: 12,
//               width: 24,
//               height: 24,
//               justifyContent: 'center',
//               alignItems: 'center'
//             },
//             text: {
//               color: 'white',
//               fontWeight: 'bold',
//               fontSize: 12
//             }
//           }
//         };
//       });

//       return holidayMarks;
//     } catch (err) {
//       console.error('Failed to fetch holidays:', err);
//       return {};
//     }
//   };

//   const fetchAttendance = async () => {
//     try {
//       const today = new Date().toISOString().slice(0, 10);
//       const [attendanceResponse, holidayMarks] = await Promise.all([
//         fetch(
//           `${ERP_BASE_URL}${ATTENDANCE_ENDPOINT}?fields=["attendance_date","status"]&filters=${encodeURIComponent(JSON.stringify([
//             ["Attendance", "employee", "=", employeeData.name],
//             ["Attendance", "attendance_date", "<=", today]
//           ]))}&limit_page_length=1000`,
//           { headers: { Cookie: `sid=${sid}` } }
//         ),
//         fetchHolidays()
//       ]);

//       const attendanceJson = await attendanceResponse.json();
//       if (!attendanceJson.data) throw new Error("Invalid attendance response");

//       const attendanceMarks = {};
//       attendanceJson.data.forEach(entry => {
//         const date = entry.attendance_date;
//         const status = entry.status;
//         const color = STATUS_COLORS[status] || 'gray';

//         attendanceMarks[date] = {
//           selected: true,
//           selectedColor: color,
//           customStyles: {
//             container: {
//               backgroundColor: color,
//               borderRadius: 12,
//               width: 24,
//               height: 24,
//               justifyContent: 'center',
//               alignItems: 'center'
//             },
//             text: {
//               color: 'white',
//               fontWeight: 'bold',
//               fontSize: 12
//             }
//           }
//         };
//       });

//       const combinedMarks = { ...holidayMarks, ...attendanceMarks };
//       const todayDate = new Date().toISOString().split('T')[0];
//       if (!combinedMarks[todayDate]) {
//         combinedMarks[todayDate] = {
//           customStyles: {
//             container: {
//               borderWidth: 1,
//               borderColor: '#F44336',
//               borderRadius: 12,
//               width: 24,
//               height: 24,
//               justifyContent: 'center',
//               alignItems: 'center'
//             },
//             text: {
//               color: '#F44336',
//               fontWeight: 'bold',
//               fontSize: 12
//             }
//           }
//         };
//       }

//       setMarkedDates(combinedMarks);
//     } catch (err) {
//       Alert.alert('Error', 'Failed to fetch data: ' + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     setQuote(getTodaysQuote());
//     fetchCelebrations();
//     fetchAttendance();
//   }, []);

//   const renderStatusLegend = () => {
//     return (
//       <View style={styles.legendContainer}>
//         {Object.entries(STATUS_COLORS).map(([status, color]) => (
//           <View key={status} style={styles.legendItem}>
//             <View style={[styles.legendColor, { backgroundColor: color }]} />
//             <Text style={styles.legendText}>{status}</Text>
//           </View>
//         ))}
//       </View>
//     );
//   };

//   const CustomDayComponent = ({ date, state, marking }) => {
//     const containerStyle = [
//       styles.dayContainer,
//       marking?.customStyles?.container,
//       state === 'today' && !marking && styles.todayContainer
//     ];

//     const textStyle = [
//       styles.dayText,
//       state === 'disabled' && styles.disabledText,
//       state === 'today' && !marking && styles.todayText,
//       marking?.customStyles?.text
//     ];

//     return (
//       <View style={containerStyle}>
//         <Text style={textStyle}>{date.day}</Text>
//       </View>
//     );
//   };

//   const renderCelebrationSection = () => {
//     const { anniversaries, birthdays } = todaysCelebrations;
//     const hasAnyCelebration = anniversaries.length > 0 || birthdays.length > 0;

//     if (isLoadingCelebrations) {
//       return <ActivityIndicator size="small" color="#FF9800" />;
//     }

//     return (
//       <View style={styles.anniversaryContainer}>
//         <Ionicons 
//           name={hasAnyCelebration ? "trophy-outline" : "calendar-outline"} 
//           size={30} 
//           color={hasAnyCelebration ? "#FFD700" : "#2196F3"} 
//         />

//         <View style={styles.anniversaryTextContainer}>
//           {/* Always show current user's joining info */}
//           <Text style={styles.anniversaryTitle}>
//             {joiningInfo.isTodayAnniversary ? 
//               "🎉 Happy Work Anniversary! 🎉" : 
//               "Your Joining Information"}
//           </Text>
//           <Text style={styles.anniversaryMessage}>
//             {joiningInfo.date ? (
//               `Joined on: ${formatDate(joiningInfo.date)}` +
//               (joiningInfo.yearsOfService > 0 ? 
//                 ` (${joiningInfo.yearsOfService} year${joiningInfo.yearsOfService !== 1 ? 's' : ''} with us)` : 
//                 '')
//             ) : 'Joining date not available'}
//           </Text>

//           {/* Show other employees' celebrations if they exist */}
//           {anniversaries.length > 0 && (
//             <>
//               <Text style={[styles.anniversaryTitle, { marginTop: 15 }]}>
//                 Work Anniversaries Today ({anniversaries.length})
//               </Text>
//               <FlatList
//                 data={anniversaries}
//                 renderItem={({ item }) => (
//                   <View style={[
//                     styles.anniversaryItem,
//                     item.isCurrentUser && styles.currentUserHighlight
//                   ]}>
//                     <View>
//                       <Text style={styles.anniversaryName}>
//                         {item.name} {item.isCurrentUser && "(You)"}
//                       </Text>
//                       <Text style={styles.anniversaryDate}>
//                         {item.years} year{item.years !== 1 ? 's' : ''} with company
//                       </Text>
//                     </View>
//                     <Text style={styles.anniversaryYears}>🎉</Text>
//                   </View>
//                 )}
//                 keyExtractor={item => `anniv-${item.employeeId}`}
//                 scrollEnabled={false}
//               />
//             </>
//           )}

//           {birthdays.length > 0 && (
//             <>
//               <Text style={[styles.anniversaryTitle, { marginTop: 15 }]}>
//                 Birthdays Today ({birthdays.length})
//               </Text>
//               <FlatList
//                 data={birthdays}
//                 renderItem={({ item }) => (
//                   <View style={[
//                     styles.anniversaryItem,
//                     item.isCurrentUser && styles.currentUserHighlight
//                   ]}>
//                     <View>
//                       <Text style={styles.anniversaryName}>
//                         {item.name} {item.isCurrentUser && "(You)"}
//                       </Text>
//                       <Text style={styles.anniversaryDate}>
//                         {item.age} year{item.age !== 1 ? 's' : ''} old
//                       </Text>
//                     </View>
//                     <Text style={styles.anniversaryYears}>🎂</Text>
//                   </View>
//                 )}
//                 keyExtractor={item => `bday-${item.employeeId}`}
//                 scrollEnabled={false}
//               />
//             </>
//           )}
//         </View>
//       </View>
//     );
//   };

//   const sections = [
//     { icon: 'time-outline', color: '#4CAF50', label: 'Attendance', screen: 'Attendance' },
//     { icon: 'document-text-outline', color: '#2196F3', label: 'Leave Request', screen: 'LeaveRequest' },
//     { icon: 'cash-outline', color: '#FF9800', label: 'Salary Slip', screen: 'SalarySlip' },
//     { icon: 'notifications-outline', color: '#F44336', label: 'Notifications', screen: 'Notifications' },
//   ];

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar backgroundColor="#f8f9fa" barStyle="dark-content" />
//       <FlatList
//         contentContainerStyle={styles.scrollContainer}
//         data={[
//           { type: 'quote', id: 'quote' },
//           { type: 'calendar', id: 'calendar' },
//           ...sections.map(section => ({ type: 'section', id: section.screen, ...section })),
//           { type: 'anniversary', id: 'anniversary' }
//         ]}
//         renderItem={({ item }) => {
//           switch (item.type) {
//             case 'quote':
//               return (
//                 <View style={styles.quoteContainer}>
//                   <Text style={styles.quoteTitle}>Quote of the Day</Text>
//                   <Text style={styles.quoteText}>"{quote}"</Text>
//                 </View>
//               );
//             case 'calendar':
//               return (
//                 <View style={styles.calendarContainer}>
//                   <Text style={styles.calendarTitle}>Attendance Calendar</Text>
//                   {loading ? (
//                     <ActivityIndicator size="large" color="#000" />
//                   ) : (
//                     <>
//                       <Calendar
//                         markedDates={markedDates}
//                         markingType="custom"
//                         style={styles.calendar}
//                         theme={{
//                           calendarBackground: '#FFFFFF',
//                           textSectionTitleColor: '#000',
//                           selectedDayBackgroundColor: '#00adf5',
//                           selectedDayTextColor: '#FFFFFF',
//                           todayTextColor: '#F44336',
//                           dayTextColor: '#000',
//                           textDisabledColor: '#d9d9d9',
//                           dotColor: '#00adf5',
//                           selectedDotColor: '#FFFFFF',
//                           arrowColor: '#2196F3',
//                           monthTextColor: '#000',
//                           textMonthFontWeight: 'bold',
//                           textDayFontSize: 14,
//                           textMonthFontSize: 16,
//                           textDayHeaderFontSize: 14,
//                           'stylesheet.calendar.header': {
//                             week: {
//                               marginTop: 5,
//                               flexDirection: 'row',
//                               justifyContent: 'space-between'
//                             }
//                           }
//                         }}
//                         dayComponent={CustomDayComponent}
//                       />
//                       {renderStatusLegend()}
//                     </>
//                   )}
//                 </View>
//               );
//             case 'section':
//               return (
//                 <TouchableOpacity
//                   style={styles.section}
//                   onPress={() => navigation.navigate(item.screen, { sid, employeeData })}
//                 >
//                   <Ionicons name={item.icon} size={26} color={item.color} />
//                   <Text style={styles.label}>{item.label}</Text>
//                 </TouchableOpacity>
//               );
//             case 'anniversary':
//               return renderCelebrationSection();
//             default:
//               return null;
//           }
//         }}
//         keyExtractor={item => item.id}
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: '#f8f9fa' },
//   scrollContainer: { padding: 20, paddingBottom: 40 },
//   quoteContainer: {
//     backgroundColor: '#fff',
//     padding: 16,
//     borderRadius: 10,
//     borderLeftWidth: 5,
//     borderLeftColor: '#ffc107',
//     marginBottom: 20,
//     elevation: 2,
//   },
//   quoteTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#856404' },
//   quoteText: { fontSize: 14, fontStyle: 'italic', color: '#856404', marginBottom: 5 },
//   calendarContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 10,
//     elevation: 2,
//     marginBottom: 20,
//   },
//   calendarTitle: { 
//     fontSize: 16, 
//     fontWeight: 'bold', 
//     marginBottom: 10, 
//     color: '#333',
//     textAlign: 'center'
//   },
//   calendar: { 
//     borderRadius: 10,
//     marginBottom: 15
//   },
//   section: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     padding: 15,
//     marginVertical: 10,
//     borderRadius: 10,
//     elevation: 2,
//   },
//   label: {
//     fontSize: 16,
//     marginLeft: 15,
//     fontWeight: '500',
//     color: '#333',
//   },
//   legendContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-around',
//     marginTop: 10,
//     paddingHorizontal: 5
//   },
//   legendItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 5,
//     marginHorizontal: 5
//   },
//   legendColor: {
//     width: 15,
//     height: 15,
//     borderRadius: 7.5,
//     marginRight: 5
//   },
//   legendText: {
//     fontSize: 12,
//     color: '#333'
//   },
//   dayContainer: {
//     width: 32,
//     height: 32,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   dayText: {
//     fontSize: 14,
//     color: '#000'
//   },
//   disabledText: {
//     color: '#d9d9d9'
//   },
//   todayContainer: {
//     borderWidth: 1,
//     borderColor: '#F44336',
//     borderRadius: 12
//   },
//   todayText: {
//     color: '#F44336',
//     fontWeight: 'bold'
//   },
//   anniversaryContainer: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     backgroundColor: '#fff',
//     padding: 15,
//     marginVertical: 10,
//     borderRadius: 10,
//     elevation: 2,
//     borderLeftWidth: 5,
//     borderLeftColor: '#FFD700',
//   },
//   anniversaryTextContainer: {
//     marginLeft: 15,
//     flex: 1,
//   },
//   anniversaryTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 10,
//   },
//   anniversaryMessage: {
//     fontSize: 14,
//     color: '#555',
//     marginBottom: 5,
//   },
//   anniversaryItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   anniversaryName: {
//     fontSize: 14,
//     color: '#333',
//     fontWeight: '500',
//   },
//   anniversaryDate: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 2,
//   },
//   anniversaryYears: {
//     fontSize: 14,
//     color: '#FF9800',
//     fontWeight: 'bold',
//   },
//   currentUserHighlight: {
//     backgroundColor: '#FFF9C4',
//     borderRadius: 5,
//     padding: 10,
//     marginVertical: 5
//   }
// });

// export default HomeScreen;

// import React, { useEffect, useState } from 'react';
// import {
//   View, Text, StyleSheet, TouchableOpacity,
//   ScrollView, SafeAreaView, StatusBar,
//   ActivityIndicator, Alert, FlatList, RefreshControl
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { Calendar } from 'react-native-calendars';
// import moment from 'moment';

// const ERP_BASE_URL = 'https://erpnextcloud.cbditsolutions.com';
// const ATTENDANCE_ENDPOINT = '/api/resource/Attendance';
// const HOLIDAY_LIST_ENDPOINT = '/api/resource/Holiday List';
// const EMPLOYEE_ENDPOINT = '/api/resource/Employee';

// const STATUS_COLORS = {
//   Present: '#4CAF50',
//   Absent: '#F44336',
//   'Half Day': '#FF9800',
//   'On Leave': '#2196F3',
//   'Work From Home': '#9C27B0',
//   Holiday: '#87CEEB',
//   Weekend: '#9E9E9E'
// };

// const DAILY_QUOTES = [
//   "Believe in yourself and all that you are.",
//   "Push yourself, because no one else is going to do it for you.",
//   "Success is not for the lazy.",
//   "Dream it. Wish it. Do it.",
// ];

// const HomeScreen = ({ route, navigation }) => {
//   const { sid, employeeData } = route.params;
//   const [markedDates, setMarkedDates] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [anniversaries, setAnniversaries] = useState([]);
//   const [quote, setQuote] = useState(DAILY_QUOTES[0]);
//   const [refreshing, setRefreshing] = useState(false);

//   const getTodaysQuote = () => {
//     const now = new Date();
//     const start = new Date(now.getFullYear(), 0, 0);
//     const diff = now - start;
//     const oneDay = 1000 * 60 * 60 * 24;
//     const dayOfYear = Math.floor(diff / oneDay);
//     const quoteIndex = dayOfYear % DAILY_QUOTES.length;
//     return DAILY_QUOTES[quoteIndex];
//   };

//   const fetchHolidays = async () => {
//     try {
//       const holidayList = employeeData.holiday_list;
//       if (!holidayList) return {};

//       const response = await fetch(
//         `${ERP_BASE_URL}${HOLIDAY_LIST_ENDPOINT}/${encodeURIComponent(holidayList)}`,
//         { headers: { Cookie: `sid=${sid}` } }
//       );

//       const json = await response.json();
//       if (!json.data) throw new Error("Invalid holiday list response");

//       const holidayMarks = {};
//       json.data.holidays.forEach(holiday => {
//         const date = holiday.holiday_date;
//         const isWeeklyOff = holiday.weekly_off === 1;

//         holidayMarks[date] = {
//           selected: true,
//           selectedColor: isWeeklyOff ? STATUS_COLORS['Weekend'] : STATUS_COLORS['Holiday'],
//           customStyles: {
//             container: {
//               backgroundColor: isWeeklyOff ? STATUS_COLORS['Weekend'] : STATUS_COLORS['Holiday'],
//               borderRadius: 12,
//               width: 24,
//               height: 24,
//               justifyContent: 'center',
//               alignItems: 'center'
//             },
//             text: {
//               color: 'white',
//               fontWeight: 'bold',
//               fontSize: 12
//             }
//           }
//         };
//       });

//       return holidayMarks;
//     } catch (err) {
//       console.error('Failed to fetch holidays:', err);
//       return {};
//     }
//   };

//   const fetchAttendance = async () => {
//     try {
//       const today = new Date().toISOString().slice(0, 10);
//       const [attendanceResponse, holidayMarks] = await Promise.all([
//         fetch(
//           `${ERP_BASE_URL}${ATTENDANCE_ENDPOINT}?fields=["attendance_date","status"]&filters=${encodeURIComponent(JSON.stringify([
//             ["Attendance", "employee", "=", employeeData.name],
//             ["Attendance", "attendance_date", "<=", today]
//           ]))}&limit_page_length=1000`,
//           { headers: { Cookie: `sid=${sid}` } }
//         ),
//         fetchHolidays()
//       ]);

//       const attendanceJson = await attendanceResponse.json();
//       if (!attendanceJson.data) throw new Error("Invalid attendance response");

//       const attendanceMarks = {};
//       attendanceJson.data.forEach(entry => {
//         const date = entry.attendance_date;
//         const status = entry.status;
//         const color = STATUS_COLORS[status] || 'gray';

//         attendanceMarks[date] = {
//           selected: true,
//           selectedColor: color,
//           customStyles: {
//             container: {
//               backgroundColor: color,
//               borderRadius: 12,
//               width: 24,
//               height: 24,
//               justifyContent: 'center',
//               alignItems: 'center'
//             },
//             text: {
//               color: 'white',
//               fontWeight: 'bold',
//               fontSize: 12
//             }
//           }
//         };
//       });

//       const combinedMarks = { ...holidayMarks, ...attendanceMarks };
//       const todayDate = new Date().toISOString().split('T')[0];

//       if (!combinedMarks[todayDate]) {
//         combinedMarks[todayDate] = {
//           customStyles: {
//             container: {
//               borderWidth: 1,
//               borderColor: '#F44336',
//               borderRadius: 12,
//               width: 24,
//               height: 24,
//               justifyContent: 'center',
//               alignItems: 'center'
//             },
//             text: {
//               color: '#F44336',
//               fontWeight: 'bold',
//               fontSize: 12
//             }
//           }
//         };
//       }

//       setMarkedDates(combinedMarks);
//     } catch (err) {
//       Alert.alert('Error', 'Failed to fetch attendance: ' + err.message);
//     }
//   };

//   const fetchAnniversaries = async () => {
//     try {
//       const todayMMDD = moment().format('MM-DD');
//       const response = await fetch(
//         `${ERP_BASE_URL}${EMPLOYEE_ENDPOINT}?fields=["name","employee_name","date_of_joining","department"]&filters=[["status","=","Active"]]&limit_page_length=1000`,
//         { 
//           headers: { 
//             Cookie: `sid=${sid}`,
//             'Content-Type': 'application/json'
//           } 
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const json = await response.json();
//       const list = json.data || [];

//       const todaysAnniversaries = list.filter(emp => {
//         const doj = emp.date_of_joining;
//         return doj && moment(doj).format('MM-DD') === todayMMDD;
//       });

//       setAnniversaries(todaysAnniversaries);
//     } catch (err) {
//       console.error('Failed to fetch anniversaries:', err);
//       Alert.alert('Error', 'Failed to fetch anniversary data. Please try again later.');
//     }
//   };

//   const loadData = async () => {
//     try {
//       setLoading(true);
//       setQuote(getTodaysQuote());
//       await Promise.all([fetchAttendance(), fetchAnniversaries()]);
//     } catch (err) {
//       console.error('Error loading data:', err);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     loadData();
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   const renderStatusLegend = () => {
//     return (
//       <View style={styles.legendContainer}>
//         {Object.entries(STATUS_COLORS).map(([status, color]) => (
//           <View key={status} style={styles.legendItem}>
//             <View style={[styles.legendColor, { backgroundColor: color }]} />
//             <Text style={styles.legendText}>{status}</Text>
//           </View>
//         ))}
//       </View>
//     );
//   };

//   const CustomDayComponent = ({ date, state, marking }) => {
//     const containerStyle = [
//       styles.dayContainer,
//       marking?.customStyles?.container,
//       state === 'today' && !marking && styles.todayContainer
//     ];

//     const textStyle = [
//       styles.dayText,
//       state === 'disabled' && styles.disabledText,
//       state === 'today' && !marking && styles.todayText,
//       marking?.customStyles?.text
//     ];

//     return (
//       <View style={containerStyle}>
//         <Text style={textStyle}>{date.day}</Text>
//       </View>
//     );
//   };

//   const renderAnniversaryItem = ({ item }) => {
//     const isCurrentUser = item.name === employeeData.name;
//     const yearsOfService = moment().diff(moment(item.date_of_joining), 'years');

//     return (
//       <View style={[
//         styles.anniversaryCard,
//         isCurrentUser && styles.currentUserAnniversaryCard
//       ]}>
//         <Ionicons name="calendar" size={24} color={isCurrentUser ? "#4CAF50" : "#FF5722"} />
//         <View style={styles.anniversaryTextContainer}>
//           <Text style={styles.anniversaryName}>
//             {item.employee_name} {isCurrentUser && "(You)"}
//             {item.department && <Text style={styles.departmentText}> • {item.department}</Text>}
//           </Text>
//           <Text style={[
//             styles.anniversaryMessage,
//             isCurrentUser && styles.currentUserMessage
//           ]}>
//             {isCurrentUser ? "🎉 Happy Your Work Anniversary!" : "🎉 Happy Work Anniversary!"}
//           </Text>
//           <Text style={styles.anniversaryDate}>
//             {yearsOfService} year{yearsOfService !== 1 ? 's' : ''} of service • Joined on {moment(item.date_of_joining).format('MMMM Do, YYYY')}
//           </Text>
//         </View>
//       </View>
//     );
//   };




//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar backgroundColor="#f8f9fa" barStyle="dark-content" />
//       <ScrollView 
//         contentContainerStyle={styles.scrollContainer}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={['#2196F3']}
//             tintColor="#2196F3"
//           />
//         }
//       >
//         {/* Quote of the Day */}
//         <View style={styles.quoteContainer}>
//           <Text style={styles.quoteTitle}>Quote of the Day</Text>
//           <Text style={styles.quoteText}>"{quote}"</Text>
//         </View>

//         {/* Calendar */}
//         <View style={styles.calendarContainer}>
//           <Text style={styles.calendarTitle}>Attendance Calendar</Text>
//           {loading ? (
//             <ActivityIndicator size="large" color="#000" />
//           ) : (
//             <>
//               <Calendar
//                 markedDates={markedDates}
//                 markingType="custom"
//                 style={styles.calendar}
//                 theme={{
//                   calendarBackground: '#FFFFFF',
//                   textSectionTitleColor: '#000',
//                   selectedDayBackgroundColor: '#00adf5',
//                   selectedDayTextColor: '#FFFFFF',
//                   todayTextColor: '#F44336',
//                   dayTextColor: '#000',
//                   textDisabledColor: '#d9d9d9',
//                   dotColor: '#00adf5',
//                   selectedDotColor: '#FFFFFF',
//                   arrowColor: '#2196F3',
//                   monthTextColor: '#000',
//                   textMonthFontWeight: 'bold',
//                   textDayFontSize: 14,
//                   textMonthFontSize: 16,
//                   textDayHeaderFontSize: 14,
//                   'stylesheet.calendar.header': {
//                     week: {
//                       marginTop: 5,
//                       flexDirection: 'row',
//                       justifyContent: 'space-between'
//                     }
//                   }
//                 }}
//                 dayComponent={CustomDayComponent}
//               />
//               {renderStatusLegend()}
//             </>
//           )}
//         </View>


//         {/* Navigation Cards */}
//         <TouchableOpacity
//           style={styles.navCard}
//           onPress={() => navigation.navigate('Attendance', { sid, employeeData })}
//         >
//           <Ionicons name="time-outline" size={26} color="#4CAF50" />
//           <Text style={styles.label}>Attendance</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.navCard}
//           onPress={() => navigation.navigate('LeaveRequest', { sid, employeeData })}
//         >
//           <Ionicons name="document-text-outline" size={26} color="#2196F3" />
//           <Text style={styles.label}>Leave Request</Text>
//         </TouchableOpacity>

//         {/* <TouchableOpacity
//           style={styles.navCard}
//           onPress={() => navigation.navigate('ApplicationStatus', { sid, employeeData })}
//         >
//           <Ionicons name="list-outline" size={26} color="#FF9800" />
//           <Text style={styles.label}>Application Status</Text>
//         </TouchableOpacity> */}

//         <TouchableOpacity
//           style={styles.navCard}
//           onPress={() => navigation.navigate('SalarySlip', { sid, employeeData })}
//         >
//           <Ionicons name="cash-outline" size={26} color="#9C27B0" />
//           <Text style={styles.label}>Salary Slip</Text>
//         </TouchableOpacity>

//         {/* Work Anniversaries Section */}
//         <View style={styles.sectionContainer}>
//           <Text style={styles.sectionTitle}>Today's Work Anniversaries</Text>
//           {loading ? (
//             <ActivityIndicator size="small" color="#000" />
//           ) : anniversaries.length > 0 ? (
//             <FlatList
//               data={anniversaries}
//               renderItem={renderAnniversaryItem}
//               keyExtractor={item => item.name}
//               scrollEnabled={false}
//             />
//           ) : (
//             <Text style={styles.noAnniversaries}>No work anniversaries today</Text>
//           )}
//         </View>
//       </ScrollView>
//     </SafeAreaView>



//   );


// };

// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: '#f8f9fa' },
//   scrollContainer: { padding: 20, paddingBottom: 40 },
//   quoteContainer: {
//     backgroundColor: '#fff',
//     padding: 16,
//     borderRadius: 10,
//     borderLeftWidth: 5,
//     borderLeftColor: '#ffc107',
//     marginBottom: 20,
//     elevation: 2,
//   },
//   quoteTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#856404' },
//   quoteText: { fontSize: 14, fontStyle: 'italic', color: '#856404', marginBottom: 5 },
//   calendarContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 10,
//     elevation: 2,
//     marginBottom: 20,
//   },
//   calendarTitle: { 
//     fontSize: 16, 
//     fontWeight: 'bold', 
//     marginBottom: 10, 
//     color: '#333',
//     textAlign: 'center'
//   },
//   calendar: { 
//     borderRadius: 10,
//     marginBottom: 15
//   },
//   navCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     padding: 15,
//     marginVertical: 10,
//     borderRadius: 10,
//     elevation: 2,
//   },
//   label: {
//     fontSize: 16,
//     marginLeft: 15,
//     fontWeight: '500',
//     color: '#333',
//   },
//   legendContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-around',
//     marginTop: 10,
//     paddingHorizontal: 5
//   },
//   legendItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 5,
//     marginHorizontal: 5
//   },
//   legendColor: {
//     width: 15,
//     height: 15,
//     borderRadius: 7.5,
//     marginRight: 5
//   },
//   legendText: {
//     fontSize: 12,
//     color: '#333'
//   },
//   dayContainer: {
//     width: 32,
//     height: 32,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   dayText: {
//     fontSize: 14,
//     color: '#000'
//   },
//   disabledText: {
//     color: '#d9d9d9'
//   },
//   todayContainer: {
//     borderWidth: 1,
//     borderColor: '#F44336',
//     borderRadius: 12
//   },
//   todayText: {
//     color: '#F44336',
//     fontWeight: 'bold'
//   },
//   sectionContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 20,
//     elevation: 2,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: '#333',
//   },
//   anniversaryCard: {
//     flexDirection: 'row',
//     backgroundColor: '#FFF8F5',
//     padding: 12,
//     borderRadius: 8,
//     marginVertical: 5,
//     alignItems: 'center',
//     borderLeftWidth: 4,
//     borderLeftColor: '#FF5722',
//   },
//   currentUserAnniversaryCard: {
//     backgroundColor: '#F0FFF0',
//     borderLeftColor: '#4CAF50',
//   },
//   anniversaryTextContainer: {
//     marginLeft: 10,
//     flex: 1,
//   },
//   anniversaryName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//   },
//   departmentText: {
//     fontSize: 14,
//     color: '#666',
//     fontWeight: 'normal',
//   },
//   anniversaryMessage: {
//     fontSize: 14,
//     color: '#FF5722',
//     marginTop: 2,
//   },
//   currentUserMessage: {
//     color: '#4CAF50',
//   },
//   anniversaryDate: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 2,
//   },
//   noAnniversaries: {
//     textAlign: 'center',
//     color: '#666',
//     paddingVertical: 10,
//   },
// });

// export default HomeScreen;


// import React, { useEffect, useState } from 'react';
// import {
//   View, Text, StyleSheet, TouchableOpacity,
//   ScrollView, SafeAreaView, StatusBar,
//   ActivityIndicator, Alert, FlatList, RefreshControl
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { Calendar } from 'react-native-calendars';
// import moment from 'moment';

// const ERP_BASE_URL = 'https://erpnextcloud.cbditsolutions.com';
// const ATTENDANCE_ENDPOINT = '/api/resource/Attendance';
// const HOLIDAY_LIST_ENDPOINT = '/api/resource/Holiday List';
// const EMPLOYEE_ENDPOINT = '/api/resource/Employee';

// // API credentials for fetching joining dates
// const API_KEY = 'd1e83c2c3f5b99d';
// const API_SECRET = 'd5fd576d4ea0fb9';

// const STATUS_COLORS = {
//   Present: '#4CAF50',
//   Absent: '#F44336',
//   'Half Day': '#FF9800',
//   'On Leave': '#2196F3',
//   'Work From Home': '#9C27B0',
//   Holiday: '#87CEEB',
//   Weekend: '#9E9E9E'
// };

// const DAILY_QUOTES = [
//   "Believe in yourself and all that you are.",
//   "Push yourself, because no one else is going to do it for you.",
//   "Success is not for the lazy.",
//   "Dream it. Wish it. Do it.",
// ];

// const HomeScreen = ({ route, navigation }) => {
//   const { sid, employeeData } = route.params;
//   const [markedDates, setMarkedDates] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [anniversaries, setAnniversaries] = useState([]);
//   const [quote, setQuote] = useState(DAILY_QUOTES[0]);
//   const [refreshing, setRefreshing] = useState(false);

//   const getTodaysQuote = () => {
//     const now = new Date();
//     const start = new Date(now.getFullYear(), 0, 0);
//     const diff = now - start;
//     const oneDay = 1000 * 60 * 60 * 24;
//     const dayOfYear = Math.floor(diff / oneDay);
//     const quoteIndex = dayOfYear % DAILY_QUOTES.length;
//     return DAILY_QUOTES[quoteIndex];
//   };

//   const getAuthHeaders = () => {
//     // Create base64 encoded token from API key and secret
//     const token = btoa(`${API_KEY}:${API_SECRET}`);
//     return {
//       'Authorization': `Basic ${token}`,
//       'Content-Type': 'application/json',
//       'Accept': 'application/json'
//     };
//   };

//   const fetchHolidays = async () => {
//     try {
//       const holidayList = employeeData.holiday_list;
//       if (!holidayList) return {};

//       const response = await fetch(
//         `${ERP_BASE_URL}${HOLIDAY_LIST_ENDPOINT}/${encodeURIComponent(holidayList)}`,
//         { headers: { Cookie: `sid=${sid}` } }
//       );

//       const json = await response.json();
//       if (!json.data) throw new Error("Invalid holiday list response");

//       const holidayMarks = {};
//       json.data.holidays.forEach(holiday => {
//         const date = holiday.holiday_date;
//         const isWeeklyOff = holiday.weekly_off === 1;

//         holidayMarks[date] = {
//           selected: true,
//           selectedColor: isWeeklyOff ? STATUS_COLORS['Weekend'] : STATUS_COLORS['Holiday'],
//           customStyles: {
//             container: {
//               backgroundColor: isWeeklyOff ? STATUS_COLORS['Weekend'] : STATUS_COLORS['Holiday'],
//               borderRadius: 12,
//               width: 24,
//               height: 24,
//               justifyContent: 'center',
//               alignItems: 'center'
//             },
//             text: {
//               color: 'white',
//               fontWeight: 'bold',
//               fontSize: 12
//             }
//           }
//         };
//       });

//       return holidayMarks;
//     } catch (err) {
//       console.error('Failed to fetch holidays:', err);
//       return {};
//     }
//   };

//   const fetchAttendance = async () => {
//     try {
//       const today = new Date().toISOString().slice(0, 10);
//       const [attendanceResponse, holidayMarks] = await Promise.all([
//         fetch(
//           `${ERP_BASE_URL}${ATTENDANCE_ENDPOINT}?fields=["attendance_date","status"]&filters=${encodeURIComponent(JSON.stringify([
//             ["Attendance", "employee", "=", employeeData.name],
//             ["Attendance", "attendance_date", "<=", today]
//           ]))}&limit_page_length=1000`,
//           { headers: { Cookie: `sid=${sid}` } }
//         ),
//         fetchHolidays()
//       ]);

//       const attendanceJson = await attendanceResponse.json();
//       if (!attendanceJson.data) throw new Error("Invalid attendance response");

//       const attendanceMarks = {};
//       attendanceJson.data.forEach(entry => {
//         const date = entry.attendance_date;
//         const status = entry.status;
//         const color = STATUS_COLORS[status] || 'gray';

//         attendanceMarks[date] = {
//           selected: true,
//           selectedColor: color,
//           customStyles: {
//             container: {
//               backgroundColor: color,
//               borderRadius: 12,
//               width: 24,
//               height: 24,
//               justifyContent: 'center',
//               alignItems: 'center'
//             },
//             text: {
//               color: 'white',
//               fontWeight: 'bold',
//               fontSize: 12
//             }
//           }
//         };
//       });

//       const combinedMarks = { ...holidayMarks, ...attendanceMarks };
//       const todayDate = new Date().toISOString().split('T')[0];

//       if (!combinedMarks[todayDate]) {
//         combinedMarks[todayDate] = {
//           customStyles: {
//             container: {
//               borderWidth: 1,
//               borderColor: '#F44336',
//               borderRadius: 12,
//               width: 24,
//               height: 24,
//               justifyContent: 'center',
//               alignItems: 'center'
//             },
//             text: {
//               color: '#F44336',
//               fontWeight: 'bold',
//               fontSize: 12
//             }
//           }
//         };
//       }

//       setMarkedDates(combinedMarks);
//     } catch (err) {
//       Alert.alert('Error', 'Failed to fetch attendance: ' + err.message);
//     }
//   };

//   const fetchAnniversaries = async () => {
//     try {
//       const todayMMDD = moment().format('MM-DD');
//       const response = await fetch(
//         `${ERP_BASE_URL}${EMPLOYEE_ENDPOINT}?fields=["name","employee_name","date_of_joining","department"]&filters=[["status","=","Active"]]&limit_page_length=1000`,
//         { 
//           headers: getAuthHeaders() // Using API key/secret for this endpoint only
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const json = await response.json();
//       const list = json.data || [];

//       const todaysAnniversaries = list.filter(emp => {
//         const doj = emp.date_of_joining;
//         return doj && moment(doj).format('MM-DD') === todayMMDD;
//       });

//       setAnniversaries(todaysAnniversaries);
//     } catch (err) {
//       console.error('Failed to fetch anniversaries:', err);
//       Alert.alert('Error', 'Failed to fetch anniversary data. Please try again later.');
//     }
//   };

//   const loadData = async () => {
//     try {
//       setLoading(true);
//       setQuote(getTodaysQuote());
//       await Promise.all([fetchAttendance(), fetchAnniversaries()]);
//     } catch (err) {
//       console.error('Error loading data:', err);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     loadData();
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   const renderStatusLegend = () => {
//     return (
//       <View style={styles.legendContainer}>
//         {Object.entries(STATUS_COLORS).map(([status, color]) => (
//           <View key={status} style={styles.legendItem}>
//             <View style={[styles.legendColor, { backgroundColor: color }]} />
//             <Text style={styles.legendText}>{status}</Text>
//           </View>
//         ))}
//       </View>
//     );
//   };

//   const CustomDayComponent = ({ date, state, marking }) => {
//     const containerStyle = [
//       styles.dayContainer,
//       marking?.customStyles?.container,
//       state === 'today' && !marking && styles.todayContainer
//     ];

//     const textStyle = [
//       styles.dayText,
//       state === 'disabled' && styles.disabledText,
//       state === 'today' && !marking && styles.todayText,
//       marking?.customStyles?.text
//     ];

//     return (
//       <View style={containerStyle}>
//         <Text style={textStyle}>{date.day}</Text>
//       </View>
//     );
//   };

//   const renderAnniversaryItem = ({ item }) => {
//     const isCurrentUser = item.name === employeeData.name;
//     const yearsOfService = moment().diff(moment(item.date_of_joining), 'years');

//     return (
//       <View style={[
//         styles.anniversaryCard,
//         isCurrentUser && styles.currentUserAnniversaryCard
//       ]}>
//         <Ionicons name="calendar" size={24} color={isCurrentUser ? "#4CAF50" : "#FF5722"} />
//         <View style={styles.anniversaryTextContainer}>
//           <Text style={styles.anniversaryName}>
//             {item.employee_name} {isCurrentUser && "(You)"}
//             {item.department && <Text style={styles.departmentText}> • {item.department}</Text>}
//           </Text>
//           <Text style={[
//             styles.anniversaryMessage,
//             isCurrentUser && styles.currentUserMessage
//           ]}>
//             {isCurrentUser ? "🎉 Happy Your Work Anniversary!" : "🎉 Happy Work Anniversary!"}
//           </Text>
//           <Text style={styles.anniversaryDate}>
//             {yearsOfService} year{yearsOfService !== 1 ? 's' : ''} of service • Joined on {moment(item.date_of_joining).format('MMMM Do, YYYY')}
//           </Text>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar backgroundColor="#f8f9fa" barStyle="dark-content" />
//       <ScrollView 
//         contentContainerStyle={styles.scrollContainer}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={['#2196F3']}
//             tintColor="#2196F3"
//           />
//         }
//       >
//         {/* Quote of the Day */}
//         <View style={styles.quoteContainer}>
//           <Text style={styles.quoteTitle}>Quote of the Day</Text>
//           <Text style={styles.quoteText}>"{quote}"</Text>
//         </View>

//         {/* Calendar */}
//         <View style={styles.calendarContainer}>
//           <Text style={styles.calendarTitle}>Attendance Calendar</Text>
//           {loading ? (
//             <ActivityIndicator size="large" color="#000" />
//           ) : (
//             <>
//               <Calendar
//                 markedDates={markedDates}
//                 markingType="custom"
//                 style={styles.calendar}
//                 theme={{
//                   calendarBackground: '#FFFFFF',
//                   textSectionTitleColor: '#000',
//                   selectedDayBackgroundColor: '#00adf5',
//                   selectedDayTextColor: '#FFFFFF',
//                   todayTextColor: '#F44336',
//                   dayTextColor: '#000',
//                   textDisabledColor: '#d9d9d9',
//                   dotColor: '#00adf5',
//                   selectedDotColor: '#FFFFFF',
//                   arrowColor: '#2196F3',
//                   monthTextColor: '#000',
//                   textMonthFontWeight: 'bold',
//                   textDayFontSize: 14,
//                   textMonthFontSize: 16,
//                   textDayHeaderFontSize: 14,
//                   'stylesheet.calendar.header': {
//                     week: {
//                       marginTop: 5,
//                       flexDirection: 'row',
//                       justifyContent: 'space-between'
//                     }
//                   }
//                 }}
//                 dayComponent={CustomDayComponent}
//               />
//               {renderStatusLegend()}
//             </>
//           )}
//         </View>

//         {/* Navigation Cards */}
//         <TouchableOpacity
//           style={styles.navCard}
//           onPress={() => navigation.navigate('Attendance', { sid, employeeData })}
//         >
//           <Ionicons name="time-outline" size={26} color="#4CAF50" />
//           <Text style={styles.label}>Attendance</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.navCard}
//           onPress={() => navigation.navigate('LeaveRequest', { sid, employeeData })}
//         >
//           <Ionicons name="document-text-outline" size={26} color="#2196F3" />
//           <Text style={styles.label}>Leave Request</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.navCard}
//           onPress={() => navigation.navigate('SalarySlip', { sid, employeeData })}
//         >
//           <Ionicons name="cash-outline" size={26} color="#9C27B0" />
//           <Text style={styles.label}>Salary Slip</Text>
//         </TouchableOpacity>

//         {/* Work Anniversaries Section */}
//         <View style={styles.sectionContainer}>
//           <Text style={styles.sectionTitle}>Today's Work Anniversaries</Text>
//           {loading ? (
//             <ActivityIndicator size="small" color="#000" />
//           ) : anniversaries.length > 0 ? (
//             <FlatList
//               data={anniversaries}
//               renderItem={renderAnniversaryItem}
//               keyExtractor={item => item.name}
//               scrollEnabled={false}
//             />
//           ) : (
//             <Text style={styles.noAnniversaries}>No work anniversaries today</Text>
//           )}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: '#f8f9fa' },
//   scrollContainer: { padding: 20, paddingBottom: 40 },
//   quoteContainer: {
//     backgroundColor: '#fff',
//     padding: 16,
//     borderRadius: 10,
//     borderLeftWidth: 5,
//     borderLeftColor: '#ffc107',
//     marginBottom: 20,
//     elevation: 2,
//   },
//   quoteTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#856404' },
//   quoteText: { fontSize: 14, fontStyle: 'italic', color: '#856404', marginBottom: 5 },
//   calendarContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 10,
//     elevation: 2,
//     marginBottom: 20,
//   },
//   calendarTitle: { 
//     fontSize: 16, 
//     fontWeight: 'bold', 
//     marginBottom: 10, 
//     color: '#333',
//     textAlign: 'center'
//   },
//   calendar: { 
//     borderRadius: 10,
//     marginBottom: 15
//   },
//   navCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     padding: 15,
//     marginVertical: 10,
//     borderRadius: 10,
//     elevation: 2,
//   },
//   label: {
//     fontSize: 16,
//     marginLeft: 15,
//     fontWeight: '500',
//     color: '#333',
//   },
//   legendContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-around',
//     marginTop: 10,
//     paddingHorizontal: 5
//   },
//   legendItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 5,
//     marginHorizontal: 5
//   },
//   legendColor: {
//     width: 15,
//     height: 15,
//     borderRadius: 7.5,
//     marginRight: 5
//   },
//   legendText: {
//     fontSize: 12,
//     color: '#333'
//   },
//   dayContainer: {
//     width: 32,
//     height: 32,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   dayText: {
//     fontSize: 14,
//     color: '#000'
//   },
//   disabledText: {
//     color: '#d9d9d9'
//   },
//   todayContainer: {
//     borderWidth: 1,
//     borderColor: '#F44336',
//     borderRadius: 12
//   },
//   todayText: {
//     color: '#F44336',
//     fontWeight: 'bold'
//   },
//   sectionContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 20,
//     elevation: 2,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: '#333',
//   },
//   anniversaryCard: {
//     flexDirection: 'row',
//     backgroundColor: '#FFF8F5',
//     padding: 12,
//     borderRadius: 8,
//     marginVertical: 5,
//     alignItems: 'center',
//     borderLeftWidth: 4,
//     borderLeftColor: '#FF5722',
//   },
//   currentUserAnniversaryCard: {
//     backgroundColor: '#F0FFF0',
//     borderLeftColor: '#4CAF50',
//   },
//   anniversaryTextContainer: {
//     marginLeft: 10,
//     flex: 1,
//   },
//   anniversaryName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//   },
//   departmentText: {
//     fontSize: 14,
//     color: '#666',
//     fontWeight: 'normal',
//   },
//   anniversaryMessage: {
//     fontSize: 14,
//     color: '#FF5722',
//     marginTop: 2,
//   },
//   currentUserMessage: {
//     color: '#4CAF50',
//   },
//   anniversaryDate: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 2,
//   },
//   noAnniversaries: {
//     textAlign: 'center',
//     color: '#666',
//     paddingVertical: 10,
//   },
// });

// export default HomeScreen;


// import React, { useEffect, useState } from 'react';
// import {
//   View, Text, StyleSheet, TouchableOpacity,
//   ScrollView, SafeAreaView, StatusBar,
//   ActivityIndicator, Alert, FlatList, RefreshControl
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { Calendar } from 'react-native-calendars';
// import moment from 'moment';
// import { encode } from 'base-64';

// const ERP_BASE_URL = 'https://erpnextcloud.cbditsolutions.com';
// const ATTENDANCE_ENDPOINT = '/api/resource/Attendance';
// const HOLIDAY_LIST_ENDPOINT = '/api/resource/Holiday List';
// const EMPLOYEE_ENDPOINT = '/api/resource/Employee';

// // API credentials for fetching joining dates


// const STATUS_COLORS = {
//   Present: '#4CAF50',
//   Absent: '#F44336',
//   'Half Day': '#FF9800',
//   'On Leave': '#2196F3',
//   'Work From Home': '#9C27B0',
//   Holiday: '#87CEEB',
//   Weekend: '#9E9E9E'
// };

// const DAILY_QUOTES = [
//   "Believe in yourself and all that you are.",
//   "Push yourself, because no one else is going to do it for you.",
//   "Success is not for the lazy.",
//   "Dream it. Wish it. Do it.",
// ];

// const HomeScreen = ({ route, navigation }) => {
//   const { sid, employeeData } = route.params;
//   const [markedDates, setMarkedDates] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [anniversaries, setAnniversaries] = useState([]);
//   const [quote, setQuote] = useState(DAILY_QUOTES[0]);
//   const [refreshing, setRefreshing] = useState(false);

//   const getTodaysQuote = () => {
//     const now = new Date();
//     const start = new Date(now.getFullYear(), 0, 0);
//     const diff = now - start;
//     const oneDay = 1000 * 60 * 60 * 24;
//     const dayOfYear = Math.floor(diff / oneDay);
//     const quoteIndex = dayOfYear % DAILY_QUOTES.length;
//     return DAILY_QUOTES[quoteIndex];
//   };

//   // const getAuthHeaders = () => {
//   //   // Create base64 encoded token from API key and secret
//   //   const token = encode(`${API_KEY}:${API_SECRET}`);
//   //   return {
//   //     'Authorization': `${token}`,
//   //     'Content-Type': 'application/json',
//   //     'Accept': 'application/json'
//   //   };
//   // };

//   const fetchHolidays = async () => {
//     try {
//       const holidayList = employeeData.holiday_list;
//       if (!holidayList) return {};

//       const response = await fetch(
//         `${ERP_BASE_URL}${HOLIDAY_LIST_ENDPOINT}/${encodeURIComponent(holidayList)}`,
//         { headers: { Cookie: `sid=${sid}` } }
//       );

//       const json = await response.json();
//       if (!json.data) throw new Error("Invalid holiday list response");

//       const holidayMarks = {};
//       json.data.holidays.forEach(holiday => {
//         const date = holiday.holiday_date;
//         const isWeeklyOff = holiday.weekly_off === 1;

//         holidayMarks[date] = {
//           selected: true,
//           selectedColor: isWeeklyOff ? STATUS_COLORS['Weekend'] : STATUS_COLORS['Holiday'],
//           customStyles: {
//             container: {
//               backgroundColor: isWeeklyOff ? STATUS_COLORS['Weekend'] : STATUS_COLORS['Holiday'],
//               borderRadius: 12,
//               width: 24,
//               height: 24,
//               justifyContent: 'center',
//               alignItems: 'center'
//             },
//             text: {
//               color: 'white',
//               fontWeight: 'bold',
//               fontSize: 12
//             }
//           }
//         };
//       });

//       return holidayMarks;
//     } catch (err) {
//       console.error('Failed to fetch holidays:', err);
//       return {};
//     }
//   };

//   const fetchAttendance = async () => {
//     try {
//       const today = new Date().toISOString().slice(0, 10);
//       const [attendanceResponse, holidayMarks] = await Promise.all([
//         fetch(
//           `${ERP_BASE_URL}${ATTENDANCE_ENDPOINT}?fields=["attendance_date","status"]&filters=${encodeURIComponent(JSON.stringify([
//             ["Attendance", "employee", "=", employeeData.name],
//             ["Attendance", "attendance_date", "<=", today]
//           ]))}&limit_page_length=1000`,
//           { headers: { Cookie: `sid=${sid}` } }
//         ),
//         fetchHolidays()
//       ]);

//       const attendanceJson = await attendanceResponse.json();
//       if (!attendanceJson.data) throw new Error("Invalid attendance response");

//       const attendanceMarks = {};
//       attendanceJson.data.forEach(entry => {
//         const date = entry.attendance_date;
//         const status = entry.status;
//         const color = STATUS_COLORS[status] || 'gray';

//         attendanceMarks[date] = {
//           selected: true,
//           selectedColor: color,
//           customStyles: {
//             container: {
//               backgroundColor: color,
//               borderRadius: 12,
//               width: 24,
//               height: 24,
//               justifyContent: 'center',
//               alignItems: 'center'
//             },
//             text: {
//               color: 'white',
//               fontWeight: 'bold',
//               fontSize: 12
//             }
//           }
//         };
//       });

//       const combinedMarks = { ...holidayMarks, ...attendanceMarks };
//       const todayDate = new Date().toISOString().split('T')[0];

//       if (!combinedMarks[todayDate]) {
//         combinedMarks[todayDate] = {
//           customStyles: {
//             container: {
//               borderWidth: 1,
//               borderColor: '#F44336',
//               borderRadius: 12,
//               width: 24,
//               height: 24,
//               justifyContent: 'center',
//               alignItems: 'center'
//             },
//             text: {
//               color: '#F44336',
//               fontWeight: 'bold',
//               fontSize: 12
//             }
//           }
//         };
//       }

//       setMarkedDates(combinedMarks);
//     } catch (err) {
//       Alert.alert('Error', 'Failed to fetch attendance: ' + err.message);
//     }
//   };

//   // const fetchAnniversaries = async () => {
//   //   try {
//   //     const EmployeesDataurl = 'https://erpnextcloud.cbditsolutions.com/api/resource/Employee'
//   //     const todayMMDD = moment().format('MM-DD');
//   //     const response = await fetch(
//   //       `${EmployeesDataurl}?fields=["name","employee_name","date_of_joining","department"]&filters=[["status","=","Active"]]&limit_page_length=1000`,
//   //       { 
//   //         headers: getAuthHeaders()
//   //       }
//   //     );

//   //     if (!response.ok) {
//   //       throw new Error(`HTTP error! status: ${response.status}`);
//   //     }

//   //     const json = await response.json();
//   //     const list = json.data || [];

//   //     const todaysAnniversaries = list.filter(emp => {
//   //       const doj = emp.date_of_joining;
//   //       return doj && moment(doj).format('MM-DD') === todayMMDD;
//   //     });

//   //     setAnniversaries(todaysAnniversaries);
//   //   } catch (err) {
//   //     console.error('Failed to fetch anniversaries:', err);
//   //     Alert.alert('Error', 'Failed to fetch anniversary data. Please try again later.');
//   //   }
//   // };



// const fetchAnniversaries = async () => {
//   try {
//     const EmployeesDataurl = 'https://erpnextcloud.cbditsolutions.com/api/resource/Employee';
//     const todayMMDD = moment().format('MM-DD');
//     const API_KEY = 'd1e83c2c3f5b99d';
//     const API_SECRET = 'd5fd576d4ea0fb9';

//     // ✅ Corrected template literal
//     const url = `${EmployeesDataurl}?fields=["name","employee_name","date_of_joining","department"]&filters=[["status","=","Active"]]&limit_page_length=1000`;

//     const response = await fetch(url, {
//       method: 'GET',
//       headers: {
//         // ✅ Corrected authorization header
//         'Authorization': `token ${API_KEY}:${API_SECRET}`,
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//       }
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const json = await response.json();
//     const list = json.data || [];

//     const todaysAnniversaries = list.filter(emp => {
//       const doj = emp.date_of_joining;
//       return doj && moment(doj).format('MM-DD') === todayMMDD;
//     });

//     // Update your state here
//     setAnniversaries(todaysAnniversaries);
//   } catch (err) {
//     console.error('Failed to fetch anniversaries:', err);
//     Alert.alert('Error', 'Failed to fetch anniversary data. Please try again later.');
//   }
// };


//   const loadData = async () => {
//     try {
//       setLoading(true);
//       setQuote(getTodaysQuote());
//       await Promise.all([fetchAttendance(), fetchAnniversaries()]);
//     } catch (err) {
//       console.error('Error loading data:', err);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     loadData();
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   const renderStatusLegend = () => {
//     return (
//       <View style={styles.legendContainer}>
//         {Object.entries(STATUS_COLORS).map(([status, color]) => (
//           <View key={status} style={styles.legendItem}>
//             <View style={[styles.legendColor, { backgroundColor: color }]} />
//             <Text style={styles.legendText}>{status}</Text>
//           </View>
//         ))}
//       </View>
//     );
//   };

//   const CustomDayComponent = ({ date, state, marking }) => {
//     const containerStyle = [
//       styles.dayContainer,
//       marking?.customStyles?.container,
//       state === 'today' && !marking && styles.todayContainer
//     ];

//     const textStyle = [
//       styles.dayText,
//       state === 'disabled' && styles.disabledText,
//       state === 'today' && !marking && styles.todayText,
//       marking?.customStyles?.text
//     ];

//     return (
//       <View style={containerStyle}>
//         <Text style={textStyle}>{date.day}</Text>
//       </View>
//     );
//   };

//   const renderAnniversaryItem = ({ item }) => {
//     const isCurrentUser = item.name === employeeData.name;
//     const yearsOfService = moment().diff(moment(item.date_of_joining), 'years');

//     return (
//       <View style={[
//         styles.anniversaryCard,
//         isCurrentUser && styles.currentUserAnniversaryCard
//       ]}>
//         <Ionicons name="calendar" size={24} color={isCurrentUser ? "#4CAF50" : "#FF5722"} />
//         <View style={styles.anniversaryTextContainer}>
//           <Text style={styles.anniversaryName}>
//             {item.employee_name} {isCurrentUser && "(You)"}
//             {item.department && <Text style={styles.departmentText}> • {item.department}</Text>}
//           </Text>
//           <Text style={[
//             styles.anniversaryMessage,
//             isCurrentUser && styles.currentUserMessage
//           ]}>
//             {isCurrentUser ? "🎉 Happy Your Work Anniversary!" : "🎉 Happy Work Anniversary!"}
//           </Text>
//           <Text style={styles.anniversaryDate}>
//             {yearsOfService} year{yearsOfService !== 1 ? 's' : ''} of service • Joined on {moment(item.date_of_joining).format('MMMM Do, YYYY')}
//           </Text>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar backgroundColor="#f8f9fa" barStyle="dark-content" />
//       <ScrollView 
//         contentContainerStyle={styles.scrollContainer}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={['#2196F3']}
//             tintColor="#2196F3"
//           />
//         }
//       >
//         {/* Quote of the Day */}
//         <View style={styles.quoteContainer}>
//           <Text style={styles.quoteTitle}>Quote of the Day</Text>
//           <Text style={styles.quoteText}>"{quote}"</Text>
//         </View>

//         {/* Calendar */}
//         <View style={styles.calendarContainer}>
//           <Text style={styles.calendarTitle}>Attendance Calendar</Text>
//           {loading ? (
//             <ActivityIndicator size="large" color="#000" />
//           ) : (
//             <>
//               <Calendar
//                 markedDates={markedDates}
//                 markingType="custom"
//                 style={styles.calendar}
//                 theme={{
//                   calendarBackground: '#FFFFFF',
//                   textSectionTitleColor: '#000',
//                   selectedDayBackgroundColor: '#00adf5',
//                   selectedDayTextColor: '#FFFFFF',
//                   todayTextColor: '#F44336',
//                   dayTextColor: '#000',
//                   textDisabledColor: '#d9d9d9',
//                   dotColor: '#00adf5',
//                   selectedDotColor: '#FFFFFF',
//                   arrowColor: '#2196F3',
//                   monthTextColor: '#000',
//                   textMonthFontWeight: 'bold',
//                   textDayFontSize: 14,
//                   textMonthFontSize: 16,
//                   textDayHeaderFontSize: 14,
//                   'stylesheet.calendar.header': {
//                     week: {
//                       marginTop: 5,
//                       flexDirection: 'row',
//                       justifyContent: 'space-between'
//                     }
//                   }
//                 }}
//                 dayComponent={CustomDayComponent}
//               />
//               {renderStatusLegend()}
//             </>
//           )}
//         </View>

//         {/* Navigation Cards */}
//         <TouchableOpacity
//           style={styles.navCard}
//           onPress={() => navigation.navigate('Attendance', { sid, employeeData })}
//         >
//           <Ionicons name="time-outline" size={26} color="#4CAF50" />
//           <Text style={styles.label}>Attendance</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.navCard}
//           onPress={() => navigation.navigate('LeaveRequest', { sid, employeeData })}
//         >
//           <Ionicons name="document-text-outline" size={26} color="#2196F3" />
//           <Text style={styles.label}>Leave Request</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.navCard}
//           onPress={() => navigation.navigate('SalarySlip', { sid, employeeData })}
//         >
//           <Ionicons name="cash-outline" size={26} color="#9C27B0" />
//           <Text style={styles.label}>Salary Slip</Text>
//         </TouchableOpacity>

//         {/* Work Anniversaries Section */}
//         <View style={styles.sectionContainer}>
//           <Text style={styles.sectionTitle}>Today's Work Anniversaries</Text>
//           {loading ? (
//             <ActivityIndicator size="small" color="#000" />
//           ) : anniversaries.length > 0 ? (
//             <FlatList
//               data={anniversaries}
//               renderItem={renderAnniversaryItem}
//               keyExtractor={item => item.name}
//               scrollEnabled={false}
//             />
//           ) : (
//             <Text style={styles.noAnniversaries}>No work anniversaries today</Text>
//           )}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: '#f8f9fa' },
//   scrollContainer: { padding: 20, paddingBottom: 40 },
//   quoteContainer: {
//     backgroundColor: '#fff',
//     padding: 16,
//     borderRadius: 10,
//     borderLeftWidth: 5,
//     borderLeftColor: '#ffc107',
//     marginBottom: 20,
//     elevation: 2,
//   },
//   quoteTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#856404' },
//   quoteText: { fontSize: 14, fontStyle: 'italic', color: '#856404', marginBottom: 5 },
//   calendarContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 10,
//     elevation: 2,
//     marginBottom: 20,
//   },
//   calendarTitle: { 
//     fontSize: 16, 
//     fontWeight: 'bold', 
//     marginBottom: 10, 
//     color: '#333',
//     textAlign: 'center'
//   },
//   calendar: { 
//     borderRadius: 10,
//     marginBottom: 15
//   },
//   navCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     padding: 15,
//     marginVertical: 10,
//     borderRadius: 10,
//     elevation: 2,
//   },
//   label: {
//     fontSize: 16,
//     marginLeft: 15,
//     fontWeight: '500',
//     color: '#333',
//   },
//   legendContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-around',
//     marginTop: 10,
//     paddingHorizontal: 5
//   },
//   legendItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 5,
//     marginHorizontal: 5
//   },
//   legendColor: {
//     width: 15,
//     height: 15,
//     borderRadius: 7.5,
//     marginRight: 5
//   },
//   legendText: {
//     fontSize: 12,
//     color: '#333'
//   },
//   dayContainer: {
//     width: 32,
//     height: 32,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   dayText: {
//     fontSize: 14,
//     color: '#000'
//   },
//   disabledText: {
//     color: '#d9d9d9'
//   },
//   todayContainer: {
//     borderWidth: 1,
//     borderColor: '#F44336',
//     borderRadius: 12
//   },
//   todayText: {
//     color: '#F44336',
//     fontWeight: 'bold'
//   },
//   sectionContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 20,
//     elevation: 2,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: '#333',
//   },
//   anniversaryCard: {
//     flexDirection: 'row',
//     backgroundColor: '#FFF8F5',
//     padding: 12,
//     borderRadius: 8,
//     marginVertical: 5,
//     alignItems: 'center',
//     borderLeftWidth: 4,
//     borderLeftColor: '#FF5722',
//   },
//   currentUserAnniversaryCard: {
//     backgroundColor: '#F0FFF0',
//     borderLeftColor: '#4CAF50',
//   },
//   anniversaryTextContainer: {
//     marginLeft: 10,
//     flex: 1,
//   },
//   anniversaryName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//   },
//   departmentText: {
//     fontSize: 14,
//     color: '#666',
//     fontWeight: 'normal',
//   },
//   anniversaryMessage: {
//     fontSize: 14,
//     color: '#FF5722',
//     marginTop: 2,
//   },
//   currentUserMessage: {
//     color: '#4CAF50',
//   },
//   anniversaryDate: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 2,
//   },
//   noAnniversaries: {
//     textAlign: 'center',
//     color: '#666',
//     paddingVertical: 10,
//   },
// });

// export default HomeScreen;


//////////// code with application section

// import React, { useEffect, useState } from 'react';
// import {
//   View, Text, StyleSheet, TouchableOpacity,
//   ScrollView, SafeAreaView, StatusBar,
//   ActivityIndicator, Alert, FlatList, RefreshControl,Image
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { Calendar } from 'react-native-calendars';
// import moment from 'moment';
// import { encode } from 'base-64';

// const ERP_BASE_URL = 'https://erpnextcloud.cbditsolutions.com';
// const ATTENDANCE_ENDPOINT = '/api/resource/Attendance';
// const HOLIDAY_LIST_ENDPOINT = '/api/resource/Holiday List';
// const EMPLOYEE_ENDPOINT = '/api/resource/Employee';
//   import AttendanceList from './AttendanceList';


// const STATUS_COLORS = {
//   Present: '#4CAF50',
//   Absent: '#F44336',
//   'Half Day': '#FF9800',
//   'On Leave': '#2196F3',
//   'Work From Home': '#9C27B0',
//   Holiday: '#87CEEB',
//   Weekend: '#9E9E9E'
// };

// const DAILY_QUOTES = [
//   "Believe in yourself and all that you are.",
//   "Push yourself, because no one else is going to do it for you.",
//   "Success is not for the lazy.",
//   "Dream it. Wish it. Do it.",
//   "Creativity is intelligence having fun.",
//   "Think outside the box—if you're even in a box to begin with.",
//   "Logic will get you from A to B. Imagination will take you everywhere.",
//   "The creative adult is the child who survived.",
//   "Innovation is seeing what everybody has seen and thinking what nobody has thought.",
//   "An idea that is not dangerous is unworthy of being called an idea at all.",
//   "The best way to have a good idea is to have lots of ideas.",
//   "Curiosity is the wick in the candle of learning.",
//   "Originality is simply a fresh pair of eyes.",
//   "Simplicity is the ultimate sophistication.",
//   ];

// const HomeScreen = ({ route, navigation }) => {
//   const { sid, employeeData } = route.params;
//   const [markedDates, setMarkedDates] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [anniversaries, setAnniversaries] = useState([]);
//   const [quote, setQuote] = useState(DAILY_QUOTES[0]);
//   const [refreshing, setRefreshing] = useState(false);

//   const getTodaysQuote = () => {
//     const now = new Date();
//     const start = new Date(now.getFullYear(), 0, 0);
//     const diff = now - start;
//     const oneDay = 1000 * 60 * 60 * 24;
//     const dayOfYear = Math.floor(diff / oneDay);
//     const quoteIndex = dayOfYear % DAILY_QUOTES.length;
//     return DAILY_QUOTES[quoteIndex];
//   };

//   const fetchHolidays = async () => {
//     try {
//       const holidayList = employeeData.holiday_list;
//       if (!holidayList) return {};

//       const response = await fetch(
//         `${ERP_BASE_URL}${HOLIDAY_LIST_ENDPOINT}/${encodeURIComponent(holidayList)}`,
//         { headers: { Cookie: `sid=${sid}` } }
//       );

//       const json = await response.json();
//       if (!json.data) throw new Error("Invalid holiday list response");

//       const holidayMarks = {};
//       json.data.holidays.forEach(holiday => {
//         const date = holiday.holiday_date;
//         const isWeeklyOff = holiday.weekly_off === 1;

//         holidayMarks[date] = {
//           selected: true,
//           selectedColor: isWeeklyOff ? STATUS_COLORS['Weekend'] : STATUS_COLORS['Holiday'],
//           customStyles: {
//             container: {
//               backgroundColor: isWeeklyOff ? STATUS_COLORS['Weekend'] : STATUS_COLORS['Holiday'],
//               borderRadius: 12,
//               width: 24,
//               height: 24,
//               justifyContent: 'center',
//               alignItems: 'center'
//             },
//             text: {
//               color: 'white',
//               fontWeight: 'bold',
//               fontSize: 12
//             }
//           }
//         };
//       });

//       return holidayMarks;
//     } catch (err) {
//       console.error('Failed to fetch holidays:', err);
//       return {};
//     }
//   };

//   const fetchAttendance = async () => {
//     try {
//       const today = new Date().toISOString().slice(0, 10);
//       const [attendanceResponse, holidayMarks] = await Promise.all([
//         fetch(
//           `${ERP_BASE_URL}${ATTENDANCE_ENDPOINT}?fields=["attendance_date","status"]&filters=${encodeURIComponent(JSON.stringify([
//             ["Attendance", "employee", "=", employeeData.name],
//             ["Attendance", "attendance_date", "<=", today]
//           ]))}&limit_page_length=1000`,
//           { headers: { Cookie: `sid=${sid}` } }
//         ),
//         fetchHolidays()
//       ]);

//       const attendanceJson = await attendanceResponse.json();
//       if (!attendanceJson.data) throw new Error("Invalid attendance response");

//       const attendanceMarks = {};
//       attendanceJson.data.forEach(entry => {
//         const date = entry.attendance_date;
//         const status = entry.status;
//         const color = STATUS_COLORS[status] || 'gray';

//         attendanceMarks[date] = {
//           selected: true,
//           selectedColor: color,
//           customStyles: {
//             container: {
//               backgroundColor: color,
//               borderRadius: 12,
//               width: 24,
//               height: 24,
//               justifyContent: 'center',
//               alignItems: 'center'
//             },
//             text: {
//               color: 'white',
//               fontWeight: 'bold',
//               fontSize: 12
//             }
//           }
//         };
//       });

//       const combinedMarks = { ...holidayMarks, ...attendanceMarks };
//       const todayDate = new Date().toISOString().split('T')[0];

//       if (!combinedMarks[todayDate]) {
//         combinedMarks[todayDate] = {
//           customStyles: {
//             container: {
//               borderWidth: 1,
//               borderColor: '#F44336',
//               borderRadius: 12,
//               width: 24,
//               height: 24,
//               justifyContent: 'center',
//               alignItems: 'center'
//             },
//             text: {
//               color: '#F44336',
//               fontWeight: 'bold',
//               fontSize: 12
//             }
//           }
//         };
//       }

//       setMarkedDates(combinedMarks);
//     } catch (err) {
//       Alert.alert('Error', 'Failed to fetch attendance: ' + err.message);
//     }
//   };

//   const fetchAnniversaries = async () => {
//     try {
//       const EmployeesDataurl = 'https://erpnextcloud.cbditsolutions.com/api/resource/Employee';
//       const todayMMDD = moment().format('MM-DD');
//       const API_KEY = 'd1e83c2c3f5b99d';
//       const API_SECRET = 'd5fd576d4ea0fb9';

//       const url = `${EmployeesDataurl}?fields=["name","employee_name","date_of_joining","department"]&filters=[["status","=","Active"]]&limit_page_length=1000`;

//       const response = await fetch(url, {
//         method: 'GET',
//         headers: {
//           'Authorization': `token ${API_KEY}:${API_SECRET}`,
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         }
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const json = await response.json();
//       const list = json.data || [];

//       const todaysAnniversaries = list.filter(emp => {
//         const doj = emp.date_of_joining;
//         return doj && moment(doj).format('MM-DD') === todayMMDD;
//       });

//       setAnniversaries(todaysAnniversaries);
//     } catch (err) {
//       console.error('Failed to fetch anniversaries:', err);
//       Alert.alert('Error', 'Failed to fetch anniversary data. Please try again later.');
//     }
//   };

//   const loadData = async () => {
//     try {
//       setLoading(true);
//       setQuote(getTodaysQuote());
//       await Promise.all([fetchAttendance(), fetchAnniversaries()]);
//     } catch (err) {
//       console.error('Error loading data:', err);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     loadData();
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   const renderStatusLegend = () => {
//     return (
//       <View style={styles.legendContainer}>
//         {Object.entries(STATUS_COLORS).map(([status, color]) => (
//           <View key={status} style={styles.legendItem}>
//             <View style={[styles.legendColor, { backgroundColor: color }]} />
//             <Text style={styles.legendText}>{status}</Text>
//           </View>
//         ))}
//       </View>
//     );
//   };

//   const CustomDayComponent = ({ date, state, marking }) => {
//     const containerStyle = [
//       styles.dayContainer,
//       marking?.customStyles?.container,
//       state === 'today' && !marking && styles.todayContainer
//     ];

//     const textStyle = [
//       styles.dayText,
//       state === 'disabled' && styles.disabledText,
//       state === 'today' && !marking && styles.todayText,
//       marking?.customStyles?.text
//     ];

//     return (
//       <View style={containerStyle}>
//         <Text style={textStyle}>{date.day}</Text>
//       </View>
//     );
//   };

//   const renderAnniversaryItem = ({ item }) => {
//     const isCurrentUser = item.name === employeeData.name;
//     const yearsOfService = moment().diff(moment(item.date_of_joining), 'years');

//     return (
//       <View style={[
//         styles.anniversaryCard,
//         isCurrentUser && styles.currentUserAnniversaryCard
//       ]}>
//         <Ionicons name="calendar" size={24} color={isCurrentUser ? "#4CAF50" : "#FF5722"} />
//         <View style={styles.anniversaryTextContainer}>
//           <Text style={styles.anniversaryName}>
//             {item.employee_name} {isCurrentUser && "(You)"}
//             {item.department && <Text style={styles.departmentText}> • {item.department}</Text>}
//           </Text>
//           <Text style={[
//             styles.anniversaryMessage,
//             isCurrentUser && styles.currentUserMessage
//           ]}>
//             {isCurrentUser ? "🎉 Happy Your Work Anniversary!" : "🎉 Happy Work Anniversary!"}
//           </Text>
//           <Text style={styles.anniversaryDate}>
//             {yearsOfService} year{yearsOfService !== 1 ? 's' : ''} of service • Joined on {moment(item.date_of_joining).format('MMMM Do, YYYY')}
//           </Text>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar backgroundColor="#f8f9fa" barStyle="dark-content" />
//       <ScrollView 
//         contentContainerStyle={styles.scrollContainer}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={['#2196F3']}
//             tintColor="#2196F3"
//           />
//         }
//       >
//         {/* Quote of the Day */}
//         <View style={styles.quoteContainer}>
//           <Text style={styles.quoteTitle}>Quote of the Day</Text>
//           <Text style={styles.quoteText}>"{quote}"</Text>
//         </View>



//          {/* Applications Section */}
//         <View style={styles.sectionContainer}>
//           <Text style={styles.sectionTitle}>Applications</Text>
//           <View style={styles.applicationsContainer}>
//             <TouchableOpacity
//               style={styles.applicationCard}
//               onPress={() => navigation.navigate('Attendance', { sid, employeeData })}
//             >
//               <Ionicons name="time-outline" size={26} color="#4CAF50" />
//               <Text style={styles.applicationText}>Attendance</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.applicationCard}
//               onPress={() => navigation.navigate('LeaveRequest', { sid, employeeData })}
//             >
//               <Ionicons name="document-text-outline" size={26} color="#2196F3" />
//               <Text style={styles.applicationText}>Leave</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.applicationCard}
//               onPress={() => navigation.navigate('SalarySlip', { sid, employeeData })}
//             >
//               <Ionicons name="cash-outline" size={26} color="#9C27B0" />
//               <Text style={styles.applicationText}>Salary Slip</Text>
//             </TouchableOpacity>



//           </View>
//         </View>







//        {/* Applications Section */}
//         <View style={styles.sectionContainer}>
//           <Text style={styles.sectionTitle}>View</Text>
//           <View style={styles.applicationsContainer}>
//             {/* <TouchableOpacity
//               style={styles.applicationCard}
//               onPress={() => navigation.navigate('AttendanceListScreen', { sid, employeeData })}
//             >
//               <Ionicons name="time-outline" size={26} color="#4CAF50" />
//               <Text style={styles.applicationText}>My Attendance</Text>
//             </TouchableOpacity> */}


//             <TouchableOpacity
//   style={styles.applicationCard}
//   onPress={() => navigation.navigate('AttendanceListScreen', { sid, employeeData })}
// >
//   <Image 
//     source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3594/3594465.png' }}
//     style={{ width: 30, height: 30, tintColor: '#3F51B5' }}
//   />
//   <Text style={styles.applicationText}>Attendance History</Text>
// </TouchableOpacity>




//           </View>
//         </View>








//         {/* Calendar */}
//         <View style={styles.calendarContainer}>
//           <Text style={styles.calendarTitle}>Attendance Calendar</Text>
//           {loading ? (
//             <ActivityIndicator size="large" color="#000" />
//           ) : (
//             <>
//               <Calendar
//                 markedDates={markedDates}
//                 markingType="custom"
//                 style={styles.calendar}
//                 theme={{
//                   calendarBackground: '#FFFFFF',
//                   textSectionTitleColor: '#000',
//                   selectedDayBackgroundColor: '#00adf5',
//                   selectedDayTextColor: '#FFFFFF',
//                   todayTextColor: '#F44336',
//                   dayTextColor: '#000',
//                   textDisabledColor: '#d9d9d9',
//                   dotColor: '#00adf5',
//                   selectedDotColor: '#FFFFFF',
//                   arrowColor: '#2196F3',
//                   monthTextColor: '#000',
//                   textMonthFontWeight: 'bold',
//                   textDayFontSize: 14,
//                   textMonthFontSize: 16,
//                   textDayHeaderFontSize: 14,
//                   'stylesheet.calendar.header': {
//                     week: {
//                       marginTop: 5,
//                       flexDirection: 'row',
//                       justifyContent: 'space-between'
//                     }
//                   }
//                 }}
//                 dayComponent={CustomDayComponent}
//               />
//               {renderStatusLegend()}
//             </>
//           )}
//         </View>



//         {/* Work Anniversaries Section */}
//         <View style={styles.sectionContainer}>
//           <Text style={styles.sectionTitle}>Today's Work Anniversaries</Text>
//           {loading ? (
//             <ActivityIndicator size="small" color="#000" />
//           ) : anniversaries.length > 0 ? (
//             <FlatList
//               data={anniversaries}
//               renderItem={renderAnniversaryItem}
//               keyExtractor={item => item.name}
//               scrollEnabled={false}
//             />
//           ) : (
//             <Text style={styles.noAnniversaries}>No work anniversaries today</Text>
//           )}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: '#f8f9fa' },
//   scrollContainer: { padding: 20, paddingBottom: 40 },
//   quoteContainer: {
//     backgroundColor: '#fff',
//     padding: 16,
//     borderRadius: 10,
//     borderLeftWidth: 5,
//     borderLeftColor: '#ffc107',
//     marginBottom: 20,
//     elevation: 2,
//   },
//   quoteTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#856404' },
//   quoteText: { fontSize: 14, fontStyle: 'italic', color: '#856404', marginBottom: 5 },
//   calendarContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 10,
//     elevation: 2,
//     marginBottom: 20,
//   },
//   calendarTitle: { 
//     fontSize: 16, 
//     fontWeight: 'bold', 
//     marginBottom: 10, 
//     color: '#333',
//     textAlign: 'center'
//   },
//   calendar: { 
//     borderRadius: 10,
//     marginBottom: 15
//   },
//   sectionContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 20,
//     elevation: 2,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 15,
//     color: '#333',
//   },
//   applicationsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 5,
//   },
//   applicationCard: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 15,
//     width: '30%',
//     alignItems: 'center',
//     justifyContent: 'center',
//     elevation: 2,
//   },
//   applicationText: {
//     fontSize: 12,
//     fontWeight: '500',
//     color: '#333',
//     marginTop: 8,
//     textAlign: 'center',
//   },
//   legendContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-around',
//     marginTop: 10,
//     paddingHorizontal: 5
//   },
//   legendItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 5,
//     marginHorizontal: 5
//   },
//   legendColor: {
//     width: 15,
//     height: 15,
//     borderRadius: 7.5,
//     marginRight: 5
//   },
//   legendText: {
//     fontSize: 12,
//     color: '#333'
//   },
//   dayContainer: {
//     width: 32,
//     height: 32,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   dayText: {
//     fontSize: 14,
//     color: '#000'
//   },
//   disabledText: {
//     color: '#d9d9d9'
//   },
//   todayContainer: {
//     borderWidth: 1,
//     borderColor: '#F44336',
//     borderRadius: 12
//   },
//   todayText: {
//     color: '#F44336',
//     fontWeight: 'bold'
//   },
//   anniversaryCard: {
//     flexDirection: 'row',
//     backgroundColor: '#FFF8F5',
//     padding: 12,
//     borderRadius: 8,
//     marginVertical: 5,
//     alignItems: 'center',
//     borderLeftWidth: 4,
//     borderLeftColor: '#FF5722',
//   },
//   currentUserAnniversaryCard: {
//     backgroundColor: '#F0FFF0',
//     borderLeftColor: '#4CAF50',
//   },
//   anniversaryTextContainer: {
//     marginLeft: 10,
//     flex: 1,
//   },
//   anniversaryName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//   },
//   departmentText: {
//     fontSize: 14,
//     color: '#666',
//     fontWeight: 'normal',
//   },
//   anniversaryMessage: {
//     fontSize: 14,
//     color: '#FF5722',
//     marginTop: 2,
//   },
//   currentUserMessage: {
//     color: '#4CAF50',
//   },
//   anniversaryDate: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 2,
//   },
//   noAnniversaries: {
//     textAlign: 'center',
//     color: '#666',
//     paddingVertical: 10,
//   },
// });

// export default HomeScreen;



////  code with anniversary and birthday section


// import React, { useEffect, useState } from 'react';
// import {
//   View, Text, StyleSheet, TouchableOpacity,
//   ScrollView, SafeAreaView, StatusBar,
//   ActivityIndicator, Alert, FlatList, RefreshControl, Image
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { Calendar } from 'react-native-calendars';
// import moment from 'moment';
// import { encode } from 'base-64';
// import axios from 'axios';
// import { Dimensions } from 'react-native';

// //const ERP_BASE_URL = 'https://erpnextcloud.cbditsolutions.com';
// //const ERP_BASE_URL = 'https://erpnextcloud.cbditsolutions.com';
// //const ERP_BASE_URL = 'https://mpda.in';
// const ATTENDANCE_ENDPOINT = '/api/resource/Attendance';
// const HOLIDAY_LIST_ENDPOINT = '/api/resource/Holiday List';
// const EMPLOYEE_ENDPOINT = '/api/resource/Employee';
// import AttendanceList from './AttendanceList';

// const STATUS_COLORS = {
//   Present: '#4CAF50',
//   Absent: '#F44336',
//   'Half Day': '#FF9800',
//   'On Leave': '#2196F3',
//   'Work From Home': '#9C27B0',
//   Holiday: '#87CEEB',
//   Weekend: '#9E9E9E'
// };

// const DAILY_QUOTES = [
//   "It always seems impossible until it’s done.",
//   "Believe in yourself and all that you are.",
//   "Push yourself, because no one else is going to do it for you.",
//   "Success is not for the lazy.",
//   "Dream it. Wish it. Do it.",
//   "Creativity is intelligence having fun.",
//   "Think outside the box—if you're even in a box to begin with.",
//   "Logic will get you from A to B. Imagination will take you everywhere.",
//   "The creative adult is the child who survived.",
//   "Innovation is seeing what everybody has seen and thinking what nobody has thought.",
//   "An idea that is not dangerous is unworthy of being called an idea at all.",
//   "The best way to have a good idea is to have lots of ideas.",
//   "Curiosity is the wick in the candle of learning.",
//   "Originality is simply a fresh pair of eyes.",
//   "Simplicity is the ultimate sophistication.",
//   "Act as if what you do makes a difference. It does,",
//   "Doubt kills more dreams than failure ever will.",
//   "Stay away from negative people. They have a problem for every solution.",
//   "You are stronger than you think.",
//   "It always seems impossible until it’s done.",
//   "Don’t be afraid to give up the good to go for the great.",
//   "Success doesn’t come from what you do occasionally. It comes from what you do consistently.",
//   "If you get tired, learn to rest, not to quit.",
//   "You don’t have to be great to start, but you have to start to be great.",
//   "The secret of getting ahead is getting started.",
//   "Small steps in the right direction can turn out to be the biggest step of your life.",
//   "Success is what comes after you stop making excuses.",
//   "Discipline is choosing between what you want now and what you want most.",
//   "Don’t limit your challenges. Challenge your limits.",
//   "Be so good they can’t ignore you.",
//   "Failure is the condiment that gives success its flavor.",
//   "You miss 100% of the shots you don’t take.",
//   "Focus on your goal. Don’t look in any direction but ahead.",
//   "Don’t stop until you’re proud.",
//   "Strive for progress, not perfection.",
//   "You were not given this life to be average.",
//   "A little progress each day adds up to big results.",
//   "The only way to do great work is to love what you do.",
//   "Don’t count the days, make the days count.",
//   "Stop doubting yourself, work hard, and make it happen.",
//   "When you feel like quitting, think about why you started.",
//   "Keep going. Everything you need will come to you at the perfect time.",
//   "Success starts with self-discipline.",
//   "Wake up with determination, go to bed with satisfaction.",
//   "Make it happen. Shock everyone.",
//   "Don’t just exist. Live.",
//   "It’s never too late to be what you might have been.",
//   "Every accomplishment starts with the decision to try.",
//   "Turn your wounds into wisdom.",
//   "Stay positive, work hard, make it happen.",
//   "One day or day one. You decide.",
//   "Big journeys begin with small steps.",
//   "Hustle until your haters ask if you're hiring.",
//   "Progress is progress, no matter how small.",
//   "The best view comes after the hardest climb.",
//   "Be fearless in the pursuit of what sets your soul on fire.",
//   "Don't be pushed around by the fears in your mind.",
//   "Make your life a masterpiece.",
//   "Keep your eyes on the stars, and your feet on the ground.",
//   "You are capable of amazing things.",
//   "Push harder than yesterday if you want a different tomorrow.",
//   "Trust the process.",
//   "Mindset is everything.",
//   "The pain you feel today will be the strength you feel tomorrow.",
//   "You don’t find willpower, you create it.",
//   "Never give up on a dream just because of the time it will take to accomplish it.",
//   "Stay focused and never give up.",



// ];



// const { width } = Dimensions.get('window'); // Get screen width
// const CARD_WIDTH = width * 0.28; // 28% of screen width
// const CARD_HEIGHT = width * 0.28; // keep square ratio

// const HomeScreen = ({ route, navigation }) => {
//   const { sid, employeeData, erpUrl } = route.params;
//   const [markedDates, setMarkedDates] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [anniversaryList, setAnniversaryList] = useState([]);
//   const [birthdayList, setBirthdayList] = useState([]);
//   const [quote, setQuote] = useState(DAILY_QUOTES[0]);
//   const [refreshing, setRefreshing] = useState(false);
//   const ERP_BASE_URL = erpUrl;

//   const getTodaysQuote = () => {
//     const now = new Date();
//     const start = new Date(now.getFullYear(), 0, 0);
//     const diff = now - start;
//     const oneDay = 1000 * 60 * 60 * 24;
//     const dayOfYear = Math.floor(diff / oneDay);
//     const quoteIndex = dayOfYear % DAILY_QUOTES.length;
//     return DAILY_QUOTES[quoteIndex];
//   };

//   const fetchHolidays = async () => {
//     try {
//       const holidayList = employeeData.holiday_list;
//       if (!holidayList) return {};

//       const response = await fetch(
//         `${ERP_BASE_URL}${HOLIDAY_LIST_ENDPOINT}/${encodeURIComponent(holidayList)}`,
//         { headers: { Cookie: `sid=${sid}` } }
//       );

//       const json = await response.json();
//       if (!json.data) throw new Error("Invalid holiday list response");

//       const holidayMarks = {};
//       json.data.holidays.forEach(holiday => {
//         const date = holiday.holiday_date;
//         const isWeeklyOff = holiday.weekly_off === 1;

//         holidayMarks[date] = {
//           selected: true,
//           selectedColor: isWeeklyOff ? STATUS_COLORS['Weekend'] : STATUS_COLORS['Holiday'],
//           customStyles: {
//             container: {
//               backgroundColor: isWeeklyOff ? STATUS_COLORS['Weekend'] : STATUS_COLORS['Holiday'],
//               borderRadius: 12,
//               width: 24,
//               height: 24,
//               justifyContent: 'center',
//               alignItems: 'center'
//             },
//             text: {
//               color: 'white',
//               fontWeight: 'bold',
//               fontSize: 12
//             }
//           }
//         };
//       });

//       return holidayMarks;
//     } catch (err) {
//       console.error('Failed to fetch holidays:', err);
//       return {};
//     }
//   };

//   const fetchAttendance = async () => {
//     try {
//       const today = new Date().toISOString().slice(0, 10);
//       const [attendanceResponse, holidayMarks] = await Promise.all([
//         fetch(
//           `${ERP_BASE_URL}${ATTENDANCE_ENDPOINT}?fields=["attendance_date","status"]&filters=${encodeURIComponent(JSON.stringify([
//             ["Attendance", "employee", "=", employeeData.name],
//             ["Attendance", "attendance_date", "<=", today]
//           ]))}&limit_page_length=1000`,
//           { headers: { Cookie: `sid=${sid}` } }
//         ),
//         fetchHolidays()
//       ]);

//       const attendanceJson = await attendanceResponse.json();
//       if (!attendanceJson.data) throw new Error("Invalid attendance response");

//       const attendanceMarks = {};
//       attendanceJson.data.forEach(entry => {
//         const date = entry.attendance_date;
//         const status = entry.status;
//         const color = STATUS_COLORS[status] || 'gray';

//         attendanceMarks[date] = {
//           selected: true,
//           selectedColor: color,
//           customStyles: {
//             container: {
//               backgroundColor: color,
//               borderRadius: 12,
//               width: 24,
//               height: 24,
//               justifyContent: 'center',
//               alignItems: 'center'
//             },
//             text: {
//               color: 'white',
//               fontWeight: 'bold',
//               fontSize: 12
//             }
//           }
//         };
//       });

//       const combinedMarks = { ...holidayMarks, ...attendanceMarks };
//       const todayDate = new Date().toISOString().split('T')[0];

//       if (!combinedMarks[todayDate]) {
//         combinedMarks[todayDate] = {
//           customStyles: {
//             container: {
//               borderWidth: 1,
//               borderColor: '#F44336',
//               borderRadius: 12,
//               width: 24,
//               height: 24,
//               justifyContent: 'center',
//               alignItems: 'center'
//             },
//             text: {
//               color: '#F44336',
//               fontWeight: 'bold',
//               fontSize: 12
//             }
//           }
//         };
//       }

//       setMarkedDates(combinedMarks);
//     } catch (err) {
//       Alert.alert('Error', 'Failed to fetch attendance: ' + err.message);
//     }
//   };

//   const fetchTodayAnniversaries = async () => {
//     try {
//       const response = await axios.get(
//         `${ERP_BASE_URL}$/api/method/birth_and_ani`
//       );

//       const fullList = response.data?.data || [];
//       const todayMMDD = moment().format('MM-DD');

//       const filtered = fullList
//         .map(item => {
//           const anniversaryDate = moment(item.anniversary);
//           const mmdd = anniversaryDate.format('MM-DD');
//           const completedYears = moment().diff(anniversaryDate, 'years');

//           return {
//             ...item,
//             completedYears,
//             isToday: mmdd === todayMMDD,
//           };
//         })
//         .filter(emp => emp.isToday);

//       setAnniversaryList(filtered);
//     } catch (error) {
//       //Alert.alert('Error', 'Failed to fetch anniversary data');
//       console.error('API Error:', error);
//     }
//   };

//   const fetchTodayBirthdays = async () => {
//     try {
//       const response = await axios.get(
//         '/api/method/birth_and_ani'
//       );

//       const fullList = response.data?.data || [];
//       const todayMMDD = moment().format('MM-DD');

//       const filtered = fullList
//         .map(item => {
//           const birthdayDate = moment(item.birth);
//           const mmdd = birthdayDate.format('MM-DD');
//           const age = moment().diff(birthdayDate, 'years');

//           return {
//             ...item,
//             age,
//             isToday: mmdd === todayMMDD,
//           };
//         })
//         .filter(emp => emp.isToday);

//       setBirthdayList(filtered);
//     } catch (error) {
//       // Alert.alert('Error', 'Failed to fetch birthday data');
//       console.error('API Error:', error);
//     }
//   };

//   const loadData = async () => {
//     try {
//       setLoading(true);
//       setQuote(getTodaysQuote());
//       await Promise.all([
//         fetchAttendance(),
//         fetchTodayAnniversaries(),
//         fetchTodayBirthdays()
//       ]);
//     } catch (err) {
//       console.error('Error loading data:', err);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     loadData();
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   const renderStatusLegend = () => {
//     return (
//       <View style={styles.legendContainer}>
//         {Object.entries(STATUS_COLORS).map(([status, color]) => (
//           <View key={status} style={styles.legendItem}>
//             <View style={[styles.legendColor, { backgroundColor: color }]} />
//             <Text style={styles.legendText}>{status}</Text>
//           </View>
//         ))}
//       </View>
//     );
//   };

//   const CustomDayComponent = ({ date, state, marking }) => {
//     const containerStyle = [
//       styles.dayContainer,
//       marking?.customStyles?.container,
//       state === 'today' && !marking && styles.todayContainer
//     ];

//     const textStyle = [
//       styles.dayText,
//       state === 'disabled' && styles.disabledText,
//       state === 'today' && !marking && styles.todayText,
//       marking?.customStyles?.text
//     ];

//     return (
//       <View style={containerStyle}>
//         <Text style={textStyle}>{date.day}</Text>
//       </View>
//     );
//   };



//   const renderAnniversaryItem = ({ item, index }) => {  // Added index parameter
//     const isCurrentUser = item.emp_name === employeeData.employee_name;

//     return (
//       <View
//         key={`anniversary-${index}`}  // Added key prop here
//         style={[
//           styles.anniversaryCard,
//           isCurrentUser && styles.currentUserAnniversaryCard
//         ]}
//       >
//         <Ionicons name="calendar" size={24} color={isCurrentUser ? "#4CAF50" : "#FF5722"} />
//         <View style={styles.anniversaryTextContainer}>
//           <Text style={styles.anniversaryName}>
//             {item.emp_name} {isCurrentUser && "(You)"}
//             {item.department && <Text style={styles.departmentText}> • {item.department}</Text>}
//           </Text>
//           <Text style={[
//             styles.anniversaryMessage,
//             isCurrentUser && styles.currentUserMessage
//           ]}>
//             🎉 Today is {item.emp_name}'s {item.completedYears} Year Work Anniversary!
//           </Text>
//           <Text style={styles.anniversaryDate}>
//             Anniversary: {moment(item.anniversary).format('DD MMMM YYYY')}
//           </Text>
//         </View>
//       </View>
//     );
//   };





//   const renderBirthdayItem = ({ item }) => {
//     const isCurrentUser = item.emp_name === employeeData.employee_name;

//     return (
//       <View style={[
//         styles.birthdayCard,
//         isCurrentUser && styles.currentUserBirthdayCard
//       ]}>
//         <Ionicons name="gift" size={24} color={isCurrentUser ? "#4CAF50" : "#E91E63"} />
//         <View style={styles.birthdayTextContainer}>
//           <Text style={styles.birthdayName}>
//             {item.emp_name} {isCurrentUser && "(You)"}
//             {item.department && <Text style={styles.departmentText}> • {item.department}</Text>}
//           </Text>
//           <Text style={[
//             styles.birthdayMessage,
//             isCurrentUser && styles.currentUserMessage
//           ]}>
//             🎂 Wishing {item.emp_name} a happy {item.age} birthday!
//           </Text>
//           <Text style={styles.birthdayDate}>
//             Birthday: {moment(item.birth).format('DD MMMM YYYY')}
//           </Text>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar backgroundColor="#f8f9fa" barStyle="dark-content" />
//       <ScrollView
//         contentContainerStyle={styles.scrollContainer}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={['#2196F3']}
//             tintColor="#2196F3"
//           />
//         }
//       >
//         {/* Quote of the Day */}
//         <View style={styles.quoteContainer}>
//           <Text style={styles.quoteTitle}>Quote of the Day</Text>
//           <Text style={styles.quoteText}>"{quote}"</Text>
//         </View>

//         {/* Applications Section */}
//         {/* <View style={styles.sectionContainer}>
//           <Text style={styles.sectionTitle}>Applications</Text>
//           <View style={styles.applicationsContainer}>
//             <TouchableOpacity
//               style={styles.applicationCard}
//               onPress={() => navigation.navigate('Attendance', { sid, employeeData ,erpUrl})}
//             >
//               <Ionicons name="time-outline" size={26} color="#4CAF50" />
//               <Text style={styles.applicationText}>Attendance</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.applicationCard}
//               onPress={() => navigation.navigate('LeaveRequest', { sid, employeeData,erpUrl })}
//             >
//               <Ionicons name="document-text-outline" size={26} color="#2196F3" />
//               <Text style={styles.applicationText}>Leave</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.applicationCard}
//               onPress={() => navigation.navigate('SalarySlip', { sid, employeeData,erpUrl })}
//             >
//               <Ionicons name="cash-outline" size={26} color="#9C27B0" />
//               <Text style={styles.applicationText}>Salary Slip</Text>
//             </TouchableOpacity>
           

            
//            <TouchableOpacity
//            style={styles.applicationCard}
//            onPress={() => navigation.navigate('OD', { sid, employeeData,erpUrl })}
//            >
//            <Ionicons name="briefcase-outline" size={26} color="#FF9800" />
//            <Text style={styles.applicationText}>OutDoor</Text>
//            </TouchableOpacity>
            

            


//           </View>
//         </View> */}


//         {/* Applications Section */}
//         <View style={styles.sectionContainer}>
//           <Text style={styles.sectionTitle}>Applications</Text>

//           {/* First Row: Attendance | Leave | Salary Slip */}
//           <View style={styles.applicationsContainer}>
//             <TouchableOpacity
//               //style={[styles.applicationCard, { backgroundColor: '#E6E6FA', height: 90, width: 95 }]}
//               style={[styles.applicationCard, { backgroundColor: '#E6E6FA' }]}
//               onPress={() => navigation.navigate('Attendance', { sid, employeeData, erpUrl })}
//             >
//               <Ionicons name="time-outline" size={26} color="#4CAF50" />
//               <Text style={styles.applicationText}>Attendance</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               //style={[styles.applicationCard, { backgroundColor: '#E3F2FD',height: 90, width: 95}]}
//               style={[styles.applicationCard, { backgroundColor: '#E3F2FD' }]}
//               onPress={() => navigation.navigate('LeaveRequest', { sid, employeeData, erpUrl })}
//             >
//               <Ionicons name="document-text-outline" size={26} color="#2196F3" />
//               <Text style={styles.applicationText}>Leave</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               //style={[styles.applicationCard, { backgroundColor: '#F8F4E8',height: 90, width: 95 }]}
//               style={[styles.applicationCard, { backgroundColor: '#F8F4E8' }]}
//               onPress={() => navigation.navigate('SalarySlip', { sid, employeeData, erpUrl })}
//             >
//               <Ionicons name="cash-outline" size={26} color="#9C27B0" />
//               <Text style={styles.applicationText}>Salary Slip</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Second Row: Outdoor | Timesheet */}
//           <View style={styles.applicationsContainer}>
//             <TouchableOpacity
//               //style={[styles.applicationCard, { backgroundColor: '#FFDAB9' }]}
//               style={[styles.applicationCard, { backgroundColor: '#FFDAB9' }]}
//               onPress={() => navigation.navigate('OD', { sid, employeeData, erpUrl })}
//             >
//               <Ionicons name="briefcase-outline" size={26} color="#FF9800" />
//               <Text style={styles.applicationText}>OutDoor</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               //style={[styles.applicationCard, { backgroundColor: '#EEEEEE' }]}
//               style={[styles.applicationCard, { backgroundColor: '#EEEEEE' }]}
//               onPress={() => navigation.navigate('Timesheet', { sid, employeeData, erpUrl })}
//             >
//               <Ionicons name="clipboard-outline" size={26} color="#03A9F4" />
//               <Text style={styles.applicationText}>Timesheet</Text>
//             </TouchableOpacity>

//             {/* Empty third slot to maintain spacing */}
//             <View style={[styles.applicationCard, { backgroundColor: 'transparent', elevation: 0 }]} />
//           </View>
//         </View>




//         {/* Applications Section */}
//         <View style={styles.sectionContainer}>
//           <Text style={styles.sectionTitle}>View</Text>
//           <View style={styles.applicationsContainer}>
//             <TouchableOpacity
//               style={[styles.applicationCard, { backgroundColor: '#FFF8E1', height: 90, width: 95 }]}
//               onPress={() => navigation.navigate('AttendanceListScreen', { sid, employeeData, erpUrl })}
//             >
//               <Image
//                 source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3594/3594465.png' }}
//                 style={{ width: 30, height: 30, tintColor: '#3F51B5' }}
//               />
//               <Text style={styles.applicationText}>Att. History</Text>
//             </TouchableOpacity>
//           </View>






//         </View>

//         {/* Calendar */}
//         <View style={styles.calendarContainer}>
//           <Text style={styles.calendarTitle}>Attendance Calendar</Text>
//           {loading ? (
//             <ActivityIndicator size="large" color="#000" />
//           ) : (
//             <>
//               <Calendar
//                 markedDates={markedDates}
//                 markingType="custom"
//                 style={styles.calendar}
//                 theme={{
//                   calendarBackground: '#FFFFFF',
//                   textSectionTitleColor: '#000',
//                   selectedDayBackgroundColor: '#00adf5',
//                   selectedDayTextColor: '#FFFFFF',
//                   todayTextColor: '#F44336',
//                   dayTextColor: '#000',
//                   textDisabledColor: '#d9d9d9',
//                   dotColor: '#00adf5',
//                   selectedDotColor: '#FFFFFF',
//                   arrowColor: '#2196F3',
//                   monthTextColor: '#000',
//                   textMonthFontWeight: 'bold',
//                   textDayFontSize: 14,
//                   textMonthFontSize: 16,
//                   textDayHeaderFontSize: 14,
//                   'stylesheet.calendar.header': {
//                     week: {
//                       marginTop: 5,
//                       flexDirection: 'row',
//                       justifyContent: 'space-between'
//                     }
//                   }
//                 }}
//                 dayComponent={CustomDayComponent}
//               />
//               {renderStatusLegend()}
//             </>
//           )}
//         </View>

//         {/* Work Anniversaries Section */}
//         <View style={styles.sectionContainer}>
//           <Text style={styles.sectionTitle}>Today's Work Anniversaries</Text>
//           {loading ? (
//             <ActivityIndicator size="small" color="#000" />
//           ) : anniversaryList.length > 0 ? (
//             // <FlatList
//             //   data={anniversaryList}
//             //   renderItem={renderAnniversaryItem}
//             //   keyExtractor={item => item.name}
//             //   scrollEnabled={false}
//             // />

//             <FlatList
//               data={anniversaryList}
//               renderItem={renderAnniversaryItem}
//               keyExtractor={(item, index) => `anniversary-${index}`}  // Modified keyExtractor
//               scrollEnabled={false}
//             />


//           ) : (
//             <Text style={styles.noAnniversaries}>No work anniversaries today</Text>
//           )}
//         </View>

//         {/* Birthdays Section */}
//         <View style={styles.sectionContainer}>
//           <Text style={styles.sectionTitle}>Today's Birthdays</Text>
//           {loading ? (
//             <ActivityIndicator size="small" color="#000" />
//           ) : birthdayList.length > 0 ? (
//             <FlatList
//               data={birthdayList}
//               renderItem={renderBirthdayItem}
//               keyExtractor={item => item.name}
//               scrollEnabled={false}
//             />
//           ) : (
//             <Text style={styles.noAnniversaries}>No birthdays today</Text>
//           )}
//         </View>
        
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: '#E6F4F1' },
//   scrollContainer: { padding: 20, paddingBottom: 40 },
//   quoteContainer: {

//     backgroundColor: '#fff',
//     padding: 16,
//     borderRadius: 10,
//     borderLeftWidth: 5,
//     borderLeftColor: '#ffc107',
//     marginBottom: 20,
//     elevation: 2,

//   },
//   quoteTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#856404' },
//   quoteText: { fontSize: 14, fontStyle: 'italic', color: '#856404', marginBottom: 5 },
//   calendarContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 10,
//     elevation: 2,
//     marginBottom: 20,
//   },
//   calendarTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: '#333',
//     textAlign: 'center'
//   },
//   calendar: {
//     borderRadius: 10,
//     marginBottom: 15
//   },
//   sectionContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 20,
//     elevation: 2,

//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 15,
//     color: '#333',
//   },
//   applicationsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     marginBottom: 5,
//   },
//   applicationCard: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 15,
//     width: '30%',
//     alignItems: 'center',
//     justifyContent: 'center',
//     elevation: 2,
//     marginVertical: 10,
//   },
//   applicationText: {
//     fontSize: 12,
//     fontWeight: '500',
//     color: '#333',
//     marginTop: 8,
//     textAlign: 'center',
//   },
//   legendContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-around',
//     marginTop: 10,
//     paddingHorizontal: 5
//   },
//   legendItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 5,
//     marginHorizontal: 5
//   },
//   legendColor: {
//     width: 15,
//     height: 15,
//     borderRadius: 7.5,
//     marginRight: 5
//   },
//   legendText: {
//     fontSize: 12,
//     color: '#333'
//   },
//   dayContainer: {
//     width: 32,
//     height: 32,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   dayText: {
//     fontSize: 14,
//     color: '#000'
//   },
//   disabledText: {
//     color: '#d9d9d9'
//   },
//   todayContainer: {
//     borderWidth: 1,
//     borderColor: '#F44336',
//     borderRadius: 12
//   },
//   todayText: {
//     color: '#F44336',
//     fontWeight: 'bold'
//   },
//   anniversaryCard: {
//     flexDirection: 'row',
//     backgroundColor: '#FFF8F5',
//     padding: 12,
//     borderRadius: 8,
//     marginVertical: 5,
//     alignItems: 'center',
//     borderLeftWidth: 4,
//     borderLeftColor: '#FF5722',
//   },
//   currentUserAnniversaryCard: {
//     backgroundColor: '#F0FFF0',
//     borderLeftColor: '#4CAF50',
//   },
//   anniversaryTextContainer: {
//     marginLeft: 10,
//     flex: 1,
//   },
//   anniversaryName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//   },
//   departmentText: {
//     fontSize: 14,
//     color: '#666',
//     fontWeight: 'normal',
//   },
//   anniversaryMessage: {
//     fontSize: 14,
//     color: '#FF5722',
//     marginTop: 2,
//   },
//   currentUserMessage: {
//     color: '#4CAF50',
//   },
//   anniversaryDate: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 2,
//   },
//   birthdayCard: {
//     flexDirection: 'row',
//     backgroundColor: '#FFF0F5',
//     padding: 12,
//     borderRadius: 8,
//     marginVertical: 5,
//     alignItems: 'center',
//     borderLeftWidth: 4,
//     borderLeftColor: '#E91E63',
//   },
//   currentUserBirthdayCard: {
//     backgroundColor: '#F0FFF0',
//     borderLeftColor: '#4CAF50',
//   },
//   birthdayTextContainer: {
//     marginLeft: 10,
//     flex: 1,
//   },
//   birthdayName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//   },
//   birthdayMessage: {
//     fontSize: 14,
//     color: '#E91E63',
//     marginTop: 2,
//   },
//   birthdayDate: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 2,
//   },




//   noAnniversaries: {
//     textAlign: 'center',
//     color: '#666',
//     paddingVertical: 10,
//   },
// });

// export default HomeScreen;


// Code with Responsive UI and Att. Request

// import React, { useEffect, useState } from 'react';
// import {
//   View, Text, StyleSheet, TouchableOpacity,
//   ScrollView, SafeAreaView, StatusBar,
//   ActivityIndicator, Alert, FlatList, RefreshControl, Image,
//   Dimensions,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { Calendar } from 'react-native-calendars';
// import moment from 'moment';
// import { encode } from 'base-64';
// import axios from 'axios';

// //const ERP_BASE_URL = 'https://erpnextcloud.cbditsolutions.com';
// //const ERP_BASE_URL = 'https://erpnextcloud.cbditsolutions.com';
// //const ERP_BASE_URL = 'https://mpda.in';
// const ATTENDANCE_ENDPOINT = '/api/resource/Attendance';
// const HOLIDAY_LIST_ENDPOINT = '/api/resource/Holiday List';
// const EMPLOYEE_ENDPOINT = '/api/resource/Employee';
// import AttendanceList from './AttendanceList';

// const STATUS_COLORS = {
//   Present: '#4CAF50',
//   Absent: '#F44336',
//   'Half Day': '#FF9800',
//   'On Leave': '#2196F3',
//   'Work From Home': '#9C27B0',
//   Holiday: '#87CEEB',
//   Weekend: '#9E9E9E'
// };

// const DAILY_QUOTES = [
//   "It always seems impossible until it’s done.",
//   "Believe in yourself and all that you are.",
//   "Push yourself, because no one else is going to do it for you.",
//   "Success is not for the lazy.",
//   "Dream it. Wish it. Do it.",
//   "Creativity is intelligence having fun.",
//   "Think outside the box—if you're even in a box to begin with.",
//   "Logic will get you from A to B. Imagination will take you everywhere.",
//   "The creative adult is the child who survived.",
//   "Innovation is seeing what everybody has seen and thinking what nobody has thought.",
//   "An idea that is not dangerous is unworthy of being called an idea at all.",
//   "The best way to have a good idea is to have lots of ideas.",
//   "Curiosity is the wick in the candle of learning.",
//   "Originality is simply a fresh pair of eyes.",
//   "Simplicity is the ultimate sophistication.",
//   "Act as if what you do makes a difference. It does,",
//   "Doubt kills more dreams than failure ever will.",
//   "Stay away from negative people. They have a problem for every solution.",
//   "You are stronger than you think.",
//   "It always seems impossible until it’s done.",
//   "Don’t be afraid to give up the good to go for the great.",
//   "Success doesn’t come from what you do occasionally. It comes from what you do consistently.",
//   "If you get tired, learn to rest, not to quit.",
//   "You don’t have to be great to start, but you have to start to be great.",
//   "The secret of getting ahead is getting started.",
//   "Small steps in the right direction can turn out to be the biggest step of your life.",
//   "Success is what comes after you stop making excuses.",
//   "Discipline is choosing between what you want now and what you want most.",
//   "Don’t limit your challenges. Challenge your limits.",
//   "Be so good they can’t ignore you.",
//   "Failure is the condiment that gives success its flavor.",
//   "You miss 100% of the shots you don’t take.",
//   "Focus on your goal. Don’t look in any direction but ahead.",
//   "Don’t stop until you’re proud.",
//   "Strive for progress, not perfection.",
//   "You were not given this life to be average.",
//   "A little progress each day adds up to big results.",
//   "The only way to do great work is to love what you do.",
//   "Don’t count the days, make the days count.",
//   "Stop doubting yourself, work hard, and make it happen.",
//   "When you feel like quitting, think about why you started.",
//   "Keep going. Everything you need will come to you at the perfect time.",
//   "Success starts with self-discipline.",
//   "Wake up with determination, go to bed with satisfaction.",
//   "Make it happen. Shock everyone.",
//   "Don’t just exist. Live.",
//   "It’s never too late to be what you might have been.",
//   "Every accomplishment starts with the decision to try.",
//   "Turn your wounds into wisdom.",
//   "Stay positive, work hard, make it happen.",
//   "One day or day one. You decide.",
//   "Big journeys begin with small steps.",
//   "Hustle until your haters ask if you're hiring.",
//   "Progress is progress, no matter how small.",
//   "The best view comes after the hardest climb.",
//   "Be fearless in the pursuit of what sets your soul on fire.",
//   "Don't be pushed around by the fears in your mind.",
//   "Make your life a masterpiece.",
//   "Keep your eyes on the stars, and your feet on the ground.",
//   "You are capable of amazing things.",
//   "Push harder than yesterday if you want a different tomorrow.",
//   "Trust the process.",
//   "Mindset is everything.",
//   "The pain you feel today will be the strength you feel tomorrow.",
//   "You don’t find willpower, you create it.",
//   "Never give up on a dream just because of the time it will take to accomplish it.",
//   "Stay focused and never give up.",
// ];

// const { width } = Dimensions.get('window');

// const HomeScreen = ({ route, navigation }) => {
//   const { sid, employeeData, erpUrl } = route.params;
//   const [markedDates, setMarkedDates] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [anniversaryList, setAnniversaryList] = useState([]);
//   const [birthdayList, setBirthdayList] = useState([]);
//   const [quote, setQuote] = useState(DAILY_QUOTES[0]);
//   const [refreshing, setRefreshing] = useState(false);
//   const ERP_BASE_URL = erpUrl;

//   const getTodaysQuote = () => {
//     const now = new Date();
//     const start = new Date(now.getFullYear(), 0, 0);
//     const diff = now - start;
//     const oneDay = 1000 * 60 * 60 * 24;
//     const dayOfYear = Math.floor(diff / oneDay);
//     const quoteIndex = dayOfYear % DAILY_QUOTES.length;
//     return DAILY_QUOTES[quoteIndex];
//   };

//   const fetchHolidays = async () => {
//     try {
//       const holidayList = employeeData.holiday_list;
//       if (!holidayList) return {};

//       const response = await fetch(
//         `${ERP_BASE_URL}${HOLIDAY_LIST_ENDPOINT}/${encodeURIComponent(holidayList)}`,
//         { headers: { Cookie: `sid=${sid}` } }
//       );

//       const json = await response.json();
//       if (!json.data) throw new Error("Invalid holiday list response");

//       const holidayMarks = {};
//       json.data.holidays.forEach(holiday => {
//         const date = holiday.holiday_date;
//         const isWeeklyOff = holiday.weekly_off === 1;

//         holidayMarks[date] = {
//           selected: true,
//           selectedColor: isWeeklyOff ? STATUS_COLORS['Weekend'] : STATUS_COLORS['Holiday'],
//           customStyles: {
//             container: {
//               backgroundColor: isWeeklyOff ? STATUS_COLORS['Weekend'] : STATUS_COLORS['Holiday'],
//               borderRadius: 12,
//               width: 24,
//               height: 24,
//               justifyContent: 'center',
//               alignItems: 'center'
//             },
//             text: {
//               color: 'white',
//               fontWeight: 'bold',
//               fontSize: 12
//             }
//           }
//         };
//       });

//       return holidayMarks;
//     } catch (err) {
//       console.error('Failed to fetch holidays:', err);
//       return {};
//     }
//   };

//   const fetchAttendance = async () => {
//     try {
//       const today = new Date().toISOString().slice(0, 10);
//       const [attendanceResponse, holidayMarks] = await Promise.all([
//         fetch(
//           `${ERP_BASE_URL}${ATTENDANCE_ENDPOINT}?fields=["attendance_date","status"]&filters=${encodeURIComponent(JSON.stringify([
//              ["Attendance", "employee", "=", employeeData.name],
//              ["Attendance", "attendance_date", "<=", today]
//            ]))}&limit_page_length=1000`,
//           { headers: { Cookie: `sid=${sid}` } }
//         ),
//         fetchHolidays()
//       ]);

//       const attendanceJson = await attendanceResponse.json();
//       if (!attendanceJson.data) throw new Error("Invalid attendance response");

//       const attendanceMarks = {};
//       attendanceJson.data.forEach(entry => {
//         const date = entry.attendance_date;
//         const status = entry.status;
//         const color = STATUS_COLORS[status] || 'gray';

//         attendanceMarks[date] = {
//           selected: true,
//           selectedColor: color,
//           customStyles: {
//             container: {
//               backgroundColor: color,
//               borderRadius: 12,
//               width: 24,
//               height: 24,
//               justifyContent: 'center',
//               alignItems: 'center'
//             },
//             text: {
//               color: 'white',
//               fontWeight: 'bold',
//               fontSize: 12
//             }
//           }
//         };
//       });

//       const combinedMarks = { ...holidayMarks, ...attendanceMarks };
//       const todayDate = new Date().toISOString().split('T')[0];

//       if (!combinedMarks[todayDate]) {
//         combinedMarks[todayDate] = {
//           customStyles: {
//             container: {
//               borderWidth: 1,
//               borderColor: '#F44336',
//               borderRadius: 12,
//               width: 24,
//               height: 24,
//               justifyContent: 'center',
//               alignItems: 'center'
//             },
//             text: {
//               color: '#F44336',
//               fontWeight: 'bold',
//               fontSize: 12
//             }
//           }
//         };
//       }

//       setMarkedDates(combinedMarks);
//     } catch (err) {
//       Alert.alert('Error', 'Failed to fetch attendance: ' + err.message);
//     }
//   };

//   const fetchTodayAnniversaries = async () => {
//     try {
//       const response = await axios.get(
//         `${ERP_BASE_URL}$/api/method/birth_and_ani`
//       );

//       const fullList = response.data?.data || [];
//       const todayMMDD = moment().format('MM-DD');

//       const filtered = fullList
//         .map(item => {
//           const anniversaryDate = moment(item.anniversary);
//           const mmdd = anniversaryDate.format('MM-DD');
//           const completedYears = moment().diff(anniversaryDate, 'years');

//           return {
//             ...item,
//             completedYears,
//             isToday: mmdd === todayMMDD,
//           };
//         })
//         .filter(emp => emp.isToday);

//       setAnniversaryList(filtered);
//     } catch (error) {
//       console.error('API Error:', error);
//     }
//   };

//   const fetchTodayBirthdays = async () => {
//     try {
//       const response = await axios.get(
//         '/api/method/birth_and_ani'
//       );

//       const fullList = response.data?.data || [];
//       const todayMMDD = moment().format('MM-DD');

//       const filtered = fullList
//         .map(item => {
//           const birthdayDate = moment(item.birth);
//           const mmdd = birthdayDate.format('MM-DD');
//           const age = moment().diff(birthdayDate, 'years');

//           return {
//             ...item,
//             age,
//             isToday: mmdd === todayMMDD,
//           };
//         })
//         .filter(emp => emp.isToday);

//       setBirthdayList(filtered);
//     } catch (error) {
//       console.error('API Error:', error);
//     }
//   };

//   const loadData = async () => {
//     try {
//       setLoading(true);
//       setQuote(getTodaysQuote());
//       await Promise.all([
//         fetchAttendance(),
//         fetchTodayAnniversaries(),
//         fetchTodayBirthdays()
//       ]);
//     } catch (err) {
//       console.error('Error loading data:', err);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     loadData();
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   const renderStatusLegend = () => {
//     return (
//       <View style={styles.legendContainer}>
//         {Object.entries(STATUS_COLORS).map(([status, color]) => (
//           <View key={status} style={styles.legendItem}>
//             <View style={[styles.legendColor, { backgroundColor: color }]} />
//             <Text style={styles.legendText}>{status}</Text>
//           </View>
//         ))}
//       </View>
//     );
//   };

//   const CustomDayComponent = ({ date, state, marking }) => {
//     const containerStyle = [
//       styles.dayContainer,
//       marking?.customStyles?.container,
//       state === 'today' && !marking && styles.todayContainer
//     ];

//     const textStyle = [
//       styles.dayText,
//       state === 'disabled' && styles.disabledText,
//       state === 'today' && !marking && styles.todayText,
//       marking?.customStyles?.text
//     ];

//     return (
//       <View style={containerStyle}>
//         <Text style={textStyle}>{date.day}</Text>
//       </View>
//     );
//   };

//   const renderAnniversaryItem = ({ item, index }) => {
//     const isCurrentUser = item.emp_name === employeeData.employee_name;

//     return (
//       <View
//         key={`anniversary-${index}`}
//         style={[
//           styles.anniversaryCard,
//           isCurrentUser && styles.currentUserAnniversaryCard
//         ]}
//       >
//         <Ionicons name="calendar" size={24} color={isCurrentUser ? "#4CAF50" : "#FF5722"} />
//         <View style={styles.anniversaryTextContainer}>
//           <Text style={styles.anniversaryName}>
//             {item.emp_name} {isCurrentUser && "(You)"}
//             {item.department && <Text style={styles.departmentText}> • {item.department}</Text>}
//           </Text>
//           <Text style={[
//             styles.anniversaryMessage,
//             isCurrentUser && styles.currentUserMessage
//           ]}>
//             🎉 Today is {item.emp_name}'s {item.completedYears} Year Work Anniversary!
//           </Text>
//           <Text style={styles.anniversaryDate}>
//             Anniversary: {moment(item.anniversary).format('DD MMMM YYYY')}
//           </Text>
//         </View>
//       </View>
//     );
//   };

//   const renderBirthdayItem = ({ item }) => {
//     const isCurrentUser = item.emp_name === employeeData.employee_name;

//     return (
//       <View style={[
//         styles.birthdayCard,
//         isCurrentUser && styles.currentUserBirthdayCard
//       ]}>
//         <Ionicons name="gift" size={24} color={isCurrentUser ? "#4CAF50" : "#E91E63"} />
//         <View style={styles.birthdayTextContainer}>
//           <Text style={styles.birthdayName}>
//             {item.emp_name} {isCurrentUser && "(You)"}
//             {item.department && <Text style={styles.departmentText}> • {item.department}</Text>}
//           </Text>
//           <Text style={[
//             styles.birthdayMessage,
//             isCurrentUser && styles.currentUserMessage
//           ]}>
//             🎂 Wishing {item.emp_name} a happy {item.age} birthday!
//           </Text>
//           <Text style={styles.birthdayDate}>
//             Birthday: {moment(item.birth).format('DD MMMM YYYY')}
//           </Text>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar backgroundColor="#f8f9fa" barStyle="dark-content" />
//       <ScrollView
//         contentContainerStyle={styles.scrollContainer}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={['#2196F3']}
//             tintColor="#2196F3"
//           />
//         }
//       >
//         {/* Quote of the Day */}
//         <View style={styles.quoteContainer}>
//           <Text style={styles.quoteTitle}>Quote of the Day</Text>
//           <Text style={styles.quoteText}>"{quote}"</Text>
//         </View>

//         {/* Applications Section */}
//         <View style={styles.sectionContainer}>
//           <Text style={styles.sectionTitle}>Applications</Text>

//           {/* First Row: Attendance | Leave | Salary Slip */}
//           <View style={styles.applicationsContainer}>
//             <TouchableOpacity
//               style={[styles.applicationCard, { backgroundColor: '#E6E6FA' }]}
//               onPress={() => navigation.navigate('Attendance', { sid, employeeData, erpUrl })}
//               activeOpacity={0.7}
//             >
//               <Ionicons name="time-outline" size={26} color="#4CAF50" />
//               <Text style={styles.applicationText}>Attendance</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.applicationCard, { backgroundColor: '#E3F2FD' }]}
//               onPress={() => navigation.navigate('LeaveRequest', { sid, employeeData, erpUrl })}
//               activeOpacity={0.7}
//             >
//               <Ionicons name="document-text-outline" size={26} color="#2196F3" />
//               <Text style={styles.applicationText}>Leave</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.applicationCard, { backgroundColor: '#F8F4E8' }]}
//               onPress={() => navigation.navigate('SalarySlip', { sid, employeeData, erpUrl })}
//               activeOpacity={0.7}
//             >
//               <Ionicons name="cash-outline" size={26} color="#9C27B0" />
//               <Text style={styles.applicationText}>Salary Slip</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Second Row: Outdoor | Timesheet */}
//           <View style={styles.applicationsContainer}>
//             <TouchableOpacity
//               style={[styles.applicationCard, { backgroundColor: '#FFDAB9' }]}
//               onPress={() => navigation.navigate('OD', { sid, employeeData, erpUrl })}
//               activeOpacity={0.7}
//             >
//               <Ionicons name="briefcase-outline" size={26} color="#FF9800" />
//               <Text style={styles.applicationText}>OutDoor</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.applicationCard, { backgroundColor: '#EEEEEE' }]}
//               onPress={() => navigation.navigate('Timesheet', { sid, employeeData, erpUrl })}
//               activeOpacity={0.7}
//             >
//               <Ionicons name="clipboard-outline" size={26} color="#03A9F4" />
//               <Text style={styles.applicationText}>Timesheet</Text>
//             </TouchableOpacity>


//              <TouchableOpacity
//               style={[styles.applicationCard, { backgroundColor: '#ffe4e1' }]}
//               onPress={() => navigation.navigate('AttendanceRe', { sid, employeeData, erpUrl })}
//               activeOpacity={0.7}
//             >
//               <Ionicons name="briefcase-outline" size={26} color="#FF9800" />
//               <Text style={styles.applicationText}>Att. Request</Text>
//             </TouchableOpacity>

//             {/* Empty third slot to maintain spacing */}
            
//           </View>
//         </View>

//         {/* View Section */}
//         <View style={styles.sectionContainer}>
//           <Text style={styles.sectionTitle}>View</Text>
//           <View style={styles.applicationsContainer}>
//             <TouchableOpacity
//               style={[styles.applicationCard, { backgroundColor: '#FFF8E1', height: 90, width: 95 }]}
//               onPress={() => navigation.navigate('AttendanceListScreen', { sid, employeeData, erpUrl })}
//               activeOpacity={0.7}
//             >
//               <Image
//                 source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3594/3594465.png' }}
//                 style={{ width: 30, height: 30, tintColor: '#3F51B5' }}
//               />
//               <Text style={styles.applicationText}>Att. History</Text>
//             </TouchableOpacity>
//           </View>




//           <View style={styles.applicationsContainer}>
//             <TouchableOpacity
//               style={[styles.applicationCard, { backgroundColor: '#FFF8E1', height: 90, width: 95 }]}
//               onPress={() => navigation.navigate('AttendanceListScreen', { sid, employeeData, erpUrl })}
//               activeOpacity={0.7}
//             >
//               <Image
//                 source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3594/3594465.png' }}
//                 style={{ width: 30, height: 30, tintColor: '#3F51B5' }}
//               />
//               <Text style={styles.applicationText}>Att. History</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Calendar */}
//         <View style={styles.calendarContainer}>
//           <Text style={styles.calendarTitle}>Attendance Calendar</Text>
//           {loading ? (
//             <ActivityIndicator size="large" color="#000" />
//           ) : (
//             <>
//               <Calendar
//                 markedDates={markedDates}
//                 markingType="custom"
//                 style={styles.calendar}
//                 theme={{
//                   calendarBackground: '#FFFFFF',
//                   textSectionTitleColor: '#000',
//                   selectedDayBackgroundColor: '#00adf5',
//                   selectedDayTextColor: '#FFFFFF',
//                   todayTextColor: '#F44336',
//                   dayTextColor: '#000',
//                   textDisabledColor: '#d9d9d9',
//                   dotColor: '#00adf5',
//                   selectedDotColor: '#FFFFFF',
//                   arrowColor: '#2196F3',
//                   monthTextColor: '#000',
//                   textMonthFontWeight: 'bold',
//                   textDayFontSize: 14,
//                   textMonthFontSize: 16,
//                   textDayHeaderFontSize: 14,
//                   'stylesheet.calendar.header': {
//                     week: {
//                       marginTop: 5,
//                       flexDirection: 'row',
//                       justifyContent: 'space-between'
//                     }
//                   }
//                 }}
//                 dayComponent={CustomDayComponent}
//               />
//               {renderStatusLegend()}
//             </>
//           )}
//         </View>

//         {/* Work Anniversaries Section */}
//         <View style={styles.sectionContainer}>
//           <Text style={styles.sectionTitle}>Today's Work Anniversaries</Text>
//           {loading ? (
//             <ActivityIndicator size="small" color="#000" />
//           ) : anniversaryList.length > 0 ? (
//             <FlatList
//               data={anniversaryList}
//               renderItem={renderAnniversaryItem}
//               keyExtractor={(item, index) => `anniversary-${index}`}
//               scrollEnabled={false}
//             />
//           ) : (
//             <Text style={styles.noAnniversaries}>No work anniversaries today</Text>
//           )}
//         </View>

//         {/* Birthdays Section */}
//         <View style={styles.sectionContainer}>
//           <Text style={styles.sectionTitle}>Today's Birthdays</Text>
//           {loading ? (
//             <ActivityIndicator size="small" color="#000" />
//           ) : birthdayList.length > 0 ? (
//             <FlatList
//               data={birthdayList}
//               renderItem={renderBirthdayItem}
//               keyExtractor={item => item.name}
//               scrollEnabled={false}
//             />
//           ) : (
//             <Text style={styles.noAnniversaries}>No birthdays today</Text>
//           )}
//         </View>

//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: '#E6F4F1' },
//   scrollContainer: { padding: 20, paddingBottom: 40 },
//   quoteContainer: {
//     backgroundColor: '#fff',
//     padding: 16,
//     borderRadius: 10,
//     borderLeftWidth: 5,
//     borderLeftColor: '#ffc107',
//     marginBottom: 20,
//     elevation: 2,
//   },
//   quoteTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#856404' },
//   quoteText: { fontSize: 14, fontStyle: 'italic', color: '#856404', marginBottom: 5 },
//   calendarContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 10,
//     elevation: 2,
//     marginBottom: 20,
//   },
//   calendarTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: '#333',
//     textAlign: 'center'
//   },
//   calendar: {
//     borderRadius: 10,
//     marginBottom: 15
//   },
//   sectionContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 20,
//     elevation: 2,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 15,
//     color: '#333',
//   },
//   applicationsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     marginBottom: 5,
//   },
//   applicationCard: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 15,
//     // Responsive width, about 30% minus margin for spacing, with minimum and maximum widths
//     width: '30%',
//     minWidth: 90,        // Minimum for small devices
//     maxWidth: 120,       // Maximum for larger screens to keep similar look
//     alignItems: 'center',
//     justifyContent: 'center',
//     elevation: 2,
//     marginVertical: 10,
//     // Adding a fixed aspect ratio for height proportionality
//     aspectRatio: 1,
//   },
//   applicationText: {
//     fontSize: 12,
//     fontWeight: '500',
//     color: '#333',
//     marginTop: 8,
//     textAlign: 'center',
//   },
//   legendContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-around',
//     marginTop: 10,
//     paddingHorizontal: 5
//   },
//   legendItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 5,
//     marginHorizontal: 5
//   },
//   legendColor: {
//     width: 15,
//     height: 15,
//     borderRadius: 7.5,
//     marginRight: 5
//   },
//   legendText: {
//     fontSize: 12,
//     color: '#333'
//   },
//   dayContainer: {
//     width: 32,
//     height: 32,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   dayText: {
//     fontSize: 14,
//     color: '#000'
//   },
//   disabledText: {
//     color: '#d9d9d9'
//   },
//   todayContainer: {
//     borderWidth: 1,
//     borderColor: '#F44336',
//     borderRadius: 12
//   },
//   todayText: {
//     color: '#F44336',
//     fontWeight: 'bold'
//   },
//   anniversaryCard: {
//     flexDirection: 'row',
//     backgroundColor: '#FFF8F5',
//     padding: 12,
//     borderRadius: 8,
//     marginVertical: 5,
//     alignItems: 'center',
//     borderLeftWidth: 4,
//     borderLeftColor: '#FF5722',
//   },
//   currentUserAnniversaryCard: {
//     backgroundColor: '#F0FFF0',
//     borderLeftColor: '#4CAF50',
//   },
//   anniversaryTextContainer: {
//     marginLeft: 10,
//     flex: 1,
//   },
//   anniversaryName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//   },
//   departmentText: {
//     fontSize: 14,
//     color: '#666',
//     fontWeight: 'normal',
//   },
//   anniversaryMessage: {
//     fontSize: 14,
//     color: '#FF5722',
//     marginTop: 2,
//   },
//   currentUserMessage: {
//     color: '#4CAF50',
//   },
//   anniversaryDate: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 2,
//   },
//   birthdayCard: {
//     flexDirection: 'row',
//     backgroundColor: '#FFF0F5',
//     padding: 12,
//     borderRadius: 8,
//     marginVertical: 5,
//     alignItems: 'center',
//     borderLeftWidth: 4,
//     borderLeftColor: '#E91E63',
//   },
//   currentUserBirthdayCard: {
//     backgroundColor: '#F0FFF0',
//     borderLeftColor: '#4CAF50',
//   },
//   birthdayTextContainer: {
//     marginLeft: 10,
//     flex: 1,
//   },
//   birthdayName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//   },
//   birthdayMessage: {
//     fontSize: 14,
//     color: '#E91E63',
//     marginTop: 2,
//   },
//   birthdayDate: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 2,
//   },
//   noAnniversaries: {
//     textAlign: 'center',
//     color: '#666',
//     paddingVertical: 10,
//   },
// });

// export default HomeScreen;




import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, SafeAreaView, StatusBar,
  ActivityIndicator, Alert, FlatList, RefreshControl, Image,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import { encode } from 'base-64';
import axios from 'axios';

//const ERP_BASE_URL = 'https://erpnextcloud.cbditsolutions.com';
//const ERP_BASE_URL = 'https://erpnextcloud.cbditsolutions.com';
//const ERP_BASE_URL = 'https://mpda.in';
const ATTENDANCE_ENDPOINT = '/api/resource/Attendance';
const HOLIDAY_LIST_ENDPOINT = '/api/resource/Holiday List';
const EMPLOYEE_ENDPOINT = '/api/resource/Employee';
import AttendanceList from './AttendanceList';

const STATUS_COLORS = {
  Present: '#4CAF50',
  Absent: '#F44336',
  'Half Day': '#FF9800',
  'On Leave': '#2196F3',
  'Work From Home': '#9C27B0',
  Holiday: '#87CEEB',
  Weekend: '#9E9E9E'
};

const DAILY_QUOTES = [
  "It always seems impossible until it's done.",
  "Believe in yourself and all that you are.",
  "Push yourself, because no one else is going to do it for you.",
  "Success is not for the lazy.",
  "Dream it. Wish it. Do it.",
  "Creativity is intelligence having fun.",
  "Think outside the box—if you're even in a box to begin with.",
  "Logic will get you from A to B. Imagination will take you everywhere.",
  "The creative adult is the child who survived.",
  "Innovation is seeing what everybody has seen and thinking what nobody has thought.",
  "An idea that is not dangerous is unworthy of being called an idea at all.",
  "The best way to have a good idea is to have lots of ideas.",
  "Curiosity is the wick in the candle of learning.",
  "Originality is simply a fresh pair of eyes.",
  "Simplicity is the ultimate sophistication.",
  "Act as if what you do makes a difference. It does,",
  "Doubt kills more dreams than failure ever will.",
  "Stay away from negative people. They have a problem for every solution.",
  "You are stronger than you think.",
  "It always seems impossible until it's done.",
  "Don't be afraid to give up the good to go for the great.",
  "Success doesn't come from what you do occasionally. It comes from what you do consistently.",
  "If you get tired, learn to rest, not to quit.",
  "You don't have to be great to start, but you have to start to be great.",
  "The secret of getting ahead is getting started.",
  "Small steps in the right direction can turn out to be the biggest step of your life.",
  "Success is what comes after you stop making excuses.",
  "Discipline is choosing between what you want now and what you want most.",
  "Don't limit your challenges. Challenge your limits.",
  "Be so good they can't ignore you.",
  "Failure is the condiment that gives success its flavor.",
  "You miss 100% of the shots you don't take.",
  "Focus on your goal. Don't look in any direction but ahead.",
  "Don't stop until you're proud.",
  "Strive for progress, not perfection.",
  "You were not given this life to be average.",
  "A little progress each day adds up to big results.",
  "The only way to do great work is to love what you do.",
  "Don't count the days, make the days count.",
  "Stop doubting yourself, work hard, and make it happen.",
  "When you feel like quitting, think about why you started.",
  "Keep going. Everything you need will come to you at the perfect time.",
  "Success starts with self-discipline.",
  "Wake up with determination, go to bed with satisfaction.",
  "Make it happen. Shock everyone.",
  "Don't just exist. Live.",
  "It's never too late to be what you might have been.",
  "Every accomplishment starts with the decision to try.",
  "Turn your wounds into wisdom.",
  "Stay positive, work hard, make it happen.",
  "One day or day one. You decide.",
  "Big journeys begin with small steps.",
  "Hustle until your haters ask if you're hiring.",
  "Progress is progress, no matter how small.",
  "The best view comes after the hardest climb.",
  "Be fearless in the pursuit of what sets your soul on fire.",
  "Don't be pushed around by the fears in your mind.",
  "Make your life a masterpiece.",
  "Keep your eyes on the stars, and your feet on the ground.",
  "You are capable of amazing things.",
  "Push harder than yesterday if you want a different tomorrow.",
  "Trust the process.",
  "Mindset is everything.",
  "The pain you feel today will be the strength you feel tomorrow.",
  "You don't find willpower, you create it.",
  "Never give up on a dream just because of the time it will take to accomplish it.",
  "Stay focused and never give up.",
];

const { width } = Dimensions.get('window');

const HomeScreen = ({ route, navigation }) => {
  const { sid, employeeData, erpUrl } = route.params;
  const [markedDates, setMarkedDates] = useState({});
  const [loading, setLoading] = useState(true);
  const [anniversaryList, setAnniversaryList] = useState([]);
  const [birthdayList, setBirthdayList] = useState([]);
  const [quote, setQuote] = useState(DAILY_QUOTES[0]);
  const [refreshing, setRefreshing] = useState(false);
  const ERP_BASE_URL = erpUrl;

  const getTodaysQuote = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const quoteIndex = dayOfYear % DAILY_QUOTES.length;
    return DAILY_QUOTES[quoteIndex];
  };

  const fetchHolidays = async () => {
    try {
      const holidayList = employeeData.holiday_list;
      if (!holidayList) return {};

      const response = await fetch(
        `${ERP_BASE_URL}${HOLIDAY_LIST_ENDPOINT}/${encodeURIComponent(holidayList)}`,
        { headers: { Cookie: `sid=${sid}` } }
      );

      const json = await response.json();
      if (!json.data) throw new Error("Invalid holiday list response");

      const holidayMarks = {};
      json.data.holidays.forEach(holiday => {
        const date = holiday.holiday_date;
        const isWeeklyOff = holiday.weekly_off === 1;

        holidayMarks[date] = {
          selected: true,
          selectedColor: isWeeklyOff ? STATUS_COLORS['Weekend'] : STATUS_COLORS['Holiday'],
          customStyles: {
            container: {
              backgroundColor: isWeeklyOff ? STATUS_COLORS['Weekend'] : STATUS_COLORS['Holiday'],
              borderRadius: 12,
              width: 24,
              height: 24,
              justifyContent: 'center',
              alignItems: 'center'
            },
            text: {
              color: 'white',
              fontWeight: 'bold',
              fontSize: 12
            }
          }
        };
      });

      return holidayMarks;
    } catch (err) {
      console.error('Failed to fetch holidays:', err);
      return {};
    }
  };

  const fetchAttendance = async () => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const [attendanceResponse, holidayMarks] = await Promise.all([
        fetch(
          `${ERP_BASE_URL}${ATTENDANCE_ENDPOINT}?fields=["attendance_date","status"]&filters=${encodeURIComponent(JSON.stringify([
             ["Attendance", "employee", "=", employeeData.name],
             ["Attendance", "attendance_date", "<=", today]
           ]))}&limit_page_length=1000`,
          { headers: { Cookie: `sid=${sid}` } }
        ),
        fetchHolidays()
      ]);

      const attendanceJson = await attendanceResponse.json();
      if (!attendanceJson.data) throw new Error("Invalid attendance response");

      const attendanceMarks = {};
      attendanceJson.data.forEach(entry => {
        const date = entry.attendance_date;
        const status = entry.status;
        const color = STATUS_COLORS[status] || 'gray';

        attendanceMarks[date] = {
          selected: true,
          selectedColor: color,
          customStyles: {
            container: {
              backgroundColor: color,
              borderRadius: 12,
              width: 24,
              height: 24,
              justifyContent: 'center',
              alignItems: 'center'
            },
            text: {
              color: 'white',
              fontWeight: 'bold',
              fontSize: 12
            }
          }
        };
      });

      const combinedMarks = { ...holidayMarks, ...attendanceMarks };
      const todayDate = new Date().toISOString().split('T')[0];

      if (!combinedMarks[todayDate]) {
        combinedMarks[todayDate] = {
          customStyles: {
            container: {
              borderWidth: 1,
              borderColor: '#F44336',
              borderRadius: 12,
              width: 24,
              height: 24,
              justifyContent: 'center',
              alignItems: 'center'
            },
            text: {
              color: '#F44336',
              fontWeight: 'bold',
              fontSize: 12
            }
          }
        };
      }

      setMarkedDates(combinedMarks);
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch attendance: ' + err.message);
    }
  };

  const fetchTodayAnniversaries = async () => {
    try {
      const response = await axios.get(
        `${ERP_BASE_URL}$/api/method/birth_and_ani`
      );

      const fullList = response.data?.data || [];
      const todayMMDD = moment().format('MM-DD');

      const filtered = fullList
        .map(item => {
          const anniversaryDate = moment(item.anniversary);
          const mmdd = anniversaryDate.format('MM-DD');
          const completedYears = moment().diff(anniversaryDate, 'years');

          return {
            ...item,
            completedYears,
            isToday: mmdd === todayMMDD,
          };
        })
        .filter(emp => emp.isToday);

      setAnniversaryList(filtered);
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  const fetchTodayBirthdays = async () => {
    try {
      const response = await axios.get(
        '/api/method/birth_and_ani'
      );

      const fullList = response.data?.data || [];
      const todayMMDD = moment().format('MM-DD');

      const filtered = fullList
        .map(item => {
          const birthdayDate = moment(item.birth);
          const mmdd = birthdayDate.format('MM-DD');
          const age = moment().diff(birthdayDate, 'years');

          return {
            ...item,
            age,
            isToday: mmdd === todayMMDD,
          };
        })
        .filter(emp => emp.isToday);

      setBirthdayList(filtered);
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setQuote(getTodaysQuote());
      await Promise.all([
        fetchAttendance(),
        fetchTodayAnniversaries(),
        fetchTodayBirthdays()
      ]);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  useEffect(() => {
    loadData();
  }, []);

  const renderStatusLegend = () => {
    return (
      <View style={styles.legendContainer}>
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <View key={status} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: color }]} />
            <Text style={styles.legendText}>{status}</Text>
          </View>
        ))}
      </View>
    );
  };

  const CustomDayComponent = ({ date, state, marking }) => {
    const containerStyle = [
      styles.dayContainer,
      marking?.customStyles?.container,
      state === 'today' && !marking && styles.todayContainer
    ];

    const textStyle = [
      styles.dayText,
      state === 'disabled' && styles.disabledText,
      state === 'today' && !marking && styles.todayText,
      marking?.customStyles?.text
    ];

    return (
      <View style={containerStyle}>
        <Text style={textStyle}>{date.day}</Text>
      </View>
    );
  };

  const renderAnniversaryItem = ({ item, index }) => {
    const isCurrentUser = item.emp_name === employeeData.employee_name;

    return (
      <View
        key={`anniversary-${index}`}
        style={[
          styles.anniversaryCard,
          isCurrentUser && styles.currentUserAnniversaryCard
        ]}
      >
        <Ionicons name="calendar" size={24} color={isCurrentUser ? "#4CAF50" : "#FF5722"} />
        <View style={styles.anniversaryTextContainer}>
          <Text style={styles.anniversaryName}>
            {item.emp_name} {isCurrentUser && "(You)"}
            {item.department && <Text style={styles.departmentText}> • {item.department}</Text>}
          </Text>
          <Text style={[
            styles.anniversaryMessage,
            isCurrentUser && styles.currentUserMessage
          ]}>
            🎉 Today is {item.emp_name}'s {item.completedYears} Year Work Anniversary!
          </Text>
          <Text style={styles.anniversaryDate}>
            Anniversary: {moment(item.anniversary).format('DD MMMM YYYY')}
          </Text>
        </View>
      </View>
    );
  };

  const renderBirthdayItem = ({ item }) => {
    const isCurrentUser = item.emp_name === employeeData.employee_name;

    return (
      <View style={[
        styles.birthdayCard,
        isCurrentUser && styles.currentUserBirthdayCard
      ]}>
        <Ionicons name="gift" size={24} color={isCurrentUser ? "#4CAF50" : "#E91E63"} />
        <View style={styles.birthdayTextContainer}>
          <Text style={styles.birthdayName}>
            {item.emp_name} {isCurrentUser && "(You)"}
            {item.department && <Text style={styles.departmentText}> • {item.department}</Text>}
          </Text>
          <Text style={[
            styles.birthdayMessage,
            isCurrentUser && styles.currentUserMessage
          ]}>
            🎂 Wishing {item.emp_name} a happy {item.age} birthday!
          </Text>
          <Text style={styles.birthdayDate}>
            Birthday: {moment(item.birth).format('DD MMMM YYYY')}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#f8f9fa" barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2196F3']}
            tintColor="#2196F3"
          />
        }
      >
        {/* Quote of the Day */}
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteTitle}>Quote of the Day</Text>
          <Text style={styles.quoteText}>"{quote}"</Text>
        </View>

        {/* Applications Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Applications</Text>

          {/* First Row: Attendance | Leave | Salary Slip */}
          <View style={styles.applicationsContainer}>
            <TouchableOpacity
              style={[styles.applicationCard, { backgroundColor: '#E6E6FA' }]}
              onPress={() => navigation.navigate('Attendance', { sid, employeeData, erpUrl })}
              activeOpacity={0.7}
            >
              <Ionicons name="time-outline" size={26} color="#4CAF50" />
              <Text style={styles.applicationText}>Attendance</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.applicationCard, { backgroundColor: '#E3F2FD' }]}
              onPress={() => navigation.navigate('LeaveRequest', { sid, employeeData, erpUrl })}
              activeOpacity={0.7}
            >
              <Ionicons name="document-text-outline" size={26} color="#2196F3" />
              <Text style={styles.applicationText}>Leave</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.applicationCard, { backgroundColor: '#F8F4E8' }]}
              onPress={() => navigation.navigate('SalarySlip', { sid, employeeData, erpUrl })}
              activeOpacity={0.7}
            >
              <Ionicons name="cash-outline" size={26} color="#9C27B0" />
              <Text style={styles.applicationText}>Salary Slip</Text>
            </TouchableOpacity>
          </View>

          {/* Second Row: Outdoor | Timesheet */}
          <View style={styles.applicationsContainer}>
            <TouchableOpacity
              style={[styles.applicationCard, { backgroundColor: '#FFDAB9' }]}
              onPress={() => navigation.navigate('OD', { sid, employeeData, erpUrl })}
              activeOpacity={0.7}
            >
              <Ionicons name="briefcase-outline" size={26} color="#FF9800" />
              <Text style={styles.applicationText}>OutDoor</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.applicationCard, { backgroundColor: '#EEEEEE' }]}
              onPress={() => navigation.navigate('Timesheet', { sid, employeeData, erpUrl })}
              activeOpacity={0.7}
            >
              <Ionicons name="clipboard-outline" size={26} color="#03A9F4" />
              <Text style={styles.applicationText}>Timesheet</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.applicationCard, { backgroundColor: '#ffe4e1' }]}
              onPress={() => navigation.navigate('AttendanceRe', { sid, employeeData, erpUrl })}
              activeOpacity={0.7}
            >
              <Ionicons name="briefcase-outline" size={26} color="#FF9800" />
              <Text style={styles.applicationText}>Att. Request</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* View Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>View</Text>
          <View style={styles.applicationsContainer}>
            <TouchableOpacity
              style={[styles.applicationCard, { backgroundColor: '#FFF8E1' }]}
              onPress={() => navigation.navigate('AttendanceListScreen', { sid, employeeData, erpUrl })}
              activeOpacity={0.7}
            >
              <Image
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3594/3594465.png' }}
                style={{ width: 30, height: 30, tintColor: '#3F51B5' }}
              />
              <Text style={styles.applicationText}>Att. History</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.applicationCard, { backgroundColor: '#E8F5E8' }]}
              onPress={() => navigation.navigate('SiteSurveyList', { sid, employeeData, erpUrl })}
              activeOpacity={0.7}
            >
             

              <Image
                 source={{ uri: 'https://cdn-icons-png.flaticon.com/512/684/684908.png' }}
                 style={{ width: 30, height: 30, tintColor: '#43b53fff' }}
               />
              <Text style={styles.applicationText}>Site Survey</Text>
            </TouchableOpacity>

            {/* Empty third slot to maintain spacing */}
           {/* <View style={[styles.applicationCard, { backgroundColor: 'transparent', elevation: 0 }]} />*/}


            <TouchableOpacity
              style={[styles.applicationCard, { backgroundColor: '#E8F5E8' }]}
              onPress={() => navigation.navigate('OTFORM', { sid, employeeData, erpUrl })}
              activeOpacity={0.7}
            >
             

              <Image
                 //source={{ uri: 'https://cdn-icons-png.flaticon.com/512/684/684908.png' }}
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2910/2910768.png' }}
                 style={{ width: 30, height: 30, tintColor: '#FF9800' }}
               />
              <Text style={styles.applicationText}>OT</Text>
            </TouchableOpacity>


          </View>
        </View>

        {/* Calendar */}
        <View style={styles.calendarContainer}>
          <Text style={styles.calendarTitle}>Attendance Calendar</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#000" />
          ) : (
            <>
              <Calendar
                markedDates={markedDates}
                markingType="custom"
                style={styles.calendar}
                theme={{
                  calendarBackground: '#FFFFFF',
                  textSectionTitleColor: '#000',
                  selectedDayBackgroundColor: '#00adf5',
                  selectedDayTextColor: '#FFFFFF',
                  todayTextColor: '#F44336',
                  dayTextColor: '#000',
                  textDisabledColor: '#d9d9d9',
                  dotColor: '#00adf5',
                  selectedDotColor: '#FFFFFF',
                  arrowColor: '#2196F3',
                  monthTextColor: '#000',
                  textMonthFontWeight: 'bold',
                  textDayFontSize: 14,
                  textMonthFontSize: 16,
                  textDayHeaderFontSize: 14,
                  'stylesheet.calendar.header': {
                    week: {
                      marginTop: 5,
                      flexDirection: 'row',
                      justifyContent: 'space-between'
                    }
                  }
                }}
                dayComponent={CustomDayComponent}
              />
              {renderStatusLegend()}
            </>
          )}
        </View>

        {/* Work Anniversaries Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Today's Work Anniversaries</Text>
          {loading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : anniversaryList.length > 0 ? (
            <FlatList
              data={anniversaryList}
              renderItem={renderAnniversaryItem}
              keyExtractor={(item, index) => `anniversary-${index}`}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.noAnniversaries}>No work anniversaries today</Text>
          )}
        </View>

        {/* Birthdays Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Today's Birthdays</Text>
          {loading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : birthdayList.length > 0 ? (
            <FlatList
              data={birthdayList}
              renderItem={renderBirthdayItem}
              keyExtractor={item => item.name}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.noAnniversaries}>No birthdays today</Text>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#E6F4F1' },
  scrollContainer: { padding: 20, paddingBottom: 40 },
  quoteContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#ffc107',
    marginBottom: 20,
    elevation: 2,
  },
  quoteTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#856404' },
  quoteText: { fontSize: 14, fontStyle: 'italic', color: '#856404', marginBottom: 5 },
  calendarContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginBottom: 20,
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center'
  },
  calendar: {
    borderRadius: 10,
    marginBottom: 15
  },
  sectionContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  applicationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  applicationCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    // Responsive width, about 30% minus margin for spacing, with minimum and maximum widths
    width: '30%',
    minWidth: 90,        // Minimum for small devices
    maxWidth: 120,       // Maximum for larger screens to keep similar look
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    marginVertical: 10,
    // Adding a fixed aspect ratio for height proportionality
    aspectRatio: 1,
  },
  applicationText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 10,
    paddingHorizontal: 5
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    marginHorizontal: 5
  },
  legendColor: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginRight: 5
  },
  legendText: {
    fontSize: 12,
    color: '#333'
  },
  dayContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dayText: {
    fontSize: 14,
    color: '#000'
  },
  disabledText: {
    color: '#d9d9d9'
  },
  todayContainer: {
    borderWidth: 1,
    borderColor: '#F44336',
    borderRadius: 12
  },
  todayText: {
    color: '#F44336',
    fontWeight: 'bold'
  },
  anniversaryCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF8F5',
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#FF5722',
  },
  currentUserAnniversaryCard: {
    backgroundColor: '#F0FFF0',
    borderLeftColor: '#4CAF50',
  },
  anniversaryTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  anniversaryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  departmentText: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'normal',
  },
  anniversaryMessage: {
    fontSize: 14,
    color: '#FF5722',
    marginTop: 2,
  },
  currentUserMessage: {
    color: '#4CAF50',
  },
  anniversaryDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  birthdayCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF0F5',
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#E91E63',
  },
  currentUserBirthdayCard: {
    backgroundColor: '#F0FFF0',
    borderLeftColor: '#4CAF50',
  },
  birthdayTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  birthdayName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  birthdayMessage: {
    fontSize: 14,
    color: '#E91E63',
    marginTop: 2,
  },
  birthdayDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  noAnniversaries: {
    textAlign: 'center',
    color: '#666',
    paddingVertical: 10,
  },
});

export default HomeScreen;