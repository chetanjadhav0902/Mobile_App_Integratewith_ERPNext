// import React from "react";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// export default function CustomDrawer({ navigation }) {

//   const logout = async () => {
//     await AsyncStorage.removeItem("token");
//     navigation.replace("Login");
//   };

//   return (
//     <View style={{ flex: 1, padding: 20 }}>

//       <Text style={styles.title}>Menu</Text>

//       <TouchableOpacity style={styles.item} onPress={() => navigation.navigate("Timesheet", { sid, employeeData, erpUrl })}>
//         <Text>Timesheet</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.item} onPress={() => navigation.navigate("OTFORM", { sid, employeeData, erpUrl })}>
//         <Text>OT Form</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.item} onPress={() => navigation.navigate("SiteSurveyList", { sid, employeeData, erpUrl })}>
//         <Text>Site Survey List</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.logout} onPress={logout}>
//         <Text style={{ color: "white" }}>Logout</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
//   item: {
//     paddingVertical: 12,
//     borderBottomColor: "#ccc",
//     borderBottomWidth: 1,
//   },
//   logout: {
//     marginTop: 40,
//     backgroundColor: "red",
//     padding: 12,
//     borderRadius: 8,
//     alignItems: "center",
//   },
// });






import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CustomDrawer({ navigation, sid, employeeData, erpUrl }) {

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    navigation.closeDrawer();
    navigation.replace("Login");
  };

  const goToScreen = (screenName) => {
    navigation.closeDrawer();
    navigation.navigate(screenName, { sid, employeeData, erpUrl });
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={styles.title}>Menu</Text>

      <TouchableOpacity style={styles.item} onPress={() => goToScreen("Timesheet")}>
        <Text>Timesheet</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => goToScreen("OTForm")}>
        <Text>OT Form</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => goToScreen("SiteSurveyList")}>
        <Text>Site Survey List</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logout} onPress={logout}>
        <Text style={{ color: "white" }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  item: { paddingVertical: 12, borderBottomColor: "#ccc", borderBottomWidth: 1 },
  logout: { marginTop: 40, backgroundColor: "red", padding: 12, borderRadius: 8, alignItems: "center" },
});
