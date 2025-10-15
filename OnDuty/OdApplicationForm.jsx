





// import React, { useState, useEffect } from 'react';
// import {
//   View, Text, TextInput, TouchableOpacity,
//   StyleSheet, Alert, Platform, ActivityIndicator,
//   ScrollView, Switch
// } from 'react-native';
// import axios from 'axios';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { Picker } from '@react-native-picker/picker';

// const ApplyOnDuty = ({ route }) => {
//   const { sid, employeeData,erpUrl} = route.params;

//   const baseUrl=erpUrl;

//   const [fromDate, setFromDate] = useState(new Date());
//   const [toDate, setToDate] = useState(new Date());
//   const [showFromPicker, setShowFromPicker] = useState(false);
//   const [showToPicker, setShowToPicker] = useState(false);
//   const [isHalfDay, setIsHalfDay] = useState(false);
//   const [halfDayDate, setHalfDayDate] = useState(new Date());
//   const [showHalfDayPicker, setShowHalfDayPicker] = useState(false);

//   const [reasonList, setReasonList] = useState([]);
//   const [selectedReason, setSelectedReason] = useState('');
//   const [explanation, setExplanation] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [apiError, setApiError] = useState(null);

//   // Format date for ERPNext API
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

//   // Fetch 'reason' field options from ERPNext
//   useEffect(() => {
//     const fetchReasons = async () => {
//       setIsLoading(true);
//       setApiError(null);
//       try {
//         const response = await axios.get(
//           // 'https://erpnextcloud.cbditsolutions.com/api/method/frappe.desk.form.load.getdoctype',
//           `${baseUrl}/api/method/frappe.desk.form.load.getdoctype`,
//           {
//             params: {
//               doctype: 'Attendance Request'
//             },
//             headers: {
//               'Authorization': `token ${sid}`,
//               'Accept': 'application/json',
//               'Content-Type': 'application/json'
//             }
//           }
//         );

//         const fields = response.data.docs[0].fields;
//         const reasonField = fields.find(field => field.fieldname === 'reason');
//         const options = reasonField?.options?.split('\n') || [];
        
//         setReasonList(options);
//         setSelectedReason(options[0] || '');
//       } catch (error) {
//         console.error('Fetch reasons error:', error.response?.data || error.message);
//         setApiError('Unable to fetch reason list.');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchReasons();
//   }, []);

//   const toggleHalfDay = (value) => {
//     setIsHalfDay(value);
//     if (value) {
//       // When enabling half day, set both dates to the same date
//       const currentDate = new Date();
//       setFromDate(currentDate);
//       setToDate(currentDate);
//       setHalfDayDate(currentDate);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!selectedReason || !explanation) {
//       Alert.alert('Error', 'Please fill all fields.');
//       return;
//     }

//     if (fromDate > toDate) {
//       Alert.alert('Error', 'From date cannot be after To date');
//       return;
//     }

//     if (isHalfDay && fromDate.toDateString() !== toDate.toDateString()) {
//       Alert.alert('Error', 'For half day, from and to date must be the same');
//       return;
//     }

//     setIsLoading(true);
//     setApiError(null);
    
//     const payload = {
//       docstatus: 0,
//       doctype: 'Attendance Request',
//       employee: employeeData.name,
//       employee_name: employeeData.employee_name,
//       company: employeeData.company,
//       from_date: formatDate(fromDate),
//       to_date: formatDate(toDate),
//       attendance_request_type: 'On Duty',
//       reason: selectedReason,
//       explanation: explanation,
//       status: 'Open',
//       half_day: isHalfDay ? 1 : 0,
//       half_day_date: isHalfDay ? formatDate(halfDayDate) : null
//     };

//     try {
//       const response = await axios.post(
//         // 'https://erpnextcloud.cbditsolutions.com/api/resource/Attendance Request',
//         `${baseUrl}/api/resource/Attendance Request`,
//         payload,
//         {
//           headers: {
//             'Authorization': `token ${sid}`,
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       Alert.alert('Success', 'OD application submitted successfully!');
//       // Reset form after successful submission
//       setExplanation('');
//       setIsHalfDay(false);
//       setFromDate(new Date());
//       setToDate(new Date());
//     } catch (error) {
//       let errorMessage = 'you have already apply leave on this date and it approved.';
      
//       // Check for overlapping attendance error
//       if (error.response?.data?.exc?.includes('OverlappingAttendanceRequestError')) {
//         errorMessage = 'You already have an On Duty request for these dates.';
//       }
      
//       setApiError(errorMessage);
//       Alert.alert('Error', errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const onChangeFromDate = (event, selectedDate) => {
//     setShowFromPicker(Platform.OS === 'ios');
//     if (selectedDate) {
//       setFromDate(selectedDate);
//       if (isHalfDay) {
//         setToDate(selectedDate);
//         setHalfDayDate(selectedDate);
//       } else if (toDate < selectedDate) {
//         setToDate(selectedDate);
//       }
//     }
//   };

//   const onChangeToDate = (event, selectedDate) => {
//     setShowToPicker(Platform.OS === 'ios');
//     if (selectedDate) {
//       setToDate(selectedDate);
//     }
//   };

//   const onChangeHalfDayDate = (event, selectedDate) => {
//     setShowHalfDayPicker(Platform.OS === 'ios');
//     if (selectedDate) {
//       setHalfDayDate(selectedDate);
//       setFromDate(selectedDate);
//       setToDate(selectedDate);
//     }
//   };

//   return (
//     <ScrollView 
//       style={styles.container} 
//       contentContainerStyle={styles.contentContainer}
//       keyboardShouldPersistTaps="handled"
//     >
//       <Text style={styles.header}>Apply for On Duty</Text>
      
//       <View style={styles.infoBox}>
//         <Text style={styles.infoText}>Employee: {employeeData.employee_name}</Text>
//         <Text style={styles.infoText}>Company: {employeeData.company}</Text>
//       </View>

//       {isLoading && (
//         <View style={styles.loader}>
//           <ActivityIndicator size="large" color="#007bff" />
//         </View>
//       )}

//       <View style={styles.section}>
//         <View style={styles.halfDayContainer}>
//           <Text style={styles.label}>Half Day:</Text>
//           <Switch
//             value={isHalfDay}
//             onValueChange={toggleHalfDay}
//             disabled={isLoading}
//             trackColor={{ false: "#767577", true: "#81b0ff" }}
//             thumbColor={isHalfDay ? "#f5dd4b" : "#f4f3f4"}
//           />
//         </View>
//       </View>

//       {isHalfDay ? (
//         <View style={styles.section}>
//           <Text style={styles.label}>Date:</Text>
//           <TouchableOpacity 
//             style={[styles.dateButton, {width: '100%'}]} 
//             onPress={() => setShowHalfDayPicker(true)}
//             disabled={isLoading}
//           >
//             <Text style={styles.dateButtonText}>{formatDisplayDate(halfDayDate)}</Text>
//           </TouchableOpacity>
          
//           {showHalfDayPicker && (
//             <DateTimePicker
//               value={halfDayDate}
//               mode="date"
//               display="default"
//               onChange={onChangeHalfDayDate}
//             />
//           )}
//         </View>
//       ) : (
//         <View style={styles.section}>
//           <Text style={styles.label}>Dates:</Text>
//           <View style={styles.row}>
//             <TouchableOpacity 
//               style={styles.dateButton} 
//               onPress={() => setShowFromPicker(true)}
//               disabled={isLoading}
//             >
//               <Text style={styles.dateButtonText}>From: {formatDisplayDate(fromDate)}</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity 
//               style={styles.dateButton} 
//               onPress={() => setShowToPicker(true)}
//               disabled={isLoading}
//             >
//               <Text style={styles.dateButtonText}>To: {formatDisplayDate(toDate)}</Text>
//             </TouchableOpacity>
//           </View>

//           {showFromPicker && (
//             <DateTimePicker
//               value={fromDate}
//               mode="date"
//               display="default"
//               onChange={onChangeFromDate}
//             />
//           )}

//           {showToPicker && (
//             <DateTimePicker
//               value={toDate}
//               mode="date"
//               display="default"
//               minimumDate={fromDate}
//               onChange={onChangeToDate}
//             />
//           )}
//         </View>
//       )}

//       <View style={styles.section}>
//         <Text style={styles.label}>Reason:</Text>
//         <View style={styles.pickerContainer}>
//           <Picker
//             selectedValue={selectedReason}
//             style={styles.picker}
//             onValueChange={(itemValue) => setSelectedReason(itemValue)}
//             dropdownIconColor="#000000"
//           >
//             {reasonList.map((reason, index) => (
//               <Picker.Item 
//                 key={index} 
//                 label={reason} 
//                 value={reason} 
//               />
//             ))}
//           </Picker>
//         </View>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.label}>Explanation:</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter detailed explanation..."
//           placeholderTextColor="#999"
//           value={explanation}
//           onChangeText={setExplanation}
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
//           isLoading && styles.disabledButton
//         ]} 
//         onPress={handleSubmit}
//         disabled={isLoading}
//       >
//         {isLoading ? (
//           <ActivityIndicator color="white" />
//         ) : (
//           <Text style={styles.buttonText}>Submit Request</Text>
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
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//     color: '#2c3e50',
//   },
//   infoBox: {
//     backgroundColor: '#e3f2fd',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 20,
//   },
//   infoText: {
//     fontSize: 14,
//     color: '#333',
//     marginBottom: 5,
//   },
//   section: {
//     marginBottom: 20,
//   },
//   halfDayContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 10,
//     color: '#2c3e50',
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
//     color:'black',
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
//   loader: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(255,255,255,0.7)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 1000,
//   }
// });

// export default ApplyOnDuty;








import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, Platform, ActivityIndicator,
  ScrollView, Switch
} from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const ApplyOnDuty = ({ route }) => {
  const { sid, employeeData, erpUrl } = route.params;

  const baseUrl = erpUrl;

  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [halfDayDate, setHalfDayDate] = useState(new Date());
  const [showHalfDayPicker, setShowHalfDayPicker] = useState(false);

  const [reasonList, setReasonList] = useState([]);
  const [selectedReason, setSelectedReason] = useState(''); // keep empty initially
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Format date for ERPNext API
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

  // Fetch 'reason' field options from ERPNext
  useEffect(() => {
    const fetchReasons = async () => {
      setIsLoading(true);
      setApiError(null);
      try {
        const response = await axios.get(
          `${baseUrl}/api/method/frappe.desk.form.load.getdoctype`,
          {
            params: {
              doctype: 'Attendance Request'
            },
            headers: {
              'Authorization': `token ${sid}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        );

        const fields = response.data.docs[0].fields;
        const reasonField = fields.find(field => field.fieldname === 'reason');
        let options = reasonField?.options?.split('\n') || [];

        // ✅ Clean & filter reasons (remove blanks, whitespace, Missed Punch, Technical Issue)
        options = options
          .map((reason) => reason.trim())
          .filter(
            (reason) =>
              reason.length > 0 &&
              reason.toLowerCase() !== 'missed punch' &&
              reason.toLowerCase() !== 'technical issue'
          );

        setReasonList(options);
      } catch (error) {
        console.error('Fetch reasons error:', error.response?.data || error.message);
        setApiError('Unable to fetch reason list.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReasons();
  }, []);

  const toggleHalfDay = (value) => {
    setIsHalfDay(value);
    if (value) {
      const currentDate = new Date();
      setFromDate(currentDate);
      setToDate(currentDate);
      setHalfDayDate(currentDate);
    }
  };

  const handleSubmit = async () => {
    if (!selectedReason || !explanation) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    if (fromDate > toDate) {
      Alert.alert('Error', 'From date cannot be after To date');
      return;
    }

    if (isHalfDay && fromDate.toDateString() !== toDate.toDateString()) {
      Alert.alert('Error', 'For half day, from and to date must be the same');
      return;
    }

    setIsLoading(true);
    setApiError(null);

    const payload = {
      docstatus: 0,
      doctype: 'Attendance Request',
      employee: employeeData.name,
      employee_name: employeeData.employee_name,
      company: employeeData.company,
      from_date: formatDate(fromDate),
      to_date: formatDate(toDate),
      attendance_request_type: 'On Duty',
      reason: selectedReason,
      explanation: explanation,
      status: 'Open',
      half_day: isHalfDay ? 1 : 0,
      half_day_date: isHalfDay ? formatDate(halfDayDate) : null
    };

    try {
      const response = await axios.post(
        `${baseUrl}/api/resource/Attendance Request`,
        payload,
        {
          headers: {
            'Authorization': `token ${sid}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      Alert.alert('Success', 'OD application submitted successfully!');
      setExplanation('');
      setIsHalfDay(false);
      setFromDate(new Date());
      setToDate(new Date());
      setSelectedReason('');
    } catch (error) {
      let errorMessage = 'you have already apply leave on this date and it approved.';

      if (error.response?.data?.exc?.includes('OverlappingAttendanceRequestError')) {
        errorMessage = 'You already have an On Duty request for these dates.';
      }

      setApiError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onChangeFromDate = (event, selectedDate) => {
    setShowFromPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setFromDate(selectedDate);
      if (isHalfDay) {
        setToDate(selectedDate);
        setHalfDayDate(selectedDate);
      } else if (toDate < selectedDate) {
        setToDate(selectedDate);
      }
    }
  };

  const onChangeToDate = (event, selectedDate) => {
    setShowToPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setToDate(selectedDate);
    }
  };

  const onChangeHalfDayDate = (event, selectedDate) => {
    setShowHalfDayPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setHalfDayDate(selectedDate);
      setFromDate(selectedDate);
      setToDate(selectedDate);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.header}>Apply for On Duty</Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>Employee: {employeeData.employee_name}</Text>
        <Text style={styles.infoText}>Company: {employeeData.company}</Text>
      </View>

      {isLoading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      )}

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

      {isHalfDay ? (
        <View style={styles.section}>
          <Text style={styles.label}>Date:</Text>
          <TouchableOpacity
            style={[styles.dateButton, { width: '100%' }]}
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
              onChange={onChangeHalfDayDate}
            />
          )}
        </View>
      ) : (
        <View style={styles.section}>
          <Text style={styles.label}>Dates:</Text>
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
              onChange={onChangeFromDate}
            />
          )}

          {showToPicker && (
            <DateTimePicker
              value={toDate}
              mode="date"
              display="default"
              minimumDate={fromDate}
              onChange={onChangeToDate}
            />
          )}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.label}>Reason:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedReason}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedReason(itemValue)}
            dropdownIconColor="#000000"
          >
            {/* ✅ Placeholder option */}
            <Picker.Item label="Select Reason" value=""  />
            {reasonList.map((reason, index) => (
              <Picker.Item
                key={index}
                label={reason}
                value={reason}
              />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Explanation:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter detailed explanation..."
          placeholderTextColor="#999"
          value={explanation}
          onChangeText={setExplanation}
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
          isLoading && styles.disabledButton
        ]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Submit Request</Text>
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  section: {
    marginBottom: 20,
  },
  halfDayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#2c3e50',
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
    color: 'black',
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
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  }
});

export default ApplyOnDuty;
