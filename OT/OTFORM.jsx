

// first fetch location then update record in ERPNext

// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Alert,
//   PermissionsAndroid,
//   Platform,
//   ActivityIndicator,
//   StyleSheet,
//   ScrollView,
// } from 'react-native';
// import Geolocation from '@react-native-community/geolocation';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';

// const STORAGE_KEY = 'latest_ot_record';

// const OTForm = ({ route }) => {
//   const { erpUrl, sid, employeeData } = route.params;
//   const employeeId = employeeData?.name?.trim();

//   const [otRecord, setOtRecord] = useState(null);
//   const [processing, setProcessing] = useState(false);
//   const [elapsedTime, setElapsedTime] = useState('00:00:00');
//   const [timerInterval, setTimerInterval] = useState(null);

//   const today = new Date().toISOString().split('T')[0];

//   useEffect(() => {
//     const loadRecord = async () => {
//       try {
//         const saved = await AsyncStorage.getItem(STORAGE_KEY);
//         if (saved) {
//           const parsed = JSON.parse(saved);
//           if (parsed.date === today && parsed.employee === employeeId) {
//             setOtRecord(parsed);
//             if (parsed.in_time && !parsed.out_time) {
//               startTimer(parsed.in_time);
//             }
//             if (parsed.in_time && parsed.out_time) {
//               const diff = calculateDuration(parsed.in_time, parsed.out_time);
//               setElapsedTime(diff);
//             }
//           } else {
//             await AsyncStorage.removeItem(STORAGE_KEY);
//           }
//         }
//       } catch (err) {
//         console.error('Failed to load OT record:', err);
//       }
//     };
//     loadRecord();

//     return () => {
//       if (timerInterval) clearInterval(timerInterval);
//     };
//   }, []);

//   const formatDateTime = (date) => {
//     const d = new Date(date);
//     const yyyy = d.getFullYear();
//     const mm = String(d.getMonth() + 1).padStart(2, '0');
//     const dd = String(d.getDate()).padStart(2, '0');
//     const hh = String(d.getHours()).padStart(2, '0');
//     const min = String(d.getMinutes()).padStart(2, '0');
//     const ss = String(d.getSeconds()).padStart(2, '0');
//     return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
//   };

//   const calculateDuration = (start, end) => {
//     const startTime = new Date(start).getTime();
//     const endTime = new Date(end).getTime();
//     const diffMs = endTime - startTime;
//     if (diffMs <= 0) return '00:00:00';
//     const hours = Math.floor(diffMs / 3600000);
//     const minutes = Math.floor((diffMs % 3600000) / 60000);
//     const seconds = Math.floor((diffMs % 60000) / 1000);
//     return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
//       2,
//       '0'
//     )}:${String(seconds).padStart(2, '0')}`;
//   };

//   const startTimer = (inTime) => {
//     if (timerInterval) clearInterval(timerInterval);
//     const interval = setInterval(() => {
//       const now = new Date();
//       const diff = calculateDuration(inTime, now);
//       setElapsedTime(diff);
//     }, 1000);
//     setTimerInterval(interval);
//   };

//   const stopTimer = () => {
//     if (timerInterval) {
//       clearInterval(timerInterval);
//       setTimerInterval(null);
//     }
//   };

//   const requestLocationPermission = async () => {
//     if (Platform.OS === 'android') {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//         {
//           title: 'Location Permission',
//           message: 'App needs access to your location to record OT.',
//           buttonNeutral: 'Ask Me Later',
//           buttonNegative: 'Cancel',
//           buttonPositive: 'OK',
//         }
//       );
//       return granted === PermissionsAndroid.RESULTS.GRANTED;
//     }
//     return true;
//   };

//   // Promisified location fetch for faster response
//   const getCurrentLocation = () => {
//     return new Promise((resolve, reject) => {
//       Geolocation.getCurrentPosition(
//         (pos) => {
//           resolve(pos.coords);
//         },
//         (err) => reject(err),
//         { enableHighAccuracy: false, timeout: 16000, maximumAge: 30000 }
//       );
//     });
//   };

//   const handleClock = async (type) => {
//     const hasPermission = await requestLocationPermission();
//     if (!hasPermission) {
//       Alert.alert('Permission Denied', 'Please enable location access.');
//       return;
//     }

//     setProcessing(true);

//     try {
//       const coords = await getCurrentLocation(); // fetch location first
//       const { latitude, longitude } = coords;
//       const currentTime = formatDateTime(new Date());

//       let updatedRecord = { ...otRecord };

//       if (!otRecord) {
//         // First Clock In
//         updatedRecord = {
//           employee: employeeId,
//           date: today,
//           in_time: currentTime,
//           in_latitude: latitude,
//           in_longitude: longitude,
//         };
//         const res = await axios.post(`${erpUrl}/api/resource/Employee OT`, updatedRecord, {
//           headers: { Cookie: `sid=${sid}`, 'Content-Type': 'application/json' },
//         });
//         updatedRecord = { ...res.data.data, ...updatedRecord };
//         setOtRecord(updatedRecord);
//         await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecord));
//         startTimer(currentTime);
//         Alert.alert('Success', 'Clock In recorded!');
//       } else if (otRecord && !otRecord.in_time) {
//         // Clock In exists in ERP but not locally
//         updatedRecord = {
//           ...otRecord,
//           in_time: currentTime,
//           in_latitude: latitude,
//           in_longitude: longitude,
//         };
//         await axios.put(`${erpUrl}/api/resource/Employee OT/${otRecord.name}`, updatedRecord, {
//           headers: { Cookie: `sid=${sid}`, 'Content-Type': 'application/json' },
//         });
//         setOtRecord(updatedRecord);
//         await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecord));
//         startTimer(currentTime);
//         Alert.alert('Success', 'Clock In recorded! successfully');
//       } else if (otRecord && otRecord.in_time && !otRecord.out_time) {
//         // Clock Out
//         updatedRecord = {
//           ...otRecord,
//           out_time: currentTime,
//           out_latitude: latitude,
//           out_longitude: longitude,
//         };
//         await axios.put(`${erpUrl}/api/resource/Employee OT/${otRecord.name}`, updatedRecord, {
//           headers: { Cookie: `sid=${sid}`, 'Content-Type': 'application/json' },
//         });
//         setOtRecord(updatedRecord);
//         await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecord));
//         stopTimer();
//         const diff = calculateDuration(updatedRecord.in_time, updatedRecord.out_time);
//         setElapsedTime(diff);
//         Alert.alert('Success', `Clock Out recorded!\nTotal OT Time: ${diff}`);
//       } else {
//         Alert.alert('Info', 'You already Clocked In and Out today.');
//       }
//     } catch (err) {
//       console.error('Clock error:', err.response?.data || err.message);
//       Alert.alert('Error', 'Failed to update OT in ERPNext or fetch location.');
//     } finally {
//       setProcessing(false);
//     }
//   };

//   const clearStorage = async () => {
//     try {
//       await AsyncStorage.removeItem(STORAGE_KEY);
//       setOtRecord(null);
//       stopTimer();
//       setElapsedTime('00:00:00');
//       Alert.alert('Cleared', 'OT record removed successfully.');
//     } catch (err) {
//       console.error('Failed to clear OT record:', err);
//       Alert.alert('Error', 'Failed to clear OT record.');
//     }
//   };

//   const showClockIn = !otRecord || !otRecord.in_time;
//   const showClockOut = otRecord && otRecord.in_time && !otRecord.out_time;

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.heading}>Overtime Record ({today})</Text>

//       {otRecord && (
//         <View style={styles.fieldContainer}>
//           <Text style={styles.label}>Employee:</Text>
//           <Text style={styles.value}>{employeeId}</Text>
//         </View>
//       )}

//       {otRecord && (
//         <View style={styles.fieldContainer}>
//           <Text style={styles.label}>In Time:</Text>
//           <Text style={styles.value}>{otRecord.in_time || '-'}</Text>
//         </View>
//       )}

//       {otRecord && (
//         <View style={styles.fieldContainer}>
//           <Text style={styles.label}>Out Time:</Text>
//           <Text style={styles.value}>{otRecord.out_time || '-'}</Text>
//         </View>
//       )}

//       {otRecord && (
//         <View style={styles.fieldContainer}>
//           <Text style={styles.label}>Total Time:</Text>
//           <Text style={[styles.value, { fontWeight: 'bold', color: '#43b53f' }]}>{elapsedTime}</Text>
//         </View>
//       )}

//       {processing && (
//         <View style={{ alignItems: 'center', marginVertical: 10 }}>
//           <ActivityIndicator size="large" color="#43b53f" />
//           <Text style={{ marginTop: 8, color: '#555' }}>Processing...</Text>
//         </View>
//       )}

//       {showClockIn && !processing && (
//         <TouchableOpacity style={[styles.button, styles.clockIn]} onPress={() => handleClock('in')}>
//           <Text style={styles.buttonText}>Punch In</Text>
//         </TouchableOpacity>
//       )}

//       {showClockOut && !processing && (
//         <TouchableOpacity style={[styles.button, styles.clockOut]} onPress={() => handleClock('out')}>
//           <Text style={styles.buttonText}>Punch Out</Text>
//         </TouchableOpacity>
//       )}

//       {!showClockIn && !showClockOut && !processing && (
//         <Text style={styles.doneText}>You have completed OT for today.</Text>
//       )}

//       <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clearStorage}>
//         <Text style={styles.buttonText}>Clear OT Record</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flexGrow: 1, padding: 20, backgroundColor: '#f8f8f8' },
//   heading: { fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: 20, color: '#333' },
//   fieldContainer: {
//     marginBottom: 12,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   label: { fontWeight: '600', color: '#555' },
//   value: { color: '#000' },
//   button: { padding: 15, borderRadius: 10, marginVertical: 8 },
//   clockIn: { backgroundColor: '#2196F3' },
//   clockOut: { backgroundColor: '#F44336' },
//   clearButton: { backgroundColor: '#607D8B' },
//   buttonText: { textAlign: 'center', color: '#fff', fontWeight: '600', fontSize: 16 },
//   doneText: { textAlign: 'center', color: '#43b53f', fontWeight: '600', marginVertical: 20 },
// });

// export default OTForm;







// import React, { useEffect, useState } from "react";
// import { View, ActivityIndicator, StyleSheet } from "react-native";
// import { WebView } from "react-native-webview";

// const LeadScreen = ({ route }) => {
//   const { sid, erpUrl } = route.params || {};
//   const [url, setUrl] = useState(null);

//   useEffect(() => {
//     // 👉 Load “Lead” doctype directly
//     const finalUrl = `${erpUrl}/app/lead/`;
//     setUrl(finalUrl);
//   }, []);

//   if (!url) {
//     return (
//       <View style={styles.loader}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   return (
//     <WebView
//       source={{ uri: url }}

//       injectedJavaScript={`
//   document.cookie = "sid=${sid}; path=/;";

//   function hideElements() {
//     const css = \`
//       /* ---------------------------------------
//          🔥 Universal Notification Bell Hider
//          Works for ERPNext v12, v13, v14, v15
//       ---------------------------------------- */

//       /* v13–v15 notifications */
//       .nav-link[href="/app/notifications"],
//       a[href="/app/notifications"],
//       li[data-route="notifications"],
//       .notifications,
//       .notification-list,
//       .navbar .nav-item .notifications-dropdown,
//       .navbar .notifications-dropdown,
//       .navbar-nav .notifications-dropdown,
//       .nav-item.dropdown.notifications-dropdown {
//         display: none !important;
//         visibility: hidden !important;
//         opacity: 0 !important;
//         width: 0 !important;
//         height: 0 !important;
//       }

//       /* Icons inside notification dropdown */
//       .notifications-icon,
//       .octicon-bell,
//       .fa-bell,
//       .fa.fa-bell,
//       i.fa.fa-bell-o,
//       i.octicon.octicon-bell {
//         display: none !important;
//       }

//       /* ERPNext v12 top bar notifications */
//       #navbar-notifications,
//       .navbar-notifications,
//       #notifications-icon {
//         display: none !important;
//       }

//       /* Hide Search Bar */
//       .navbar-search, .search-bar, input[type="search"] {
//         display: none !important;
//       }

//       /* Hide User Avatar Icon */
//       .navbar .dropdown-mobile,
//       .user-profile,
//       .navbar .nav-item.dropdown,
//       .navbar .nav-item .dropdown-toggle,
//       .nav-item.dropdown.user-profile,
//       .avatar, img.user-avatar {
//         display: none !important;
//       }
//     \`;

//     const style = document.createElement("style");
//     style.innerHTML = css;
//     document.head.appendChild(style);
//   }

//   // Keep trying until ERPNext fully loads
//   const interval = setInterval(() => {
//     if (document.body) {
//       hideElements();
//     }
//   }, 500);

//   setTimeout(() => clearInterval(interval), 8000);

//   true;
// `}

//       sharedCookiesEnabled={true}
//       thirdPartyCookiesEnabled={true}
//       javaScriptEnabled={true}
//       domStorageEnabled={true}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   loader: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center"
//   }
// });

// export default LeadScreen;





import React, { useEffect, useState, useRef } from "react";
import { View, ActivityIndicator, StyleSheet, BackHandler } from "react-native";
import { WebView } from "react-native-webview";

const LeadScreen = ({ route, navigation }) => {
  const { sid, erpUrl } = route.params || {};
  const [url, setUrl] = useState(null);
  const webviewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    const finalUrl = `${erpUrl}/app/lead/`;
    setUrl(finalUrl);
  }, []);

  useEffect(() => {
    const backAction = () => {
      if (canGoBack && webviewRef.current) {
        webviewRef.current.goBack();
        return true;
      } else {
        navigation.goBack();
        return true;
      }
    };

    const subscription = BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => subscription.remove(); // modern way to remove listener
  }, [canGoBack]);

  if (!url) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <WebView
      ref={webviewRef}
      source={{ uri: url }}
      onNavigationStateChange={navState => setCanGoBack(navState.canGoBack)}
      injectedJavaScript={`
  document.cookie = "sid=${sid}; path=/;";

  function hideElements() {
    const css = \`
      /* ---------------------------------------
         🔥 Universal Notification Bell Hider
         Works for ERPNext v12, v13, v14, v15
      ---------------------------------------- */

      /* v13–v15 notifications */
      .nav-link[href="/app/notifications"],
      a[href="/app/notifications"],
      li[data-route="notifications"],
      .notifications,
      .notification-list,
      .navbar .nav-item .notifications-dropdown,
      .navbar .notifications-dropdown,
      .navbar-nav .notifications-dropdown,
      .nav-item.dropdown.notifications-dropdown {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        width: 0 !important;
        height: 0 !important;
      }

      /* Icons inside notification dropdown */
      .notifications-icon,
      .octicon-bell,
      .fa-bell,
      .fa.fa-bell,
      i.fa.fa-bell-o,
      i.octicon.octicon-bell {
        display: none !important;
      }

      /* ERPNext v12 top bar notifications */
      #navbar-notifications,
      .navbar-notifications,
      #notifications-icon {
        display: none !important;
      }

      /* Hide Search Bar */
      .navbar-search, .search-bar, input[type="search"] {
        display: none !important;
      }

      /* Hide User Avatar Icon */
      .navbar .dropdown-mobile,
      .user-profile,
      .navbar .nav-item.dropdown,
      .navbar .nav-item .dropdown-toggle,
      .nav-item.dropdown.user-profile,
      .avatar, img.user-avatar {
        display: none !important;
      }
    \`;

    const style = document.createElement("style");
    style.innerHTML = css;
    document.head.appendChild(style);
  }

  // Keep trying until ERPNext fully loads
  const interval = setInterval(() => {
    if (document.body) {
      hideElements();
    }
  }, 500);

  setTimeout(() => clearInterval(interval), 8000);

  true;
`}


      sharedCookiesEnabled={true}
      thirdPartyCookiesEnabled={true}
      javaScriptEnabled={true}
      domStorageEnabled={true}
    />
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default LeadScreen;
