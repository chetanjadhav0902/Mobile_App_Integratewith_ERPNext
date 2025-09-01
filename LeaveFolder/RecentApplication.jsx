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
//const BASE_URL = 'https://mpda.in';

const RecentApplication = ({ route }) => {
  const { sid = '', employeeData = {}, erpUrl } = route.params || {};
  const [leaveApps, setLeaveApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = erpUrl;

  useEffect(() => {
    fetchLeaveApplications();
  }, []);

  const fetchLeaveApplications = async () => {
    try {
      const headers = {
        Cookie: `sid=${sid}`,
        Accept: 'application/json',
      };

      const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
      const filterDate = `${yesterday} 00:00:00`;

      const url = `${BASE_URL}/api/resource/Leave Application?fields=["name","leave_type","from_date","to_date","status","creation"]&filters=[["employee","=","${employeeData.name}"],["creation",">=","${filterDate}"]]`;

      const response = await fetch(url, { headers });
      const json = await response.json();

      if (json.data) {
        setLeaveApps(json.data);
      }
    } catch (error) {
      console.error('Error fetching leave applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.type}>Type: {item.leave_type}</Text>
      <Text style={{color:'black'}}>From: {item.from_date}</Text>
      <Text style={{color:'black'}}>To: {item.to_date}</Text>
      <Text style={{color:'black'}}>Status:<Text style={[item.status === 'Approved' && {color: 'green'},
  item.status === 'Rejected' && {color: 'red'},
  item.status === 'Open' && {color: 'skyblue'}]}> {item.status} </Text></Text>
     
      <Text style={{color:'black',fontWeight:'bold'}}>Applied On: {moment(item.creation).format('YYYY-MM-DD HH:mm')}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recent Leave Applications (Submitted Today or Yesterday)</Text>
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : leaveApps.length > 0 ? (
        <FlatList
          data={leaveApps}
          keyExtractor={(item) => item.name}
          renderItem={renderItem}
        />
      ) : (
        <Text style={styles.noData}>No leave applications found.</Text>
      )}
    </View>
  );
};

export default RecentApplication;

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
    
  },
  type: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  noData: {
    marginTop: 50,
    textAlign: 'center',
    color: 'gray',
  },
});
