import * as React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
 import ThemeContext  from './screens/ThemeContext';
// import SettingsScreen from './screens/SettingsScreen';
import EmployeeTabs from './screens/EmployeeTabs';


import AttendanceScreen from './screens/AttendanceScreen';


import AttendanceListScreen from './screens/AttendanceListScreen';


import SalarySlip from './screens/SalarySlip';


 import SiteSurveyList from './screens/SiteSurveyList';
 import SiteSurveyFormScreen from './screens/SiteSurveyFormScreen';


import LeaveRequestScreen from './LeaveFolder/LeaveRequestScreen';
import LeaveApplicationForm from './LeaveFolder/LeaveApplicationForm';
import ApplicationStatus from './LeaveFolder/ApplicationStatus';
import RecentApplication from './LeaveFolder/RecentApplication';


import OD from './OnDuty/Od';
import ApplyOD from './OnDuty/OdApplicationForm.jsx';
import OdRecentApplication from './OnDuty/OdRecentApplication.jsx';
import OdApplicationStatus from './OnDuty/OdApplicationStatus.jsx';



import AttendanceRe from './AttendanceRequest/AttendanceRe.jsx';
import AttendanceReForm from './AttendanceRequest/AttendanceReForm.jsx';
import AttendanceReStatus from './AttendanceRequest/AttendanceReStatus.jsx'
import AttendanceReApplication from './AttendanceRequest/AttendanceReApplication.jsx';


import TimeSheet from './Timesheet/TimeSheet';
//import TimeSheetScreen from './Timesheet/TimeSheetScreen';


import OTFORM from './OT/OTFORM.jsx';
import ExpenseClaim from './ExpenseClaim/ExpenseClaim.jsx';








const Stack = createNativeStackNavigator();

export default function App() {






  return (

    <NavigationContainer>
      <Stack.Navigator initialRouteName="ThemeContext">

        <Stack.Screen name="ThemeContext" component={ThemeContext} options={{ headerShown: false }} />
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Employee" component={EmployeeTabs} options={{ headerShown: false }} />


        <Stack.Screen name="Attendance" component={AttendanceScreen} />
         <Stack.Screen name="AttendanceListScreen" component={AttendanceListScreen} options={{ title: 'Attendance List' }} />



        <Stack.Screen name="OD" component={OD} />
        <Stack.Screen name="ApplyOD" component={ApplyOD} />
        <Stack.Screen name="OdRecentApplication" component={OdRecentApplication} />
        <Stack.Screen name="OdApplicationStatus" component={OdApplicationStatus} />


        <Stack.Screen name="AttendanceRe" component={AttendanceRe} />
        <Stack.Screen name="AttendanceReForm" component={AttendanceReForm} />
        <Stack.Screen name="AttendanceReApplication" component={AttendanceReApplication} />
        <Stack.Screen name="AttendanceReStatus" component={AttendanceReStatus} />



          <Stack.Screen 
          name="SiteSurveyForm" 
         component={SiteSurveyFormScreen}
          options={{ title: 'Site Survey Form' }}
         />

         <Stack.Screen name="SiteSurveyList" component={SiteSurveyList} options={{title:'Site Survey'}} />
         <Stack.Screen name="ExpenseClaim" component={ExpenseClaim} options={{title: 'Expense Claim'}} />
    


        <Stack.Screen name="SalarySlip" component={SalarySlip} />

        
        <Stack.Screen name="LeaveRequest" component={LeaveRequestScreen} />
        <Stack.Screen name="LeaveApplicationForm" component={LeaveApplicationForm} />
        <Stack.Screen name="ApplicationStatus" component={ApplicationStatus} />
        <Stack.Screen name="RecentApplication" component={RecentApplication} />

      
        <Stack.Screen name="Timesheet" component={TimeSheet} />

        <Stack.Screen name="OTFORM" component={OTFORM} options={{title: 'Lead'}}  />
         



      </Stack.Navigator>



    </NavigationContainer>



  );
}



        //  <Stack.Screen 
        //  name="SiteSurveyForm" 
        // component={SiteSurveyFormScreen}
        //  options={{ title: 'Site Survey Form' }}
        // />

        // <Stack.Screen name="SiteSurveyList" component={SiteSurveyList} options={{title:"Site Survery List"}} />

{/* <Stack.Screen name="ThemeContext" component={ThemeContext} options={{ headerShown: false }} /> */}





// drawer icon


// import * as React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import SplashScreen from './screens/SplashScreen';
// import LoginScreen from './screens/LoginScreen';
// import EmployeeTabs from './screens/EmployeeTabs';

// import AttendanceScreen from './screens/AttendanceScreen';
// import AttendanceListScreen from './screens/AttendanceListScreen';

// import OD from './OnDuty/Od';
// import ApplyOD from './OnDuty/OdApplicationForm.jsx';
// import OdRecentApplication from './OnDuty/OdRecentApplication.jsx';
// import OdApplicationStatus from './OnDuty/OdApplicationStatus.jsx';

// import AttendanceRe from './AttendanceRequest/AttendanceRe.jsx';
// import AttendanceReForm from './AttendanceRequest/AttendanceReForm.jsx';
// import AttendanceReApplication from './AttendanceRequest/AttendanceReApplication.jsx';
// import AttendanceReStatus from './AttendanceRequest/AttendanceReStatus.jsx';

// import SalarySlip from './screens/SalarySlip';

// import SiteSurveyList from './screens/SiteSurveyList';
// import SiteSurveyFormScreen from './screens/SiteSurveyFormScreen';

// import LeaveRequestScreen from './LeaveFolder/LeaveRequestScreen';
// import LeaveApplicationForm from './LeaveFolder/LeaveApplicationForm';
// import ApplicationStatus from './LeaveFolder/ApplicationStatus';
// import RecentApplication from './LeaveFolder/RecentApplication';

// import TimeSheet from './Timesheet/TimeSheet';
// import OTFORM from './OT/OTFORM.jsx';

// // ⭐ Drawer Navigation import
// import DrawerNavigation from './navigation/DrawerNavigation';

// const Stack = createNativeStackNavigator();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Splash">

//         {/* AUTH SCREENS */}
//         <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
//         <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />

//         {/* MAIN TABS AFTER LOGIN */}
//         <Stack.Screen name="Employee" component={EmployeeTabs} options={{ headerShown: false }} />

//         {/* ⭐ Drawer Menu Screen */}
//         <Stack.Screen 
//           name="DrawerMenu"
//           component={DrawerNavigation}
//           options={{ headerShown: false }}
//         />

//         {/* Attendance */}
//         <Stack.Screen name="Attendance" component={AttendanceScreen} />
//         <Stack.Screen name="AttendanceListScreen" component={AttendanceListScreen} options={{ title: 'Attendance List' }} />

//         {/* On Duty */}
//         <Stack.Screen name="OD" component={OD} />
//         <Stack.Screen name="ApplyOD" component={ApplyOD} />
//         <Stack.Screen name="OdRecentApplication" component={OdRecentApplication} />
//         <Stack.Screen name="OdApplicationStatus" component={OdApplicationStatus} />

//         {/* Attendance Request */}
//         <Stack.Screen name="AttendanceRe" component={AttendanceRe} />
//         <Stack.Screen name="AttendanceReForm" component={AttendanceReForm} />
//         <Stack.Screen name="AttendanceReApplication" component={AttendanceReApplication} />
//         <Stack.Screen name="AttendanceReStatus" component={AttendanceReStatus} />

//         {/* Site Survey */}
//         <Stack.Screen 
//           name="SiteSurveyForm" 
//           component={SiteSurveyFormScreen}
//           options={{ title: 'Site Survey Form' }}
//         />
//         <Stack.Screen name="SiteSurveyList" component={SiteSurveyList} options={{ title: 'Expense Claim' }} />

//         {/* Salary */}
//         <Stack.Screen name="SalarySlip" component={SalarySlip} />

//         {/* Leaves */}
//         <Stack.Screen name="LeaveRequest" component={LeaveRequestScreen} />
//         <Stack.Screen name="LeaveApplicationForm" component={LeaveApplicationForm} />
//         <Stack.Screen name="ApplicationStatus" component={ApplicationStatus} />
//         <Stack.Screen name="RecentApplication" component={RecentApplication} />

//         {/* Timesheet / OT */}
//         <Stack.Screen name="Timesheet" component={TimeSheet} />
//         <Stack.Screen name="OTFORM" component={OTFORM} options={{title: 'Lead'}} />

//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
