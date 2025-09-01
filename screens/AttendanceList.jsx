import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const AttendanceList = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { sid, employeeData } = route.params; // Get params from previous screen

  const goToAttendanceListScreen = () => {
    navigation.navigate('AttendanceListScreen', {
      sid: sid,
      employeeData: employeeData,
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={goToAttendanceListScreen}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Attendance List</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AttendanceList;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: 300,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
