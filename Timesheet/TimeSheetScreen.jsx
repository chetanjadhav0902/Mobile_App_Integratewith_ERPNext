import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const TimesheetScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Timesheet</Text>

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('AddTimesheet')}
        >
          <Text style={styles.cardText}>Add Timesheet</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('ViewTimesheet')}
        >
          <Text style={styles.cardText}>View Timesheet</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('TimesheetStatus')}
        >
          <Text style={styles.cardText}>Timesheet Status</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TimesheetScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#1976d2',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  cardText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});