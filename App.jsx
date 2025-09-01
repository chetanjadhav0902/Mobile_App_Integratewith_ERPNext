import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
// import ThemeProvider  from './screens/ThemeContext';
// import SettingsScreen from './screens/SettingsScreen';
import EmployeeTabs from './screens/EmployeeTabs';


import AttendanceScreen from './screens/AttendanceScreen';
import AttendanceListScreen from './screens/AttendanceListScreen';


import SalarySlip from './screens/SalarySlip';


import LeaveRequestScreen from './LeaveFolder/LeaveRequestScreen';
import LeaveApplicationForm from './LeaveFolder/LeaveApplicationForm';
import ApplicationStatus from './LeaveFolder/ApplicationStatus';
import RecentApplication from './LeaveFolder/RecentApplication';


import OD from './OnDuty/Od';
import ApplyOD from './OnDuty/OdApplicationForm.jsx';
import OdRecentApplication from './OnDuty/OdRecentApplication.jsx';
import OdApplicationStatus from './OnDuty/OdApplicationStatus.jsx';


import TimeSheet from './Timesheet/TimeSheet';
//import TimeSheetScreen from './Timesheet/TimeSheetScreen';




const Stack = createNativeStackNavigator();

export default function App() {
  return (

    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">


        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Employee" component={EmployeeTabs} options={{ headerShown: false }} />


        <Stack.Screen name="Attendance" component={AttendanceScreen} />
         <Stack.Screen name="AttendanceListScreen" component={AttendanceListScreen} options={{ title: 'Attendance List' }} />



        <Stack.Screen name="OD" component={OD} />
        <Stack.Screen name="ApplyOD" component={ApplyOD} />
        <Stack.Screen name="OdRecentApplication" component={OdRecentApplication} />
        <Stack.Screen name="OdApplicationStatus" component={OdApplicationStatus} />


        <Stack.Screen name="SalarySlip" component={SalarySlip} />

        
        <Stack.Screen name="LeaveRequest" component={LeaveRequestScreen} />
        <Stack.Screen name="LeaveApplicationForm" component={LeaveApplicationForm} />
        <Stack.Screen name="ApplicationStatus" component={ApplicationStatus} />
        <Stack.Screen name="RecentApplication" component={RecentApplication} />

      
        <Stack.Screen name="Timesheet" component={TimeSheet} />


      </Stack.Navigator>



    </NavigationContainer>



  );
}






