
// ProfileScreen.js


// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
//   Platform,
//   PermissionsAndroid,
//   ScrollView,
//   Animated,
//   UIManager,
//   Dimensions,
//   Modal,
// } from 'react-native';
// import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import RNFetchBlob from 'rn-fetch-blob';
// import CookieManager from '@react-native-cookies/cookies';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const ERP_BASE_URL = 'https://erpnextcloud.cbditsolutions.com';
// const { height, width } = Dimensions.get('window');

// if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

// const ProfileScreen = ({ route }) => {
//   const [imageUri, setImageUri] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [sid, setSid] = useState(null);
//   const [expandedSection, setExpandedSection] = useState(null);
//   const heightAnim = useRef(new Animated.Value(0)).current;
//   const opacityAnim = useRef(new Animated.Value(0)).current;
//   const [showEditOptions, setShowEditOptions] = useState(false);

//   const employeeData = route.params?.employeeData;
//   const storageKey = `@profileImage_${employeeData?.name}`;

//   useEffect(() => {
//     const loadImage = async () => {
//       try {
//         const savedImage = await AsyncStorage.getItem(storageKey);
//         if (savedImage) {
//           setImageUri(savedImage);
//         } else if (employeeData?.image) {
//           setImageUri(`${ERP_BASE_URL}${employeeData.image}?t=${Date.now()}`);
//         }
//       } catch {
//         Alert.alert('Error', 'Failed to load profile image');
//       }
//     };

//     const loadSession = async () => {
//       try {
//         const cookies = await CookieManager.get(ERP_BASE_URL);
//         if (cookies.sid?.value) {
//           setSid(cookies.sid.value);
//         } else {
//           Alert.alert('Session Expired', 'Please login again');
//         }
//       } catch {
//         Alert.alert('Error', 'Failed to load session');
//       }
//     };

//     loadImage();
//     loadSession();
//   }, []);

//   const toggleSection = (sectionName) => {
//     if (expandedSection === sectionName) {
//       // Collapse the section
//       Animated.parallel([
//         Animated.timing(heightAnim, {
//           toValue: 0,
//           duration: 300,
//           useNativeDriver: false,
//         }),
//         Animated.timing(opacityAnim, {
//           toValue: 0,
//           duration: 200,
//           useNativeDriver: false,
//         }),
//       ]).start(() => {
//         setExpandedSection(null);
//       });
//     } else {
//       // Expand the section
//       setExpandedSection(sectionName);
//       Animated.parallel([
//         Animated.timing(heightAnim, {
//           toValue: 1,
//           duration: 300,
//           useNativeDriver: false,
//         }),
//         Animated.timing(opacityAnim, {
//           toValue: 1,
//           duration: 200,
//           useNativeDriver: false,
//         }),
//       ]).start();
//     }
//   };

//   const requestCameraPermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.CAMERA
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch {
//         Alert.alert('Error', 'Failed to request camera permission');
//         return false;
//       }
//     }
//     return true;
//   };

//   const requestGalleryPermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const permission = Platform.Version >= 33
//           ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
//           : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

//         const granted = await PermissionsAndroid.request(permission);
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch {
//         Alert.alert('Error', 'Failed to request gallery permission');
//         return false;
//       }
//     }
//     return true;
//   };

//   const handleImagePick = async (fromCamera = false) => {
//     setShowEditOptions(false);
    
//     try {
//       let result;
//       if (fromCamera) {
//         const hasCameraPermission = await requestCameraPermission();
//         if (!hasCameraPermission) return;
        
//         result = await launchCamera({
//           mediaType: 'photo',
//           quality: 0.8,
//           includeBase64: false,
//         });
//       } else {
//         const hasGalleryPermission = await requestGalleryPermission();
//         if (!hasGalleryPermission) return;
        
//         result = await launchImageLibrary({
//           mediaType: 'photo',
//           quality: 0.8,
//           includeBase64: false,
//         });
//       }

//       if (result.didCancel || !result.assets?.length) return;

//       const selectedUri = result.assets[0].uri;
//       await uploadNewImage(selectedUri);
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     }
//   };

//   const uploadNewImage = async (uri) => {
//     setUploading(true);
//     try {
//       await deleteExistingFile();
//       const uploadResult = await uploadImageFileToERP(uri);
//       await updateEmployeePhoto(uploadResult.file_url);

//       const freshUri = `${ERP_BASE_URL}${uploadResult.file_url}?t=${Date.now()}`;
//       setImageUri(freshUri);
//       await AsyncStorage.setItem(storageKey, freshUri);
//       Alert.alert('Success', 'Profile image updated successfully');
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const deleteExistingFile = async () => {
//     if (!employeeData?.image || !sid) return;

//     await fetch(`${ERP_BASE_URL}/api/method/erpnext.www.delete_file.delete_file`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Cookie': `sid=${sid}`,
//       },
//       body: JSON.stringify({
//         file_url: employeeData.image,
//         doctype: 'Employee',
//         docname: employeeData.name,
//       }),
//     });
//   };

//   const uploadImageFileToERP = async (uri) => {
//     const filename = `profile_${employeeData.name}_${Date.now()}.jpg`;
//     const uploadUrl = `${ERP_BASE_URL}/api/method/upload_file`;

//     const res = await RNFetchBlob.fetch('POST', uploadUrl, {
//       'Content-Type': 'multipart/form-data',
//       'Cookie': `sid=${sid}`,
//     }, [
//       { name: 'file', filename, type: 'image/jpeg', data: RNFetchBlob.wrap(uri) },
//       { name: 'is_private', data: '1' },
//       { name: 'doctype', data: 'Employee' },
//       { name: 'docname', data: employeeData.name },
//       { name: 'fieldname', data: 'image' },
//     ]);

//     return res.json().message;
//   };

//   const updateEmployeePhoto = async (fileUrl) => {
//     await fetch(`${ERP_BASE_URL}/api/resource/Employee/${employeeData.name}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//         'Cookie': `sid=${sid}`,
//       },
//       body: JSON.stringify({ image: fileUrl }),
//     });
//   };

//   const calculateSectionHeight = (sectionName) => {
//     switch (sectionName) {
//       case 'employee':
//         return 220;
//       case 'company':
//         return 180;
//       case 'contact':
//         return 250;
//       case 'salary':
//         return 180;
//       default:
//         return 200;
//     }
//   };

//   const renderSectionContent = (sectionName) => {
//     let content;
//     switch (sectionName) {
//       case 'employee':
//         content = (
//           <ScrollView 
//             style={styles.sectionScrollView}
//             contentContainerStyle={styles.sectionScrollContent}
//             nestedScrollEnabled={true}
//             showsVerticalScrollIndicator={false}
//           >
//             <View style={styles.infoRow}>
//               <Text style={styles.label}>Employee ID: </Text>
//               <Text style={styles.value}>{employeeData?.name}</Text>
//             </View>
//             <View style={styles.infoRow}>
//               <Text style={styles.label}>Name: </Text>
//               <Text style={styles.value}>{employeeData?.employee_name}</Text>
//             </View>
//             <View style={styles.infoRow}>
//               <Text style={styles.label}>Gender: </Text>
//               <Text style={styles.value}>{employeeData?.gender}</Text>
//             </View>
//             <View style={styles.infoRow}>
//               <Text style={styles.label}>Date of Birth: </Text>
//               <Text style={styles.value}>{employeeData?.date_of_birth || 'N/A'}</Text>
//             </View>
//             <View style={styles.infoRow}>
//               <Text style={styles.label}>Blood Group: </Text>
//               <Text style={styles.value}>{employeeData?.blood_group || 'N/A'}</Text>
//             </View>
//             <View style={styles.infoRow}>
//               <Text style={styles.label}>Marital Status: </Text>
//               <Text style={styles.value}>{employeeData?.marital_status || 'N/A'}</Text>
//             </View>
//           </ScrollView>
//         );
//         break;

//       case 'company':
//         content = (
//           <ScrollView 
//             style={styles.sectionScrollView}
//             contentContainerStyle={styles.sectionScrollContent}
//             nestedScrollEnabled={true}
//             showsVerticalScrollIndicator={false}
//           >
//             <View style={styles.infoRow}>
//               <Text style={styles.label}>Designation: </Text>
//               <Text style={styles.value}>{employeeData?.designation}</Text>
//             </View>
//             <View style={styles.infoRow}>
//               <Text style={styles.label}>Department: </Text>
//               <Text style={styles.value}>{employeeData?.department}</Text>
//             </View>
//             <View style={styles.infoRow}>
//               <Text style={styles.label}>Branch: </Text>
//               <Text style={styles.value}>{employeeData?.branch || 'N/A'}</Text>
//             </View>
//             <View style={styles.infoRow}>
//               <Text style={styles.label}>Joining Date: </Text>
//               <Text style={styles.value}>{employeeData?.date_of_joining}</Text>
//             </View>
//             <View style={styles.infoRow}>
//               <Text style={styles.label}>Employment Type: </Text>
//               <Text style={styles.value}>{employeeData?.employment_type || 'N/A'}</Text>
//             </View>
//           </ScrollView>
//         );
//         break;

//       case 'contact':
//         content = (
//           <ScrollView 
//             style={styles.sectionScrollView}
//             contentContainerStyle={styles.sectionScrollContent}
//             nestedScrollEnabled={true}
//             showsVerticalScrollIndicator={false}
//           >
//             <View style={styles.infoRow}>
//               <Text style={styles.label}>Company Email: </Text>
//               <Text style={styles.value}>{employeeData?.company_email || 'N/A'}</Text>
//             </View>
//             <View style={styles.infoRow}>
//               <Text style={styles.label}>Personal Email: </Text>
//               <Text style={styles.value}>{employeeData?.personal_email || 'N/A'}</Text>
//             </View>
//             <View style={styles.infoRow}>
//               <Text style={styles.label}>Phone: </Text>
//               <Text style={styles.value}>{employeeData?.cell_number || 'N/A'}</Text>
//             </View>
//             <View style={styles.infoRow}>
//               <Text style={styles.label}>Emergency Contact: </Text>
//               <Text style={styles.value}>{employeeData?.emergency_phone_number || 'N/A'}</Text>
//             </View>
//             <View style={styles.infoRow}>
//               <Text style={styles.label}>Current Address: </Text>
//               <Text style={styles.value}>{employeeData?.current_address || 'N/A'}</Text>
//             </View>
//             <View style={styles.infoRow}>
//               <Text style={styles.label}>Permanent Address: </Text>
//               <Text style={styles.value}>{employeeData?.permanent_address || 'N/A'}</Text>
//             </View>
//           </ScrollView>
//         );
//         break;

//       case 'salary':
//         content = (
//           <ScrollView 
//             style={styles.sectionScrollView}
//             contentContainerStyle={styles.sectionScrollContent}
//             nestedScrollEnabled={true}
//             showsVerticalScrollIndicator={false}
//           >
//             <View style={styles.infoRow}>
//               <Text style={styles.label}>Salary Structure: </Text>
//               <Text style={styles.value}>{employeeData?.salary_structure || 'N/A'}</Text>
//             </View>
//             <View style={styles.infoRow}>
//               <Text style={styles.label}>Salary Mode: </Text>
//               <Text style={styles.value}>{employeeData?.salary_mode || 'N/A'}</Text>
//             </View>
//             <View style={styles.infoRow}>
//               <Text style={styles.label}>Bank Name: </Text>
//               <Text style={styles.value}>{employeeData?.bank_name || 'N/A'}</Text>
//             </View>
//             <View style={styles.infoRow}>
//               <Text style={styles.label}>Bank Account: </Text>
//               <Text style={styles.value}>{employeeData?.bank_ac_no || 'N/A'}</Text>
//             </View>
//             <View style={styles.infoRow}>
//               <Text style={styles.label}>PAN Number: </Text>
//               <Text style={styles.value}>{employeeData?.pan_number || 'N/A'}</Text>
//             </View>
//           </ScrollView>
//         );
//         break;

//       default:
//         return null;
//     }

//     return content;
//   };

//   return (
//     <View style={styles.container}>
//       {/* Fixed Profile Header */}
//       <View style={styles.profileHeader}>
//         <View style={styles.imageContainer}>
//           <TouchableOpacity 
//             onPress={() => setShowEditOptions(true)} 
//             activeOpacity={0.8}
//           >
//             <Image
//               source={{ uri: imageUri || 'https://via.placeholder.com/150' }}
//               style={styles.profileImage}
//               resizeMode="cover"
//             />
//             {uploading && (
//               <View style={styles.uploadOverlay}>
//                 <ActivityIndicator size="large" color="#fff" />
//               </View>
//             )}
//             <View style={styles.cameraIcon}>
//               <Icon name="edit" size={20} color="#fff" />
//             </View>
//           </TouchableOpacity>
//         </View>

//         <Text style={styles.name}>{employeeData?.employee_name}</Text>
//         <Text style={styles.designation}>{employeeData?.designation}</Text>
//         <Text style={styles.department}>{employeeData?.department}</Text>
//       </View>

//       {/* Sections Container */}
//       <View style={styles.sectionsContainer}>
//         {['employee', 'company', 'contact', 'salary'].map((section) => (
//           <View key={section} style={styles.sectionContainer}>
//             <TouchableOpacity 
//               style={[
//                 styles.sectionHeader,
//                 expandedSection === section && styles.activeSectionHeader
//               ]}
//               onPress={() => toggleSection(section)}
//             >
//               <View style={styles.sectionHeaderContent}>
//                 <Icon 
//                   name={
//                     section === 'employee' ? 'badge' :
//                     section === 'company' ? 'business' :
//                     section === 'contact' ? 'contact-phone' : 'attach-money'
//                   } 
//                   size={24} 
//                   color={expandedSection === section ? '#fff' : '#555'} 
//                 />
//                 <Text style={[
//                   styles.sectionHeaderText,
//                   expandedSection === section && styles.activeSectionHeaderText
//                 ]}>
//                   {section === 'employee' ? 'Employee Details' :
//                    section === 'company' ? 'Company Information' :
//                    section === 'contact' ? 'Contact Details' : 'Salary & Bank'}
//                 </Text>
//               </View>
//               <Icon 
//                 name={expandedSection === section ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} 
//                 size={24} 
//                 color={expandedSection === section ? '#fff' : '#555'} 
//               />
//             </TouchableOpacity>

//             {expandedSection === section && (
//               <Animated.View 
//                 style={[
//                   styles.animatedSection,
//                   {
//                     height: heightAnim.interpolate({
//                       inputRange: [0, 1],
//                       outputRange: [0, calculateSectionHeight(section)]
//                     }),
//                     opacity: opacityAnim
//                   }
//                 ]}
//               >
//                 {renderSectionContent(section)}
//               </Animated.View>
//             )}
//           </View>
//         ))}
//       </View>

//       {/* Edit Options Modal */}
//       <Modal
//         visible={showEditOptions}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={() => setShowEditOptions(false)}
//       >
//         <TouchableOpacity 
//           style={styles.modalOverlay} 
//           activeOpacity={1}
//           onPress={() => setShowEditOptions(false)}
//         >
//           <View style={styles.editOptionsContainer}>
//             <TouchableOpacity 
//               style={styles.editOption}
//               onPress={() => {
//                 setShowEditOptions(false);
//                 handleImagePick(false);
//               }}
//             >
//               <Icon name="photo-library" size={24} color="#555" />
//               <Text style={styles.editOptionText}>Choose from Gallery</Text>
//             </TouchableOpacity>
//             <View style={styles.separator} />
//             <TouchableOpacity 
//               style={styles.editOption}
//               onPress={() => {
//                 setShowEditOptions(false);
//                 handleImagePick(true);
//               }}
//             >
//               <Icon name="photo-camera" size={24} color="#555" />
//               <Text style={styles.editOptionText}>Take Photo</Text>
//             </TouchableOpacity>
//           </View>
//         </TouchableOpacity>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   profileHeader: {
//     alignItems: 'center',
//     paddingTop: 20,
//     paddingBottom: 15,
//     width: '100%',
//     backgroundColor: '#f8f9fa',
//     position: 'relative',
//   },
//   sectionsContainer: {
//     flex: 1,
//     width: '90%',
//     alignSelf: 'center',
//     paddingBottom: 20,
//   },
//   imageContainer: {
//     position: 'relative',
//     marginBottom: 15,
//   },
//   profileImage: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     borderWidth: 3,
//     borderColor: '#fff',
//     backgroundColor: '#e1e1e1',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 3,
//     elevation: 5,
//   },
//   uploadOverlay: {
//     position: 'absolute',
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   cameraIcon: {
//     position: 'absolute',
//     bottom: 5,
//     right: 5,
//     backgroundColor: '#007bff',
//     borderRadius: 15,
//     width: 30,
//     height: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: '#fff',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   editOptionsContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 10,
//     width: width * 0.8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   editOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//   },
//   editOptionText: {
//     marginLeft: 15,
//     fontSize: 16,
//     color: '#333',
//   },
//   separator: {
//     height: 1,
//     backgroundColor: '#eee',
//     marginVertical: 5,
//   },
//   name: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 5,
//     textAlign: 'center',
//   },
//   designation: {
//     fontSize: 18,
//     color: '#555',
//     marginBottom: 3,
//     textAlign: 'center',
//     fontWeight: '600',
//   },
//   department: {
//     fontSize: 16,
//     color: '#666',
//     marginBottom: 15,
//     textAlign: 'center',
//   },
//   sectionContainer: {
//     marginBottom: 10,
//     borderRadius: 10,
//     overflow: 'hidden',
//     backgroundColor: '#fff',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 15,
//     backgroundColor: '#fff',
//     borderLeftWidth: 4,
//     borderLeftColor: '#007bff',
//   },
//   activeSectionHeader: {
//     backgroundColor: '#007bff',
//     borderLeftColor: '#0056b3',
//   },
//   sectionHeaderContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   sectionHeaderText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     marginLeft: 15,
//   },
//   activeSectionHeaderText: {
//     color: '#fff',
//   },
//   animatedSection: {
//     overflow: 'hidden',
//   },
//   sectionScrollView: {
//     maxHeight: 250,
//   },
//   sectionScrollContent: {
//     padding: 15,
//   },
//   infoRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginVertical: 8,
//     paddingVertical: 5,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   label: {
//     fontSize: 15,
//     color: '#666',
//     fontWeight: '500',
//     flex: 1,
//   },
//   value: {
//     fontSize: 15,
//     color: '#222',
//     fontWeight: '600',
//     flex: 1,
//     textAlign: 'right',
//   },
// });

// export default ProfileScreen;

// profile image with the edit options

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
  ScrollView,
  Animated,
  UIManager,
  Dimensions,
  Modal,
} from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import RNFetchBlob from 'rn-fetch-blob';
import RNFetchBlob from 'react-native-blob-util';
import CookieManager from '@react-native-cookies/cookies';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useCallback} from 'react';




 //const ERP_BASE_URL = 'https://erpnextcloud.cbditsolutions.com';
  //const ERP_BASE_URL = 'https://mpda.in';

const { height, width } = Dimensions.get('window');

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ProfileScreen = ({ route }) => {
  const {  erpUrl } = route.params; 

  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [sid, setSid] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const heightAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [showEditOptions, setShowEditOptions] = useState(false);

  const employeeData = route.params?.employeeData;
  const storageKey = `@profileImage_${employeeData?.name}`;
  const ERP_BASE_URL=erpUrl;




  useEffect(() => {



  

    const loadImage = async () => {
      try {
        const savedImage = await AsyncStorage.getItem(storageKey);
        if (savedImage) {
          setImageUri(savedImage);
        } else if (employeeData?.image) {
          setImageUri(`${ERP_BASE_URL}${employeeData.image}?t=${Date.now()}`);
        }
      } catch {
        Alert.alert('Error', 'Failed to load profile image');
      }
    };

    const loadSession = async () => {
      try {
        const cookies = await CookieManager.get(ERP_BASE_URL);
        if (cookies.sid?.value) {
          setSid(cookies.sid.value);
        } else {
          Alert.alert('Session Expired', 'Please login again');
        }
      } catch {
        Alert.alert('Error', 'Failed to load session');
      }
    };

    loadImage();
    loadSession();
  }, []);




  const toggleSection = (sectionName) => {
    if (expandedSection === sectionName) {
      // Collapse the section
      Animated.parallel([
        Animated.timing(heightAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start(() => {
        setExpandedSection(null);
      });
    } else {
      // Expand the section
      setExpandedSection(sectionName);
      Animated.parallel([
        Animated.timing(heightAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch {
        Alert.alert('Error', 'Failed to request camera permission');
        return false;
      }
    }
    return true;
  };

  const requestGalleryPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const permission = Platform.Version >= 33
          ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

        const granted = await PermissionsAndroid.request(permission);
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch {
        Alert.alert('Error', 'Failed to request gallery permission');
        return false;
      }
    }
    return true;
  };

  const handleImagePick = async (fromCamera = false) => {
    setShowEditOptions(false);
    
    try {
      let result;
      if (fromCamera) {
        const hasCameraPermission = await requestCameraPermission();
        if (!hasCameraPermission) return;
        
        result = await launchCamera({
          mediaType: 'photo',
          quality: 0.8,
          includeBase64: false,
        });
      } else {
        const hasGalleryPermission = await requestGalleryPermission();
        if (!hasGalleryPermission) return;
        
        result = await launchImageLibrary({
          mediaType: 'photo',
          quality: 0.8,
          includeBase64: false,
        });
      }

      if (result.didCancel || !result.assets?.length) return;

      const selectedUri = result.assets[0].uri;
      await uploadNewImage(selectedUri);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const uploadNewImage = async (uri) => {
    setUploading(true);
    try {
      await deleteExistingFile();
      const uploadResult = await uploadImageFileToERP(uri);
      await updateEmployeePhoto(uploadResult.file_url);

      const freshUri = `${ERP_BASE_URL}${uploadResult.file_url}?t=${Date.now()}`;
      setImageUri(freshUri);
      await AsyncStorage.setItem(storageKey, freshUri);
      Alert.alert('Success', 'Profile image updated successfully');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setUploading(false);
    }
  };

  const deleteExistingFile = async () => {
    if (!employeeData?.image || !sid) return;

    await fetch(`${ERP_BASE_URL}/api/method/erpnext.www.delete_file.delete_file`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `sid=${sid}`,
      },
      body: JSON.stringify({
        file_url: employeeData.image,
        doctype: 'Employee',
        docname: employeeData.name,
      }),
    });
  };

  const uploadImageFileToERP = async (uri) => {
    const filename = `profile_${employeeData.name}_${Date.now()}.jpg`;
    const uploadUrl = `${ERP_BASE_URL}/api/method/upload_file`;

    const res = await RNFetchBlob.fetch('POST', uploadUrl, {
      'Content-Type': 'multipart/form-data',
      'Cookie': `sid=${sid}`,
    }, [
      { name: 'file', filename, type: 'image/jpeg', data: RNFetchBlob.wrap(uri) },
      { name: 'is_private', data: '1' },
      { name: 'doctype', data: 'Employee' },
      { name: 'docname', data: employeeData.name },
      { name: 'fieldname', data: 'image' },
    ]);

    return res.json().message;
  };

  const updateEmployeePhoto = async (fileUrl) => {
    await fetch(`${ERP_BASE_URL}/api/resource/Employee/${employeeData.name}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `sid=${sid}`,
      },
      body: JSON.stringify({ image: fileUrl }),
    });
  };

  const calculateSectionHeight = (sectionName) => {
    switch (sectionName) {
      case 'employee':
        return 220;
      case 'company':
        return 180;
      case 'contact':
        return 250;
      case 'salary':
        return 180;
      default:
        return 200;
    }
  };

  const renderSectionContent = (sectionName) => {
    let content;
    switch (sectionName) {
      case 'employee':
        content = (
          <ScrollView 
            style={styles.sectionScrollView}
            contentContainerStyle={styles.sectionScrollContent}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.infoRow}>
              <Text style={styles.label}>Employee ID: </Text>
              <Text style={styles.value}>{employeeData?.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Name: </Text>
              <Text style={styles.value}>{employeeData?.employee_name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Gender: </Text>
              <Text style={styles.value}>{employeeData?.gender}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Date of Birth: </Text>
              <Text style={styles.value}>{employeeData?.date_of_birth || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Blood Group: </Text>
              <Text style={styles.value}>{employeeData?.blood_group || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Marital Status: </Text>
              <Text style={styles.value}>{employeeData?.marital_status || 'N/A'}</Text>
            </View>
          </ScrollView>
        );
        break;

      case 'company':
        content = (
          <ScrollView 
            style={styles.sectionScrollView}
            contentContainerStyle={styles.sectionScrollContent}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.infoRow}>
              <Text style={styles.label}>Designation: </Text>
              <Text style={styles.value}>{employeeData?.designation}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Department: </Text>
              <Text style={styles.value}>{employeeData?.department}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Branch: </Text>
              <Text style={styles.value}>{employeeData?.branch || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Joining Date: </Text>
              <Text style={styles.value}>{employeeData?.date_of_joining}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Employment Type: </Text>
              <Text style={styles.value}>{employeeData?.employment_type || 'N/A'}</Text>
            </View>
          </ScrollView>
        );
        break;

      case 'contact':
        content = (
          <ScrollView 
            style={styles.sectionScrollView}
            contentContainerStyle={styles.sectionScrollContent}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.infoRow}>
              <Text style={styles.label}>Company Email: </Text>
              <Text style={styles.value}>{employeeData?.company_email || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Personal Email: </Text>
              <Text style={styles.value}>{employeeData?.personal_email || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Phone: </Text>
              <Text style={styles.value}>{employeeData?.cell_number || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Emergency Contact: </Text>
              <Text style={styles.value}>{employeeData?.emergency_phone_number || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Current Address: </Text>
              <Text style={styles.value}>{employeeData?.current_address || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Permanent Address: </Text>
              <Text style={styles.value}>{employeeData?.permanent_address || 'N/A'}</Text>
            </View>
          </ScrollView>
        );
        break;

      case 'salary':
        content = (
          <ScrollView 
            style={styles.sectionScrollView}
            contentContainerStyle={styles.sectionScrollContent}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.infoRow}>
              <Text style={styles.label}>Salary Structure: </Text>
              <Text style={styles.value}>{employeeData?.salary_structure || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Salary Mode: </Text>
              <Text style={styles.value}>{employeeData?.salary_mode || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Bank Name: </Text>
              <Text style={styles.value}>{employeeData?.bank_name || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Bank Account: </Text>
              <Text style={styles.value}>{employeeData?.bank_ac_no || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>PAN Number: </Text>
              <Text style={styles.value}>{employeeData?.pan_number || 'N/A'}</Text>
            </View>
          </ScrollView>
        );
        break;

      default:
        return null;
    }

    return content;
  };

  return (
    <View style={styles.container}>
      {/* Fixed Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.imageContainer}>
          <TouchableOpacity 
            onPress={() => setShowEditOptions(true)} 
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: imageUri || 'https://via.placeholder.com/150' }}
              style={styles.profileImage}
              resizeMode="cover"
            />
            {uploading && (
              <View style={styles.uploadOverlay}>
                <ActivityIndicator size="large" color="#fff" />
              </View>
            )}
            <View style={styles.cameraIcon}>
              <Icon name="edit" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.name}>{employeeData?.employee_name}</Text>
        <Text style={styles.designation}>{employeeData?.designation}</Text>
        <Text style={styles.department}>{employeeData?.department}</Text>
      </View>

      {/* Sections Container */}
      <View style={styles.sectionsContainer}>
        {['employee', 'company', 'contact', 'salary'].map((section) => (
          <View key={section} style={styles.sectionContainer}>
            <TouchableOpacity 
              style={[
                styles.sectionHeader,
                expandedSection === section && styles.activeSectionHeader
              ]}
              onPress={() => toggleSection(section)}
            >
              <View style={styles.sectionHeaderContent}>
                <Icon 
                  name={
                    section === 'employee' ? 'badge' :
                    section === 'company' ? 'business' :
                    section === 'contact' ? 'contact-phone' : 'attach-money'
                  } 
                  size={24} 
                  color={expandedSection === section ? '#fff' : '#555'} 
                />
                <Text style={[
                  styles.sectionHeaderText,
                  expandedSection === section && styles.activeSectionHeaderText
                ]}>
                  {section === 'employee' ? 'Employee Details' :
                   section === 'company' ? 'Company Information' :
                   section === 'contact' ? 'Contact Details' : 'Salary & Bank'}
                </Text>
              </View>
              <Icon 
                name={expandedSection === section ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} 
                size={24} 
                color={expandedSection === section ? '#fff' : '#555'} 
              />
            </TouchableOpacity>

            {expandedSection === section && (
              <Animated.View 
                style={[
                  styles.animatedSection,
                  {
                    height: heightAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, calculateSectionHeight(section)]
                    }),
                    opacity: opacityAnim
                  }
                ]}
              >
                {renderSectionContent(section)}
              </Animated.View>
            )}
          </View>
        ))}
      </View>

      {/* Edit Options Modal */}
      <Modal
        visible={showEditOptions}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowEditOptions(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1}
          onPress={() => setShowEditOptions(false)}
        >
          <View style={styles.editOptionsContainer}>
            <TouchableOpacity 
              style={styles.editOption}
              onPress={() => {
                setShowEditOptions(false);
                handleImagePick(false);
              }}
            >
              <Icon name="photo-library" size={24} color="#555" />
              <Text style={styles.editOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity 
              style={styles.editOption}
              onPress={() => {
                setShowEditOptions(false);
                handleImagePick(true);
              }}
            >
              <Icon name="photo-camera" size={24} color="#555" />
              <Text style={styles.editOptionText}>Take Photo</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 15,
    width: '100%',
    backgroundColor: '#f8f9fa',
    position: 'relative',
  },
  sectionsContainer: {
    flex: 1,
    width: '90%',
    alignSelf: 'center',
    paddingBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#e1e1e1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  uploadOverlay: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#007bff',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editOptionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    width: width * 0.8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  editOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  editOptionText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 5,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  designation: {
    fontSize: 18,
    color: '#555',
    marginBottom: 3,
    textAlign: 'center',
    fontWeight: '600',
  },
  department: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  sectionContainer: {
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
  },
  activeSectionHeader: {
    backgroundColor: '#007bff',
    borderLeftColor: '#0056b3',
  },
  sectionHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 15,
  },
  activeSectionHeaderText: {
    color: '#fff',
  },
  animatedSection: {
    overflow: 'hidden',
  },
  sectionScrollView: {
    maxHeight: 250,
  },
  sectionScrollContent: {
    padding: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },
  value: {
    fontSize: 15,
    color: '#222',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
});

export default ProfileScreen;