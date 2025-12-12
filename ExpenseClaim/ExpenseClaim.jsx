
// import React, { useEffect, useState } from "react";
// import { View, ActivityIndicator, StyleSheet } from "react-native";
// import { WebView } from "react-native-webview";

// const LeadScreen = ({ route }) => {
//   const { sid, erpUrl } = route.params || {};
//   const [url, setUrl] = useState(null);

//   useEffect(() => {
//     // 👉 Load “Lead” doctype directly
//     const finalUrl = `${erpUrl}/app/expense-claim/`;
//     setUrl(finalUrl);
//   }, []);

//   if (!url) {
//     return (
//       <View style={styles.loader}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   return (
//     <WebView
//       source={{ uri: url }}

//       injectedJavaScript={`
//   document.cookie = "sid=${sid}; path=/;";

//   function hideElements() {
//     const css = \`
//       /* ---------------------------------------
//          🔥 Universal Notification Bell Hider
//          Works for ERPNext v12, v13, v14, v15
//       ---------------------------------------- */

//       /* v13–v15 notifications */
//       .nav-link[href="/app/notifications"],
//       a[href="/app/notifications"],
//       li[data-route="notifications"],
//       .notifications,
//       .notification-list,
//       .navbar .nav-item .notifications-dropdown,
//       .navbar .notifications-dropdown,
//       .navbar-nav .notifications-dropdown,
//       .nav-item.dropdown.notifications-dropdown {
//         display: none !important;
//         visibility: hidden !important;
//         opacity: 0 !important;
//         width: 0 !important;
//         height: 0 !important;
//       }

//       /* Icons inside notification dropdown */
//       .notifications-icon,
//       .octicon-bell,
//       .fa-bell,
//       .fa.fa-bell,
//       i.fa.fa-bell-o,
//       i.octicon.octicon-bell {
//         display: none !important;
//       }

//       /* ERPNext v12 top bar notifications */
//       #navbar-notifications,
//       .navbar-notifications,
//       #notifications-icon {
//         display: none !important;
//       }

//       /* Hide Search Bar */
//       .navbar-search, .search-bar, input[type="search"] {
//         display: none !important;
//       }

//       /* Hide User Avatar Icon */
//       .navbar .dropdown-mobile,
//       .user-profile,
//       .navbar .nav-item.dropdown,
//       .navbar .nav-item .dropdown-toggle,
//       .nav-item.dropdown.user-profile,
//       .avatar, img.user-avatar {
//         display: none !important;
//       }
//     \`;

//     const style = document.createElement("style");
//     style.innerHTML = css;
//     document.head.appendChild(style);
//   }

//   // Keep trying until ERPNext fully loads
//   const interval = setInterval(() => {
//     if (document.body) {
//       hideElements();
//     }
//   }, 500);

//   setTimeout(() => clearInterval(interval), 8000);

//   true;
// `}

//       sharedCookiesEnabled={true}
//       thirdPartyCookiesEnabled={true}
//       javaScriptEnabled={true}
//       domStorageEnabled={true}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   loader: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center"
//   }
// });

// export default LeadScreen;









import React, { useEffect, useState, useRef } from "react";
import { View, ActivityIndicator, StyleSheet, BackHandler } from "react-native";
import { WebView } from "react-native-webview";

const LeadScreen = ({ route, navigation }) => {
  const { sid, erpUrl } = route.params || {};
  const [url, setUrl] = useState(null);
  const webviewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    const finalUrl = `${erpUrl}/app/expense-claim/`;
    setUrl(finalUrl);
  }, []);

  useEffect(() => {
    const backAction = () => {
      if (canGoBack && webviewRef.current) {
        webviewRef.current.goBack();
        return true;
      } else {
        navigation.goBack();
        return true;
      }
    };

    const subscription = BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => subscription.remove(); // modern way to remove listener
  }, [canGoBack]);

  if (!url) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <WebView
      ref={webviewRef}
      source={{ uri: url }}
      onNavigationStateChange={navState => setCanGoBack(navState.canGoBack)}
      injectedJavaScript={`
  document.cookie = "sid=${sid}; path=/;";

  function hideElements() {
    const css = \`
      /* ---------------------------------------
         🔥 Universal Notification Bell Hider
         Works for ERPNext v12, v13, v14, v15
      ---------------------------------------- */

      /* v13–v15 notifications */
      .nav-link[href="/app/notifications"],
      a[href="/app/notifications"],
      li[data-route="notifications"],
      .notifications,
      .notification-list,
      .navbar .nav-item .notifications-dropdown,
      .navbar .notifications-dropdown,
      .navbar-nav .notifications-dropdown,
      .nav-item.dropdown.notifications-dropdown {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        width: 0 !important;
        height: 0 !important;
      }

      /* Icons inside notification dropdown */
      .notifications-icon,
      .octicon-bell,
      .fa-bell,
      .fa.fa-bell,
      i.fa.fa-bell-o,
      i.octicon.octicon-bell {
        display: none !important;
      }

      /* ERPNext v12 top bar notifications */
      #navbar-notifications,
      .navbar-notifications,
      #notifications-icon {
        display: none !important;
      }

      /* Hide Search Bar */
      .navbar-search, .search-bar, input[type="search"] {
        display: none !important;
      }

      /* Hide User Avatar Icon */
      .navbar .dropdown-mobile,
      .user-profile,
      .navbar .nav-item.dropdown,
      .navbar .nav-item .dropdown-toggle,
      .nav-item.dropdown.user-profile,
      .avatar, img.user-avatar {
        display: none !important;
      }
    \`;

    const style = document.createElement("style");
    style.innerHTML = css;
    document.head.appendChild(style);
  }

  // Keep trying until ERPNext fully loads
  const interval = setInterval(() => {
    if (document.body) {
      hideElements();
    }
  }, 500);

  setTimeout(() => clearInterval(interval), 8000);

  true;
`}


      sharedCookiesEnabled={true}
      thirdPartyCookiesEnabled={true}
      javaScriptEnabled={true}
      domStorageEnabled={true}
    />
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default LeadScreen;
