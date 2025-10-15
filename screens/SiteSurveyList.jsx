// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   ActivityIndicator,
//   SafeAreaView,
//   RefreshControl,
//   Alert,
//   TouchableOpacity,
// } from "react-native";
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import moment from "moment";

// const SiteSurveyListScreen = ({ route, navigation }) => {
//   const { sid, employeeData, erpUrl } = route.params || {};
//   const [surveys, setSurveys] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   // Safe function to get employee identifiers
//   const getEmployeeIdentifiers = () => {
//     const identifiers = [];
    
//     // Safely check and add each identifier
//     if (employeeData && typeof employeeData === 'object') {
//       // Employee ID
//       if (employeeData.name && typeof employeeData.name === 'string') {
//         identifiers.push(employeeData.name);
//       }
      
//       // Employee Name
//       if (employeeData.employee_name && typeof employeeData.employee_name === 'string') {
//         identifiers.push(employeeData.employee_name);
//       }
      
//       // Company Email (user_id)
//       if (employeeData.user_id && typeof employeeData.user_id === 'string') {
//         identifiers.push(employeeData.user_id);
//       }
      
//       // Personal Email
//       if (employeeData.personal_email && typeof employeeData.personal_email === 'string') {
//         identifiers.push(employeeData.personal_email);
//       }
//     }
    
//     return identifiers;
//   };

//   const fetchSurveys = async () => {
//     try {
//       setLoading(true);

//       // Check if required parameters are available
//       if (!erpUrl || !sid) {
//         throw new Error("Missing required parameters: erpUrl or sid");
//       }

//       const url = `${erpUrl}/api/resource/Site Survey?fields=${encodeURIComponent(JSON.stringify([
//         "name",
//         "status", 
//         "completed_date",
//         "surveyed_by",
//         "lead",
//         "lead_name",
//         "contact_mail",
//         "site_type",
//         "capacity",
//         "location_details",
//         "structure",
//         "creation"
//       ]))}&limit_page_length=1000`;

//       const response = await fetch(url, {
//         headers: { 
//           Cookie: `sid=${sid}`,
//           'Content-Type': 'application/json'
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       const allSurveys = data?.data || [];
      
//       // Get all possible employee identifiers
//       const employeeIdentifiers = getEmployeeIdentifiers();
      
//       if (employeeIdentifiers.length === 0) {
//         setSurveys([]);
//         return;
//       }

//       // Filter surveys - check multiple possible fields and formats
//       const filtered = allSurveys.filter(survey => {
//         if (!survey.surveyed_by) return false;
        
//         const surveyedBy = survey.surveyed_by.toString().trim().toLowerCase();
        
//         // Check against all possible employee identifiers
//         return employeeIdentifiers.some(identifier => {
//           if (!identifier) return false;
//           return surveyedBy === identifier.toString().trim().toLowerCase();
//         });
//       });

//       setSurveys(filtered);
//     } catch (error) {
//       console.error("Error fetching surveys:", error);
//       Alert.alert("Error", "Failed to fetch surveys");
//       setSurveys([]);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     if (employeeData && erpUrl && sid) {
//       fetchSurveys();
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchSurveys();
//   };

//   const getStatusColor = (status) => {
//     if (!status) return '#666';
    
//     switch (status) {
//       case 'Completed': return '#4CAF50';
//       case 'In Progress': return '#FFA500';
//       case 'Pending': return '#F44336';
//       case 'Approved': return '#2196F3';
//       case 'Rejected': return '#9E9E9E';
//       default: return '#666';
//     }
//   };

//   const handleSurveyPress = (item) => {
//     // Only pass necessary data to avoid console clutter
//     navigation.navigate('SiteSurveyForm', { 
//       survey: item,
//       sid: sid,
//       erpUrl: erpUrl
//       // Don't pass entire employeeData object
//     });
//   };

//   const renderSurvey = ({ item }) => (
//     <TouchableOpacity 
//       style={styles.card}
//       onPress={() => handleSurveyPress(item)}
//     >
//       <View style={styles.cardHeader}>
//         <Text style={styles.idText}>ID: {item.name || 'N/A'}</Text>
//         <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
//           <Text style={styles.statusText}>{item.status || 'Unknown'}</Text>
//         </View>
//       </View>
      
//       <View style={styles.cardBody}>
//         <Text style={styles.leadName}>
//           {item.lead || 'No Lead Name'}
//         </Text>
        
//         <View style={styles.detailRow}>
//           <Ionicons name="calendar-outline" size={14} color="#666" />
//           <Text style={styles.detailText}>
//             Completed: {item.completed_date ? moment(item.completed_date).format("DD-MM-YYYY") : "Not Completed"}
//           </Text>
//         </View>
        
//         <View style={styles.detailRow}>
//           <Ionicons name="person-outline" size={14} color="#666" />
//           <Text style={styles.detailText}>
//             Surveyed By: {item.surveyed_by || 'Unknown'}
//           </Text>
//         </View>
        
//         {item.site_type && (
//           <View style={styles.detailRow}>
//             <Ionicons name="business-outline" size={14} color="#666" />
//             <Text style={styles.detailText}>Site Type: {item.site_type}</Text>
//           </View>
//         )}
        
//         {item.capacity && (
//           <View style={styles.detailRow}>
//             <Ionicons name="flash-outline" size={14} color="#666" />
//             <Text style={styles.detailText}>Capacity: {item.capacity}</Text>
//           </View>
//         )}
//       </View>
//     </TouchableOpacity>
//   );

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#3F51B5" />
//           <Text style={styles.loadingText}>Loading surveys...</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       {surveys.length === 0 ? (
//         <View style={styles.emptyContainer}>
//           <Ionicons name="business-outline" size={64} color="#ccc" />
//           <Text style={styles.noData}>No surveys found</Text>
//         </View>
//       ) : (
//         <FlatList
//           data={surveys}
//           keyExtractor={(item) => item.name || Math.random().toString()}
//           renderItem={renderSurvey}
//           refreshControl={
//             <RefreshControl 
//               refreshing={refreshing} 
//               onRefresh={onRefresh} 
//               colors={['#3F51B5']}
//             />
//           }
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.listContainer}
//         />
//       )}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     backgroundColor: "#F4F6F9" 
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 16,
//     color: '#666',
//   },
//   listContainer: {
//     padding: 10,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   noData: { 
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: "#666", 
//     marginTop: 16,
//   },
//   card: {
//     backgroundColor: "#fff",
//     padding: 15,
//     borderRadius: 12,
//     marginBottom: 10,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   idText: { 
//     fontSize: 16, 
//     fontWeight: "bold", 
//     color: '#333',
//     flex: 1,
//   },
//   statusBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   statusText: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   leadName: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 8,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   detailText: {
//     fontSize: 12,
//     color: '#666',
//     marginLeft: 6,
//   },
// });

// export default SiteSurveyListScreen;









// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   ActivityIndicator,
//   SafeAreaView,
//   RefreshControl,
//   Alert,
//   TouchableOpacity,
// } from "react-native";
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import moment from "moment";

// const SiteSurveyListScreen = ({ route, navigation }) => {
//   const { sid, employeeData, erpUrl } = route.params || {};
//   const [surveys, setSurveys] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   // Safe function to get employee identifiers
//   const getEmployeeIdentifiers = () => {
//     const identifiers = [];
    
//     // Safely check and add each identifier
//     if (employeeData && typeof employeeData === 'object') {
//       // Employee ID
//       if (employeeData.name && typeof employeeData.name === 'string') {
//         identifiers.push(employeeData.name);
//       }
      
//       // Employee Name
//       if (employeeData.employee_name && typeof employeeData.employee_name === 'string') {
//         identifiers.push(employeeData.employee_name);
//       }
      
//       // Company Email (user_id)
//       if (employeeData.user_id && typeof employeeData.user_id === 'string') {
//         identifiers.push(employeeData.user_id);
//       }
      
//       // Personal Email
//       if (employeeData.personal_email && typeof employeeData.personal_email === 'string') {
//         identifiers.push(employeeData.personal_email);
//       }
//     }
    
//     return identifiers;
//   };

//   const fetchSurveys = async () => {
//     try {
//       setLoading(true);

//       // Check if required parameters are available
//       if (!erpUrl || !sid) {
//         throw new Error("Missing required parameters: erpUrl or sid");
//       }

//       const url = `${erpUrl}/api/resource/Site Survey?fields=${encodeURIComponent(JSON.stringify([
//         "name",
//         "status", 
//         "completed_date",
//         "surveyed_by",
//         "lead",
//         "lead_name",
//         "contact_mail",
//         "site_type",
//         "capacity",
//         "location_details",
//         "structure",
//         "creation",
//         "upload_image",
//         "upload_electric_bill"
//       ]))}&limit_page_length=0`;

//       const response = await fetch(url, {
//         headers: { 
//           Cookie: `sid=${sid}`,
//           'Content-Type': 'application/json'
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       const allSurveys = data?.data || [];
      
//       // Get all possible employee identifiers
//       const employeeIdentifiers = getEmployeeIdentifiers();
      
//       if (employeeIdentifiers.length === 0) {
//         setSurveys([]);
//         return;
//       }

//       // Filter surveys - check multiple possible fields and formats
//       const filtered = allSurveys.filter(survey => {
//         if (!survey.surveyed_by) return false;
        
//         const surveyedBy = survey.surveyed_by.toString().trim().toLowerCase();
        
//         // Check against all possible employee identifiers
//         return employeeIdentifiers.some(identifier => {
//           if (!identifier) return false;
//           return surveyedBy === identifier.toString().trim().toLowerCase();
//         });
//       });

//       setSurveys(filtered);
//     } catch (error) {
//       console.error("Error fetching surveys:", error);
//       Alert.alert("Error", "Failed to fetch surveys");
//       setSurveys([]);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     if (employeeData && erpUrl && sid) {
//       fetchSurveys();
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchSurveys();
//   };

//   const getStatusColor = (status) => {
//     if (!status) return '#666';
    
//     switch (status) {
//       case 'Completed': return '#4CAF50';
//       case 'In Progress': return '#FFA500';
//       case 'Pending': return '#F44336';
//       case 'Approved': return '#2196F3';
//       case 'Rejected': return '#9E9E9E';
//       default: return '#666';
//     }
//   };

//   const handleSurveyPress = (item) => {
//     // Only pass necessary data to avoid console clutter
//     navigation.navigate('SiteSurveyForm', { 
//       survey: item,
//       sid: sid,
//       erpUrl: erpUrl
//       // Don't pass entire employeeData object
//     });
//   };

//   const renderSurvey = ({ item }) => (
//     <TouchableOpacity 
//       style={styles.card}
//       onPress={() => handleSurveyPress(item)}
//     >
//       <View style={styles.cardHeader}>
//         <Text style={styles.idText}>ID: {item.name || 'N/A'}</Text>
//         <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
//           <Text style={styles.statusText}>{item.status || 'Unknown'}</Text>
//         </View>
//       </View>
      
//       <View style={styles.cardBody}>
//         <Text style={styles.leadName}>
//           {item.lead_name || item.lead || 'No Lead Name'}
//         </Text>
        
//         <View style={styles.detailRow}>
//           <Ionicons name="calendar-outline" size={14} color="#666" />
//           <Text style={styles.detailText}>
//             Completed: {item.completed_date ? moment(item.completed_date).format("DD-MM-YYYY") : "Not Completed"}
//           </Text>
//         </View>
        
//         <View style={styles.detailRow}>
//           <Ionicons name="person-outline" size={14} color="#666" />
//           <Text style={styles.detailText}>
//             Surveyed By: {item.surveyed_by || 'Unknown'}
//           </Text>
//         </View>
        
//         {item.site_type && (
//           <View style={styles.detailRow}>
//             <Ionicons name="business-outline" size={14} color="#666" />
//             <Text style={styles.detailText}>Site Type: {item.site_type}</Text>
//           </View>
//         )}
        
//         {item.capacity && (
//           <View style={styles.detailRow}>
//             <Ionicons name="flash-outline" size={14} color="#666" />
//             <Text style={styles.detailText}>Capacity: {item.capacity}</Text>
//           </View>
//         )}

//         {/* Show image status */}
//         <View style={styles.detailRow}>
//           <Ionicons name="image-outline" size={14} color="#666" />
//           <Text style={styles.detailText}>
//             Site Image: {item.upload_image ? "Uploaded" : "Not Uploaded"}
//           </Text>
//         </View>

//         <View style={styles.detailRow}>
//           <Ionicons name="document-outline" size={14} color="#666" />
//           <Text style={styles.detailText}>
//             Electric Bill: {item.upload_electric_bill ? "Uploaded" : "Not Uploaded"}
//           </Text>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#3F51B5" />
//           <Text style={styles.loadingText}>Loading surveys...</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       {surveys.length === 0 ? (
//         <View style={styles.emptyContainer}>
//           <Ionicons name="business-outline" size={64} color="#ccc" />
//           <Text style={styles.noData}>No surveys found</Text>
//         </View>
//       ) : (
//         <FlatList
//           data={surveys}
//           keyExtractor={(item) => item.name || Math.random().toString()}
//           renderItem={renderSurvey}
//           refreshControl={
//             <RefreshControl 
//               refreshing={refreshing} 
//               onRefresh={onRefresh} 
//               colors={['#3F51B5']}
//             />
//           }
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.listContainer}
//         />
//       )}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     backgroundColor: "#F4F6F9" 
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 16,
//     color: '#666',
//   },
//   listContainer: {
//     padding: 10,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   noData: { 
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: "#666", 
//     marginTop: 16,
//   },
//   card: {
//     backgroundColor: "#fff",
//     padding: 15,
//     borderRadius: 12,
//     marginBottom: 10,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   idText: { 
//     fontSize: 16, 
//     fontWeight: "bold", 
//     color: '#333',
//     flex: 1,
//   },
//   statusBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   statusText: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   leadName: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 8,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   detailText: {
//     fontSize: 12,
//     color: '#666',
//     marginLeft: 6,
//   },
// });

// export default SiteSurveyListScreen;




// site surveyed by for the sadbhav



import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from "moment";

const SiteSurveyListScreen = ({ route, navigation }) => {
  const { sid, employeeData, erpUrl } = route.params || {};
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSurveys = async () => {
    try {
      setLoading(true);

      if (!erpUrl || !sid) throw new Error("Missing erpUrl or sid");

      // Use ERPNext login email (user_id) as primary identifier
      const employeeIdentifier = employeeData?.user_id || employeeData?.employee_name;
      if (!employeeIdentifier) {
        setSurveys([]);
        return;
      }

      const filters = JSON.stringify([
        ["surveyed_by", "=", employeeIdentifier]
      ]);

      const fields = JSON.stringify([
        "name",
        "status",
        "completed_date",
        "surveyed_by",
        "lead",
        "lead_name",
        "contact_mail",
        "capacity",
        "type_of_mounting",
        "site_type",
        "connected_load",
        "type_of_mounting",
        "creation",
        "upload_image",
        "upload_electric_bill",
        "storage_space",
        "remarks",
      ]);

      const url = `${erpUrl}/api/resource/Site Survey?fields=${encodeURIComponent(fields)}&filters=${encodeURIComponent(filters)}&limit_page_length=0`;

      console.log("Fetching Surveys:", url);

      const response = await fetch(url, {
        headers: { 
          Cookie: `sid=${sid}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("ERPNext fetch error:", errText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const allSurveys = data?.data || [];
      console.log("Fetched Surveys Count:", allSurveys.length);
      setSurveys(allSurveys);

    } catch (error) {
      console.error("Error fetching surveys:", error);
      Alert.alert("Error", "Failed to fetch surveys from ERPNext");
      setSurveys([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (employeeData && erpUrl && sid) fetchSurveys();
    else setLoading(false);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchSurveys();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return '#4CAF50';
      case 'In Progress': return '#FFA500';
      case 'Pending': return '#F44336';
      case 'Approved': return '#2196F3';
      case 'Rejected': return '#9E9E9E';
      default: return '#666';
    }
  };

  const handleSurveyPress = (item) => {
    navigation.navigate('SiteSurveyForm', { 
      survey: item,
      sid: sid,
      erpUrl: erpUrl
    });
  };

  const renderSurvey = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => handleSurveyPress(item)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.idText}>ID: {item.name || 'N/A'}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status || 'Unknown'}</Text>
        </View>
      </View>
      
      <View style={styles.cardBody}>
        <Text style={styles.leadName}>{item.lead_name || item.lead || 'No Lead Name'}</Text>
        
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={14} color="#666" />
          <Text style={styles.detailText}>
            Completed: {item.completed_date ? moment(item.completed_date).format("DD-MM-YYYY") : "Not Completed"}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="person-outline" size={14} color="#666" />
          <Text style={styles.detailText}>Surveyed By: {item.surveyed_by || 'Unknown'}</Text>
        </View>
        
        {item.site_type && (
          <View style={styles.detailRow}>
            <Ionicons name="business-outline" size={14} color="#666" />
            <Text style={styles.detailText}>Site Type: {item.site_type}</Text>
          </View>
        )}
        
        {item.capacity && (
          <View style={styles.detailRow}>
            <Ionicons name="flash-outline" size={14} color="#666" />
            <Text style={styles.detailText}>Capacity: {item.capacity}</Text>
          </View>
        )}

        <View style={styles.detailRow}>
          <Ionicons name="image-outline" size={14} color="#666" />
          <Text style={styles.detailText}>Site Image: {item.upload_image ? "Uploaded" : "Not Uploaded"}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="document-outline" size={14} color="#666" />
          <Text style={styles.detailText}>Electric Bill: {item.upload_electric_bill ? "Uploaded" : "Not Uploaded"}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3F51B5" />
          <Text style={styles.loadingText}>Loading surveys...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {surveys.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="business-outline" size={64} color="#ccc" />
          <Text style={styles.noData}>No surveys found</Text>
        </View>
      ) : (
        <FlatList
          data={surveys}
          keyExtractor={(item) => item.name || Math.random().toString()}
          renderItem={renderSurvey}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3F51B5']} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F9" },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 16, color: '#666' },
  listContainer: { padding: 10 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  noData: { fontSize: 18, fontWeight: 'bold', color: "#666", marginTop: 16 },
  card: { backgroundColor: "#fff", padding: 15, borderRadius: 12, marginBottom: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  idText: { fontSize: 16, fontWeight: "bold", color: '#333', flex: 1 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: 'bold', color: '#fff' },
  leadName: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  detailText: { fontSize: 12, color: '#666', marginLeft: 6 },
});

export default SiteSurveyListScreen;
