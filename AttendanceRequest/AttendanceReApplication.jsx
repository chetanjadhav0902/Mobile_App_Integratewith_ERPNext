

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
  const { sid = '', employeeData = {}, erpUrl } = route.params || {};
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
        // ✅ Filter out Work From Home and On Duty
        const filteredData = json.data.filter(
          (item) => item.reason !== "Work From Home" && item.reason !== "On Duty"
        );
        setRequests(filteredData);
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
      <Text style={{ color: 'black' }}>From: {item.from_date}</Text>
      <Text style={{ color: 'black' }}>To: {item.to_date}</Text>
      <Text style={{ color: 'black' }}>Submitted: {moment(item.creation).format('YYYY-MM-DD HH:mm')}</Text>
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
    color: 'black',
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
