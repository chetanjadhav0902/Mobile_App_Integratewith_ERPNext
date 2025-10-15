

// code login take 10 second for login with weak network


// import React, { useState, useEffect } from 'react';
// import {
//   View, TextInput, TouchableOpacity, Text,
//   StyleSheet, Alert, ActivityIndicator, SafeAreaView, Image
// } from 'react-native';
// import CookieManager from '@react-native-cookies/cookies';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import CheckBox from '@react-native-community/checkbox';

// const ERP_BASE_URL = 'https://erpnextcloud.cbditsolutions.com';

// const LoginScreen = ({ navigation }) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);

//   useEffect(() => {
//     const loadCredentials = async () => {
//       try {
//         const savedRemember = await AsyncStorage.getItem('rememberMe');
//         if (savedRemember === 'true') {
//           const savedUsername = await AsyncStorage.getItem('username');
//           const savedPassword = await AsyncStorage.getItem('password');
//           if (savedUsername && savedPassword) {
//             setUsername(savedUsername);
//             setPassword(savedPassword);
//             setRememberMe(true);
//           }
//         }
//       } catch (e) {
//         console.log('Failed to load credentials', e);
//       }
//     };
//     loadCredentials();
//   }, []);

//   const fetchWithTimeout = (url, options, timeout = 10000) => {
//     return Promise.race([
//       fetch(url, options),
//       new Promise((_, reject) =>
//         setTimeout(() => reject(new Error('Request Timeout')), timeout)
//       )
//     ]);
//   };

//   const handleLogin = async () => {
//     if (!username || !password) {
//       Alert.alert('Error', 'Please enter username and password');
//       return;
//     }

//     setLoading(true);
//     try {
//       await CookieManager.clearAll();

//       const loginResponse = await fetchWithTimeout(`${ERP_BASE_URL}/api/method/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//         body: `usr=${encodeURIComponent(username)}&pwd=${encodeURIComponent(password)}`
//       });

//       const loginJson = await loginResponse.json();
//       if (loginJson.message !== 'Logged In') {
//         Alert.alert('Login Failed', loginJson.message || 'Incorrect credentials');
//         setLoading(false);
//         return;
//       }

//       const cookies = await CookieManager.get(ERP_BASE_URL);
//       const sid = cookies.sid?.value;
//       if (!sid) {
//         Alert.alert('Error', 'Session cookie not found');
//         setLoading(false);
//         return;
//       }

//       if (rememberMe) {
//         await AsyncStorage.setItem('username', username);
//         await AsyncStorage.setItem('password', password);
//         await AsyncStorage.setItem('rememberMe', 'true');
//       } else {
//         await AsyncStorage.removeItem('username');
//         await AsyncStorage.removeItem('password');
//         await AsyncStorage.setItem('rememberMe', 'false');
//       }

//       const empListResponse = await fetchWithTimeout(
//         `${ERP_BASE_URL}/api/resource/Employee?filters=[["user_id","=","${username}"]]`,
//         { headers: { Cookie: `sid=${sid}` } }
//       );
//       const empListJson = await empListResponse.json();

//       if (empListJson.data && empListJson.data.length > 0) {
//         const empName = empListJson.data[0].name;

//         const fullEmpResponse = await fetchWithTimeout(
//           `${ERP_BASE_URL}/api/resource/Employee/${empName}`,
//           { headers: { Cookie: `sid=${sid}` } }
//         );
//         const fullEmpJson = await fullEmpResponse.json();
//         const employeeData = fullEmpJson.data;

//         navigation.replace('Employee', { employeeData, sid });
//       } else {
//         Alert.alert('No Data', 'No employee found for this user');
//       }

//     } catch (err) {
//       console.error('Login Error:', err);
//       if (err.message.includes('Network request failed')) {
//         Alert.alert('Network Error', 'Please check your internet connection (e.g., 4G network).');
//       } else if (err.message.includes('Timeout')) {
//         Alert.alert('Timeout', 'Server took too long to respond. Try again.');
//       } else {
//         Alert.alert('Error', err.message || 'Something went wrong');
//       }
//     }
//     setLoading(false);
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.logoContainer}>
//         <Image
//           source={require('../assets/logo.png')}
//           style={styles.logo}
//         />
//       </View>

//       <Text style={styles.title}>HRMS Login</Text>

//       <TextInput
//         style={styles.input}
//         placeholderTextColor="#666"
//         placeholder="Username"
//         value={username}
//         onChangeText={setUsername}
//       />
//       <TextInput
//         style={styles.input}
//         placeholderTextColor="#666"
//         placeholder="Password"
//         value={password}
//         secureTextEntry
//         onChangeText={setPassword}
//       />

//       <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
//         {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
//       </TouchableOpacity>

//       <View style={styles.checkboxContainer}>
//         <CheckBox
//           value={rememberMe}
//           onValueChange={async (newValue) => {
//             setRememberMe(newValue);
//             await AsyncStorage.setItem('rememberMe', newValue ? 'true' : 'false');
//             if (!newValue) {
//               await AsyncStorage.removeItem('username');
//               await AsyncStorage.removeItem('password');
//             }
//           }}
//           tintColors={{ true: '#007bff', false: '#ccc' }}
//         />
//         <Text style={styles.checkboxLabel}>Remember Me</Text>
//       </View>

//       <View>
//         <Text style={styles.footer}>● Developed by CBD IT Solution Pvt Ltd.</Text>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default LoginScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 30,
//     justifyContent: 'center',
//     backgroundColor: '#FFF5F5'
//   },
//   logoContainer: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   logo: {
//     width: 100,
//     height: 100,
//   },
//   title: {
//     fontSize: 26,
//     color: 'black',
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     color: 'black',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 15
//   },
//   button: {
//     backgroundColor: '#007bff',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center'
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold'
//   },
//   checkboxContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 15,
//     marginLeft: -4
//   },
//   checkboxLabel: {
//     color: 'black',
//     marginLeft: 8,
//     fontSize: 16
//   },
//   footer: {
//     padding: 4,
//     marginTop: 6,
//     color: 'gray',
//   }
// });



//code with url field


// import React, { useState, useEffect } from 'react';
// import {
//   View, TextInput, TouchableOpacity, Text,
//   StyleSheet, Alert, ActivityIndicator, SafeAreaView, Image
// } from 'react-native';
// import CookieManager from '@react-native-cookies/cookies';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import CheckBox from '@react-native-community/checkbox';

// const LoginScreen = ({ navigation }) => {
//   const [baseUrl, setBaseUrl] = useState('');
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);

//   useEffect(() => {
//     const loadCredentials = async () => {
//       try {
//         const savedRemember = await AsyncStorage.getItem('rememberMe');
//         if (savedRemember === 'true') {
//           const savedBaseUrl = await AsyncStorage.getItem('baseUrl');
//           const savedUsername = await AsyncStorage.getItem('username');
//           const savedPassword = await AsyncStorage.getItem('password');
//           if (savedUsername && savedPassword) {
//             setBaseUrl(savedBaseUrl || '');
//             setUsername(savedUsername);
//             setPassword(savedPassword);
//             setRememberMe(true);
//           }
//         }
//       } catch (e) {
//         console.log('Failed to load credentials', e);
//       }
//     };
//     loadCredentials();
//   }, []);

//   const handleLogin = async () => {
//     if (!baseUrl || !username || !password) {
//       Alert.alert('Error', 'Please fill all fields including ERP URL');
//       return;
//     }

//     setLoading(true);
//     try {
//       await CookieManager.clearAll();

//       const loginResponse = await fetch(`${baseUrl}/api/method/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//         body: `usr=${encodeURIComponent(username)}&pwd=${encodeURIComponent(password)}`
//       });

//       const loginJson = await loginResponse.json();
//       if (loginJson.message !== 'Logged In') {
//         Alert.alert('Login Failed', loginJson.message || 'Incorrect credentials');
//         setLoading(false);
//         return;
//       }

//       const cookies = await CookieManager.get(baseUrl);
//       const sid = cookies.sid?.value;
//       if (!sid) {
//         Alert.alert('Error', 'Session cookie not found');
//         setLoading(false);
//         return;
//       }

//       if (rememberMe) {
//         await AsyncStorage.setItem('baseUrl', baseUrl);
//         await AsyncStorage.setItem('username', username);
//         await AsyncStorage.setItem('password', password);
//         await AsyncStorage.setItem('rememberMe', 'true');
//       } else {
//         await AsyncStorage.removeItem('baseUrl');
//         await AsyncStorage.removeItem('username');
//         await AsyncStorage.removeItem('password');
//         await AsyncStorage.setItem('rememberMe', 'false');
//       }

//       const empListResponse = await fetch(
//         `${baseUrl}/api/resource/Employee?filters=[["user_id","=","${username}"]]`,
//         { headers: { Cookie: `sid=${sid}` } }
//       );
//       const empListJson = await empListResponse.json();

//       if (empListJson.data && empListJson.data.length > 0) {
//         const empName = empListJson.data[0].name;

//         const fullEmpResponse = await fetch(
//           `${baseUrl}/api/resource/Employee/${empName}`,
//           { headers: { Cookie: `sid=${sid}` } }
//         );
//         const fullEmpJson = await fullEmpResponse.json();
//         const employeeData = fullEmpJson.data;

//         navigation.replace('Employee', {
//           employeeData,
//           sid,
//           erpUrl: baseUrl,
//         });
//       } else {
//         Alert.alert('No Data', 'No employee found for this user');
//       }

//     } catch (err) {
//       console.error('Login Error:', err);
//       Alert.alert('Internet & URL Problem','Please Check your Internet connection and Base URL');
     
   
   
//     }
//     setLoading(false);
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.logoContainer}>
//         <Image source={require('../assets/logo.png')} style={styles.logo} />
//       </View>

//       <Text style={styles.title}>HRMS Login</Text>

//       <TextInput
//         style={styles.input}
//         placeholderTextColor="#666"
//         placeholder="ERP Base URL (e.g. https://...)"
//         value={baseUrl}
//         onChangeText={setBaseUrl}
//       />

//       <TextInput
//         style={styles.input}
//         placeholderTextColor="#666"
//         placeholder="Username"
//         value={username}
//         onChangeText={setUsername}
//       />

//       <TextInput
//         style={styles.input}
//         placeholderTextColor="#666"
//         placeholder="Password"
//         value={password}
//         secureTextEntry
//         onChangeText={setPassword}
//       />

//       <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
//         {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
//       </TouchableOpacity>

//       <View style={styles.checkboxContainer}>
//         <CheckBox
//           value={rememberMe}
//           onValueChange={async (newValue) => {
//             setRememberMe(newValue);
//             await AsyncStorage.setItem('rememberMe', newValue ? 'true' : 'false');
//             if (!newValue) {
//               await AsyncStorage.removeItem('baseUrl');
//               await AsyncStorage.removeItem('username');
//               await AsyncStorage.removeItem('password');
//             }
//           }}
//           tintColors={{ true: '#007bff', false: '#ccc' }}
//         />
//         <Text style={styles.checkboxLabel}>Remember Me</Text>
//       </View>

//       <View>
//         <Text style={styles.footer}>● Developed by CBD IT Solution Pvt Ltd.</Text>
//       </View>
       
//        <View>
//         <Text >Version 1.1.0</Text>
//        </View>
      
//     </SafeAreaView>
//   );
// };

// export default LoginScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 30, justifyContent: 'center', backgroundColor: '#FFF5F5'},
//   logoContainer: { alignItems: 'center', marginBottom: 20 },
//   logo: { width: 100, height: 100 },
//   title: { fontSize: 26, color: 'black', fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
//   input: {
//     borderWidth: 1, borderColor: '#ccc', color: 'black',
//     padding: 12, borderRadius: 8, marginBottom: 15
//   },
//   button: {
//     backgroundColor: '#007bff', padding: 15,
//     borderRadius: 8, alignItems: 'center'
//   },
//   buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
//   checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 15, marginLeft: -4 },
//   checkboxLabel: { color: 'black', marginLeft: 8, fontSize: 16 },
//   footer: { padding: 4, marginTop: 6, color: 'gray' }
// });

// code with add version

// import React, { useState, useEffect } from 'react';
// import {
//   View, TextInput, TouchableOpacity, Text,
//   StyleSheet, Alert, ActivityIndicator, SafeAreaView, Image, ScrollView
// } from 'react-native';
// import CookieManager from '@react-native-cookies/cookies';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import CheckBox from '@react-native-community/checkbox';
// import DeviceInfo from 'react-native-device-info';

// const LoginScreen = ({ navigation }) => {
//   const [baseUrl, setBaseUrl] = useState('');
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const version = DeviceInfo.getVersion();

//   useEffect(() => {
//     const loadCredentials = async () => {
//       try {
//         const savedRemember = await AsyncStorage.getItem('rememberMe');
//         if (savedRemember === 'true') {
//           const savedBaseUrl = await AsyncStorage.getItem('baseUrl');
//           const savedUsername = await AsyncStorage.getItem('username');
//           const savedPassword = await AsyncStorage.getItem('password');
//           if (savedUsername && savedPassword) {
//             setBaseUrl(savedBaseUrl || '');
//             setUsername(savedUsername);
//             setPassword(savedPassword);
//             setRememberMe(true);
//           }
//         }
//       } catch (e) {
//         console.log('Failed to load credentials', e);
//       }
//     };
//     loadCredentials();
//   }, []);

//   const handleLogin = async () => {
//     if (!baseUrl || !username || !password) {
//       Alert.alert('Error', 'Please fill all fields including ERP URL');
//       return;
//     }

//     setLoading(true);
//     try {
//       await CookieManager.clearAll();

//       const loginResponse = await fetch(`${baseUrl}/api/method/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//         body: `usr=${encodeURIComponent(username)}&pwd=${encodeURIComponent(password)}`
//       });

//       const loginJson = await loginResponse.json();
//       if (loginJson.message !== 'Logged In') {
//         Alert.alert('Login Failed', loginJson.message || 'Incorrect credentials');
//         setLoading(false);
//         return;
//       }

//       const cookies = await CookieManager.get(baseUrl);
//       const sid = cookies.sid?.value;
//       if (!sid) {
//         Alert.alert('Error', 'Session cookie not found');
//         setLoading(false);
//         return;
//       }

//       if (rememberMe) {
//         await AsyncStorage.setItem('baseUrl', baseUrl);
//         await AsyncStorage.setItem('username', username);
//         await AsyncStorage.setItem('password', password);
//         await AsyncStorage.setItem('rememberMe', 'true');
//       } else {
//         await AsyncStorage.removeItem('baseUrl');
//         await AsyncStorage.removeItem('username');
//         await AsyncStorage.removeItem('password');
//         await AsyncStorage.setItem('rememberMe', 'false');
//       }

//       const empListResponse = await fetch(
//         `${baseUrl}/api/resource/Employee?filters=[["user_id","=","${username}"]]`,
//         { headers: { Cookie: `sid=${sid}` } }
//       );
//       const empListJson = await empListResponse.json();

//       if (empListJson.data && empListJson.data.length > 0) {
//         const empName = empListJson.data[0].name;

//         const fullEmpResponse = await fetch(
//           `${baseUrl}/api/resource/Employee/${empName}`,
//           { headers: { Cookie: `sid=${sid}` } }
//         );
//         const fullEmpJson = await fullEmpResponse.json();
//         const employeeData = fullEmpJson.data;

//         navigation.replace('Employee', {
//           employeeData,
//           sid,
//           erpUrl: baseUrl,
//         });
//       } else {
//         Alert.alert('No Data', 'No employee found for this user');
//       }

//     } catch (err) {
//       console.error('Login Error:', err);
//       Alert.alert('Internet & URL Problem', 'Please Check your Internet connection and Base URL');
//     }
//     setLoading(false);
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//      <ScrollView contentContainerStyle={styles.scrollContent}>
//         <View style={styles.logoContainer}>

          
//           <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
          
           
//         </View>

//         <Text style={styles.title}>HRMS Login</Text>

//         <TextInput
//           style={styles.input}
//           placeholderTextColor="#666"
//           placeholder="ERP Base URL (e.g. https://...)"
//           value={baseUrl}
//           onChangeText={setBaseUrl}
//         />

//         <TextInput
//           style={styles.input}
//           placeholderTextColor="#666"
//           placeholder="Username"
//           value={username}
//           onChangeText={setUsername}
//         />

//         <TextInput
//           style={styles.input}
//           placeholderTextColor="#666"
//           placeholder="Password"
//           value={password}
//           secureTextEntry
//           onChangeText={setPassword}
//         />

//         <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
//           {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
//         </TouchableOpacity>

//         <View style={styles.checkboxContainer}>
//           <CheckBox
//             value={rememberMe}
//             onValueChange={async (newValue) => {
//               setRememberMe(newValue);
//               await AsyncStorage.setItem('rememberMe', newValue ? 'true' : 'false');
//               if (!newValue) {
//                 await AsyncStorage.removeItem('baseUrl');
//                 await AsyncStorage.removeItem('username');
//                 await AsyncStorage.removeItem('password');
//               }
//             }}
//             tintColors={{ true: '#007bff', false: '#ccc' }}
//           />
//           <Text style={styles.checkboxLabel}>Remember Me</Text>
//         </View>

//         <View style={styles.footerContainer}>
//           <Text style={styles.footer}>● Developed by CBD IT Solutions Pvt Ltd.</Text>
//           <Text style={styles.version}>Version {DeviceInfo.getVersion()}</Text>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default LoginScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#FFF5F5' },
//   scrollContent: { padding: 30, justifyContent: 'center', flexGrow: 1 },
//   logoContainer: { alignItems: 'center', marginBottom: 20,marginTop:'30%' },
//   logo: { width: 100, height: 100 },
//   title: { fontSize: 26, color: 'black', fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
//   input: {
//     borderWidth: 1, borderColor: '#ccc', color: 'black',
//     padding: 12, borderRadius: 8, marginBottom: 15
//   },
//   button: {
//     backgroundColor: '#007bff', padding: 15,
//     borderRadius: 8, alignItems: 'center'
//   },
//   buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
//   checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 15, marginLeft: -4 },
//   checkboxLabel: { color: 'black', marginLeft: 8, fontSize: 16 },
//   footerContainer: { marginTop: 10 },
//   footer: {  color: 'gray' },
//   version: { fontSize: 14, color: 'gray', marginTop: 4, textAlign:'center',marginTop:'40%' }
// });


//code with responsive UI
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   TextInput,
//   TouchableOpacity,
//   Text,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
//   SafeAreaView,
//   Image,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   Dimensions,
//   Keyboard,
// } from 'react-native';
// import CookieManager from '@react-native-cookies/cookies';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import CheckBox from '@react-native-community/checkbox';
// import DeviceInfo from 'react-native-device-info';

// const { width, height } = Dimensions.get('window');

// const wp = (num) => width * (num / 100);
// const hp = (num) => height * (num / 100);

// const LoginScreen = ({ navigation }) => {
//   const [baseUrl, setBaseUrl] = useState('');
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const [keyboardVisible, setKeyboardVisible] = useState(false);
//   const version = DeviceInfo.getVersion();

//   useEffect(() => {
//     const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () =>
//       setKeyboardVisible(true)
//     );
//     const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () =>
//       setKeyboardVisible(false)
//     );

//     return () => {
//       keyboardDidShowListener.remove();
//       keyboardDidHideListener.remove();
//     };
//   }, []);

//   useEffect(() => {
//     const loadCredentials = async () => {
//       try {
//         const savedRemember = await AsyncStorage.getItem('rememberMe');
//         if (savedRemember === 'true') {
//           const savedBaseUrl = await AsyncStorage.getItem('baseUrl');
//           const savedUsername = await AsyncStorage.getItem('username');
//           const savedPassword = await AsyncStorage.getItem('password');
//           if (savedUsername && savedPassword) {
//             setBaseUrl(savedBaseUrl || '');
//             setUsername(savedUsername);
//             setPassword(savedPassword);
//             setRememberMe(true);
//           }
//         }
//       } catch (e) {
//         console.log('Failed to load credentials', e);
//       }
//     };
//     loadCredentials();
//   }, []);

//   const handleLogin = async () => {
//     if (!baseUrl || !username || !password) {
//       Alert.alert('Error', 'Please fill all fields including ERP URL');
//       return;
//     }

//     setLoading(true);
//     try {
//       await CookieManager.clearAll();

//       const loginResponse = await fetch(`${baseUrl}/api/method/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//         body: `usr=${encodeURIComponent(username)}&pwd=${encodeURIComponent(password)}`,
//       });

//       const loginJson = await loginResponse.json();
//       if (loginJson.message !== 'Logged In') {
//         Alert.alert('Login Failed', loginJson.message || 'Incorrect credentials');
//         setLoading(false);
//         return;
//       }

//       const cookies = await CookieManager.get(baseUrl);
//       const sid = cookies.sid?.value;
//       if (!sid) {
//         Alert.alert('Error', 'Session cookie not found');
//         setLoading(false);
//         return;
//       }

//       if (rememberMe) {
//         await AsyncStorage.setItem('baseUrl', baseUrl);
//         await AsyncStorage.setItem('username', username);
//         await AsyncStorage.setItem('password', password);
//         await AsyncStorage.setItem('rememberMe', 'true');
//       } else {
//         await AsyncStorage.removeItem('baseUrl');
//         await AsyncStorage.removeItem('username');
//         await AsyncStorage.removeItem('password');
//         await AsyncStorage.setItem('rememberMe', 'false');
//       }

//       const empListResponse = await fetch(
//         `${baseUrl}/api/resource/Employee?filters=[["user_id","=","${username}"]]`,
//         { headers: { Cookie: `sid=${sid}` } }
//       );
//       const empListJson = await empListResponse.json();

//       if (empListJson.data && empListJson.data.length > 0) {
//         const empName = empListJson.data[0].name;

//         const fullEmpResponse = await fetch(
//           `${baseUrl}/api/resource/Employee/${empName}`,
//           { headers: { Cookie: `sid=${sid}` } }
//         );
//         const fullEmpJson = await fullEmpResponse.json();
//         const employeeData = fullEmpJson.data;

//         navigation.replace('Employee', {
//           employeeData,
//           sid,
//           erpUrl: baseUrl,
//         });
//       } else {
//         Alert.alert('No Data', 'No employee found for this user');
//       }
//     } catch (err) {
//       console.error('Login Error:', err);
//       Alert.alert('Internet & URL Problem', 'Please Check your Internet connection and Base URL');
//     }
//     setLoading(false);
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//         style={{ flex: 1 }}
//         keyboardVerticalOffset={hp(2)}
//       >
//         <View style={{ flex: 1 }}>
//           <ScrollView
//             contentContainerStyle={styles.scrollContent}
//             bounces={false}
//             keyboardShouldPersistTaps="handled"
//           >
//             <View style={styles.logoContainer}>
//               <Image
//                 source={require('../assets/logo.png')}
//                 style={styles.logo}
//                 resizeMode="contain"
//               />
//             </View>

//             <Text style={styles.title}>HRMS Login</Text>

//             <TextInput
//               style={styles.input}
//               placeholderTextColor="#666"
//               placeholder="ERP Base URL (e.g. https://...)"
//               value={baseUrl}
//               onChangeText={setBaseUrl}
//             />

//             <TextInput
//               style={styles.input}
//               placeholderTextColor="#666"
//               placeholder="Username"
//               value={username}
//               onChangeText={setUsername}
//               autoCapitalize="none"
//             />

//             <TextInput
//               style={styles.input}
//               placeholderTextColor="#666"
//               placeholder="Password"
//               value={password}
//               secureTextEntry
//               onChangeText={setPassword}
//             />

//             <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
//               {loading ? (
//                 <ActivityIndicator color="#fff" />
//               ) : (
//                 <Text style={styles.buttonText}>Login</Text>
//               )}
//             </TouchableOpacity>

//             <View style={styles.checkboxContainer}>
//               <CheckBox
//                 value={rememberMe}
//                 onValueChange={async (newValue) => {
//                   setRememberMe(newValue);
//                   await AsyncStorage.setItem('rememberMe', newValue ? 'true' : 'false');
//                   if (!newValue) {
//                     await AsyncStorage.removeItem('baseUrl');
//                     await AsyncStorage.removeItem('username');
//                     await AsyncStorage.removeItem('password');
//                   }
//                 }}
//                 tintColors={{ true: '#007bff', false: '#ccc' }}
//               />
//               <Text style={styles.checkboxLabel}>Remember Me</Text>
//             </View>

//             {/* Developed by just below "Remember Me" */}
//             <Text style={styles.footer}>● Developed by CBD IT Solutions Pvt Ltd.</Text>
//           </ScrollView>

//           {/* Conditionally show Version only when keyboard is hidden */}
//           {!keyboardVisible && (
//             <View style={styles.versionContainer}>
//               <Text style={styles.version}>Version {version}</Text>
//             </View>
//           )}
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// export default LoginScreen;

// // Responsive styles
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFF5F5',
//   },
//   scrollContent: {
//     paddingHorizontal: wp(7),
//     paddingVertical: hp(4),
//     justifyContent: 'center',
//     flexGrow: 1,
//   },
//   logoContainer: {
//     alignItems: 'center',
//     marginBottom: hp(2),
//     marginTop: hp(10),
//   },
//   logo: {
//     width: wp(25),
//     height: wp(25),
//   },
//   title: {
//     fontSize: wp(6.2),
//     color: 'black',
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: hp(2),
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     color: 'black',
//     padding: wp(3),
//     borderRadius: wp(3),
//     marginBottom: hp(2),
//     fontSize: wp(4),
//     backgroundColor: '#fff',
//   },
//   button: {
//     backgroundColor: '#007bff',
//     paddingVertical: hp(2),
//     borderRadius: wp(3),
//     alignItems: 'center',
//     marginTop: hp(1),
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: wp(4),
//     fontWeight: 'bold',
//   },
//   checkboxContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: hp(2),
//     marginLeft: 0,
//   },
//   checkboxLabel: {
//     color: 'black',
//     marginLeft: wp(2),
//     fontSize: wp(4),
//   },
//   footer: {
//     color: 'gray',
//     fontSize: wp(3.6),
//     marginTop: hp(1),
//     textAlign: 'left',
//   },
//   versionContainer: {
//     width: '100%',
//     alignItems: 'center',
//     justifyContent: 'flex-end',
//     paddingBottom: hp(2),
//     backgroundColor: 'transparent',
//   },
//   version: {
//     fontSize: wp(3.7),
//     color: 'gray',
//     textAlign: 'center',
//   },
// });


import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Keyboard,
} from 'react-native';
import CookieManager from '@react-native-cookies/cookies';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import DeviceInfo from 'react-native-device-info';

const { width, height } = Dimensions.get('window');

const wp = (num) => width * (num / 100);
const hp = (num) => height * (num / 100);

const LoginScreen = ({ navigation }) => {
  const [baseUrl, setBaseUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const version = DeviceInfo.getVersion();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const savedRemember = await AsyncStorage.getItem('rememberMe');
        if (savedRemember === 'true') {
          const savedBaseUrl = await AsyncStorage.getItem('baseUrl');
          const savedUsername = await AsyncStorage.getItem('username');
          const savedPassword = await AsyncStorage.getItem('password');
          if (savedUsername && savedPassword) {
            setBaseUrl(savedBaseUrl || '');
            setUsername(savedUsername);
            setPassword(savedPassword);
            setRememberMe(true);
          }
        }
      } catch (e) {
        console.log('Failed to load credentials', e);
      }
    };
    loadCredentials();
  }, []);

  const handleLogin = async () => {
    if (!baseUrl || !username || !password) {
      Alert.alert('Error', 'Please fill all fields including ERP URL');
      return;
    }

    setLoading(true);
    try {
      await CookieManager.clearAll();

      const loginResponse = await fetch(`${baseUrl}/api/method/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `usr=${encodeURIComponent(username)}&pwd=${encodeURIComponent(password)}`,
      });

      const loginJson = await loginResponse.json();
      if (loginJson.message !== 'Logged In') {
        Alert.alert('Login Failed', loginJson.message || 'Incorrect credentials');
        setLoading(false);
        return;
      }

      const cookies = await CookieManager.get(baseUrl);
      const sid = cookies.sid?.value;
      if (!sid) {
        Alert.alert('Error', 'Session cookie not found');
        setLoading(false);
        return;
      }

      if (rememberMe) {
        await AsyncStorage.setItem('baseUrl', baseUrl);
        await AsyncStorage.setItem('username', username);
        await AsyncStorage.setItem('password', password);
        await AsyncStorage.setItem('rememberMe', 'true');
      } else {
        await AsyncStorage.removeItem('baseUrl');
        await AsyncStorage.removeItem('username');
        await AsyncStorage.removeItem('password');
        await AsyncStorage.setItem('rememberMe', 'false');
      }

      const empListResponse = await fetch(
        `${baseUrl}/api/resource/Employee?filters=[["user_id","=","${username}"]]`,
        { headers: { Cookie: `sid=${sid}` } }
      );
      const empListJson = await empListResponse.json();

      if (empListJson.data && empListJson.data.length > 0) {
        const empName = empListJson.data[0].name;

        const fullEmpResponse = await fetch(
          `${baseUrl}/api/resource/Employee/${empName}`,
          { headers: { Cookie: `sid=${sid}` } }
        );
        const fullEmpJson = await fullEmpResponse.json();
        const employeeData = fullEmpJson.data;

        navigation.replace('Employee', {
          employeeData,
          sid,
          erpUrl: baseUrl,
        });
      } else {
        Alert.alert('No Data', 'No employee found for this user');
      }
    } catch (err) {
      console.error('Login Error:', err);
      Alert.alert('Internet & URL Problem', 'Please Check your Internet connection and Base URL');
    }
    setLoading(false);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={hp(2)}
      >
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            bounces={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.logoContainer}>
              <Image
                source={require('../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.title}>SADBHAV LOGIN</Text>

            <TextInput
              style={styles.input}
              placeholderTextColor="#666"
              placeholder="ERP Base URL (e.g. https://...)"
              value={baseUrl}
              onChangeText={setBaseUrl}
            />

            <TextInput
              style={styles.input}
              placeholderTextColor="#666"
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholderTextColor="#666"
                placeholder="Password"
                value={password}
                secureTextEntry={!showPassword}
                onChangeText={setPassword}
              />
              <TouchableOpacity style={styles.eyeIcon} onPress={toggleShowPassword}>
                <Text style={styles.eyeIconText}>
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>

            <View style={styles.checkboxContainer}>
              <CheckBox
                value={rememberMe}
                onValueChange={async (newValue) => {
                  setRememberMe(newValue);
                  await AsyncStorage.setItem('rememberMe', newValue ? 'true' : 'false');
                  if (!newValue) {
                    await AsyncStorage.removeItem('baseUrl');
                    await AsyncStorage.removeItem('username');
                    await AsyncStorage.removeItem('password');
                  }
                }}
                tintColors={{ true: '#007bff', false: '#ccc' }}
              />
              <Text style={styles.checkboxLabel}>Remember Me</Text>
            </View>

            {/* Developed by just below "Remember Me" */}
            <Text style={styles.footer}>● Developed by CBD IT Solutions Pvt Ltd.</Text>
          </ScrollView>

          {/* Conditionally show Version only when keyboard is hidden */}
          {!keyboardVisible && (
            <View style={styles.versionContainer}>
              <Text style={styles.version}>Version {version}</Text>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

// Responsive styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F5',
  },
  scrollContent: {
    paddingHorizontal: wp(7),
    paddingVertical: hp(4),
    justifyContent: 'center',
    flexGrow: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: hp(2),
    marginTop: hp(10),
  },
  logo: {
    width: wp(25),
    height: wp(25),
  },
  title: {
    fontSize: wp(6.2),
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: hp(2),
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    color: 'black',
    padding: wp(3),
    borderRadius: wp(3),
    marginBottom: hp(2),
    fontSize: wp(4),
    backgroundColor: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: wp(3),
    marginBottom: hp(2),
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    color: 'black',
    padding: wp(3),
    fontSize: wp(4),
  },
  eyeIcon: {
    padding: wp(3),
  },
  eyeIconText: {
    fontSize: wp(4),
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: hp(2),
    borderRadius: wp(3),
    alignItems: 'center',
    marginTop: hp(1),
  },
  buttonText: {
    color: '#fff',
    fontSize: wp(4),
    fontWeight: 'bold',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(2),
    marginLeft: 0,
  },
  checkboxLabel: {
    color: 'black',
    marginLeft: wp(2),
    fontSize: wp(4),
  },
  footer: {
    color: 'gray',
    fontSize: wp(3.6),
    marginTop: hp(1),
    textAlign: 'left',
  },
  versionContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: hp(2),
    backgroundColor: 'transparent',
  },
  version: {
    fontSize: wp(3.7),
    color: 'gray',
    textAlign: 'center',
  },
});