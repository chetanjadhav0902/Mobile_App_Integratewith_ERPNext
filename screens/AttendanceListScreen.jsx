
// code correct with date, time in/out , Employee and employee

// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, ActivityIndicator, StyleSheet, Dimensions, TouchableOpacity, ScrollView} from 'react-native';
// import { Picker } from '@react-native-picker/picker';

// const EmployeeCheckinScreen = ({ route }) => {
//   const { sid,erpUrl } = route.params;

//   const [checkinData, setCheckinData] = useState([]);
//   const [groupedData, setGroupedData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [expandedDate, setExpandedDate] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [employeeName, setEmployeeName] = useState('');
//   const [employeeId, setEmployeeId] = useState('');
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Current month
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Current year
 
// // new add
//   const baseUrl=erpUrl;

//   const { width } = Dimensions.get('window');
//   const columnWidths = {
//     date: width * 0.22,
//     time: width * 0.28,
//     employee: width * 0.25,
//     id: width * 0.25
//   };

//   // Generate month options
//   const months = [
//     { label: 'January', value: 1 },
//     { label: 'February', value: 2 },
//     { label: 'March', value: 3 },
//     { label: 'April', value: 4 },
//     { label: 'May', value: 5 },
//     { label: 'June', value: 6 },
//     { label: 'July', value: 7 },
//     { label: 'August', value: 8 },
//     { label: 'September', value: 9 },
//     { label: 'October', value: 10 },
//     { label: 'November', value: 11 },
//     { label: 'December', value: 12 },
//   ];

//   // Generate year options (last 5 years and next 5 years)
//   const currentYear = new Date().getFullYear();
//   const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

//   // Format time as HH:MM AM/PM
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

//   // Format date as DD-MM-YYYY
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

//   // Extract just the date part (YYYY-MM-DD)
//   const getDatePart = (dateTimeStr) => {
//     if (!dateTimeStr) return '';
//     try {
//       return dateTimeStr.split(' ')[0];
//     } catch {
//       return '';
//     }
//   };

//   // Get month and year from date string
//   const getMonthYearFromDate = (dateStr) => {
//     if (!dateStr) return { month: 0, year: 0 };
//     try {
//       const [year, month] = dateStr.split('-');
//       return {
//         month: parseInt(month),
//         year: parseInt(year)
//       };
//     } catch {
//       return { month: 0, year: 0 };
//     }
//   };

//   // Filter data by selected month and year - FIXED VERSION
//   const filterDataByMonthYear = (data) => {
//     return data.filter(item => {
//       const dateParts = item.date.split('-');
//       if (dateParts.length !== 3) return false;
      
//       const year = parseInt(dateParts[0]);
//       const month = parseInt(dateParts[1]);
      
//       return month === selectedMonth && year === selectedYear;
//     });
//   };

//   // Group checkins by date and find first IN and last OUT
//   const groupCheckinsByDate = (data) => {
//     const grouped = {};
    
//     data.forEach(item => {
//       const date = getDatePart(item.time);
//       if (!date) return;
      
//       if (!grouped[date]) {
//         grouped[date] = {
//           date,
//           firstIn: null,
//           lastOut: null,
//           allCheckins: []
//         };
//       }
      
//       grouped[date].allCheckins.push(item);
      
//       if (item.log_type === 'IN') {
//         if (!grouped[date].firstIn || item.time < grouped[date].firstIn.time) {
//           grouped[date].firstIn = item;
//         }
//       } else if (item.log_type === 'OUT') {
//         if (!grouped[date].lastOut || item.time > grouped[date].lastOut.time) {
//           grouped[date].lastOut = item;
//         }
//       }
//     });
    
//     return Object.values(grouped).sort((a, b) => b.date.localeCompare(a.date));
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
        
//         // 1. Get logged in user
//         const userRes = await fetch(
//           //'${erpUrl}/api/method/frappe.auth.get_logged_user',
//           `${baseUrl}/api/method/frappe.auth.get_logged_user`,
//           //'https://mpda.in/api/method/frappe.auth.get_logged_user',
//           { headers: { Cookie: `sid=${sid}` } }
//         );
//         const username = (await userRes.json()).message;

//         // 2. Get employee details
//         const empUrl = `${baseUrl}/api/resource/Employee?fields=["name","employee_name"]&filters=[["user_id","=","${username}"]]`;
//         //const empUrl = `https://mpda.in/api/resource/Employee?fields=["name","employee_name"]&filters=[["user_id","=","${username}"]]`;
//         const empRes = await fetch(empUrl, { headers: { Cookie: `sid=${sid}` } });
//         const empData = (await empRes.json()).data[0];
//         setEmployeeName(empData.employee_name);
//         setEmployeeId(empData.name);

//         // 3. Get checkins
//          const checkinUrl = `${baseUrl}/api/resource/Employee Checkin?fields=["time","log_type"]&filters=[["employee","=","${empData.name}"]]&order_by=time desc&limit_page_length=0`;
//         //const checkinUrl = `https://mpda.in/api/resource/Employee Checkin?fields=["time","log_type"]&filters=[["employee","=","${empData.name}"]]&order_by=time desc&limit_page_length=0`;
//         const checkinRes = await fetch(checkinUrl, { headers: { Cookie: `sid=${sid}` } });
//         const data = (await checkinRes.json()).data || [];
//         setCheckinData(data);
        
//         const grouped = groupCheckinsByDate(data);
//         setGroupedData(grouped);
//         setFilteredData(filterDataByMonthYear(grouped));
        
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [sid]);

//   // Update filtered data when month or year changes
//   useEffect(() => {
//     if (groupedData.length > 0) {
//       setFilteredData(filterDataByMonthYear(groupedData));
//     }
//   }, [selectedMonth, selectedYear, groupedData]);

//   const toggleDate = (date) => {
//     setExpandedDate(expandedDate === date ? null : date);
//   };

//   const renderHeader = () => (
//     <View style={styles.headerRow}>
//       <Text style={[styles.headerCell, { width: columnWidths.date }]}>Date</Text>
//       <Text style={[styles.headerCell, { width: columnWidths.time }]}>Time In/Out</Text>
//       <Text style={[styles.headerCell, { width: columnWidths.employee }]}>Employee</Text>
//       <Text style={[styles.headerCell, { width: columnWidths.id }]}>ID</Text>
//     </View>
//   );

//   const renderTimeCell = (firstIn, lastOut, date) => {
//     return (
//       <TouchableOpacity 
//         style={[styles.timeCell, { width: columnWidths.time }]}
//         onPress={() => toggleDate(date)}
//       >
//         {firstIn && (
//           <Text style={styles.checkin}>
//             {formatTime(firstIn.time)} IN
//           </Text>
//         )}
//         {lastOut && (
//           <Text style={styles.checkout}>
//             {formatTime(lastOut.time)} OUT
//           </Text>
//         )}
//       </TouchableOpacity>
//     );
//   };

//   const renderDetailHeader = () => (
//     <View style={styles.detailHeaderRow}>
//       <Text style={[styles.detailHeaderCell, { width: columnWidths.date }]}>Date</Text>
//       <Text style={[styles.detailHeaderCell, { width: columnWidths.time }]}>Time</Text>
//       <Text style={[styles.detailHeaderCell, { width: columnWidths.id }]}>Type</Text>
//       <Text style={[styles.detailHeaderCell, { width: columnWidths.employee }]}>Employee ID</Text>
//     </View>
//   );

//   const renderCheckinRow = (item) => (
//     <View style={styles.detailRow}>
//       <Text style={[styles.detailCell, { width: columnWidths.date }]}>
//         {formatDate(item.time)}
//       </Text>
//       <Text style={[styles.detailCell, { width: columnWidths.time }]}>
//         {formatTime(item.time)}
//       </Text>
//       <Text style={[
//         styles.detailCell, 
//         { width: columnWidths.id },
//         item.log_type === 'IN' ? styles.checkin : styles.checkout
//       ]}>
//         {item.log_type}
//       </Text>
//       <Text style={[styles.detailCell, { width: columnWidths.employee }]}>
//         {employeeId}
//       </Text>
//     </View>
//   );

//   const renderItem = ({ item }) => {
//     const isExpanded = expandedDate === item.date;
    
//     return (
//       <View style={styles.itemContainer}>
//         <View style={styles.row}>
//           <Text style={[styles.cell, { width: columnWidths.date }]}>
//             {formatDate(item.date)}
//           </Text>
          
//           {renderTimeCell(item.firstIn, item.lastOut, item.date)}
          
//           <Text 
//             style={[styles.cell, { width: columnWidths.employee }]} 
//             numberOfLines={1} 
//             ellipsizeMode="tail"
//           >
//             {employeeName || '--'}
//           </Text>
          
//           <Text 
//             style={[styles.cell, { width: columnWidths.id }]}
//             numberOfLines={1} 
//             ellipsizeMode="tail"
//           >
//             {employeeId || '--'}
//           </Text>
//         </View>

//         {isExpanded && (
//           <View style={styles.expandedContainer}>
//             {renderDetailHeader()}
//             <View style={{ maxHeight: 200 }}>
//               <ScrollView 
//                 nestedScrollEnabled={true}
//                 contentContainerStyle={styles.scrollContent}
//               >
//                 {item.allCheckins.map((checkin, index) => (
//                   <View key={index}>
//                     {renderCheckinRow(checkin)}
//                   </View>
//                 ))}
//               </ScrollView>
//             </View>
//           </View>
//         )}
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>My Attendance</Text>
      
//       {/* Month and Year Picker */}
//       <View style={styles.filterContainer}>
//         <View style={styles.pickerContainer}>
//           <Text style={styles.filterLabel}>Month:</Text>
//           <Picker
//             selectedValue={selectedMonth}
//             style={styles.picker}
//             onValueChange={(itemValue) => setSelectedMonth(itemValue)}
//           >
//             {months.map(month => (
//               <Picker.Item key={month.value} label={month.label} value={month.value} />
//             ))}
//           </Picker>
//         </View>
        
//         <View style={styles.pickerContainer}>
//           <Text style={styles.filterLabel}>Year:</Text>
//           <Picker
//             selectedValue={selectedYear}
//             style={styles.picker}
//             onValueChange={(itemValue) => setSelectedYear(itemValue)}
//           >
//             {years.map(year => (
//               <Picker.Item key={year} label={year.toString()} value={year} />
//             ))}
//           </Picker>
//         </View>
//       </View>
      
//       {loading ? (
//         <ActivityIndicator size="small" color="#000" />
//       ) : error ? (
//         <Text style={styles.error}>{error}</Text>
//       ) : filteredData.length === 0 ? (
//         <Text style={styles.noData}>No records found for selected month/year</Text>
//       ) : (
//         <View style={styles.tableContainer}>
//           {renderHeader()}
//           <FlatList
//             data={filteredData}
//             renderItem={renderItem}
//             keyExtractor={(item) => item.date}
//             style={styles.list}
//           />
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     textAlign: 'center',
//     color: '#333',
//   },
//   filterContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//     paddingHorizontal: 5,
//   },
//   pickerContainer: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 10,
//     borderWidth: 1,
//     borderColor: 'black',
//     borderRadius: 10,
//   },
//   filterLabel: {
//     fontSize: 14,
//     marginRight: 5,
//     color: '#333',
//     paddingLeft: 10,
//   },
//   picker: {
//     flex: 1,
//     height: 40,
//   },
//   tableContainer: {
//     flex: 1,
//     width: '100%',
//   },
//   headerRow: {
//     flexDirection: 'row',
//     paddingVertical: 12,
//     backgroundColor: '#f0f0f0',
//     borderBottomWidth: 1,
//     borderColor: '#ddd',
//   },
//   headerCell: {
//     fontSize: 11,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     color: '#2c3e50',
//   },
//   itemContainer: {
//     borderBottomWidth: 1,
//     borderColor: '#eee',
//   },
//   row: {
//     flexDirection: 'row',
//     paddingVertical: 10,
//     alignItems: 'center',
//   },
//   cell: {
//     fontSize: 11,
//     textAlign: 'center',
//     paddingHorizontal: 2,
//     color: '#333',
//     flexShrink: 1,
//   },
//   timeCell: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 2,
//   },
//   checkin: {
//     color: 'green',
//     fontWeight: 'bold',
//     fontSize: 11,
//     paddingVertical: 2,
//     textAlign: 'center',
//   },
//   checkout: {
//     color: 'red',
//     fontWeight: 'bold',
//     fontSize: 11,
//     paddingVertical: 2,
//     textAlign: 'center',
//   },
//   expandedContainer: {
//     backgroundColor: '#f9f9f9',
//     paddingVertical: 5,
//   },
//   scrollContent: {
//     flexGrow: 1,
//   },
//   detailHeaderRow: {
//     flexDirection: 'row',
//     paddingVertical: 8,
//     backgroundColor: '#e6e6e6',
//     borderBottomWidth: 1,
//     borderColor: '#ddd',
//   },
//   detailHeaderCell: {
//     fontSize: 10,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     color: '#2c3e50',
//   },
//   detailRow: {
//     flexDirection: 'row',
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderColor: '#f0f0f0',
//   },
//   detailCell: {
//     fontSize: 10,
//     textAlign: 'center',
//     paddingHorizontal: 2,
//     color: '#333',
//     flexShrink: 1,
//   },
//   error: {
//     color: 'red',
//     textAlign: 'center',
//     marginTop: 20,
//   },
//   noData: {
//     textAlign: 'center',
//     marginTop: 20,
//     color: '#888',
//   },
//   list: {
//     flex: 1,
//     marginBottom: 10,
//   },
// });

// export default EmployeeCheckinScreen;





// code with tot.hours

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Dimensions, TouchableOpacity, ScrollView} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const EmployeeCheckinScreen = ({ route }) => {
  const { sid, erpUrl } = route.params;

  const [checkinData, setCheckinData] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [expandedDate, setExpandedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeeName, setEmployeeName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Current month
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Current year
  const [attendanceData, setAttendanceData] = useState({}); // To store working hours by date
 
  const baseUrl = erpUrl;

  const { width } = Dimensions.get('window');
  const columnWidths = {
    date: width * 0.22,
    time: width * 0.28,
    employee: width * 0.25,
    hours: width * 0.25
  };

  // Generate month options
  const months = [
    { label: 'January', value: 1 },
    { label: 'February', value: 2 },
    { label: 'March', value: 3 },
    { label: 'April', value: 4 },
    { label: 'May', value: 5 },
    { label: 'June', value: 6 },
    { label: 'July', value: 7 },
    { label: 'August', value: 8 },
    { label: 'September', value: 9 },
    { label: 'October', value: 10 },
    { label: 'November', value: 11 },
    { label: 'December', value: 12 },
  ];

  // Generate year options (last 5 years and next 5 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  // Format time as HH:MM AM/PM
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

  // Format date as DD-MM-YYYY
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

  // Extract just the date part (YYYY-MM-DD)
  const getDatePart = (dateTimeStr) => {
    if (!dateTimeStr) return '';
    try {
      return dateTimeStr.split(' ')[0];
    } catch {
      return '';
    }
  };

  // Filter data by selected month and year
  const filterDataByMonthYear = (data) => {
    return data.filter(item => {
      const dateParts = item.date.split('-');
      if (dateParts.length !== 3) return false;
      
      const year = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]);
      
      return month === selectedMonth && year === selectedYear;
    });
  };

  // Group checkins by date and find first IN and last OUT
  const groupCheckinsByDate = (data) => {
    const grouped = {};
    
    data.forEach(item => {
      const date = getDatePart(item.time);
      if (!date) return;
      
      if (!grouped[date]) {
        grouped[date] = {
          date,
          firstIn: null,
          lastOut: null,
          allCheckins: []
        };
      }
      
      grouped[date].allCheckins.push(item);
      
      if (item.log_type === 'IN') {
        if (!grouped[date].firstIn || item.time < grouped[date].firstIn.time) {
          grouped[date].firstIn = item;
        }
      } else if (item.log_type === 'OUT') {
        if (!grouped[date].lastOut || item.time > grouped[date].lastOut.time) {
          grouped[date].lastOut = item;
        }
      }
    });
    
    return Object.values(grouped).sort((a, b) => b.date.localeCompare(a.date));
  };

  // Format working hours to display
  const formatWorkingHours = (hours) => {
    if (!hours) return '--';
    return hours;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Get logged in user
        const userRes = await fetch(
          `${baseUrl}/api/method/frappe.auth.get_logged_user`,
          { headers: { Cookie: `sid=${sid}` } }
        );
        const username = (await userRes.json()).message;

        // 2. Get employee details
        const empUrl = `${baseUrl}/api/resource/Employee?fields=["name","employee_name"]&filters=[["user_id","=","${username}"]]`;
        const empRes = await fetch(empUrl, { headers: { Cookie: `sid=${sid}` } });
        const empData = (await empRes.json()).data[0];
        setEmployeeName(empData.employee_name);
        setEmployeeId(empData.name);

        // 3. Get checkins
        const checkinUrl = `${baseUrl}/api/resource/Employee Checkin?fields=["time","log_type"]&filters=[["employee","=","${empData.name}"]]&order_by=time desc&limit_page_length=0`;
        const checkinRes = await fetch(checkinUrl, { headers: { Cookie: `sid=${sid}` } });
        const data = (await checkinRes.json()).data || [];
        setCheckinData(data);
        
        // 4. Get attendance data for working hours
        const attendanceUrl = `${baseUrl}/api/resource/Attendance?fields=["attendance_date","working_hours"]&filters=[["employee","=","${empData.name}"]]&limit_page_length=0`;
        const attendanceRes = await fetch(attendanceUrl, { headers: { Cookie: `sid=${sid}` } });
        const attendanceRecords = (await attendanceRes.json()).data || [];
        
        // Create a map of date to working hours
        const attendanceMap = {};
        attendanceRecords.forEach(record => {
          attendanceMap[record.attendance_date] = record.working_hours;
        });
        setAttendanceData(attendanceMap);
        
        const grouped = groupCheckinsByDate(data);
        setGroupedData(grouped);
        setFilteredData(filterDataByMonthYear(grouped));
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sid]);

  // Update filtered data when month or year changes
  useEffect(() => {
    if (groupedData.length > 0) {
      setFilteredData(filterDataByMonthYear(groupedData));
    }
  }, [selectedMonth, selectedYear, groupedData]);

  const toggleDate = (date) => {
    setExpandedDate(expandedDate === date ? null : date);
  };

  const renderHeader = () => (
    <View style={styles.headerRow}>
      <Text style={[styles.headerCell, { width: columnWidths.date }]}>Date</Text>
      <Text style={[styles.headerCell, { width: columnWidths.time }]}>Time In/Out</Text>
      <Text style={[styles.headerCell, { width: columnWidths.employee }]}>Employee</Text>
      <Text style={[styles.headerCell, { width: columnWidths.hours }]}>tot.hours</Text>
    </View>
  );

  const renderTimeCell = (firstIn, lastOut, date) => {
    return (
      <TouchableOpacity 
        style={[styles.timeCell, { width: columnWidths.time }]}
        onPress={() => toggleDate(date)}
      >
        {firstIn && (
          <Text style={styles.checkin}>
            {formatTime(firstIn.time)} IN
          </Text>
        )}
        {lastOut && (
          <Text style={styles.checkout}>
            {formatTime(lastOut.time)} OUT
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderDetailHeader = () => (
    <View style={styles.detailHeaderRow}>
      <Text style={[styles.detailHeaderCell, { width: columnWidths.date }]}>Date</Text>
      <Text style={[styles.detailHeaderCell, { width: columnWidths.time }]}>Time</Text>
      <Text style={[styles.detailHeaderCell, { width: columnWidths.hours }]}>Type</Text>
      <Text style={[styles.detailHeaderCell, { width: columnWidths.employee }]}>Employee</Text>
    </View>
  );

  const renderCheckinRow = (item) => (
    <View style={styles.detailRow}>
      <Text style={[styles.detailCell, { width: columnWidths.date }]}>
        {formatDate(item.time)}
      </Text>
      <Text style={[styles.detailCell, { width: columnWidths.time }]}>
        {formatTime(item.time)}
      </Text>
      <Text style={[
        styles.detailCell, 
        { width: columnWidths.hours },
        item.log_type === 'IN' ? styles.checkin : styles.checkout
      ]}>
        {item.log_type}
      </Text>
      <Text style={[styles.detailCell, { width: columnWidths.employee }]}>
        {employeeName}
      </Text>
    </View>
  );

  const renderItem = ({ item }) => {
    const isExpanded = expandedDate === item.date;
    const workingHours = attendanceData[item.date] || '--';
    
    return (
      <View style={styles.itemContainer}>
        <View style={styles.row}>
          <Text style={[styles.cell, { width: columnWidths.date }]}>
            {formatDate(item.date)}
          </Text>
          
          {renderTimeCell(item.firstIn, item.lastOut, item.date)}
          
          <Text 
            style={[styles.cell, { width: columnWidths.employee }]} 
            numberOfLines={1} 
            ellipsizeMode="tail"
          >
            {employeeName || '--'}
          </Text>
          
          <Text 
            style={[styles.cell, { width: columnWidths.hours }]}
            numberOfLines={1} 
            ellipsizeMode="tail"
          >
            {formatWorkingHours(workingHours)}
          </Text>
        </View>

        {isExpanded && (
          <View style={styles.expandedContainer}>
            {renderDetailHeader()}
            <View style={{ maxHeight: 200 }}>
              <ScrollView 
                nestedScrollEnabled={true}
                contentContainerStyle={styles.scrollContent}
              >
                {item.allCheckins.map((checkin, index) => (
                  <View key={index}>
                    {renderCheckinRow(checkin)}
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Attendance</Text>
      
      {/* Month and Year Picker */}
      <View style={styles.filterContainer}>
        <View style={styles.pickerContainer}>
          <Text style={styles.filterLabel}>Month:</Text>
          <Picker
            selectedValue={selectedMonth}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedMonth(itemValue)}
          >
            {months.map(month => (
              <Picker.Item key={month.value} label={month.label} value={month.value} />
            ))}
          </Picker>
        </View>
        
        <View style={styles.pickerContainer}>
          <Text style={styles.filterLabel}>Year:</Text>
          <Picker
            selectedValue={selectedYear}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedYear(itemValue)}
          >
            {years.map(year => (
              <Picker.Item key={year} label={year.toString()} value={year} />
            ))}
          </Picker>
        </View>
      </View>
      
      {loading ? (
        <ActivityIndicator size="small" color="#000" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : filteredData.length === 0 ? (
        <Text style={styles.noData}>No records found for selected month/year</Text>
      ) : (
        <View style={styles.tableContainer}>
          {renderHeader()}
          <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={(item) => item.date}
            style={styles.list}
          />
        </View>
      )}
    </View>
  );
};


//new style add
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  pickerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f8f8f8',
  },
  filterLabel: {
    fontSize: 14,
    marginRight: 5,
    color: '#333',
    paddingLeft: 10,
  },
  picker: {
    flex: 1,
    height: 40,
  },
  tableContainer: {
    flex: 1,
    width: '100%',
    borderWidth: 1,
    borderColor: '#000',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderColor: '#000',
  },
  headerCell: {
    flex: 1,
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    paddingVertical: 8,
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderColor: '#000',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    fontSize: 11,
    textAlign: 'center',
    paddingVertical: 8,
    color: '#000',
  },
  timeCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkin: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 11,
  },
  checkout: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 11,
  },
  expandedContainer: {
    backgroundColor: '#f9f9f9',
  },
  detailHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#e6e6e6',
    borderBottomWidth: 1,
    //borderColor: '#000',
  },
  detailHeaderCell: {
    flex: 1,
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    paddingVertical: 6,
  },
  detailRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  detailCell: {
    flex: 1,
    fontSize: 10,
    textAlign: 'center',
    paddingVertical: 6,
    color: '#000',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  noData: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
  list: {
    flex: 1,
    marginBottom: 10,
  },
});

export default EmployeeCheckinScreen;