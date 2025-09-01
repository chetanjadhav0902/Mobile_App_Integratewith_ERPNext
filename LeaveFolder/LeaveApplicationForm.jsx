// import React, { useState, useEffect } from 'react';
// import { 
//   View, 
//   Text, 
//   TextInput, 
//   StyleSheet, 
//   Alert, 
//   TouchableOpacity, 
//   ActivityIndicator, 
//   ScrollView,
//   Modal,
//   FlatList 
// } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { Picker } from '@react-native-picker/picker';

// const ERP_BASE_URL = 'https://erpnextcloud.cbditsolutions.com';

// const LeaveApplicationForm = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { sid } = route.params;
  
//   const [employeeData, setEmployeeData] = useState(null);
//   const [leaveType, setLeaveType] = useState('');
//   const [fromDate, setFromDate] = useState(new Date());
//   const [toDate, setToDate] = useState(new Date());
//   const [description, setDescription] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [showFromPicker, setShowFromPicker] = useState(false);
//   const [showToPicker, setShowToPicker] = useState(false);
//   const [leaveTypes, setLeaveTypes] = useState([]);
//   const [apiError, setApiError] = useState(null);
//   const [allocationPeriod, setAllocationPeriod] = useState(null);
//   const [existingLeaves, setExistingLeaves] = useState([]);
//   const [showBalanceModal, setShowBalanceModal] = useState(false);
//   const [detailedLeaveBalances, setDetailedLeaveBalances] = useState([]);
//   const [totalLeaveDays, setTotalLeaveDays] = useState(0);

//   // Fetch employee data when component mounts
//   useEffect(() => {
//     const fetchEmployeeData = async () => {
//       try {
//         setIsLoading(true);
//         setApiError(null);
        
//         const userResponse = await fetch(
//           `${ERP_BASE_URL}/api/method/frappe.auth.get_logged_user`,
//           {
//             method: 'GET',
//             headers: {
//               'Cookie': `sid=${sid}`,
//               'Content-Type': 'application/json',
//               'X-Requested-With': 'XMLHttpRequest'
//             }
//           }
//         );

//         if (!userResponse.ok) {
//           throw new Error(`Failed to get user: ${userResponse.status}`);
//         }

//         const userData = await userResponse.json();
//         const userId = userData.message;

//         const empResponse = await fetch(
//           `${ERP_BASE_URL}/api/resource/Employee?filters=[["user_id","=","${userId}"]]&fields=["name","employee_name","company","leave_approver","department"]`,
//           {
//             method: 'GET',
//             headers: {
//               'Cookie': `sid=${sid}`,
//               'Content-Type': 'application/json',
//               'X-Requested-With': 'XMLHttpRequest'
//             }
//           }
//         );

//         if (!empResponse.ok) {
//           throw new Error(`Failed to get employee: ${empResponse.status}`);
//         }

//         const empData = await empResponse.json();
        
//         if (!empData.data || empData.data.length === 0) {
//           throw new Error('No employee record found for this user');
//         }

//         const employeeDetails = {
//           employee: empData.data[0].name,
//           employee_name: empData.data[0].employee_name,
//           company: empData.data[0].company,
//           leave_approver: empData.data[0].leave_approver,
//           department: empData.data[0].department
//         };

//         setEmployeeData(employeeDetails);

//       } catch (error) {
//         setApiError(`Employee data error: ${error.message}`);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchEmployeeData();
//   }, []);

//   // Fetch leave types when employee data is available
//   useEffect(() => {
//     if (!employeeData) return;

//     const fetchLeaveTypes = async () => {
//       try {
//         setIsLoading(true);
//         setApiError(null);
        
//         const allocationsResponse = await fetch(
//           `${ERP_BASE_URL}/api/resource/Leave Allocation?filters=[["employee","=","${employeeData.employee}"],["docstatus","=",1]]&fields=["leave_type"]`,
//           {
//             method: 'GET',
//             headers: {
//               'Cookie': `sid=${sid}`,
//               'Content-Type': 'application/json',
//               'X-Requested-With': 'XMLHttpRequest'
//             }
//           }
//         );

//         let assignedLeaveTypes = [];
        
//         if (allocationsResponse.ok) {
//           const allocationsData = await allocationsResponse.json();
//           if (allocationsData.data && allocationsData.data.length > 0) {
//             assignedLeaveTypes = allocationsData.data.map(item => item.leave_type);
//           }
//         }

//         const response = await fetch(
//           `${ERP_BASE_URL}/api/resource/Leave Type?fields=["name"]`,
//           {
//             method: 'GET',
//             headers: {
//               'Cookie': `sid=${sid}`,
//               'Content-Type': 'application/json',
//               'X-Requested-With': 'XMLHttpRequest'
//             }
//           }
//         );

//         let leaveTypesData = [];
        
//         if (response.ok) {
//           const data = await response.json();
//           leaveTypesData = data.data
//             .filter(item => assignedLeaveTypes.includes(item.name))
//             .map(item => ({
//               name: item.name,
//               displayName: item.name
//             }));
//         }

//         if (leaveTypesData.length === 0) {
//           throw new Error('No leave types allocated to this employee');
//         }

//         setLeaveTypes(leaveTypesData);
//         setLeaveType(leaveTypesData[0].name);
//       } catch (error) {
//         setApiError(`Leave types error: ${error.message}`);
//         setLeaveTypes([]);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchLeaveTypes();
//   }, [employeeData]);

//   // Check for existing leaves when dates or leave type changes
//   useEffect(() => {
//     if (!leaveType || !employeeData) return;
    
//     const checkExistingLeaves = async () => {
//       try {
//         const response = await fetch(
//           `${ERP_BASE_URL}/api/resource/Leave Application?filters=[["employee","=","${employeeData.employee}"],["leave_type","=","${leaveType}"],["from_date","<=","${formatDate(toDate)}"],["to_date",">=","${formatDate(fromDate)}"],["status","!=","Rejected"],["docstatus","=",1]]&fields=["name","from_date","to_date","status"]`,
//           {
//             method: 'GET',
//             headers: {
//               'Cookie': `sid=${sid}`,
//               'Content-Type': 'application/json',
//               'X-Requested-With': 'XMLHttpRequest'
//             }
//           }
//         );

//         if (response.ok) {
//           const data = await response.json();
//           setExistingLeaves(data.data || []);
//         }
//       } catch (error) {
//         // Silently handle error, we'll show alert when user tries to submit
//       }
//     };
    
//     checkExistingLeaves();
//   }, [leaveType, fromDate, toDate]);

//   // Calculate total leave days when dates change
//   useEffect(() => {
//     const diffTime = Math.abs(toDate - fromDate);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
//     setTotalLeaveDays(diffDays);
//   }, [fromDate, toDate]);

//   const fetchDetailedLeaveBalances = async () => {
//     try {
//       setIsLoading(true);
//       setApiError(null);
      
//       // Get allocated leave types
//       const allocationsResponse = await fetch(
//         `${ERP_BASE_URL}/api/resource/Leave Allocation?filters=[["employee","=","${employeeData.employee}"],["docstatus","=",1]]&fields=["leave_type"]`,
//         {
//           method: 'GET',
//           headers: {
//             'Cookie': `sid=${sid}`,
//             'Content-Type': 'application/json',
//             'X-Requested-With': 'XMLHttpRequest'
//           }
//         }
//       );

//       let allocatedLeaveTypes = [];
      
//       if (allocationsResponse.ok) {
//         const allocationsData = await allocationsResponse.json();
//         if (allocationsData.data && allocationsData.data.length > 0) {
//           allocatedLeaveTypes = allocationsData.data.map(item => item.leave_type);
//         }
//       }

//       if (allocatedLeaveTypes.length === 0) {
//         throw new Error('No leave types allocated to this employee');
//       }

//       // Fetch leave ledger entries
//       const ledgerResponse = await fetch(
//         `${ERP_BASE_URL}/api/resource/Leave Ledger Entry?filters=[["employee","=","${employeeData.employee}"],["leave_type","in",${JSON.stringify(allocatedLeaveTypes)}],["docstatus","=",1]]&fields=["leave_type","leaves","is_expired"]`,
//         {
//           method: 'GET',
//           headers: {
//             'Cookie': `sid=${sid}`,
//             'Content-Type': 'application/json',
//             'X-Requested-With': 'XMLHttpRequest'
//           }
//         }
//       );

//       if (!ledgerResponse.ok) {
//         throw new Error('Failed to fetch leave ledger entries');
//       }

//       const ledgerData = await ledgerResponse.json();
      
//       if (!ledgerData.data || ledgerData.data.length === 0) {
//         throw new Error('No leave ledger entries found for this employee');
//       }

//       // Process ledger entries
//       const leaveBalances = {};
      
//       ledgerData.data.forEach(entry => {
//         const leaveType = entry.leave_type;
//         const leaves = parseFloat(entry.leaves) || 0;
        
//         if (!leaveBalances[leaveType]) {
//           leaveBalances[leaveType] = {
//             leave_type: leaveType,
//             total_leaves: 0,
//             expired_leaves: 0,
//             leaves_taken: 0,
//             pending_leaves: 0,
//             remaining_leaves: 0
//           };
//         }
        
//         if (leaves > 0) {
//           leaveBalances[leaveType].total_leaves += leaves;
//         } else {
//           if (entry.is_expired === 1) {
//             leaveBalances[leaveType].expired_leaves += Math.abs(leaves);
//           } else {
//             leaveBalances[leaveType].leaves_taken += Math.abs(leaves);
//           }
//         }
//       });

//       // Fetch pending leaves (both Open and Approved but unsubmitted)
//       const pendingLeavesResponse = await fetch(
//         `${ERP_BASE_URL}/api/resource/Leave Application?filters=[["employee","=","${employeeData.employee}"],["status","in",["Open","Approved"]],["docstatus","=",1]]&fields=["leave_type","total_leave_days","status"]`,
//         {
//           method: 'GET',
//           headers: {
//             'Cookie': `sid=${sid}`,
//             'Content-Type': 'application/json',
//             'X-Requested-With': 'XMLHttpRequest'
//           }
//         }
//       );

//       if (pendingLeavesResponse.ok) {
//         const pendingData = await pendingLeavesResponse.json();
//         if (pendingData.data && pendingData.data.length > 0) {
//           pendingData.data.forEach(leave => {
//             if (leaveBalances[leave.leave_type]) {
//               leaveBalances[leave.leave_type].pending_leaves += parseFloat(leave.total_leave_days) || 0;
//             }
//           });
//         }
//       }

//       // Calculate remaining leaves
//       Object.keys(leaveBalances).forEach(leaveType => {
//         const balance = leaveBalances[leaveType];
//         balance.remaining_leaves = balance.total_leaves - balance.leaves_taken - balance.expired_leaves;
//       });

//       const balancesArray = Object.values(leaveBalances).sort((a, b) => 
//         a.leave_type.localeCompare(b.leave_type)
//       );

//       setDetailedLeaveBalances(balancesArray);
//       setShowBalanceModal(true);
//     } catch (error) {
//       Alert.alert('Error', error.message || 'Failed to fetch leave balance details');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleLeaveTypeChange = (value) => {
//     setLeaveType(value);
//   };

//   const validateDatesAgainstAllocation = () => {
//     if (!allocationPeriod) return true;
    
//     const from = new Date(fromDate).setHours(0, 0, 0, 0);
//     const to = new Date(toDate).setHours(0, 0, 0, 0);
//     const allocationFrom = new Date(allocationPeriod.from_date).setHours(0, 0, 0, 0);
//     const allocationTo = new Date(allocationPeriod.to_date).setHours(0, 0, 0, 0);
    
//     if (from < allocationFrom || to > allocationTo) {
//       Alert.alert(
//         'Invalid Dates',
//         `Your leave application must be between ${formatDisplayDate(new Date(allocationPeriod.from_date))} and ${formatDisplayDate(new Date(allocationPeriod.to_date))}`,
//         [{ text: 'OK' }]
//       );
//       return false;
//     }
    
//     return true;
//   };

//   const checkForExistingLeaves = () => {
//     if (existingLeaves.length > 0) {
//       const conflictMessages = existingLeaves.map(leave => 
//         `You already have ${leaveType} leave from ${formatDisplayDate(new Date(leave.from_date))} to ${formatDisplayDate(new Date(leave.to_date))} (Status: ${leave.status})`
//       ).join('\n\n');
      
//       Alert.alert(
//         'Leave Conflict',
//         `You cannot apply for leave on these dates:\n\n${conflictMessages}`,
//         [{ text: 'OK' }]
//       );
//       return false;
//     }
//     return true;
//   };

//   const submitLeave = async () => {
//     if (!leaveType) {
//       Alert.alert('Error', 'Please select a leave type');
//       return;
//     }
    
//     if (!description.trim()) {
//       Alert.alert('Error', 'Please enter a reason for leave');
//       return;
//     }
    
//     if (toDate < fromDate) {
//       Alert.alert('Error', 'End date cannot be before start date');
//       return;
//     }

//     if (!validateDatesAgainstAllocation()) {
//       return;
//     }

//     if (!checkForExistingLeaves()) {
//       return;
//     }

//     // Get current leave balance
//     try {
//       setIsLoading(true);
      
//       const response = await fetch(
//         `${ERP_BASE_URL}/api/method/hrms.hr.doctype.leave_application.leave_application.get_leave_balance_on`,
//         {
//           method: 'POST',
//           headers: {
//             'Cookie': `sid=${sid}`,
//             'Content-Type': 'application/json',
//             'X-Requested-With': 'XMLHttpRequest'
//           },
//           body: JSON.stringify({
//             employee: employeeData.employee,
//             leave_type: leaveType,
//             date: formatDate(fromDate)
//           })
//         }
//       );

//       if (response.ok) {
//         const result = await response.json();
//         const balance = result.message;
        
//         if (balance <= 0) {
//           Alert.alert(
//             'No Leave Balance', 
//             `You have no available balance for ${leaveType}`,
//             [{ text: 'OK' }]
//           );
//           return;
//         }

//         if (totalLeaveDays > balance) {
//           Alert.alert(
//             'Insufficient Leave Balance', 
//             `You only have ${balance} days available for ${leaveType}`,
//             [
//               { text: 'Cancel', style: 'cancel' },
//               { text: 'Continue Anyway', onPress: () => submitLeaveApplication() }
//             ]
//           );
//           return;
//         }

//         submitLeaveApplication();
//       } else {
//         throw new Error('Failed to check leave balance');
//       }
//     } catch (error) {
//       Alert.alert('Error', error.message || 'Failed to check leave balance');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const submitLeaveApplication = async () => {
//     setIsLoading(true);
//     setApiError(null);
    
//     try {
//       const payload = {
//         doctype: "Leave Application",
//         employee: employeeData.employee,
//         employee_name: employeeData.employee_name,
//         leave_type: leaveType,
//         from_date: formatDate(fromDate),
//         to_date: formatDate(toDate),
//         description: description,
//         status: 'Open',
//         company: employeeData.company,
//         leave_approver: employeeData.leave_approver || 'Administrator',
//         department: employeeData.department
//       };

//       const response = await fetch(
//         `${ERP_BASE_URL}/api/resource/Leave%20Application`,
//         {
//           method: 'POST',
//           headers: {
//             'Cookie': `sid=${sid}`,
//             'Content-Type': 'application/json',
//             'Accept': 'application/json',
//             'X-Requested-With': 'XMLHttpRequest'
//           },
//           body: JSON.stringify({ data: payload })
//         }
//       );

//       const result = await response.json();
      
//       if (!response.ok) {
//         let errorMessage = 'Submission failed';
//         if (result._server_messages) {
//           try {
//             const serverMessages = JSON.parse(result._server_messages);
//             if (Array.isArray(serverMessages)) {
//               errorMessage = JSON.parse(serverMessages[0]).message;
//             }
//           } catch (e) {
//             // Ignore parsing errors
//           }
//         }
//         throw new Error(errorMessage || result.message || result.exc || 'Submission failed');
//       }

//       if (result.data) {
//         Alert.alert(
//           'Success', 
//           'Leave application submitted for approval!',
//           [{ text: 'OK', onPress: () => navigation.goBack() }]
//         );
//       } else {
//         throw new Error('Invalid response from server');
//       }
//     } catch (error) {
//       setApiError(error.message);
//       Alert.alert('Error', error.message || 'Failed to submit leave application');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const formatDate = (date) => {
//     return date.toISOString().split('T')[0];
//   };

//   const formatDisplayDate = (date) => {
//     return date.toLocaleDateString('en-GB', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   const renderBalanceItem = ({ item }) => (
//     <View style={styles.balanceRow}>
//       <Text style={[styles.balanceCell, styles.leaveTypeCell]}>{item.leave_type}</Text>
//       <Text style={styles.balanceCell}>{item.total_leaves.toFixed(2)}</Text>
//       <Text style={styles.balanceCell}>{item.expired_leaves.toFixed(2)}</Text>
//       <Text style={styles.balanceCell}>{item.leaves_taken.toFixed(2)}</Text>
//       <Text style={styles.balanceCell}>{item.pending_leaves.toFixed(2)}</Text>
//       <Text style={styles.balanceCell}>{item.remaining_leaves.toFixed(2)}</Text>
//     </View>
//   );

//   if (!employeeData) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" />
//         <Text style={styles.loadingText}>
//           {apiError || 'Loading employee data...'}
//         </Text>
//         {apiError && (
//           <TouchableOpacity 
//             style={styles.retryButton}
//             onPress={() => navigation.goBack()}
//           >
//             <Text style={styles.retryButtonText}>Go Back</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     );
//   }

//   return (
//     <ScrollView 
//       style={styles.container} 
//       contentContainerStyle={styles.contentContainer}
//       keyboardShouldPersistTaps="handled"
//     >
//       <Text style={styles.header}>Apply for Leave</Text>
      
//       <View style={styles.infoBox}>
//         <Text style={styles.infoText}>Employee: {employeeData.employee_name}</Text>
//         <Text style={styles.infoText}>Company: {employeeData.company}</Text>
//       </View>

//       <TouchableOpacity 
//         style={styles.balanceButton}
//         onPress={fetchDetailedLeaveBalances}
//         disabled={isLoading}
//       >
//         <Text style={styles.balanceButtonText}>View Leave Balance</Text>
//       </TouchableOpacity>

//       <View style={styles.section}>
//         <Text style={styles.label}>Leave Type:</Text>
//         {isLoading && leaveTypes.length === 0 ? (
//           <ActivityIndicator style={styles.loader} />
//         ) : leaveTypes.length === 0 ? (
//           <Text style={styles.errorText}>
//             {apiError || 'No leave types available for your employee record'}
//           </Text>
//         ) : (
//           <View style={styles.pickerContainer}>
//             <Picker
//               selectedValue={leaveType}
//               style={styles.picker}
//               onValueChange={handleLeaveTypeChange}
//             >
//               {leaveTypes.map((type, index) => (
//                 <Picker.Item 
//                   key={index} 
//                   label={type.displayName} 
//                   value={type.name} 
//                 />
//               ))}
//             </Picker>
//           </View>
//         )}
//       </View>

//       {existingLeaves.length > 0 && (
//         <View style={[styles.balanceBox, { backgroundColor: '#fff3e0' }]}>
//           <Text style={[styles.balanceText, { color: '#e65100', fontWeight: 'bold' }]}>
//             Existing Leaves Conflict:
//           </Text>
//           {existingLeaves.map((leave, index) => (
//             <Text key={index} style={[styles.balanceText, { color: '#e65100' }]}>
//               {formatDisplayDate(new Date(leave.from_date))} to {formatDisplayDate(new Date(leave.to_date))} (Status: {leave.status})
//             </Text>
//           ))}
//         </View>
//       )}

//       <View style={styles.section}>
//         <Text style={styles.label}>Leave Dates:</Text>
//         <View style={styles.row}>
//           <TouchableOpacity 
//             style={styles.dateButton} 
//             onPress={() => setShowFromPicker(true)}
//             disabled={isLoading}
//           >
//             <Text style={styles.dateButtonText}>From: {formatDisplayDate(fromDate)}</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             style={styles.dateButton} 
//             onPress={() => setShowToPicker(true)}
//             disabled={isLoading}
//           >
//             <Text style={styles.dateButtonText}>To: {formatDisplayDate(toDate)}</Text>
//           </TouchableOpacity>
//         </View>

//         {showFromPicker && (
//           <DateTimePicker
//             value={fromDate}
//             mode="date"
//             display="default"
//             minimumDate={new Date()}
//             onChange={(e, date) => {
//               setShowFromPicker(false);
//               if (date) {
//                 setFromDate(date);
//                 if (date > toDate) {
//                   setToDate(date);
//                 }
//               }
//             }}
//           />
//         )}

//         {showToPicker && (
//           <DateTimePicker
//             value={toDate}
//             mode="date"
//             display="default"
//             minimumDate={fromDate}
//             onChange={(e, date) => {
//               setShowToPicker(false);
//               if (date) setToDate(date);
//             }}
//           />
//         )}
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.label}>Reason for Leave:</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter reason for leave (required)"
//           placeholderTextColor="#999"
//           value={description}
//           onChangeText={setDescription}
//           multiline
//           numberOfLines={4}
//           editable={!isLoading}
//         />
//       </View>

//       {apiError && (
//         <View style={styles.errorBox}>
//           <Text style={styles.errorText}>{apiError}</Text>
//         </View>
//       )}

//       <TouchableOpacity 
//         style={[
//           styles.button, 
//           (isLoading || !leaveType) && styles.disabledButton
//         ]} 
//         onPress={submitLeave}
//         disabled={isLoading || !leaveType}
//       >
//         {isLoading ? (
//           <ActivityIndicator color="white" />
//         ) : (
//           <Text style={styles.buttonText}>Submit for Approval</Text>
//         )}
//       </TouchableOpacity>

//       {/* Leave Balance Modal */}
//       <Modal
//         visible={showBalanceModal}
//         animationType="slide"
//         transparent={false}
//         onRequestClose={() => setShowBalanceModal(false)}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>Leave Balance Details</Text>
//             <TouchableOpacity 
//               style={styles.closeButton}
//               onPress={() => setShowBalanceModal(false)}
//             >
//               <Text style={styles.closeButtonText}>Close</Text>
//             </TouchableOpacity>
//           </View>
          
//           <ScrollView horizontal>
//             <View>
//               <View style={styles.balanceHeader}>
//                 <Text style={[styles.headerCell, styles.leaveTypeHeader]}>Leave Type</Text>
//                 <Text style={styles.headerCell}>Total</Text>
//                 <Text style={styles.headerCell}>Expired</Text>
//                 <Text style={styles.headerCell}>Used</Text>
//                 <Text style={styles.headerCell}>Pending</Text>
//                 <Text style={styles.headerCell}>Available</Text>
//               </View>
              
//               <FlatList
//                 data={detailedLeaveBalances}
//                 renderItem={renderBalanceItem}
//                 keyExtractor={(item, index) => index.toString()}
//                 ListEmptyComponent={
//                   <Text style={styles.noDataText}>No leave balance data available</Text>
//                 }
//               />
//             </View>
//           </ScrollView>
//         </View>
//       </Modal>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   contentContainer: {
//     padding: 20,
//     paddingBottom: 40,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   loadingText: {
//     marginTop: 20,
//     fontSize: 16,
//     color: '#333',
//     textAlign: 'center',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//     color: '#2c3e50',
//   },
//   section: {
//     marginBottom: 20,
//   },
//   infoBox: {
//     backgroundColor: '#e3f2fd',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 20,
//   },
//   infoText: {
//     fontSize: 14,
//     color: 'black',
//     marginBottom: 5,
//     paddingLeft: 10,
//   },
//   pickerContainer: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     overflow: 'hidden',
//     backgroundColor: 'white',
//   },
//   picker: {
//     height: 50,
//     width: '100%',
//   },
//   loader: {
//     padding: 15,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 10,
//     color: '#2c3e50',
//   },
//   balanceBox: {
//     backgroundColor: '#e8f5e9',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 20,
//   },
//   balanceText: {
//     fontSize: 15,
//     color: '#2e7d32',
//     marginBottom: 5,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   dateButton: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     padding: 15,
//     borderRadius: 8,
//     width: '48%',
//     backgroundColor: 'white',
//   },
//   dateButtonText: {
//     color: '#333',
//     textAlign: 'center',
//     fontSize: 14,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     padding: 15,
//     borderRadius: 8,
//     minHeight: 120,
//     backgroundColor: 'white',
//     textAlignVertical: 'top',
//     fontSize: 16,
//     color: '#333',
//   },
//   button: {
//     backgroundColor: '#4CAF50',
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//     elevation: 2,
//     marginTop: 10,
//   },
//   disabledButton: {
//     backgroundColor: '#a5d6a7',
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   errorBox: {
//     backgroundColor: '#ffebee',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 20,
//   },
//   errorText: {
//     color: '#c62828',
//     fontSize: 14,
//     textAlign: 'center',
//   },
//   retryButton: {
//     marginTop: 20,
//     padding: 12,
//     backgroundColor: '#2196F3',
//     borderRadius: 6,
//   },
//   retryButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   balanceButton: {
//     backgroundColor: '#2196F3',
//     padding: 12,
//     borderRadius: 6,
//     marginBottom: 20,
//     alignItems: 'center',
//   },
//   balanceButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   modalContainer: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//     paddingBottom: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#2c3e50',
//   },
//   closeButton: {
//     padding: 8,
//   },
//   closeButtonText: {
//     color: '#2196F3',
//     fontWeight: 'bold',
//   },
//   balanceHeader: {
//     flexDirection: 'row',
//     backgroundColor: '#f0f0f0',
//     paddingVertical: 10,
//     marginBottom: 5,
//   },
//   headerCell: {
//     width: 80,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     fontSize: 12,
//   },
//   leaveTypeHeader: {
//     width: 120,
//     textAlign: 'left',
//     paddingLeft: 5,
//   },
//   balanceRow: {
//     flexDirection: 'row',
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   balanceCell: {
//     width: 80,
//     textAlign: 'center',
//     fontSize: 12,
//   },
//   leaveTypeCell: {
//     width: 120,
//     textAlign: 'left',
//     paddingLeft: 5,
//   },
//   noDataText: {
//     textAlign: 'center',
//     marginTop: 20,
//     color: '#666',
//   },
// });

// export default LeaveApplicationForm;



// import React, { useState, useEffect } from 'react';
// import { 
//   View, 
//   Text, 
//   TextInput, 
//   StyleSheet, 
//   Alert, 
//   TouchableOpacity, 
//   ActivityIndicator, 
//   ScrollView,
//   FlatList 
// } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { Picker } from '@react-native-picker/picker';

// const ERP_BASE_URL = 'https://erpnextcloud.cbditsolutions.com';

// const LeaveApplicationForm = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { sid } = route.params;
  
//   const [employeeData, setEmployeeData] = useState(null);
//   const [leaveType, setLeaveType] = useState('Leave Without Pay');
//   const [fromDate, setFromDate] = useState(new Date());
//   const [toDate, setToDate] = useState(new Date());
//   const [description, setDescription] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [showFromPicker, setShowFromPicker] = useState(false);
//   const [showToPicker, setShowToPicker] = useState(false);
//   const [leaveTypes, setLeaveTypes] = useState([]);
//   const [apiError, setApiError] = useState(null);
//   const [existingLeaves, setExistingLeaves] = useState([]);
//   const [totalLeaveDays, setTotalLeaveDays] = useState(0);

//   // Fetch employee data when component mounts
//   useEffect(() => {
//     const fetchEmployeeData = async () => {
//       try {
//         setIsLoading(true);
//         setApiError(null);
        
//         const userResponse = await fetch(
//           `${ERP_BASE_URL}/api/method/frappe.auth.get_logged_user`,
//           {
//             method: 'GET',
//             headers: {
//               'Cookie': `sid=${sid}`,
//               'Content-Type': 'application/json',
//               'X-Requested-With': 'XMLHttpRequest'
//             }
//           }
//         );

//         if (!userResponse.ok) {
//           throw new Error(`Failed to get user: ${userResponse.status}`);
//         }

//         const userData = await userResponse.json();
//         const userId = userData.message;

//         const empResponse = await fetch(
//           `${ERP_BASE_URL}/api/resource/Employee?filters=[["user_id","=","${userId}"]]&fields=["name","employee_name","company","leave_approver","department"]`,
//           {
//             method: 'GET',
//             headers: {
//               'Cookie': `sid=${sid}`,
//               'Content-Type': 'application/json',
//               'X-Requested-With': 'XMLHttpRequest'
//             }
//           }
//         );

//         if (!empResponse.ok) {
//           throw new Error(`Failed to get employee: ${empResponse.status}`);
//         }

//         const empData = await empResponse.json();
        
//         if (!empData.data || empData.data.length === 0) {
//           throw new Error('No employee record found for this user');
//         }

//         const employeeDetails = {
//           employee: empData.data[0].name,
//           employee_name: empData.data[0].employee_name,
//           company: empData.data[0].company,
//           leave_approver: empData.data[0].leave_approver,
//           department: empData.data[0].department
//         };

//         setEmployeeData(employeeDetails);

//       } catch (error) {
//         setApiError(`Employee data error: ${error.message}`);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchEmployeeData();
//   }, []);

//   // Fetch leave types when employee data is available
//   useEffect(() => {
//     if (!employeeData) return;

//     const fetchLeaveTypes = async () => {
//       try {
//         setIsLoading(true);
//         setApiError(null);
        
//         // Always include "Leave Without Pay" option
//         const leaveTypesData = [{
//           name: 'Leave Without Pay',
//           displayName: 'Leave Without Pay'
//         }];

//         // Fetch allocated leave types
//         const allocationsResponse = await fetch(
//           `${ERP_BASE_URL}/api/resource/Leave Allocation?filters=[["employee","=","${employeeData.employee}"],["docstatus","=",1]]&fields=["leave_type"]`,
//           {
//             method: 'GET',
//             headers: {
//               'Cookie': `sid=${sid}`,
//               'Content-Type': 'application/json',
//               'X-Requested-With': 'XMLHttpRequest'
//             }
//           }
//         );

//         if (allocationsResponse.ok) {
//           const allocationsData = await allocationsResponse.json();
//           if (allocationsData.data && allocationsData.data.length > 0) {
//             const assignedLeaveTypes = allocationsData.data.map(item => item.leave_type);
            
//             const response = await fetch(
//               `${ERP_BASE_URL}/api/resource/Leave Type?fields=["name"]`,
//               {
//                 method: 'GET',
//                 headers: {
//                   'Cookie': `sid=${sid}`,
//                   'Content-Type': 'application/json',
//                   'X-Requested-With': 'XMLHttpRequest'
//                 }
//               }
//             );

//             if (response.ok) {
//               const data = await response.json();
//               data.data
//                 .filter(item => assignedLeaveTypes.includes(item.name))
//                 .forEach(item => {
//                   leaveTypesData.push({
//                     name: item.name,
//                     displayName: item.name
//                   });
//                 });
//             }
//           }
//         }

//         setLeaveTypes(leaveTypesData);
//         setLeaveType('Leave Without Pay');
//       } catch (error) {
//         // Even if there's an error, keep "Leave Without Pay" option
//         setLeaveTypes([{
//           name: 'Leave Without Pay',
//           displayName: 'Leave Without Pay'
//         }]);
//         setLeaveType('Leave Without Pay');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchLeaveTypes();
//   }, [employeeData]);

//   // Check for existing leaves when dates or leave type changes
//   useEffect(() => {
//     if (!leaveType || !employeeData) return;
    
//     // Skip check for "Leave Without Pay"
//     if (leaveType === 'Leave Without Pay') {
//       setExistingLeaves([]);
//       return;
//     }
    
//     const checkExistingLeaves = async () => {
//       try {
//         const response = await fetch(
//           `${ERP_BASE_URL}/api/resource/Leave Application?filters=[["employee","=","${employeeData.employee}"],["leave_type","=","${leaveType}"],["from_date","<=","${formatDate(toDate)}"],["to_date",">=","${formatDate(fromDate)}"],["status","!=","Rejected"],["docstatus","=",1]]&fields=["name","from_date","to_date","status"]`,
//           {
//             method: 'GET',
//             headers: {
//               'Cookie': `sid=${sid}`,
//               'Content-Type': 'application/json',
//               'X-Requested-With': 'XMLHttpRequest'
//             }
//           }
//         );

//         if (response.ok) {
//           const data = await response.json();
//           setExistingLeaves(data.data || []);
//         }
//       } catch (error) {
//         // Silently handle error, we'll show alert when user tries to submit
//       }
//     };
    
//     checkExistingLeaves();
//   }, [leaveType, fromDate, toDate]);

//   // Calculate total leave days when dates change
//   useEffect(() => {
//     const diffTime = Math.abs(toDate - fromDate);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
//     setTotalLeaveDays(diffDays);
//   }, [fromDate, toDate]);

//   const handleLeaveTypeChange = (value) => {
//     setLeaveType(value);
//   };

//   const checkForExistingLeaves = () => {
//     if (leaveType === 'Leave Without Pay') return true;
    
//     if (existingLeaves.length > 0) {
//       const conflictMessages = existingLeaves.map(leave => 
//         `You already have ${leaveType} leave from ${formatDisplayDate(new Date(leave.from_date))} to ${formatDisplayDate(new Date(leave.to_date))} (Status: ${leave.status})`
//       ).join('\n\n');
      
//       Alert.alert(
//         'Leave Conflict',
//         `You cannot apply for leave on these dates:\n\n${conflictMessages}`,
//         [{ text: 'OK' }]
//       );
//       return false;
//     }
//     return true;
//   };

//   const submitLeave = async () => {
//     if (!leaveType) {
//       Alert.alert('Error', 'Please select a leave type');
//       return;
//     }
    
//     if (!description.trim()) {
//       Alert.alert('Error', 'Please enter a reason for leave');
//       return;
//     }
    
//     if (toDate < fromDate) {
//       Alert.alert('Error', 'End date cannot be before start date');
//       return;
//     }

//     if (!checkForExistingLeaves()) {
//       return;
//     }

//     // Skip balance check for "Leave Without Pay"
//     if (leaveType !== 'Leave Without Pay') {
//       try {
//         setIsLoading(true);
        
//         const response = await fetch(
//           `${ERP_BASE_URL}/api/method/hrms.hr.doctype.leave_application.leave_application.get_leave_balance_on`,
//           {
//             method: 'POST',
//             headers: {
//               'Cookie': `sid=${sid}`,
//               'Content-Type': 'application/json',
//               'X-Requested-With': 'XMLHttpRequest'
//             },
//             body: JSON.stringify({
//               employee: employeeData.employee,
//               leave_type: leaveType,
//               date: formatDate(fromDate)
//             })
//           }
//         );

//         if (response.ok) {
//           const result = await response.json();
//           const balance = result.message;
          
//           if (balance <= 0) {
//             Alert.alert(
//               'No Leave Balance', 
//               `You have no available balance for ${leaveType}`,
//               [{ text: 'OK' }]
//             );
//             return;
//           }

//           if (totalLeaveDays > balance) {
//             Alert.alert(
//               'Insufficient Leave Balance', 
//               `You only have ${balance} days available for ${leaveType}`,
//               [
//                 { text: 'Cancel', style: 'cancel' },
//                 { text: 'Continue Anyway', onPress: () => submitLeaveApplication() }
//               ]
//             );
//             return;
//           }
//         } else {
//           throw new Error('Failed to check leave balance');
//         }
//       } catch (error) {
//         Alert.alert('Error', error.message || 'Failed to check leave balance');
//         return;
//       } finally {
//         setIsLoading(false);
//       }
//     }

//     submitLeaveApplication();
//   };

//   const submitLeaveApplication = async () => {
//     setIsLoading(true);
//     setApiError(null);
    
//     try {
//       const payload = {
//         doctype: "Leave Application",
//         employee: employeeData.employee,
//         employee_name: employeeData.employee_name,
//         leave_type: leaveType,
//         from_date: formatDate(fromDate),
//         to_date: formatDate(toDate),
//         description: description,
//         status: 'Open',
//         company: employeeData.company,
//         leave_approver: employeeData.leave_approver || 'Administrator',
//         department: employeeData.department
//       };

//       const response = await fetch(
//         `${ERP_BASE_URL}/api/resource/Leave%20Application`,
//         {
//           method: 'POST',
//           headers: {
//             'Cookie': `sid=${sid}`,
//             'Content-Type': 'application/json',
//             'Accept': 'application/json',
//             'X-Requested-With': 'XMLHttpRequest'
//           },
//           body: JSON.stringify({ data: payload })
//         }
//       );

//       const result = await response.json();
      
//       if (!response.ok) {
//         let errorMessage = 'Submission failed';
//         if (result._server_messages) {
//           try {
//             const serverMessages = JSON.parse(result._server_messages);
//             if (Array.isArray(serverMessages)) {
//               errorMessage = JSON.parse(serverMessages[0]).message;
//             }
//           } catch (e) {
//             // Ignore parsing errors
//           }
//         }
//         throw new Error(errorMessage || result.message || result.exc || 'Submission failed');
//       }

//       if (result.data) {
//         Alert.alert(
//           'Success', 
//           'Leave application submitted for approval!',
//           [{ text: 'OK', onPress: () => navigation.goBack() }]
//         );
//       } else {
//         throw new Error('Invalid response from server');
//       }
//     } catch (error) {
//       setApiError(error.message);
//       Alert.alert('Error', error.message || 'Failed to submit leave application');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const formatDate = (date) => {
//     return date.toISOString().split('T')[0];
//   };

//   const formatDisplayDate = (date) => {
//     return date.toLocaleDateString('en-GB', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   if (!employeeData) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" />
//         <Text style={styles.loadingText}>
//           {apiError || 'Loading employee data...'}
//         </Text>
//         {apiError && (
//           <TouchableOpacity 
//             style={styles.retryButton}
//             onPress={() => navigation.goBack()}
//           >
//             <Text style={styles.retryButtonText}>Go Back</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     );
//   }

//   return (
//     <ScrollView 
//       style={styles.container} 
//       contentContainerStyle={styles.contentContainer}
//       keyboardShouldPersistTaps="handled"
//     >
//       <Text style={styles.header}>Apply for Leave</Text>
      
//       <View style={styles.infoBox}>
//         <Text style={styles.infoText}>Employee: {employeeData.employee_name}</Text>
//         <Text style={styles.infoText}>Company: {employeeData.company}</Text>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.label}>Leave Type:</Text>
//         {isLoading && leaveTypes.length === 0 ? (
//           <ActivityIndicator style={styles.loader} />
//         ) : (
//           <View style={styles.pickerContainer}>
//             <Picker
//               selectedValue={leaveType}
//               style={styles.picker}
//               onValueChange={handleLeaveTypeChange}
//             >
//               {leaveTypes.map((type, index) => (
//                 <Picker.Item 
//                   key={index} 
//                   label={type.displayName} 
//                   value={type.name} 
//                 />
//               ))}
//             </Picker>
//           </View>
//         )}
//       </View>

//       {existingLeaves.length > 0 && (
//         <View style={[styles.balanceBox, { backgroundColor: '#fff3e0' }]}>
//           <Text style={[styles.balanceText, { color: '#e65100', fontWeight: 'bold' }]}>
//             Existing Leaves Conflict:
//           </Text>
//           {existingLeaves.map((leave, index) => (
//             <Text key={index} style={[styles.balanceText, { color: '#e65100' }]}>
//               {formatDisplayDate(new Date(leave.from_date))} to {formatDisplayDate(new Date(leave.to_date))} (Status: {leave.status})
//             </Text>
//           ))}
//         </View>
//       )}

//       <View style={styles.section}>
//         <Text style={styles.label}>Leave Dates:</Text>
//         <View style={styles.row}>
//           <TouchableOpacity 
//             style={styles.dateButton} 
//             onPress={() => setShowFromPicker(true)}
//             disabled={isLoading}
//           >
//             <Text style={styles.dateButtonText}>From: {formatDisplayDate(fromDate)}</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             style={styles.dateButton} 
//             onPress={() => setShowToPicker(true)}
//             disabled={isLoading}
//           >
//             <Text style={styles.dateButtonText}>To: {formatDisplayDate(toDate)}</Text>
//           </TouchableOpacity>
//         </View>

//         {showFromPicker && (
//           <DateTimePicker
//             value={fromDate}
//             mode="date"
//             display="default"
//             onChange={(e, date) => {
//               setShowFromPicker(false);
//               if (date) {
//                 setFromDate(date);
//                 if (date > toDate) {
//                   setToDate(date);
//                 }
//               }
//             }}
//           />
//         )}

//         {showToPicker && (
//           <DateTimePicker
//             value={toDate}
//             mode="date"
//             display="default"
//             minimumDate={fromDate}
//             onChange={(e, date) => {
//               setShowToPicker(false);
//               if (date) setToDate(date);
//             }}
//           />
//         )}
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.label}>Reason for Leave:</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter reason for leave (required)"
//           placeholderTextColor="#999"
//           value={description}
//           onChangeText={setDescription}
//           multiline
//           numberOfLines={4}
//           editable={!isLoading}
//         />
//       </View>

//       {apiError && (
//         <View style={styles.errorBox}>
//           <Text style={styles.errorText}>{apiError}</Text>
//         </View>
//       )}

//       <TouchableOpacity 
//         style={[
//           styles.button, 
//           (isLoading || !leaveType) && styles.disabledButton
//         ]} 
//         onPress={submitLeave}
//         disabled={isLoading || !leaveType}
//       >
//         {isLoading ? (
//           <ActivityIndicator color="white" />
//         ) : (
//           <Text style={styles.buttonText}>Submit for Approval</Text>
//         )}
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   contentContainer: {
//     padding: 20,
//     paddingBottom: 40,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   loadingText: {
//     marginTop: 20,
//     fontSize: 16,
//     color: '#333',
//     textAlign: 'center',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//     color: '#2c3e50',
//   },
//   section: {
//     marginBottom: 20,
//   },
//   infoBox: {
//     backgroundColor: '#e3f2fd',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 20,
//   },
//   infoText: {
//     fontSize: 14,
//     color: 'black',
//     marginBottom: 5,
//     paddingLeft: 10,
//   },
//   pickerContainer: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     overflow: 'hidden',
//     backgroundColor: 'white',
//   },
//   picker: {
//     height: 50,
//     width: '100%',
//   },
//   loader: {
//     padding: 15,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 10,
//     color: '#2c3e50',
//   },
//   balanceBox: {
//     backgroundColor: '#e8f5e9',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 20,
//   },
//   balanceText: {
//     fontSize: 15,
//     color: '#2e7d32',
//     marginBottom: 5,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   dateButton: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     padding: 15,
//     borderRadius: 8,
//     width: '48%',
//     backgroundColor: 'white',
//   },
//   dateButtonText: {
//     color: '#333',
//     textAlign: 'center',
//     fontSize: 14,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     padding: 15,
//     borderRadius: 8,
//     minHeight: 120,
//     backgroundColor: 'white',
//     textAlignVertical: 'top',
//     fontSize: 16,
//     color: '#333',
//   },
//   button: {
//     backgroundColor: '#4CAF50',
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//     elevation: 2,
//     marginTop: 10,
//   },
//   disabledButton: {
//     backgroundColor: '#a5d6a7',
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   errorBox: {
//     backgroundColor: '#ffebee',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 20,
//   },
//   errorText: {
//     color: '#c62828',
//     fontSize: 14,
//     textAlign: 'center',
//   },
//   retryButton: {
//     marginTop: 20,
//     padding: 12,
//     backgroundColor: '#2196F3',
//     borderRadius: 6,
//   },
//   retryButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   }
// });

// export default LeaveApplicationForm;


import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Alert, 
  TouchableOpacity, 
  ActivityIndicator, 
  ScrollView,
  FlatList,
  Switch
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

// const ERP_BASE_URL = 'https://erpnextcloud.cbditsolutions.com';
//const ERP_BASE_URL = 'https://mpda.in';

const LeaveApplicationForm = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { sid,erpUrl } = route.params;
  
  const [employeeData, setEmployeeData] = useState(null);
  const [leaveType, setLeaveType] = useState('Leave Without Pay');
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [apiError, setApiError] = useState(null);
  const [existingLeaves, setExistingLeaves] = useState([]);
  const [totalLeaveDays, setTotalLeaveDays] = useState(0);
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [halfDayDate, setHalfDayDate] = useState(new Date());
  const [showHalfDayPicker, setShowHalfDayPicker] = useState(false);
  const ERP_BASE_URL = erpUrl;

  // Fetch employee data when component mounts
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        setIsLoading(true);
        setApiError(null);
        
        const userResponse = await fetch(
          `${ERP_BASE_URL}/api/method/frappe.auth.get_logged_user`,
          {
            method: 'GET',
            headers: {
              'Cookie': `sid=${sid}`,
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            }
          }
        );

        if (!userResponse.ok) {
          throw new Error(`Failed to get user: ${userResponse.status}`);
        }

        const userData = await userResponse.json();
        const userId = userData.message;

        const empResponse = await fetch(
          `${ERP_BASE_URL}/api/resource/Employee?filters=[["user_id","=","${userId}"]]&fields=["name","employee_name","company","leave_approver","department"]`,
          {
            method: 'GET',
            headers: {
              'Cookie': `sid=${sid}`,
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            }
          }
        );

        if (!empResponse.ok) {
          throw new Error(`Failed to get employee: ${empResponse.status}`);
        }

        const empData = await empResponse.json();
        
        if (!empData.data || empData.data.length === 0) {
          throw new Error('No employee record found for this user');
        }

        const employeeDetails = {
          employee: empData.data[0].name,
          employee_name: empData.data[0].employee_name,
          company: empData.data[0].company,
          leave_approver: empData.data[0].leave_approver,
          department: empData.data[0].department
        };

        setEmployeeData(employeeDetails);

      } catch (error) {
        setApiError(`Employee data error: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployeeData();
  }, []);

  // Fetch leave types when employee data is available
  useEffect(() => {
    if (!employeeData) return;

    const fetchLeaveTypes = async () => {
      try {
        setIsLoading(true);
        setApiError(null);
        
        // Always include "Leave Without Pay" option
        const leaveTypesData = [{
          name: 'Leave Without Pay',
          displayName: 'Leave Without Pay'
        }];

        // Fetch allocated leave types
        const allocationsResponse = await fetch(
          `${ERP_BASE_URL}/api/resource/Leave Allocation?filters=[["employee","=","${employeeData.employee}"],["docstatus","=",1]]&fields=["leave_type"]`,
          {
            method: 'GET',
            headers: {
              'Cookie': `sid=${sid}`,
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            }
          }
        );

        if (allocationsResponse.ok) {
          const allocationsData = await allocationsResponse.json();
          if (allocationsData.data && allocationsData.data.length > 0) {
            const assignedLeaveTypes = allocationsData.data.map(item => item.leave_type);
            
            const response = await fetch(
              `${ERP_BASE_URL}/api/resource/Leave Type?fields=["name"]`,
              {
                method: 'GET',
                headers: {
                  'Cookie': `sid=${sid}`,
                  'Content-Type': 'application/json',
                  'X-Requested-With': 'XMLHttpRequest'
                }
              }
            );

            if (response.ok) {
              const data = await response.json();
              data.data
                .filter(item => assignedLeaveTypes.includes(item.name))
                .forEach(item => {
                  leaveTypesData.push({
                    name: item.name,
                    displayName: item.name
                  });
                });
            }
          }
        }

        setLeaveTypes(leaveTypesData);
        setLeaveType('Leave Without Pay');
      } catch (error) {
        // Even if there's an error, keep "Leave Without Pay" option
        setLeaveTypes([{
          name: 'Leave Without Pay',
          displayName: 'Leave Without Pay'
        }]);
        setLeaveType('Leave Without Pay');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaveTypes();
  }, [employeeData]);

  // Check for existing leaves when dates or leave type changes
  useEffect(() => {
    if (!leaveType || !employeeData) return;
    
    // Skip check for "Leave Without Pay"
    if (leaveType === 'Leave Without Pay') {
      setExistingLeaves([]);
      return;
    }
    
    const checkExistingLeaves = async () => {
      try {
        const response = await fetch(
          `${ERP_BASE_URL}/api/resource/Leave Application?filters=[["employee","=","${employeeData.employee}"],["leave_type","=","${leaveType}"],["from_date","<=","${formatDate(toDate)}"],["to_date",">=","${formatDate(fromDate)}"],["status","!=","Rejected"],["docstatus","=",1]]&fields=["name","from_date","to_date","status"]`,
          {
            method: 'GET',
            headers: {
              'Cookie': `sid=${sid}`,
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          setExistingLeaves(data.data || []);
        }
      } catch (error) {
        // Silently handle error, we'll show alert when user tries to submit
      }
    };
    
    checkExistingLeaves();
  }, [leaveType, fromDate, toDate]);

  // Calculate total leave days when dates change
  useEffect(() => {
    const diffTime = Math.abs(toDate - fromDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    setTotalLeaveDays(isHalfDay ? 0.5 : diffDays);
  }, [fromDate, toDate, isHalfDay]);

  const handleLeaveTypeChange = (value) => {
    setLeaveType(value);
  };

  const checkForExistingLeaves = () => {
    if (leaveType === 'Leave Without Pay') return true;
    
    if (existingLeaves.length > 0) {
      Alert.alert(
        'Leave Conflict',
        'You have already applied for leave on these dates',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const submitLeave = async () => {
    if (!leaveType) {
      Alert.alert('Error', 'Please select a leave type');
      return;
    }
    
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a reason for leave');
      return;
    }
    
    if (toDate < fromDate) {
      Alert.alert('Error', 'End date cannot be before start date');
      return;
    }

    if (isHalfDay && (fromDate.toDateString() !== toDate.toDateString())) {
      Alert.alert('Error', 'For half day leave, from and to date must be the same');
      return;
    }

    if (!checkForExistingLeaves()) {
      return;
    }

    // Skip balance check for "Leave Without Pay"
    if (leaveType !== 'Leave Without Pay') {
      try {
        setIsLoading(true);
        
        const response = await fetch(
          `${ERP_BASE_URL}/api/method/hrms.hr.doctype.leave_application.leave_application.get_leave_balance_on`,
          {
            method: 'POST',
            headers: {
              'Cookie': `sid=${sid}`,
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
              employee: employeeData.employee,
              leave_type: leaveType,
              date: formatDate(fromDate)
            })
          }
        );

        if (response.ok) {
          const result = await response.json();
          const balance = result.message;
          
          if (balance <= 0) {
            Alert.alert(
              'No Leave Balance', 
              `You have no available balance for ${leaveType}`,
              [{ text: 'OK' }]
            );
            return;
          }

          if (totalLeaveDays > balance) {
            Alert.alert(
              'Insufficient Leave Balance', 
              `You only have ${balance} days available for ${leaveType}`,
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Continue Anyway', onPress: () => submitLeaveApplication() }
              ]
            );
            return;
          }
        } else {
          throw new Error('Failed to check leave balance');
        }
      } catch (error) {
        Alert.alert('Error', error.message || 'Failed to check leave balance');
        return;
      } finally {
        setIsLoading(false);
      }
    }

    submitLeaveApplication();
  };

  const submitLeaveApplication = async () => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const payload = {
        doctype: "Leave Application",
        employee: employeeData.employee,
        employee_name: employeeData.employee_name,
        leave_type: leaveType,
        from_date: formatDate(fromDate),
        to_date: formatDate(toDate),
        description: description,
        status: 'Open',
        company: employeeData.company,
        leave_approver: employeeData.leave_approver || 'Administrator',
        department: employeeData.department,
        half_day: isHalfDay ? 1 : 0,
        half_day_date: isHalfDay ? formatDate(halfDayDate) : null
      };

      const response = await fetch(
        `${ERP_BASE_URL}/api/resource/Leave%20Application`,
        {
          method: 'POST',
          headers: {
            'Cookie': `sid=${sid}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: JSON.stringify({ data: payload })
        }
      );

      const result = await response.json();
      
      if (!response.ok) {
        let errorMessage = 'Submission failed';
        if (result._server_messages) {
          try {
            const serverMessages = JSON.parse(result._server_messages);
            if (Array.isArray(serverMessages)) {
                //errorMessage = JSON.parse(serverMessages[0]).message;
                errorMessage = "You have already applied for leave on these dates";
            }
             else{
               errorMessage = firstMessage.message;
             }
          } catch (e) {
            // Ignore parsing errors
          }
        }
        throw new Error(errorMessage || result.message || result.exc || 'Submission failed');
      }

      if (result.data) {
        Alert.alert(
          'Success', 
          'Leave application submitted for approval!',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      setApiError(error.message);
      Alert.alert('Error', error.message || 'Failed to submit leave application');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDisplayDate = (date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const toggleHalfDay = (value) => {
    setIsHalfDay(value);
    if (value) {
      setToDate(new Date(fromDate));
    }
  };

  if (!employeeData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>
          {apiError || 'Loading employee data...'}
        </Text>
        {apiError && (
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.header}>Apply for Leave</Text>
      
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>Employee: {employeeData.employee_name}</Text>
        <Text style={styles.infoText}>Company: {employeeData.company}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Leave Type:</Text>
        {isLoading && leaveTypes.length === 0 ? (
          <ActivityIndicator style={styles.loader} />
        ) : (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={leaveType}
              style={styles.picker}
              onValueChange={handleLeaveTypeChange}
              dropdownIconColor="#000000" 
            >
              {leaveTypes.map((type, index) => (
                <Picker.Item 
                  key={index} 
                  label={type.displayName} 
                  value={type.name} 
                />
              ))}
            </Picker>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.halfDayContainer}>
          <Text style={styles.label}>Half Day:</Text>
          <Switch
            value={isHalfDay}
            onValueChange={toggleHalfDay}
            disabled={isLoading}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isHalfDay ? "#f5dd4b" : "#f4f3f4"}
          />
        </View>
      </View>

      {isHalfDay && (
        <View style={styles.section}>
          <Text style={styles.label}>Half Day Date:</Text>
          <TouchableOpacity 
            style={styles.dateButton} 
            onPress={() => setShowHalfDayPicker(true)}
            disabled={isLoading}
          >
            <Text style={styles.dateButtonText}>{formatDisplayDate(halfDayDate)}</Text>
          </TouchableOpacity>
          
          {showHalfDayPicker && (
            <DateTimePicker
              value={halfDayDate}
              mode="date"
              display="default"
              onChange={(e, date) => {
                setShowHalfDayPicker(false);
                if (date) {
                  setHalfDayDate(date);
                  setFromDate(date);
                  setToDate(date);
                }
              }}
            />
          )}
        </View>
      )}

      {!isHalfDay && (
        <>
          <View style={styles.section}>
            <Text style={styles.label}>Leave Dates:</Text>
            <View style={styles.row}>
              <TouchableOpacity 
                style={styles.dateButton} 
                onPress={() => setShowFromPicker(true)}
                disabled={isLoading}
              >
                <Text style={styles.dateButtonText}>From: {formatDisplayDate(fromDate)}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.dateButton} 
                onPress={() => setShowToPicker(true)}
                disabled={isLoading}
              >
                <Text style={styles.dateButtonText}>To: {formatDisplayDate(toDate)}</Text>
              </TouchableOpacity>
            </View>

            {showFromPicker && (
              <DateTimePicker
                value={fromDate}
                mode="date"
                display="default"
                onChange={(e, date) => {
                  setShowFromPicker(false);
                  if (date) {
                    setFromDate(date);
                    if (date > toDate) {
                      setToDate(date);
                    }
                  }
                }}
              />
            )}

            {showToPicker && (
              <DateTimePicker
                value={toDate}
                mode="date"
                display="default"
                minimumDate={fromDate}
                onChange={(e, date) => {
                  setShowToPicker(false);
                  if (date) setToDate(date);
                }}
              />
            )}
          </View>
        </>
      )}

      <View style={styles.section}>
        <Text style={styles.label}>Total Leave Days:</Text>
        <Text style={styles.totalDaysText}>{totalLeaveDays} day(s)</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Reason for Leave:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter reason for leave (required)"
          placeholderTextColor="#999"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          editable={!isLoading}
        />
      </View>

      {apiError && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{apiError}</Text>
        </View>
      )}

      <TouchableOpacity 
        style={[
          styles.button, 
          (isLoading || !leaveType) && styles.disabledButton
        ]} 
        onPress={submitLeave}
        disabled={isLoading || !leaveType}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Submit for Approval</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
  },
  section: {
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: 'black',
    marginBottom: 5,
    paddingLeft: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'white',
    
    
  },
  picker: {
    height: 50,
    width: '100%',
    color:"#666",
  },
  loader: {
    padding: 15,
    color:"#666",
    
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#2c3e50',
    

  },
  halfDayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceBox: {
    backgroundColor: '#e8f5e9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  balanceText: {
    fontSize: 15,
    color: '#2e7d32',
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    width: '48%',
    backgroundColor: 'white',
  },
  dateButtonText: {
    color: '#333',
    textAlign: 'center',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    minHeight: 120,
    backgroundColor: 'white',
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#a5d6a7',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorBox: {
    backgroundColor: '#ffebee',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#2196F3',
    borderRadius: 6,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  totalDaysText: {
    fontSize: 16,
    color: '#2c3e50',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  }
});

export default LeaveApplicationForm;