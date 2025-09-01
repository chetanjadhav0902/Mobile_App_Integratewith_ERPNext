// // // import React, { useState, useEffect, useRef } from 'react';
// // // import {
// // //   View,
// // //   Text,
// // //   TouchableOpacity,
// // //   StyleSheet,
// // //   Alert,
// // //   ActivityIndicator,
// // //   Platform,
// // //   PermissionsAndroid,
// // // } from 'react-native';
// // // import Ionicons from 'react-native-vector-icons/Ionicons';
// // // import Geolocation from '@react-native-community/geolocation';
// // // import AsyncStorage from '@react-native-async-storage/async-storage';

// // // const ERP_BASE_URL = 'https://erpnextcloud.cbditsolutions.com';
// // // const LOCATION_CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes cache validity

// // // const ClockIn = ({ sid, employeeData }) => {
// // //   const [clockInTime, setClockInTime] = useState(null);
// // //   const [clockOutTime, setClockOutTime] = useState(null);
// // //   const [clockInSeconds, setClockInSeconds] = useState(0);
// // //   const [totalSeconds, setTotalSeconds] = useState(0);
// // //   const [clockInLoading, setClockInLoading] = useState(false);
// // //   const [clockOutLoading, setClockOutLoading] = useState(false);
// // //   const [locationCache, setLocationCache] = useState(null);
// // //   const [clockOutEnabled, setClockOutEnabled] = useState(false);

// // //   // Create storage key based on employee ID
// // //   const STORAGE_KEY = `employee_clock_data_${employeeData.name}`;

// // //   const clockInTimerRef = useRef(null);
// // //   const totalTimerRef = useRef(null);

// // //   // Load saved data on component mount
// // //   useEffect(() => {
// // //     const loadData = async () => {
// // //       try {
// // //         const savedData = await AsyncStorage.getItem(STORAGE_KEY);
// // //         if (savedData) {
// // //           const { employeeId, clockInTime: savedClockIn, clockOutTime: savedClockOut } = JSON.parse(savedData);
          
// // //           // Check if the saved data is for the current employee
// // //           if (employeeId === employeeData.name) {
// // //             if (savedClockIn) {
// // //               const clockInDate = new Date(savedClockIn);
// // //               setClockInTime(clockInDate);
              
// // //               // If clocked in but not out, enable clock out
// // //               if (!savedClockOut) {
// // //                 setClockOutEnabled(true);
                
// // //                 // Calculate seconds since clock in
// // //                 const secondsSinceClockIn = Math.floor((new Date() - clockInDate) / 1000);
// // //                 setClockInSeconds(secondsSinceClockIn);
// // //               }
// // //             }
            
// // //             if (savedClockOut) {
// // //               setClockOutTime(new Date(savedClockOut));
// // //             }
// // //           } else {
// // //             // Data is for a different employee, clear it
// // //             await AsyncStorage.removeItem(STORAGE_KEY);
// // //           }
// // //         }
// // //       } catch (error) {
// // //         console.error('Failed to load clock data:', error);
// // //       }
// // //     };

// // //     loadData();
// // //   }, [employeeData.name]);

// // //   // Save data whenever it changes
// // //   useEffect(() => {
// // //     const saveData = async () => {
// // //       try {
// // //         const dataToSave = {
// // //           employeeId: employeeData.name,
// // //           clockInTime: clockInTime ? clockInTime.toISOString() : null,
// // //           clockOutTime: clockOutTime ? clockOutTime.toISOString() : null,
// // //         };
// // //         await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
// // //       } catch (error) {
// // //         console.error('Failed to save clock data:', error);
// // //       }
// // //     };

// // //     saveData();
// // //   }, [clockInTime, clockOutTime, employeeData.name]);

// // //   useEffect(() => {
// // //     if (clockInTime && !clockOutTime) {
// // //       clockInTimerRef.current = setInterval(() => {
// // //         setClockInSeconds(prev => prev + 1);
// // //       }, 1000);
// // //     } else {
// // //       clearInterval(clockInTimerRef.current);
// // //       setClockInSeconds(0);
// // //     }
// // //     return () => clearInterval(clockInTimerRef.current);
// // //   }, [clockInTime, clockOutTime]);

// // //   useEffect(() => {
// // //     if (clockOutTime) {
// // //       totalTimerRef.current = setInterval(() => {
// // //         setTotalSeconds(prev => prev + 1);
// // //       }, 1000);
// // //     } else {
// // //       clearInterval(totalTimerRef.current);
// // //       setTotalSeconds(0);
// // //     }
// // //     return () => clearInterval(totalTimerRef.current);
// // //   }, [clockOutTime]);

// // //   const resetClockData = async () => {
// // //     clearInterval(clockInTimerRef.current);
// // //     clearInterval(totalTimerRef.current);
// // //     setClockInTime(null);
// // //     setClockOutTime(null);
// // //     setClockInSeconds(0);
// // //     setTotalSeconds(0);
// // //     setClockOutEnabled(false);
// // //     try {
// // //       await AsyncStorage.removeItem(STORAGE_KEY);
// // //     } catch (error) {
// // //       console.error('Failed to clear clock data:', error);
// // //     }
// // //   };

// // //   const requestLocationPermission = async () => {
// // //     if (Platform.OS === 'android') {
// // //       try {
// // //         const granted = await PermissionsAndroid.request(
// // //           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
// // //           {
// // //             title: 'Location Permission',
// // //             message: 'This app needs access to your location for attendance tracking.',
// // //             buttonNeutral: 'Ask Me Later',
// // //             buttonNegative: 'Cancel',
// // //             buttonPositive: 'OK',
// // //           }
// // //         );
// // //         return granted === PermissionsAndroid.RESULTS.GRANTED;
// // //       } catch (err) {
// // //         console.warn(err);
// // //         return false;
// // //       }
// // //     }
// // //     return true; // iOS handles permissions differently
// // //   };

// // //   const checkLocationServices = async () => {
// // //     return new Promise(resolve => {
// // //       Geolocation.getCurrentPosition(
// // //         () => resolve(true),
// // //         () => resolve(false),
// // //         { enableHighAccuracy: false, timeout: 1000 }
// // //       );
// // //     });
// // //   };

// // //   const getLocationWithFallback = async () => {
// // //     // Check cache first
// // //     if (locationCache && (Date.now() - locationCache.timestamp) < LOCATION_CACHE_EXPIRY) {
// // //       return locationCache.coords;
// // //     }

// // //     // Check if location services are enabled
// // //     const servicesEnabled = await checkLocationServices();
// // //     if (!servicesEnabled) {
// // //       throw new Error('Location services are disabled. Please enable them in your device settings.');
// // //     }

// // //     // Try high accuracy first
// // //     try {
// // //       const position = await new Promise((resolve, reject) => {
// // //         Geolocation.getCurrentPosition(
// // //           resolve,
// // //           reject,
// // //           {
// // //             enableHighAccuracy: true,
// // //             timeout: 5000,
// // //             maximumAge: 0
// // //           }
// // //         );
// // //       });
      
// // //       const coords = position.coords;
// // //       setLocationCache({ coords, timestamp: Date.now() });
// // //       return coords;
// // //     } catch (highAccuracyError) {
// // //       console.log('High accuracy failed, trying low accuracy');
      
// // //       // Fallback to low accuracy
// // //       try {
// // //         const position = await new Promise((resolve, reject) => {
// // //           Geolocation.getCurrentPosition(
// // //             resolve,
// // //             reject,
// // //             {
// // //               enableHighAccuracy: false,
// // //               timeout: 3000,
// // //               maximumAge: 30000
// // //             }
// // //           );
// // //         });
        
// // //         const coords = position.coords;
// // //         setLocationCache({ coords, timestamp: Date.now() });
// // //         return coords;
// // //       } catch (lowAccuracyError) {
// // //         console.log('Low accuracy also failed');
// // //         throw new Error('Could not determine your location. Please ensure you have GPS signal or try in an open area.');
// // //       }
// // //     }
// // //   };

// // //   const formatTimeForERP = (date) => {
// // //     // Format as YYYY-MM-DD HH:mm:ss in local time
// // //     return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
// // //   };

// // //   const submitClockIn = async (coords) => {
// // //     const now = new Date();
// // //     const timeString = formatTimeForERP(now);
    
// // //     try {
// // //       const res = await fetch(`${ERP_BASE_URL}/api/resource/Employee Checkin`, {
// // //         method: 'POST',
// // //         headers: {
// // //           'Content-Type': 'application/json',
// // //           Cookie: `sid=${sid}`,
// // //         },
// // //         body: JSON.stringify({
// // //           employee: employeeData.name,
// // //           log_type: 'IN',
// // //           time: timeString,
// // //           latitude: coords.latitude,
// // //           longitude: coords.longitude,
// // //         }),
// // //       });

// // //       if (!res.ok) {
// // //         const errText = await res.text();
// // //         throw new Error(`Failed to clock in: ${errText}`);
// // //       }

// // //       setClockInTime(now);
// // //       setClockOutTime(null);
// // //       setClockOutEnabled(true);
// // //       Alert.alert('Success', 'Clock-in recorded successfully.');
// // //     } catch (error) {
// // //       throw error;
// // //     }
// // //   };

// // //   const submitClockOut = async (coords) => {
// // //     const now = new Date();
// // //     const timeString = formatTimeForERP(now);
    
// // //     try {
// // //       const res = await fetch(`${ERP_BASE_URL}/api/resource/Employee Checkin`, {
// // //         method: 'POST',
// // //         headers: {
// // //           'Content-Type': 'application/json',
// // //           Cookie: `sid=${sid}`,
// // //         },
// // //         body: JSON.stringify({
// // //           employee: employeeData.name,
// // //           log_type: 'OUT',
// // //           time: timeString,
// // //           latitude: coords.latitude,
// // //           longitude: coords.longitude,
// // //         }),
// // //       });

// // //       if (!res.ok) {
// // //         const errText = await res.text();
// // //         throw new Error(`Failed to clock out: ${errText}`);
// // //       }

// // //       setClockOutTime(now);
// // //       setClockOutEnabled(false);
// // //       Alert.alert('Success', 'Clock-out recorded successfully.');
// // //     } catch (error) {
// // //       throw error;
// // //     }
// // //   };

// // //   const handleClockIn = async () => {
// // //     if (clockInLoading) return;

// // //     const hasPermission = await requestLocationPermission();
// // //     if (!hasPermission) {
// // //       Alert.alert('Permission denied', 'Location permission is required to clock in.');
// // //       return;
// // //     }

// // //     setClockInLoading(true);
// // //     try {
// // //       const coords = await getLocationWithFallback();
// // //       await submitClockIn(coords);
// // //     } catch (error) {
// // //       Alert.alert('Error', error.message);
// // //     } finally {
// // //       setClockInLoading(false);
// // //     }
// // //   };

// // //   const handleClockOut = async () => {
// // //     if (clockOutLoading) return;

// // //     setClockOutLoading(true);
// // //     try {
// // //       // Try fresh location first
// // //       let coords;
// // //       try {
// // //         coords = await getLocationWithFallback();
// // //       } catch (error) {
// // //         // If fresh location fails, try cached location if available
// // //         if (locationCache && (Date.now() - locationCache.timestamp) < LOCATION_CACHE_EXPIRY * 2) {
// // //           coords = locationCache.coords;
// // //         } else {
// // //           throw error;
// // //         }
// // //       }
      
// // //       await submitClockOut(coords);
// // //     } catch (error) {
// // //       Alert.alert('Error', error.message);
// // //     } finally {
// // //       setClockOutLoading(false);
// // //     }
// // //   };

// // //   const formatTime = (seconds) => {
// // //     const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
// // //     const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
// // //     const s = (seconds % 60).toString().padStart(2, '0');
// // //     return `${h}:${m}:${s}`;
// // //   };

// // //   const getTotalTime = () => {
// // //     if (!clockInTime || !clockOutTime) return '00:00:00';
// // //     const diffMs = clockOutTime - clockInTime;
// // //     return formatTime(Math.floor(diffMs / 1000));
// // //   };

// // //   return (
// // //     <View style={styles.outerContainer}>
// // //       <View style={styles.container}>
// // //         <TouchableOpacity
// // //           style={[styles.button, clockInLoading || clockOutEnabled ? styles.buttonDisabled : {}]}
// // //           onPress={handleClockIn}
// // //           disabled={clockInLoading || clockOutEnabled}
// // //         >
// // //           <Ionicons name="time-outline" size={28} color="#4CAF50" />
// // //           {clockInLoading ? (
// // //             <ActivityIndicator color="#4CAF50" style={{ marginLeft: 12 }} />
// // //           ) : (
// // //             <Text style={styles.buttonText}>Clock In</Text>
// // //           )}
// // //         </TouchableOpacity>

// // //         <View style={styles.timeContainer}>
// // //           <Text style={styles.timeLabel}>Clock In Time:</Text>
// // //           <Text style={styles.timeText}>
// // //             {clockInTime ? clockInTime.toLocaleTimeString() : '--:--:--'}
// // //           </Text>
// // //           <Text style={styles.timerText}>Timer: {formatTime(clockInSeconds)}</Text>
// // //         </View>
// // //       </View>

// // //       <View style={styles.container}>
// // //         <TouchableOpacity
// // //           style={[styles.button, !clockOutEnabled || clockOutLoading ? styles.buttonDisabled : {}]}
// // //           onPress={handleClockOut}
// // //           disabled={!clockOutEnabled || clockOutLoading}
// // //         >
// // //           <Ionicons name="exit-outline" size={28} color="#f44336" />
// // //           {clockOutLoading ? (
// // //             <ActivityIndicator color="#f44336" style={{ marginLeft: 12 }} />
// // //           ) : (
// // //             <Text style={[styles.buttonText, { color: '#f44336' }]}>Clock Out</Text>
// // //           )}
// // //         </TouchableOpacity>

// // //         <View style={styles.timeContainer}>
// // //           <Text style={styles.timeLabel}>Clock Out Time:</Text>
// // //           <Text style={styles.timeText}>
// // //             {clockOutTime ? clockOutTime.toLocaleTimeString() : ''}
// // //           </Text>
// // //           <Text style={styles.timerText}>Total Time: {getTotalTime()}</Text>
// // //         </View>
// // //       </View>
// // //     </View>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   outerContainer: {
// // //     flex: 1,
// // //     padding: 20,
// // //     backgroundColor: '#f8f9fa',
// // //     justifyContent: 'center',
// // //   },
// // //   container: {
// // //     backgroundColor: '#fff',
// // //     padding: 20,
// // //     marginVertical: 10,
// // //     borderRadius: 12,
// // //     alignItems: 'center',
// // //     elevation: 2,
// // //     borderWidth: 2,
// // //     borderColor: 'skyblue',
// // //   },
// // //   button: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     paddingHorizontal: 28,
// // //     paddingVertical: 14,
// // //     borderRadius: 30,
// // //     borderWidth: 2,
// // //     borderColor: '#4CAF50',
// // //   },
// // //   buttonDisabled: {
// // //     borderColor: '#bbb',
// // //   },
// // //   buttonText: {
// // //     marginLeft: 10,
// // //     fontSize: 18,
// // //     fontWeight: '600',
// // //     color: '#4CAF50',
// // //   },
// // //   timeContainer: {
// // //     marginTop: 16,
// // //     alignItems: 'center',
// // //   },
// // //   timeLabel: {
// // //     fontSize: 19,
// // //     color: '#555',
// // //   },
// // //   timeText: {
// // //     fontSize: 20,
// // //     color: '#222',
// // //   },
// // //   timerText: {
// // //     marginTop: 6,
// // //     fontSize: 16,
// // //     color: 'skyblue',
// // //   },
// // // });

// // // export default ClockIn;










// //   import React, { useState, useEffect, useRef } from 'react';
// //   import {
// //     View,
// //     Text,
// //     TouchableOpacity,
// //     StyleSheet,
// //     Alert,
// //     ActivityIndicator,
// //     Platform,
// //     PermissionsAndroid,
// //   } from 'react-native';
// //   import Ionicons from 'react-native-vector-icons/Ionicons';
// //   import Geolocation from '@react-native-community/geolocation';
// //   import AsyncStorage from '@react-native-async-storage/async-storage';

// //   const ERP_BASE_URL = 'https://erpnextcloud.cbditsolutions.com';
// //   const LOCATION_CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes cache validity

// //   const ClockIn = ({ sid, employeeData }) => {
// //     const [clockInTime, setClockInTime] = useState(null);
// //     const [clockOutTime, setClockOutTime] = useState(null);
// //     const [clockInSeconds, setClockInSeconds] = useState(0);
// //     const [totalSeconds, setTotalSeconds] = useState(0);
// //     const [clockInLoading, setClockInLoading] = useState(false);
// //     const [clockOutLoading, setClockOutLoading] = useState(false);
// //     const [locationCache, setLocationCache] = useState(null);
// //     const [clockOutEnabled, setClockOutEnabled] = useState(false);
// //     const [clockInLocation, setClockInLocation] = useState(null);
// //     const [clockOutLocation, setClockOutLocation] = useState(null);
// //     const [locationError, setLocationError] = useState(null);
// //     const [locationName, setLocationName] = useState('Fetching location...');

// //     // Create storage key based on employee ID
// //     const STORAGE_KEY = `employee_clock_data_${employeeData.name}`;

// //     const clockInTimerRef = useRef(null);
// //     const totalTimerRef = useRef(null);

// //     // Load saved data on component mount
// //     useEffect(() => {
// //       const loadData = async () => {
// //         try {
// //           const savedData = await AsyncStorage.getItem(STORAGE_KEY);
// //           if (savedData) {
// //             const { 
// //               employeeId, 
// //               clockInTime: savedClockIn, 
// //               clockOutTime: savedClockOut,
// //               clockInLocation: savedClockInLoc,
// //               clockOutLocation: savedClockOutLoc,
// //               locationName: savedLocationName
// //             } = JSON.parse(savedData);
            
// //             if (employeeId === employeeData.name) {
// //               if (savedClockIn) {
// //                 const clockInDate = new Date(savedClockIn);
// //                 setClockInTime(clockInDate);
                
// //                 if (!savedClockOut) {
// //                   setClockOutEnabled(true);
// //                   const secondsSinceClockIn = Math.floor((new Date() - clockInDate) / 1000);
// //                   setClockInSeconds(secondsSinceClockIn);
// //                 }
// //               }
              
// //               if (savedClockOut) {
// //                 setClockOutTime(new Date(savedClockOut));
// //               }

// //               if (savedClockInLoc) {
// //                 setClockInLocation(savedClockInLoc);
// //               }

// //               if (savedClockOutLoc) {
// //                 setClockOutLocation(savedClockOutLoc);
// //               }

// //               if (savedLocationName) {
// //                 setLocationName(savedLocationName);
// //               }
// //             } else {
// //               await AsyncStorage.removeItem(STORAGE_KEY);
// //             }
// //           }
// //         } catch (error) {
// //           // No console.error here
// //         }
// //       };

// //       loadData();
// //     }, [employeeData.name]);

// //     // Save data whenever it changes
// //     useEffect(() => {
// //       const saveData = async () => {
// //         try {
// //           const dataToSave = {
// //             employeeId: employeeData.name,
// //             clockInTime: clockInTime ? clockInTime.toISOString() : null,
// //             clockOutTime: clockOutTime ? clockOutTime.toISOString() : null,
// //             clockInLocation: clockInLocation,
// //             clockOutLocation: clockOutLocation,
// //             locationName: locationName
// //           };
// //           await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
// //         } catch (error) {
// //           // No console.error here
// //         }
// //       };

// //       saveData();
// //     }, [clockInTime, clockOutTime, clockInLocation, clockOutLocation, locationName, employeeData.name]);

// //     // Timer effects
// //     useEffect(() => {
// //       if (clockInTime && !clockOutTime) {
// //         clockInTimerRef.current = setInterval(() => {
// //           setClockInSeconds(prev => prev + 1);
// //         }, 1000);
// //       } else {
// //         clearInterval(clockInTimerRef.current);
// //         setClockInSeconds(0);
// //       }
// //       return () => clearInterval(clockInTimerRef.current);
// //     }, [clockInTime, clockOutTime]);

// //     useEffect(() => {
// //       if (clockOutTime) {
// //         totalTimerRef.current = setInterval(() => {
// //           setTotalSeconds(prev => prev + 1);
// //         }, 1000);
// //       } else {
// //         clearInterval(totalTimerRef.current);
// //         setTotalSeconds(0);
// //       }
// //       return () => clearInterval(totalTimerRef.current);
// //     }, [clockOutTime]);

// //     const resetClockData = async () => {
// //       clearInterval(clockInTimerRef.current);
// //       clearInterval(totalTimerRef.current);
// //       setClockInTime(null);
// //       setClockOutTime(null);
// //       setClockInSeconds(0);
// //       setTotalSeconds(0);
// //       setClockOutEnabled(false);
// //       setClockInLocation(null);
// //       setClockOutLocation(null);
// //       setLocationError(null);
// //       setLocationName('Fetching location...');
// //       try {
// //         await AsyncStorage.removeItem(STORAGE_KEY);
// //       } catch (error) {
// //         // No console.error here
// //       }
// //     };

// //     const requestLocationPermission = async () => {
// //       if (Platform.OS === 'android') {
// //         try {
// //           const granted = await PermissionsAndroid.request(
// //             PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
// //             {
// //               title: 'Location Permission',
// //               message: 'This app needs access to your location for attendance tracking.',
// //               buttonNeutral: 'Ask Me Later',
// //               buttonNegative: 'Cancel',
// //               buttonPositive: 'OK',
// //             }
// //           );
// //           return granted === PermissionsAndroid.RESULTS.GRANTED;
// //         } catch (err) {
// //           return false;
// //         }
// //       }
// //       return true;
// //     };

// //     const getLocationName = async (latitude, longitude) => {
// //       try {
// //         const response = await fetch(
// //           `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
// //         );
        
// //         const data = await response.json();
        
// //         if (!data || !data.address) {
// //           return `Nearby location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
// //         }
        
// //         const address = data.address;
// //         const addressComponents = [];
        
// //         // Add relevant address components in order of specificity
// //         if (address.road) addressComponents.push(address.road);
// //         if (address.neighbourhood) addressComponents.push(address.neighbourhood);
// //         if (address.suburb) addressComponents.push(address.suburb);
// //         if (address.city_district) addressComponents.push(address.city_district);
// //         if (address.city) addressComponents.push(address.city);
// //         if (address.town) addressComponents.push(address.town);
// //         if (address.village) addressComponents.push(address.village);
// //         if (address.county) addressComponents.push(address.county);
// //         if (address.state) addressComponents.push(address.state);
// //         if (address.country) addressComponents.push(address.country);
        
// //         // If we have no specific address, try to use the display_name
// //         if (addressComponents.length === 0 && data.display_name) {
// //           return data.display_name.split(',')[0] || `Nearby location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
// //         }
        
// //         // Join the address components with commas and clean up
// //         let locationName = addressComponents.join(', ');
// //         locationName = locationName.replace(/, ,/g, ',').replace(/, $/, '');
        
// //         return locationName || `Nearby location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
// //       } catch (error) {
// //         return `Nearby location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
// //       }
// //     };

// //     const getQuickLocation = async () => {
// //       return new Promise((resolve, reject) => {
// //         Geolocation.getCurrentPosition(
// //           position => resolve(position.coords),
// //           error => reject(error),
// //           {
// //             enableHighAccuracy: false,
// //             timeout: 7000,
// //             maximumAge: 30000
// //           }
// //         );
// //       });
// //     };

// //     const getLocationWithFallback = async () => {
// //       setLocationError(null);
// //       setLocationName('Getting location...');
      
// //       try {
// //         const coords = await getQuickLocation();
// //         setLocationCache({ coords, timestamp: Date.now() });
        
// //         // Get location name
// //         const name = await getLocationName(coords.latitude, coords.longitude);
// //         setLocationName(name);
        
// //         return coords;
// //       } catch (error) {
// //         if (locationCache && (Date.now() - locationCache.timestamp) < LOCATION_CACHE_EXPIRY) {
// //           const name = await getLocationName(locationCache.coords.latitude, locationCache.coords.longitude);
// //           setLocationName(name);
// //           return locationCache.coords;
// //         }
        
// //         throw new Error('Could not determine your location. Please ensure you have GPS signal.');
// //       }
// //     };

// //     const formatTimeForERP = (date) => {
// //       return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
// //     };

// //     const formatLocation = (coords) => {
// //       if (!coords) return 'Location not available';
// //       return locationName;
// //     };

// //     const submitClockIn = async (coords) => {
// //       const now = new Date();
// //       const timeString = formatTimeForERP(now);
      
// //       try {
// //         const res = await fetch(`${ERP_BASE_URL}/api/resource/Employee Checkin`, {
// //           method: 'POST',
// //           headers: {
// //             'Content-Type': 'application/json',
// //             Cookie: `sid=${sid}`,
// //           },
// //           body: JSON.stringify({
// //             employee: employeeData.name,
// //             log_type: 'IN',
// //             time: timeString,
// //             latitude: coords.latitude,
// //             longitude: coords.longitude,
// //             accuracy: coords.accuracy,
// //           }),
// //         });

// //         if (!res.ok) {
// //           const errText = await res.text();
// //           throw new Error(`Failed to clock in: ${errText}`);
// //         }

// //         return now;
// //       } catch (error) {
// //         throw error;
// //       }
// //     };

// //     const submitClockOut = async (coords) => {
// //       const now = new Date();
// //       const timeString = formatTimeForERP(now);
      
// //       try {
// //         const res = await fetch(`${ERP_BASE_URL}/api/resource/Employee Checkin`, {
// //           method: 'POST',
// //           headers: {
// //             'Content-Type': 'application/json',
// //             Cookie: `sid=${sid}`,
// //           },
// //           body: JSON.stringify({
// //             employee: employeeData.name,
// //             log_type: 'OUT',
// //             time: timeString,
// //             latitude: coords.latitude,
// //             longitude: coords.longitude,
// //             accuracy: coords.accuracy,
// //           }),
// //         });

// //         if (!res.ok) {
// //           const errText = await res.text();
// //           throw new Error(`Failed to clock out: ${errText}`);
// //         }

// //         return now;
// //       } catch (error) {
// //         throw error;
// //       }
// //     };

// //     const handleClockIn = async () => {
// //       if (clockInLoading) return;

// //       const hasPermission = await requestLocationPermission();
// //       if (!hasPermission) {
// //         Alert.alert('Permission denied', 'Location permission is required to clock in.');
// //         return;
// //       }

// //       setClockInLoading(true);
// //       setLocationError(null);
      
// //       try {
// //         const coords = await getLocationWithFallback();
// //         const serverTime = await submitClockIn(coords);
        
// //         setClockInTime(serverTime);
// //         setClockInLocation(coords);
// //         setClockOutTime(null);
// //         setClockOutEnabled(true);
        
// //         Alert.alert('Success', 'Clock-in recorded successfully.');
// //       } catch (error) {
// //         setLocationError(error.message);
// //         Alert.alert('Error', error.message);
// //       } finally {
// //         setClockInLoading(false);
// //       }
// //     };

// //     const handleClockOut = async () => {
// //       if (clockOutLoading) return;

// //       setClockOutLoading(true);
// //       setLocationError(null);
      
// //       try {
// //         const coords = await getLocationWithFallback();
// //         const serverTime = await submitClockOut(coords);
        
// //         setClockOutTime(serverTime);
// //         setClockOutLocation(coords);
// //         setClockOutEnabled(false);
        
// //         Alert.alert('Success', 'Clock-out recorded successfully.');
// //       } catch (error) {
// //         setLocationError(error.message);
        
// //         if (locationCache && (Date.now() - locationCache.timestamp) < LOCATION_CACHE_EXPIRY * 2) {
// //           const useCached = await new Promise(resolve => {
// //             Alert.alert(
// //               'Location Error',
// //               'Could not get fresh location. Would you like to use your last known location?',
// //               [
// //                 { text: 'Cancel', onPress: () => resolve(false), style: 'cancel' },
// //                 { text: 'Use Cached', onPress: () => resolve(true) }
// //               ]
// //             );
// //           });
          
// //           if (useCached) {
// //             const serverTime = await submitClockOut(locationCache.coords);
// //             setClockOutTime(serverTime);
// //             setClockOutLocation(locationCache.coords);
// //             setClockOutEnabled(false);
// //             Alert.alert('Success', 'Clock-out recorded with cached location.');
// //             return;
// //           }
// //         }
        
// //         Alert.alert('Error', error.message);
// //       } finally {
// //         setClockOutLoading(false);
// //       }
// //     };

// //     const formatTime = (seconds) => {
// //       const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
// //       const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
// //       const s = (seconds % 60).toString().padStart(2, '0');
// //       return `${h}:${m}:${s}`;
// //     };

// //     const getTotalTime = () => {
// //       if (!clockInTime || !clockOutTime) return '00:00:00';
// //       const diffMs = clockOutTime - clockInTime;
// //       return formatTime(Math.floor(diffMs / 1000));
// //     };

// //     return (
// //       <View style={styles.outerContainer}>
// //         <View style={styles.container}>
// //           <TouchableOpacity
// //             style={[styles.button, clockInLoading || clockOutEnabled ? styles.buttonDisabled : {}]}
// //             onPress={handleClockIn}
// //             disabled={clockInLoading || clockOutEnabled}
// //           >
// //             <Ionicons name="time-outline" size={28} color="#4CAF50" />
// //             {clockInLoading ? (
// //               <ActivityIndicator color="#4CAF50" style={{ marginLeft: 12 }} />
// //             ) : (
// //               <Text style={styles.buttonText}>Clock In</Text>
// //             )}
// //           </TouchableOpacity>

// //           <View style={styles.timeContainer}>
// //             <Text style={styles.timeLabel}>Clock In Time:</Text>
// //             <Text style={styles.timeText}>
// //               {clockInTime ? clockInTime.toLocaleTimeString() : '--:--:--'}
// //             </Text>
// //             <Text style={styles.timerText}>Timer: {formatTime(clockInSeconds)}</Text>
// //             <Text style={styles.locationText}>
// //               {clockInLocation ? formatLocation(clockInLocation) : ''}
// //             </Text>
// //             {locationError && clockInLoading && (
// //               <Text style={styles.errorText}>{locationError}</Text>
// //             )}
// //           </View>
// //         </View>

// //         <View style={styles.container}>
// //           <TouchableOpacity
// //             style={[styles.button, !clockOutEnabled || clockOutLoading ? styles.buttonDisabled : {}]}
// //             onPress={handleClockOut}
// //             disabled={!clockOutEnabled || clockOutLoading}
// //           >
// //             <Ionicons name="exit-outline" size={28} color="#f44336" />
// //             {clockOutLoading ? (
// //               <ActivityIndicator color="#f44336" style={{ marginLeft: 12 }} />
// //             ) : (
// //               <Text style={[styles.buttonText, { color: '#f44336' }]}>Clock Out</Text>
// //             )}
// //           </TouchableOpacity>

// //           <View style={styles.timeContainer}>
// //             <Text style={styles.timeLabel}>Clock Out Time:</Text>
// //             <Text style={styles.timeText}>
// //               {clockOutTime ? clockOutTime.toLocaleTimeString() : '--:--:--'}
// //             </Text>
// //             <Text style={styles.timerText}>Total Time: {getTotalTime()}</Text>
// //             <Text style={styles.locationText}>
// //               {clockOutLocation ? formatLocation(clockOutLocation) : ''}
// //             </Text>
// //             {locationError && clockOutLoading && (
// //               <Text style={styles.errorText}>{locationError}</Text>
// //             )}
// //           </View>
// //         </View>
// //       </View>
// //     );
// //   };

// //   const styles = StyleSheet.create({
// //     outerContainer: {
// //       flex: 1,
// //       padding: 20,
// //       backgroundColor: '#f8f9fa',
// //       justifyContent: 'center',
// //     },
// //     container: {
// //       backgroundColor: '#fff',
// //       padding: 20,
// //       marginVertical: 10,
// //       borderRadius: 12,
// //       alignItems: 'center',
// //       elevation: 2,
// //       borderWidth: 2,
// //       borderColor: 'skyblue',
// //     },
// //     button: {
// //       flexDirection: 'row',
// //       alignItems: 'center',
// //       paddingHorizontal: 28,
// //       paddingVertical: 14,
// //       borderRadius: 30,
// //       borderWidth: 2,
// //       borderColor: '#4CAF50',
// //     },
// //     buttonDisabled: {
// //       borderColor: '#bbb',
// //     },
// //     buttonText: {
// //       marginLeft: 10,
// //       fontSize: 18,
// //       fontWeight: '600',
// //       color: '#4CAF50',
// //     },
// //     timeContainer: {
// //       marginTop: 16,
// //       alignItems: 'center',
// //     },
// //     timeLabel: {
// //       fontSize: 19,
// //       color: '#555',
// //     },
// //     timeText: {
// //       fontSize: 20,
// //       color: '#222',
// //     },
// //     timerText: {
// //       marginTop: 6,
// //       fontSize: 16,
// //       color: 'skyblue',
// //     },
// //     locationText: {
// //       marginTop: 6,
// //       fontSize: 14,
// //       color: '#666',
// //       textAlign: 'center',
// //     },
// //     errorText: {
// //       marginTop: 6,
// //       fontSize: 14,
// //       color: '#f44336',
// //       textAlign: 'center',
// //     },
// //   });

// //   export default ClockIn;  


// /////////**************   show all data correctly    ********* */   


// // import React, { useState, useEffect, useRef } from 'react';
// // import {
// //   View,
// //   Text,
// //   TouchableOpacity,
// //   StyleSheet,
// //   Alert,
// //   ActivityIndicator,
// //   Platform,
// //   PermissionsAndroid,
// // } from 'react-native';
// // import Ionicons from 'react-native-vector-icons/Ionicons';
// // import Geolocation from '@react-native-community/geolocation';
// // import AsyncStorage from '@react-native-async-storage/async-storage';

// // const ERP_BASE_URL = 'https://erpnextcloud.cbditsolutions.com';
// // const LOCATION_CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes cache validity

// // const ClockIn = ({ sid, employeeData }) => {
// //   const [clockInTime, setClockInTime] = useState(null);
// //   const [clockOutTime, setClockOutTime] = useState(null);
// //   const [clockInSeconds, setClockInSeconds] = useState(0);
// //   const [totalSeconds, setTotalSeconds] = useState(0);
// //   const [clockInLoading, setClockInLoading] = useState(false);
// //   const [clockOutLoading, setClockOutLoading] = useState(false);
// //   const [locationCache, setLocationCache] = useState(null);
// //   const [clockOutEnabled, setClockOutEnabled] = useState(false);
// //   const [clockInLocation, setClockInLocation] = useState(null);
// //   const [clockOutLocation, setClockOutLocation] = useState(null);
// //   const [locationError, setLocationError] = useState(null);
// //   const [clockInLocationName, setClockInLocationName] = useState('');
// //   const [clockOutLocationName, setClockOutLocationName] = useState('');

// //   // Create storage key based on employee ID
// //   const STORAGE_KEY = `employee_clock_data_${employeeData.name}`;

// //   const clockInTimerRef = useRef(null);
// //   const totalTimerRef = useRef(null);

// //   // Load saved data on component mount
// //   useEffect(() => {
// //     const loadData = async () => {
// //       try {
// //         const savedData = await AsyncStorage.getItem(STORAGE_KEY);
// //         if (savedData) {
// //           const { 
// //             employeeId, 
// //             clockInTime: savedClockIn, 
// //             clockOutTime: savedClockOut,
// //             clockInLocation: savedClockInLoc,
// //             clockOutLocation: savedClockOutLoc,
// //             clockInLocationName: savedClockInLocName,
// //             clockOutLocationName: savedClockOutLocName
// //           } = JSON.parse(savedData);
          
// //           if (employeeId === employeeData.name) {
// //             if (savedClockIn) {
// //               const clockInDate = new Date(savedClockIn);
// //               setClockInTime(clockInDate);
              
// //               if (!savedClockOut) {
// //                 setClockOutEnabled(true);
// //                 const secondsSinceClockIn = Math.floor((new Date() - clockInDate) / 1000);
// //                 setClockInSeconds(secondsSinceClockIn);
// //               }
// //             }
            
// //             if (savedClockOut) {
// //               setClockOutTime(new Date(savedClockOut));
// //             }

// //             if (savedClockInLoc) {
// //               setClockInLocation(savedClockInLoc);
// //             }

// //             if (savedClockOutLoc) {
// //               setClockOutLocation(savedClockOutLoc);
// //             }

// //             if (savedClockInLocName) {
// //               setClockInLocationName(savedClockInLocName);
// //             }

// //             if (savedClockOutLocName) {
// //               setClockOutLocationName(savedClockOutLocName);
// //             }
// //           } else {
// //             await AsyncStorage.removeItem(STORAGE_KEY);
// //           }
// //         }
// //       } catch (error) {
// //         // No console.error here
// //       }
// //     };

// //     loadData();
// //   }, [employeeData.name]);

// //   // Save data whenever it changes
// //   useEffect(() => {
// //     const saveData = async () => {
// //       try {
// //         const dataToSave = {
// //           employeeId: employeeData.name,
// //           clockInTime: clockInTime ? clockInTime.toISOString() : null,
// //           clockOutTime: clockOutTime ? clockOutTime.toISOString() : null,
// //           clockInLocation: clockInLocation,
// //           clockOutLocation: clockOutLocation,
// //           clockInLocationName: clockInLocationName,
// //           clockOutLocationName: clockOutLocationName
// //         };
// //         await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
// //       } catch (error) {
// //         // No console.error here
// //       }
// //     };

// //     saveData();
// //   }, [clockInTime, clockOutTime, clockInLocation, clockOutLocation, clockInLocationName, clockOutLocationName, employeeData.name]);

// //   // Timer effects
// //   useEffect(() => {
// //     if (clockInTime && !clockOutTime) {
// //       clockInTimerRef.current = setInterval(() => {
// //         setClockInSeconds(prev => prev + 1);
// //       }, 1000);
// //     } else {
// //       clearInterval(clockInTimerRef.current);
// //       setClockInSeconds(0);
// //     }
// //     return () => clearInterval(clockInTimerRef.current);
// //   }, [clockInTime, clockOutTime]);

// //   useEffect(() => {
// //     if (clockOutTime) {
// //       totalTimerRef.current = setInterval(() => {
// //         setTotalSeconds(prev => prev + 1);
// //       }, 1000);
// //     } else {
// //       clearInterval(totalTimerRef.current);
// //       setTotalSeconds(0);
// //     }
// //     return () => clearInterval(totalTimerRef.current);
// //   }, [clockOutTime]);

// //   const requestLocationPermission = async () => {
// //     if (Platform.OS === 'android') {
// //       try {
// //         const granted = await PermissionsAndroid.request(
// //           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
// //           {
// //             title: 'Location Permission',
// //             message: 'This app needs access to your location for attendance tracking.',
// //             buttonNeutral: 'Ask Me Later',
// //             buttonNegative: 'Cancel',
// //             buttonPositive: 'OK',
// //           }
// //         );
// //         return granted === PermissionsAndroid.RESULTS.GRANTED;
// //       } catch (err) {
// //         return false;
// //       }
// //     }
// //     return true;
// //   };

// //   const getLocationName = async (latitude, longitude) => {
// //     try {
// //       const response = await fetch(
// //         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
// //       );
      
// //       const data = await response.json();
      
// //       if (!data || !data.display_name) {
// //         return `Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
// //       }
      
// //       return data.display_name;
// //     } catch (error) {
// //       return `Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
// //     }
// //   };

// //   const getQuickLocation = async () => {
// //     return new Promise((resolve, reject) => {
// //       Geolocation.getCurrentPosition(
// //         position => resolve(position.coords),
// //         error => reject(error),
// //         {
// //           enableHighAccuracy: false,
// //           timeout: 7000,
// //           maximumAge: 30000
// //         }
// //       );
// //     });
// //   };

// //   const getLocationWithFallback = async () => {
// //     setLocationError(null);
    
// //     try {
// //       const coords = await getQuickLocation();
// //       setLocationCache({ coords, timestamp: Date.now() });
      
// //       // Get location name
// //       const name = await getLocationName(coords.latitude, coords.longitude);
      
// //       return {
// //         coords,
// //         name
// //       };
// //     } catch (error) {
// //       if (locationCache && (Date.now() - locationCache.timestamp) < LOCATION_CACHE_EXPIRY) {
// //         const name = await getLocationName(locationCache.coords.latitude, locationCache.coords.longitude);
// //         return {
// //           coords: locationCache.coords,
// //           name
// //         };
// //       }
      
// //       throw new Error('Could not determine your location. Please ensure you have GPS signal.');
// //     }
// //   };

// //   const formatTimeForERP = (date) => {
// //     return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
// //   };

// //   const submitClockIn = async (coords) => {
// //     const now = new Date();
// //     const timeString = formatTimeForERP(now);
    
// //     try {
// //       const res = await fetch(`${ERP_BASE_URL}/api/resource/Employee Checkin`, {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           Cookie: `sid=${sid}`,
// //         },
// //         body: JSON.stringify({
// //           employee: employeeData.name,
// //           log_type: 'IN',
// //           time: timeString,
// //           latitude: coords.latitude,
// //           longitude: coords.longitude,
// //           accuracy: coords.accuracy,
// //         }),
// //       });

// //       if (!res.ok) {
// //         const errText = await res.text();
// //         throw new Error(`Failed to clock in: ${errText}`);
// //       }

// //       return now;
// //     } catch (error) {
// //       throw error;
// //     }
// //   };

// //   const submitClockOut = async (coords) => {
// //     const now = new Date();
// //     const timeString = formatTimeForERP(now);
    
// //     try {
// //       const res = await fetch(`${ERP_BASE_URL}/api/resource/Employee Checkin`, {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           Cookie: `sid=${sid}`,
// //         },
// //         body: JSON.stringify({
// //           employee: employeeData.name,
// //           log_type: 'OUT',
// //           time: timeString,
// //           latitude: coords.latitude,
// //           longitude: coords.longitude,
// //           accuracy: coords.accuracy,
// //         }),
// //       });

// //       if (!res.ok) {
// //         const errText = await res.text();
// //         throw new Error(`Failed to clock out: ${errText}`);
// //       }

// //       return now;
// //     } catch (error) {
// //       throw error;
// //     }
// //   };

// //   const handleClockIn = async () => {
// //     if (clockInLoading) return;

// //     const hasPermission = await requestLocationPermission();
// //     if (!hasPermission) {
// //       Alert.alert('Permission denied', 'Location permission is required to clock in.');
// //       return;
// //     }

// //     setClockInLoading(true);
// //     setLocationError(null);
    
// //     try {
// //       const { coords, name } = await getLocationWithFallback();
// //       const serverTime = await submitClockIn(coords);
      
// //       setClockInTime(serverTime);
// //       setClockInLocation(coords);
// //       setClockInLocationName(name);
// //       setClockOutTime(null);
// //       setClockOutEnabled(true);
      
// //       Alert.alert('Success', 'Clock-in recorded successfully.');
// //     } catch (error) {
// //       setLocationError(error.message);
// //       Alert.alert('Error', error.message);
// //     } finally {
// //       setClockInLoading(false);
// //     }
// //   };

// //   const handleClockOut = async () => {
// //     if (clockOutLoading) return;

// //     setClockOutLoading(true);
// //     setLocationError(null);
    
// //     try {
// //       const { coords, name } = await getLocationWithFallback();
// //       const serverTime = await submitClockOut(coords);
      
// //       setClockOutTime(serverTime);
// //       setClockOutLocation(coords);
// //       setClockOutLocationName(name);
// //       setClockOutEnabled(false);
      
// //       Alert.alert('Success', 'Clock-out recorded successfully.');
// //     } catch (error) {
// //       setLocationError(error.message);
      
// //       if (locationCache && (Date.now() - locationCache.timestamp) < LOCATION_CACHE_EXPIRY * 2) {
// //         const useCached = await new Promise(resolve => {
// //           Alert.alert(
// //             'Location Error',
// //             'Could not get fresh location. Would you like to use your last known location?',
// //             [
// //               { text: 'Cancel', onPress: () => resolve(false), style: 'cancel' },
// //               { text: 'Use Cached', onPress: () => resolve(true) }
// //             ]
// //           );
// //         });
        
// //         if (useCached) {
// //           const name = await getLocationName(locationCache.coords.latitude, locationCache.coords.longitude);
// //           const serverTime = await submitClockOut(locationCache.coords);
// //           setClockOutTime(serverTime);
// //           setClockOutLocation(locationCache.coords);
// //           setClockOutLocationName(name);
// //           setClockOutEnabled(false);
// //           Alert.alert('Success', 'Clock-out recorded with cached location.');
// //           return;
// //         }
// //       }
      
// //       Alert.alert('Error', error.message);
// //     } finally {
// //       setClockOutLoading(false);
// //     }
// //   };

// //   const formatTime = (seconds) => {
// //     const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
// //     const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
// //     const s = (seconds % 60).toString().padStart(2, '0');
// //     return `${h}:${m}:${s}`;
// //   };

// //   const getTotalTime = () => {
// //     if (!clockInTime || !clockOutTime) return '00:00:00';
// //     const diffMs = clockOutTime - clockInTime;
// //     return formatTime(Math.floor(diffMs / 1000));
// //   };

// //   return (
// //     <View style={styles.outerContainer}>
// //       <View style={styles.container}>
// //         <TouchableOpacity
// //           style={[styles.button, clockInLoading || clockOutEnabled ? styles.buttonDisabled : {}]}
// //           onPress={handleClockIn}
// //           disabled={clockInLoading || clockOutEnabled}
// //         >
// //           <Ionicons name="time-outline" size={28} color="#4CAF50" />
// //           {clockInLoading ? (
// //             <ActivityIndicator color="#4CAF50" style={{ marginLeft: 12 }} />
// //           ) : (
// //             <Text style={styles.buttonText}>Clock In</Text>
// //           )}
// //         </TouchableOpacity>

// //         <View style={styles.timeContainer}>
// //           <Text style={styles.timeLabel}>Clock In Time:</Text>
// //           <Text style={styles.timeText}>
// //             {clockInTime ? clockInTime.toLocaleTimeString() : '--:--:--'}
// //           </Text>
// //           <Text style={styles.timerText}>Timer: {formatTime(clockInSeconds)}</Text>
// //           <Text style={styles.locationText}>
// //             {clockInLocationName || ''}
// //           </Text>
// //           {locationError && clockInLoading && (
// //             <Text style={styles.errorText}>{locationError}</Text>
// //           )}
// //         </View>
// //       </View>

// //       <View style={styles.container}>
// //         <TouchableOpacity
// //           style={[styles.button, !clockOutEnabled || clockOutLoading ? styles.buttonDisabled : {}]}
// //           onPress={handleClockOut}
// //           disabled={!clockOutEnabled || clockOutLoading}
// //         >
// //           <Ionicons name="exit-outline" size={28} color="#f44336" />
// //           {clockOutLoading ? (
// //             <ActivityIndicator color="#f44336" style={{ marginLeft: 12 }} />
// //           ) : (
// //             <Text style={[styles.buttonText, { color: '#f44336' }]}>Clock Out</Text>
// //           )}
// //         </TouchableOpacity>

// //         <View style={styles.timeContainer}>
// //           <Text style={styles.timeLabel}>Clock Out Time:</Text>
// //           <Text style={styles.timeText}>
// //             {clockOutTime ? clockOutTime.toLocaleTimeString() : '--:--:--'}
// //           </Text>
// //           <Text style={styles.timerText}>Total Time: {getTotalTime()}</Text>
// //           <Text style={styles.locationText}>
// //             {clockOutLocationName || ''}
// //           </Text>
// //           {locationError && clockOutLoading && (
// //             <Text style={styles.errorText}>{locationError}</Text>
// //           )}
// //         </View>
// //       </View>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   outerContainer: {
// //     flex: 1,
// //     padding: 20,
// //     backgroundColor: '#f8f9fa',
// //     justifyContent: 'center',
// //   },
// //   container: {
// //     backgroundColor: '#fff',
// //     padding: 20,
// //     marginVertical: 10,
// //     borderRadius: 12,
// //     alignItems: 'center',
// //     elevation: 2,
// //     borderWidth: 2,
// //     borderColor: 'skyblue',
// //   },
// //   button: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingHorizontal: 28,
// //     paddingVertical: 14,
// //     borderRadius: 30,
// //     borderWidth: 2,
// //     borderColor: '#4CAF50',
// //   },
// //   buttonDisabled: {
// //     borderColor: '#bbb',
// //   },
// //   buttonText: {
// //     marginLeft: 10,
// //     fontSize: 18,
// //     fontWeight: '600',
// //     color: '#4CAF50',
// //   },
// //   timeContainer: {
// //     marginTop: 16,
// //     alignItems: 'center',
// //   },
// //   timeLabel: {
// //     fontSize: 19,
// //     color: '#555',
// //   },
// //   timeText: {
// //     fontSize: 20,
// //     color: '#222',
// //   },
// //   timerText: {
// //     marginTop: 6,
// //     fontSize: 16,
// //     color: 'skyblue',
// //   },
// //   locationText: {
// //     marginTop: 6,
// //     fontSize: 14,
// //     color: '#666',
// //     textAlign: 'center',
// //   },
// //   errorText: {
// //     marginTop: 6,
// //     fontSize: 14,
// //     color: '#f44336',
// //     textAlign: 'center',
// //   },
// // });

// // export default ClockIn;






// // import React, { useState, useEffect, useRef } from 'react';
// // import {
// //   View,
// //   Text,
// //   TouchableOpacity,
// //   StyleSheet,
// //   Alert,
// //   ActivityIndicator,
// //   Platform,
// //   PermissionsAndroid,
// // } from 'react-native';
// // import Ionicons from 'react-native-vector-icons/Ionicons';
// // import Geolocation from '@react-native-community/geolocation';
// // import AsyncStorage from '@react-native-async-storage/async-storage';

// // const ERP_BASE_URL = 'https://erpnextcloud.cbditsolutions.com';
// // const LOCATION_CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes cache validity

// // const ClockIn = ({ sid, employeeData }) => {
// //   const [clockInTime, setClockInTime] = useState(null);
// //   const [clockOutTime, setClockOutTime] = useState(null);
// //   const [clockInSeconds, setClockInSeconds] = useState(0);
// //   const [clockInLoading, setClockInLoading] = useState(false);
// //   const [clockOutLoading, setClockOutLoading] = useState(false);
// //   const [locationCache, setLocationCache] = useState(null);
// //   const [clockInLocation, setClockInLocation] = useState(null);
// //   const [clockOutLocation, setClockOutLocation] = useState(null);
// //   const [locationError, setLocationError] = useState(null);
// //   const [locationName, setLocationName] = useState('Fetching location...');

// //   // Create storage key based on employee ID
// //   const STORAGE_KEY = `employee_clock_data_${employeeData.name}`;

// //   const clockInTimerRef = useRef(null);

// //   // Load saved data on component mount
// //   useEffect(() => {
// //     const loadData = async () => {
// //       try {
// //         const savedData = await AsyncStorage.getItem(STORAGE_KEY);
// //         if (savedData) {
// //           const { 
// //             employeeId, 
// //             clockInTime: savedClockIn, 
// //             clockOutTime: savedClockOut,
// //             clockInLocation: savedClockInLoc,
// //             clockOutLocation: savedClockOutLoc,
// //             locationName: savedLocationName
// //           } = JSON.parse(savedData);
          
// //           if (employeeId === employeeData.name) {
// //             if (savedClockIn) {
// //               const clockInDate = new Date(savedClockIn);
// //               setClockInTime(clockInDate);
              
// //               if (!savedClockOut) {
// //                 const secondsSinceClockIn = Math.floor((new Date() - clockInDate) / 1000);
// //                 setClockInSeconds(secondsSinceClockIn);
// //               }
// //             }
            
// //             if (savedClockOut) {
// //               setClockOutTime(new Date(savedClockOut));
// //             }

// //             if (savedClockInLoc) {
// //               setClockInLocation(savedClockInLoc);
// //             }

// //             if (savedClockOutLoc) {
// //               setClockOutLocation(savedClockOutLoc);
// //             }

// //             if (savedLocationName) {
// //               setLocationName(savedLocationName);
// //             }
// //           } else {
// //             await AsyncStorage.removeItem(STORAGE_KEY);
// //           }
// //         }
// //       } catch (error) {
// //         // Error handling
// //       }
// //     };

// //     loadData();
// //   }, [employeeData.name]);

// //   // Save data whenever it changes
// //   useEffect(() => {
// //     const saveData = async () => {
// //       try {
// //         const dataToSave = {
// //           employeeId: employeeData.name,
// //           clockInTime: clockInTime ? clockInTime.toISOString() : null,
// //           clockOutTime: clockOutTime ? clockOutTime.toISOString() : null,
// //           clockInLocation: clockInLocation,
// //           clockOutLocation: clockOutLocation,
// //           locationName: locationName
// //         };
// //         await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
// //       } catch (error) {
// //         // Error handling
// //       }
// //     };

// //     saveData();
// //   }, [clockInTime, clockOutTime, clockInLocation, clockOutLocation, locationName, employeeData.name]);

// //   // Timer effect
// //   useEffect(() => {
// //     if (clockInTime && !clockOutTime) {
// //       clockInTimerRef.current = setInterval(() => {
// //         setClockInSeconds(prev => prev + 1);
// //       }, 1000);
// //     } else {
// //       clearInterval(clockInTimerRef.current);
// //       setClockInSeconds(0);
// //     }
// //     return () => clearInterval(clockInTimerRef.current);
// //   }, [clockInTime, clockOutTime]);

// //   const resetClockData = async () => {
// //     clearInterval(clockInTimerRef.current);
// //     setClockInTime(null);
// //     setClockOutTime(null);
// //     setClockInSeconds(0);
// //     setClockInLocation(null);
// //     setClockOutLocation(null);
// //     setLocationError(null);
// //     setLocationName('Fetching location...');
// //     try {
// //       await AsyncStorage.removeItem(STORAGE_KEY);
// //     } catch (error) {
// //       // Error handling
// //     }
// //   };

// //   const requestLocationPermission = async () => {
// //     if (Platform.OS === 'android') {
// //       try {
// //         const granted = await PermissionsAndroid.request(
// //           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
// //           {
// //             title: 'Location Permission',
// //             message: 'This app needs access to your location for attendance tracking.',
// //             buttonNeutral: 'Ask Me Later',
// //             buttonNegative: 'Cancel',
// //             buttonPositive: 'OK',
// //           }
// //         );
// //         return granted === PermissionsAndroid.RESULTS.GRANTED;
// //       } catch (err) {
// //         return false;
// //       }
// //     }
// //     return true;
// //   };

// //   const getLocationName = async (latitude, longitude) => {
// //     try {
// //       const response = await fetch(
// //         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
// //       );
      
// //       const data = await response.json();
      
// //       if (!data || !data.address) {
// //         return `Nearby location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
// //       }
      
// //       const address = data.address;
// //       const addressComponents = [];
      
// //       if (address.road) addressComponents.push(address.road);
// //       if (address.neighbourhood) addressComponents.push(address.neighbourhood);
// //       if (address.suburb) addressComponents.push(address.suburb);
// //       if (address.city_district) addressComponents.push(address.city_district);
// //       if (address.city) addressComponents.push(address.city);
// //       if (address.town) addressComponents.push(address.town);
// //       if (address.village) addressComponents.push(address.village);
// //       if (address.county) addressComponents.push(address.county);
// //       if (address.state) addressComponents.push(address.state);
// //       if (address.country) addressComponents.push(address.country);
      
// //       if (addressComponents.length === 0 && data.display_name) {
// //         return data.display_name.split(',')[0] || `Nearby location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
// //       }
      
// //       let locationName = addressComponents.join(', ');
// //       locationName = locationName.replace(/, ,/g, ',').replace(/, $/, '');
      
// //       return locationName || `Nearby location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
// //     } catch (error) {
// //       return `Nearby location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
// //     }
// //   };

// //   const getQuickLocation = async () => {
// //     return new Promise((resolve, reject) => {
// //       Geolocation.getCurrentPosition(
// //         position => resolve(position.coords),
// //         error => reject(error),
// //         {
// //           enableHighAccuracy: false,
// //           timeout: 7000,
// //           maximumAge: 30000
// //         }
// //       );
// //     });
// //   };

// //   const getLocationWithFallback = async () => {
// //     setLocationError(null);
// //     setLocationName('Getting location...');
    
// //     try {
// //       const coords = await getQuickLocation();
// //       setLocationCache({ coords, timestamp: Date.now() });
      
// //       const name = await getLocationName(coords.latitude, coords.longitude);
// //       setLocationName(name);
      
// //       return coords;
// //     } catch (error) {
// //       if (locationCache && (Date.now() - locationCache.timestamp) < LOCATION_CACHE_EXPIRY) {
// //         const name = await getLocationName(locationCache.coords.latitude, locationCache.coords.longitude);
// //         setLocationName(name);
// //         return locationCache.coords;
// //       }
      
// //       throw new Error('Could not determine your location. Please ensure you have GPS signal.');
// //     }
// //   };

// //   const formatTimeForERP = (date) => {
// //     return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
// //   };

// //   const formatLocation = (coords) => {
// //     if (!coords) return 'Location not available';
// //     return locationName;
// //   };

// //   const formatTime = (seconds) => {
// //     const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
// //     const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
// //     const s = (seconds % 60).toString().padStart(2, '0');
// //     return `${h}:${m}:${s}`;
// //   };

// //   const getTotalTime = () => {
// //     if (!clockInTime || !clockOutTime) return '00:00:00';
// //     const diffMs = clockOutTime - clockInTime;
// //     return formatTime(Math.floor(diffMs / 1000));
// //   };

// //   const submitClockIn = async (coords) => {
// //     const now = new Date();
// //     const timeString = formatTimeForERP(now);
    
// //     try {
// //       const res = await fetch(`${ERP_BASE_URL}/api/resource/Employee Checkin`, {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           Cookie: `sid=${sid}`,
// //         },
// //         body: JSON.stringify({
// //           employee: employeeData.name,
// //           log_type: 'IN',
// //           time: timeString,
// //           latitude: coords.latitude,
// //           longitude: coords.longitude,
// //           accuracy: coords.accuracy,
// //         }),
// //       });

// //       if (!res.ok) {
// //         const errText = await res.text();
// //         throw new Error(`Failed to clock in: ${errText}`);
// //       }

// //       return now;
// //     } catch (error) {
// //       throw error;
// //     }
// //   };

// //   const submitClockOut = async (coords) => {
// //     const now = new Date();
// //     const timeString = formatTimeForERP(now);
    
// //     try {
// //       const res = await fetch(`${ERP_BASE_URL}/api/resource/Employee Checkin`, {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           Cookie: `sid=${sid}`,
// //         },
// //         body: JSON.stringify({
// //           employee: employeeData.name,
// //           log_type: 'OUT',
// //           time: timeString,
// //           latitude: coords.latitude,
// //           longitude: coords.longitude,
// //           accuracy: coords.accuracy,
// //         }),
// //       });

// //       if (!res.ok) {
// //         const errText = await res.text();
// //         throw new Error(`Failed to clock out: ${errText}`);
// //       }

// //       return now;
// //     } catch (error) {
// //       throw error;
// //     }
// //   };

// //   const handleClockIn = async () => {
// //     if (clockInLoading) return;

// //     const hasPermission = await requestLocationPermission();
// //     if (!hasPermission) {
// //       Alert.alert('Permission denied', 'Location permission is required to clock in.');
// //       return;
// //     }

// //     setClockInLoading(true);
// //     setLocationError(null);
    
// //     try {
// //       const coords = await getLocationWithFallback();
// //       const serverTime = await submitClockIn(coords);
      
// //       setClockInTime(serverTime);
// //       setClockInLocation(coords);
// //       setClockOutTime(null);
      
// //       Alert.alert('Success', 'Clock-in recorded successfully.');
// //     } catch (error) {
// //       setLocationError(error.message);
// //       Alert.alert('Error', error.message);
// //     } finally {
// //       setClockInLoading(false);
// //     }
// //   };

// //   const handleClockOut = async () => {
// //     if (clockOutLoading) return;

// //     setClockOutLoading(true);
// //     setLocationError(null);
    
// //     try {
// //       const coords = await getLocationWithFallback();
// //       const serverTime = await submitClockOut(coords);
      
// //       setClockOutTime(serverTime);
// //       setClockOutLocation(coords);
      
// //       Alert.alert('Success', 'Clock-out recorded successfully.');
// //     } catch (error) {
// //       setLocationError(error.message);
      
// //       if (locationCache && (Date.now() - locationCache.timestamp) < LOCATION_CACHE_EXPIRY * 2) {
// //         const useCached = await new Promise(resolve => {
// //           Alert.alert(
// //             'Location Error',
// //             'Could not get fresh location. Would you like to use your last known location?',
// //             [
// //               { text: 'Cancel', onPress: () => resolve(false), style: 'cancel' },
// //               { text: 'Use Cached', onPress: () => resolve(true) }
// //             ]
// //           );
// //         });
        
// //         if (useCached) {
// //           const serverTime = await submitClockOut(locationCache.coords);
// //           setClockOutTime(serverTime);
// //           setClockOutLocation(locationCache.coords);
// //           Alert.alert('Success', 'Clock-out recorded with cached location.');
// //           return;
// //         }
// //       }
      
// //       Alert.alert('Error', error.message);
// //     } finally {
// //       setClockOutLoading(false);
// //     }
// //   };

// //   return (
// //     <View style={styles.outerContainer}>
// //       {/* Button Container */}
// //       <View style={styles.buttonContainer}>
// //         {!clockInTime || clockOutTime ? (
// //           <TouchableOpacity
// //             style={[styles.button, clockInLoading ? styles.buttonDisabled : {}]}
// //             onPress={handleClockIn}
// //             disabled={clockInLoading}
// //           >
// //             <Ionicons name="time-outline" size={28} color="#4CAF50" />
// //             {clockInLoading ? (
// //               <ActivityIndicator color="#4CAF50" style={{ marginLeft: 12 }} />
// //             ) : (
// //               <Text style={styles.buttonText}>Clock In</Text>
// //             )}
// //           </TouchableOpacity>
// //         ) : (
// //           <TouchableOpacity
// //             style={[styles.button, clockOutLoading ? styles.buttonDisabled : {}]}
// //             onPress={handleClockOut}
// //             disabled={clockOutLoading}
// //           >
// //             <Ionicons name="exit-outline" size={28} color="#f44336" />
// //             {clockOutLoading ? (
// //               <ActivityIndicator color="#f44336" style={{ marginLeft: 12 }} />
// //             ) : (
// //               <Text style={[styles.buttonText, { color: '#f44336' }]}>Clock Out</Text>
// //             )}
// //           </TouchableOpacity>
// //         )}
// //       </View>

// //       {/* Info Container */}
// //       <View style={styles.infoContainer}>
// //         {clockInTime && !clockOutTime ? (
// //           <>
// //             <Text style={styles.timeLabel}>Clock In Time:</Text>
// //             <Text style={styles.timeText}>
// //               {clockInTime.toLocaleTimeString()}
// //             </Text>
// //             <Text style={styles.timerText}>Timer: {formatTime(clockInSeconds)}</Text>
// //             <Text style={styles.locationText}>
// //               {clockInLocation ? formatLocation(clockInLocation) : ''}
// //             </Text>
// //             {locationError && (
// //               <Text style={styles.errorText}>{locationError}</Text>
// //             )}
// //           </>
// //         ) : clockOutTime ? (
// //           <>
// //             <Text style={styles.timeLabel}>Clock Out Time:</Text>
// //             <Text style={styles.timeText}>
// //               {clockOutTime.toLocaleTimeString()}
// //             </Text>
// //             <Text style={styles.timerText}>Total Time: {getTotalTime()}</Text>
// //             <Text style={styles.locationText}>
// //               {clockOutLocation ? formatLocation(clockOutLocation) : ''}
// //             </Text>
// //             {locationError && (
// //               <Text style={styles.errorText}>{locationError}</Text>
// //             )}
// //           </>
// //         ) : (
// //           <Text style={styles.placeholderText}>No attendance record yet</Text>
// //         )}
// //       </View>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   outerContainer: {
// //     flex: 1,
// //     padding: 20,
// //     backgroundColor: '#f8f9fa',
// //     justifyContent: 'center',
// //   },
// //   buttonContainer: {
// //     backgroundColor: '#fff',
// //     padding: 20,
// //     marginBottom: 10,
// //     borderRadius: 12,
// //     alignItems: 'center',
// //     elevation: 2,
// //     borderWidth: 2,
// //     borderColor: 'skyblue',
// //   },
// //   infoContainer: {
// //     backgroundColor: '#fff',
// //     padding: 20,
// //     borderRadius: 12,
// //     alignItems: 'center',
// //     elevation: 2,
// //     borderWidth: 2,
// //     borderColor: 'skyblue',
// //   },
// //   button: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingHorizontal: 28,
// //     paddingVertical: 14,
// //     borderRadius: 30,
// //     borderWidth: 2,
// //     borderColor: '#4CAF50',
// //   },
// //   buttonDisabled: {
// //     borderColor: '#bbb',
// //   },
// //   buttonText: {
// //     marginLeft: 10,
// //     fontSize: 18,
// //     fontWeight: '600',
// //     color: '#4CAF50',
// //   },
// //   timeLabel: {
// //     fontSize: 19,
// //     color: '#555',
// //     marginBottom: 5,
// //   },
// //   timeText: {
// //     fontSize: 20,
// //     color: '#222',
// //     marginBottom: 10,
// //   },
// //   timerText: {
// //     fontSize: 16,
// //     color: 'skyblue',
// //     marginBottom: 10,
// //   },
// //   locationText: {
// //     fontSize: 14,
// //     color: '#666',
// //     textAlign: 'center',
// //     marginBottom: 5,
// //   },
// //   errorText: {
// //     fontSize: 14,
// //     color: '#f44336',
// //     textAlign: 'center',
// //   },
// //   placeholderText: {
// //     fontSize: 16,
// //     color: '#888',
// //     textAlign: 'center',
// //   },
// // });

// // export default ClockIn;







// ////////////issues is new day start then show clock in button 






// // import React, { useState, useEffect, useRef } from 'react';
// // import {
// //   View,
// //   Text,
// //   TouchableOpacity,
// //   StyleSheet,
// //   Alert,
// //   ActivityIndicator,
// //   Platform,
// //   PermissionsAndroid,
// // } from 'react-native';
// // import Ionicons from 'react-native-vector-icons/Ionicons';
// // import Geolocation from '@react-native-community/geolocation';
// // import AsyncStorage from '@react-native-async-storage/async-storage';

// // const ERP_BASE_URL = 'https://erpnextcloud.cbditsolutions.com';
// // const LOCATION_CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes cache validity

// // const ClockIn = ({ sid, employeeData }) => {
// //   const [clockInTime, setClockInTime] = useState(null);
// //   const [clockOutTime, setClockOutTime] = useState(null);
// //   const [clockInSeconds, setClockInSeconds] = useState(0);
// //   const [clockInLoading, setClockInLoading] = useState(false);
// //   const [clockOutLoading, setClockOutLoading] = useState(false);
// //   const [locationCache, setLocationCache] = useState(null);
// //   const [clockInLocation, setClockInLocation] = useState(null);
// //   const [clockOutLocation, setClockOutLocation] = useState(null);
// //   const [locationError, setLocationError] = useState(null);
// //   const [clockInLocationName, setClockInLocationName] = useState('Fetching location...');
// //   const [clockOutLocationName, setClockOutLocationName] = useState('Fetching location...');
// //   const [isLoadingData, setIsLoadingData] = useState(true);

// //   // Create storage key based on employee ID
// //   const STORAGE_KEY = `employee_clock_data_${employeeData.name}`;

// //   const clockInTimerRef = useRef(null);

// //   // Load saved data on component mount
// //   useEffect(() => {
// //     const loadData = async () => {
// //       try {
// //         const savedData = await AsyncStorage.getItem(STORAGE_KEY);
// //         if (savedData) {
// //           const { 
// //             employeeId, 
// //             clockInTime: savedClockIn, 
// //             clockOutTime: savedClockOut,
// //             clockInLocation: savedClockInLoc,
// //             clockOutLocation: savedClockOutLoc,
// //             clockInLocationName: savedClockInLocName,
// //             clockOutLocationName: savedClockOutLocName
// //           } = JSON.parse(savedData);
          
// //           if (employeeId === employeeData.name) {
// //             if (savedClockIn) {
// //               const clockInDate = new Date(savedClockIn);
// //               setClockInTime(clockInDate);
              
// //               if (!savedClockOut) {
// //                 const secondsSinceClockIn = Math.floor((new Date() - clockInDate) / 1000);
// //                 setClockInSeconds(secondsSinceClockIn);
// //                 startClockInTimer();
// //               }
// //             }
            
// //             if (savedClockOut) {
// //               setClockOutTime(new Date(savedClockOut));
// //             }

// //             if (savedClockInLoc) {
// //               setClockInLocation(savedClockInLoc);
// //             }

// //             if (savedClockOutLoc) {
// //               setClockOutLocation(savedClockOutLoc);
// //             }

// //             if (savedClockInLocName) {
// //               setClockInLocationName(savedClockInLocName);
// //             }

// //             if (savedClockOutLocName) {
// //               setClockOutLocationName(savedClockOutLocName);
// //             }
// //           } else {
// //             await AsyncStorage.removeItem(STORAGE_KEY);
// //           }
// //         }
// //       } catch (error) {
// //         console.error('Error loading data:', error);
// //       } finally {
// //         setIsLoadingData(false);
// //       }
// //     };

// //     loadData();
// //   }, [employeeData.name]);

// //   // Save data whenever it changes
// //   useEffect(() => {
// //     const saveData = async () => {
// //       try {
// //         const dataToSave = {
// //           employeeId: employeeData.name,
// //           clockInTime: clockInTime ? clockInTime.toISOString() : null,
// //           clockOutTime: clockOutTime ? clockOutTime.toISOString() : null,
// //           clockInLocation: clockInLocation,
// //           clockOutLocation: clockOutLocation,
// //           clockInLocationName: clockInLocationName,
// //           clockOutLocationName: clockOutLocationName
// //         };
// //         await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
// //       } catch (error) {
// //         console.error('Error saving data:', error);
// //       }
// //     };

// //     if (!isLoadingData) {
// //       saveData();
// //     }
// //   }, [clockInTime, clockOutTime, clockInLocation, clockOutLocation, clockInLocationName, clockOutLocationName, employeeData.name, isLoadingData]);

// //   const startClockInTimer = () => {
// //     if (clockInTimerRef.current) {
// //       clearInterval(clockInTimerRef.current);
// //     }
// //     clockInTimerRef.current = setInterval(() => {
// //       setClockInSeconds(prev => prev + 1);
// //     }, 1000);
// //   };

// //   // Timer effect
// //   useEffect(() => {
// //     if (clockInTime && !clockOutTime) {
// //       startClockInTimer();
// //     } else {
// //       clearInterval(clockInTimerRef.current);
// //       setClockInSeconds(0);
// //     }
// //     return () => clearInterval(clockInTimerRef.current);
// //   }, [clockInTime, clockOutTime]);

// //   const resetClockData = async () => {
// //     clearInterval(clockInTimerRef.current);
// //     setClockInTime(null);
// //     setClockOutTime(null);
// //     setClockInSeconds(0);
// //     setClockInLocation(null);
// //     setClockOutLocation(null);
// //     setLocationError(null);
// //     setClockInLocationName('Fetching location...');
// //     setClockOutLocationName('Fetching location...');
// //     try {
// //       await AsyncStorage.removeItem(STORAGE_KEY);
// //     } catch (error) {
// //       console.error('Error resetting data:', error);
// //     }
// //   };

// //   const requestLocationPermission = async () => {
// //     if (Platform.OS === 'android') {
// //       try {
// //         const granted = await PermissionsAndroid.request(
// //           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
// //           {
// //             title: 'Location Permission',
// //             message: 'This app needs access to your location for attendance tracking.',
// //             buttonNeutral: 'Ask Me Later',
// //             buttonNegative: 'Cancel',
// //             buttonPositive: 'OK',
// //           }
// //         );
// //         return granted === PermissionsAndroid.RESULTS.GRANTED;
// //       } catch (err) {
// //         return false;
// //       }
// //     }
// //     return true;
// //   };

// //   const getLocationName = async (latitude, longitude) => {
// //     try {
// //       const response = await fetch(
// //         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
// //       );
      
// //       const data = await response.json();
      
// //       if (!data || !data.address) {
// //         return 'Nearby location';
// //       }
      
// //       const address = data.address;
// //       let locationName = '';
      
// //       // Building address from most specific to general
// //       if (address.building) locationName += `${address.building}, `;
// //       if (address.road) locationName += `${address.road}, `;
// //       if (address.neighbourhood) locationName += `${address.neighbourhood}, `;
// //       if (address.suburb) locationName += `${address.suburb}, `;
// //       if (address.city_district) locationName += `${address.city_district}, `;
// //       if (address.city) locationName += `${address.city}, `;
// //       if (address.town) locationName += `${address.town}, `;
// //       if (address.county) locationName += `${address.county}, `;
// //       if (address.state) locationName += `${address.state}`;
      
// //       // Clean up trailing commas
// //       locationName = locationName.replace(/, $/, '').replace(/, ,/g, ', ');
      
// //       // If we still don't have a name, use the display name
// //       if (!locationName && data.display_name) {
// //         locationName = data.display_name.split(',')[0];
// //       }
      
// //       return locationName || 'Current location';
// //     } catch (error) {
// //       return 'Current location';
// //     }
// //   };

// //   const getQuickLocation = async () => {
// //     return new Promise((resolve, reject) => {
// //       Geolocation.getCurrentPosition(
// //         position => resolve(position.coords),
// //         error => reject(error),
// //         {
// //           enableHighAccuracy: false,
// //           timeout: 3000,
// //           maximumAge: 30000
// //         }
// //       );
// //     });
// //   };

// //   const getLocationWithFallback = async (isClockIn) => {
// //     setLocationError(null);
// //     if (isClockIn) {
// //       setClockInLocationName('Getting location...');
// //     } else {
// //       setClockOutLocationName('Getting location...');
// //     }
    
// //     try {
// //       const coords = await getQuickLocation();
// //       setLocationCache({ coords, timestamp: Date.now() });
      
// //       const name = await getLocationName(coords.latitude, coords.longitude);
// //       if (isClockIn) {
// //         setClockInLocationName(name);
// //       } else {
// //         setClockOutLocationName(name);
// //       }
      
// //       return coords;
// //     } catch (error) {
// //       if (locationCache && (Date.now() - locationCache.timestamp) < LOCATION_CACHE_EXPIRY) {
// //         const name = await getLocationName(locationCache.coords.latitude, locationCache.coords.longitude);
// //         if (isClockIn) {
// //           setClockInLocationName(name);
// //         } else {
// //           setClockOutLocationName(name);
// //         }
// //         return locationCache.coords;
// //       }
      
// //       throw new Error('Could not determine your location. Please ensure you have GPS signal.');
// //     }
// //   };

// //   const formatTimeForERP = (date) => {
// //     return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
// //   };

// //   const formatTime = (seconds) => {
// //     const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
// //     const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
// //     const s = (seconds % 60).toString().padStart(2, '0');
// //     return `${h}:${m}:${s}`;
// //   };

// //   const getTotalTime = () => {
// //     if (!clockInTime || !clockOutTime) return '00:00:00';
// //     const diffMs = clockOutTime - clockInTime;
// //     return formatTime(Math.floor(diffMs / 1000));
// //   };

// //   const submitClockIn = async (coords) => {
// //     const now = new Date();
// //     const timeString = formatTimeForERP(now);
    
// //     try {
// //       const res = await fetch(`${ERP_BASE_URL}/api/resource/Employee Checkin`, {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           Cookie: `sid=${sid}`,
// //         },
// //         body: JSON.stringify({
// //           employee: employeeData.name,
// //           log_type: 'IN',
// //           time: timeString,
// //           latitude: coords.latitude,
// //           longitude: coords.longitude,
// //           accuracy: coords.accuracy,
// //         }),
// //       });

// //       if (!res.ok) {
// //         const errText = await res.text();
// //         throw new Error(`Failed to clock in: ${errText}`);
// //       }

// //       return now;
// //     } catch (error) {
// //       throw error;
// //     }
// //   };

// //   const submitClockOut = async (coords) => {
// //     const now = new Date();
// //     const timeString = formatTimeForERP(now);
    
// //     try {
// //       const res = await fetch(`${ERP_BASE_URL}/api/resource/Employee Checkin`, {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           Cookie: `sid=${sid}`,
// //         },
// //         body: JSON.stringify({
// //           employee: employeeData.name,
// //           log_type: 'OUT',
// //           time: timeString,
// //           latitude: coords.latitude,
// //           longitude: coords.longitude,
// //           accuracy: coords.accuracy,
// //         }),
// //       });

// //       if (!res.ok) {
// //         const errText = await res.text();
// //         throw new Error(`Failed to clock out: ${errText}`);
// //       }

// //       return now;
// //     } catch (error) {
// //       throw error;
// //     }
// //   };

// //   const handleClockIn = async () => {
// //     if (clockInLoading) return;

// //     const hasPermission = await requestLocationPermission();
// //     if (!hasPermission) {
// //       Alert.alert('Permission denied', 'Location permission is required to clock in.');
// //       return;
// //     }

// //     setClockInLoading(true);
// //     setLocationError(null);
    
// //     try {
// //       const coords = await getLocationWithFallback(true);
// //       const serverTime = await submitClockIn(coords);
      
// //       setClockInTime(serverTime);
// //       setClockInLocation(coords);
// //       setClockOutTime(null);
      
// //       Alert.alert('Success', 'Clock-in recorded successfully.');
// //     } catch (error) {
// //       setLocationError(error.message);
// //       Alert.alert('Error', error.message);
// //     } finally {
// //       setClockInLoading(false);
// //     }
// //   };

// //   const handleClockOut = async () => {
// //     if (clockOutLoading) return;

// //     setClockOutLoading(true);
// //     setLocationError(null);
    
// //     try {
// //       const coords = await getLocationWithFallback(false);
// //       const serverTime = await submitClockOut(coords);
      
// //       setClockOutTime(serverTime);
// //       setClockOutLocation(coords);
      
// //       Alert.alert('Success', 'Clock-out recorded successfully.');
// //     } catch (error) {
// //       setLocationError(error.message);
      
// //       if (locationCache && (Date.now() - locationCache.timestamp) < LOCATION_CACHE_EXPIRY * 2) {
// //         const useCached = await new Promise(resolve => {
// //           Alert.alert(
// //             'Location Error',
// //             'Could not get fresh location. Would you like to use your last known location?',
// //             [
// //               { text: 'Cancel', onPress: () => resolve(false), style: 'cancel' },
// //               { text: 'Use Cached', onPress: () => resolve(true) }
// //             ]
// //           );
// //         });
        
// //         if (useCached) {
// //           const name = await getLocationName(locationCache.coords.latitude, locationCache.coords.longitude);
// //           setClockOutLocationName(name);
// //           const serverTime = await submitClockOut(locationCache.coords);
// //           setClockOutTime(serverTime);
// //           setClockOutLocation(locationCache.coords);
// //           Alert.alert('Success', 'Clock-out recorded with cached location.');
// //           return;
// //         }
// //       }
      
// //       Alert.alert('Error', error.message);
// //     } finally {
// //       setClockOutLoading(false);
// //     }
// //   };

// //   if (isLoadingData) {
// //     return (
// //       <View style={[styles.outerContainer, { justifyContent: 'center', alignItems: 'center' }]}>
// //         <ActivityIndicator size="large" color="#4CAF50" />
// //         <Text style={{ marginTop: 10 }}>Loading attendance data...</Text>
// //       </View>
// //     );
// //   }

// //   return (
// //     <View style={styles.outerContainer}>
// //       {/* Button Container */}
// //       <View style={styles.buttonContainer}>
// //         {!clockInTime || clockOutTime ? (
// //           <TouchableOpacity
// //             style={[styles.clockInButton, clockInLoading ? styles.buttonDisabled : {}]}
// //             onPress={handleClockIn}
// //             disabled={clockInLoading}
// //           >
// //             {clockInLoading ? (
// //               <ActivityIndicator color="#fff" />
// //             ) : (
// //               <>
// //                 <Ionicons name="time-outline" size={28} color="#fff" />
// //                 <Text style={styles.clockInButtonText}>Clock In</Text>
// //               </>
// //             )}
// //           </TouchableOpacity>
// //         ) : (
// //           <TouchableOpacity
// //             style={[styles.clockOutButton, clockOutLoading ? styles.buttonDisabled : {}]}
// //             onPress={handleClockOut}
// //             disabled={clockOutLoading}
// //           >
// //             {clockOutLoading ? (
// //               <ActivityIndicator color="#fff" />
// //             ) : (
// //               <>
// //                 <Ionicons name="exit-outline" size={28} color="#fff" />
// //                 <Text style={styles.clockOutButtonText}>Clock Out</Text>
// //               </>
// //             )}
// //           </TouchableOpacity>
// //         )}
// //       </View>

// //       {/* Info Container */}
// //       <View style={styles.infoContainer}>
// //         {clockInTime && !clockOutTime ? (
// //           <>
// //             <Text style={styles.timeLabel}>Clock In Time:</Text>
// //             <Text style={styles.timeText}>
// //               {clockInTime.toLocaleTimeString()}
// //             </Text>
// //             <Text style={styles.timerText}>Timer: {formatTime(clockInSeconds)}</Text>
// //             <Text style={styles.locationText}>
// //               {clockInLocationName}
// //             </Text>
// //           </>
// //         ) : clockOutTime ? (
// //           <>
// //             <Text style={styles.timeLabel}>Clock Out Time:</Text>
// //             <Text style={styles.timeText}>
// //               {clockOutTime.toLocaleTimeString()}
// //             </Text>
// //             <Text style={styles.timerText}>Total Time: {getTotalTime()}</Text>
// //             <Text style={styles.locationText}>
// //               {clockOutLocationName}
// //             </Text>
// //           </>
// //         ) : (
// //           <Text style={styles.placeholderText}>No attendance record yet</Text>
// //         )}
// //         {locationError && (
// //           <Text style={styles.errorText}>{locationError}</Text>
// //         )}
// //       </View>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   outerContainer: {
// //     flex: 1,
// //     padding: 20,
// //     backgroundColor: '#f8f9fa',
// //     justifyContent: 'center',
// //   },
// //   buttonContainer: {
// //     backgroundColor: '#fff',
// //     padding: 20,
// //     marginBottom: 10,
// //     borderRadius: 12,
// //     alignItems: 'center',
// //     elevation: 2,
// //     borderWidth: 2,
// //     borderColor: 'skyblue',
// //   },
// //   infoContainer: {
// //     backgroundColor: '#fff',
// //     padding: 20,
// //     borderRadius: 12,
// //     alignItems: 'center',
// //     elevation: 2,
// //     borderWidth: 2,
// //     borderColor: 'skyblue',
// //   },
// //   clockInButton: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     width: 150,
// //     height: 150,
// //     borderRadius: 75,
// //     borderWidth:2,
// //     borderColor:'skyblue',
// //     backgroundColor: '#2196F3', // Blue color
// //     padding: 10,
// //   },
// //   clockOutButton: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     width: 150,
// //     height: 150,
// //     borderRadius: 75,
// //     borderWidth:2,
// //     borderColor:'black',
// //     backgroundColor: '#f44336', // Red color
// //     padding: 10,
    
// //   },
// //   buttonDisabled: {
// //     opacity: 0.6,
// //   },
// //   clockInButtonText: {
// //     marginLeft: 10,
// //     fontSize: 18,
// //     fontWeight: '600',
// //     color: '#fff',
// //   },
// //   clockOutButtonText: {
// //     marginLeft: 10,
// //     fontSize: 18,
// //     fontWeight: '600',
// //     color: '#fff',
    
// //   },
// //   timeLabel: {
// //     fontSize: 19,
// //     color: '#555',
// //     marginBottom: 5,
// //   },
// //   timeText: {
// //     fontSize: 20,
// //     color: '#222',
// //     marginBottom: 10,
// //   },
// //   timerText: {
// //     fontSize: 16,
// //     color: 'skyblue',
// //     marginBottom: 10,
// //   },
// //   locationText: {
// //     fontSize: 14,
// //     color: '#666',
// //     textAlign: 'center',
// //     marginBottom: 5,
// //   },
// //   errorText: {
// //     fontSize: 14,
// //     color: '#f44336',
// //     textAlign: 'center',
// //   },
// //   placeholderText: {
// //     fontSize: 16,
// //     color: '#888',
// //     textAlign: 'center',
// //   },
// // });

// // export default ClockIn;

//  ////////////////  this code correct but use asynchronous storage if employee login with another device he cannot see previou data

// // import React, { useState, useEffect, useRef } from 'react';
// // import {
// //   View,
// //   Text,
// //   TouchableOpacity,
// //   StyleSheet,
// //   Alert,
// //   ActivityIndicator,
// //   Platform,
// //   PermissionsAndroid,
// // } from 'react-native';
// // import Ionicons from 'react-native-vector-icons/Ionicons';
// // import Geolocation from '@react-native-community/geolocation';
// // import AsyncStorage from '@react-native-async-storage/async-storage';

// // const ERP_BASE_URL = 'https://erpnextcloud.cbditsolutions.com';
// // const LOCATION_CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes cache validity

// // const ClockIn = ({ sid, employeeData }) => {
// //   const [clockInTime, setClockInTime] = useState(null);
// //   const [clockOutTime, setClockOutTime] = useState(null);
// //   const [clockInSeconds, setClockInSeconds] = useState(0);
// //   const [clockInLoading, setClockInLoading] = useState(false);
// //   const [clockOutLoading, setClockOutLoading] = useState(false);
// //   const [locationCache, setLocationCache] = useState(null);
// //   const [clockInLocation, setClockInLocation] = useState(null);
// //   const [clockOutLocation, setClockOutLocation] = useState(null);
// //   const [locationError, setLocationError] = useState(null);
// //   const [clockInLocationName, setClockInLocationName] = useState('Fetching location...');
// //   const [clockOutLocationName, setClockOutLocationName] = useState('Fetching location...');
// //   const [isLoadingData, setIsLoadingData] = useState(true);

// //   // Create storage key based on employee ID
// //   const STORAGE_KEY = `employee_clock_data_${employeeData.name}`;

// //   const clockInTimerRef = useRef(null);

// //   // Load saved data on component mount
// //   useEffect(() => {
// //     const loadData = async () => {
// //       try {
// //         const savedData = await AsyncStorage.getItem(STORAGE_KEY);
// //         if (savedData) {
// //           const { 
// //             employeeId, 
// //             clockInTime: savedClockIn, 
// //             clockOutTime: savedClockOut,
// //             clockInLocation: savedClockInLoc,
// //             clockOutLocation: savedClockOutLoc,
// //             clockInLocationName: savedClockInLocName,
// //             clockOutLocationName: savedClockOutLocName
// //           } = JSON.parse(savedData);
          
// //           if (employeeId === employeeData.name) {
// //             const now = new Date();
            
// //             if (savedClockIn) {
// //               const clockInDate = new Date(savedClockIn);
              
// //               if (!savedClockOut) {
// //                 setClockInTime(clockInDate);
// //                 const secondsSinceClockIn = Math.floor((now - clockInDate) / 1000);
// //                 setClockInSeconds(secondsSinceClockIn);
// //                 startClockInTimer();
// //               } else {
// //                 setClockOutTime(new Date(savedClockOut));
// //               }
// //             }

// //             if (savedClockInLoc) {
// //               setClockInLocation(savedClockInLoc);
// //             }

// //             if (savedClockOutLoc) {
// //               setClockOutLocation(savedClockOutLoc);
// //             }

// //             if (savedClockInLocName) {
// //               setClockInLocationName(savedClockInLocName);
// //             }

// //             if (savedClockOutLocName) {
// //               setClockOutLocationName(savedClockOutLocName);
// //             }
// //           } else {
// //             await AsyncStorage.removeItem(STORAGE_KEY);
// //           }
// //         }
// //       } catch (error) {
// //         console.error('Error loading data:', error);
// //       } finally {
// //         setIsLoadingData(false);
// //       }
// //     };

// //     loadData();
// //   }, [employeeData.name]);

// //   // Save data whenever it changes
// //   useEffect(() => {
// //     const saveData = async () => {
// //       try {
// //         const dataToSave = {
// //           employeeId: employeeData.name,
// //           clockInTime: clockInTime ? clockInTime.toISOString() : null,
// //           clockOutTime: clockOutTime ? clockOutTime.toISOString() : null,
// //           clockInLocation: clockInLocation,
// //           clockOutLocation: clockOutLocation,
// //           clockInLocationName: clockInLocationName,
// //           clockOutLocationName: clockOutLocationName
// //         };
// //         await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
// //       } catch (error) {
// //         console.error('Error saving data:', error);
// //       }
// //     };

// //     if (!isLoadingData) {
// //       saveData();
// //     }
// //   }, [clockInTime, clockOutTime, clockInLocation, clockOutLocation, clockInLocationName, clockOutLocationName, employeeData.name, isLoadingData]);

// //   const startClockInTimer = () => {
// //     if (clockInTimerRef.current) {
// //       clearInterval(clockInTimerRef.current);
// //     }
// //     clockInTimerRef.current = setInterval(() => {
// //       setClockInSeconds(prev => prev + 1);
// //     }, 1000);
// //   };

// //   // Timer effect
// //   useEffect(() => {
// //     if (clockInTime && !clockOutTime) {
// //       startClockInTimer();
// //     } else {
// //       clearInterval(clockInTimerRef.current);
// //       setClockInSeconds(0);
// //     }
// //     return () => clearInterval(clockInTimerRef.current);
// //   }, [clockInTime, clockOutTime]);

// //   const resetClockData = async () => {
// //     clearInterval(clockInTimerRef.current);
// //     setClockInTime(null);
// //     setClockOutTime(null);
// //     setClockInSeconds(0);
// //     setClockInLocation(null);
// //     setClockOutLocation(null);
// //     setLocationError(null);
// //     setClockInLocationName('Fetching location...');
// //     setClockOutLocationName('Fetching location...');
// //     try {
// //       await AsyncStorage.removeItem(STORAGE_KEY);
// //     } catch (error) {
// //       console.error('Error resetting data:', error);
// //     }
// //   };

// //   const requestLocationPermission = async () => {
// //     if (Platform.OS === 'android') {
// //       try {
// //         const granted = await PermissionsAndroid.request(
// //           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
// //           {
// //             title: 'Location Permission',
// //             message: 'This app needs access to your location for attendance tracking.',
// //             buttonNeutral: 'Ask Me Later',
// //             buttonNegative: 'Cancel',
// //             buttonPositive: 'OK',
// //           }
// //         );
// //         return granted === PermissionsAndroid.RESULTS.GRANTED;
// //       } catch (err) {
// //         return false;
// //       }
// //     }
// //     return true;
// //   };

// //   const getLocationName = async (latitude, longitude) => {
// //     try {
// //       const response = await fetch(
// //         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
// //       );
      
// //       const data = await response.json();
      
// //       if (!data || !data.address) {
// //         return 'Nearby location';
// //       }
      
// //       const address = data.address;
// //       let locationName = '';
      
// //       if (address.building) locationName += `${address.building}, `;
// //       if (address.road) locationName += `${address.road}, `;
// //       if (address.neighbourhood) locationName += `${address.neighbourhood}, `;
// //       if (address.suburb) locationName += `${address.suburb}, `;
// //       if (address.city_district) locationName += `${address.city_district}, `;
// //       if (address.city) locationName += `${address.city}, `;
// //       if (address.town) locationName += `${address.town}, `;
// //       if (address.county) locationName += `${address.county}, `;
// //       if (address.state) locationName += `${address.state}`;
      
// //       locationName = locationName.replace(/, $/, '').replace(/, ,/g, ', ');
      
// //       if (!locationName && data.display_name) {
// //         locationName = data.display_name.split(',')[0];
// //       }
      
// //       return locationName || 'Current location';
// //     } catch (error) {
// //       return 'Current location';
// //     }
// //   };

// //   const getQuickLocation = async () => {
// //     return new Promise((resolve, reject) => {
// //       Geolocation.getCurrentPosition(
// //         position => resolve(position.coords),
// //         error => reject(error),
// //         {
// //           enableHighAccuracy: false,
// //           timeout: 3000,
// //           maximumAge: 30000
// //         }
// //       );
// //     });
// //   };

// //   const getLocationWithFallback = async (isClockIn) => {
// //     setLocationError(null);
// //     if (isClockIn) {
// //       setClockInLocationName('Getting location...');
// //     } else {
// //       setClockOutLocationName('Getting location...');
// //     }
    
// //     try {
// //       const coords = await getQuickLocation();
// //       setLocationCache({ coords, timestamp: Date.now() });
      
// //       const name = await getLocationName(coords.latitude, coords.longitude);
// //       if (isClockIn) {
// //         setClockInLocationName(name);
// //       } else {
// //         setClockOutLocationName(name);
// //       }
      
// //       return coords;
// //     } catch (error) {
// //       if (locationCache && (Date.now() - locationCache.timestamp) < LOCATION_CACHE_EXPIRY) {
// //         const name = await getLocationName(locationCache.coords.latitude, locationCache.coords.longitude);
// //         if (isClockIn) {
// //           setClockInLocationName(name);
// //         } else {
// //           setClockOutLocationName(name);
// //         }
// //         return locationCache.coords;
// //       }
      
// //       throw new Error('Could not determine your location. Please ensure you have GPS signal.');
// //     }
// //   };

// //   const formatTimeForERP = (date) => {
// //     return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
// //   };

// //   const formatTime = (seconds) => {
// //     const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
// //     const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
// //     const s = (seconds % 60).toString().padStart(2, '0');
// //     return `${h}:${m}:${s}`;
// //   };

// //   const getTotalTime = () => {
// //     if (!clockInTime || !clockOutTime) return '00:00:00';
// //     const diffMs = clockOutTime - clockInTime;
// //     return formatTime(Math.floor(diffMs / 1000));
// //   };

// //   const handleClockIn = async () => {
// //     if (clockInLoading) return;

// //     const hasPermission = await requestLocationPermission();
// //     if (!hasPermission) {
// //       Alert.alert('Permission denied', 'Location permission is required to clock in.');
// //       return;
// //     }

// //     setClockInLoading(true);
// //     setLocationError(null);
    
// //     try {
// //       const coords = await getLocationWithFallback(true);
      
// //       const now = new Date();
// //       const timeString = formatTimeForERP(now);
      
// //       const res = await fetch(`${ERP_BASE_URL}/api/resource/Employee Checkin`, {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           Cookie: `sid=${sid}`,
// //         },
// //         body: JSON.stringify({
// //           employee: employeeData.name,
// //           log_type: 'IN',
// //           time: timeString,
// //           latitude: coords.latitude,
// //           longitude: coords.longitude,
// //           accuracy: coords.accuracy,
// //         }),
// //       });

// //       if (!res.ok) {
// //         const errText = await res.text();
// //         throw new Error(`Failed to clock in: ${errText}`);
// //       }

// //       setClockInTime(now);
// //       setClockInLocation(coords);
// //       setClockOutTime(null);
      
// //       Alert.alert('Success', 'Clock-in recorded successfully.');
// //     } catch (error) {
// //       setLocationError(error.message);
// //       Alert.alert('Error', error.message);
// //     } finally {
// //       setClockInLoading(false);
// //     }
// //   };

// //   const handleClockOut = async () => {
// //     if (clockOutLoading) return;

// //     setClockOutLoading(true);
// //     setLocationError(null);
    
// //     try {
// //       const coords = await getLocationWithFallback(false);
      
// //       const now = new Date();
// //       const timeString = formatTimeForERP(now);
      
// //       const res = await fetch(`${ERP_BASE_URL}/api/resource/Employee Checkin`, {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           Cookie: `sid=${sid}`,
// //         },
// //         body: JSON.stringify({
// //           employee: employeeData.name,
// //           log_type: 'OUT',
// //           time: timeString,
// //           latitude: coords.latitude,
// //           longitude: coords.longitude,
// //           accuracy: coords.accuracy,
// //         }),
// //       });

// //       if (!res.ok) {
// //         const errText = await res.text();
// //         throw new Error(`Failed to clock out: ${errText}`);
// //       }

// //       setClockOutTime(now);
// //       setClockOutLocation(coords);
      
// //       Alert.alert('Success', 'Clock-out recorded successfully.');
// //     } catch (error) {
// //       setLocationError(error.message);
      
// //       if (locationCache && (Date.now() - locationCache.timestamp) < LOCATION_CACHE_EXPIRY * 2) {
// //         const useCached = await new Promise(resolve => {
// //           Alert.alert(
// //             'Location Error',
// //             'Could not get fresh location. Would you like to use your last known location?',
// //             [
// //               { text: 'Cancel', onPress: () => resolve(false), style: 'cancel' },
// //               { text: 'Use Cached', onPress: () => resolve(true) }
// //             ]
// //           );
// //         });
        
// //         if (useCached) {
// //           const name = await getLocationName(locationCache.coords.latitude, locationCache.coords.longitude);
// //           setClockOutLocationName(name);
          
// //           const now = new Date();
// //           const timeString = formatTimeForERP(now);
          
// //           const res = await fetch(`${ERP_BASE_URL}/api/resource/Employee Checkin`, {
// //             method: 'POST',
// //             headers: {
// //               'Content-Type': 'application/json',
// //               Cookie: `sid=${sid}`,
// //             },
// //             body: JSON.stringify({
// //               employee: employeeData.name,
// //               log_type: 'OUT',
// //               time: timeString,
// //               latitude: locationCache.coords.latitude,
// //               longitude: locationCache.coords.longitude,
// //               accuracy: locationCache.coords.accuracy,
// //             }),
// //           });

// //           if (!res.ok) {
// //             const errText = await res.text();
// //             throw new Error(`Failed to clock out: ${errText}`);
// //           }

// //           setClockOutTime(now);
// //           setClockOutLocation(locationCache.coords);
// //           Alert.alert('Success', 'Clock-out recorded with cached location.');
// //           return;
// //         }
// //       }
      
// //       Alert.alert('Error', error.message);
// //     } finally {
// //       setClockOutLoading(false);
// //     }
// //   };

// //   if (isLoadingData) {
// //     return (
// //       <View style={[styles.outerContainer, { justifyContent: 'center', alignItems: 'center' }]}>
// //         <ActivityIndicator size="large" color="#4CAF50" />
// //         <Text style={{ marginTop: 10 }}>Loading attendance data...</Text>
// //       </View>
// //     );
// //   }

// //   return (
// //     <View style={styles.outerContainer}>
// //       {/* Button Container */}
// //       <View style={styles.buttonContainer}>
// //         {!clockInTime || clockOutTime ? (
// //           <TouchableOpacity
// //             style={[styles.clockInButton, clockInLoading ? styles.buttonDisabled : {}]}
// //             onPress={handleClockIn}
// //             disabled={clockInLoading}
// //           >
// //             {clockInLoading ? (
// //               <ActivityIndicator color="#fff" />
// //             ) : (
// //               <>
// //                 <Ionicons name="time-outline" size={28} color="#fff" />
// //                 <Text style={styles.clockInButtonText}>Clock In</Text>
// //               </>
// //             )}
// //           </TouchableOpacity>
// //         ) : (
// //           <TouchableOpacity
// //             style={[styles.clockOutButton, clockOutLoading ? styles.buttonDisabled : {}]}
// //             onPress={handleClockOut}
// //             disabled={clockOutLoading}
// //           >
// //             {clockOutLoading ? (
// //               <ActivityIndicator color="#fff" />
// //             ) : (
// //               <>
// //                 <Ionicons name="exit-outline" size={28} color="#fff" />
// //                 <Text style={styles.clockOutButtonText}>Clock Out</Text>
// //               </>
// //             )}
// //           </TouchableOpacity>
// //         )}
// //       </View>

// //       {/* Info Container */}
// //       <View style={styles.infoContainer}>
// //         {clockInTime && !clockOutTime ? (
// //           <>
// //             <Text style={styles.timeLabel}>Clock In Time:</Text>
// //             <Text style={styles.timeText}>
// //               {clockInTime.toLocaleTimeString()}
// //             </Text>
// //             <Text style={styles.timerText}>Timer: {formatTime(clockInSeconds)}</Text>
// //             <Text style={styles.locationText}>
// //               {clockInLocationName}
// //             </Text>
// //           </>
// //         ) : clockOutTime ? (
// //           <>
// //             <Text style={styles.timeLabel}>Clock Out Time:</Text>
// //             <Text style={styles.timeText}>
// //               {clockOutTime.toLocaleTimeString()}
// //             </Text>
// //             <Text style={styles.timerText}>Total Time: {getTotalTime()}</Text>
// //             <Text style={styles.locationText}>
// //               {clockOutLocationName}
// //             </Text>
// //           </>
// //         ) : (
// //           <Text style={styles.placeholderText}>No attendance record yet</Text>
// //         )}
// //         {locationError && (
// //           <Text style={styles.errorText}>{locationError}</Text>
// //         )}
// //       </View>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   outerContainer: {
// //     flex: 1,
// //     padding: 20,
// //     backgroundColor: '#f8f9fa',
// //     justifyContent: 'center',
// //   },
// //   buttonContainer: {
// //     backgroundColor: '#fff',
// //     padding: 20,
// //     marginBottom: 10,
// //     borderRadius: 12,
// //     alignItems: 'center',
// //     elevation: 2,
// //     borderWidth: 2,
// //     borderColor: 'skyblue',
// //   },
// //   infoContainer: {
// //     backgroundColor: '#fff',
// //     padding: 20,
// //     borderRadius: 12,
// //     alignItems: 'center',
// //     elevation: 2,
// //     borderWidth: 2,
// //     borderColor: 'skyblue',
// //   },
// //   clockInButton: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     width: 150,
// //     height: 150,
// //     borderRadius: 75,
// //     borderWidth:2,
// //     borderColor:'skyblue',
// //     backgroundColor: '#2196F3',
// //     padding: 10,
// //   },
// //   clockOutButton: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     width: 150,
// //     height: 150,
// //     borderRadius: 75,
// //     borderWidth:2,
// //     borderColor:'black',
// //     backgroundColor: '#f44336',
// //     padding: 10,
// //   },
// //   buttonDisabled: {
// //     opacity: 0.6,
// //   },
// //   clockInButtonText: {
// //     marginLeft: 10,
// //     fontSize: 18,
// //     fontWeight: '600',
// //     color: '#fff',
// //   },
// //   clockOutButtonText: {
// //     marginLeft: 10,
// //     fontSize: 18,
// //     fontWeight: '600',
// //     color: '#fff',
// //   },
// //   timeLabel: {
// //     fontSize: 19,
// //     color: '#555',
// //     marginBottom: 5,
// //   },
// //   timeText: {
// //     fontSize: 20,
// //     color: '#222',
// //     marginBottom: 10,
// //   },
// //   timerText: {
// //     fontSize: 16,
// //     color: 'skyblue',
// //     marginBottom: 10,
// //   },
// //   locationText: {
// //     fontSize: 14,
// //     color: '#666',
// //     textAlign: 'center',
// //     marginBottom: 5,
// //   },
// //   errorText: {
// //     fontSize: 14,
// //     color: '#f44336',
// //     textAlign: 'center',
// //   },
// //   placeholderText: {
// //     fontSize: 16,
// //     color: '#888',
// //     textAlign: 'center',
// //   },
// // });

// // export default ClockIn;


// /////////////////   clockin and clockout show if change device use server data  /////////////

// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
//   Platform,
//   PermissionsAndroid,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import Geolocation from '@react-native-community/geolocation';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const ERP_BASE_URL = 'https://erpnextcloud.cbditsolutions.com';
// const LOCATION_CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes cache validity

// const ClockIn = ({ sid, employeeData }) => {
//   const [clockInTime, setClockInTime] = useState(null);
//   const [clockOutTime, setClockOutTime] = useState(null);
//   const [clockInSeconds, setClockInSeconds] = useState(0);
//   const [clockInLoading, setClockInLoading] = useState(false);
//   const [clockOutLoading, setClockOutLoading] = useState(false);
//   const [locationCache, setLocationCache] = useState(null);
//   const [clockInLocation, setClockInLocation] = useState(null);
//   const [clockOutLocation, setClockOutLocation] = useState(null);
//   const [locationError, setLocationError] = useState(null);
//   const [clockInLocationName, setClockInLocationName] = useState('Fetching location...');
//   const [clockOutLocationName, setClockOutLocationName] = useState('Fetching location...');
//   const [isLoadingData, setIsLoadingData] = useState(true);
//   const [serverCheckinStatus, setServerCheckinStatus] = useState(null);

//   // Create storage key based on employee ID
//   const STORAGE_KEY = `employee_clock_data_${employeeData.name}`;

//   const clockInTimerRef = useRef(null);

//   // Fetch latest checkin status from server
//   const fetchLatestCheckinStatus = async () => {
//     try {
//       const response = await fetch(
//         `${ERP_BASE_URL}/api/resource/Employee Checkin?fields=["employee","log_type","time"]&filters=[["employee","=","${employeeData.name}"]]&order_by=time desc&limit=1`,
//         {
//           headers: {
//             Cookie: `sid=${sid}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error('Failed to fetch checkin status');
//       }

//       const data = await response.json();
//       if (data.data && data.data.length > 0) {
//         const latestCheckin = data.data[0];
//         setServerCheckinStatus(latestCheckin.log_type);
//         return latestCheckin;
//       }
//       return null;
//     } catch (error) {
//       console.error('Error fetching checkin status:', error);
//       return null;
//     }
//   };

//   // Load saved data on component mount
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         // First fetch the latest status from server
//         const latestCheckin = await fetchLatestCheckinStatus();
        
//         const savedData = await AsyncStorage.getItem(STORAGE_KEY);
//         if (savedData) {
//           const { 
//             employeeId, 
//             clockInTime: savedClockIn, 
//             clockOutTime: savedClockOut,
//             clockInLocation: savedClockInLoc,
//             clockOutLocation: savedClockOutLoc,
//             clockInLocationName: savedClockInLocName,
//             clockOutLocationName: savedClockOutLocName
//           } = JSON.parse(savedData);
          
//           if (employeeId === employeeData.name) {
//             const now = new Date();
            
//             // If server says last action was IN, show clock out button
//             if (latestCheckin && latestCheckin.log_type === 'IN') {
//               if (savedClockIn) {
//                 const clockInDate = new Date(savedClockIn);
//                 setClockInTime(clockInDate);
//                 const secondsSinceClockIn = Math.floor((now - clockInDate) / 1000);
//                 setClockInSeconds(secondsSinceClockIn);
//                 startClockInTimer();
//               } else {
//                 // If we don't have local clock in time but server says we're clocked in,
//                 // use the server's clock in time
//                 const serverClockInTime = new Date(latestCheckin.time);
//                 setClockInTime(serverClockInTime);
//                 const secondsSinceClockIn = Math.floor((now - serverClockInTime) / 1000);
//                 setClockInSeconds(secondsSinceClockIn);
//                 startClockInTimer();
//               }
//               setClockOutTime(null);
//             } 
//             // If server says last action was OUT or no action, show clock in button
//             else {
//               if (savedClockIn) {
//                 const clockInDate = new Date(savedClockIn);
//                 setClockInTime(clockInDate);
//               }
//               if (savedClockOut) {
//                 setClockOutTime(new Date(savedClockOut));
//               }
//             }

//             if (savedClockInLoc) {
//               setClockInLocation(savedClockInLoc);
//             }

//             if (savedClockOutLoc) {
//               setClockOutLocation(savedClockOutLoc);
//             }

//             if (savedClockInLocName) {
//               setClockInLocationName(savedClockInLocName);
//             }

//             if (savedClockOutLocName) {
//               setClockOutLocationName(savedClockOutLocName);
//             }
//           } else {
//             await AsyncStorage.removeItem(STORAGE_KEY);
//           }
//         } else {
//           // No local data, check server status
//           if (latestCheckin && latestCheckin.log_type === 'IN') {
//             const serverClockInTime = new Date(latestCheckin.time);
//             setClockInTime(serverClockInTime);
//             const secondsSinceClockIn = Math.floor((new Date() - serverClockInTime) / 1000);
//             setClockInSeconds(secondsSinceClockIn);
//             startClockInTimer();
//           }
//         }
//       } catch (error) {
//         console.error('Error loading data:', error);
//       } finally {
//         setIsLoadingData(false);
//       }
//     };

//     loadData();
//   }, [employeeData.name]);

//   // Save data whenever it changes
//   useEffect(() => {
//     const saveData = async () => {
//       try {
//         const dataToSave = {
//           employeeId: employeeData.name,
//           clockInTime: clockInTime ? clockInTime.toISOString() : null,
//           clockOutTime: clockOutTime ? clockOutTime.toISOString() : null,
//           clockInLocation: clockInLocation,
//           clockOutLocation: clockOutLocation,
//           clockInLocationName: clockInLocationName,
//           clockOutLocationName: clockOutLocationName
//         };
//         await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
//       } catch (error) {
//         console.error('Error saving data:', error);
//       }
//     };

//     if (!isLoadingData) {
//       saveData();
//     }
//   }, [clockInTime, clockOutTime, clockInLocation, clockOutLocation, clockInLocationName, clockOutLocationName, employeeData.name, isLoadingData]);

//   const startClockInTimer = () => {
//     if (clockInTimerRef.current) {
//       clearInterval(clockInTimerRef.current);
//     }
//     clockInTimerRef.current = setInterval(() => {
//       setClockInSeconds(prev => prev + 1);
//     }, 1000);
//   };

//   // Timer effect
//   useEffect(() => {
//     if (clockInTime && !clockOutTime) {
//       startClockInTimer();
//     } else {
//       clearInterval(clockInTimerRef.current);
//       setClockInSeconds(0);
//     }
//     return () => clearInterval(clockInTimerRef.current);
//   }, [clockInTime, clockOutTime]);

//   const resetClockData = async () => {
//     clearInterval(clockInTimerRef.current);
//     setClockInTime(null);
//     setClockOutTime(null);
//     setClockInSeconds(0);
//     setClockInLocation(null);
//     setClockOutLocation(null);
//     setLocationError(null);
//     setClockInLocationName('Fetching location...');
//     setClockOutLocationName('Fetching location...');
//     try {
//       await AsyncStorage.removeItem(STORAGE_KEY);
//     } catch (error) {
//       console.error('Error resetting data:', error);
//     }
//   };

//   const requestLocationPermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//           {
//             title: 'Location Permission',
//             message: 'This app needs access to your location for attendance tracking.',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           }
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch (err) {
//         return false;
//       }
//     }
//     return true;
//   };

//   const getLocationName = async (latitude, longitude) => {
//     try {
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
//       );
      
//       const data = await response.json();
      
//       if (!data || !data.address) {
//         return 'Nearby location';
//       }
      
//       const address = data.address;
//       let locationName = '';
      
//       if (address.building) locationName += `${address.building}, `;
//       if (address.road) locationName += `${address.road}, `;
//       if (address.neighbourhood) locationName += `${address.neighbourhood}, `;
//       if (address.suburb) locationName += `${address.suburb}, `;
//       if (address.city_district) locationName += `${address.city_district}, `;
//       if (address.city) locationName += `${address.city}, `;
//       if (address.town) locationName += `${address.town}, `;
//       if (address.county) locationName += `${address.county}, `;
//       if (address.state) locationName += `${address.state}`;
      
//       locationName = locationName.replace(/, $/, '').replace(/, ,/g, ', ');
      
//       if (!locationName && data.display_name) {
//         locationName = data.display_name.split(',')[0];
//       }
      
//       return locationName || 'Current location';
//     } catch (error) {
//       return 'Current location';
//     }
//   };

//   const getQuickLocation = async () => {
//     return new Promise((resolve, reject) => {
//       Geolocation.getCurrentPosition(
//         position => resolve(position.coords),
//         error => reject(error),
//         {
//           enableHighAccuracy: false,
//           timeout: 3000,
//           maximumAge: 30000
//         }
//       );
//     });
//   };

//   const getLocationWithFallback = async (isClockIn) => {
//     setLocationError(null);
//     if (isClockIn) {
//       setClockInLocationName('Getting location...');
//     } else {
//       setClockOutLocationName('Getting location...');
//     }
    
//     try {
//       const coords = await getQuickLocation();
//       setLocationCache({ coords, timestamp: Date.now() });
      
//       const name = await getLocationName(coords.latitude, coords.longitude);
//       if (isClockIn) {
//         setClockInLocationName(name);
//       } else {
//         setClockOutLocationName(name);
//       }
      
//       return coords;
//     } catch (error) {
//       if (locationCache && (Date.now() - locationCache.timestamp) < LOCATION_CACHE_EXPIRY) {
//         const name = await getLocationName(locationCache.coords.latitude, locationCache.coords.longitude);
//         if (isClockIn) {
//           setClockInLocationName(name);
//         } else {
//           setClockOutLocationName(name);
//         }
//         return locationCache.coords;
//       }
      
//       throw new Error('Could not determine your location. Please ensure you have GPS signal.');
//     }
//   };

//   const formatTimeForERP = (date) => {
//     return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
//   };

//   const formatTime = (seconds) => {
//     const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
//     const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
//     const s = (seconds % 60).toString().padStart(2, '0');
//     return `${h}:${m}:${s}`;
//   };

//   const getTotalTime = () => {
//     if (!clockInTime || !clockOutTime) return '00:00:00';
//     const diffMs = clockOutTime - clockInTime;
//     return formatTime(Math.floor(diffMs / 1000));
//   };

//   const handleClockIn = async () => {
//     if (clockInLoading) return;

//     const hasPermission = await requestLocationPermission();
//     if (!hasPermission) {
//       Alert.alert('Permission denied', 'Location permission is required to clock in.');
//       return;
//     }

//     setClockInLoading(true);
//     setLocationError(null);
    
//     try {
//       const coords = await getLocationWithFallback(true);
      
//       const now = new Date();
//       const timeString = formatTimeForERP(now);
      
//       const res = await fetch(`${ERP_BASE_URL}/api/resource/Employee Checkin`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Cookie: `sid=${sid}`,
//         },
//         body: JSON.stringify({
//           employee: employeeData.name,
//           log_type: 'IN',
//           time: timeString,
//           latitude: coords.latitude,
//           longitude: coords.longitude,
//           accuracy: coords.accuracy,
//         }),
//       });

//       if (!res.ok) {
//         const errText = await res.text();
//         throw new Error(`Failed to clock in: ${errText}`);
//       }

//       setClockInTime(now);
//       setClockInLocation(coords);
//       setClockOutTime(null);
//       setServerCheckinStatus('IN');
      
//       Alert.alert('Success', 'Clock-in recorded successfully.');
//     } catch (error) {
//       setLocationError(error.message);
//       Alert.alert('Error', error.message);
//     } finally {
//       setClockInLoading(false);
//     }
//   };

//   const handleClockOut = async () => {
//     if (clockOutLoading) return;

//     setClockOutLoading(true);
//     setLocationError(null);
    
//     try {
//       const coords = await getLocationWithFallback(false);
      
//       const now = new Date();
//       const timeString = formatTimeForERP(now);
      
//       const res = await fetch(`${ERP_BASE_URL}/api/resource/Employee Checkin`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Cookie: `sid=${sid}`,
//         },
//         body: JSON.stringify({
//           employee: employeeData.name,
//           log_type: 'OUT',
//           time: timeString,
//           latitude: coords.latitude,
//           longitude: coords.longitude,
//           accuracy: coords.accuracy,
//         }),
//       });

//       if (!res.ok) {
//         const errText = await res.text();
//         throw new Error(`Failed to clock out: ${errText}`);
//       }

//       setClockOutTime(now);
//       setClockOutLocation(coords);
//       setServerCheckinStatus('OUT');
      
//       Alert.alert('Success', 'Clock-out recorded successfully.');
//     } catch (error) {
//       setLocationError(error.message);
      
//       if (locationCache && (Date.now() - locationCache.timestamp) < LOCATION_CACHE_EXPIRY * 2) {
//         const useCached = await new Promise(resolve => {
//           Alert.alert(
//             'Location Error',
//             'Could not get fresh location. Would you like to use your last known location?',
//             [
//               { text: 'Cancel', onPress: () => resolve(false), style: 'cancel' },
//               { text: 'Use Cached', onPress: () => resolve(true) }
//             ]
//           );
//         });
        
//         if (useCached) {
//           const name = await getLocationName(locationCache.coords.latitude, locationCache.coords.longitude);
//           setClockOutLocationName(name);
          
//           const now = new Date();
//           const timeString = formatTimeForERP(now);
          
//           const res = await fetch(`${ERP_BASE_URL}/api/resource/Employee Checkin`, {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               Cookie: `sid=${sid}`,
//             },
//             body: JSON.stringify({
//               employee: employeeData.name,
//               log_type: 'OUT',
//               time: timeString,
//               latitude: locationCache.coords.latitude,
//               longitude: locationCache.coords.longitude,
//               accuracy: locationCache.coords.accuracy,
//             }),
//           });

//           if (!res.ok) {
//             const errText = await res.text();
//             throw new Error(`Failed to clock out: ${errText}`);
//           }

//           setClockOutTime(now);
//           setClockOutLocation(locationCache.coords);
//           setServerCheckinStatus('OUT');
//           Alert.alert('Success', 'Clock-out recorded with cached location.');
//           return;
//         }
//       }
      
//       Alert.alert('Error', error.message);
//     } finally {
//       setClockOutLoading(false);
//     }
//   };

//   if (isLoadingData) {
//     return (
//       <View style={[styles.outerContainer, { justifyContent: 'center', alignItems: 'center' }]}>
//         <ActivityIndicator size="large" color="#4CAF50" />
//         <Text style={{ marginTop: 10 }}>Loading attendance data...</Text>
//       </View>
//     );
//   }

//   // Determine which button to show based on server status
//   const shouldShowClockIn = !clockInTime || (clockOutTime && serverCheckinStatus !== 'IN') || serverCheckinStatus === 'OUT';
//   const shouldShowClockOut = clockInTime && !clockOutTime && serverCheckinStatus === 'IN';

//   return (
//     <View style={styles.outerContainer}>
//       {/* Button Container */}
//       <View style={styles.buttonContainer}>
//         {shouldShowClockIn ? (
//           <TouchableOpacity
//             style={[styles.clockInButton, clockInLoading ? styles.buttonDisabled : {}]}
//             onPress={handleClockIn}
//             disabled={clockInLoading}
//           >
//             {clockInLoading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <>
//                 <Ionicons name="time-outline" size={28} color="#fff" />
//                 <Text style={styles.clockInButtonText}>Clock In</Text>
//               </>
//             )}
//           </TouchableOpacity>
//         ) : shouldShowClockOut ? (
//           <TouchableOpacity
//             style={[styles.clockOutButton, clockOutLoading ? styles.buttonDisabled : {}]}
//             onPress={handleClockOut}
//             disabled={clockOutLoading}
//           >
//             {clockOutLoading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <>
//                 <Ionicons name="exit-outline" size={28} color="#fff" />
//                 <Text style={styles.clockOutButtonText}>Clock Out</Text>
//               </>
//             )}
//           </TouchableOpacity>
//         ) : (
//           <Text style={styles.placeholderText}>Loading...</Text>
//         )}
//       </View>

//       {/* Info Container */}
//       <View style={styles.infoContainer}>
//         {clockInTime && !clockOutTime ? (
//           <>
//             <Text style={styles.timeLabel}>Clock In Time:</Text>
//             <Text style={styles.timeText}>
//               {clockInTime.toLocaleTimeString()}
//             </Text>
//             <Text style={styles.timerText}>Timer: {formatTime(clockInSeconds)}</Text>
//             <Text style={styles.locationText}>
//               {clockInLocationName}
//             </Text>
//           </>
//         ) : clockOutTime ? (
//           <>
//             <Text style={styles.timeLabel}>Clock Out Time:</Text>
//             <Text style={styles.timeText}>
//               {clockOutTime.toLocaleTimeString()}
//             </Text>
//             <Text style={styles.timerText}>Total Time: {getTotalTime()}</Text>
//             <Text style={styles.locationText}>
//               {clockOutLocationName}
//             </Text>
//           </>
//         ) : (
//           <Text style={styles.placeholderText}>No attendance record yet</Text>
//         )}
//         {locationError && (
//           <Text style={styles.errorText}>{locationError}</Text>
//         )}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   outerContainer: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f8f9fa',
//     justifyContent: 'center',
//   },
//   buttonContainer: {
//     backgroundColor: '#fff',
//     padding: 20,
//     marginBottom: 10,
//     borderRadius: 12,
//     alignItems: 'center',
//     elevation: 2,
//     borderWidth: 2,
//     borderColor: 'skyblue',
//   },
//   infoContainer: {
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 12,
//     alignItems: 'center',
//     elevation: 2,
//     borderWidth: 2,
//     borderColor: 'skyblue',
//   },
//   clockInButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: 150,
//     height: 150,
//     borderRadius: 75,
//     borderWidth:2,
//     borderColor:'skyblue',
//     backgroundColor: '#2196F3',
//     padding: 10,
//   },
//   clockOutButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: 150,
//     height: 150,
//     borderRadius: 75,
//     borderWidth:2,
//     borderColor:'black',
//     backgroundColor: '#f44336',
//     padding: 10,
//   },
//   buttonDisabled: {
//     opacity: 0.6,
//   },
//   clockInButtonText: {
//     marginLeft: 10,
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#fff',
//   },
//   clockOutButtonText: {
//     marginLeft: 10,
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#fff',
//   },
//   timeLabel: {
//     fontSize: 19,
//     color: '#555',
//     marginBottom: 5,
//   },
//   timeText: {
//     fontSize: 20,
//     color: '#222',
//     marginBottom: 10,
//   },
//   timerText: {
//     fontSize: 16,
//     color: 'skyblue',
//     marginBottom: 10,
//   },
//   locationText: {
//     fontSize: 14,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 5,
//   },
//   errorText: {
//     fontSize: 14,
//     color: '#f44336',
//     textAlign: 'center',
//   },
//   placeholderText: {
//     fontSize: 16,
//     color: '#888',
//     textAlign: 'center',
//   },
// });

// export default ClockIn;


/// clockin and clock out button correctly work and clockin and clockout time work


// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
//   Platform,
//   PermissionsAndroid,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import Geolocation from '@react-native-community/geolocation';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const ERP_BASE_URL = 'https://erpnextcloud.cbditsolutions.com';
// const LOCATION_CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes cache validity

// const ClockIn = ({ sid, employeeData }) => {
//   const [clockInTime, setClockInTime] = useState(null);
//   const [clockOutTime, setClockOutTime] = useState(null);
//   const [clockInSeconds, setClockInSeconds] = useState(0);
//   const [clockInLoading, setClockInLoading] = useState(false);
//   const [clockOutLoading, setClockOutLoading] = useState(false);
//   const [locationCache, setLocationCache] = useState(null);
//   const [clockInLocation, setClockInLocation] = useState(null);
//   const [clockOutLocation, setClockOutLocation] = useState(null);
//   const [locationError, setLocationError] = useState(null);
//   const [clockInLocationName, setClockInLocationName] = useState('Fetching location...');
//   const [clockOutLocationName, setClockOutLocationName] = useState('Fetching location...');
//   const [isLoadingData, setIsLoadingData] = useState(true);
//   const [currentStatus, setCurrentStatus] = useState(null); // 'IN', 'OUT', or null
//   const [lastCheckinRecord, setLastCheckinRecord] = useState(null);

//   const clockInTimerRef = useRef(null);

//   // Fetch latest checkin status from server
//   const fetchLatestCheckinStatus = async () => {
//     try {
//       const response = await fetch(
//         `${ERP_BASE_URL}/api/resource/Employee Checkin?fields=["name","employee","log_type","time","latitude","longitude"]&filters=[["employee","=","${employeeData.name}"]]&order_by=time desc&limit=1`,
//         {
//           headers: {
//             Cookie: `sid=${sid}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error('Failed to fetch checkin status');
//       }

//       const data = await response.json();
//       if (data.data && data.data.length > 0) {
//         const latestCheckin = data.data[0];
//         setLastCheckinRecord(latestCheckin);
//         setCurrentStatus(latestCheckin.log_type);
//         return latestCheckin;
//       }
//       setCurrentStatus(null);
//       return null;
//     } catch (error) {
//       console.error('Error fetching checkin status:', error);
//       setCurrentStatus(null);
//       return null;
//     }
//   };

//   // Fetch previous checkin records (for getting both IN and OUT records)
//   const fetchCheckinRecords = async () => {
//     try {
//       const response = await fetch(
//         `${ERP_BASE_URL}/api/resource/Employee Checkin?fields=["name","employee","log_type","time","latitude","longitude"]&filters=[["employee","=","${employeeData.name}"]]&order_by=time desc&limit=2`,
//         {
//           headers: {
//             Cookie: `sid=${sid}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error('Failed to fetch checkin records');
//       }

//       const data = await response.json();
//       return data.data || [];
//     } catch (error) {
//       console.error('Error fetching checkin records:', error);
//       return [];
//     }
//   };

//   // Extract time from datetime string (HH:MM AM/PM format)
//   const extractTimeFromDateTime = (dateTimeString) => {
//     if (!dateTimeString) return '';
//     try {
//       // Parse the date string in a way that works across different formats
//       const date = new Date(dateTimeString);
//       if (isNaN(date.getTime())) {
//         // If standard parsing fails, try to parse it manually
//         const parts = dateTimeString.split(/[- :T]/);
//         const fixedDate = new Date(
//           parts[0], // year
//           parts[1] - 1, // month (0-based)
//           parts[2], // day
//           parts[3], // hours
//           parts[4], // minutes
//           parts[5] || 0 // seconds
//         );
//         if (!isNaN(fixedDate.getTime())) {
//           return fixedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//         }
//         return 'Invalid time';
//       }
//       return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     } catch (error) {
//       console.error('Error parsing time:', error);
//       return 'Invalid time';
//     }
//   };

//   // Calculate time difference in HH:MM:SS format
//   const calculateTimeDifference = (startTime, endTime) => {
//     if (!startTime || !endTime) return '00:00:00';
    
//     try {
//       const start = new Date(startTime);
//       const end = new Date(endTime);
      
//       if (isNaN(start.getTime()) || isNaN(end.getTime())) {
//         return '00:00:00';
//       }
      
//       const diffMs = end - start;
      
//       const diffSec = Math.floor(diffMs / 1000);
//       const h = Math.floor(diffSec / 3600).toString().padStart(2, '0');
//       const m = Math.floor((diffSec % 3600) / 60).toString().padStart(2, '0');
//       const s = (diffSec % 60).toString().padStart(2, '0');
      
//       return `${h}:${m}:${s}`;
//     } catch (error) {
//       console.error('Error calculating time difference:', error);
//       return '00:00:00';
//     }
//   };

//   // Load saved data on component mount
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         // First fetch the latest status from server
//         const latestCheckin = await fetchLatestCheckinStatus();
        
//         if (latestCheckin) {
//           if (latestCheckin.log_type === 'IN') {
//             // If latest is IN, show clock out button and timer
//             setClockInTime(latestCheckin.time);
//             const now = new Date();
//             const clockInDate = new Date(latestCheckin.time);
//             const secondsSinceClockIn = isNaN(clockInDate.getTime()) ? 0 : Math.floor((now - clockInDate) / 1000);
//             setClockInSeconds(secondsSinceClockIn);
//             startClockInTimer();
//             setClockOutTime(null);
            
//             // Set location if available
//             if (latestCheckin.latitude && latestCheckin.longitude) {
//               const coords = {
//                 latitude: latestCheckin.latitude,
//                 longitude: latestCheckin.longitude,
//                 accuracy: 0
//               };
//               setClockInLocation(coords);
//               const name = await getLocationName(coords.latitude, coords.longitude);
//               setClockInLocationName(name);
//             }
//           } else if (latestCheckin.log_type === 'OUT') {
//             // If latest is OUT, show clock in button and fetch both records
//             const records = await fetchCheckinRecords();
//             if (records.length > 0) {
//               // First record is the OUT
//               setClockOutTime(records[0].time);
              
//               // Find the previous IN record
//               const inRecord = records.find(r => r.log_type === 'IN');
//               if (inRecord) {
//                 setClockInTime(inRecord.time);
//               }
              
//               // Set location if available
//               if (records[0].latitude && records[0].longitude) {
//                 const outCoords = {
//                   latitude: records[0].latitude,
//                   longitude: records[0].longitude,
//                   accuracy: 0
//                 };
//                 setClockOutLocation(outCoords);
//                 const outName = await getLocationName(outCoords.latitude, outCoords.longitude);
//                 setClockOutLocationName(outName);
//               }
//             }
//           }
//         }
//       } catch (error) {
//         console.error('Error loading data:', error);
//       } finally {
//         setIsLoadingData(false);
//       }
//     };

//     loadData();
    
//     return () => {
//       if (clockInTimerRef.current) {
//         clearInterval(clockInTimerRef.current);
//       }
//     };
//   }, [employeeData.name]);

//   const startClockInTimer = () => {
//     if (clockInTimerRef.current) {
//       clearInterval(clockInTimerRef.current);
//     }
//     clockInTimerRef.current = setInterval(() => {
//       setClockInSeconds(prev => prev + 1);
//     }, 1000);
//   };

//   // Timer effect
//   useEffect(() => {
//     if (currentStatus === 'IN' && clockInTime) {
//       startClockInTimer();
//     } else {
//       if (clockInTimerRef.current) {
//         clearInterval(clockInTimerRef.current);
//       }
//       setClockInSeconds(0);
//     }
//   }, [currentStatus, clockInTime]);

//   const requestLocationPermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//           {
//             title: 'Location Permission',
//             message: 'This app needs access to your location for attendance tracking.',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           }
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch (err) {
//         return false;
//       }
//     }
//     return true;
//   };

//   const getLocationName = async (latitude, longitude) => {
//     try {
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
//       );
      
//       const data = await response.json();
      
//       if (!data || !data.address) {
//         return 'Nearby location';
//       }
      
//       const address = data.address;
//       let locationName = '';
      
//       if (address.building) locationName += `${address.building}, `;
//       if (address.road) locationName += `${address.road}, `;
//       if (address.neighbourhood) locationName += `${address.neighbourhood}, `;
//       if (address.suburb) locationName += `${address.suburb}, `;
//       if (address.city_district) locationName += `${address.city_district}, `;
//       if (address.city) locationName += `${address.city}, `;
//       if (address.town) locationName += `${address.town}, `;
//       if (address.county) locationName += `${address.county}, `;
//       if (address.state) locationName += `${address.state}`;
      
//       locationName = locationName.replace(/, $/, '').replace(/, ,/g, ', ');
      
//       if (!locationName && data.display_name) {
//         locationName = data.display_name.split(',')[0];
//       }
      
//       return locationName || 'Current location';
//     } catch (error) {
//       return 'Current location';
//     }
//   };

//   const getQuickLocation = async () => {
//     return new Promise((resolve, reject) => {
//       Geolocation.getCurrentPosition(
//         position => resolve(position.coords),
//         error => reject(error),
//         {
//           enableHighAccuracy: false,
//           timeout: 3000,
//           maximumAge: 30000
//         }
//       );
//     });
//   };

//   const getLocationWithFallback = async (isClockIn) => {
//     setLocationError(null);
//     if (isClockIn) {
//       setClockInLocationName('Getting location...');
//     } else {
//       setClockOutLocationName('Getting location...');
//     }
    
//     try {
//       const coords = await getQuickLocation();
//       setLocationCache({ coords, timestamp: Date.now() });
      
//       const name = await getLocationName(coords.latitude, coords.longitude);
//       if (isClockIn) {
//         setClockInLocationName(name);
//       } else {
//         setClockOutLocationName(name);
//       }
      
//       return coords;
//     } catch (error) {
//       if (locationCache && (Date.now() - locationCache.timestamp) < LOCATION_CACHE_EXPIRY) {
//         const name = await getLocationName(locationCache.coords.latitude, locationCache.coords.longitude);
//         if (isClockIn) {
//           setClockInLocationName(name);
//         } else {
//           setClockOutLocationName(name);
//         }
//         return locationCache.coords;
//       }
      
//       throw new Error('Could not determine your location. Please ensure you have GPS signal.');
//     }
//   };

//   const formatTimeForERP = (date) => {
//     return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
//   };

//   const formatTime = (seconds) => {
//     const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
//     const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
//     const s = (seconds % 60).toString().padStart(2, '0');
//     return `${h}:${m}:${s}`;
//   };

//   const handleClockIn = async () => {
//     if (clockInLoading) return;

//     const hasPermission = await requestLocationPermission();
//     if (!hasPermission) {
//       Alert.alert('Permission denied', 'Location permission is required to clock in.');
//       return;
//     }

//     setClockInLoading(true);
//     setLocationError(null);
    
//     try {
//       const coords = await getLocationWithFallback(true);
      
//       const now = new Date();
//       const timeString = formatTimeForERP(now);
      
//       const res = await fetch(`${ERP_BASE_URL}/api/resource/Employee Checkin`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Cookie: `sid=${sid}`,
//         },
//         body: JSON.stringify({
//           employee: employeeData.name,
//           log_type: 'IN',
//           time: timeString,
//           latitude: coords.latitude,
//           longitude: coords.longitude,
//           accuracy: coords.accuracy,
//         }),
//       });

//       if (!res.ok) {
//         const errText = await res.text();
//         throw new Error(`Failed to clock in: ${errText}`);
//       }

//       // After successful clock in, fetch the latest status to ensure UI is in sync
//       const latestCheckin = await fetchLatestCheckinStatus();
      
//       if (latestCheckin && latestCheckin.log_type === 'IN') {
//         setClockInTime(latestCheckin.time);
//         const now = new Date();
//         const clockInDate = new Date(latestCheckin.time);
//         const secondsSinceClockIn = isNaN(clockInDate.getTime()) ? 0 : Math.floor((now - clockInDate) / 1000);
//         setClockInSeconds(secondsSinceClockIn);
//         startClockInTimer();
        
//         if (latestCheckin.latitude && latestCheckin.longitude) {
//           const serverCoords = {
//             latitude: latestCheckin.latitude,
//             longitude: latestCheckin.longitude,
//             accuracy: 0
//           };
//           setClockInLocation(serverCoords);
//           const name = await getLocationName(serverCoords.latitude, serverCoords.longitude);
//           setClockInLocationName(name);
//         } else {
//           setClockInLocation(coords);
//         }
//       }
      
//       setClockOutTime(null);
      
//       Alert.alert('Success', 'Clock-in recorded successfully.');
//     } catch (error) {
//       setLocationError(error.message);
//       Alert.alert('Error', error.message);
//     } finally {
//       setClockInLoading(false);
//     }
//   };

//   const handleClockOut = async () => {
//     if (clockOutLoading) return;

//     setClockOutLoading(true);
//     setLocationError(null);
    
//     try {
//       const coords = await getLocationWithFallback(false);
      
//       const now = new Date();
//       const timeString = formatTimeForERP(now);
      
//       const res = await fetch(`${ERP_BASE_URL}/api/resource/Employee Checkin`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Cookie: `sid=${sid}`,
//         },
//         body: JSON.stringify({
//           employee: employeeData.name,
//           log_type: 'OUT',
//           time: timeString,
//           latitude: coords.latitude,
//           longitude: coords.longitude,
//           accuracy: coords.accuracy,
//         }),
//       });

//       if (!res.ok) {
//         const errText = await res.text();
//         throw new Error(`Failed to clock out: ${errText}`);
//       }

//       // After successful clock out, fetch the latest status to ensure UI is in sync
//       const latestCheckin = await fetchLatestCheckinStatus();
      
//       if (latestCheckin && latestCheckin.log_type === 'OUT') {
//         setClockOutTime(latestCheckin.time);
//         setClockOutLocation({
//           latitude: latestCheckin.latitude,
//           longitude: latestCheckin.longitude,
//           accuracy: 0
//         });
//         const name = await getLocationName(latestCheckin.latitude, latestCheckin.longitude);
//         setClockOutLocationName(name);
//       }
      
//       Alert.alert('Success', 'Clock-out recorded successfully.');
//     } catch (error) {
//       setLocationError(error.message);
      
//       if (locationCache && (Date.now() - locationCache.timestamp) < LOCATION_CACHE_EXPIRY * 2) {
//         const useCached = await new Promise(resolve => {
//           Alert.alert(
//             'Location Error',
//             'Could not get fresh location. Would you like to use your last known location?',
//             [
//               { text: 'Cancel', onPress: () => resolve(false), style: 'cancel' },
//               { text: 'Use Cached', onPress: () => resolve(true) }
//             ]
//           );
//         });
        
//         if (useCached) {
//           const name = await getLocationName(locationCache.coords.latitude, locationCache.coords.longitude);
//           setClockOutLocationName(name);
          
//           const now = new Date();
//           const timeString = formatTimeForERP(now);
          
//           const res = await fetch(`${ERP_BASE_URL}/api/resource/Employee Checkin`, {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               Cookie: `sid=${sid}`,
//             },
//             body: JSON.stringify({
//               employee: employeeData.name,
//               log_type: 'OUT',
//               time: timeString,
//               latitude: locationCache.coords.latitude,
//               longitude: locationCache.coords.longitude,
//               accuracy: locationCache.coords.accuracy,
//             }),
//           });

//           if (!res.ok) {
//             const errText = await res.text();
//             throw new Error(`Failed to clock out: ${errText}`);
//           }

//           setClockOutTime(now);
//           setClockOutLocation(locationCache.coords);
//           Alert.alert('Success', 'Clock-out recorded with cached location.');
//           return;
//         }
//       }
      
//       Alert.alert('Error', error.message);
//     } finally {
//       setClockOutLoading(false);
//     }
//   };

//   if (isLoadingData) {
//     return (
//       <View style={[styles.outerContainer, { justifyContent: 'center', alignItems: 'center' }]}>
//         <ActivityIndicator size="large" color="#4CAF50" />
//         <Text style={{ marginTop: 10 }}>Loading attendance data...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.outerContainer}>
//       {/* Button Container */}
//       <View style={styles.buttonContainer}>
//         {currentStatus !== 'IN' ? (
//           <TouchableOpacity
//             style={[styles.clockInButton, clockInLoading ? styles.buttonDisabled : {}]}
//             onPress={handleClockIn}
//             disabled={clockInLoading}
//           >
//             {clockInLoading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <>
//                 <Ionicons name="time-outline" size={28} color="#fff" />
//                 <Text style={styles.clockInButtonText}>Clock In</Text>
//               </>
//             )}
//           </TouchableOpacity>
//         ) : (
//           <TouchableOpacity
//             style={[styles.clockOutButton, clockOutLoading ? styles.buttonDisabled : {}]}
//             onPress={handleClockOut}
//             disabled={clockOutLoading}
//           >
//             {clockOutLoading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <>
//                 <Ionicons name="exit-outline" size={28} color="#fff" />
//                 <Text style={styles.clockOutButtonText}>Clock Out</Text>
//               </>
//             )}
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* Info Container */}
//       <View style={styles.infoContainer}>
//         {currentStatus === 'IN' && clockInTime ? (
//           <>
//             <Text style={styles.timeLabel}>Clock In Time:</Text>
//             <Text style={styles.timeText}>
//               {extractTimeFromDateTime(clockInTime)}
//             </Text>
//             <Text style={styles.timerText}>Timer: {formatTime(clockInSeconds)}</Text>
//             {clockInLocationName && (
//               <Text style={styles.locationText}>
//                 {clockInLocationName}
//               </Text>
//             )}
//           </>
//         ) : currentStatus === 'OUT' && clockOutTime ? (
//           <>
//             <Text style={styles.timeLabel}>Clock Out Time:</Text>
//             <Text style={styles.timeText}>
//               {extractTimeFromDateTime(clockOutTime)}
//             </Text>
//             {clockInTime && (
//               <>
//                 <Text style={styles.timerText}>Total Time: {calculateTimeDifference(clockInTime, clockOutTime)}</Text>
//               </>
//             )}
//             {clockOutLocationName && (
//               <Text style={styles.locationText}>
//                 {clockOutLocationName}
//               </Text>
//             )}
//           </>
//         ) : (
//           <Text style={styles.placeholderText}>No attendance record yet</Text>
//         )}
        
//         {locationError && (
//           <Text style={styles.errorText}>{locationError}</Text>
//         )}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   outerContainer: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f8f9fa',
//     justifyContent: 'center',
//   },
//   buttonContainer: {
//     backgroundColor: '#fff',
//     padding: 20,
//     marginBottom: 10,
//     borderRadius: 12,
//     alignItems: 'center',
//     elevation: 2,
//     borderWidth: 2,
//     borderColor: 'skyblue',
//   },
//   infoContainer: {
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 12,
//     alignItems: 'center',
//     elevation: 2,
//     borderWidth: 2,
//     borderColor: 'skyblue',
//   },
//   clockInButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: 150,
//     height: 150,
//     borderRadius: 75,
//     borderWidth: 2,
//     borderColor: 'skyblue',
//     backgroundColor: '#2196F3',
//     padding: 10,
//   },
//   clockOutButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: 150,
//     height: 150,
//     borderRadius: 75,
//     borderWidth: 2,
//     borderColor: 'black',
//     backgroundColor: '#f44336',
//     padding: 10,
//   },
//   buttonDisabled: {
//     opacity: 0.6,
//   },
//   clockInButtonText: {
//     marginLeft: 10,
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#fff',
//   },
//   clockOutButtonText: {
//     marginLeft: 10,
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#fff',
//   },
//   timeLabel: {
//     fontSize: 19,
//     color: '#555',
//     marginBottom: 5,
//   },
//   timeText: {
//     fontSize: 20,
//     color: '#222',
//     marginBottom: 10,
//   },
//   timerText: {
//     fontSize: 16,
//     color: 'skyblue',
//     marginBottom: 10,
//   },
//   locationText: {
//     fontSize: 14,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 5,
//   },
//   errorText: {
//     fontSize: 14,
//     color: '#f44336',
//     textAlign: 'center',
//   },
//   placeholderText: {
//     fontSize: 16,
//     color: '#888',
//     textAlign: 'center',
//   },
// });

// export default ClockIn;






//// this code properly for both clockin and clockout button wth time


// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
//   Platform,
//   PermissionsAndroid,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import Geolocation from '@react-native-community/geolocation';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const ERP_BASE_URL = 'https://erpnextcloud.cbditsolutions.com';
// const LOCATION_CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes cache validity

// const ClockIn = ({ sid, employeeData }) => {
//   const [clockInTime, setClockInTime] = useState(null);
//   const [clockOutTime, setClockOutTime] = useState(null);
//   const [clockInSeconds, setClockInSeconds] = useState(0);
//   const [clockInLoading, setClockInLoading] = useState(false);
//   const [clockOutLoading, setClockOutLoading] = useState(false);
//   const [locationCache, setLocationCache] = useState(null);
//   const [clockInLocation, setClockInLocation] = useState(null);
//   const [clockOutLocation, setClockOutLocation] = useState(null);
//   const [locationError, setLocationError] = useState(null);
//   const [clockInLocationName, setClockInLocationName] = useState('Fetching location...');
//   const [clockOutLocationName, setClockOutLocationName] = useState('Fetching location...');
//   const [isLoadingData, setIsLoadingData] = useState(true);
//   const [currentStatus, setCurrentStatus] = useState(null); // 'IN', 'OUT', or null
//   const [lastCheckinRecord, setLastCheckinRecord] = useState(null);
//   const [refreshing, setRefreshing] = useState(false);

//   const clockInTimerRef = useRef(null);

//   // Fetch latest checkin status from server
//   const fetchLatestCheckinStatus = async () => {
//     try {
//       const response = await fetch(
//         `${ERP_BASE_URL}/api/resource/Employee Checkin?fields=["name","employee","log_type","time","latitude","longitude"]&filters=[["employee","=","${employeeData.name}"]]&order_by=time desc&limit=1`,
//         {
//           headers: {
//             Cookie: `sid=${sid}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error('Failed to fetch checkin status');
//       }

//       const data = await response.json();
//       if (data.data && data.data.length > 0) {
//         const latestCheckin = data.data[0];
//         setLastCheckinRecord(latestCheckin);
//         setCurrentStatus(latestCheckin.log_type);
//         return latestCheckin;
//       }
//       setCurrentStatus(null);
//       return null;
//     } catch (error) {
//       console.error('Error fetching checkin status:', error);
//       setCurrentStatus(null);
//       return null;
//     }
//   };

//   // Fetch previous checkin records (for getting both IN and OUT records)
//   const fetchCheckinRecords = async () => {
//     try {
//       const response = await fetch(
//         `${ERP_BASE_URL}/api/resource/Employee Checkin?fields=["name","employee","log_type","time","latitude","longitude"]&filters=[["employee","=","${employeeData.name}"]]&order_by=time desc&limit=2`,
//         {
//           headers: {
//             Cookie: `sid=${sid}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error('Failed to fetch checkin records');
//       }

//       const data = await response.json();
//       return data.data || [];
//     } catch (error) {
//       console.error('Error fetching checkin records:', error);
//       return [];
//     }
//   };

//   // Extract time from datetime string (HH:MM AM/PM format)
//   const extractTimeFromDateTime = (dateTimeString) => {
//     if (!dateTimeString) return '';
//     try {
//       const date = new Date(dateTimeString);
//       if (isNaN(date.getTime())) {
//         const parts = dateTimeString.split(/[- :T]/);
//         const fixedDate = new Date(
//           parts[0],
//           parts[1] - 1,
//           parts[2],
//           parts[3],
//           parts[4],
//           parts[5] || 0
//         );
//         if (!isNaN(fixedDate.getTime())) {
//           return fixedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//         }
//         return 'Invalid time';
//       }
//       return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     } catch (error) {
//       console.error('Error parsing time:', error);
//       return 'Invalid time';
//     }
//   };

//   // Calculate time difference in HH:MM:SS format
//   const calculateTimeDifference = (startTime, endTime) => {
//     if (!startTime || !endTime) return '00:00:00';
    
//     try {
//       let start = new Date(startTime);
//       let end = new Date(endTime);
      
//       if (isNaN(start.getTime())) {
//         // Try alternative parsing if standard parsing fails
//         const parts = startTime.split(/[- :T]/);
//         const fixedStart = new Date(
//           parts[0],
//           parts[1] - 1,
//           parts[2],
//           parts[3],
//           parts[4],
//           parts[5] || 0
//         );
//         if (!isNaN(fixedStart.getTime())) {
//           start = fixedStart;
//         }
//       }

//       if (isNaN(end.getTime())) {
//         const parts = endTime.split(/[- :T]/);
//         const fixedEnd = new Date(
//           parts[0],
//           parts[1] - 1,
//           parts[2],
//           parts[3],
//           parts[4],
//           parts[5] || 0
//         );
//         if (!isNaN(fixedEnd.getTime())) {
//           end = fixedEnd;
//         }
//       }
      
//       if (isNaN(start.getTime()) || isNaN(end.getTime())) {
//         return '00:00:00';
//       }
      
//       const diffMs = end - start;
//       const diffSec = Math.floor(diffMs / 1000);
//       const h = Math.floor(diffSec / 3600).toString().padStart(2, '0');
//       const m = Math.floor((diffSec % 3600) / 60).toString().padStart(2, '0');
//       const s = (diffSec % 60).toString().padStart(2, '0');
      
//       return `${h}:${m}:${s}`;
//     } catch (error) {
//       console.error('Error calculating time difference:', error);
//       return '00:00:00';
//     }
//   };

//   // Calculate elapsed seconds from clock-in time
//   const calculateElapsedSeconds = (clockInTime) => {
//     if (!clockInTime) return 0;
    
//     try {
//       const clockInDate = new Date(clockInTime);
//       if (isNaN(clockInDate.getTime())) {
//         // Try alternative parsing if standard parsing fails
//         const parts = clockInTime.split(/[- :T]/);
//         const fixedDate = new Date(
//           parts[0],
//           parts[1] - 1,
//           parts[2],
//           parts[3],
//           parts[4],
//           parts[5] || 0
//         );
//         if (!isNaN(fixedDate.getTime())) {
//           return Math.floor((new Date() - fixedDate) / 1000);
//         }
//         return 0;
//       }
//       return Math.floor((new Date() - clockInDate) / 1000);
//     } catch (error) {
//       console.error('Error calculating elapsed seconds:', error);
//       return 0;
//     }
//   };

//   // Refresh data
//   const refreshData = async () => {
//     setRefreshing(true);
//     try {
//       const latestCheckin = await fetchLatestCheckinStatus();
      
//       if (latestCheckin) {
//         if (latestCheckin.log_type === 'IN') {
//           setClockInTime(latestCheckin.time);
//           const elapsedSeconds = calculateElapsedSeconds(latestCheckin.time);
//           setClockInSeconds(elapsedSeconds);
//           startClockInTimer();
//           setClockOutTime(null);
          
//           if (latestCheckin.latitude && latestCheckin.longitude) {
//             const coords = {
//               latitude: latestCheckin.latitude,
//               longitude: latestCheckin.longitude,
//               accuracy: 0
//             };
//             setClockInLocation(coords);
//             const name = await getLocationName(coords.latitude, coords.longitude);
//             setClockInLocationName(name);
//           }
//         } else if (latestCheckin.log_type === 'OUT') {
//           const records = await fetchCheckinRecords();
//           if (records.length > 0) {
//             setClockOutTime(records[0].time);
            
//             const inRecord = records.find(r => r.log_type === 'IN');
//             if (inRecord) {
//               setClockInTime(inRecord.time);
//             }
            
//             if (records[0].latitude && records[0].longitude) {
//               const outCoords = {
//                 latitude: records[0].latitude,
//                 longitude: records[0].longitude,
//                 accuracy: 0
//               };
//               setClockOutLocation(outCoords);
//               const outName = await getLocationName(outCoords.latitude, outCoords.longitude);
//               setClockOutLocationName(outName);
//             }
//           }
//         }
//       } else {
//         setClockInTime(null);
//         setClockOutTime(null);
//         setCurrentStatus(null);
//       }
//     } catch (error) {
//       console.error('Error refreshing data:', error);
//       Alert.alert('Error', 'Failed to refresh data');
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   // Load saved data on component mount
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         // First fetch the latest status from server
//         const latestCheckin = await fetchLatestCheckinStatus();
        
//         if (latestCheckin) {
//           if (latestCheckin.log_type === 'IN') {
//             // If latest is IN, show clock out button and timer
//             setClockInTime(latestCheckin.time);
//             const elapsedSeconds = calculateElapsedSeconds(latestCheckin.time);
//             setClockInSeconds(elapsedSeconds);
//             startClockInTimer();
//             setClockOutTime(null);
            
//             // Set location if available
//             if (latestCheckin.latitude && latestCheckin.longitude) {
//               const coords = {
//                 latitude: latestCheckin.latitude,
//                 longitude: latestCheckin.longitude,
//                 accuracy: 0
//               };
//               setClockInLocation(coords);
//               const name = await getLocationName(coords.latitude, coords.longitude);
//               setClockInLocationName(name);
//             }
//           } else if (latestCheckin.log_type === 'OUT') {
//             // If latest is OUT, show clock in button and fetch both records
//             const records = await fetchCheckinRecords();
//             if (records.length > 0) {
//               // First record is the OUT
//               setClockOutTime(records[0].time);
              
//               // Find the previous IN record
//               const inRecord = records.find(r => r.log_type === 'IN');
//               if (inRecord) {
//                 setClockInTime(inRecord.time);
//               }
              
//               // Set location if available
//               if (records[0].latitude && records[0].longitude) {
//                 const outCoords = {
//                   latitude: records[0].latitude,
//                   longitude: records[0].longitude,
//                   accuracy: 0
//                 };
//                 setClockOutLocation(outCoords);
//                 const outName = await getLocationName(outCoords.latitude, outCoords.longitude);
//                 setClockOutLocationName(outName);
//               }
//             }
//           }
//         }
//       } catch (error) {
//         console.error('Error loading data:', error);
//       } finally {
//         setIsLoadingData(false);
//       }
//     };

//     loadData();
    
//     return () => {
//       if (clockInTimerRef.current) {
//         clearInterval(clockInTimerRef.current);
//       }
//     };
//   }, [employeeData.name]);

//   const startClockInTimer = () => {
//     if (clockInTimerRef.current) {
//       clearInterval(clockInTimerRef.current);
//     }
    
//     // Update immediately to ensure no delay
//     if (clockInTime) {
//       const elapsedSeconds = calculateElapsedSeconds(clockInTime);
//       setClockInSeconds(elapsedSeconds);
//     }
    
//     // Then start the interval
//     clockInTimerRef.current = setInterval(() => {
//       setClockInSeconds(prev => prev + 1);
//     }, 1000);
//   };

//   // Timer effect
//   useEffect(() => {
//     if (currentStatus === 'IN' && clockInTime) {
//       startClockInTimer();
//     } else {
//       if (clockInTimerRef.current) {
//         clearInterval(clockInTimerRef.current);
//       }
//       setClockInSeconds(0);
//     }
//   }, [currentStatus, clockInTime]);

//   const requestLocationPermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//           {
//             title: 'Location Permission',
//             message: 'This app needs access to your location for attendance tracking.',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           }
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch (err) {
//         return false;
//       }
//     }
//     return true;
//   };

//   const getLocationName = async (latitude, longitude) => {
//     try {
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
//       );
      
//       const data = await response.json();
      
//       if (!data || !data.address) {
//         return 'Nearby location';
//       }
      
//       const address = data.address;
//       let locationName = '';
      
//       if (address.building) locationName += `${address.building}, `;
//       if (address.road) locationName += `${address.road}, `;
//       if (address.neighbourhood) locationName += `${address.neighbourhood}, `;
//       if (address.suburb) locationName += `${address.suburb}, `;
//       if (address.city_district) locationName += `${address.city_district}, `;
//       if (address.city) locationName += `${address.city}, `;
//       if (address.town) locationName += `${address.town}, `;
//       if (address.county) locationName += `${address.county}, `;
//       if (address.state) locationName += `${address.state}`;
      
//       locationName = locationName.replace(/, $/, '').replace(/, ,/g, ', ');
      
//       if (!locationName && data.display_name) {
//         locationName = data.display_name.split(',')[0];
//       }
      
//       return locationName || 'Current location';
//     } catch (error) {
//       return 'Current location';
//     }
//   };

//   const getQuickLocation = async () => {
//     return new Promise((resolve, reject) => {
//       Geolocation.getCurrentPosition(
//         position => resolve(position.coords),
//         error => reject(error),
//         {
//           enableHighAccuracy: false,
//           timeout: 3000,
//           maximumAge: 30000
//         }
//       );
//     });
//   };

//   const getLocationWithFallback = async (isClockIn) => {
//     setLocationError(null);
//     if (isClockIn) {
//       setClockInLocationName('Getting location...');
//     } else {
//       setClockOutLocationName('Getting location...');
//     }
    
//     try {
//       const coords = await getQuickLocation();
//       setLocationCache({ coords, timestamp: Date.now() });
      
//       const name = await getLocationName(coords.latitude, coords.longitude);
//       if (isClockIn) {
//         setClockInLocationName(name);
//       } else {
//         setClockOutLocationName(name);
//       }
      
//       return coords;
//     } catch (error) {
//       if (locationCache && (Date.now() - locationCache.timestamp) < LOCATION_CACHE_EXPIRY) {
//         const name = await getLocationName(locationCache.coords.latitude, locationCache.coords.longitude);
//         if (isClockIn) {
//           setClockInLocationName(name);
//         } else {
//           setClockOutLocationName(name);
//         }
//         return locationCache.coords;
//       }
      
//       throw new Error('Could not determine your location. Please ensure you have GPS signal.');
//     }
//   };

//   const formatTimeForERP = (date) => {
//     return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
//   };

//   const formatTime = (seconds) => {
//     const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
//     const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
//     const s = (seconds % 60).toString().padStart(2, '0');
//     return `${h}:${m}:${s}`;
//   };

//   const handleClockIn = async () => {
//     if (clockInLoading) return;

//     const hasPermission = await requestLocationPermission();
//     if (!hasPermission) {
//       Alert.alert('Permission denied', 'Location permission is required to clock in.');
//       return;
//     }

//     setClockInLoading(true);
//     setLocationError(null);
    
//     try {
//       const coords = await getLocationWithFallback(true);
      
//       const now = new Date();
//       const timeString = formatTimeForERP(now);
      
//       const res = await fetch(`${ERP_BASE_URL}/api/resource/Employee Checkin`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Cookie: `sid=${sid}`,
//         },
//         body: JSON.stringify({
//           employee: employeeData.name,
//           log_type: 'IN',
//           time: timeString,
//           latitude: coords.latitude,
//           longitude: coords.longitude,
//           accuracy: coords.accuracy,
//         }),
//       });

//       if (!res.ok) {
//         const errText = await res.text();
//         throw new Error(`Failed to clock in: ${errText}`);
//       }

//       // After successful clock in, fetch the latest status to ensure UI is in sync
//       const latestCheckin = await fetchLatestCheckinStatus();
      
//       if (latestCheckin && latestCheckin.log_type === 'IN') {
//         setClockInTime(latestCheckin.time);
//         const elapsedSeconds = calculateElapsedSeconds(latestCheckin.time);
//         setClockInSeconds(elapsedSeconds);
//         startClockInTimer();
        
//         if (latestCheckin.latitude && latestCheckin.longitude) {
//           const serverCoords = {
//             latitude: latestCheckin.latitude,
//             longitude: latestCheckin.longitude,
//             accuracy: 0
//           };
//           setClockInLocation(serverCoords);
//           const name = await getLocationName(serverCoords.latitude, serverCoords.longitude);
//           setClockInLocationName(name);
//         } else {
//           setClockInLocation(coords);
//         }
//       }
      
//       setClockOutTime(null);
      
//       Alert.alert('Success', 'Clock-in recorded successfully.');
//     } catch (error) {
//       setLocationError(error.message);
//       Alert.alert('Error', error.message);
//     } finally {
//       setClockInLoading(false);
//     }
//   };

//   const handleClockOut = async () => {
//     if (clockOutLoading) return;

//     setClockOutLoading(true);
//     setLocationError(null);
    
//     try {
//       const coords = await getLocationWithFallback(false);
      
//       const now = new Date();
//       const timeString = formatTimeForERP(now);
      
//       const res = await fetch(`${ERP_BASE_URL}/api/resource/Employee Checkin`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Cookie: `sid=${sid}`,
//         },
//         body: JSON.stringify({
//           employee: employeeData.name,
//           log_type: 'OUT',
//           time: timeString,
//           latitude: coords.latitude,
//           longitude: coords.longitude,
//           accuracy: coords.accuracy,
//         }),
//       });

//       if (!res.ok) {
//         const errText = await res.text();
//         throw new Error(`Failed to clock out: ${errText}`);
//       }

//       // After successful clock out, fetch the latest status to ensure UI is in sync
//       const latestCheckin = await fetchLatestCheckinStatus();
      
//       if (latestCheckin && latestCheckin.log_type === 'OUT') {
//         setClockOutTime(latestCheckin.time);
//         setClockOutLocation({
//           latitude: latestCheckin.latitude,
//           longitude: latestCheckin.longitude,
//           accuracy: 0
//         });
//         const name = await getLocationName(latestCheckin.latitude, latestCheckin.longitude);
//         setClockOutLocationName(name);
//       }
      
//       Alert.alert('Success', 'Clock-out recorded successfully.');
//     } catch (error) {
//       setLocationError(error.message);
      
//       if (locationCache && (Date.now() - locationCache.timestamp) < LOCATION_CACHE_EXPIRY * 2) {
//         const useCached = await new Promise(resolve => {
//           Alert.alert(
//             'Location Error',
//             'Could not get fresh location. Would you like to use your last known location?',
//             [
//               { text: 'Cancel', onPress: () => resolve(false), style: 'cancel' },
//               { text: 'Use Cached', onPress: () => resolve(true) }
//             ]
//           );
//         });
        
//         if (useCached) {
//           const name = await getLocationName(locationCache.coords.latitude, locationCache.coords.longitude);
//           setClockOutLocationName(name);
          
//           const now = new Date();
//           const timeString = formatTimeForERP(now);
          
//           const res = await fetch(`${ERP_BASE_URL}/api/resource/Employee Checkin`, {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               Cookie: `sid=${sid}`,
//             },
//             body: JSON.stringify({
//               employee: employeeData.name,
//               log_type: 'OUT',
//               time: timeString,
//               latitude: locationCache.coords.latitude,
//               longitude: locationCache.coords.longitude,
//               accuracy: locationCache.coords.accuracy,
//             }),
//           });

//           if (!res.ok) {
//             const errText = await res.text();
//             throw new Error(`Failed to clock out: ${errText}`);
//           }

//           setClockOutTime(now);
//           setClockOutLocation(locationCache.coords);
//           Alert.alert('Success', 'Clock-out recorded with cached location.');
//           return;
//         }
//       }
      
//       Alert.alert('Error', error.message);
//     } finally {
//       setClockOutLoading(false);
//     }
//   };

//   if (isLoadingData) {
//     return (
//       <View style={[styles.outerContainer, { justifyContent: 'center', alignItems: 'center' }]}>
//         <ActivityIndicator size="large" color="#4CAF50" />
//         <Text style={{ marginTop: 10 }}>Loading attendance data...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.outerContainer}>
//       {/* Refresh Button */}
//       <TouchableOpacity 
//         style={styles.refreshButton} 
//         onPress={refreshData}
//         disabled={refreshing}
//       >
//         <Ionicons 
//           name="refresh" 
//           size={24} 
//           color="#fff" 
//         />
//         <Text style={styles.refreshButtonText}>
//           {refreshing ? 'Refreshing...' : 'Refresh'}
//         </Text>
//       </TouchableOpacity>

//       {/* Button Container */}
//       <View style={styles.buttonContainer}>
//         {currentStatus !== 'IN' ? (
//           <TouchableOpacity
//             style={[styles.clockInButton, clockInLoading ? styles.buttonDisabled : {}]}
//             onPress={handleClockIn}
//             disabled={clockInLoading}
//           >
//             {clockInLoading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <>
//                 <Ionicons name="time-outline" size={28} color="#fff" />
//                 <Text style={styles.clockInButtonText}>Clock In</Text>
//               </>
//             )}
//           </TouchableOpacity>
//         ) : (
//           <TouchableOpacity
//             style={[styles.clockOutButton, clockOutLoading ? styles.buttonDisabled : {}]}
//             onPress={handleClockOut}
//             disabled={clockOutLoading}
//           >
//             {clockOutLoading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <>
//                 <Ionicons name="exit-outline" size={28} color="#fff" />
//                 <Text style={styles.clockOutButtonText}>Clock Out</Text>
//               </>
//             )}
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* Info Container */}
//       <View style={styles.infoContainer}>
//         {currentStatus === 'IN' && clockInTime ? (
//           <>
//             <Text style={styles.timeLabel}>Clock In Time:</Text>
//             <Text style={styles.timeText}>
//               {extractTimeFromDateTime(clockInTime)}
//             </Text>
//             <Text style={styles.timerText}>Timer: {formatTime(clockInSeconds)}</Text>
//             {clockInLocationName && (
//               <Text style={styles.locationText}>
//                 {clockInLocationName}
//               </Text>
//             )}
//           </>
//         ) : currentStatus === 'OUT' && clockOutTime ? (
//           <>
//             <Text style={styles.timeLabel}>Clock Out Time:</Text>
//             <Text style={styles.timeText}>
//               {extractTimeFromDateTime(clockOutTime)}
//             </Text>
//             {clockInTime && (
//               <>
//                 <Text style={styles.timerText}>Total Time: {calculateTimeDifference(clockInTime, clockOutTime)}</Text>
//               </>
//             )}
//             {clockOutLocationName && (
//               <Text style={styles.locationText}>
//                 {clockOutLocationName}
//               </Text>
//             )}
//           </>
//         ) : (
//           <Text style={styles.placeholderText}>No attendance record yet</Text>
//         )}
        
//         {locationError && (
//           <Text style={styles.errorText}>{locationError}</Text>
//         )}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   outerContainer: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f8f9fa',
//     justifyContent: 'center',
//   },
//   refreshButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#4CAF50',
//     padding: 10,
//     borderRadius: 8,
//     marginBottom: 10,
//     alignSelf: 'flex-end',
//   },
//   refreshButtonText: {
//     color: '#fff',
//     marginLeft: 5,
//     fontSize: 16,
//   },
//   buttonContainer: {
//     backgroundColor: '#fff',
//     padding: 20,
//     marginBottom: 10,
//     borderRadius: 12,
//     alignItems: 'center',
//     elevation: 2,
//     borderWidth: 2,
//     borderColor: 'skyblue',
//   },
//   infoContainer: {
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 12,
//     alignItems: 'center',
//     elevation: 2,
//     borderWidth: 2,
//     borderColor: 'skyblue',
//   },
//   clockInButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: 150,
//     height: 150,
//     borderRadius: 75,
//     borderWidth: 2,
//     borderColor: 'skyblue',
//     backgroundColor: '#2196F3',
//     padding: 10,
//   },
//   clockOutButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: 150,
//     height: 150,
//     borderRadius: 75,
//     borderWidth: 2,
//     borderColor: 'black',
//     backgroundColor: '#f44336',
//     padding: 10,
//   },
//   buttonDisabled: {
//     opacity: 0.6,
//   },
//   clockInButtonText: {
//     marginLeft: 10,
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#fff',
//   },
//   clockOutButtonText: {
//     marginLeft: 10,
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#fff',
//   },
//   timeLabel: {
//     fontSize: 19,
//     color: '#555',
//     marginBottom: 5,
//   },
//   timeText: {
//     fontSize: 20,
//     color: '#222',
//     marginBottom: 10,
//   },
//   timerText: {
//     fontSize: 16,
//     color: 'skyblue',
//     marginBottom: 10,
//   },
//   locationText: {
//     fontSize: 14,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 5,
//   },
//   errorText: {
//     fontSize: 14,
//     color: '#f44336',
//     textAlign: 'center',
//   },
//   placeholderText: {
//     fontSize: 16,
//     color: '#888',
//     textAlign: 'center',
//   },
// });

// export default ClockIn;


///// clockin and clockout button properly work with time and timer and total time but removed refresh button 


// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
//   Platform,
//   PermissionsAndroid,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import Geolocation from '@react-native-community/geolocation';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const ERP_BASE_URL = 'https://erpnextcloud.cbditsolutions.com';
// const LOCATION_CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes cache validity

// const ClockIn = ({ sid, employeeData }) => {
//   const [clockInTime, setClockInTime] = useState(null);
//   const [clockOutTime, setClockOutTime] = useState(null);
//   const [clockInSeconds, setClockInSeconds] = useState(0);
//   const [clockInLoading, setClockInLoading] = useState(false);
//   const [clockOutLoading, setClockOutLoading] = useState(false);
//   const [locationCache, setLocationCache] = useState(null);
//   const [clockInLocation, setClockInLocation] = useState(null);
//   const [clockOutLocation, setClockOutLocation] = useState(null);
//   const [locationError, setLocationError] = useState(null);
//   const [clockInLocationName, setClockInLocationName] = useState('Fetching location...');
//   const [clockOutLocationName, setClockOutLocationName] = useState('Fetching location...');
//   const [isLoadingData, setIsLoadingData] = useState(true);
//   const [currentStatus, setCurrentStatus] = useState(null); // 'IN', 'OUT', or null
//   const [lastCheckinRecord, setLastCheckinRecord] = useState(null);

//   const clockInTimerRef = useRef(null);

//   // Fetch latest checkin status from server
//   const fetchLatestCheckinStatus = async () => {
//     try {
//       const response = await fetch(
//         `${ERP_BASE_URL}/api/resource/Employee Checkin?fields=["name","employee","log_type","time","latitude","longitude"]&filters=[["employee","=","${employeeData.name}"]]&order_by=time desc&limit=1`,
//         {
//           headers: {
//             Cookie: `sid=${sid}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error('Failed to fetch checkin status');
//       }

//       const data = await response.json();
//       if (data.data && data.data.length > 0) {
//         const latestCheckin = data.data[0];
//         setLastCheckinRecord(latestCheckin);
//         setCurrentStatus(latestCheckin.log_type);
//         return latestCheckin;
//       }
//       setCurrentStatus(null);
//       return null;
//     } catch (error) {
//       console.error('Error fetching checkin status:', error);
//       setCurrentStatus(null);
//       return null;
//     }
//   };

//   // Fetch previous checkin records (for getting both IN and OUT records)
//   const fetchCheckinRecords = async () => {
//     try {
//       const response = await fetch(
//         `${ERP_BASE_URL}/api/resource/Employee Checkin?fields=["name","employee","log_type","time","latitude","longitude"]&filters=[["employee","=","${employeeData.name}"]]&order_by=time desc&limit=2`,
//         {
//           headers: {
//             Cookie: `sid=${sid}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error('Failed to fetch checkin records');
//       }

//       const data = await response.json();
//       return data.data || [];
//     } catch (error) {
//       console.error('Error fetching checkin records:', error);
//       return [];
//     }
//   };

//   // Extract time from datetime string (HH:MM AM/PM format)
//   const extractTimeFromDateTime = (dateTimeString) => {
//     if (!dateTimeString) return '';
//     try {
//       const date = new Date(dateTimeString);
//       if (isNaN(date.getTime())) {
//         const parts = dateTimeString.split(/[- :T]/);
//         const fixedDate = new Date(
//           parts[0],
//           parts[1] - 1,
//           parts[2],
//           parts[3],
//           parts[4],
//           parts[5] || 0
//         );
//         if (!isNaN(fixedDate.getTime())) {
//           return fixedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//         }
//         return 'Invalid time';
//       }
//       return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     } catch (error) {
//       console.error('Error parsing time:', error);
//       return 'Invalid time';
//     }
//   };

//   // Calculate time difference in HH:MM:SS format
//   const calculateTimeDifference = (startTime, endTime) => {
//     if (!startTime || !endTime) return '00:00:00';
    
//     try {
//       let start = new Date(startTime);
//       let end = new Date(endTime);
      
//       if (isNaN(start.getTime())) {
//         // Try alternative parsing if standard parsing fails
//         const parts = startTime.split(/[- :T]/);
//         const fixedStart = new Date(
//           parts[0],
//           parts[1] - 1,
//           parts[2],
//           parts[3],
//           parts[4],
//           parts[5] || 0
//         );
//         if (!isNaN(fixedStart.getTime())) {
//           start = fixedStart;
//         }
//       }

//       if (isNaN(end.getTime())) {
//         const parts = endTime.split(/[- :T]/);
//         const fixedEnd = new Date(
//           parts[0],
//           parts[1] - 1,
//           parts[2],
//           parts[3],
//           parts[4],
//           parts[5] || 0
//         );
//         if (!isNaN(fixedEnd.getTime())) {
//           end = fixedEnd;
//         }
//       }
      
//       if (isNaN(start.getTime()) || isNaN(end.getTime())) {
//         return '00:00:00';
//       }
      
//       const diffMs = end - start;
//       const diffSec = Math.floor(diffMs / 1000);
//       const h = Math.floor(diffSec / 3600).toString().padStart(2, '0');
//       const m = Math.floor((diffSec % 3600) / 60).toString().padStart(2, '0');
//       const s = (diffSec % 60).toString().padStart(2, '0');
      
//       return `${h}:${m}:${s}`;
//     } catch (error) {
//       console.error('Error calculating time difference:', error);
//       return '00:00:00';
//     }
//   };

//   // Calculate elapsed seconds from clock-in time
//   const calculateElapsedSeconds = (clockInTime) => {
//     if (!clockInTime) return 0;
    
//     try {
//       const clockInDate = new Date(clockInTime);
//       if (isNaN(clockInDate.getTime())) {
//         // Try alternative parsing if standard parsing fails
//         const parts = clockInTime.split(/[- :T]/);
//         const fixedDate = new Date(
//           parts[0],
//           parts[1] - 1,
//           parts[2],
//           parts[3],
//           parts[4],
//           parts[5] || 0
//         );
//         if (!isNaN(fixedDate.getTime())) {
//           return Math.floor((new Date() - fixedDate) / 1000);
//         }
//         return 0;
//       }
//       return Math.floor((new Date() - clockInDate) / 1000);
//     } catch (error) {
//       console.error('Error calculating elapsed seconds:', error);
//       return 0;
//     }
//   };

//   // Refresh data
//   const refreshData = async () => {
//     try {
//       const latestCheckin = await fetchLatestCheckinStatus();
      
//       if (latestCheckin) {
//         if (latestCheckin.log_type === 'IN') {
//           setClockInTime(latestCheckin.time);
//           const elapsedSeconds = calculateElapsedSeconds(latestCheckin.time);
//           setClockInSeconds(elapsedSeconds);
//           startClockInTimer();
//           setClockOutTime(null);
          
//           if (latestCheckin.latitude && latestCheckin.longitude) {
//             const coords = {
//               latitude: latestCheckin.latitude,
//               longitude: latestCheckin.longitude,
//               accuracy: 0
//             };
//             setClockInLocation(coords);
//             const name = await getLocationName(coords.latitude, coords.longitude);
//             setClockInLocationName(name);
//           }
//         } else if (latestCheckin.log_type === 'OUT') {
//           const records = await fetchCheckinRecords();
//           if (records.length > 0) {
//             setClockOutTime(records[0].time);
            
//             const inRecord = records.find(r => r.log_type === 'IN');
//             if (inRecord) {
//               setClockInTime(inRecord.time);
//             }
            
//             if (records[0].latitude && records[0].longitude) {
//               const outCoords = {
//                 latitude: records[0].latitude,
//                 longitude: records[0].longitude,
//                 accuracy: 0
//               };
//               setClockOutLocation(outCoords);
//               const outName = await getLocationName(outCoords.latitude, outCoords.longitude);
//               setClockOutLocationName(outName);
//             }
//           }
//         }
//       } else {
//         setClockInTime(null);
//         setClockOutTime(null);
//         setCurrentStatus(null);
//       }
//     } catch (error) {
//       console.error('Error refreshing data:', error);
//       Alert.alert('Error', 'Failed to refresh data');
//     }
//   };

//   // Load saved data on component mount
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         // First fetch the latest status from server
//         const latestCheckin = await fetchLatestCheckinStatus();
        
//         if (latestCheckin) {
//           if (latestCheckin.log_type === 'IN') {
//             // If latest is IN, show clock out button and timer
//             setClockInTime(latestCheckin.time);
//             const elapsedSeconds = calculateElapsedSeconds(latestCheckin.time);
//             setClockInSeconds(elapsedSeconds);
//             startClockInTimer();
//             setClockOutTime(null);
            
//             // Set location if available
//             if (latestCheckin.latitude && latestCheckin.longitude) {
//               const coords = {
//                 latitude: latestCheckin.latitude,
//                 longitude: latestCheckin.longitude,
//                 accuracy: 0
//               };
//               setClockInLocation(coords);
//               const name = await getLocationName(coords.latitude, coords.longitude);
//               setClockInLocationName(name);
//             }
//           } else if (latestCheckin.log_type === 'OUT') {
//             // If latest is OUT, show clock in button and fetch both records
//             const records = await fetchCheckinRecords();
//             if (records.length > 0) {
//               // First record is the OUT
//               setClockOutTime(records[0].time);
              
//               // Find the previous IN record
//               const inRecord = records.find(r => r.log_type === 'IN');
//               if (inRecord) {
//                 setClockInTime(inRecord.time);
//               }
              
//               // Set location if available
//               if (records[0].latitude && records[0].longitude) {
//                 const outCoords = {
//                   latitude: records[0].latitude,
//                   longitude: records[0].longitude,
//                   accuracy: 0
//                 };
//                 setClockOutLocation(outCoords);
//                 const outName = await getLocationName(outCoords.latitude, outCoords.longitude);
//                 setClockOutLocationName(outName);
//               }
//             }
//           }
//         }
//       } catch (error) {
//         console.error('Error loading data:', error);
//       } finally {
//         setIsLoadingData(false);
//       }
//     };

//     loadData();
    
//     return () => {
//       if (clockInTimerRef.current) {
//         clearInterval(clockInTimerRef.current);
//       }
//     };
//   }, [employeeData.name]);

//   const startClockInTimer = () => {
//     if (clockInTimerRef.current) {
//       clearInterval(clockInTimerRef.current);
//     }
    
//     // Update immediately to ensure no delay
//     if (clockInTime) {
//       const elapsedSeconds = calculateElapsedSeconds(clockInTime);
//       setClockInSeconds(elapsedSeconds);
//     }
    
//     // Then start the interval
//     clockInTimerRef.current = setInterval(() => {
//       setClockInSeconds(prev => prev + 1);
//     }, 1000);
//   };

//   // Timer effect
//   useEffect(() => {
//     if (currentStatus === 'IN' && clockInTime) {
//       startClockInTimer();
//     } else {
//       if (clockInTimerRef.current) {
//         clearInterval(clockInTimerRef.current);
//       }
//       setClockInSeconds(0);
//     }
//   }, [currentStatus, clockInTime]);

//   const requestLocationPermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//           {
//             title: 'Location Permission',
//             message: 'This app needs access to your location for attendance tracking.',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           }
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch (err) {
//         return false;
//       }
//     }
//     return true;
//   };

//   const getLocationName = async (latitude, longitude) => {
//     try {
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
//       );
      
//       const data = await response.json();
      
//       if (!data || !data.address) {
//         return 'Nearby location';
//       }
      
//       const address = data.address;
//       let locationName = '';
      
//       if (address.building) locationName += `${address.building}, `;
//       if (address.road) locationName += `${address.road}, `;
//       if (address.neighbourhood) locationName += `${address.neighbourhood}, `;
//       if (address.suburb) locationName += `${address.suburb}, `;
//       if (address.city_district) locationName += `${address.city_district}, `;
//       if (address.city) locationName += `${address.city}, `;
//       if (address.town) locationName += `${address.town}, `;
//       if (address.county) locationName += `${address.county}, `;
//       if (address.state) locationName += `${address.state}`;
      
//       locationName = locationName.replace(/, $/, '').replace(/, ,/g, ', ');
      
//       if (!locationName && data.display_name) {
//         locationName = data.display_name.split(',')[0];
//       }
      
//       return locationName || 'fetching location......';
//     } catch (error) {
//       return 'fetching  location........';
//     }
//   };

//   const getQuickLocation = async () => {
//     return new Promise((resolve, reject) => {
//       Geolocation.getCurrentPosition(
//         position => resolve(position.coords),
//         error => reject(error),
//         {
//           enableHighAccuracy: false,
//           timeout: 3000,
//           maximumAge: 30000
//         }
//       );
//     });
//   };

//   const getLocationWithFallback = async (isClockIn) => {
//     setLocationError(null);
//     if (isClockIn) {
//       setClockInLocationName('Getting location...');
//     } else {
//       setClockOutLocationName('Getting location...');
//     }
    
//     try {
//       const coords = await getQuickLocation();
//       setLocationCache({ coords, timestamp: Date.now() });
      
//       const name = await getLocationName(coords.latitude, coords.longitude);
//       if (isClockIn) {
//         setClockInLocationName(name);
//       } else {
//         setClockOutLocationName(name);
//       }
      
//       return coords;
//     } catch (error) {
//       if (locationCache && (Date.now() - locationCache.timestamp) < LOCATION_CACHE_EXPIRY) {
//         const name = await getLocationName(locationCache.coords.latitude, locationCache.coords.longitude);
//         if (isClockIn) {
//           setClockInLocationName(name);
//         } else {
//           setClockOutLocationName(name);
//         }
//         return locationCache.coords;
//       }
      
//       throw new Error('Could not determine your location. Please ensure you have GPS signal.');
//     }
//   };

//   const formatTimeForERP = (date) => {
//     return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
//   };

//   const formatTime = (seconds) => {
//     const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
//     const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
//     const s = (seconds % 60).toString().padStart(2, '0');
//     return `${h}:${m}:${s}`;
//   };

//   const handleClockIn = async () => {
//     if (clockInLoading) return;

//     const hasPermission = await requestLocationPermission();
//     if (!hasPermission) {
//       Alert.alert('Permission denied', 'Location permission is required to clock in.');
//       return;
//     }

//     setClockInLoading(true);
//     setLocationError(null);
    
//     try {
//       const coords = await getLocationWithFallback(true);
      
//       const now = new Date();
//       const timeString = formatTimeForERP(now);
      
//       const res = await fetch(`${ERP_BASE_URL}/api/resource/Employee Checkin`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Cookie: `sid=${sid}`,
//         },
//         body: JSON.stringify({
//           employee: employeeData.name,
//           log_type: 'IN',
//           time: timeString,
//           latitude: coords.latitude,
//           longitude: coords.longitude,
//           accuracy: coords.accuracy,
//         }),
//       });

//       if (!res.ok) {
//         const errText = await res.text();
//         throw new Error(`Failed to clock in: ${errText}`);
//       }

//       // After successful clock in, fetch the latest status to ensure UI is in sync
//       const latestCheckin = await fetchLatestCheckinStatus();
      
//       if (latestCheckin && latestCheckin.log_type === 'IN') {
//         setClockInTime(latestCheckin.time);
//         const elapsedSeconds = calculateElapsedSeconds(latestCheckin.time);
//         setClockInSeconds(elapsedSeconds);
//         startClockInTimer();
        
//         if (latestCheckin.latitude && latestCheckin.longitude) {
//           const serverCoords = {
//             latitude: latestCheckin.latitude,
//             longitude: latestCheckin.longitude,
//             accuracy: 0
//           };
//           setClockInLocation(serverCoords);
//           const name = await getLocationName(serverCoords.latitude, serverCoords.longitude);
//           setClockInLocationName(name);
//         } else {
//           setClockInLocation(coords);
//         }
//       }
      
//       setClockOutTime(null);
      
//       Alert.alert('Success', 'Clock-in recorded successfully.');
//     } catch (error) {
//       setLocationError(error.message);
//       Alert.alert('Error', error.message);
//     } finally {
//       setClockInLoading(false);
//     }
//   };

//   const handleClockOut = async () => {
//     if (clockOutLoading) return;

//     setClockOutLoading(true);
//     setLocationError(null);
    
//     try {
//       const coords = await getLocationWithFallback(false);
      
//       const now = new Date();
//       const timeString = formatTimeForERP(now);
      
//       const res = await fetch(`${ERP_BASE_URL}/api/resource/Employee Checkin`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Cookie: `sid=${sid}`,
//         },
//         body: JSON.stringify({
//           employee: employeeData.name,
//           log_type: 'OUT',
//           time: timeString,
//           latitude: coords.latitude,
//           longitude: coords.longitude,
//           accuracy: coords.accuracy,
//         }),
//       });

//       if (!res.ok) {
//         const errText = await res.text();
//         throw new Error(`Failed to clock out: ${errText}`);
//       }

//       // After successful clock out, fetch the latest status to ensure UI is in sync
//       const latestCheckin = await fetchLatestCheckinStatus();
      
//       if (latestCheckin && latestCheckin.log_type === 'OUT') {
//         setClockOutTime(latestCheckin.time);
//         setClockOutLocation({
//           latitude: latestCheckin.latitude,
//           longitude: latestCheckin.longitude,
//           accuracy: 0
//         });
//         const name = await getLocationName(latestCheckin.latitude, latestCheckin.longitude);
//         setClockOutLocationName(name);
//       }
      
//       Alert.alert('Success', 'Clock-out recorded successfully.');
//     } catch (error) {
//       setLocationError(error.message);
      
//       if (locationCache && (Date.now() - locationCache.timestamp) < LOCATION_CACHE_EXPIRY * 2) {
//         const useCached = await new Promise(resolve => {
//           Alert.alert(
//             'Location Error',
//             'Could not get fresh location. Would you like to use your last known location?',
//             [
//               { text: 'Cancel', onPress: () => resolve(false), style: 'cancel' },
//               { text: 'Use Cached', onPress: () => resolve(true) }
//             ]
//           );
//         });
        
//         if (useCached) {
//           const name = await getLocationName(locationCache.coords.latitude, locationCache.coords.longitude);
//           setClockOutLocationName(name);
          
//           const now = new Date();
//           const timeString = formatTimeForERP(now);
          
//           const res = await fetch(`${ERP_BASE_URL}/api/resource/Employee Checkin`, {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               Cookie: `sid=${sid}`,
//             },
//             body: JSON.stringify({
//               employee: employeeData.name,
//               log_type: 'OUT',
//               time: timeString,
//               latitude: locationCache.coords.latitude,
//               longitude: locationCache.coords.longitude,
//               accuracy: locationCache.coords.accuracy,
//             }),
//           });

//           if (!res.ok) {
//             const errText = await res.text();
//             throw new Error(`Failed to clock out: ${errText}`);
//           }

//           setClockOutTime(now);
//           setClockOutLocation(locationCache.coords);
//           Alert.alert('Success', 'Clock-out recorded with cached location.');
//           return;
//         }
//       }
      
//       Alert.alert('Error', error.message);
//     } finally {
//       setClockOutLoading(false);
//     }
//   };

//   if (isLoadingData) {
//     return (
//       <View style={[styles.outerContainer, { justifyContent: 'center', alignItems: 'center' }]}>
//         <ActivityIndicator size="large" color="#4CAF50" />
//         <Text style={{ marginTop: 10 }}>Loading attendance data...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.outerContainer}>
//       {/* Button Container */}
//       <View style={styles.buttonContainer}>
//         {currentStatus !== 'IN' ? (
//           <TouchableOpacity
//             style={[styles.clockInButton, clockInLoading ? styles.buttonDisabled : {}]}
//             onPress={handleClockIn}
//             disabled={clockInLoading}
//           >
//             {clockInLoading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <>
//                 <Ionicons name="time-outline" size={28} color="#fff" />
//                 <Text style={styles.clockInButtonText}>Clock In</Text>
//               </>
//             )}
//           </TouchableOpacity>
//         ) : (
//           <TouchableOpacity
//             style={[styles.clockOutButton, clockOutLoading ? styles.buttonDisabled : {}]}
//             onPress={handleClockOut}
//             disabled={clockOutLoading}
//           >
//             {clockOutLoading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <>
//                 <Ionicons name="exit-outline" size={28} color="#fff" />
//                 <Text style={styles.clockOutButtonText}>Clock Out</Text>
//               </>
//             )}
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* Info Container */}
//       <View style={styles.infoContainer}>
//         {currentStatus === 'IN' && clockInTime ? (
//           <>
//             <Text style={styles.timeLabel}>Clock In Time:</Text>
//             <Text style={styles.timeText}>
//               {extractTimeFromDateTime(clockInTime)}
//             </Text>
//             <Text style={styles.timerText}>Timer: {formatTime(clockInSeconds)}</Text>
//             {clockInLocationName && (
//               <Text style={styles.locationText}>
//                 {clockInLocationName}
//               </Text>
//             )}
//           </>
//         ) : currentStatus === 'OUT' && clockOutTime ? (
//           <>
//             <Text style={styles.timeLabel}>Clock Out Time:</Text>
//             <Text style={styles.timeText}>
//               {extractTimeFromDateTime(clockOutTime)}
//             </Text>
//             {clockInTime && (
//               <>
//                 <Text style={styles.timerText}>Total Time: {calculateTimeDifference(clockInTime, clockOutTime)}</Text>
//               </>
//             )}
//             {clockOutLocationName && (
//               <Text style={styles.locationText}>
//                 {clockOutLocationName}
//               </Text>
//             )}
//           </>
//         ) : (
//           <Text style={styles.placeholderText}>No attendance record yet</Text>
//         )}
        
//         {locationError && (
//           <Text style={styles.errorText}>{locationError}</Text>
//         )}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   outerContainer: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f8f9fa',
//     justifyContent: 'center',
//   },
//   buttonContainer: {
//     backgroundColor: '#fff',
//     padding: 20,
//     marginBottom: 10,
//     borderRadius: 12,
//     alignItems: 'center',
//     elevation: 2,
//     borderWidth: 2,
//     borderColor: 'skyblue',
//   },
//   infoContainer: {
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 12,
//     alignItems: 'center',
//     elevation: 2,
//     borderWidth: 2,
//     borderColor: 'skyblue',
//   },
//   clockInButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: 150,
//     height: 150,
//     borderRadius: 75,
//     borderWidth: 2,
//     borderColor: 'skyblue',
//     backgroundColor: '#2196F3',
//     padding: 10,
//   },
//   clockOutButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: 150,
//     height: 150,
//     borderRadius: 75,
//     borderWidth: 2,
//     borderColor: 'black',
//     backgroundColor: '#f44336',
//     padding: 10,
//   },
//   buttonDisabled: {
//     opacity: 0.6,
//   },
//   clockInButtonText: {
//     marginLeft: 10,
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#fff',
//   },
//   clockOutButtonText: {
//     marginLeft: 10,
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#fff',
//   },
//   timeLabel: {
//     fontSize: 19,
//     color: '#555',
//     marginBottom: 5,
//   },
//   timeText: {
//     fontSize: 20,
//     color: '#222',
//     marginBottom: 10,
//   },
//   timerText: {
//     fontSize: 16,
//     color: 'skyblue',
//     marginBottom: 10,
//   },
//   locationText: {
//     fontSize: 14,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 5,
//   },
//   errorText: {
//     fontSize: 14,
//     color: '#f44336',
//     textAlign: 'center',
//   },
//   placeholderText: {
//     fontSize: 16,
//     color: '#888',
//     textAlign: 'center',
//   },
// });

// export default ClockIn;






//// code with cameera and location and timer and total time



// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
//   Platform,
//   PermissionsAndroid,
//   Dimensions,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import Geolocation from '@react-native-community/geolocation';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { RNCamera } from 'react-native-camera';

// const ERP_BASE_URL = 'https://erpnextcloud.cbditsolutions.com';
// const LOCATION_CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes cache validity
// const { width: windowWidth } = Dimensions.get('window');

// const ClockIn = ({ sid, employeeData }) => {
//   const [clockInTime, setClockInTime] = useState(null);
//   const [clockOutTime, setClockOutTime] = useState(null);
//   const [clockInSeconds, setClockInSeconds] = useState(0);
//   const [clockInLoading, setClockInLoading] = useState(false);
//   const [clockOutLoading, setClockOutLoading] = useState(false);
//   const [locationCache, setLocationCache] = useState(null);
//   const [clockInLocation, setClockInLocation] = useState(null);
//   const [clockOutLocation, setClockOutLocation] = useState(null);
//   const [locationError, setLocationError] = useState(null);
//   const [clockInLocationName, setClockInLocationName] = useState('Fetching location...');
//   const [clockOutLocationName, setClockOutLocationName] = useState('Fetching location...');
//   const [isLoadingData, setIsLoadingData] = useState(true);
//   const [currentStatus, setCurrentStatus] = useState(null); // 'IN', 'OUT', or null
//   const [lastCheckinRecord, setLastCheckinRecord] = useState(null);
  
//   // Camera states
//   const cameraRef = useRef(null);
//   const [hasCameraPermission, setHasCameraPermission] = useState(false);
//   const [photoPath, setPhotoPath] = useState(null);
//   const [showCamera, setShowCamera] = useState(true);
//   const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.back);

//   const clockInTimerRef = useRef(null);

//   // Fetch latest checkin status from server
//   const fetchLatestCheckinStatus = async () => {
//     try {
//       const response = await fetch(
//         `${ERP_BASE_URL}/api/resource/Employee Checkin?fields=["name","employee","log_type","time","latitude","longitude","custom_photo"]&filters=[["employee","=","${employeeData.name}"]]&order_by=time desc&limit=1`,
//         {
//           headers: {
//             Cookie: `sid=${sid}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error('Failed to fetch checkin status');
//       }

//       const data = await response.json();
//       if (data.data && data.data.length > 0) {
//         const latestCheckin = data.data[0];
//         setLastCheckinRecord(latestCheckin);
//         setCurrentStatus(latestCheckin.log_type);
//         return latestCheckin;
//       }
//       setCurrentStatus(null);
//       return null;
//     } catch (error) {
//       console.error('Error fetching checkin status:', error);
//       setCurrentStatus(null);
//       return null;
//     }
//   };

//   // Request camera permission
//   const requestCameraPermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.CAMERA,
//           {
//             title: 'Camera Permission',
//             message: 'This app needs access to your camera for attendance verification.',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           }
//         );
//         const hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
//         setHasCameraPermission(hasPermission);
//         return hasPermission;
//       } catch (err) {
//         console.error('Camera permission error:', err);
//         setHasCameraPermission(false);
//         return false;
//       }
//     }
//     // On iOS, permissions are handled by Info.plist
//     setHasCameraPermission(true);
//     return true;
//   };

//   // Initialize camera
//   const initializeCamera = async () => {
//     const hasPermission = await requestCameraPermission();
//     if (!hasPermission) {
//       Alert.alert('Permission denied', 'Camera permission is required for attendance verification.');
//       return false;
//     }
//     return true;
//   };

//   // Take photo
//   const takePhoto = async () => {
//     if (!cameraRef.current || !hasCameraPermission) {
//       console.log('Camera not ready or no permission');
//       return null;
//     }

//     try {
//       const options = { 
//         quality: 0.8, 
//         base64: false,
//         fixOrientation: true,
//         forceUpOrientation: true,
//         pauseAfterCapture: true 
//       };
//       const data = await cameraRef.current.takePictureAsync(options);
//       console.log('Photo taken:', data.uri);
//       setPhotoPath(data.uri);
//       return data.uri;
//     } catch (error) {
//       console.error('Error taking photo:', error);
//       Alert.alert('Error', 'Failed to capture photo');
//       return null;
//     }
//   };

//   // Upload photo to file list and attach to checkin record
//   // const uploadAndAttachPhoto = async (checkinName, photoUri) => {
//   //   if (!photoUri) {
//   //     console.log('No photo to upload');
//   //     return false;
//   //   }
    
//   //   try {
//   //     // Step 1: Create a FormData object for the file upload
//   //     const formData = new FormData();
//   //     formData.append('file', {
//   //       uri: photoUri,
//   //       name: `attendance_${checkinName}.jpg`,
//   //       type: 'image/jpeg',
//   //     });
//   //     formData.append('is_private', 1);
//   //     formData.append('folder', 'Home/Attachments');
//   //     formData.append('doctype', 'Employee Checkin');
//   //     formData.append('docname', checkinName);
//   //     formData.append('fieldname', 'custom_photo');

//   //     console.log('Uploading photo to file list...');
      
//   //     const uploadResponse = await fetch(`${ERP_BASE_URL}/api/method/upload_file`, {
//   //       method: 'POST',
//   //       headers: {
//   //         'Content-Type': 'multipart/form-data',
//   //         'Accept': 'application/json',
//   //         'Cookie': `sid=${sid}`,
//   //       },
//   //       body: formData,
//   //     });

//   //     if (!uploadResponse.ok) {
//   //       const errText = await uploadResponse.text();
//   //       throw new Error(`Failed to upload photo: ${errText}`);
//   //     }

//   //     const uploadResult = await uploadResponse.json();
//   //     console.log('Photo upload to file list successful:', uploadResult.message);
      
//   //     return true;
//   //   } catch (error) {
//   //     console.error('Error in photo upload:', error);
//   //     Alert.alert('Error', 'Failed to upload photo');
//   //     return false;
//   //   }
//   // };

// const uploadAndAttachPhoto = async (checkinName, photoUri) => {
//   if (!photoUri) {
//     console.log('No photo to upload');
//     return false;
//   }
  
//   try {
//     // Step 1: Upload the file
//     const formData = new FormData();
//     formData.append('file', {
//       uri: photoUri,
//       name: `attendance_${checkinName}.jpg`,
//       type: 'image/jpeg',
//     });
//     formData.append('is_private', 0,);
//     formData.append('folder', 'Home/Attachments');
//     formData.append('doctype', 'Employee Checkin');
//     formData.append('docname', checkinName);
//     formData.append('fieldname', 'custom_photo');

//     console.log('Uploading photo to file list...');
    
//     const uploadResponse = await fetch(`${ERP_BASE_URL}/api/method/upload_file`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'multipart/form-data',
//         'Accept': 'application/json',
//         'Cookie': `sid=${sid}`,
//       },
//       body: formData,
//     });

//     if (!uploadResponse.ok) {
//       const errText = await uploadResponse.text();
//       throw new Error(`Failed to upload photo: ${errText}`);
//     }

//     const uploadResult = await uploadResponse.json();
//     console.log('Photo upload to file list successful:', uploadResult.message);
    
//     // Step 2: Explicitly update the checkin record with the photo attachment
//     const updateResponse = await fetch(`${ERP_BASE_URL}/api/resource/Employee Checkin/${checkinName}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//         'Cookie': `sid=${sid}`,
//       },
//       body: JSON.stringify({
//         custom_photo: uploadResult.message.file_url
//       }),
//     });

//     if (!updateResponse.ok) {
//       const errText = await updateResponse.text();
//       throw new Error(`Failed to update checkin record: ${errText}`);
//     }

//     return true;
//   } catch (error) {
//     console.error('Error in photo upload:', error);
//     Alert.alert('Error', 'Failed to upload photo');
//     return false;
//   }
// };






//   // Fetch previous checkin records (for getting both IN and OUT records)
//   const fetchCheckinRecords = async () => {
//     try {
//       const response = await fetch(
//         `${ERP_BASE_URL}/api/resource/Employee Checkin?fields=["name","employee","log_type","time","latitude","longitude","custom_photo"]&filters=[["employee","=","${employeeData.name}"]]&order_by=time desc&limit=2`,
//         {
//           headers: {
//             Cookie: `sid=${sid}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error('Failed to fetch checkin records');
//       }

//       const data = await response.json();
//       return data.data || [];
//     } catch (error) {
//       console.error('Error fetching checkin records:', error);
//       return [];
//     }
//   };

//   // Extract time from datetime string (HH:MM AM/PM format)
//   const extractTimeFromDateTime = (dateTimeString) => {
//     if (!dateTimeString) return '';
//     try {
//       const date = new Date(dateTimeString);
//       if (isNaN(date.getTime())) {
//         const parts = dateTimeString.split(/[- :T]/);
//         const fixedDate = new Date(
//           parts[0],
//           parts[1] - 1,
//           parts[2],
//           parts[3],
//           parts[4],
//           parts[5] || 0
//         );
//         if (!isNaN(fixedDate.getTime())) {
//           return fixedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//         }
//         return 'Invalid time';
//       }
//       return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     } catch (error) {
//       console.error('Error parsing time:', error);
//       return 'Invalid time';
//     }
//   };

//   // Calculate time difference in HH:MM:SS format
//   const calculateTimeDifference = (startTime, endTime) => {
//     if (!startTime || !endTime) return '00:00:00';
    
//     try {
//       let start = new Date(startTime);
//       let end = new Date(endTime);
      
//       if (isNaN(start.getTime())) {
//         // Try alternative parsing if standard parsing fails
//         const parts = startTime.split(/[- :T]/);
//         const fixedStart = new Date(
//           parts[0],
//           parts[1] - 1,
//           parts[2],
//           parts[3],
//           parts[4],
//           parts[5] || 0
//         );
//         if (!isNaN(fixedStart.getTime())) {
//           start = fixedStart;
//         }
//       }

//       if (isNaN(end.getTime())) {
//         const parts = endTime.split(/[- :T]/);
//         const fixedEnd = new Date(
//           parts[0],
//           parts[1] - 1,
//           parts[2],
//           parts[3],
//           parts[4],
//           parts[5] || 0
//         );
//         if (!isNaN(fixedEnd.getTime())) {
//           end = fixedEnd;
//         }
//       }
      
//       if (isNaN(start.getTime()) || isNaN(end.getTime())) {
//         return '00:00:00';
//       }
      
//       const diffMs = end - start;
//       const diffSec = Math.floor(diffMs / 1000);
//       const h = Math.floor(diffSec / 3600).toString().padStart(2, '0');
//       const m = Math.floor((diffSec % 3600) / 60).toString().padStart(2, '0');
//       const s = (diffSec % 60).toString().padStart(2, '0');
      
//       return `${h}:${m}:${s}`;
//     } catch (error) {
//       console.error('Error calculating time difference:', error);
//       return '00:00:00';
//     }
//   };

//   // Calculate elapsed seconds from clock-in time
//   const calculateElapsedSeconds = (clockInTime) => {
//     if (!clockInTime) return 0;
    
//     try {
//       const clockInDate = new Date(clockInTime);
//       if (isNaN(clockInDate.getTime())) {
//         // Try alternative parsing if standard parsing fails
//         const parts = clockInTime.split(/[- :T]/);
//         const fixedDate = new Date(
//           parts[0],
//           parts[1] - 1,
//           parts[2],
//           parts[3],
//           parts[4],
//           parts[5] || 0
//         );
//         if (!isNaN(fixedDate.getTime())) {
//           return Math.floor((new Date() - fixedDate) / 1000);
//         }
//         return 0;
//       }
//       return Math.floor((new Date() - clockInDate) / 1000);
//     } catch (error) {
//       console.error('Error calculating elapsed seconds:', error);
//       return 0;
//     }
//   };

//   // Refresh data
//   const refreshData = async () => {
//     try {
//       const latestCheckin = await fetchLatestCheckinStatus();
      
//       if (latestCheckin) {
//         if (latestCheckin.log_type === 'IN') {
//           setClockInTime(latestCheckin.time);
//           const elapsedSeconds = calculateElapsedSeconds(latestCheckin.time);
//           setClockInSeconds(elapsedSeconds);
//           startClockInTimer();
//           setClockOutTime(null);
          
//           if (latestCheckin.latitude && latestCheckin.longitude) {
//             const coords = {
//               latitude: latestCheckin.latitude,
//               longitude: latestCheckin.longitude,
//               accuracy: 0
//             };
//             setClockInLocation(coords);
//             const name = await getLocationName(coords.latitude, coords.longitude);
//             setClockInLocationName(name);
//           }
//         } else if (latestCheckin.log_type === 'OUT') {
//           const records = await fetchCheckinRecords();
//           if (records.length > 0) {
//             setClockOutTime(records[0].time);
            
//             const inRecord = records.find(r => r.log_type === 'IN');
//             if (inRecord) {
//               setClockInTime(inRecord.time);
//             }
            
//             if (records[0].latitude && records[0].longitude) {
//               const outCoords = {
//                 latitude: records[0].latitude,
//                 longitude: records[0].longitude,
//                 accuracy: 0
//               };
//               setClockOutLocation(outCoords);
//               const outName = await getLocationName(outCoords.latitude, outCoords.longitude);
//               setClockOutLocationName(outName);
//             }
//           }
//         }
//       } else {
//         setClockInTime(null);
//         setClockOutTime(null);
//         setCurrentStatus(null);
//       }
//     } catch (error) {
//       console.error('Error refreshing data:', error);
//       Alert.alert('Error', 'Failed to refresh data');
//     }
//   };

//   // Load saved data on component mount
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         // Initialize camera
//         await initializeCamera();
        
//         // First fetch the latest status from server
//         const latestCheckin = await fetchLatestCheckinStatus();
        
//         if (latestCheckin) {
//           if (latestCheckin.log_type === 'IN') {
//             // If latest is IN, show clock out button and timer
//             setClockInTime(latestCheckin.time);
//             const elapsedSeconds = calculateElapsedSeconds(latestCheckin.time);
//             setClockInSeconds(elapsedSeconds);
//             startClockInTimer();
//             setClockOutTime(null);
            
//             // Set location if available
//             if (latestCheckin.latitude && latestCheckin.longitude) {
//               const coords = {
//                 latitude: latestCheckin.latitude,
//                 longitude: latestCheckin.longitude,
//                 accuracy: 0
//               };
//               setClockInLocation(coords);
//               const name = await getLocationName(coords.latitude, coords.longitude);
//               setClockInLocationName(name);
//             }
//           } else if (latestCheckin.log_type === 'OUT') {
//             // If latest is OUT, show clock in button and fetch both records
//             const records = await fetchCheckinRecords();
//             if (records.length > 0) {
//               // First record is the OUT
//               setClockOutTime(records[0].time);
              
//               // Find the previous IN record
//               const inRecord = records.find(r => r.log_type === 'IN');
//               if (inRecord) {
//                 setClockInTime(inRecord.time);
//               }
              
//               // Set location if available
//               if (records[0].latitude && records[0].longitude) {
//                 const outCoords = {
//                   latitude: records[0].latitude,
//                   longitude: records[0].longitude,
//                   accuracy: 0
//                 };
//                 setClockOutLocation(outCoords);
//                 const outName = await getLocationName(outCoords.latitude, outCoords.longitude);
//                 setClockOutLocationName(outName);
//               }
//             }
//           }
//         }
//       } catch (error) {
//         console.error('Error loading data:', error);
//       } finally {
//         setIsLoadingData(false);
//       }
//     };

//     loadData();
    
//     return () => {
//       if (clockInTimerRef.current) {
//         clearInterval(clockInTimerRef.current);
//       }
//     };
//   }, [employeeData.name]);

//   const startClockInTimer = () => {
//     if (clockInTimerRef.current) {
//       clearInterval(clockInTimerRef.current);
//     }
    
//     // Update immediately to ensure no delay
//     if (clockInTime) {
//       const elapsedSeconds = calculateElapsedSeconds(clockInTime);
//       setClockInSeconds(elapsedSeconds);
//     }
    
//     // Then start the interval
//     clockInTimerRef.current = setInterval(() => {
//       setClockInSeconds(prev => prev + 1);
//     }, 1000);
//   };

//   // Timer effect
//   useEffect(() => {
//     if (currentStatus === 'IN' && clockInTime) {
//       startClockInTimer();
//     } else {
//       if (clockInTimerRef.current) {
//         clearInterval(clockInTimerRef.current);
//       }
//       setClockInSeconds(0);
//     }
//   }, [currentStatus, clockInTime]);

//   const requestLocationPermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//           {
//             title: 'Location Permission',
//             message: 'This app needs access to your location for attendance tracking.',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           }
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch (err) {
//         return false;
//       }
//     }
//     return true;
//   };

//   const getLocationName = async (latitude, longitude) => {
//     try {
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
//       );
      
//       const data = await response.json();
      
//       if (!data || !data.address) {
//         return 'Nearby location';
//       }
      
//       const address = data.address;
//       let locationName = '';
      
//       if (address.building) locationName += `${address.building}, `;
//       if (address.road) locationName += `${address.road}, `;
//       if (address.neighbourhood) locationName += `${address.neighbourhood}, `;
//       if (address.suburb) locationName += `${address.suburb}, `;
//       if (address.city_district) locationName += `${address.city_district}, `;
//       if (address.city) locationName += `${address.city}, `;
//       if (address.town) locationName += `${address.town}, `;
//       if (address.county) locationName += `${address.county}, `;
//       if (address.state) locationName += `${address.state}`;
      
//       locationName = locationName.replace(/, $/, '').replace(/, ,/g, ', ');
      
//       if (!locationName && data.display_name) {
//         locationName = data.display_name.split(',')[0];
//       }
      
//       return locationName || 'fetching location';
//     } catch (error) {
//       return 'fetching  location';
//     }
//   };

//   const getQuickLocation = async () => {
//     return new Promise((resolve, reject) => {
//       Geolocation.getCurrentPosition(
//         position => resolve(position.coords),
//         error => reject(error),
//         {
//           enableHighAccuracy: false,
//           timeout: 3000,
//           maximumAge: 30000
//         }
//       );
//     });
//   };

//   const getLocationWithFallback = async (isClockIn) => {
//     setLocationError(null);
//     if (isClockIn) {
//       setClockInLocationName('Getting location...');
//     } else {
//       setClockOutLocationName('Getting location...');
//     }
    
//     try {
//       const coords = await getQuickLocation();
//       setLocationCache({ coords, timestamp: Date.now() });
      
//       const name = await getLocationName(coords.latitude, coords.longitude);
//       if (isClockIn) {
//         setClockInLocationName(name);
//       } else {
//         setClockOutLocationName(name);
//       }
      
//       return coords;
//     } catch (error) {
//       if (locationCache && (Date.now() - locationCache.timestamp) < LOCATION_CACHE_EXPIRY) {
//         const name = await getLocationName(locationCache.coords.latitude, locationCache.coords.longitude);
//         if (isClockIn) {
//           setClockInLocationName(name);
//         } else {
//           setClockOutLocationName(name);
//         }
//         return locationCache.coords;
//       }
      
//       throw new Error('Could not determine your location. Please ensure you have GPS signal.');
//     }
//   };

//   const formatTimeForERP = (date) => {
//     return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
//   };

//   const formatTime = (seconds) => {
//     const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
//     const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
//     const s = (seconds % 60).toString().padStart(2, '0');
//     return `${h}:${m}:${s}`;
//   };

//   const handleClockIn = async () => {
//     if (clockInLoading) return;

//     const hasPermission = await requestLocationPermission();
//     if (!hasPermission) {
//       Alert.alert('Permission denied', 'Location permission is required to clock in.');
//       return;
//     }

//     // Ensure camera is ready
//     if (!hasCameraPermission) {
//       const cameraReady = await initializeCamera();
//       if (!cameraReady) {
//         Alert.alert('Error', 'Camera permission is required for attendance verification.');
//         return;
//       }
//     }

//     setClockInLoading(true);
//     setLocationError(null);
    
//     try {
//       // Take photo first
//       const photoPath = await takePhoto();
      
//       const coords = await getLocationWithFallback(true);
      
//       const now = new Date();
//       const timeString = formatTimeForERP(now);
      
//       const res = await fetch(`${ERP_BASE_URL}/api/resource/Employee Checkin`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Cookie: `sid=${sid}`,
//         },
//         body: JSON.stringify({
//           employee: employeeData.name,
//           log_type: 'IN',
//           time: timeString,
//           latitude: coords.latitude,
//           longitude: coords.longitude,
//           accuracy: coords.accuracy,
//         }),
//       });

//       if (!res.ok) {
//         const errText = await res.text();
//         throw new Error(`Failed to clock in: ${errText}`);
//       }

//       const responseData = await res.json();
//       const checkinName = responseData.data.name;

//       // Upload and attach photo if taken
//       if (photoPath && checkinName) {
//         await uploadAndAttachPhoto(checkinName, photoPath);
//       }

//       // After successful clock in, fetch the latest status to ensure UI is in sync
//       const latestCheckin = await fetchLatestCheckinStatus();
      
//       if (latestCheckin && latestCheckin.log_type === 'IN') {
//         setClockInTime(latestCheckin.time);
//         const elapsedSeconds = calculateElapsedSeconds(latestCheckin.time);
//         setClockInSeconds(elapsedSeconds);
//         startClockInTimer();
        
//         if (latestCheckin.latitude && latestCheckin.longitude) {
//           const serverCoords = {
//             latitude: latestCheckin.latitude,
//             longitude: latestCheckin.longitude,
//             accuracy: 0
//           };
//           setClockInLocation(serverCoords);
//           const name = await getLocationName(serverCoords.latitude, serverCoords.longitude);
//           setClockInLocationName(name);
//         } else {
//           setClockInLocation(coords);
//         }
//       }
      
//       setClockOutTime(null);
      
//       Alert.alert('Success', 'Clock-in recorded successfully.');
//     } catch (error) {
//       setLocationError(error.message);
//       Alert.alert('Error', error.message);
//     } finally {
//       setClockInLoading(false);
//     }
//   };

//   const handleClockOut = async () => {
//     if (clockOutLoading) return;

//     // Ensure camera is ready
//     if (!hasCameraPermission) {
//       const cameraReady = await initializeCamera();
//       if (!cameraReady) {
//         Alert.alert('Error', 'Camera permission is required for attendance verification.');
//         return;
//       }
//     }

//     setClockOutLoading(true);
//     setLocationError(null);
    
//     try {
//       // Take photo first
//       const photoPath = await takePhoto();
      
//       const coords = await getLocationWithFallback(false);
      
//       const now = new Date();
//       const timeString = formatTimeForERP(now);
      
//       const res = await fetch(`${ERP_BASE_URL}/api/resource/Employee Checkin`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Cookie: `sid=${sid}`,
//         },
//         body: JSON.stringify({
//           employee: employeeData.name,
//           log_type: 'OUT',
//           time: timeString,
//           latitude: coords.latitude,
//           longitude: coords.longitude,
//           accuracy: coords.accuracy,
//         }),
//       });

//       if (!res.ok) {
//         const errText = await res.text();
//         throw new Error(`Failed to clock out: ${errText}`);
//       }

//       const responseData = await res.json();
//       const checkinName = responseData.data.name;

//       // Upload and attach photo if taken
//       if (photoPath && checkinName) {
//         await uploadAndAttachPhoto(checkinName, photoPath);
//       }

//       // After successful clock out, fetch the latest status to ensure UI is in sync
//       const latestCheckin = await fetchLatestCheckinStatus();
      
//       if (latestCheckin && latestCheckin.log_type === 'OUT') {
//         setClockOutTime(latestCheckin.time);
//         setClockOutLocation({
//           latitude: latestCheckin.latitude,
//           longitude: latestCheckin.longitude,
//           accuracy: 0
//         });
//         const name = await getLocationName(latestCheckin.latitude, latestCheckin.longitude);
//         setClockOutLocationName(name);
//       }
      
//       Alert.alert('Success', 'Clock-out recorded successfully.');
//     } catch (error) {
//       setLocationError(error.message);
      
//       if (locationCache && (Date.now() - locationCache.timestamp) < LOCATION_CACHE_EXPIRY * 2) {
//         const useCached = await new Promise(resolve => {
//           Alert.alert(
//             'Location Error',
//             'Could not get fresh location. Would you like to use your last known location?',
//             [
//               { text: 'Cancel', onPress: () => resolve(false), style: 'cancel' },
//               { text: 'Use Cached', onPress: () => resolve(true) }
//             ]
//           );
//         });
        
//         if (useCached) {
//           // Take photo even when using cached location
//           const cachedPhotoPath = await takePhoto();
          
//           const name = await getLocationName(locationCache.coords.latitude, locationCache.coords.longitude);
//           setClockOutLocationName(name);
          
//           const now = new Date();
//           const timeString = formatTimeForERP(now);
          
//           const res = await fetch(`${ERP_BASE_URL}/api/resource/Employee Checkin`, {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               Cookie: `sid=${sid}`,
//             },
//             body: JSON.stringify({
//               employee: employeeData.name,
//               log_type: 'OUT',
//               time: timeString,
//               latitude: locationCache.coords.latitude,
//               longitude: locationCache.coords.longitude,
//               accuracy: locationCache.coords.accuracy,
//             }),
//           });

//           if (!res.ok) {
//             const errText = await res.text();
//             throw new Error(`Failed to clock out: ${errText}`);
//           }

//           const responseData = await res.json();
//           const checkinName = responseData.data.name;

//           // Upload and attach photo if taken
//           if (cachedPhotoPath && checkinName) {
//             await uploadAndAttachPhoto(checkinName, cachedPhotoPath);
//           }

//           setClockOutTime(now);
//           setClockOutLocation(locationCache.coords);
//           Alert.alert('Success', 'Clock-out recorded with cached location.');
//           return;
//         }
//       }
      
//       Alert.alert('Error', error.message);
//     } finally {
//       setClockOutLoading(false);
//     }
//   };

//   const toggleCameraType = () => {
//     setCameraType(
//       cameraType === RNCamera.Constants.Type.back
//         ? RNCamera.Constants.Type.front
//         : RNCamera.Constants.Type.back
//     );
//   };

//   if (isLoadingData) {
//     return (
//       <View style={[styles.outerContainer, { justifyContent: 'center', alignItems: 'center' }]}>
//         <ActivityIndicator size="large" color="#4CAF50" />
//         <Text style={{ marginTop: 10 }}>Loading attendance data...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.outerContainer}>
//       {/* Camera Container - Moved to top */}
//       <View style={styles.cameraContainer}>
//         {hasCameraPermission && showCamera ? (
//           <RNCamera
//             ref={cameraRef}
//             style={styles.camera}
//             type={cameraType}
//             captureAudio={false}
//             androidCameraPermissionOptions={{
//               title: 'Permission to use camera',
//               message: 'We need your permission to use your camera',
//               buttonPositive: 'Ok',
//               buttonNegative: 'Cancel',
//             }}
//             pictureSize="640x480"
//           >
//             <View style={styles.cameraControls}>
//               <TouchableOpacity onPress={toggleCameraType} style={styles.flipButton}>
//                 <Ionicons name="camera-reverse-outline" size={28} color="#fff" />
//               </TouchableOpacity>
//             </View>
//           </RNCamera>
//         ) : (
//           <View style={[styles.camera, styles.cameraPlaceholder]}>
//             <Text style={styles.cameraPlaceholderText}>
//               {hasCameraPermission ? 'Camera not available' : 'Camera permission not granted'}
//             </Text>
//           </View>
//         )}
//       </View>

//       {/* Info Container - Moved to middle */}
//       <View style={styles.infoContainer}>
//         {currentStatus === 'IN' && clockInTime ? (
//           <>
//             <Text style={styles.timeLabel}>Clock In Time:</Text>
//             <Text style={styles.timeText}>
//               {extractTimeFromDateTime(clockInTime)}
//             </Text>
//             <Text style={styles.timerText}>Timer: {formatTime(clockInSeconds)}</Text>
//             {clockInLocationName && (
//               <Text style={styles.locationText}>
//                 {clockInLocationName}
//               </Text>
//             )}
//           </>
//         ) : currentStatus === 'OUT' && clockOutTime ? (
//           <>
//             <Text style={styles.timeLabel}>Clock Out Time:</Text>
//             <Text style={styles.timeText}>
//               {extractTimeFromDateTime(clockOutTime)}
//             </Text>
//             {clockInTime && (
//               <>
//                 <Text style={styles.timerText}>Total Time: {calculateTimeDifference(clockInTime, clockOutTime)}</Text>
//               </>
//             )}
//             {clockOutLocationName && (
//               <Text style={styles.locationText}>
//                 {clockOutLocationName}
//               </Text>
//             )}
//           </>
//         ) : (
//           <Text style={styles.placeholderText}>No attendance record yet</Text>
//         )}
        
//         {locationError && (
//           <Text style={styles.errorText}>{locationError}</Text>
//         )}
//       </View>

//       {/* Button Container - Moved to bottom */}
//       <View style={styles.buttonContainer}>
//         {currentStatus !== 'IN' ? (
//           <TouchableOpacity
//             style={[styles.clockInButton, clockInLoading ? styles.buttonDisabled : {}]}
//             onPress={handleClockIn}
//             disabled={clockInLoading}
//           >
//             {clockInLoading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <>
//                 <Ionicons name="time-outline" size={28} color="#fff" />
//                 <Text style={styles.clockInButtonText}>Clock In</Text>
//               </>
//             )}
//           </TouchableOpacity>
//         ) : (
//           <TouchableOpacity
//             style={[styles.clockOutButton, clockOutLoading ? styles.buttonDisabled : {}]}
//             onPress={handleClockOut}
//             disabled={clockOutLoading}
//           >
//             {clockOutLoading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <>
//                 <Ionicons name="exit-outline" size={28} color="#fff" />
//                 <Text style={styles.clockOutButtonText}>Clock Out</Text>
//               </>
//             )}
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   outerContainer: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f8f9fa',
//   },
//   cameraContainer: {
//     backgroundColor: '#fff',
//     padding: 10,
//     borderRadius: 12,
//     elevation: 2,
//     borderWidth: 2,
//     borderColor: 'skyblue',
//     marginBottom: 10,
//   },
//   infoContainer: {
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 12,
//     alignItems: 'center',
//     elevation: 2,
//     borderWidth: 2,
//     borderColor: 'skyblue',
//     marginBottom: 10,
//   },
//   buttonContainer: {
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 12,
//     alignItems: 'center',
//     elevation: 2,
//     borderWidth: 2,
//     borderColor: 'skyblue',
//   },
//   camera: {
//     width: '50%',
//     height: 200,
//     borderRadius: 8,
//     overflow: 'hidden',
//     alignSelf:'center',
//     marginLeft:'auto', 
//     marginRight:'auto',

//     justifyContent: 'flex-end',
//   },
//   cameraControls: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     padding: 20,
//   },
//   flipButton: {
//     alignSelf: 'flex-end',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     borderRadius: 20,
//     padding: 10,
//   },
//   cameraPlaceholder: {
//     backgroundColor: '#e0e0e0',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   cameraPlaceholderText: {
//     color: '#666',
//     textAlign: 'center',
//   },
//   clockInButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: 150,
//     height: 150,
//     borderRadius: 75,
//     borderWidth: 2,
//     borderColor: 'skyblue',
//     backgroundColor: '#2196F3',
//     padding: 10,
//   },
//   clockOutButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: 150,
//     height: 150,
//     borderRadius: 75,
//     borderWidth: 2,
//     borderColor: 'black',
//     backgroundColor: '#f44336',
//     padding: 10,
//   },
//   buttonDisabled: {
//     opacity: 0.6,
//   },
//   clockInButtonText: {
//     marginLeft: 10,
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#fff',
//   },
//   clockOutButtonText: {
//     marginLeft: 10,
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#fff',
//   },
//   timeLabel: {
//     fontSize: 19,
//     color: '#555',
//     marginBottom: 5,
//   },
//   timeText: {
//     fontSize: 20,
//     color: '#222',
//     marginBottom: 10,
//   },
//   timerText: {
//     fontSize: 16,
//     color: 'skyblue',
//     marginBottom: 10,
//   },
//   locationText: {
//     fontSize: 14,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 5,
//   },
//   errorText: {
//     fontSize: 14,
//     color: '#f44336',
//     textAlign: 'center',
//   },
//   placeholderText: {
//     fontSize: 16,
//     color: '#888',
//     textAlign: 'center',
//   },
// });

// export default ClockIn;










// if photo faile clockin or clockout not success



// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
//   Platform,
//   PermissionsAndroid,
//   Dimensions,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import Geolocation from '@react-native-community/geolocation';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { RNCamera } from 'react-native-camera';

// const ERP_BASE_URL = 'https://erpnextcloud.cbditsolutions.com';
// const LOCATION_CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes cache validity
// const { width: windowWidth } = Dimensions.get('window');

// const ClockIn = ({ sid, employeeData }) => {
//   const [clockInTime, setClockInTime] = useState(null);
//   const [clockOutTime, setClockOutTime] = useState(null);
//   const [clockInSeconds, setClockInSeconds] = useState(0);
//   const [clockInLoading, setClockInLoading] = useState(false);
//   const [clockOutLoading, setClockOutLoading] = useState(false);
//   const [locationCache, setLocationCache] = useState(null);
//   const [clockInLocation, setClockInLocation] = useState(null);
//   const [clockOutLocation, setClockOutLocation] = useState(null);
//   const [locationError, setLocationError] = useState(null);
//   const [clockInLocationName, setClockInLocationName] = useState('Fetching location...');
//   const [clockOutLocationName, setClockOutLocationName] = useState('Fetching location...');
//   const [isLoadingData, setIsLoadingData] = useState(true);
//   const [currentStatus, setCurrentStatus] = useState(null); // 'IN', 'OUT', or null
//   const [lastCheckinRecord, setLastCheckinRecord] = useState(null);
  
//   // Camera states
//   const cameraRef = useRef(null);
//   const [hasCameraPermission, setHasCameraPermission] = useState(null);
//   const [photoPath, setPhotoPath] = useState(null);
//   const [showCamera, setShowCamera] = useState(true);
//   const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.back);

//   const clockInTimerRef = useRef(null);

//   // Fetch latest checkin status from server
//   const fetchLatestCheckinStatus = async () => {
//     try {
//       const response = await fetch(
//         `${ERP_BASE_URL}/api/resource/Employee Checkin?fields=["name","employee","log_type","time","latitude","longitude","custom_area_name","custom_photo"]&filters=[["employee","=","${employeeData.name}"]]&order_by=time desc&limit=1`,
//         {
//           headers: {
//             Cookie: `sid=${sid}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error('Failed to fetch checkin status');
//       }

//       const data = await response.json();
//       if (data.data && data.data.length > 0) {
//         const latestCheckin = data.data[0];
//         setLastCheckinRecord(latestCheckin);
//         setCurrentStatus(latestCheckin.log_type);
//         return latestCheckin;
//       }
//       setCurrentStatus(null);
//       return null;
//     } catch (error) {
//       console.error('Error fetching checkin status:', error);
//       setCurrentStatus(null);
//       return null;
//     }
//   };

//   // Request camera permission
//   const requestCameraPermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.CAMERA,
//           {
//             title: 'Camera Permission',
//             message: 'This app needs access to your camera for attendance verification.',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           }
//         );
//         const hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
//         setHasCameraPermission(hasPermission);
//         return hasPermission;
//       } catch (err) {
//         console.error('Camera permission error:', err);
//         setHasCameraPermission(false);
//         return false;
//       }
//     }
//     // On iOS, permissions are handled by Info.plist
//     setHasCameraPermission(true);
//     return true;
//   };

//   // Initialize camera
//   const initializeCamera = async () => {
//     const hasPermission = await requestCameraPermission();
//     if (!hasPermission) {
//       Alert.alert('Permission denied', 'Camera permission is required for attendance verification.');
//       return false;
//     }
//     return true;
//   };

//   // Take photo
//   const takePhoto = async () => {
//     if (!cameraRef.current || !hasCameraPermission) {
//       console.log('Camera not ready or no permission');
//       throw new Error('Camera not ready or permission denied');
//     }

//     try {
//       const options = { 
//         quality: 0.8, 
//         base64: false,
//         fixOrientation: true,
//         forceUpOrientation: true,
//         pauseAfterCapture: true 
//       };
//       const data = await cameraRef.current.takePictureAsync(options);
//       console.log('Photo taken:', data.uri);
//       setPhotoPath(data.uri);
//       return data.uri;
//     } catch (error) {
//       console.error('Error taking photo:', error);
//       throw new Error('Failed to capture photo');
//     }
//   };

//   const uploadAndAttachPhoto = async (checkinName, photoUri) => {
//     if (!photoUri) {
//       console.log('No photo to upload');
//       throw new Error('No photo to upload');
//     }
    
//     try {
//       // Step 1: Upload the file
//       const formData = new FormData();
//       formData.append('file', {
//         uri: photoUri,
//         name: `attendance_${checkinName}.jpg`,
//         type: 'image/jpeg',
//       });
//       formData.append('is_private', 0);
//       formData.append('folder', 'Home/Attachments');
//       formData.append('doctype', 'Employee Checkin');
//       formData.append('docname', checkinName);
//       formData.append('fieldname', 'custom_photo');

//       console.log('Uploading photo to file list...');
      
//       const uploadResponse = await fetch(`${ERP_BASE_URL}/api/method/upload_file`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           'Accept': 'application/json',
//           'Cookie': `sid=${sid}`,
//         },
//         body: formData,
//       });

//       if (!uploadResponse.ok) {
//         const errText = await uploadResponse.text();
//         throw new Error(`Failed to upload photo: ${errText}`);
//       }

//       const uploadResult = await uploadResponse.json();
//       console.log('Photo upload to file list successful:', uploadResult.message);
      
//       // Step 2: Explicitly update the checkin record with the photo attachment
//       const updateResponse = await fetch(`${ERP_BASE_URL}/api/resource/Employee Checkin/${checkinName}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Cookie': `sid=${sid}`,
//         },
//         body: JSON.stringify({
//           custom_photo: uploadResult.message.file_url
//         }),
//       });

//       if (!updateResponse.ok) {
//         const errText = await updateResponse.text();
//         throw new Error(`Failed to update checkin record: ${errText}`);
//       }

//       return true;
//     } catch (error) {
//       console.error('Error in photo upload:', error);
//       throw error;
//     }
//   };

//   // Fetch previous checkin records (for getting both IN and OUT records)
//   const fetchCheckinRecords = async () => {
//     try {
//       const response = await fetch(
//         `${ERP_BASE_URL}/api/resource/Employee Checkin?fields=["name","employee","log_type","time","latitude","longitude","custom_area_name","custom_photo"]&filters=[["employee","=","${employeeData.name}"]]&order_by=time desc&limit=2`,
//         {
//           headers: {
//             Cookie: `sid=${sid}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error('Failed to fetch checkin records');
//       }

//       const data = await response.json();
//       return data.data || [];
//     } catch (error) {
//       console.error('Error fetching checkin records:', error);
//       return [];
//     }
//   };

//   // Extract time from datetime string (HH:MM AM/PM format)
//   const extractTimeFromDateTime = (dateTimeString) => {
//     if (!dateTimeString) return '';
//     try {
//       const date = new Date(dateTimeString);
//       if (isNaN(date.getTime())) {
//         const parts = dateTimeString.split(/[- :T]/);
//         const fixedDate = new Date(
//           parts[0],
//           parts[1] - 1,
//           parts[2],
//           parts[3],
//           parts[4],
//           parts[5] || 0
//         );
//         if (!isNaN(fixedDate.getTime())) {
//           return fixedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//         }
//         return 'Invalid time';
//       }
//       return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     } catch (error) {
//       console.error('Error parsing time:', error);
//       return 'Invalid time';
//     }
//   };

//   // Calculate time difference in HH:MM:SS format
//   const calculateTimeDifference = (startTime, endTime) => {
//     if (!startTime || !endTime) return '00:00:00';
    
//     try {
//       let start = new Date(startTime);
//       let end = new Date(endTime);
      
//       if (isNaN(start.getTime())) {
//         // Try alternative parsing if standard parsing fails
//         const parts = startTime.split(/[- :T]/);
//         const fixedStart = new Date(
//           parts[0],
//           parts[1] - 1,
//           parts[2],
//           parts[3],
//           parts[4],
//           parts[5] || 0
//         );
//         if (!isNaN(fixedStart.getTime())) {
//           start = fixedStart;
//         }
//       }

//       if (isNaN(end.getTime())) {
//         const parts = endTime.split(/[- :T]/);
//         const fixedEnd = new Date(
//           parts[0],
//           parts[1] - 1,
//           parts[2],
//           parts[3],
//           parts[4],
//           parts[5] || 0
//         );
//         if (!isNaN(fixedEnd.getTime())) {
//           end = fixedEnd;
//         }
//       }
      
//       if (isNaN(start.getTime()) || isNaN(end.getTime())) {
//         return '00:00:00';
//       }
      
//       const diffMs = end - start;
//       const diffSec = Math.floor(diffMs / 1000);
//       const h = Math.floor(diffSec / 3600).toString().padStart(2, '0');
//       const m = Math.floor((diffSec % 3600) / 60).toString().padStart(2, '0');
//       const s = (diffSec % 60).toString().padStart(2, '0');
      
//       return `${h}:${m}:${s}`;
//     } catch (error) {
//       console.error('Error calculating time difference:', error);
//       return '00:00:00';
//     }
//   };

//   // Calculate elapsed seconds from clock-in time
//   const calculateElapsedSeconds = (clockInTime) => {
//     if (!clockInTime) return 0;
    
//     try {
//       const clockInDate = new Date(clockInTime);
//       if (isNaN(clockInDate.getTime())) {
//         // Try alternative parsing if standard parsing fails
//         const parts = clockInTime.split(/[- :T]/);
//         const fixedDate = new Date(
//           parts[0],
//           parts[1] - 1,
//           parts[2],
//           parts[3],
//           parts[4],
//           parts[5] || 0
//         );
//         if (!isNaN(fixedDate.getTime())) {
//           return Math.floor((new Date() - fixedDate) / 1000);
//         }
//         return 0;
//       }
//       return Math.floor((new Date() - clockInDate) / 1000);
//     } catch (error) {
//       console.error('Error calculating elapsed seconds:', error);
//       return 0;
//     }
//   };

//   // Refresh data
//   const refreshData = async () => {
//     try {
//       const latestCheckin = await fetchLatestCheckinStatus();
      
//       if (latestCheckin) {
//         if (latestCheckin.log_type === 'IN') {
//           setClockInTime(latestCheckin.time);
//           const elapsedSeconds = calculateElapsedSeconds(latestCheckin.time);
//           setClockInSeconds(elapsedSeconds);
//           startClockInTimer();
//           setClockOutTime(null);
          
//           if (latestCheckin.latitude && latestCheckin.longitude) {
//             const coords = {
//               latitude: latestCheckin.latitude,
//               longitude: latestCheckin.longitude,
//               accuracy: 0
//             };
//             setClockInLocation(coords);
//           }
          
//           // Set location name from custom_area_name
//           if (latestCheckin.custom_area_name) {
//             setClockInLocationName(latestCheckin.custom_area_name);
//           } else {
//             setClockInLocationName('Location not specified');
//           }
//         } else if (latestCheckin.log_type === 'OUT') {
//           const records = await fetchCheckinRecords();
//           if (records.length > 0) {
//             setClockOutTime(records[0].time);
            
//             const inRecord = records.find(r => r.log_type === 'IN');
//             if (inRecord) {
//               setClockInTime(inRecord.time);
//             }
            
//             // Set location name from custom_area_name
//             if (records[0].custom_area_name) {
//               setClockOutLocationName(records[0].custom_area_name);
//             } else {
//               setClockOutLocationName('Location not specified');
//             }
//           }
//         }
//       } else {
//         setClockInTime(null);
//         setClockOutTime(null);
//         setCurrentStatus(null);
//       }
//     } catch (error) {
//       console.error('Error refreshing data:', error);
//       Alert.alert('Error', 'Failed to refresh data');
//     }
//   };

//   // Load saved data on component mount
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         // Initialize camera
//         await initializeCamera();
        
//         // First fetch the latest status from server
//         const latestCheckin = await fetchLatestCheckinStatus();
        
//         if (latestCheckin) {
//           if (latestCheckin.log_type === 'IN') {
//             // If latest is IN, show clock out button and timer
//             setClockInTime(latestCheckin.time);
//             const elapsedSeconds = calculateElapsedSeconds(latestCheckin.time);
//             setClockInSeconds(elapsedSeconds);
//             startClockInTimer();
//             setClockOutTime(null);
            
//             // Set location if available
//             if (latestCheckin.latitude && latestCheckin.longitude) {
//               const coords = {
//                 latitude: latestCheckin.latitude,
//                 longitude: latestCheckin.longitude,
//                 accuracy: 0
//               };
//               setClockInLocation(coords);
//             }
            
//             // Set location name from custom_area_name
//             if (latestCheckin.custom_area_name) {
//               setClockInLocationName(latestCheckin.custom_area_name);
//             } else {
//               setClockInLocationName('Location not specified');
//             }
//           } else if (latestCheckin.log_type === 'OUT') {
//             // If latest is OUT, show clock in button and fetch both records
//             const records = await fetchCheckinRecords();
//             if (records.length > 0) {
//               // First record is the OUT
//               setClockOutTime(records[0].time);
              
//               // Find the previous IN record
//               const inRecord = records.find(r => r.log_type === 'IN');
//               if (inRecord) {
//                 setClockInTime(inRecord.time);
//               }
              
//               // Set location name from custom_area_name
//               if (records[0].custom_area_name) {
//                 setClockOutLocationName(records[0].custom_area_name);
//               } else {
//                 setClockOutLocationName('Location not specified');
//               }
//             }
//           }
//         }
//       } catch (error) {
//         console.error('Error loading data:', error);
//       } finally {
//         setIsLoadingData(false);
//       }
//     };

//     loadData();
    
//     return () => {
//       if (clockInTimerRef.current) {
//         clearInterval(clockInTimerRef.current);
//       }
//     };
//   }, [employeeData.name]);

//   const startClockInTimer = () => {
//     if (clockInTimerRef.current) {
//       clearInterval(clockInTimerRef.current);
//     }
    
//     // Update immediately to ensure no delay
//     if (clockInTime) {
//       const elapsedSeconds = calculateElapsedSeconds(clockInTime);
//       setClockInSeconds(elapsedSeconds);
//     }
    
//     // Then start the interval
//     clockInTimerRef.current = setInterval(() => {
//       setClockInSeconds(prev => prev + 1);
//     }, 1000);
//   };

//   // Timer effect
//   useEffect(() => {
//     if (currentStatus === 'IN' && clockInTime) {
//       startClockInTimer();
//     } else {
//       if (clockInTimerRef.current) {
//         clearInterval(clockInTimerRef.current);
//       }
//       setClockInSeconds(0);
//     }
//   }, [currentStatus, clockInTime]);

//   const requestLocationPermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//           {
//             title: 'Location Permission',
//             message: 'This app needs access to your location for attendance tracking.',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           }
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch (err) {
//         return false;
//       }
//     }
//     return true;
//   };

//   const getQuickLocation = async () => {
//     return new Promise((resolve, reject) => {
//       Geolocation.getCurrentPosition(
//         position => resolve(position.coords),
//         error => reject(error),
//         {
//           enableHighAccuracy: false,
//           timeout: 3000,
//           maximumAge: 30000
//         }
//       );
//     });
//   };

//   const getLocationWithFallback = async (isClockIn) => {
//     setLocationError(null);
//     if (isClockIn) {
//       setClockInLocationName('Getting location...');
//     } else {
//       setClockOutLocationName('Getting location...');
//     }
    
//     try {
//       const coords = await getQuickLocation();
//       setLocationCache({ coords, timestamp: Date.now() });
      
//       // We're not using the location name from GPS anymore
//       // Just return the coordinates
//       return coords;
//     } catch (error) {
//       if (locationCache && (Date.now() - locationCache.timestamp) < LOCATION_CACHE_EXPIRY) {
//         return locationCache.coords;
//       }
      
//       throw new Error('Could not determine your location. Please ensure you have GPS signal.');
//     }
//   };

//   const formatTimeForERP = (date) => {
//     return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
//   };

//   const formatTime = (seconds) => {
//     const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
//     const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
//     const s = (seconds % 60).toString().padStart(2, '0');
//     return `${h}:${m}:${s}`;
//   };

//   const handleClockIn = async () => {
//     if (clockInLoading) return;

//     const hasPermission = await requestLocationPermission();
//     if (!hasPermission) {
//       Alert.alert('Permission denied', 'Location permission is required to clock in.');
//       return;
//     }

//     // Ensure camera is ready
//     if (hasCameraPermission === null) {
//       const cameraReady = await initializeCamera();
//       if (!cameraReady) {
//         Alert.alert('Error', 'Camera permission is required for attendance verification.');
//         return;
//       }
//     } else if (!hasCameraPermission) {
//       Alert.alert('Error', 'Camera permission was denied. Please enable it in settings.');
//       return;
//     }

//     setClockInLoading(true);
//     setLocationError(null);
    
//     try {
//       // Take photo first - if this fails, it will throw an error
//       const photoPath = await takePhoto();
      
//       // Only proceed if photo was captured successfully
//       const coords = await getLocationWithFallback(true);
      
//       const now = new Date();
//       const timeString = formatTimeForERP(now);
      
//       const res = await fetch(`${ERP_BASE_URL}/api/resource/Employee Checkin`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Cookie: `sid=${sid}`,
//         },
//         body: JSON.stringify({
//           employee: employeeData.name,
//           log_type: 'IN',
//           time: timeString,
//           latitude: coords.latitude,
//           longitude: coords.longitude,
//           accuracy: coords.accuracy,
//         }),
//       });

//       if (!res.ok) {
//         const errText = await res.text();
//         throw new Error(`Failed to clock in: ${errText}`);
//       }

//       const responseData = await res.json();
//       const checkinName = responseData.data.name;

//       // Upload and attach photo - if this fails, it will throw an error
//       await uploadAndAttachPhoto(checkinName, photoPath);

//       // After successful clock in, fetch the latest status to ensure UI is in sync
//       const latestCheckin = await fetchLatestCheckinStatus();
      
//       if (latestCheckin && latestCheckin.log_type === 'IN') {
//         setClockInTime(latestCheckin.time);
//         const elapsedSeconds = calculateElapsedSeconds(latestCheckin.time);
//         setClockInSeconds(elapsedSeconds);
//         startClockInTimer();
        
//         if (latestCheckin.latitude && latestCheckin.longitude) {
//           const serverCoords = {
//             latitude: latestCheckin.latitude,
//             longitude: latestCheckin.longitude,
//             accuracy: 0
//           };
//           setClockInLocation(serverCoords);
//         }
        
//         // Set location name from custom_area_name
//         if (latestCheckin.custom_area_name) {
//           setClockInLocationName(latestCheckin.custom_area_name);
//         } else {
//           setClockInLocationName('Location not specified');
//         }
//       }
      
//       setClockOutTime(null);
      
//       Alert.alert('Success', 'Clock-in recorded successfully.');
//     } catch (error) {
//       setLocationError(error.message);
//       Alert.alert('Error', error.message);
//     } finally {
//       setClockInLoading(false);
//     }
//   };

//   const handleClockOut = async () => {
//     if (clockOutLoading) return;

//     // Ensure camera is ready
//     if (hasCameraPermission === null) {
//       const cameraReady = await initializeCamera();
//       if (!cameraReady) {
//         Alert.alert('Error', 'Camera permission is required for attendance verification.');
//         return;
//       }
//     } else if (!hasCameraPermission) {
//       Alert.alert('Error', 'Camera permission was denied. Please enable it in settings.');
//       return;
//     }

//     setClockOutLoading(true);
//     setLocationError(null);
    
//     try {
//       // Take photo first - if this fails, it will throw an error
//       const photoPath = await takePhoto();
      
//       // Only proceed if photo was captured successfully
//       const coords = await getLocationWithFallback(false);
      
//       const now = new Date();
//       const timeString = formatTimeForERP(now);
      
//       const res = await fetch(`${ERP_BASE_URL}/api/resource/Employee Checkin`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Cookie: `sid=${sid}`,
//         },
//         body: JSON.stringify({
//           employee: employeeData.name,
//           log_type: 'OUT',
//           time: timeString,
//           latitude: coords.latitude,
//           longitude: coords.longitude,
//           accuracy: coords.accuracy,
//         }),
//       });

//       if (!res.ok) {
//         const errText = await res.text();
//         throw new Error(`Failed to clock out: ${errText}`);
//       }

//       const responseData = await res.json();
//       const checkinName = responseData.data.name;

//       // Upload and attach photo - if this fails, it will throw an error
//       await uploadAndAttachPhoto(checkinName, photoPath);

//       // After successful clock out, fetch the latest status to ensure UI is in sync
//       const latestCheckin = await fetchLatestCheckinStatus();
      
//       if (latestCheckin && latestCheckin.log_type === 'OUT') {
//         setClockOutTime(latestCheckin.time);
//         setClockOutLocation({
//           latitude: latestCheckin.latitude,
//           longitude: latestCheckin.longitude,
//           accuracy: 0
//         });
        
//         // Set location name from custom_area_name
//         if (latestCheckin.custom_area_name) {
//           setClockOutLocationName(latestCheckin.custom_area_name);
//         } else {
//           setClockOutLocationName('Location not specified');
//         }
//       }
      
//       Alert.alert('Success', 'Clock-out recorded successfully.');
//     } catch (error) {
//       setLocationError(error.message);
      
//       if (locationCache && (Date.now() - locationCache.timestamp) < LOCATION_CACHE_EXPIRY * 2) {
//         const useCached = await new Promise(resolve => {
//           Alert.alert(
//             'Location Error',
//             'Could not get fresh location. Would you like to use your last known location?',
//             [
//               { text: 'Cancel', onPress: () => resolve(false), style: 'cancel' },
//               { text: 'Use Cached', onPress: () => resolve(true) }
//             ]
//           );
//         });
        
//         if (useCached) {
//           // Take photo again even when using cached location
//           const cachedPhotoPath = await takePhoto();
          
//           const now = new Date();
//           const timeString = formatTimeForERP(now);
          
//           const res = await fetch(`${ERP_BASE_URL}/api/resource/Employee Checkin`, {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               Cookie: `sid=${sid}`,
//             },
//             body: JSON.stringify({
//               employee: employeeData.name,
//               log_type: 'OUT',
//               time: timeString,
//               latitude: locationCache.coords.latitude,
//               longitude: locationCache.coords.longitude,
//               accuracy: locationCache.coords.accuracy,
//             }),
//           });

//           if (!res.ok) {
//             const errText = await res.text();
//             throw new Error(`Failed to clock out: ${errText}`);
//           }

//           const responseData = await res.json();
//           const checkinName = responseData.data.name;

//           // Upload and attach photo - if this fails, it will throw an error
//           await uploadAndAttachPhoto(checkinName, cachedPhotoPath);

//           setClockOutTime(now);
//           setClockOutLocation(locationCache.coords);
//           setClockOutLocationName('Location not specified'); // Default since we don't have area name
//           Alert.alert('Success', 'Clock-out recorded with cached location.');
//           return;
//         }
//       }
      
//       Alert.alert('Error', error.message);
//     } finally {
//       setClockOutLoading(false);
//     }
//   };

//   const toggleCameraType = () => {
//     setCameraType(
//       cameraType === RNCamera.Constants.Type.back
//         ? RNCamera.Constants.Type.front
//         : RNCamera.Constants.Type.back
//     );
//   };

//   if (isLoadingData) {
//     return (
//       <View style={[styles.outerContainer, { justifyContent: 'center', alignItems: 'center' }]}>
//         <ActivityIndicator size="large" color="#4CAF50" />
//         <Text style={{ marginTop: 10 }}>Loading attendance data...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.outerContainer}>
//       {/* Camera Container - Moved to top */}
//       <View style={styles.cameraContainer}>
//         {hasCameraPermission === true ? (
//           <RNCamera
//             ref={cameraRef}
//             style={styles.camera}
//             type={cameraType}
//             captureAudio={false}
//             androidCameraPermissionOptions={{
//               title: 'Permission to use camera',
//               message: 'We need your permission to use your camera',
//               buttonPositive: 'Ok',
//               buttonNegative: 'Cancel',
//             }}
//             pictureSize="640x480"
//           >
//             <View style={styles.cameraControls}>
//               <TouchableOpacity onPress={toggleCameraType} style={styles.flipButton}>
//                 <Ionicons name="camera-reverse-outline" size={28} color="#fff" />
//               </TouchableOpacity>
//             </View>
//           </RNCamera>
//         ) : hasCameraPermission === false ? (
//           <View style={[styles.camera, styles.cameraPlaceholder]}>
//             <Text style={styles.cameraPlaceholderText}>
//               Camera permission not granted
//             </Text>
//             <TouchableOpacity 
//               style={styles.permissionButton}
//               onPress={initializeCamera}
//             >
//               <Text style={styles.permissionButtonText}>Request Camera Permission</Text>
//             </TouchableOpacity>
//           </View>
//         ) : (
//           <View style={[styles.camera, styles.cameraPlaceholder]}>
//             <ActivityIndicator size="large" color="#4CAF50" />
//             <Text style={styles.cameraPlaceholderText}>
//               Initializing camera...
//             </Text>
//           </View>
//         )}
//       </View>

//       {/* Info Container - Moved to middle */}
//       <View style={styles.infoContainer}>
//         {currentStatus === 'IN' && clockInTime ? (
//           <>
//             <Text style={styles.timeLabel}>Clock In Time:</Text>
//             <Text style={styles.timeText}>
//               {extractTimeFromDateTime(clockInTime)}
//             </Text>
//             <Text style={styles.timerText}>Timer: {formatTime(clockInSeconds)}</Text>
//             {clockInLocationName && (
//               <Text style={styles.locationText}>
//                 {clockInLocationName}
//               </Text>
//             )}
//           </>
//         ) : currentStatus === 'OUT' && clockOutTime ? (
//           <>
//             <Text style={styles.timeLabel}>Clock Out Time:</Text>
//             <Text style={styles.timeText}>
//               {extractTimeFromDateTime(clockOutTime)}
//             </Text>
//             {clockInTime && (
//               <>
//                 <Text style={styles.timerText}>Total Time: {calculateTimeDifference(clockInTime, clockOutTime)}</Text>
//               </>
//             )}
//             {clockOutLocationName && (
//               <Text style={styles.locationText}>
//                 {clockOutLocationName}
//               </Text>
//             )}
//           </>
//         ) : (
//           <Text style={styles.placeholderText}>No attendance record yet</Text>
//         )}
        
//         {locationError && (
//           <Text style={styles.errorText}>{locationError}</Text>
//         )}
//       </View>

//       {/* Button Container - Moved to bottom */}
//       <View style={styles.buttonContainer}>
//         {currentStatus !== 'IN' ? (
//           <TouchableOpacity
//             style={[styles.clockInButton, clockInLoading ? styles.buttonDisabled : {}]}
//             onPress={handleClockIn}
//             disabled={clockInLoading || hasCameraPermission === false}
//           >
//             {clockInLoading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <>
//                 <Ionicons name="time-outline" size={28} color="#fff" />
//                 <Text style={styles.clockInButtonText}>Clock In</Text>
//               </>
//             )}
//           </TouchableOpacity>
//         ) : (
//           <TouchableOpacity
//             style={[styles.clockOutButton, clockOutLoading ? styles.buttonDisabled : {}]}
//             onPress={handleClockOut}
//             disabled={clockOutLoading || hasCameraPermission === false}
//           >
//             {clockOutLoading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <>
//                 <Ionicons name="exit-outline" size={28} color="#fff" />
//                 <Text style={styles.clockOutButtonText}>Clock Out</Text>
//               </>
//             )}
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   outerContainer: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f8f9fa',
//   },
//   cameraContainer: {
//     backgroundColor: '#fff',
//     padding: 10,
//     borderRadius: 12,
//     elevation: 2,
//     borderWidth: 2,
//     borderColor: 'skyblue',
//     marginBottom: 10,
//   },
//   infoContainer: {
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 12,
//     alignItems: 'center',
//     elevation: 2,
//     borderWidth: 2,
//     borderColor: 'skyblue',
//     marginBottom: 10,
//   },
//   buttonContainer: {
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 12,
//     alignItems: 'center',
//     elevation: 2,
//     borderWidth: 2,
//     borderColor: 'skyblue',
//   },
//   camera: {
//     width: '50%',
//     height: 200,
//     borderRadius: 8,
//     overflow: 'hidden',
//     alignSelf:'center',
//     marginLeft:'auto', 
//     marginRight:'auto',
//     justifyContent: 'flex-end',
//   },
//   cameraControls: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     padding: 20,
//   },
//   flipButton: {
//     alignSelf: 'flex-end',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     borderRadius: 20,
//     padding: 10,
//   },
//   cameraPlaceholder: {
//     backgroundColor: '#e0e0e0',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   cameraPlaceholderText: {
//     color: '#666',
//     textAlign: 'center',
//     marginTop: 10,
//   },
//   permissionButton: {
//     marginTop: 15,
//     backgroundColor: '#2196F3',
//     padding: 10,
//     borderRadius: 5,
//   },
//   permissionButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   clockInButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: 150,
//     height: 150,
//     borderRadius: 75,
//     borderWidth: 2,
//     borderColor: 'skyblue',
//     backgroundColor: '#2196F3',
//     padding: 10,
//   },
//   clockOutButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: 150,
//     height: 150,
//     borderRadius: 75,
//     borderWidth: 2,
//     borderColor: 'black',
//     backgroundColor: '#f44336',
//     padding: 10,
//   },
//   buttonDisabled: {
//     opacity: 0.6,
//   },
//   clockInButtonText: {
//     marginLeft: 10,
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#fff',
//   },
//   clockOutButtonText: {
//     marginLeft: 10,
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#fff',
//   },
//   timeLabel: {
//     fontSize: 19,
//     color: '#555',
//     marginBottom: 5,
//   },
//   timeText: {
//     fontSize: 20,
//     color: '#222',
//     marginBottom: 10,
//   },
//   timerText: {
//     fontSize: 16,
//     color: 'skyblue',
//     marginBottom: 10,
//   },
//   locationText: {
//     fontSize: 14,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 5,
//   },
//   errorText: {
//     fontSize: 14,
//     color: '#f44336',
//     textAlign: 'center',
//   },
//   placeholderText: {
//     fontSize: 16,
//     color: '#888',
//     textAlign: 'center',
//   },
// });

// export default ClockIn;


// // code for camera work on all android version-1

// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
//   Platform,
//   PermissionsAndroid,
//   Dimensions,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import Geolocation from '@react-native-community/geolocation';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { RNCamera } from 'react-native-camera';

// const ERP_BASE_URL = 'https://erpnextcloud.cbditsolutions.com';
// const LOCATION_CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes cache validity
// const { width: windowWidth } = Dimensions.get('window');

// const ClockIn = ({ sid, employeeData }) => {
//   const [clockInTime, setClockInTime] = useState(null);
//   const [clockOutTime, setClockOutTime] = useState(null);
//   const [clockInSeconds, setClockInSeconds] = useState(0);
//   const [clockInLoading, setClockInLoading] = useState(false);
//   const [clockOutLoading, setClockOutLoading] = useState(false);
//   const [locationCache, setLocationCache] = useState(null);
//   const [clockInLocation, setClockInLocation] = useState(null);
//   const [clockOutLocation, setClockOutLocation] = useState(null);
//   const [locationError, setLocationError] = useState(null);
//   const [clockInLocationName, setClockInLocationName] = useState('Fetching location...');
//   const [clockOutLocationName, setClockOutLocationName] = useState('Fetching location...');
//   const [isLoadingData, setIsLoadingData] = useState(true);
//   const [currentStatus, setCurrentStatus] = useState(null); // 'IN', 'OUT', or null
//   const [lastCheckinRecord, setLastCheckinRecord] = useState(null);
  
//   // Camera states
//   const cameraRef = useRef(null);
//   const [hasCameraPermission, setHasCameraPermission] = useState(null);
//   const [photoPath, setPhotoPath] = useState(null);
//   const [showCamera, setShowCamera] = useState(true);
//   const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.back);
//   const [isCameraReady, setIsCameraReady] = useState(false);

//   const clockInTimerRef = useRef(null);

//   // Fetch latest checkin status from server
//   const fetchLatestCheckinStatus = async () => {
//     try {
//       const response = await fetch(
//         `${ERP_BASE_URL}/api/resource/Employee Checkin?fields=["name","employee","log_type","time","latitude","longitude","custom_area_name","custom_photo"]&filters=[["employee","=","${employeeData.name}"]]&order_by=time desc&limit=1`,
//         {
//           headers: {
//             Cookie: `sid=${sid}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error('Failed to fetch checkin status');
//       }

//       const data = await response.json();
//       if (data.data && data.data.length > 0) {
//         const latestCheckin = data.data[0];
//         setLastCheckinRecord(latestCheckin);
//         setCurrentStatus(latestCheckin.log_type);
//         return latestCheckin;
//       }
//       setCurrentStatus(null);
//       return null;
//     } catch (error) {
//       console.error('Error fetching checkin status:', error);
//       setCurrentStatus(null);
//       return null;
//     }
//   };

//   // Request camera permission
//   const requestCameraPermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.CAMERA,
//           {
//             title: 'Camera Permission',
//             message: 'This app needs access to your camera for attendance verification.',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           }
//         );
//         const hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
//         setHasCameraPermission(hasPermission);
//         return hasPermission;
//       } catch (err) {
//         console.error('Camera permission error:', err);
//         setHasCameraPermission(false);
//         return false;
//       }
//     }
//     // On iOS, permissions are handled by Info.plist
//     setHasCameraPermission(true);
//     return true;
//   };

//   // Initialize camera
//   const initializeCamera = async () => {
//     try {
//       const hasPermission = await requestCameraPermission();
//       if (!hasPermission) {
//         Alert.alert('Permission denied', 'Camera permission is required for attendance verification.');
//         return false;
//       }
//       return true;
//     } catch (error) {
//       console.error('Error initializing camera:', error);
//       return false;
//     }
//   };

//   // Take photo
//   const takePhoto = async () => {
//     if (!cameraRef.current || !hasCameraPermission) {
//       console.log('Camera not ready or no permission');
//       throw new Error('Camera not ready or permission denied');
//     }

//     try {
//       // Ensure camera is ready
//       if (!isCameraReady) {
//         await new Promise(resolve => setTimeout(resolve, 500)); // Small delay to ensure camera is ready
//       }

//       const options = { 
//         quality: 0.8, 
//         base64: false,
//         fixOrientation: true,
//         forceUpOrientation: true,
//         pauseAfterCapture: true,
//         width: 640,
//         height: 480,
//         skipProcessing: true // Helps with Android compatibility
//       };
      
//       console.log('Attempting to take photo...');
//       const data = await cameraRef.current.takePictureAsync(options);
//       console.log('Photo taken:', data.uri);
//       setPhotoPath(data.uri);
//       return data.uri;
//     } catch (error) {
//       console.error('Error taking photo:', error);
//       throw new Error('Failed to capture photo: ' + error.message);
//     }
//   };

//   const uploadAndAttachPhoto = async (checkinName, photoUri) => {
//     if (!photoUri) {
//       console.log('No photo to upload');
//       throw new Error('No photo to upload');
//     }
    
//     try {
//       // Step 1: Upload the file
//       const formData = new FormData();
//       formData.append('file', {
//         uri: photoUri,
//         name: `attendance_${checkinName}.jpg`,
//         type: 'image/jpeg',
//       });
//       formData.append('is_private', 0);
//       formData.append('folder', 'Home/Attachments');
//       formData.append('doctype', 'Employee Checkin');
//       formData.append('docname', checkinName);
//       formData.append('fieldname', 'custom_photo');

//       console.log('Uploading photo to file list...');
      
//       const uploadResponse = await fetch(`${ERP_BASE_URL}/api/method/upload_file`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           'Accept': 'application/json',
//           'Cookie': `sid=${sid}`,
//         },
//         body: formData,
//       });

//       if (!uploadResponse.ok) {
//         const errText = await uploadResponse.text();
//         throw new Error(`Failed to upload photo: ${errText}`);
//       }

//       const uploadResult = await uploadResponse.json();
//       console.log('Photo upload to file list successful:', uploadResult.message);
      
//       // Step 2: Explicitly update the checkin record with the photo attachment
//       const updateResponse = await fetch(`${ERP_BASE_URL}/api/resource/Employee Checkin/${checkinName}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Cookie': `sid=${sid}`,
//         },
//         body: JSON.stringify({
//           custom_photo: uploadResult.message.file_url
//         }),
//       });

//       if (!updateResponse.ok) {
//         const errText = await updateResponse.text();
//         throw new Error(`Failed to update checkin record: ${errText}`);
//       }

//       return true;
//     } catch (error) {
//       console.error('Error in photo upload:', error);
//       throw error;
//     }
//   };

//   // Fetch previous checkin records (for getting both IN and OUT records)
//   const fetchCheckinRecords = async () => {
//     try {
//       const response = await fetch(
//         `${ERP_BASE_URL}/api/resource/Employee Checkin?fields=["name","employee","log_type","time","latitude","longitude","custom_area_name","custom_photo"]&filters=[["employee","=","${employeeData.name}"]]&order_by=time desc&limit=2`,
//         {
//           headers: {
//             Cookie: `sid=${sid}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error('Failed to fetch checkin records');
//       }

//       const data = await response.json();
//       return data.data || [];
//     } catch (error) {
//       console.error('Error fetching checkin records:', error);
//       return [];
//     }
//   };

//   // Extract time from datetime string (HH:MM AM/PM format)
//   const extractTimeFromDateTime = (dateTimeString) => {
//     if (!dateTimeString) return '';
//     try {
//       const date = new Date(dateTimeString);
//       if (isNaN(date.getTime())) {
//         const parts = dateTimeString.split(/[- :T]/);
//         const fixedDate = new Date(
//           parts[0],
//           parts[1] - 1,
//           parts[2],
//           parts[3],
//           parts[4],
//           parts[5] || 0
//         );
//         if (!isNaN(fixedDate.getTime())) {
//           return fixedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//         }
//         return 'Invalid time';
//       }
//       return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     } catch (error) {
//       console.error('Error parsing time:', error);
//       return 'Invalid time';
//     }
//   };

//   // Calculate time difference in HH:MM:SS format
//   const calculateTimeDifference = (startTime, endTime) => {
//     if (!startTime || !endTime) return '00:00:00';
    
//     try {
//       let start = new Date(startTime);
//       let end = new Date(endTime);
      
//       if (isNaN(start.getTime())) {
//         // Try alternative parsing if standard parsing fails
//         const parts = startTime.split(/[- :T]/);
//         const fixedStart = new Date(
//           parts[0],
//           parts[1] - 1,
//           parts[2],
//           parts[3],
//           parts[4],
//           parts[5] || 0
//         );
//         if (!isNaN(fixedStart.getTime())) {
//           start = fixedStart;
//         }
//       }

//       if (isNaN(end.getTime())) {
//         const parts = endTime.split(/[- :T]/);
//         const fixedEnd = new Date(
//           parts[0],
//           parts[1] - 1,
//           parts[2],
//           parts[3],
//           parts[4],
//           parts[5] || 0
//         );
//         if (!isNaN(fixedEnd.getTime())) {
//           end = fixedEnd;
//         }
//       }
      
//       if (isNaN(start.getTime()) || isNaN(end.getTime())) {
//         return '00:00:00';
//       }
      
//       const diffMs = end - start;
//       const diffSec = Math.floor(diffMs / 1000);
//       const h = Math.floor(diffSec / 3600).toString().padStart(2, '0');
//       const m = Math.floor((diffSec % 3600) / 60).toString().padStart(2, '0');
//       const s = (diffSec % 60).toString().padStart(2, '0');
      
//       return `${h}:${m}:${s}`;
//     } catch (error) {
//       console.error('Error calculating time difference:', error);
//       return '00:00:00';
//     }
//   };

//   // Calculate elapsed seconds from clock-in time
//   const calculateElapsedSeconds = (clockInTime) => {
//     if (!clockInTime) return 0;
    
//     try {
//       const clockInDate = new Date(clockInTime);
//       if (isNaN(clockInDate.getTime())) {
//         // Try alternative parsing if standard parsing fails
//         const parts = clockInTime.split(/[- :T]/);
//         const fixedDate = new Date(
//           parts[0],
//           parts[1] - 1,
//           parts[2],
//           parts[3],
//           parts[4],
//           parts[5] || 0
//         );
//         if (!isNaN(fixedDate.getTime())) {
//           return Math.floor((new Date() - fixedDate) / 1000);
//         }
//         return 0;
//       }
//       return Math.floor((new Date() - clockInDate) / 1000);
//     } catch (error) {
//       console.error('Error calculating elapsed seconds:', error);
//       return 0;
//     }
//   };

//   // Refresh data
//   const refreshData = async () => {
//     try {
//       const latestCheckin = await fetchLatestCheckinStatus();
      
//       if (latestCheckin) {
//         if (latestCheckin.log_type === 'IN') {
//           setClockInTime(latestCheckin.time);
//           const elapsedSeconds = calculateElapsedSeconds(latestCheckin.time);
//           setClockInSeconds(elapsedSeconds);
//           startClockInTimer();
//           setClockOutTime(null);
          
//           if (latestCheckin.latitude && latestCheckin.longitude) {
//             const coords = {
//               latitude: latestCheckin.latitude,
//               longitude: latestCheckin.longitude,
//               accuracy: 0
//             };
//             setClockInLocation(coords);
//           }
          
//           // Set location name from custom_area_name
//           if (latestCheckin.custom_area_name) {
//             setClockInLocationName(latestCheckin.custom_area_name);
//           } else {
//             setClockInLocationName('Location not specified');
//           }
//         } else if (latestCheckin.log_type === 'OUT') {
//           const records = await fetchCheckinRecords();
//           if (records.length > 0) {
//             setClockOutTime(records[0].time);
            
//             const inRecord = records.find(r => r.log_type === 'IN');
//             if (inRecord) {
//               setClockInTime(inRecord.time);
//             }
            
//             // Set location name from custom_area_name
//             if (records[0].custom_area_name) {
//               setClockOutLocationName(records[0].custom_area_name);
//             } else {
//               setClockOutLocationName('Location not specified');
//             }
//           }
//         }
//       } else {
//         setClockInTime(null);
//         setClockOutTime(null);
//         setCurrentStatus(null);
//       }
//     } catch (error) {
//       console.error('Error refreshing data:', error);
//       Alert.alert('Error', 'Failed to refresh data');
//     }
//   };

//   // Load saved data on component mount
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         // Initialize camera
//         await initializeCamera();
        
//         // First fetch the latest status from server
//         const latestCheckin = await fetchLatestCheckinStatus();
        
//         if (latestCheckin) {
//           if (latestCheckin.log_type === 'IN') {
//             // If latest is IN, show clock out button and timer
//             setClockInTime(latestCheckin.time);
//             const elapsedSeconds = calculateElapsedSeconds(latestCheckin.time);
//             setClockInSeconds(elapsedSeconds);
//             startClockInTimer();
//             setClockOutTime(null);
            
//             // Set location if available
//             if (latestCheckin.latitude && latestCheckin.longitude) {
//               const coords = {
//                 latitude: latestCheckin.latitude,
//                 longitude: latestCheckin.longitude,
//                 accuracy: 0
//               };
//               setClockInLocation(coords);
//             }
            
//             // Set location name from custom_area_name
//             if (latestCheckin.custom_area_name) {
//               setClockInLocationName(latestCheckin.custom_area_name);
//             } else {
//               setClockInLocationName('Location not specified');
//             }
//           } else if (latestCheckin.log_type === 'OUT') {
//             // If latest is OUT, show clock in button and fetch both records
//             const records = await fetchCheckinRecords();
//             if (records.length > 0) {
//               // First record is the OUT
//               setClockOutTime(records[0].time);
              
//               // Find the previous IN record
//               const inRecord = records.find(r => r.log_type === 'IN');
//               if (inRecord) {
//                 setClockInTime(inRecord.time);
//               }
              
//               // Set location name from custom_area_name
//               if (records[0].custom_area_name) {
//                 setClockOutLocationName(records[0].custom_area_name);
//               } else {
//                 setClockOutLocationName('Location not specified');
//               }
//             }
//           }
//         }
//       } catch (error) {
//         console.error('Error loading data:', error);
//       } finally {
//         setIsLoadingData(false);
//       }
//     };

//     loadData();
    
//     return () => {
//       if (clockInTimerRef.current) {
//         clearInterval(clockInTimerRef.current);
//       }
//     };
//   }, [employeeData.name]);

//   const startClockInTimer = () => {
//     if (clockInTimerRef.current) {
//       clearInterval(clockInTimerRef.current);
//     }
    
//     // Update immediately to ensure no delay
//     if (clockInTime) {
//       const elapsedSeconds = calculateElapsedSeconds(clockInTime);
//       setClockInSeconds(elapsedSeconds);
//     }
    
//     // Then start the interval
//     clockInTimerRef.current = setInterval(() => {
//       setClockInSeconds(prev => prev + 1);
//     }, 1000);
//   };

//   // Timer effect
//   useEffect(() => {
//     if (currentStatus === 'IN' && clockInTime) {
//       startClockInTimer();
//     } else {
//       if (clockInTimerRef.current) {
//         clearInterval(clockInTimerRef.current);
//       }
//       setClockInSeconds(0);
//     }
//   }, [currentStatus, clockInTime]);

//   const requestLocationPermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//           {
//             title: 'Location Permission',
//             message: 'This app needs access to your location for attendance tracking.',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           }
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch (err) {
//         return false;
//       }
//     }
//     return true;
//   };

//   const getQuickLocation = async () => {
//     return new Promise((resolve, reject) => {
//       Geolocation.getCurrentPosition(
//         position => resolve(position.coords),
//         error => reject(error),
//         {
//           enableHighAccuracy: false,
//           timeout: 3000,
//           maximumAge: 30000
//         }
//       );
//     });
//   };

//   const getLocationWithFallback = async (isClockIn) => {
//     setLocationError(null);
//     if (isClockIn) {
//       setClockInLocationName('Getting location...');
//     } else {
//       setClockOutLocationName('Getting location...');
//     }
    
//     try {
//       const coords = await getQuickLocation();
//       setLocationCache({ coords, timestamp: Date.now() });
      
//       // We're not using the location name from GPS anymore
//       // Just return the coordinates
//       return coords;
//     } catch (error) {
//       if (locationCache && (Date.now() - locationCache.timestamp) < LOCATION_CACHE_EXPIRY) {
//         return locationCache.coords;
//       }
      
//       throw new Error('Could not determine your location. Please ensure you have GPS signal.');
//     }
//   };

//   const formatTimeForERP = (date) => {
//     return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
//   };

//   const formatTime = (seconds) => {
//     const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
//     const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
//     const s = (seconds % 60).toString().padStart(2, '0');
//     return `${h}:${m}:${s}`;
//   };

//   const handleClockIn = async () => {
//     if (clockInLoading) return;

//     const hasPermission = await requestLocationPermission();
//     if (!hasPermission) {
//       Alert.alert('Permission denied', 'Location permission is required to clock in.');
//       return;
//     }

//     // Ensure camera is ready
//     if (hasCameraPermission === null) {
//       const cameraReady = await initializeCamera();
//       if (!cameraReady) {
//         Alert.alert('Error', 'Camera permission is required for attendance verification.');
//         return;
//       }
//     } else if (!hasCameraPermission) {
//       Alert.alert('Error', 'Camera permission was denied. Please enable it in settings.');
//       return;
//     }

//     setClockInLoading(true);
//     setLocationError(null);
    
//     try {
//       // Take photo first - if this fails, it will throw an error
//       const photoPath = await takePhoto();
      
//       // Only proceed if photo was captured successfully
//       const coords = await getLocationWithFallback(true);
      
//       const now = new Date();
//       const timeString = formatTimeForERP(now);
      
//       const res = await fetch(`${ERP_BASE_URL}/api/resource/Employee Checkin`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Cookie: `sid=${sid}`,
//         },
//         body: JSON.stringify({
//           employee: employeeData.name,
//           log_type: 'IN',
//           time: timeString,
//           latitude: coords.latitude,
//           longitude: coords.longitude,
//           accuracy: coords.accuracy,
//         }),
//       });

//       if (!res.ok) {
//         const errText = await res.text();
//         throw new Error(`Failed to clock in: ${errText}`);
//       }

//       const responseData = await res.json();
//       const checkinName = responseData.data.name;

//       // Upload and attach photo - if this fails, it will throw an error
//       await uploadAndAttachPhoto(checkinName, photoPath);

//       // After successful clock in, fetch the latest status to ensure UI is in sync
//       const latestCheckin = await fetchLatestCheckinStatus();
      
//       if (latestCheckin && latestCheckin.log_type === 'IN') {
//         setClockInTime(latestCheckin.time);
//         const elapsedSeconds = calculateElapsedSeconds(latestCheckin.time);
//         setClockInSeconds(elapsedSeconds);
//         startClockInTimer();
        
//         if (latestCheckin.latitude && latestCheckin.longitude) {
//           const serverCoords = {
//             latitude: latestCheckin.latitude,
//             longitude: latestCheckin.longitude,
//             accuracy: 0
//           };
//           setClockInLocation(serverCoords);
//         }
        
//         // Set location name from custom_area_name
//         if (latestCheckin.custom_area_name) {
//           setClockInLocationName(latestCheckin.custom_area_name);
//         } else {
//           setClockInLocationName('Location not specified');
//         }
//       }
      
//       setClockOutTime(null);
      
//       Alert.alert('Success', 'Clock-in recorded successfully.');
//     } catch (error) {
//       setLocationError(error.message);
//       Alert.alert('Error', error.message);
//     } finally {
//       setClockInLoading(false);
//     }
//   };

//   const handleClockOut = async () => {
//     if (clockOutLoading) return;

//     // Ensure camera is ready
//     if (hasCameraPermission === null) {
//       const cameraReady = await initializeCamera();
//       if (!cameraReady) {
//         Alert.alert('Error', 'Camera permission is required for attendance verification.');
//         return;
//       }
//     } else if (!hasCameraPermission) {
//       Alert.alert('Error', 'Camera permission was denied. Please enable it in settings.');
//       return;
//     }

//     setClockOutLoading(true);
//     setLocationError(null);
    
//     try {
//       // Take photo first - if this fails, it will throw an error
//       const photoPath = await takePhoto();
      
//       // Only proceed if photo was captured successfully
//       const coords = await getLocationWithFallback(false);
      
//       const now = new Date();
//       const timeString = formatTimeForERP(now);
      
//       const res = await fetch(`${ERP_BASE_URL}/api/resource/Employee Checkin`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Cookie: `sid=${sid}`,
//         },
//         body: JSON.stringify({
//           employee: employeeData.name,
//           log_type: 'OUT',
//           time: timeString,
//           latitude: coords.latitude,
//           longitude: coords.longitude,
//           accuracy: coords.accuracy,
//         }),
//       });

//       if (!res.ok) {
//         const errText = await res.text();
//         throw new Error(`Failed to clock out: ${errText}`);
//       }

//       const responseData = await res.json();
//       const checkinName = responseData.data.name;

//       // Upload and attach photo - if this fails, it will throw an error
//       await uploadAndAttachPhoto(checkinName, photoPath);

//       // After successful clock out, fetch the latest status to ensure UI is in sync
//       const latestCheckin = await fetchLatestCheckinStatus();
      
//       if (latestCheckin && latestCheckin.log_type === 'OUT') {
//         setClockOutTime(latestCheckin.time);
//         setClockOutLocation({
//           latitude: latestCheckin.latitude,
//           longitude: latestCheckin.longitude,
//           accuracy: 0
//         });
        
//         // Set location name from custom_area_name
//         if (latestCheckin.custom_area_name) {
//           setClockOutLocationName(latestCheckin.custom_area_name);
//         } else {
//           setClockOutLocationName('Location not specified');
//         }
//       }
      
//       Alert.alert('Success', 'Clock-out recorded successfully.');
//     } catch (error) {
//       setLocationError(error.message);
      
//       if (locationCache && (Date.now() - locationCache.timestamp) < LOCATION_CACHE_EXPIRY * 2) {
//         const useCached = await new Promise(resolve => {
//           Alert.alert(
//             'Location Error',
//             'Could not get fresh location. Would you like to use your last known location?',
//             [
//               { text: 'Cancel', onPress: () => resolve(false), style: 'cancel' },
//               { text: 'Use Cached', onPress: () => resolve(true) }
//             ]
//           );
//         });
        
//         if (useCached) {
//           // Take photo again even when using cached location
//           const cachedPhotoPath = await takePhoto();
          
//           const now = new Date();
//           const timeString = formatTimeForERP(now);
          
//           const res = await fetch(`${ERP_BASE_URL}/api/resource/Employee Checkin`, {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               Cookie: `sid=${sid}`,
//             },
//             body: JSON.stringify({
//               employee: employeeData.name,
//               log_type: 'OUT',
//               time: timeString,
//               latitude: locationCache.coords.latitude,
//               longitude: locationCache.coords.longitude,
//               accuracy: locationCache.coords.accuracy,
//             }),
//           });

//           if (!res.ok) {
//             const errText = await res.text();
//             throw new Error(`Failed to clock out: ${errText}`);
//           }

//           const responseData = await res.json();
//           const checkinName = responseData.data.name;

//           // Upload and attach photo - if this fails, it will throw an error
//           await uploadAndAttachPhoto(checkinName, cachedPhotoPath);

//           setClockOutTime(now);
//           setClockOutLocation(locationCache.coords);
//           setClockOutLocationName('Location not specified'); // Default since we don't have area name
//           Alert.alert('Success', 'Clock-out recorded with cached location.');
//           return;
//         }
//       }
      
//       Alert.alert('Error', error.message);
//     } finally {
//       setClockOutLoading(false);
//     }
//   };

//   const toggleCameraType = () => {
//     setCameraType(
//       cameraType === RNCamera.Constants.Type.back
//         ? RNCamera.Constants.Type.front
//         : RNCamera.Constants.Type.back
//     );
//   };

//   const handleCameraReady = () => {
//     setIsCameraReady(true);
//   };

//   if (isLoadingData) {
//     return (
//       <View style={[styles.outerContainer, { justifyContent: 'center', alignItems: 'center' }]}>
//         <ActivityIndicator size="large" color="#4CAF50" />
//         <Text style={{ marginTop: 10 }}>Loading attendance data...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.outerContainer}>
//       {/* Camera Container - Moved to top */}
//       <View style={styles.cameraContainer}>
//         {hasCameraPermission === true ? (
//           <RNCamera
//             ref={cameraRef}
//             style={styles.camera}
//             type={cameraType}
//             captureAudio={false}
//             androidCameraPermissionOptions={{
//               title: 'Permission to use camera',
//               message: 'We need your permission to use your camera',
//               buttonPositive: 'Ok',
//               buttonNegative: 'Cancel',
//             }}
//             onCameraReady={handleCameraReady}
//             pictureSize="640x480"
//             androidRecordAudioPermissionOptions={{
//               title: 'Permission to use audio recording',
//               message: 'We need your permission to use your audio',
//               buttonPositive: 'Ok',
//               buttonNegative: 'Cancel',
//             }}
//           >
//             <View style={styles.cameraControls}>
//               <TouchableOpacity onPress={toggleCameraType} style={styles.flipButton}>
//                 <Ionicons name="camera-reverse-outline" size={28} color="#fff" />
//               </TouchableOpacity>
//             </View>
//           </RNCamera>
//         ) : hasCameraPermission === false ? (
//           <View style={[styles.camera, styles.cameraPlaceholder]}>
//             <Text style={styles.cameraPlaceholderText}>
//               Camera permission not granted
//             </Text>
//             <TouchableOpacity 
//               style={styles.permissionButton}
//               onPress={initializeCamera}
//             >
//               <Text style={styles.permissionButtonText}>Request Camera Permission</Text>
//             </TouchableOpacity>
//           </View>
//         ) : (
//           <View style={[styles.camera, styles.cameraPlaceholder]}>
//             <ActivityIndicator size="large" color="#4CAF50" />
//             <Text style={styles.cameraPlaceholderText}>
//               Initializing camera...
//             </Text>
//           </View>
//         )}
//       </View>

//       {/* Info Container - Moved to middle */}
//       <View style={styles.infoContainer}>
//         {currentStatus === 'IN' && clockInTime ? (
//           <>
//             <Text style={styles.timeLabel}>Clock In Time:</Text>
//             <Text style={styles.timeText}>
//               {extractTimeFromDateTime(clockInTime)}
//             </Text>
//             <Text style={styles.timerText}>Timer: {formatTime(clockInSeconds)}</Text>
//             {clockInLocationName && (
//               <Text style={styles.locationText}>
//                 {clockInLocationName}
//               </Text>
//             )}
//           </>
//         ) : currentStatus === 'OUT' && clockOutTime ? (
//           <>
//             <Text style={styles.timeLabel}>Clock Out Time:</Text>
//             <Text style={styles.timeText}>
//               {extractTimeFromDateTime(clockOutTime)}
//             </Text>
//             {clockInTime && (
//               <>
//                 <Text style={styles.timerText}>Total Time: {calculateTimeDifference(clockInTime, clockOutTime)}</Text>
//               </>
//             )}
//             {clockOutLocationName && (
//               <Text style={styles.locationText}>
//                 {clockOutLocationName}
//               </Text>
//             )}
//           </>
//         ) : (
//           <Text style={styles.placeholderText}>No attendance record yet</Text>
//         )}
        
//         {locationError && (
//           <Text style={styles.errorText}>{locationError}</Text>
//         )}
//       </View>

//       {/* Button Container - Moved to bottom */}
//       <View style={styles.buttonContainer}>
//         {currentStatus !== 'IN' ? (
//           <TouchableOpacity
//             style={[styles.clockInButton, clockInLoading ? styles.buttonDisabled : {}]}
//             onPress={handleClockIn}
//             disabled={clockInLoading || hasCameraPermission === false}
//           >
//             {clockInLoading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <>
//                 <Ionicons name="time-outline" size={28} color="#fff" />
//                 <Text style={styles.clockInButtonText}>Clock In</Text>
//               </>
//             )}
//           </TouchableOpacity>
//         ) : (
//           <TouchableOpacity
//             style={[styles.clockOutButton, clockOutLoading ? styles.buttonDisabled : {}]}
//             onPress={handleClockOut}
//             disabled={clockOutLoading || hasCameraPermission === false}
//           >
//             {clockOutLoading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <>
//                 <Ionicons name="exit-outline" size={28} color="#fff" />
//                 <Text style={styles.clockOutButtonText}>Clock Out</Text>
//               </>
//             )}
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   outerContainer: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f8f9fa',
//   },
//   cameraContainer: {
//     backgroundColor: '#fff',
//     padding: 10,
//     borderRadius: 12,
//     elevation: 2,
//     borderWidth: 2,
//     borderColor: 'skyblue',
//     marginBottom: 10,
//   },
//   infoContainer: {
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 12,
//     alignItems: 'center',
//     elevation: 2,
//     borderWidth: 2,
//     borderColor: 'skyblue',
//     marginBottom: 10,
//   },
//   buttonContainer: {
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 12,
//     alignItems: 'center',
//     elevation: 2,
//     borderWidth: 2,
//     borderColor: 'skyblue',
//   },
//   camera: {
//     width: '50%',
//     height: 200,
//     borderRadius: 8,
//     overflow: 'hidden',
//     alignSelf:'center',
//     marginLeft:'auto', 
//     marginRight:'auto',
//     justifyContent: 'flex-end',
//   },
//   cameraControls: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     padding: 20,
//   },
//   flipButton: {
//     alignSelf: 'flex-end',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     borderRadius: 20,
//     padding: 10,
//   },
//   cameraPlaceholder: {
//     backgroundColor: '#e0e0e0',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   cameraPlaceholderText: {
//     color: '#666',
//     textAlign: 'center',
//     marginTop: 10,
//   },
//   permissionButton: {
//     marginTop: 15,
//     backgroundColor: '#2196F3',
//     padding: 10,
//     borderRadius: 5,
//   },
//   permissionButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   clockInButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: 150,
//     height: 150,
//     borderRadius: 75,
//     borderWidth: 2,
//     borderColor: 'skyblue',
//     backgroundColor: '#2196F3',
//     padding: 10,
//   },
//   clockOutButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: 150,
//     height: 150,
//     borderRadius: 75,
//     borderWidth: 2,
//     borderColor: 'black',
//     backgroundColor: '#f44336',
//     padding: 10,
//   },
//   buttonDisabled: {
//     opacity: 0.6,
//   },
//   clockInButtonText: {
//     marginLeft: 10,
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#fff',
//   },
//   clockOutButtonText: {
//     marginLeft: 10,
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#fff',
//   },
//   timeLabel: {
//     fontSize: 19,
//     color: '#555',
//     marginBottom: 5,
//   },
//   timeText: {
//     fontSize: 20,
//     color: '#222',
//     marginBottom: 10,
//   },
//   timerText: {
//     fontSize: 16,
//     color: 'skyblue',
//     marginBottom: 10,
//   },
//   locationText: {
//     fontSize: 14,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 5,
//   },
//   errorText: {
//     fontSize: 14,
//     color: '#f44336',
//     textAlign: 'center',
//   },
//   placeholderText: {
//     fontSize: 16,
//     color: '#888',
//     textAlign: 'center',
//   },
// });

// export default ClockIn;



//  code for open mobile camera but photo capture perfectly

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
  Dimensions,
  Image,
  ScrollView,SafeAreaView,
} from 'react-native';
import ImageResizer from 'react-native-image-resizer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchCamera } from 'react-native-image-picker';

//const ERP_BASE_URL = 'https://erpnextcloud.cbditsolutions.com';
//const ERP_BASE_URL = 'https://mpda.in';
const LOCATION_CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes cache validity
const { width: windowWidth } = Dimensions.get('window');

const ClockIn = ({ sid, employeeData,erpUrl }) => {
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [clockInSeconds, setClockInSeconds] = useState(0);
  const [clockInLoading, setClockInLoading] = useState(false);
  const [clockOutLoading, setClockOutLoading] = useState(false);
  const [locationCache, setLocationCache] = useState(null);
  const [clockInLocation, setClockInLocation] = useState(null);
  const [clockOutLocation, setClockOutLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [clockInLocationName, setClockInLocationName] = useState('Fetching location...');
  const [clockOutLocationName, setClockOutLocationName] = useState('Fetching location...');
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [currentStatus, setCurrentStatus] = useState(null); // 'IN', 'OUT', or null
  const [lastCheckinRecord, setLastCheckinRecord] = useState(null);
  const [photoUri, setPhotoUri] = useState(null);
  
  const clockInTimerRef = useRef(null);
  const ERP_BASE_URL =erpUrl;

  // Fetch latest checkin status from server
  const fetchLatestCheckinStatus = async () => {
    try {
      const response = await fetch(
        `${ERP_BASE_URL}/api/resource/Employee Checkin?fields=["name","employee","log_type","time","latitude","longitude","custom_area_name","custom_photo"]&filters=[["employee","=","${employeeData.name}"]]&order_by=time desc&limit=1`,
        {
          headers: {
            Cookie: `sid=${sid}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch checkin status');
      }

      const data = await response.json();
      if (data.data && data.data.length > 0) {
        const latestCheckin = data.data[0];
        setLastCheckinRecord(latestCheckin);
        setCurrentStatus(latestCheckin.log_type);
        return latestCheckin;
      }
      setCurrentStatus(null);
      return null;
    } catch (error) {
      console.error('Error fetching checkin status:', error);
      setCurrentStatus(null);
      return null;
    }
  };

  // Request camera permission
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs access to your camera for attendance verification.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.error('Camera permission error:', err);
        return false;
      }
    }
    return true;
  };

  // Take photo using native camera
//   const takePhoto = async () => {
//     try {
//       const hasPermission = await requestCameraPermission();
//       if (!hasPermission) {
//         throw new Error('Camera permission denied');
//       }

//       const options = {
        


//         mediaType: 'photo',
//         quality: 0.3, // More aggressive compression
//         maxWidth: 800, // Limits image width
//         maxHeight: 800, // Limits image height
//         cameraType: 'back',
//         saveToPhotos: false,
//         orientation: 'portrait', // Force portrait orientation
//         fixOrientation: true, // Correct the orientation when saved
//         forceUpOrientation: true, // Ensure proper orientation

//       };

//       const result = await launchCamera(options);
      
//       if (result.didCancel) {
//         throw new Error('User cancelled camera');
//       } else if (result.errorCode) {
//         throw new Error(`Camera Error: ${result.errorMessage}`);
//       } else if (result.assets && result.assets.length > 0) {
//         const uri = result.assets[0].uri;
//         setPhotoUri(uri);
//         return uri;
//       } else {
//         throw new Error('No photo captured');
//       }
//     } catch (error) {
//       console.error('Error taking photo:', error);
//       throw error;
//     }
//   };

//   const uploadAndAttachPhoto = async (checkinName, photoUri) => {
//     if (!photoUri) {
//       console.log('No photo to upload');
//       throw new Error('No photo to upload');
//     }
    
//     try {
//       // Step 1: Upload the file
//       const formData = new FormData();
//       formData.append('file', {
//         uri: photoUri,
//         name: `attendance_${checkinName}.jpg`,
//         type: 'image/jpeg',
//       });
//       formData.append('is_private', 0);
//       formData.append('folder', 'Home/Attachments');
//       formData.append('doctype', 'Employee Checkin');
//       formData.append('docname', checkinName);
//       formData.append('fieldname', 'custom_photo');

//       console.log('Uploading photo to file list...');
      
//       const uploadResponse = await fetch(`${ERP_BASE_URL}/api/method/upload_file`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           'Accept': 'application/json',
//           'Cookie': `sid=${sid}`,
//         },
//         body: formData,
//       });

//       if (!uploadResponse.ok) {
//         const errText = await uploadResponse.text();
//         throw new Error(`Failed to upload photo: ${errText}`);
//       }

//       const uploadResult = await uploadResponse.json();
//       console.log('Photo upload to file list successful:', uploadResult.message);
      
//       // Step 2: Explicitly update the checkin record with the photo attachment
//       const updateResponse = await fetch(`${ERP_BASE_URL}/api/resource/Employee Checkin/${checkinName}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Cookie': `sid=${sid}`,
//         },
//         body: JSON.stringify({
//           custom_photo: uploadResult.message.file_url
//         }),
//       });

//       if (!updateResponse.ok) {
//         const errText = await updateResponse.text();
//         throw new Error(`Failed to update checkin record: ${errText}`);
//       }

//       return true;
//     } catch (error) {
//       console.error('Error in photo upload:', error);
//       throw error;
//     }
//   };





const takePhoto = async () => {
  try {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      throw new Error('Camera permission denied');
    }

    const options = {
      mediaType: 'photo',
      quality: 0.3,
      maxWidth: 800,
      maxHeight: 800,
      cameraType: 'back',
      saveToPhotos: false,
      orientation: 'portrait',
      fixOrientation: true,
      forceUpOrientation: true,
      noData: true,
    };

    const result = await launchCamera(options);
    
    if (result.didCancel) {
      throw new Error('User cancelled camera');
    } else if (result.errorCode) {
      throw new Error(`Camera Error: ${result.errorMessage}`);
    } else if (result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      
      // Resize and force portrait orientation
      const resizedImage = await ImageResizer.createResizedImage(
        uri,
        800, // width
        1000, // height (greater than width to ensure portrait)
        'JPEG',
        80, // quality
        0, // rotation
        null, // outputPath (null for cache directory)
        false, // keepMeta
        { mode: 'cover', onlyScaleDown: true } // options
      );
      
      setPhotoUri(resizedImage.uri);
      return resizedImage.uri;
    } else {
      throw new Error('No photo captured');
    }
  } catch (error) {
    console.error('Error taking photo:', error);
    throw error;
  }
};

// Modified uploadAndAttachPhoto function
const uploadAndAttachPhoto = async (checkinName, photoUri) => {
  if (!photoUri) {
    console.log('No photo to upload');
    throw new Error('No photo to upload');
  }
  
  try {
    // First verify image orientation
    const { width, height } = await new Promise((resolve, reject) => {
      Image.getSize(photoUri, (width, height) => {
        resolve({ width, height });
      }, reject);
    });

    // Ensure portrait orientation (height > width)
    if (width > height) {
      // If landscape, rotate it
      const rotatedImage = await ImageResizer.createResizedImage(
        photoUri,
        height, // new width
        width, // new height
        'JPEG',
        80,
        90, // rotate 90 degrees
        null,
        false,
        { mode: 'cover', onlyScaleDown: true }
      );
      photoUri = rotatedImage.uri;
    }

    // Proceed with upload
    const formData = new FormData();
    formData.append('file', {
      uri: photoUri,
      name: `attendance_${checkinName}.jpg`,
      type: 'image/jpeg',
    });
    formData.append('is_private', 0);
    formData.append('folder', 'Home/Attachments');
    formData.append('doctype', 'Employee Checkin');
    formData.append('docname', checkinName);
    formData.append('fieldname', 'custom_photo');

    const uploadResponse = await fetch(`${ERP_BASE_URL}/api/method/upload_file`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
        'Cookie': `sid=${sid}`,
      },
      body: formData,
    });

    if (!uploadResponse.ok) {
      const errText = await uploadResponse.text();
      throw new Error(`Failed to upload photo: ${errText}`);
    }

    const uploadResult = await uploadResponse.json();
    
    // Update the checkin record
    const updateResponse = await fetch(`${ERP_BASE_URL}/api/resource/Employee Checkin/${checkinName}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `sid=${sid}`,
      },
      body: JSON.stringify({
        custom_photo: uploadResult.message.file_url
      }),
    });

    if (!updateResponse.ok) {
      const errText = await updateResponse.text();
      throw new Error(`Failed to update checkin record: ${errText}`);
    }

    return true;
  } catch (error) {
    console.error('Error in photo upload:', error);
    throw error;
  }
};






  // Fetch previous checkin records (for getting both IN and OUT records)
  const fetchCheckinRecords = async () => {
    try {
      const response = await fetch(
        `${ERP_BASE_URL}/api/resource/Employee Checkin?fields=["name","employee","log_type","time","latitude","longitude","custom_area_name","custom_photo"]&filters=[["employee","=","${employeeData.name}"]]&order_by=time desc&limit=2`,
        {
          headers: {
            Cookie: `sid=${sid}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch checkin records');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching checkin records:', error);
      return [];
    }
  };

  // Extract time from datetime string (HH:MM AM/PM format)
  const extractTimeFromDateTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    try {
      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) {
        const parts = dateTimeString.split(/[- :T]/);
        const fixedDate = new Date(
          parts[0],
          parts[1] - 1,
          parts[2],
          parts[3],
          parts[4],
          parts[5] || 0
        );
        if (!isNaN(fixedDate.getTime())) {
          return fixedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return 'Invalid time';
      }
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.error('Error parsing time:', error);
      return 'Invalid time';
    }
  };

  // Calculate time difference in HH:MM:SS format
  const calculateTimeDifference = (startTime, endTime) => {
    if (!startTime || !endTime) return '00:00:00';
    
    try {
      let start = new Date(startTime);
      let end = new Date(endTime);
      
      if (isNaN(start.getTime())) {
        // Try alternative parsing if standard parsing fails
        const parts = startTime.split(/[- :T]/);
        const fixedStart = new Date(
          parts[0],
          parts[1] - 1,
          parts[2],
          parts[3],
          parts[4],
          parts[5] || 0
        );
        if (!isNaN(fixedStart.getTime())) {
          start = fixedStart;
        }
      }

      if (isNaN(end.getTime())) {
        const parts = endTime.split(/[- :T]/);
        const fixedEnd = new Date(
          parts[0],
          parts[1] - 1,
          parts[2],
          parts[3],
          parts[4],
          parts[5] || 0
        );
        if (!isNaN(fixedEnd.getTime())) {
          end = fixedEnd;
        }
      }
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return '00:00:00';
      }
      
      const diffMs = end - start;
      const diffSec = Math.floor(diffMs / 1000);
      const h = Math.floor(diffSec / 3600).toString().padStart(2, '0');
      const m = Math.floor((diffSec % 3600) / 60).toString().padStart(2, '0');
      const s = (diffSec % 60).toString().padStart(2, '0');
      
      return `${h}:${m}:${s}`;
    } catch (error) {
      console.error('Error calculating time difference:', error);
      return '00:00:00';
    }
  };

  // Calculate elapsed seconds from clock-in time
  const calculateElapsedSeconds = (clockInTime) => {
    if (!clockInTime) return 0;
    
    try {
      const clockInDate = new Date(clockInTime);
      if (isNaN(clockInDate.getTime())) {
        // Try alternative parsing if standard parsing fails
        const parts = clockInTime.split(/[- :T]/);
        const fixedDate = new Date(
          parts[0],
          parts[1] - 1,
          parts[2],
          parts[3],
          parts[4],
          parts[5] || 0
        );
        if (!isNaN(fixedDate.getTime())) {
          return Math.floor((new Date() - fixedDate) / 1000);
        }
        return 0;
      }
      return Math.floor((new Date() - clockInDate) / 1000);
    } catch (error) {
      console.error('Error calculating elapsed seconds:', error);
      return 0;
    }
  };

  // Refresh data
  const refreshData = async () => {
    try {
      const latestCheckin = await fetchLatestCheckinStatus();
      
      if (latestCheckin) {
        if (latestCheckin.log_type === 'IN') {
          setClockInTime(latestCheckin.time);
          const elapsedSeconds = calculateElapsedSeconds(latestCheckin.time);
          setClockInSeconds(elapsedSeconds);
          startClockInTimer();
          setClockOutTime(null);
          
          if (latestCheckin.latitude && latestCheckin.longitude) {
            const coords = {
              latitude: latestCheckin.latitude,
              longitude: latestCheckin.longitude,
              accuracy: 0
            };
            setClockInLocation(coords);
          }
          
          // Set location name from custom_area_name
          if (latestCheckin.custom_area_name) {
            setClockInLocationName(latestCheckin.custom_area_name);
          } else {
            setClockInLocationName('Location not specified');
          }
        } else if (latestCheckin.log_type === 'OUT') {
          const records = await fetchCheckinRecords();
          if (records.length > 0) {
            setClockOutTime(records[0].time);
            
            const inRecord = records.find(r => r.log_type === 'IN');
            if (inRecord) {
              setClockInTime(inRecord.time);
            }
            
            // Set location name from custom_area_name
            if (records[0].custom_area_name) {
              setClockOutLocationName(records[0].custom_area_name);
            } else {
              setClockOutLocationName('Location not specified');
            }
          }
        }
      } else {
        setClockInTime(null);
        setClockOutTime(null);
        setCurrentStatus(null);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      Alert.alert('Error', 'Failed to refresh data');
    }
  };

  // Load saved data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // First fetch the latest status from server
        const latestCheckin = await fetchLatestCheckinStatus();
        
        if (latestCheckin) {
          if (latestCheckin.log_type === 'IN') {
            // If latest is IN, show clock out button and timer
            setClockInTime(latestCheckin.time);
            const elapsedSeconds = calculateElapsedSeconds(latestCheckin.time);
            setClockInSeconds(elapsedSeconds);
            startClockInTimer();
            setClockOutTime(null);
            
            // Set location if available
            if (latestCheckin.latitude && latestCheckin.longitude) {
              const coords = {
                latitude: latestCheckin.latitude,
                longitude: latestCheckin.longitude,
                accuracy: 0
              };
              setClockInLocation(coords);
            }
            
            // Set location name from custom_area_name
            if (latestCheckin.custom_area_name) {
              setClockInLocationName(latestCheckin.custom_area_name);
            } else {
              setClockInLocationName('Location not specified');
            }
          } else if (latestCheckin.log_type === 'OUT') {
            // If latest is OUT, show clock in button and fetch both records
            const records = await fetchCheckinRecords();
            if (records.length > 0) {
              // First record is the OUT
              setClockOutTime(records[0].time);
              
              // Find the previous IN record
              const inRecord = records.find(r => r.log_type === 'IN');
              if (inRecord) {
                setClockInTime(inRecord.time);
              }
              
              // Set location name from custom_area_name
              if (records[0].custom_area_name) {
                setClockOutLocationName(records[0].custom_area_name);
              } else {
                setClockOutLocationName('Location not specified');
              }
            }
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
    
    return () => {
      if (clockInTimerRef.current) {
        clearInterval(clockInTimerRef.current);
      }
    };
  }, [employeeData.name]);

  const startClockInTimer = () => {
    if (clockInTimerRef.current) {
      clearInterval(clockInTimerRef.current);
    }
    
    // Update immediately to ensure no delay
    if (clockInTime) {
      const elapsedSeconds = calculateElapsedSeconds(clockInTime);
      setClockInSeconds(elapsedSeconds);
    }
    
    // Then start the interval
    clockInTimerRef.current = setInterval(() => {
      setClockInSeconds(prev => prev + 1);
    }, 1000);
  };

  // Timer effect
  useEffect(() => {
    if (currentStatus === 'IN' && clockInTime) {
      startClockInTimer();
    } else {
      if (clockInTimerRef.current) {
        clearInterval(clockInTimerRef.current);
      }
      setClockInSeconds(0);
    }
  }, [currentStatus, clockInTime]);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location for attendance tracking.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        return false;
      }
    }
    return true;
  };

  const getQuickLocation = async () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => resolve(position.coords),
        error => reject(error),
        {
          enableHighAccuracy: false,
          timeout: 3000,
          maximumAge: 30000
        }
      );
    });
  };

  const getLocationWithFallback = async (isClockIn) => {
    setLocationError(null);
    if (isClockIn) {
      setClockInLocationName('Getting location...');
    } else {
      setClockOutLocationName('Getting location...');
    }
    
    try {
      const coords = await getQuickLocation();
      setLocationCache({ coords, timestamp: Date.now() });
      return coords;
    } catch (error) {
      if (locationCache && (Date.now() - locationCache.timestamp) < LOCATION_CACHE_EXPIRY) {
        return locationCache.coords;
      }
      
      throw new Error('Turn on your location.');
    }
  };

  const formatTimeForERP = (date) => {
    return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const handleClockIn = async () => {
    if (clockInLoading) return;

    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Permission denied', 'Location permission is required to clock in.');
      return;
    }

    setClockInLoading(true);
    setLocationError(null);
    setPhotoUri(null);
    
    try {
      // Take photo first - if this fails, it will throw an error
      const photoPath = await takePhoto();
      
      // Only proceed if photo was captured successfully
      const coords = await getLocationWithFallback(true);
      
      const now = new Date();
      const timeString = formatTimeForERP(now);
      
      const res = await fetch(`${ERP_BASE_URL}/api/resource/Employee Checkin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `sid=${sid}`,
        },
        body: JSON.stringify({
          employee: employeeData.name,
          log_type: 'IN',
          time: timeString,
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Failed to clock in: ${errText}`);
      }

      const responseData = await res.json();
      const checkinName = responseData.data.name;

      // Upload and attach photo - if this fails, it will throw an error
      await uploadAndAttachPhoto(checkinName, photoPath);

      // After successful clock in, fetch the latest status to ensure UI is in sync
      const latestCheckin = await fetchLatestCheckinStatus();
      
      if (latestCheckin && latestCheckin.log_type === 'IN') {
        setClockInTime(latestCheckin.time);
        const elapsedSeconds = calculateElapsedSeconds(latestCheckin.time);
        setClockInSeconds(elapsedSeconds);
        startClockInTimer();
        
        if (latestCheckin.latitude && latestCheckin.longitude) {
          const serverCoords = {
            latitude: latestCheckin.latitude,
            longitude: latestCheckin.longitude,
            accuracy: 0
          };
          setClockInLocation(serverCoords);
        }
        
        // Set location name from custom_area_name
        if (latestCheckin.custom_area_name) {
          setClockInLocationName(latestCheckin.custom_area_name);
        } else {
          setClockInLocationName('Location not specified');
        }
      }
      
      setClockOutTime(null);
      
      Alert.alert('Success', 'Clock-in recorded successfully.');
    } catch (error) {
      setLocationError(error.message);
      Alert.alert('Error', error.message);
    } finally {
      setClockInLoading(false);
    }
  };

  const handleClockOut = async () => {
    if (clockOutLoading) return;

    setClockOutLoading(true);
    setLocationError(null);
    setPhotoUri(null);
    
    try {
      // Take photo first - if this fails, it will throw an error
      const photoPath = await takePhoto();
      
      // Only proceed if photo was captured successfully
      const coords = await getLocationWithFallback(false);
      
      const now = new Date();
      const timeString = formatTimeForERP(now);
      
      const res = await fetch(`${ERP_BASE_URL}/api/resource/Employee Checkin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `sid=${sid}`,
        },
        body: JSON.stringify({
          employee: employeeData.name,
          log_type: 'OUT',
          time: timeString,
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Failed to clock out: ${errText}`);
      }

      const responseData = await res.json();
      const checkinName = responseData.data.name;

      // Upload and attach photo - if this fails, it will throw an error
      await uploadAndAttachPhoto(checkinName, photoPath);

      // After successful clock out, fetch the latest status to ensure UI is in sync
      const latestCheckin = await fetchLatestCheckinStatus();
      
      if (latestCheckin && latestCheckin.log_type === 'OUT') {
        setClockOutTime(latestCheckin.time);
        setClockOutLocation({
          latitude: latestCheckin.latitude,
          longitude: latestCheckin.longitude,
          accuracy: 0
        });
        
        // Set location name from custom_area_name
        if (latestCheckin.custom_area_name) {
          setClockOutLocationName(latestCheckin.custom_area_name);
        } else {
          setClockOutLocationName('Location not specified');
        }
      }
      
      Alert.alert('Success', 'Clock-out recorded successfully.');
    } catch (error) {
      setLocationError(error.message);
      
      if (locationCache && (Date.now() - locationCache.timestamp) < LOCATION_CACHE_EXPIRY * 2) {
        const useCached = await new Promise(resolve => {
          Alert.alert(
            'Location Problem',
            'please Turn on Location',
            [
              { text: 'Cancel', onPress: () => resolve(false), style: 'cancel' },
              { text: 'Use Cached', onPress: () => resolve(true) }
            ]
          );
        });
        
        if (useCached) {
          // Take photo again even when using cached location
          const cachedPhotoPath = await takePhoto();
          
          const now = new Date();
          const timeString = formatTimeForERP(now);
          
          const res = await fetch(`${ERP_BASE_URL}/api/resource/Employee Checkin`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Cookie: `sid=${sid}`,
            },
            body: JSON.stringify({
              employee: employeeData.name,
              log_type: 'OUT',
              time: timeString,
              latitude: locationCache.coords.latitude,
              longitude: locationCache.coords.longitude,
              accuracy: locationCache.coords.accuracy,
            }),
          });

          if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Failed to clock out: ${errText}`);
          }

          const responseData = await res.json();
          const checkinName = responseData.data.name;

          // Upload and attach photo - if this fails, it will throw an error
          await uploadAndAttachPhoto(checkinName, cachedPhotoPath);

          setClockOutTime(now);
          setClockOutLocation(locationCache.coords);
          setClockOutLocationName('Location not specified'); // Default since we don't have area name
          Alert.alert('Success', 'Clock-out recorded with cached location.');
          return;
        }
      }
      
      Alert.alert('Error', error.message);
    } finally {
      setClockOutLoading(false);
    }
  };

  if (isLoadingData) {
    return (
        
      <View style={[styles.outerContainer, { justifyContent: 'center', alignItems: 'center', }]}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={{ marginTop: 10 }}>Loading attendance data...</Text>
      </View>
      
    );
  }

  return (
    
   
    <View style={styles.outerContainer}>
      {/* Preview of captured photo */}
      {photoUri && (
        <View style={styles.photoPreviewContainer}>
          <Image source={{ uri: photoUri }} style={styles.photoPreview} />
        </View>
      )}

      {/* Info Container */}
      <View style={styles.infoContainer}>
        {currentStatus === 'IN' && clockInTime ? (
          <>
            <Text style={styles.timeLabel}>Clock In Time:</Text>
            <Text style={styles.timeText}>
              {extractTimeFromDateTime(clockInTime)}
            </Text>
            <Text style={styles.timerText}>Timer: {formatTime(clockInSeconds)}</Text>
            {clockInLocationName && (
              <Text style={styles.locationText}>
                {clockInLocationName}
              </Text>
            )}
          </>
        ) : currentStatus === 'OUT' && clockOutTime ? (
          <>
            <Text style={styles.timeLabel}>Clock Out Time:</Text>
            <Text style={styles.timeText}>
              {extractTimeFromDateTime(clockOutTime)}
            </Text>
            {clockInTime && (
              <>
                <Text style={styles.timerText}>Total Time: {calculateTimeDifference(clockInTime, clockOutTime)}</Text>
              </>
            )}
            {clockOutLocationName && (
              <Text style={styles.locationText}>
                {clockOutLocationName}
              </Text>
            )}
          </>
        ) : (
          <Text style={styles.placeholderText}>No attendance record yet</Text>
        )}
        
        {locationError && (
          <Text style={styles.errorText}>{locationError}</Text>
        )}
      </View>

      {/* Button Container */}
      <View style={styles.buttonContainer}>
        {currentStatus !== 'IN' ? (
          <TouchableOpacity
            style={[styles.clockInButton, clockInLoading ? styles.buttonDisabled : {}]}
            onPress={handleClockIn}
            disabled={clockInLoading}
          >
            {clockInLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="time-outline" size={28} color="#fff" />
                <Text style={styles.clockInButtonText}>Clock In</Text>
              </>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.clockOutButton, clockOutLoading ? styles.buttonDisabled : {}]}
            onPress={handleClockOut}
            disabled={clockOutLoading}
          >
            {clockOutLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="exit-outline" size={28} color="#fff" />
                <Text style={styles.clockOutButtonText}>Clock Out</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
    
    
  );
};

// // const styles = StyleSheet.create({
// //   outerContainer: {
// //     flex: 1,
// //     padding: 20,
// //     //backgroundColor: '#f8f9fa',
// //   },
// //   photoPreviewContainer: {
// //     backgroundColor: '#fff',
// //     padding: 10,
// //     borderRadius: 12,
// //     elevation: 2,
// //     borderWidth: 2,
// //     borderColor: 'skyblue',
// //     marginBottom: 10,
// //     alignItems: 'center',
// //   },
// //   photoPreview: {
// //     width: '50%',
// //     height: 200,
// //     borderRadius: 8,
// //     marginLeft:'auto', 
// //     marginRight:'auto',
// //      justifyContent: 'flex-end',
// //   },
// //   infoContainer: {
// //     backgroundColor: '#fff',
// //     padding: 20,
// //     borderRadius: 12,
// //     alignItems: 'center',
// //     elevation: 2,
// //     borderWidth: 2,
// //     borderColor: 'skyblue',
// //     marginBottom: 10,
// //   },
// //   buttonContainer: {
// //     backgroundColor: '#fff',
// //     padding: 20,
// //     borderRadius: 12,
// //     alignItems: 'center',
// //     elevation: 2,
// //     borderWidth: 2,
// //     borderColor: 'skyblue',
// //   },
// //   clockInButton: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     width: 150,
// //     height: 150,
// //     borderRadius: 75,
// //     borderWidth: 2,
// //     borderColor: 'skyblue',
// //     backgroundColor: '#2196F3',
// //     padding: 10,
// //   },
// //   clockOutButton: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     width: 150,
// //     height: 150,
// //     borderRadius: 75,
// //     borderWidth: 2,
// //     borderColor: 'black',
// //     backgroundColor: '#f44336',
// //     padding: 10,
// //   },
// //   buttonDisabled: {
// //     opacity: 0.6,
// //   },
// //   clockInButtonText: {
// //     marginLeft: 10,
// //     fontSize: 18,
// //     fontWeight: '600',
// //     color: '#fff',
// //   },
// //   clockOutButtonText: {
// //     marginLeft: 10,
// //     fontSize: 18,
// //     fontWeight: '600',
// //     color: '#fff',
// //   },
// //   timeLabel: {
// //     fontSize: 19,
// //     color: '#555',
// //     marginBottom: 5,
// //   },
// //   timeText: {
// //     fontSize: 20,
// //     color: '#222',
// //     marginBottom: 10,
// //   },
// //   timerText: {
// //     fontSize: 16,
// //     color: 'skyblue',
// //     marginBottom: 10,
// //   },
// //   locationText: {
// //     fontSize: 14,
// //     color: '#666',
// //     textAlign: 'center',
// //     marginBottom: 5,
// //   },
// //   errorText: {
// //     fontSize: 14,
// //     color: '#f44336',   
// //     textAlign: 'center',
// //   },
// //   placeholderText: {
// //     fontSize: 16,
// //     color: '#888',
// //     textAlign: 'center',
// //   },
// // });

// // export default ClockIn;


const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    
    padding: 20,
    //backgroundColor: 'blue'  , // light blueish background
  },
  photoPreviewContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 12,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'skyblue',
    marginBottom: 10,
    alignItems: 'center',
  },
  photoPreview: {
    width: '50%',
    height: 200,
    borderRadius: 8,
    marginLeft:'auto', 
    marginRight:'auto',
     justifyContent: 'flex-end',
  },
  infoContainer: {
   backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 4,
    borderWidth: 1,
    borderColor: '#90CAF9',
    marginBottom: 20,
  },
  buttonContainer: {
   backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 4,
    borderWidth: 1,
    borderColor: '#90CAF9',
  },
  clockInButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    height: 140,
    borderRadius: 80,
    
    backgroundColor: '#2196F3',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    borderWidth: 2,
    borderColor: 'skyblue',
  },
  clockOutButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    height: 140,
    borderRadius: 80,
    backgroundColor: '#f44336', // red
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    borderWidth: 2,
    borderColor: '#B71C1C',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  clockInButtonText: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  clockOutButtonText: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  timeLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#37474F',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#263238',
    marginBottom: 10,
  },
  timerText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#0288D1',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#607D8B',
    textAlign: 'center',
    marginBottom: 4,
  },
  errorText: {
    fontSize: 14,
    color: '#D32F2F',
    textAlign: 'center',
    marginTop: 6,
  },
  placeholderText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#757575',
    textAlign: 'center',
  },
});

export default ClockIn;

