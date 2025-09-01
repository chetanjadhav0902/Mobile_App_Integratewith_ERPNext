import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const OD = ({ route, navigation }) => {
  const { sid, employeeData,erpUrl } = route.params;

  return (
    <View style={styles.container}>
      

      <TouchableOpacity
        style={[styles.tab,{backgroundColor: '#f0e6ff'}]}
        onPress={() => navigation.navigate('ApplyOD', { sid, employeeData,erpUrl })}
       
      >
        <Text style={styles.tabText}>Apply OD</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.tab,{ backgroundColor:'#e0f7fa' }]} onPress={() => navigation.navigate('OdRecentApplication', { sid, employeeData,erpUrl })}>
        <Text style={styles.tabText}>Recent Applications</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.tab,{backgroundColor: '#f3e5f5'}]} onPress={() => navigation.navigate('OdApplicationStatus', { sid, employeeData,erpUrl })}>
        <Text style={styles.tabText}>Application Status</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OD;

const styles = StyleSheet.create({
  container: {
    flex:1,
    padding: 20,
    backgroundColor: '#DFF5E1',
    
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  tab: {
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    elevation: 2,
    marginBottom: 20,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});
