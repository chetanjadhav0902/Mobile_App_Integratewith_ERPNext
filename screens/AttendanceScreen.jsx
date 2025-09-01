  import React from 'react';
  import { ScrollView, View, StyleSheet } from 'react-native';
  import ClockIn from './ClockIn';
  //import ClockOut from './ClockOut';
  //import AttendanceList from './AttendanceList';

  const AttendanceScreen = ({ route }) => {
    const { sid, employeeData,erpUrl } = route.params;

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.section}>
          <ClockIn sid={sid} employeeData={employeeData} erpUrl={erpUrl}/>
        </View>
        {/* <View style={styles.section}>
          <ClockOut sid={sid} employeeData={employeeData} />
        </View> */}
        {/* <View style={styles.section}>
          <AttendanceList sid={sid} employeeData={employeeData} />
        </View> */}
      </ScrollView>
    );
  };

  export default AttendanceScreen;

  const styles = StyleSheet.create({
    container: {
      padding: 16,
    backgroundColor:  '#F0F8FF',
    },
    section: {
      marginBottom: 24,
    },
  });
