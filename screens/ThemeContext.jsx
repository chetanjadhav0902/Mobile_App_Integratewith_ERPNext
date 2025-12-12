// import React, { createContext, useState, useContext } from 'react';
// import { Appearance } from 'react-native';

// const ThemeContext = createContext();

// export const ThemeProvider = ({ children }) => {
//   const colorScheme = Appearance.getColorScheme(); // optional default
//   const [isDarkTheme, setIsDarkTheme] = useState(colorScheme === 'dark');

//   const toggleTheme = () => setIsDarkTheme(!isDarkTheme);

//   const theme = {
//     isDarkTheme,
//     colors: {
//       background: isDarkTheme ? '#121212' : '#f8f9fa',
//       text: isDarkTheme ? '#ffffff' : '#000000',
//       card: isDarkTheme ? '#1f1f1f' : '#ffffff',
//       accent: '#2196F3',
//     },
//     toggleTheme,
//   };

//   return (
//     <ThemeContext.Provider value={theme}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// export const useTheme = () => useContext(ThemeContext);






// // // screens/ThemeContext.js
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CookieManager from '@react-native-cookies/cookies';

const ThemeContext = ({ navigation }) => {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const sid = await AsyncStorage.getItem('token');
        const baseUrl = await AsyncStorage.getItem('erpUrl');
        const username = await AsyncStorage.getItem('username');

        if (sid && baseUrl && username) {
          // Restore sid cookie
          await CookieManager.set(baseUrl, {
            name: 'sid',
            value: sid,
            domain: baseUrl.replace(/^https?:\/\//, '').split('/')[0],
            path: '/',
            secure: true,
            httpOnly: true,
          });

          // Validate session
          const res = await fetch(
            `${baseUrl}/api/resource/Employee?filters=[["user_id","=","${username}"]]`,
            { headers: { Cookie: `sid=${sid}` } }
          );
          const json = await res.json();

          if (json.data && json.data.length > 0) {
            const empName = json.data[0].name;
            const fullEmp = await fetch(`${baseUrl}/api/resource/Employee/${empName}`, {
              headers: { Cookie: `sid=${sid}` }
            });
            const fullEmpJson = await fullEmp.json();

            // Navigate immediately to EmployeeTabs
            navigation.replace('Employee', {
              employeeData: fullEmpJson.data,
              sid,
              erpUrl: baseUrl
            });
            return; // IMPORTANT: exit early
          }
        }

        //No valid session → go to Splash
        navigation.replace('Splash');
      } catch (err) {
        console.log('Session invalid or expired', err);
        navigation.replace('Splash');
      } finally {
        setChecking(false); // stop loader (optional)
      }
    };

    checkSession();
  }, []);

  // Show loader while checking
  if (checking) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
      </SafeAreaView>
    );
  }

  return null; // nothing else to render
};

export default ThemeContext;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF5F5' },
});


