
//////////////// perfectly show leave balance availabel=total-used

// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   Dimensions,
// } from 'react-native';

// const ERP_BASE_URL = 'https://erpnextcloud.cbditsolutions.com';

// const LeaveRequestScreen = ({ navigation, route }) => {
//   const { sid, employeeData } = route.params || {};
//   const [loading, setLoading] = useState(true);
//   const [leaveData, setLeaveData] = useState([]);

//   useEffect(() => {
//     fetchLeaveData();
//   }, []);

//   const fetchLeaveData = async () => {
//     try {
//       const headers = {
//         Cookie: `sid=${sid}`,
//         Accept: 'application/json',
//       };

//       // 1. Fetch Leave Allocation for total leaves
//       const allocResponse = await fetch(
//         `${ERP_BASE_URL}/api/resource/Leave Allocation?fields=["leave_type","total_leaves_allocated"]&filters=[["employee","=","${employeeData.name}"]]`,
//         { headers }
//       );
//       const allocJson = await allocResponse.json();
//       const allocations = allocJson.data || [];

//       // 2. Fetch Leave Ledger Entry for used leaves (docstatus=1, is_expired=false)
//       const ledgerResponse = await fetch(
//         `${ERP_BASE_URL}/api/resource/Leave Ledger Entry?fields=["leave_type","leaves","is_expired","docstatus"]&filters=[["employee","=","${employeeData.name}"]]`,
//         { headers }
//       );
//       const ledgerJson = await ledgerResponse.json();
//       const ledgers = ledgerJson.data || [];

//       // 3. Fetch pending leave applications (docstatus = 0)
//       const pendingResponse = await fetch(
//         `${ERP_BASE_URL}/api/resource/Leave Application?fields=["leave_type","total_leave_days"]&filters=[["employee","=","${employeeData.name}"],["docstatus","=","0"]]`,
//         { headers }
//       );
//       const pendingJson = await pendingResponse.json();
//       const pendingApps = pendingJson.data || [];

//       // 4. Prepare data structure
//       const dataMap = {};

//       // Add allocation info
//       allocations.forEach((alloc) => {
//         dataMap[alloc.leave_type] = {
//           leaveType: alloc.leave_type,
//           total: alloc.total_leaves_allocated || 0,
//           used: 0,
//           pending: 0,
//         };
//       });

//       // Add used leave info
//       ledgers.forEach((entry) => {
//         const type = entry.leave_type;
//         if (!dataMap[type]) {
//           dataMap[type] = { leaveType: type, total: 0, used: 0, pending: 0 };
//         }

//         if (entry.docstatus === 1 && !entry.is_expired) {
//           dataMap[type].used += entry.leaves;
//         }
//       });

//       // Add pending leave info
//       pendingApps.forEach((entry) => {
//         const type = entry.leave_type;
//         if (!dataMap[type]) {
//           dataMap[type] = { leaveType: type, total: 0, used: 0, pending: 0 };
//         }

//         dataMap[type].pending += entry.total_leave_days;
//       });

//       // Final formatted list
//       const tableData = Object.values(dataMap).map((item) => ({
//         ...item,
//         available: (item.total || 0) - (item.used || 0) - (item.pending || 0),
//       }));

//       setLeaveData(tableData);
//     } catch (error) {
//       console.error('Error fetching leave data:', error);
//       Alert.alert('Error', 'Failed to load leave balances');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <TouchableOpacity
//         style={styles.section}
//         onPress={() =>
//           navigation.navigate('LeaveApplicationForm', { sid, employeeData })
//         }
//       >
//         <Text style={styles.heading}>Leave Application</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.section}
//         onPress={() =>
//           navigation.navigate('RecentApplication', { sid, employeeData })
//         }
//       >
//         <Text style={styles.heading}>Recent Application</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.section}
//         onPress={() =>
//           navigation.navigate('ApplicationStatus', { sid, employeeData })
//         }
//       >
//         <Text style={styles.heading}>Application Status</Text>
//       </TouchableOpacity>

//       {/* Leave Balance Table */}
//       <View style={styles.section}>
//         <Text style={styles.heading}>Leave Balance</Text>
//         {loading ? (
//           <ActivityIndicator size="small" color="#0000ff" />
//         ) : (
//           <View style={styles.table}>
//             <View style={styles.tableHeader}>
//               <Text style={styles.tableCellHeader}>Type</Text>
//               <Text style={styles.tableCellHeader}>Total</Text>
//               <Text style={styles.tableCellHeader}>Used</Text>
//               <Text style={styles.tableCellHeader}>Pending</Text>
//               <Text style={styles.tableCellHeader}>Available</Text>
//             </View>
//             {leaveData.map((item, index) => (
//               <View style={styles.tableRow} key={index}>
//                 <Text style={styles.tableCell}>{item.leaveType}</Text>
//                 <Text style={styles.tableCell}>{item.total}</Text>
//                 <Text style={styles.tableCell}>{item.used}</Text>
//                 <Text style={styles.tableCell}>{item.pending}</Text>
//                 <Text style={styles.tableCell}>{item.available}</Text>
//               </View>
//             ))}
//           </View>
//         )}
//       </View>
//     </ScrollView>
//   );
// };

// export default LeaveRequestScreen;

// const screenWidth = Dimensions.get('window').width;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 15,
//     backgroundColor: '#f2f2f2',
//   },
//   section: {
//     backgroundColor: '#ffffff',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 20,
//     elevation: 2,
//   },
//   heading: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: 'black',
//     textAlign: 'center',
//   },
//   table: {
//     marginTop: 10,
//   },
//   tableHeader: {
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     borderColor: '#ccc',
//     paddingBottom: 5,
//     marginBottom: 5,
//   },
//   tableRow: {
//     flexDirection: 'row',
//     paddingVertical: 6,
//     borderBottomWidth: 1,
//     borderColor: '#f0f0f0',
//   },
//   tableCellHeader: {
//     flex: 1,
//     fontWeight: 'bold',
//     fontSize: 12,
//     color: '#333',
//     textAlign: 'center',
//   },
//   tableCell: {
//     flex: 1,
//     fontSize: 12,
//     textAlign: 'center',
//     color: '#444',
//   },
// });

/// leave balance table with Available=total-used 

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';

// const ERP_BASE_URL = 'https://erpnextcloud.cbditsolutions.com';
//const ERP_BASE_URL = 'https://mpda.in';


const LeaveRequestScreen = ({ navigation, route }) => {
  const { sid, employeeData,erpUrl } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [leaveData, setLeaveData] = useState([]);
  const ERP_BASE_URL = erpUrl;

  useEffect(() => {
    fetchLeaveData();
  }, []);

  const fetchLeaveData = async () => {
    try {
      const headers = {
        Cookie: `sid=${sid}`,
        Accept: 'application/json',
      };

      // 1. Leave Allocations
      const allocResponse = await fetch(
        `${ERP_BASE_URL}/api/resource/Leave Allocation?fields=["leave_type","total_leaves_allocated"]&filters=[["employee","=","${employeeData.name}"]]`,
        { headers }
      );
      const allocJson = await allocResponse.json();
      const allocations = allocJson.data || [];

      // 2. Used Leaves from Ledger (only debits)
      const ledgerResponse = await fetch(
        `${ERP_BASE_URL}/api/resource/Leave Ledger Entry?fields=["leave_type","leaves","is_expired","docstatus"]&filters=[["employee","=","${employeeData.name}"]]`,
        { headers }
      );
      const ledgerJson = await ledgerResponse.json();
      const ledgers = ledgerJson.data || [];

      // 3. Pending Leave Applications
      const pendingResponse = await fetch(
  `${ERP_BASE_URL}/api/resource/Leave Application?fields=["leave_type","total_leave_days"]&filters=[["employee","=","${employeeData.name}"],["status","=","Open"]]`,
  { headers }
);
const pendingJson = await pendingResponse.json();
const pendingApps = pendingJson.data || [];

      // Combine all into map
      const dataMap = {};

      // Allocated
      allocations.forEach((alloc) => {
        const type = alloc.leave_type;
        dataMap[type] = {
          leaveType: type,
          total: Number(alloc.total_leaves_allocated) || 0,
          used: 0,
          pending: 0,
        };
      });

      // Used from ledger (only subtract leaves < 0, confirmed and not expired)
      ledgers.forEach((entry) => {
        const type = entry.leave_type;
        if (!dataMap[type]) {
          dataMap[type] = { leaveType: type, total: 0, used: 0, pending: 0 };
        }

        if (entry.docstatus === 1 && !entry.is_expired && Number(entry.leaves) < 0) {
          dataMap[type].used += Math.abs(Number(entry.leaves));
        }
      });

      // Pending leave apps
      pendingApps.forEach((entry) => {
        const type = entry.leave_type;
        if (!dataMap[type]) {
          dataMap[type] = { leaveType: type, total: 0, used: 0, pending: 0 };
        }

        dataMap[type].pending += Number(entry.total_leave_days) || 0;
      });

      // Final leave summary
      const tableData = Object.values(dataMap).map((item) => {
        const total = item.total || 0;
        const used = item.used || 0;
        const pending = item.pending || 0;
        const available = Math.max(total - used, 0);

        return {
          ...item,
          used: used.toFixed(2),
          pending: pending.toFixed(2),
          available: available.toFixed(2),
        };
      });

      setLeaveData(tableData);
    } catch (error) {
      console.error('Error fetching leave data:', error);
      Alert.alert('Error', 'Failed to load leave balances');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.section}
        onPress={() =>
          navigation.navigate('LeaveApplicationForm', { sid, employeeData,erpUrl })
        }
      >
        <Text style={styles.heading}>Leave Application</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.section}
        onPress={() =>
          navigation.navigate('RecentApplication', { sid, employeeData,erpUrl })
        }
      >
        <Text style={styles.heading}>Recent Application</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.section}
        onPress={() =>
          navigation.navigate('ApplicationStatus', { sid, employeeData,erpUrl })
        }
      >
        <Text style={styles.heading}>Application Status</Text>
      </TouchableOpacity>

      {/* Leave Balance Table */}
      <View style={styles.section}>
        <Text style={styles.heading}>Leave Balance</Text>
        {loading ? (
          <ActivityIndicator size="small" color="#0000ff" />
        ) : (
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableCellHeader}>Type</Text>
              <Text style={styles.tableCellHeader}>Total</Text>
              <Text style={styles.tableCellHeader}>Used</Text>
              <Text style={styles.tableCellHeader}>Pending</Text>
              <Text style={styles.tableCellHeader}>Available</Text>
            </View>
            {leaveData.map((item, index) => (
              <View style={styles.tableRow} key={index}>
                <Text style={styles.tableCell}>{item.leaveType}</Text>
                <Text style={styles.tableCell}>{item.total}</Text>
                <Text style={styles.tableCell}>{item.used}</Text>
                <Text style={styles.tableCell}>{item.pending}</Text>
                <Text style={styles.tableCell}>{item.available}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default LeaveRequestScreen;

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#FFF5F5',
  },
  section: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  heading: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
    textAlign: 'center',
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 5,
    marginBottom: 5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  tableCellHeader: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    textAlign: 'center',
    color: '#444',
  },
});
