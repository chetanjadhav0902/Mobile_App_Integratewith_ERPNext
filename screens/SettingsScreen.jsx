

// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import RNFS from 'react-native-fs';
// import { useNavigation } from '@react-navigation/native';
// import NetInfo from '@react-native-community/netinfo';
// import DateTimePicker from '@react-native-community/datetimepicker';

// const ReportsScreen = ({ route }) => {
//   const { sid } = route.params || {};
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [isConnected, setIsConnected] = useState(true);
//   const [employeeDetails, setEmployeeDetails] = useState({ id: '', name: '' });
//   const [showFromDatePicker, setShowFromDatePicker] = useState(false);
//   const [showToDatePicker, setShowToDatePicker] = useState(false);
//   const [fromDate, setFromDate] = useState(new Date());
//   const [toDate, setToDate] = useState(new Date());
//   const navigation = useNavigation();

//   // Set initial dates (current month)
//   useEffect(() => {
//     const today = new Date();
//     const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
//     setFromDate(firstDayOfMonth);
//     setToDate(today);
//   }, []);

//   useEffect(() => {
//     const unsubscribe = NetInfo.addEventListener(state => {
//       setIsConnected(state.isConnected);
//     });

//     navigation.setOptions({
//       headerStyle: { backgroundColor: '#f8f9fa' },
//       headerTintColor: '#000',
//       tabBarStyle: { backgroundColor: '#fff' },
//       tabBarActiveTintColor: '#2196F3',
//     });

//     return () => unsubscribe();
//   }, [navigation]);

//   const fetchEmployeeDetails = async () => {
//     try {
//       const userRes = await fetch(
//         'https://erpnextcloud.cbditsolutions.com/api/method/frappe.auth.get_logged_user',
//         { headers: { Cookie: `sid=${sid}` } }
//       );
//       const username = (await userRes.json()).message;

//       const empUrl = `https://erpnextcloud.cbditsolutions.com/api/resource/Employee?fields=["name","employee_name"]&filters=[["user_id","=","${username}"]]`;
//       const empRes = await fetch(empUrl, { headers: { Cookie: `sid=${sid}` } });
//       const empData = (await empRes.json()).data[0];
      
//       return {
//         id: empData.name,
//         name: empData.employee_name
//       };
//     } catch (err) {
//       console.error('Error fetching employee details:', err);
//       throw new Error('Failed to fetch employee details');
//     }
//   };

//   const fetchAttendanceData = async () => {
//     if (!isConnected) {
//       setError('No internet connection');
//       return [];
//     }

//     try {
//       setLoading(true);
//       setError(null);
      
//       const empDetails = await fetchEmployeeDetails();
//       setEmployeeDetails(empDetails);

//       // Format dates for API filter
//       const fromDateStr = fromDate.toISOString().split('T')[0];
//       const toDateStr = toDate.toISOString().split('T')[0];

//       const checkinUrl = `https://erpnextcloud.cbditsolutions.com/api/resource/Employee Checkin?fields=["time","log_type"]&filters=[["employee","=","${empDetails.id}"],["time",">=","${fromDateStr}"],["time","<=","${toDateStr} 23:59:59"]]&order_by=time desc&limit_page_length=0`;
//       const checkinRes = await fetch(checkinUrl, { headers: { Cookie: `sid=${sid}` } });
//       const checkinData = (await checkinRes.json()).data || [];
      
//       return checkinData.map(item => ({
//         ...item,
//         employee_id: empDetails.id,
//         employee_name: empDetails.name
//       }));
      
//     } catch (err) {
//       setError(err.message);
//       return [];
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (dateTimeStr) => {
//     if (!dateTimeStr) return '--';
//     try {
//       const [datePart] = dateTimeStr.split(' ');
//       const [year, month, day] = datePart.split('-');
//       return `${day}-${month}-${year}`;
//     } catch {
//       return '--';
//     }
//   };

//   const formatTime = (dateTimeStr) => {
//     if (!dateTimeStr) return '--';
//     try {
//       const [datePart, timePart] = dateTimeStr.split(' ');
//       const [hours, minutes] = timePart.split(':');
//       const hour12 = parseInt(hours) % 12 || 12;
//       const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
//       return `${hour12}:${minutes} ${ampm}`;
//     } catch {
//       return '--';
//     }
//   };

//   const formatDisplayDate = (date) => {
//     return date.toLocaleDateString('en-GB', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     });
//   };

//   const handleFromDateChange = (event, selectedDate) => {
//     setShowFromDatePicker(false);
//     if (selectedDate) {
//       setFromDate(selectedDate);
//     }
//   };

//   const handleToDateChange = (event, selectedDate) => {
//     setShowToDatePicker(false);
//     if (selectedDate) {
//       setToDate(selectedDate);
//     }
//   };

//   const generateExcel = async () => {
//     if (!isConnected) {
//       Alert.alert('No Internet', 'Please connect to the internet to download reports');
//       return;
//     }

//     // Validate date range
//     if (fromDate > toDate) {
//       Alert.alert('Invalid Date Range', 'From date cannot be after To date');
//       return;
//     }

//     try {
//       const data = await fetchAttendanceData();
//       if (data.length === 0) {
//         Alert.alert('No Data', 'No attendance records found for selected date range');
//         return;
//       }

//       // Create CSV content with headers
//       let csvContent = 'Date,Time,Type,Employee ID,Employee Name\n';

//       data.forEach(item => {
//         csvContent += `${formatDate(item.time)},${formatTime(item.time)},${item.log_type},${item.employee_id},${item.employee_name}\n`;
//       });

//       // File name
//       const fromDateStr = formatDisplayDate(fromDate).replace(/\//g, '-');
//       const toDateStr = formatDisplayDate(toDate).replace(/\//g, '-');
//       const fileName = `Attendance_Report_${fromDateStr}_to_${toDateStr}.csv`;

//       let filePath = '';
//       if (Platform.OS === 'android') {
//         // For Android 10+ (API 29+), we can use Download directory without permission
//         filePath = `${RNFS.DownloadDirectoryPath}/${fileName}`;
//       } else {
//         // For iOS, use Document directory
//         filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
//       }

//       await RNFS.writeFile(filePath, csvContent, 'utf8');

//       if (Platform.OS === 'android') {
//         // Make the file visible in Downloads app
//         await RNFS.scanFile(filePath);
        
//         Alert.alert(
//           'Report Downloaded',
//           'File saved to your Downloads folder',
//           [{ text: 'OK' }]
//         );
//       } else {
//         // For iOS, you might want to implement file sharing here
//         Alert.alert(
//           'Report Downloaded',
//           `File saved to app's Documents directory: ${filePath}`,
//           [{ text: 'OK' }]
//         );
//       }

//     } catch (err) {
//       console.error('Report generation error:', err);
//       Alert.alert('Error', `Failed to generate report. ${err.message || ''}`);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.dateRangeContainer}>
//         <Text style={styles.title}>Attendance Reports</Text>

//         <Text style={styles.dateRangeLabel}>Select Date Range:</Text>
        
//         <View style={styles.datePickerRow}>
//           <TouchableOpacity 
//             style={styles.datePickerButton}
//             onPress={() => setShowFromDatePicker(true)}
//           >
//             <Text style={styles.datePickerText}>From: {formatDisplayDate(fromDate)}</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             style={styles.datePickerButton}
//             onPress={() => setShowToDatePicker(true)}
//           >
//             <Text style={styles.datePickerText}>To: {formatDisplayDate(toDate)}</Text>
//           </TouchableOpacity>
//         </View>

//         {showFromDatePicker && (
//           <DateTimePicker
//             value={fromDate}
//             mode="date"
//             display="default"
//             onChange={handleFromDateChange}
//             maximumDate={new Date()}
//           />
//         )}

//         {showToDatePicker && (
//           <DateTimePicker
//             value={toDate}
//             mode="date"
//             display="default"
//             onChange={handleToDateChange}
//             maximumDate={new Date()}
//             minimumDate={fromDate}
//           />
//         )}
      
//         {!isConnected && (
//           <Text style={styles.connectionError}>No internet connection. Please connect to download reports.</Text>
//         )}

//         {loading ? (
//           <ActivityIndicator size="large" color="#2196F3" style={styles.loader} />
//         ) : (
//           <TouchableOpacity 
//             style={[styles.button, !isConnected && styles.disabledButton]} 
//             onPress={generateExcel}
//             disabled={!isConnected}
//           >
//             <Text style={styles.buttonText}>Download Excel Report</Text>
//             <Ionicons name="download-outline" size={20} color="white" />
//           </TouchableOpacity>
//         )}

//         {error && <Text style={styles.error}>{error}</Text>}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#2196F3',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   dateRangeContainer: {
//     width: '100%',
//     padding: 15,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   dateRangeLabel: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 10,
//     color: '#333',
//   },
//   datePickerRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   datePickerButton: {
//     flex: 1,
//     marginHorizontal: 5,
//     padding: 10,
//     backgroundColor: '#f0f0f0',
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   datePickerText: {
//     color: '#333',
//   },
//   button: {
//     flexDirection: 'row',
//     backgroundColor: '#2196F3',
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 6,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 20,
//   },
//   disabledButton: {
//     backgroundColor: '#cccccc',
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//     marginRight: 10,
//   },
//   loader: {
//     marginTop: 30,
//   },
//   error: {
//     color: 'red',
//     marginTop: 20,
//     textAlign: 'center',
//   },
//   connectionError: {
//     color: 'red',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
// });

// export default ReportsScreen;





// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import RNFS from 'react-native-fs';
// import { useNavigation } from '@react-navigation/native';
// import NetInfo from '@react-native-community/netinfo';
// import DateTimePicker from '@react-native-community/datetimepicker';

// const ReportsScreen = ({ route }) => {
//   const { sid,erpUrl } = route.params || {};
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [isConnected, setIsConnected] = useState(true);
//   const [employeeDetails, setEmployeeDetails] = useState({ id: '', name: '' });
//   const [showFromDatePicker, setShowFromDatePicker] = useState(false);
//   const [showToDatePicker, setShowToDatePicker] = useState(false);
//   const [fromDate, setFromDate] = useState(new Date());
//   const [toDate, setToDate] = useState(new Date());
//   const navigation = useNavigation();
//   const baseUrl=erpUrl;

//   // Set initial dates (current month)
//   useEffect(() => {
//     const today = new Date();
//     const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
//     setFromDate(firstDayOfMonth);
//     setToDate(today);
//   }, []);

//   useEffect(() => {
//     const unsubscribe = NetInfo.addEventListener(state => {
//       setIsConnected(state.isConnected);
//     });

//     navigation.setOptions({
//       headerStyle: { backgroundColor: '#f8f9fa' },
//       headerTintColor: '#000',
//       tabBarStyle: { backgroundColor: '#fff' },
//       tabBarActiveTintColor: '#2196F3',
//     });

//     return () => unsubscribe();
//   }, [navigation]);

//   const fetchEmployeeDetails = async () => {
//     try {
//       const userRes = await fetch(
//          `${baseUrl}/api/method/frappe.auth.get_logged_user`,
//         //'https://mpda.in/api/method/frappe.auth.get_logged_user',
//         { headers: { Cookie: `sid=${sid}` } }
//       );
//       const username = (await userRes.json()).message;

//        const empUrl = `${baseUrl}/api/resource/Employee?fields=["name","employee_name"]&filters=[["user_id","=","${username}"]]`;
//       //const empUrl = `https://mpda.in/api/resource/Employee?fields=["name","employee_name"]&filters=[["user_id","=","${username}"]]`;
//       const empRes = await fetch(empUrl, { headers: { Cookie: `sid=${sid}` } });
//       const empData = (await empRes.json()).data[0];
      
//       return {
//         id: empData.name,
//         name: empData.employee_name
//       };
//     } catch (err) {
//       console.error('Error fetching employee details:', err);
//       throw new Error('Failed to fetch employee details');
//     }
//   };

//   const fetchAttendanceData = async () => {
//     if (!isConnected) {
//       setError('No internet connection');
//       return [];
//     }

//     try {
//       setLoading(true);
//       setError(null);
      
//       const empDetails = await fetchEmployeeDetails();
//       setEmployeeDetails(empDetails);

//       // Format dates for API filter
//       const fromDateStr = fromDate.toISOString().split('T')[0];
//       const toDateStr = toDate.toISOString().split('T')[0];

//       const checkinUrl = `${baseUrl}/api/resource/Employee Checkin?fields=["time","log_type"]&filters=[["employee","=","${empDetails.id}"],["time",">=","${fromDateStr}"],["time","<=","${toDateStr} 23:59:59"]]&order_by=time desc&limit_page_length=0`;
//       //const checkinUrl = `https://mpda.in/api/resource/Employee Checkin?fields=["time","log_type"]&filters=[["employee","=","${empDetails.id}"],["time",">=","${fromDateStr}"],["time","<=","${toDateStr} 23:59:59"]]&order_by=time desc&limit_page_length=0`;
//       const checkinRes = await fetch(checkinUrl, { headers: { Cookie: `sid=${sid}` } });
//       const checkinData = (await checkinRes.json()).data || [];
      
//       return checkinData.map(item => ({
//         ...item,
//         employee_id: empDetails.id,
//         employee_name: empDetails.name
//       }));
      
//     } catch (err) {
//       setError(err.message);
//       return [];
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (dateTimeStr) => {
//     if (!dateTimeStr) return '--';
//     try {
//       const [datePart] = dateTimeStr.split(' ');
//       const [year, month, day] = datePart.split('-');
//       return `${day}-${month}-${year}`;
//     } catch {
//       return '--';
//     }
//   };

//   const formatTime = (dateTimeStr) => {
//     if (!dateTimeStr) return '--';
//     try {
//       const [datePart, timePart] = dateTimeStr.split(' ');
//       const [hours, minutes] = timePart.split(':');
//       const hour12 = parseInt(hours) % 12 || 12;
//       const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
//       return `${hour12}:${minutes} ${ampm}`;
//     } catch {
//       return '--';
//     }
//   };

//   const formatDisplayDate = (date) => {
//     return date.toLocaleDateString('en-GB', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     });
//   };

//   const handleFromDateChange = (event, selectedDate) => {
//     setShowFromDatePicker(false);
//     if (selectedDate) {
//       setFromDate(selectedDate);
//     }
//   };

//   const handleToDateChange = (event, selectedDate) => {
//     setShowToDatePicker(false);
//     if (selectedDate) {
//       setToDate(selectedDate);
//     }
//   };

//   const generateExcel = async () => {
//     if (!isConnected) {
//       Alert.alert('No Internet', 'Please connect to the internet to download reports');
//       return;
//     }

//     // Validate date range
//     if (fromDate > toDate) {
//       Alert.alert('Invalid Date Range', 'From date cannot be after To date');
//       return;
//     }

//     try {
//       const data = await fetchAttendanceData();
//       if (data.length === 0) {
//         Alert.alert('No Data', 'No attendance records found for selected date range');
//         return;
//       }

//       // Create CSV content with headers
//       let csvContent = 'Date,Time,Type,Employee ID,Employee Name\n';

//       data.forEach(item => {
//         csvContent += `${formatDate(item.time)},${formatTime(item.time)},${item.log_type},${item.employee_id},${item.employee_name}\n`;
//       });

//       // Generate unique filename with timestamp
//       const timestamp = new Date().getTime();
//       const fromDateStr = formatDisplayDate(fromDate).replace(/\//g, '-');
//       const toDateStr = formatDisplayDate(toDate).replace(/\//g, '-');
//       const fileName = `Attendance_Report_${fromDateStr}_to_${toDateStr}_${timestamp}.csv`;

//       let filePath = '';
//       if (Platform.OS === 'android') {
//         // For Android 10+ (API 29+), we can use Download directory without permission
//         filePath = `${RNFS.DownloadDirectoryPath}/${fileName}`;
//       } else {
//         // For iOS, use Document directory
//         filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
//       }

//       await RNFS.writeFile(filePath, csvContent, 'utf8');

//       if (Platform.OS === 'android') {
//         // Make the file visible in Downloads app
//         await RNFS.scanFile(filePath);
        
//         Alert.alert(
//           'Report Downloaded',
//           'File saved to your Downloads folder',
//           [{ text: 'OK' }]
//         );
//       } else {
//         // For iOS, you might want to implement file sharing here
//         Alert.alert(
//           'Report Downloaded',
//           `File saved to app's Documents directory: ${filePath}`,
//           [{ text: 'OK' }]
//         );
//       }

//     } catch (err) {
//       console.error('Report generation error:', err);
//       Alert.alert('Error', `Failed to generate report. ${err.message || ''}`);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.dateRangeContainer}>
//         <Text style={styles.title}>Attendance Reports</Text>

//         <Text style={styles.dateRangeLabel}>Select Date Range:</Text>
        
//         <View style={styles.datePickerRow}>
//           <TouchableOpacity 
//             style={styles.datePickerButton}
//             onPress={() => setShowFromDatePicker(true)}
//           >
//             <Text style={styles.datePickerText}>From: {formatDisplayDate(fromDate)}</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             style={styles.datePickerButton}
//             onPress={() => setShowToDatePicker(true)}
//           >
//             <Text style={styles.datePickerText}>To: {formatDisplayDate(toDate)}</Text>
//           </TouchableOpacity>
//         </View>

//         {showFromDatePicker && (
//           <DateTimePicker
//             value={fromDate}
//             mode="date"
//             display="default"
//             onChange={handleFromDateChange}
//             maximumDate={new Date()}
//           />
//         )}

//         {showToDatePicker && (
//           <DateTimePicker
//             value={toDate}
//             mode="date"
//             display="default"
//             onChange={handleToDateChange}
//             maximumDate={new Date()}
//             minimumDate={fromDate}
//           />
//         )}
      
//         {!isConnected && (
//           <Text style={styles.connectionError}>No internet connection. Please connect to download reports.</Text>
//         )}

//         {loading ? (
//           <ActivityIndicator size="large" color="#2196F3" style={styles.loader} />
//         ) : (
//           <TouchableOpacity 
//             style={[styles.button, !isConnected && styles.disabledButton]} 
//             onPress={generateExcel}
//             disabled={!isConnected}
//           >
//             <Text style={styles.buttonText}>Download Excel Report</Text>
//             <Ionicons name="download-outline" size={20} color="white" />
//           </TouchableOpacity>
//         )}

//         {error && <Text style={styles.error}>{error}</Text>}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#2196F3',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   dateRangeContainer: {
//     width: '100%',
//     padding: 15,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   dateRangeLabel: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 10,
//     color: '#333',
//   },
//   datePickerRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   datePickerButton: {
//     flex: 1,
//     marginHorizontal: 5,
//     padding: 10,
//     backgroundColor: '#f0f0f0',
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   datePickerText: {
//     color: '#333',
//   },
//   button: {
//     flexDirection: 'row',
//     backgroundColor: '#2196F3',
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 6,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 20,
//   },
//   disabledButton: {
//     backgroundColor: '#cccccc',
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//     marginRight: 10,
//   },
//   loader: {
//     marginTop: 30,
//   },
//   error: {
//     color: 'red',
//     marginTop: 20,
//     textAlign: 'center',
//   },
//   connectionError: {
//     color: 'red',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
// });

// export default ReportsScreen;



// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Platform, PermissionsAndroid } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import RNFS from 'react-native-fs';
// import { useNavigation } from '@react-navigation/native';
// import NetInfo from '@react-native-community/netinfo';
// import DateTimePicker from '@react-native-community/datetimepicker';

// const ReportsScreen = ({ route }) => {
//   const { sid, erpUrl } = route.params || {};
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [isConnected, setIsConnected] = useState(true);
//   const [employeeDetails, setEmployeeDetails] = useState({ id: '', name: '' });
//   const [showFromDatePicker, setShowFromDatePicker] = useState(false);
//   const [showToDatePicker, setShowToDatePicker] = useState(false);
//   const [fromDate, setFromDate] = useState(new Date());
//   const [toDate, setToDate] = useState(new Date());
//   const navigation = useNavigation();
//   const baseUrl = erpUrl;

//   useEffect(() => {
//     const today = new Date();
//     const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
//     setFromDate(firstDayOfMonth);
//     setToDate(today);
//   }, []);

//   useEffect(() => {
//     const unsubscribe = NetInfo.addEventListener(state => {
//       setIsConnected(state.isConnected);
//     });

//     navigation.setOptions({
//       headerStyle: { backgroundColor: '#f8f9fa' },
//       headerTintColor: '#000',
//       tabBarStyle: { backgroundColor: '#fff' },
//       tabBarActiveTintColor: '#2196F3',
//     });

//     return () => unsubscribe();
//   }, [navigation]);

//   const requestStoragePermission = async () => {
//     if (Platform.OS === 'android') {
//       if (Platform.Version >= 30) {
//         // Android 11+ doesn't need WRITE_EXTERNAL_STORAGE for Downloads
//         return true;
//       }
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//           {
//             title: "Storage Permission",
//             message: "App needs access to storage to save reports",
//             buttonPositive: "OK"
//           }
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch (err) {
//         console.warn(err);
//         return false;
//       }
//     }
//     return true;
//   };

//   const fetchEmployeeDetails = async () => {
//     try {
//       const userRes = await fetch(
//         `${baseUrl}/api/method/frappe.auth.get_logged_user`,
//         { headers: { Cookie: `sid=${sid}` } }
//       );
//       const username = (await userRes.json()).message;

//       const empUrl = `${baseUrl}/api/resource/Employee?fields=["name","employee_name"]&filters=[["user_id","=","${username}"]]`;
//       const empRes = await fetch(empUrl, { headers: { Cookie: `sid=${sid}` } });
//       const empData = (await empRes.json()).data[0];
      
//       return {
//         id: empData.name,
//         name: empData.employee_name
//       };
//     } catch (err) {
//       console.error('Error fetching employee details:', err);
//       throw new Error('Failed to fetch employee details');
//     }
//   };

//   const fetchAttendanceData = async () => {
//     if (!isConnected) {
//       setError('No internet connection');
//       return [];
//     }

//     try {
//       setLoading(true);
//       setError(null);
      
//       const empDetails = await fetchEmployeeDetails();
//       setEmployeeDetails(empDetails);

//       const fromDateStr = fromDate.toISOString().split('T')[0];
//       const toDateStr = toDate.toISOString().split('T')[0];

//       const checkinUrl = `${baseUrl}/api/resource/Employee Checkin?fields=["time","log_type"]&filters=[["employee","=","${empDetails.id}"],["time",">=","${fromDateStr}"],["time","<=","${toDateStr} 23:59:59"]]&order_by=time desc&limit_page_length=0`;
//       const checkinRes = await fetch(checkinUrl, { headers: { Cookie: `sid=${sid}` } });
//       const checkinData = (await checkinRes.json()).data || [];
      
//       return checkinData.map(item => ({
//         ...item,
//         employee_id: empDetails.id,
//         employee_name: empDetails.name
//       }));
      
//     } catch (err) {
//       setError(err.message);
//       return [];
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (dateTimeStr) => {
//     if (!dateTimeStr) return '--';
//     try {
//       const [datePart] = dateTimeStr.split(' ');
//       const [year, month, day] = datePart.split('-');
//       return `${day}-${month}-${year}`;
//     } catch {
//       return '--';
//     }
//   };

//   const formatTime = (dateTimeStr) => {
//     if (!dateTimeStr) return '--';
//     try {
//       const [datePart, timePart] = dateTimeStr.split(' ');
//       const [hours, minutes] = timePart.split(':');
//       const hour12 = parseInt(hours) % 12 || 12;
//       const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
//       return `${hour12}:${minutes} ${ampm}`;
//     } catch {
//       return '--';
//     }
//   };

//   const formatDisplayDate = (date) => {
//     return date.toLocaleDateString('en-GB', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     });
//   };

//   const handleFromDateChange = (event, selectedDate) => {
//     setShowFromDatePicker(false);
//     if (selectedDate) {
//       setFromDate(selectedDate);
//     }
//   };

//   const handleToDateChange = (event, selectedDate) => {
//     setShowToDatePicker(false);
//     if (selectedDate) {
//       setToDate(selectedDate);
//     }
//   };

//   const generateExcel = async () => {
//     if (!isConnected) {
//       Alert.alert('No Internet', 'Please connect to the internet to download reports');
//       return;
//     }

//     if (fromDate > toDate) {
//       Alert.alert('Invalid Date Range', 'From date cannot be after To date');
//       return;
//     }

//     try {
//       const hasPermission = await requestStoragePermission();
//       if (!hasPermission) {
//         Alert.alert('Permission Denied', 'Cannot save report without storage permission');
//         return;
//       }

//       const data = await fetchAttendanceData();
//       if (data.length === 0) {
//         Alert.alert('No Data', 'No attendance records found for selected date range');
//         return;
//       }

//       let csvContent = 'Date,Time,Type,Employee ID,Employee Name\n';
//       data.forEach(item => {
//         csvContent += `${formatDate(item.time)},${formatTime(item.time)},${item.log_type},${item.employee_id},${item.employee_name}\n`;
//       });

//       const timestamp = new Date().getTime();
//       const fromDateStr = formatDisplayDate(fromDate).replace(/\//g, '-');
//       const toDateStr = formatDisplayDate(toDate).replace(/\//g, '-');
//       const fileName = `Attendance_Report_${fromDateStr}_to_${toDateStr}_${timestamp}.csv`;
//       const folderName = 'CompanyReports'; // Your custom folder name inside Downloads

//       let filePath;
//       if (Platform.OS === 'android') {
//         const downloadsPath = `${RNFS.DownloadDirectoryPath}/${folderName}`;
        
//         // Create directory if it doesn't exist
//         await RNFS.mkdir(downloadsPath).catch(() => {});
        
//         filePath = `${downloadsPath}/${fileName}`;
//       } else {
//         // For iOS
//         filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
//       }

//       await RNFS.writeFile(filePath, csvContent, 'utf8');

//       if (Platform.OS === 'android') {
//         // Make the file visible in Downloads app
//         await RNFS.scanFile(filePath);
//       }

//       Alert.alert(
//         'Report Saved Successfully',
//         `File saved to: ${folderName} folder in Downloads`,
//         [
//           { text: 'OK' }
//         ]
//       );

//     } catch (err) {
//       console.error('Report generation error:', err);
//       Alert.alert('Error', `Failed to generate report. ${err.message || ''}`);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.dateRangeContainer}>
//         <Text style={styles.title}>Attendance Reports</Text>

//         <Text style={styles.dateRangeLabel}>Select Date Range:</Text>
        
//         <View style={styles.datePickerRow}>
//           <TouchableOpacity 
//             style={styles.datePickerButton}
//             onPress={() => setShowFromDatePicker(true)}
//           >
//             <Text style={styles.datePickerText}>From: {formatDisplayDate(fromDate)}</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             style={styles.datePickerButton}
//             onPress={() => setShowToDatePicker(true)}
//           >
//             <Text style={styles.datePickerText}>To: {formatDisplayDate(toDate)}</Text>
//           </TouchableOpacity>
//         </View>

//         {showFromDatePicker && (
//           <DateTimePicker
//             value={fromDate}
//             mode="date"
//             display="default"
//             onChange={handleFromDateChange}
//             maximumDate={new Date()}
//           />
//         )}

//         {showToDatePicker && (
//           <DateTimePicker
//             value={toDate}
//             mode="date"
//             display="default"
//             onChange={handleToDateChange}
//             maximumDate={new Date()}
//             minimumDate={fromDate}
//           />
//         )}
      
//         {!isConnected && (
//           <Text style={styles.connectionError}>No internet connection. Please connect to download reports.</Text>
//         )}

//         {loading ? (
//           <ActivityIndicator size="large" color="#2196F3" style={styles.loader} />
//         ) : (
//           <TouchableOpacity 
//             style={[styles.button, !isConnected && styles.disabledButton]} 
//             onPress={generateExcel}
//             disabled={!isConnected}
//           >
//             <Text style={styles.buttonText}>Download Excel Report</Text>
//             <Ionicons name="download-outline" size={20} color="white" />
//           </TouchableOpacity>
//         )}

//         {error && <Text style={styles.error}>{error}</Text>}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//     padding: 10,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#2196F3',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   dateRangeContainer: {
//     width: '100%',
//     padding: 15,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   dateRangeLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     marginBottom: 10,
//     color: '#333',
//   },
//   datePickerRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   datePickerButton: {
//     flex: 1,
//     marginHorizontal: 5,
//     padding: 10,
//     backgroundColor: '#f0f0f0',
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   datePickerText: {
//     color: '#333',
//   },
//   button: {
//     flexDirection: 'row',
//     backgroundColor: '#2196F3',
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 6,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 20,
//   },
//   disabledButton: {
//     backgroundColor: '#cccccc',
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//     marginRight: 10,
//   },
//   loader: {
//     marginTop: 30,
//   },
//   error: {
//     color: 'red',
//     marginTop: 20,
//     textAlign: 'center',
//   },
//   connectionError: {
//     color: 'red',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
// });

// export default ReportsScreen;


import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Platform, PermissionsAndroid } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RNFS from 'react-native-fs';
import { useNavigation } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import DateTimePicker from '@react-native-community/datetimepicker';

const ReportsScreen = ({ route }) => {
  const { sid, erpUrl } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const [employeeDetails, setEmployeeDetails] = useState({ id: '', name: '' });
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const navigation = useNavigation();
  const baseUrl = erpUrl;

  useEffect(() => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    setFromDate(firstDayOfMonth);
    setToDate(today);
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    navigation.setOptions({
      headerStyle: { backgroundColor: '#f8f9fa' },
      headerTintColor: '#000',
      tabBarStyle: { backgroundColor: '#fff' },
      tabBarActiveTintColor: '#2196F3',
    });

    return () => unsubscribe();
  }, [navigation]);

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 30) {
        return true;
      }
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Storage Permission",
            message: "App needs access to storage to save reports",
            buttonPositive: "OK"
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const fetchEmployeeDetails = async () => {
    try {
      const userRes = await fetch(
        `${baseUrl}/api/method/frappe.auth.get_logged_user`,
        { headers: { Cookie: `sid=${sid}` } }
      );
      const username = (await userRes.json()).message;

      const empUrl = `${baseUrl}/api/resource/Employee?fields=["name","employee_name"]&filters=[["user_id","=","${username}"]]`;
      const empRes = await fetch(empUrl, { headers: { Cookie: `sid=${sid}` } });
      const empData = (await empRes.json()).data[0];
      
      return {
        id: empData.name,
        name: empData.employee_name
      };
    } catch (err) {
      console.error('Error fetching employee details:', err);
      throw new Error('Failed to fetch employee details');
    }
  };

  const fetchAttendanceData = async () => {
    if (!isConnected) {
      setError('No internet connection');
      return [];
    }

    try {
      setLoading(true);
      setError(null);
      
      const empDetails = await fetchEmployeeDetails();
      setEmployeeDetails(empDetails);

      const fromDateStr = fromDate.toISOString().split('T')[0];
      const toDateStr = toDate.toISOString().split('T')[0];

      const checkinUrl = `${baseUrl}/api/resource/Employee Checkin?fields=["time","log_type","custom_area_name"]&filters=[["employee","=","${empDetails.id}"],["time",">=","${fromDateStr}"],["time","<=","${toDateStr} 23:59:59"]]&order_by=time desc&limit_page_length=0`;
      const checkinRes = await fetch(checkinUrl, { headers: { Cookie: `sid=${sid}` } });
      const checkinData = (await checkinRes.json()).data || [];
      
      return checkinData.map(item => ({
        ...item,
        employee_id: empDetails.id,
        employee_name: empDetails.name
      }));
      
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateTimeStr) => {
    if (!dateTimeStr) return '--';
    try {
      const [datePart] = dateTimeStr.split(' ');
      const [year, month, day] = datePart.split('-');
      return `${day}-${month}-${year}`;
    } catch {
      return '--';
    }
  };

  const formatTime = (dateTimeStr) => {
    if (!dateTimeStr) return '--';
    try {
      const [datePart, timePart] = dateTimeStr.split(' ');
      const [hours, minutes] = timePart.split(':');
      const hour12 = parseInt(hours) % 12 || 12;
      const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
      return `${hour12}:${minutes} ${ampm}`;
    } catch {
      return '--';
    }
  };

  const formatDisplayDate = (date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleFromDateChange = (event, selectedDate) => {
    setShowFromDatePicker(false);
    if (selectedDate) {
      setFromDate(selectedDate);
    }
  };

  const handleToDateChange = (event, selectedDate) => {
    setShowToDatePicker(false);
    if (selectedDate) {
      setToDate(selectedDate);
    }
  };

  const generateExcel = async () => {
    if (!isConnected) {
      Alert.alert('No Internet', 'Please connect to the internet to download reports');
      return;
    }

    if (fromDate > toDate) {
      Alert.alert('Invalid Date Range', 'From date cannot be after To date');
      return;
    }

    try {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Cannot save report without storage permission');
        return;
      }

      const data = await fetchAttendanceData();
      if (data.length === 0) {
        Alert.alert('No Data', 'No attendance records found for selected date range');
        return;
      }

      let csvContent = 'Date,Time,Type,Area,Employee ID,Employee Name\n';
      data.forEach(item => {
        // Escape commas in area name by wrapping in quotes
        const areaName = item.custom_area_name ? `"${item.custom_area_name.replace(/"/g, '""')}"` : '--';
        csvContent += `${formatDate(item.time)},${formatTime(item.time)},${item.log_type},${areaName},${item.employee_id},${item.employee_name}\n`;
      });

      const timestamp = new Date().getTime();
      const fromDateStr = formatDisplayDate(fromDate).replace(/\//g, '-');
      const toDateStr = formatDisplayDate(toDate).replace(/\//g, '-');
      const fileName = `Attendance_Report_${fromDateStr}_to_${toDateStr}_${timestamp}.csv`;
      const folderName = 'CompanyReports';

      let filePath;
      if (Platform.OS === 'android') {
        const downloadsPath = `${RNFS.DownloadDirectoryPath}/${folderName}`;
        await RNFS.mkdir(downloadsPath).catch(() => {});
        filePath = `${downloadsPath}/${fileName}`;
      } else {
        filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      }

      await RNFS.writeFile(filePath, csvContent, 'utf8');

      if (Platform.OS === 'android') {
        await RNFS.scanFile(filePath);
      }

      Alert.alert(
        'Report Saved Successfully',
        `File saved to: ${folderName} folder in Downloads`,
        [
          { text: 'OK' }
        ]
      );

    } catch (err) {
      console.error('Report generation error:', err);
      Alert.alert('Error', `Failed to generate report. ${err.message || ''}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateRangeContainer}>
        <Text style={styles.title}>Attendance Reports</Text>

        <Text style={styles.dateRangeLabel}>Select Date Range:</Text>
        
        <View style={styles.datePickerRow}>
          <TouchableOpacity 
            style={styles.datePickerButton}
            onPress={() => setShowFromDatePicker(true)}
          >
            <Text style={styles.datePickerText}>From: {formatDisplayDate(fromDate)}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.datePickerButton}
            onPress={() => setShowToDatePicker(true)}
          >
            <Text style={styles.datePickerText}>To: {formatDisplayDate(toDate)}</Text>
          </TouchableOpacity>
        </View>

        {showFromDatePicker && (
          <DateTimePicker
            value={fromDate}
            mode="date"
            display="default"
            onChange={handleFromDateChange}
            maximumDate={new Date()}
          />
        )}

        {showToDatePicker && (
          <DateTimePicker
            value={toDate}
            mode="date"
            display="default"
            onChange={handleToDateChange}
            maximumDate={new Date()}
            minimumDate={fromDate}
          />
        )}
      
        {!isConnected && (
          <Text style={styles.connectionError}>No internet connection. Please connect to download reports.</Text>
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#2196F3" style={styles.loader} />
        ) : (
          <TouchableOpacity 
            style={[styles.button, !isConnected && styles.disabledButton]} 
            onPress={generateExcel}
            disabled={!isConnected}
          >
            <Text style={styles.buttonText}>Download Excel Report</Text>
            <Ionicons name="download-outline" size={20} color="white" />
          </TouchableOpacity>
        )}

        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
    textAlign: 'center',
  },
  dateRangeContainer: {
    width: '100%',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateRangeLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  datePickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  datePickerButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    alignItems: 'center',
  },
  datePickerText: {
    color: '#333',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
  },
  loader: {
    marginTop: 30,
  },
  error: {
    color: 'red',
    marginTop: 20,
    textAlign: 'center',
  },
  connectionError: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ReportsScreen;