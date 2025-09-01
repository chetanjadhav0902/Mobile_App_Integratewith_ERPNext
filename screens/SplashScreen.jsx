// // screens/SplashScreen.js
// import React, { useEffect } from 'react';
// import { View, Text, StyleSheet, Image } from 'react-native';

// const SplashScreen = ({ navigation }) => {
//   useEffect(() => {
//     const timer = setTimeout(() => {             
//       navigation.replace('Login')
//     }, 3000);// Wait 3 seconds           
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Image source={require('../assets/cbditsolutions_logo.jpg')} style={styles.logo} />
//       <Text style={styles.title}>Welcome to CBD IT Solution </Text>
//     </View>
//   );
// };
                                                
// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
//   logo: { width: 120, height: 120, marginBottom: 20 },
//   title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
// });

// export default SplashScreen;


import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';

const SplashScreen = ({ navigation }) => {
  const logoAnim = useRef(new Animated.Value(0)).current;
  const [displayedText, setDisplayedText] = useState('');
  const fullText = 'Welcome to GetmyERP';

  useEffect(() => {
    // Logo animation: fade-in and scale-up
    Animated.timing(logoAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    // Typewriter effect for text
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(prev => prev + fullText.charAt(i));
      i++;
      if (i >= fullText.length) clearInterval(interval);
    }, 100);

    // Timer to navigate after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/logo.png')}
        style={[
          styles.logo,
          {
            opacity: logoAnim,
            transform: [{ scale: logoAnim }],
          },
        ]}
      />
      <Text style={styles.title}>{displayedText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex:1, alignItems: 'center', backgroundColor: 'white',justifyContent:'center' },
  logo: { width: 110, height: 110,marginBottom: 10 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333'   },
});

export default SplashScreen;
