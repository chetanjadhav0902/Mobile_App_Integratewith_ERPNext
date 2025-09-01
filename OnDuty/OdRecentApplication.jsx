// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   ActivityIndicator,
// } from 'react-native';
// import moment from 'moment';

// const BASE_URL = 'https://erpnextcloud.cbditsolutions.com';

// const RecentAttendanceRequest = ({ route }) => {
//   const { sid = '', employeeData = {} } = route.params || {};
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchAttendanceRequests();
//   }, []);

//   const fetchAttendanceRequests = async () => {
//     try {
//       const headers = {
//         Cookie: `sid=${sid}`,
//         Accept: 'application/json',
//       };

//       // Get yesterday 00:00:00 and today 23:59:59
//       const fromDate = moment().subtract(1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss');
//       const toDate = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');

//       // Build the filter properly encoded
//       const filters = encodeURIComponent(JSON.stringify([
//         ["employee", "=", employeeData.name],
//         ["creation", ">=", fromDate],
//         ["creation", "<=", toDate]
//       ]));

//       const fields = encodeURIComponent(JSON.stringify([
//         "name", "reason", "from_date", "to_date", "status", "creation"
//       ]));

//       const url = `${BASE_URL}/api/resource/Attendance Request?fields=${fields}&filters=${filters}`;

//       const response = await fetch(url, { headers });
//       const json = await response.json();

//       console.log('Attendance Requests Response:', json);

//       if (json.data) {
//         setRequests(json.data);
//       } else {
//         setRequests([]);
//       }
//     } catch (error) {
//       console.error('Error fetching Attendance Requests:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderItem = ({ item }) => (
//     <View style={styles.item}>
//       <Text style={styles.type}>Reason: {item.reason}</Text>
//       <Text>From: {item.from_date}</Text>
//       <Text>To: {item.to_date}</Text>
//       <Text>Status: {item.status}</Text>
//       <Text>Applied On: {moment(item.creation).format('YYYY-MM-DD HH:mm')}</Text>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Recent Attendance Requests (Today & Yesterday)</Text>
//       {loading ? (
//         <ActivityIndicator size="large" color="blue" />
//       ) : requests.length > 0 ? (
//         <FlatList
//           data={requests}
//           keyExtractor={(item) => item.name}
//           renderItem={renderItem}
//         />
//       ) : (
//         <Text style={styles.noData}>No attendance requests found.</Text>
//       )}
//     </View>
//   );
// };

// export default RecentAttendanceRequest;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 15,
//     backgroundColor: '#f2f2f2',
//   },
//   header: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 15,
//     textAlign: 'center',
//     color: 'black',
//   },
//   item: {
//     backgroundColor: '#fff',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 12,
//     elevation: 3,
//   },
//   type: {
//     fontWeight: 'bold',
//     marginBottom: 5,
//     color: '#333',
//   },
//   noData: {
//     marginTop: 50,
//     textAlign: 'center',
//     color: 'gray',
//   },
// });




import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import moment from 'moment';

// const BASE_URL = 'https://erpnextcloud.cbditsolutions.com';


const RecentAttendanceRequest = ({ route }) => {
  const { sid = '', employeeData = {},erpUrl } = route.params || {};
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = erpUrl;

  useEffect(() => {
    fetchAttendanceRequests();
  }, []);

  const fetchAttendanceRequests = async () => {
    try {
      const headers = {
        Cookie: `sid=${sid}`,
        Accept: 'application/json',
      };

      const fromDate = moment().subtract(1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss');
      const toDate = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');

      const filters = encodeURIComponent(JSON.stringify([
        ["employee", "=", employeeData.name],
        ["creation", ">=", fromDate],
        ["creation", "<=", toDate]
      ]));

      const fields = encodeURIComponent(JSON.stringify([
        "name", "reason", "from_date", "to_date", "creation"
      ]));

      const url = `${BASE_URL}/api/resource/Attendance Request?fields=${fields}&filters=${filters}&limit_page_length=0`;

      console.log("Fetching Attendance Requests for:", employeeData.name);
      console.log("API URL:", url);

      const response = await fetch(url, { headers });
      const json = await response.json();

      if (json.data && Array.isArray(json.data)) {
        console.log("Requests fetched:", json.data.length);
        setRequests(json.data);
      } else {
        console.warn("No requests found:", json);
        setRequests([]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.type}>Reason: {item.reason}</Text>
      <Text style={{color:'black'}}>From: {item.from_date}</Text>
      <Text style={{color:'black'}}>To: {item.to_date}</Text>
      <Text  style={{color:'black'}}>Submitted: {moment(item.creation).format('YYYY-MM-DD HH:mm')}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Attendance Requests (Today & Yesterday)</Text>
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : requests.length > 0 ? (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.name}
          renderItem={renderItem}
        />
      ) : (
        <Text style={styles.noData}>No attendance requests found.</Text>
      )}
    </View>
  );
};

export default RecentAttendanceRequest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f2f2f2',
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: 'black',
  },
  item: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 3,
    color:'black',
  },
  type: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  noData: {
    marginTop: 50,
    textAlign: 'center',
    color: 'gray',
  },
});
