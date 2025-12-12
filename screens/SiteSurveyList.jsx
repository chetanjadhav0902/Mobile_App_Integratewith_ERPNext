

// // site surveyed by for the sadbhav
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

//   const fetchSurveys = async () => {
//     try {
//       setLoading(true);

//       if (!erpUrl || !sid) throw new Error("Missing erpUrl or sid");

//       // Use ERPNext login email (user_id) as primary identifier
//       const employeeIdentifier = employeeData?.user_id || employeeData?.employee_name;
//       if (!employeeIdentifier) {
//         setSurveys([]);
//         return;
//       }

//       const filters = JSON.stringify([
//         ["surveyed_by", "=", employeeIdentifier]
//       ]);

//       const fields = JSON.stringify([
//         "name",
//         "status",
//         "completed_date",
//         "surveyed_by",
//         "lead",
//         "lead_name",
//         "contact_mail",
//         "capacity",
//         "type_of_mounting",
//         "site_type",
//         "connected_load",
//         "type_of_mounting",
//         "creation",
//         "upload_image",
//         "upload_electric_bill",
//         "storage_space",
//         "remarks",
//       ]);

//       const url = `${erpUrl}/api/resource/Site Survey?fields=${encodeURIComponent(fields)}&filters=${encodeURIComponent(filters)}&limit_page_length=0`;

//       console.log("Fetching Surveys:", url);

//       const response = await fetch(url, {
//         headers: { 
//           Cookie: `sid=${sid}`,
//           'Content-Type': 'application/json'
//         },
//       });

//       if (!response.ok) {
//         const errText = await response.text();
//         console.error("ERPNext fetch error:", errText);
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       const allSurveys = data?.data || [];
//       console.log("Fetched Surveys Count:", allSurveys.length);
//       setSurveys(allSurveys);

//     } catch (error) {
//       console.error("Error fetching surveys:", error);
//       Alert.alert("Error", "Failed to fetch surveys from ERPNext");
//       setSurveys([]);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     if (employeeData && erpUrl && sid) fetchSurveys();
//     else setLoading(false);
//   }, []);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchSurveys();
//   };

//   const getStatusColor = (status) => {
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
//     navigation.navigate('SiteSurveyForm', { 
//       survey: item,
//       sid: sid,
//       erpUrl: erpUrl
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
//         <Text style={styles.leadName}>{item.lead_name || item.lead || 'No Lead Name'}</Text>
        
//         <View style={styles.detailRow}>
//           <Ionicons name="calendar-outline" size={14} color="#666" />
//           <Text style={styles.detailText}>
//             Completed: {item.completed_date ? moment(item.completed_date).format("DD-MM-YYYY") : "Not Completed"}
//           </Text>
//         </View>
        
//         <View style={styles.detailRow}>
//           <Ionicons name="person-outline" size={14} color="#666" />
//           <Text style={styles.detailText}>Surveyed By: {item.surveyed_by || 'Unknown'}</Text>
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

//         <View style={styles.detailRow}>
//           <Ionicons name="image-outline" size={14} color="#666" />
//           <Text style={styles.detailText}>Site Image: {item.upload_image ? "Uploaded" : "Not Uploaded"}</Text>
//         </View>

//         <View style={styles.detailRow}>
//           <Ionicons name="document-outline" size={14} color="#666" />
//           <Text style={styles.detailText}>Electric Bill: {item.upload_electric_bill ? "Uploaded" : "Not Uploaded"}</Text>
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
//           refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3F51B5']} />}
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.listContainer}
//         />
//       )}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#F4F6F9" },
//   loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   loadingText: { marginTop: 12, fontSize: 16, color: '#666' },
//   listContainer: { padding: 10 },
//   emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   noData: { fontSize: 18, fontWeight: 'bold', color: "#666", marginTop: 16 },
//   card: { backgroundColor: "#fff", padding: 15, borderRadius: 12, marginBottom: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
//   cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
//   idText: { fontSize: 16, fontWeight: "bold", color: '#333', flex: 1 },
//   statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
//   statusText: { fontSize: 12, fontWeight: 'bold', color: '#fff' },
//   leadName: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
//   detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
//   detailText: { fontSize: 12, color: '#666', marginLeft: 6 },
// });

// export default SiteSurveyListScreen;






// import React, { useEffect, useState } from "react";
// import { View, ActivityIndicator, StyleSheet } from "react-native";
// import { WebView } from "react-native-webview";

// const LeadListScreen = ({ route }) => {
//   const { sid, erpUrl } = route.params || {};
//   const [url, setUrl] = useState(null);

//   useEffect(() => {
//     // 👉 Load “New Lead” form directly
//     const finalUrl = `${erpUrl}/app/lead/new`;
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
//         document.cookie = "sid=${sid}; path=/;";
//         true;
//       `}
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

// export default LeadListScreen;



// import React, { useEffect, useState } from "react";
// import { View, ActivityIndicator, StyleSheet } from "react-native";
// import { WebView } from "react-native-webview";

// const SiteSurveyScreen = ({ route }) => {
//   const { sid, erpUrl } = route.params || {};
//   const [url, setUrl] = useState(null);

//   useEffect(() => {
//     // 👉 Load “New Site Survey” form directly
//     const finalUrl = `${erpUrl}/app/site-survey/`; 
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
//         document.cookie = "sid=${sid}; path=/;";
//         true;
//       `}
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

// export default SiteSurveyScreen;





// import React, { useEffect, useState } from "react";
// import { View, ActivityIndicator, StyleSheet } from "react-native";
// import { WebView } from "react-native-webview";

// const SiteSurveyScreen = ({ route }) => {
//   const { sid, erpUrl } = route.params || {};
//   const [url, setUrl] = useState(null);

//   useEffect(() => {
//     // 👉 Load “Site Survey” doctype directly
//     const finalUrl = `${erpUrl}/app/site-survey/`;
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

// export default SiteSurveyScreen;






import React, { useEffect, useState, useRef } from "react";
import { View, ActivityIndicator, StyleSheet, BackHandler } from "react-native";
import { WebView } from "react-native-webview";

const LeadScreen = ({ route, navigation }) => {
  const { sid, erpUrl } = route.params || {};
  const [url, setUrl] = useState(null);
  const webviewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    const finalUrl = `${erpUrl}/app/site-survey/`;
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
