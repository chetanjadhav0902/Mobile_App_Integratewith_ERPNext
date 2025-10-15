

//// logout button with section

// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import moment from 'moment';

// import HomeScreen from './HomeScreen';
// import ProfileScreen from './ProfileScreen';
// import SettingsScreen from './SettingsScreen';
// import NotificationModal from '../components/NotificationModal';


// const Tab = createBottomTabNavigator();
// const ERP_BASE_URL = 'https://erpnextcloud.cbditsolutions.com';

// const LogoutScreen = ({ route }) => {
//   const navigation = useNavigation();
//   const [showLogoutModal, setShowLogoutModal] = useState(false);


  

//   useEffect(() => {
//     // Show modal when this screen is focused
//     const unsubscribe = navigation.addListener('focus', () => {
//       setShowLogoutModal(true);
//     });
//     return unsubscribe;
//   }, [navigation]);

//   const handleLogout = async () => {
//     await AsyncStorage.multiRemove(['isLoggedIn', 'sid', 'employeeData']);
//     navigation.replace('Login');
//   };

//   const handleCancel = () => {
//     setShowLogoutModal(false);
//     navigation.navigate('Home');
//   };

//   return (
//     <View style={styles.center}>
//       <Modal
//         animationType="fade"
//         transparent={true}
//         visible={showLogoutModal}
//         onRequestClose={handleCancel}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <Text style={styles.modalTitle}>Logout Confirmation</Text>
//             <Text style={styles.modalText}>Are you sure you want to logout?</Text>
//             <View style={styles.modalButtons}>
//               <TouchableOpacity
//                 style={[styles.modalButton, styles.cancelButton]}
//                 onPress={handleCancel}
//               >
//                 <Text style={styles.buttonText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.modalButton, styles.logoutButton]}
//                 onPress={handleLogout}
//               >
//                 <Text style={styles.buttonText}>Logout</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const EmployeeTabs = ({ route }) => {
//   const { employeeData, sid } = route.params;
//   const navigation = useNavigation();

//   const [showModal, setShowModal] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [hasUnread, setHasUnread] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);

//   // const fetchNotifications = async (markAsRead = false) => {
//   //   try {
//   //     //const url = `${ERP_BASE_URL}/api/resource/Leave Application?fields=["name","status","from_date","to_date","leave_type","creation"]&filters=[["employee","=","${employeeData.name}"],["status","in",["Approved","Rejected","Cancelled"]]]&order_by=creation desc`;
//   //     const url = `${ERP_BASE_URL}/api/resource/Leave Application?fields=["name","status","from_date","to_date","leave_type","creation","modified"]&filters=[["employee","=","${employeeData.name}"],["status","in",["Approved","Rejected","Cancelled"]]]&order_by=modified desc`;

//   //     const response = await fetch(url, {
//   //       method: 'GET',
//   //       headers: {
//   //         Cookie: `sid=${sid}`,
//   //       },
//   //     });

//   //     const json = await response.json();
//   //     const data = json?.data || [];

//   //     // const now = moment();
//   //     // const filtered = data.filter(item =>
//   //     //   moment(item.creation).isAfter(now.clone().subtract(2, 'days'))
//   //     // );

//   //     const today = moment().startOf('day');
//   //     const yesterday = moment().subtract(1, 'days').startOf('day');

//   //     const filtered = data.filter(item => {
//   //    const createdDate = moment(item.creation);
//   //   return createdDate.isSame(today, 'day') || createdDate.isSame(yesterday, 'day');
//   //   });

//   //     const formattedMessages = filtered.map((item) => ({
//   //       id: item.name,
//   //       message: `Your ${item.leave_type} leave from ${item.from_date} to ${item.to_date} has been ${item.status.toLowerCase()}.`,
//   //       status: item.status,
//   //       timestamp: moment(item.creation).format('MMM D, YYYY h:mm A'),
//   //     }));

//   //     const lastSeen = await AsyncStorage.getItem('lastSeenNotifications');
//   //     const newMessages = [];
//   //     for (const msg of formattedMessages) {
//   //       if (msg.id === lastSeen) break;
//   //       newMessages.push(msg);
//   //     }

//   //     setHasUnread(newMessages.length > 0);
//   //     setUnreadCount(newMessages.length);

//   //     if (markAsRead && formattedMessages.length > 0) {
//   //       await AsyncStorage.setItem('lastSeenNotifications', formattedMessages[0].id);
//   //       setHasUnread(false);
//   //       setUnreadCount(0);
//   //     }

//   //     setNotifications(formattedMessages);
//   //     if (markAsRead) setShowModal(true);
//   //   } catch (error) {
//   //     console.error('Failed to fetch notifications:', error);
//   //   }
//   // };


//   const fetchNotifications = async (markAsRead = false) => {
//   try {
//     const url = `${ERP_BASE_URL}/api/resource/Leave Application?fields=["name","status","from_date","to_date","leave_type","creation","modified"]&filters=[["employee","=","${employeeData.name}"],["status","in",["Approved","Rejected","Cancelled"]]]&order_by=modified desc`;

//     const response = await fetch(url, {
//       method: 'GET',
//       headers: {
//         Cookie: `sid=${sid}`,
//       },
//     });

//     const json = await response.json();
//     const data = json?.data || [];

//     const today = moment().startOf('day');
//     const yesterday = moment().subtract(1, 'days').startOf('day');

//     const filtered = data.filter(item => {
//       const modifiedDate = moment(item.modified);
//       return modifiedDate.isSame(today, 'day') || modifiedDate.isSame(yesterday, 'day');
//     });

//     const formattedMessages = filtered.map((item) => ({
//       id: item.name,
//       message: `Your ${item.leave_type} leave from ${item.from_date} to ${item.to_date} has been ${item.status.toLowerCase()}.`,
//       status: item.status,
//       timestamp: moment(item.modified).format('MMM D, YYYY h:mm A'),  // use modified
//     }));

//     const lastSeen = await AsyncStorage.getItem('lastSeenNotifications');
//     const newMessages = [];
//     for (const msg of formattedMessages) {
//       if (msg.id === lastSeen) break;
//       newMessages.push(msg);
//     }

//     setHasUnread(newMessages.length > 0);
//     setUnreadCount(newMessages.length);

//     if (markAsRead && formattedMessages.length > 0) {
//       await AsyncStorage.setItem('lastSeenNotifications', formattedMessages[0].id);
//       setHasUnread(false);
//       setUnreadCount(0);
//     }

//     setNotifications(formattedMessages);
//     if (markAsRead) setShowModal(true);
//   } catch (error) {
//     console.error('Failed to fetch notifications:', error);
//   }
// };


//   const markAllSeen = () => {
//     const updated = notifications.map((n) => ({ ...n, status: 'seen' }));
//     setNotifications(updated);
//   };

//   const deleteNotification = async (idToDelete) => {
//     const updated = notifications.filter(n => n.id !== idToDelete);
//     setNotifications(updated);
//   };

//   useEffect(() => {
//     fetchNotifications();
//     const interval = setInterval(() => {
//       fetchNotifications();
//     }, 15000);
//     return () => clearInterval(interval);
//   }, []);

//   const renderNotificationIcon = () => (
//     <TouchableOpacity
//       style={{ marginRight: 15 }}
//       onPress={() => fetchNotifications(true)}
//     >
//       <View>
//         <Ionicons
//           name={hasUnread ? 'notifications' : 'notifications-outline'}
//           size={24}
//           color={hasUnread ? 'red' : '#007bff'}
//         />
//         {hasUnread && (
//           <View style={styles.badge}>
//             <Text style={styles.badgeText}>{unreadCount}</Text>
//           </View>
//         )}
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <>
//       <Tab.Navigator
//         initialRouteName="Home"
//         screenOptions={({ route }) => ({
//           tabBarIcon: ({ focused, color, size }) => {
//             let iconName;
//             switch (route.name) {
//               case 'Home': iconName = focused ? 'home' : 'home-outline'; break;
//               case 'Profile': iconName = focused ? 'person-circle' : 'person-circle-outline'; break;
//               case  'Report': iconName = focused ? 'document-text' : 'document-text-outline'; break;
//               case 'Logout': iconName = focused ? 'log-out' : 'log-out-outline'; break;
//             }
//             return <Ionicons name={iconName} size={size} color={color} />;
//           },
//           tabBarActiveTintColor: '#007bff',
//           tabBarInactiveTintColor: 'gray',
//           headerShown: true,
//           tabBarStyle: {
//             backgroundColor: '#fff',
//             borderTopWidth: 0.5,
//             borderTopColor: '#ccc',
//           },
//           tabBarLabelStyle: {
//             fontSize: 12,
//             fontWeight: '600',
//           },
//           swipeEnabled: false,
//           })}
//       >
//         <Tab.Screen
//           name="Home"
//           component={HomeScreen}
//           initialParams={{ employeeData, sid }}
//           options={{
//             tabBarLabel: 'Home',
//             headerTitle: () => (
//               <View style={{ alignItems: 'center' }}>
//                 <Text style={{ fontWeight: 'bold', fontSize: 14, color: 'black' }}>
//                   {employeeData?.company || 'Company'}
//                 </Text>
//                 <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black' }}>
//                   Welcome, {employeeData?.employee_name || 'Employee'}
//                 </Text>
//               </View>
//             ),
//             headerTitleAlign: 'center',
//             headerRight: renderNotificationIcon,
//           }}
//         />
//         <Tab.Screen
//           name="Profile"
//           component={ProfileScreen}
//           initialParams={{ employeeData, sid }}
//           options={{
//             tabBarLabel: 'Profile',
//             headerTitle: 'My Profile',
//             headerRight: renderNotificationIcon,
            
//           }}
//         />
//         {/* <Tab.Screen
//           name="Settings"
//           component={SettingsScreen}
//           initialParams={{ employeeData, sid }}
//           options={{
//             tabBarLabel: 'Settings',
//             headerTitle: 'Settings',
//             headerRight: renderNotificationIcon,
//           }}
//         /> */}

//         <Tab.Screen
//   name="Report"
//   component={SettingsScreen} // Replace with ReportScreen if available
//   initialParams={{ employeeData, sid }}
//   options={{
//     tabBarLabel: 'Report',
//     headerTitle: 'Report',
//     headerRight: renderNotificationIcon,
//     tabBarIcon: ({ color, size }) => (
//       <Ionicons name="document-text-outline" size={size} color={color} />
//     ),
//   }}
// />
//         <Tab.Screen
//           name="Logout"
//           component={LogoutScreen}
//           initialParams={{ employeeData }}
//           options={{
//             tabBarLabel: 'Logout',
//             headerTitle: 'Logout',
//           }}
//         />
//       </Tab.Navigator>

//       <NotificationModal
//         visible={showModal}
//         onClose={() => setShowModal(false)}
//         notifications={notifications}
//         markAllSeen={markAllSeen}
//         onDelete={deleteNotification}
//       />
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f8f9fa',
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContainer: {
//     width: '80%',
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 20,
//     alignItems: 'center',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color:'black',
//   },
//   modalText: {
//     fontSize: 16,
//     marginBottom: 20,
//     textAlign: 'center',
//     color:'black',
//   },
//   modalButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//   },
//   modalButton: {
//     padding: 10,
//     borderRadius: 5,
//     width: '45%',
//     alignItems: 'center',
//   },
//   cancelButton: {
//     backgroundColor: '#ccc',
//   },
//   logoutButton: {
//     backgroundColor: '#dc3545',
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   badge: {
//     position: 'absolute',
//     right: -6,
//     top: -3,
//     backgroundColor: 'red',
//     borderRadius: 8,
//     paddingHorizontal: 4,
//     minWidth: 16,
//     height: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   badgeText: {
//     color: '#fff',
//     fontSize: 10,
//     fontWeight: 'bold',
//   },
// });

// export default EmployeeTabs;




import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';
import SettingsScreen from './SettingsScreen';
import NotificationModal from '../components/NotificationModal';

const Tab = createBottomTabNavigator();
// const ERP_BASE_URL = 'https://erpnextcloud.cbditsolutions.com';
//const ERP_BASE_URL = 'https://mpda.in';
//const ERP_BASE_URL = erpUrl;

const LogoutScreen = ({ route }) => {
  const navigation = useNavigation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setShowLogoutModal(true);
    });
    return unsubscribe;
  }, [navigation]);

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['isLoggedIn', 'sid', 'employeeData']);
    navigation.replace('Login');
  };

  const handleCancel = () => {
    setShowLogoutModal(false);
    navigation.navigate('Home');
  };

  return (
    <View style={styles.center}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={showLogoutModal}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Logout Confirmation</Text>
            <Text style={styles.modalText}>Are you sure you want to logout?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.logoutButton]}
                onPress={handleLogout}
              >
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};  

const EmployeeTabs = ({ route }) => {
  const { employeeData, sid ,erpUrl} = route.params;
  const ERP_BASE_URL = erpUrl;
  const navigation = useNavigation();

  const [showModal, setShowModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Location Permission Logic
  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission Required',
              message:
                'This app needs access to your location to track attendance or nearby zones.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.warn('Location permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };
    requestLocationPermission();
  }, []);

  const fetchNotifications = async (markAsRead = false) => {
    try {
      const url = `${ERP_BASE_URL}/api/resource/Leave Application?fields=["name","status","from_date","to_date","leave_type","creation","modified"]&filters=[["employee","=","${employeeData.name}"],["status","in",["Approved","Rejected","Cancelled"]]]&order_by=modified desc`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Cookie: `sid=${sid}`,
        },
      });

      const json = await response.json();
      const data = json?.data || [];

      const today = moment().startOf('day');
      const yesterday = moment().subtract(1, 'days').startOf('day');

      const filtered = data.filter(item => {
        const modifiedDate = moment(item.modified);
        return modifiedDate.isSame(today, 'day') || modifiedDate.isSame(yesterday, 'day');
      });

      const formattedMessages = filtered.map((item) => ({
        id: item.name,
        message: `Your ${item.leave_type} leave from ${item.from_date} to ${item.to_date} has been ${item.status.toLowerCase()}.`,
        status: item.status,
        timestamp: moment(item.modified).format('MMM D, YYYY h:mm A'),
      }));

      const lastSeen = await AsyncStorage.getItem('lastSeenNotifications');
      const newMessages = [];
      for (const msg of formattedMessages) {
        if (msg.id === lastSeen) break;
        newMessages.push(msg);
      }

      setHasUnread(newMessages.length > 0);
      setUnreadCount(newMessages.length);

      if (markAsRead && formattedMessages.length > 0) {
        await AsyncStorage.setItem('lastSeenNotifications', formattedMessages[0].id);
        setHasUnread(false);
        setUnreadCount(0);
      }

      setNotifications(formattedMessages);
      if (markAsRead) setShowModal(true);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const markAllSeen = () => {
    const updated = notifications.map((n) => ({ ...n, status: 'seen' }));
    setNotifications(updated);
  };

  const deleteNotification = async (idToDelete) => {
    const updated = notifications.filter(n => n.id !== idToDelete);
    setNotifications(updated);
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => {
      fetchNotifications();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const renderNotificationIcon = () => (
    <TouchableOpacity
      style={{ marginRight: 15 }}
      onPress={() => fetchNotifications(true)}
    >
      <View>
        <Ionicons
          name={hasUnread ? 'notifications' : 'notifications-outline'}
          size={24}
          color={hasUnread ? 'red' : '#007bff'}
        />
        {hasUnread && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            switch (route.name) {
              case 'Home': iconName = focused ? 'home' : 'home-outline'; break;
              case 'Profile': iconName = focused ? 'person-circle' : 'person-circle-outline'; break;
              case 'Report': iconName = focused ? 'document-text' : 'document-text-outline'; break;
              case 'Logout': iconName = focused ? 'log-out' : 'log-out-outline'; break;
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007bff',
          tabBarInactiveTintColor: 'gray',
          headerShown: true,
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 0.5,
            borderTopColor: '#ccc',
            height:50,
            
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
          swipeEnabled: false,
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          initialParams={{ employeeData, sid, erpUrl }}
          options={{
            tabBarLabel: 'Home',
            headerTitle: () => (
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontWeight: 'bold', fontSize: 14, color: 'black' }}>
                  {employeeData?.company || 'Company'}
                </Text>
                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black' }}>
                  Welcome, {employeeData?.employee_name || 'Employee'}
                </Text>
              </View>
            ),
            headerTitleAlign: 'center',
            headerRight: renderNotificationIcon,
     
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          initialParams={{ employeeData, sid,erpUrl }}
          options={{
            tabBarLabel: 'Profile',
            headerTitle: 'My Profile',
            headerRight: renderNotificationIcon,
            
          }}
        />
        <Tab.Screen
          name="Report"
          component={SettingsScreen}
          initialParams={{ employeeData, sid, erpUrl }}
          options={{
            tabBarLabel: 'Reports',
            headerTitle: 'Reports',
            headerRight: renderNotificationIcon,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="document-text-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Logout"
          component={LogoutScreen}
          initialParams={{ employeeData }}
          options={{
            tabBarLabel: 'Logout',
            headerTitle: 'Logout',
          }}
        />
      </Tab.Navigator>

      <NotificationModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        notifications={notifications}
        markAllSeen={markAllSeen}
        onDelete={deleteNotification}
      />
    </>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold', 
    marginBottom: 10,
    color: 'black',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: 'black',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  badge: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: 'red',
    borderRadius: 8,
    paddingHorizontal: 4,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});


export default EmployeeTabs;
