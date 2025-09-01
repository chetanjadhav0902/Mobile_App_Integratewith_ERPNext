// fetch only limited leave application from erpnext

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

// const ERP_BASE_URL = 'https://erpnextcloud.cbditsolutions.com';
//const ERP_BASE_URL = 'https://mpda.in';

const LeaveApplicationList = ({ route }) => {
  const { sid, employeeData,erpUrl } = route.params;
  const employeeId = employeeData?.name;
  const ERP_BASE_URL = erpUrl;

  const [leaveList, setLeaveList] = useState([]);
  const [filteredLeaveList, setFilteredLeaveList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    { value: 1, label: 'Jan' },
    { value: 2, label: 'Feb' },
    { value: 3, label: 'Mar' },
    { value: 4, label: 'Apr' },
    { value: 5, label: 'May' },
    { value: 6, label: 'Jun' },
    { value: 7, label: 'Jul' },
    { value: 8, label: 'Aug' },
    { value: 9, label: 'Sep' },
    { value: 10, label: 'Oct' },
    { value: 11, label: 'Nov' },
    { value: 12, label: 'Dec' },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 2 + i);

  const fetchLeaveApplications = async () => {
    try {
      const response = await fetch(
        `${ERP_BASE_URL}/api/resource/Leave Application?fields=["name","employee_name","status","from_date","to_date","docstatus"]&filters=[["employee","=","${employeeId}"]]&limit=0`,
        {
          headers: {
            Cookie: `sid=${sid}`,
          },
        }
      );

      const json = await response.json();
      if (json.data) {
        setLeaveList(json.data);
        filterLeaves(json.data, selectedMonth, selectedYear);
      } else {
        Alert.alert('Error', 'Unable to fetch leave applications.');
      }
    } catch (err) {
      console.error('Fetch Error:', err);
      Alert.alert('Error', 'Failed to fetch leave applications.');
    }
    setLoading(false);
    setRefreshing(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchLeaveApplications();
  };

  const filterLeaves = (leaves, month, year) => {
    const filtered = leaves.filter(leave => {
      const fromDate = new Date(leave.from_date);
      const toDate = new Date(leave.to_date);
      
      return (
        (fromDate.getFullYear() === year && fromDate.getMonth() + 1 === month) ||
        (toDate.getFullYear() === year && toDate.getMonth() + 1 === month) ||
        (fromDate <= new Date(year, month, 0) && 
        toDate >= new Date(year, month - 1, 1))
      );
    });
    setFilteredLeaveList(filtered);
  };

  const getDisplayStatus = (leave) => {
    if (leave.docstatus === 0) {      
      return leave.status === 'Approved' ? 'Draft(Approved)' : leave.status;         
    }                   
    return leave.status;
  };

  useEffect(() => {
    fetchLeaveApplications();
  }, []);

  useEffect(() => {
    if (leaveList.length > 0) {
      filterLeaves(leaveList, selectedMonth, selectedYear);
    }
  }, [selectedMonth, selectedYear, leaveList]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${d.getFullYear().toString().slice(-2)}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Leave Applications</Text>
      
      {/* Filter Dropdowns */}
      <View style={styles.filterContainer}>
        <View style={[styles.pickerWrapper, { flex: 1.5 }]}>
          <Picker
            selectedValue={selectedMonth}
            onValueChange={(itemValue) => setSelectedMonth(itemValue)}
            style={styles.picker}
            mode="dropdown"
            dropdownIconColor="#000000" 
          >
            {months.map((month) => (
              <Picker.Item key={month.value} label={month.label} value={month.value} />
            ))}
          </Picker>
        </View>
        
        <View style={[styles.pickerWrapper, { flex: 1 }]}>
          <Picker
            selectedValue={selectedYear}
            onValueChange={(itemValue) => setSelectedYear(itemValue)}
            style={styles.picker}
            mode="dropdown"
            dropdownIconColor="#000000" 
          >
            {years.map((year) => (
              <Picker.Item key={year} label={year.toString()} value={year} />
            ))}
          </Picker>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="small" color="#3498db" />
      ) : (
        <ScrollView 
          style={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#3498db']}
              tintColor="#3498db"
            />
          }
        >
          <View style={styles.tableHeader}>
            <Text style={[styles.cell, styles.header, { flex: 1.5 }]}>Name</Text>
            <Text style={[styles.cell, styles.header, { flex: 1.2 }]}>Status</Text>
            <Text style={[styles.cell, styles.header, { flex: 1.8 }]}>Dates</Text>
          </View>
          
          {filteredLeaveList.length > 0 ? (
            filteredLeaveList.map((leave, index) => {
              const displayStatus = getDisplayStatus(leave);
              return (
                <View key={index} style={[
                  styles.row,
                  index % 2 === 0 ? styles.evenRow : styles.oddRow
                ]}>
                  <Text style={[styles.cell, { flex: 1.5 }]} numberOfLines={1} ellipsizeMode="tail">
                    {leave.employee_name}
                  </Text>
                  <Text style={[
                    styles.cell, 
                    { flex: 1.2 },
                    displayStatus === 'Approved' && styles.approvedStatus,
                    displayStatus === 'Rejected' && styles.rejectedStatus,
                    displayStatus === 'Cancelled' && styles.cancelledStatus,
                    (displayStatus === 'Draft' || displayStatus === 'Draft(Approved)') && styles.draftStatus,
                  ]}>
                    {displayStatus}
                  </Text>
                  <Text style={[styles.cell, { flex: 1.8 }]}>
                    {formatDate(leave.from_date)} → {formatDate(leave.to_date)}
                  </Text>
                </View>
              );
            })
          ) : (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>No leave applications found</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    
  },
  pickerWrapper: {
    marginHorizontal: 4,
    backgroundColor: '#fff',
    borderRadius: 4,
    elevation: 1,
    overflow: 'hidden',
    
  },
  picker: {
    height: 40,
    width: '100%',
    fontSize: 12,
    color:"#666"
  },
  scrollView: {
    flex: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#3498db',
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  evenRow: {
    backgroundColor: '#fff',
  },
  oddRow: {
    backgroundColor: '#f5f5f5',
  },
  cell: {
    paddingHorizontal: 4,
    textAlign: 'center',
    fontSize: 12,
    color: '#333',
  },
  header: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 12,
  },
  approvedStatus: {
    color: '#2ecc71',
    fontWeight: 'bold',
  },
  rejectedStatus: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  cancelledStatus: {
    color: '#95a5a6',
    fontWeight: 'bold',
  },
  draftStatus: {
    color: '#f39c12',
    fontWeight: 'bold',
  },
  noResults: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  noResultsText: {
    color: '#7f8c8d',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default LeaveApplicationList;

