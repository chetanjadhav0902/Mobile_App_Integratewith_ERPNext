// import React from "react";
// import { createDrawerNavigator } from "@react-navigation/drawer";

// import TimeSheet from "../Timesheet/TimeSheet";
// import OTFORM from "../OT/OTFORM";
// import SiteSurveyList from "../screens/SiteSurveyList";

// import CustomDrawer from "../screens/CustomDrawer";

// const Drawer = createDrawerNavigator();

// export default function DrawerNavigation() {
//   return (
//     <Drawer.Navigator
//       drawerContent={(props) => <CustomDrawer {...props} />}
//       screenOptions={{
//         headerShown: true,
//       }}
//     >
//       <Drawer.Screen name="Timesheet" component={TimeSheet} />
//       <Drawer.Screen name="OTForm" component={OTFORM} />
//       <Drawer.Screen name="SiteSurveyList" component={SiteSurveyList} />
//     </Drawer.Navigator>
//   );
// }





import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import EmployeeTabs from '../screens/EmployeeTabs';
import CustomDrawer from '../screens/CustomDrawer';
import TimeSheet from '../Timesheet/TimeSheet';
import OTFORM from '../OT/OTFORM';
import SiteSurveyList from '../screens/SiteSurveyList';

const Drawer = createDrawerNavigator();

export default function DrawerNavigation({ route }) {
  const { sid, employeeData, erpUrl } = route?.params || {};

  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawer {...props} sid={sid} employeeData={employeeData} erpUrl={erpUrl} />
      )}
      screenOptions={{ headerShown: true }}
    >
      {/* Bottom Tabs inside Drawer */}
      <Drawer.Screen
        name="Tabs"
        component={EmployeeTabs}
        initialParams={{ sid, employeeData, erpUrl }}
      />

      {/* Optional: direct drawer screens */}
      <Drawer.Screen name="Timesheet" component={TimeSheet} initialParams={{ sid, employeeData, erpUrl }} />
      <Drawer.Screen name="OTForm" component={OTFORM} initialParams={{ sid, employeeData, erpUrl }} />
      <Drawer.Screen name="SiteSurveyList" component={SiteSurveyList} initialParams={{ sid, employeeData, erpUrl }} />
    </Drawer.Navigator>
  );
}
