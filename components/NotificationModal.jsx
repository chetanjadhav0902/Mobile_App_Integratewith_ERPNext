// import React from 'react';
// import { Modal, View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

// const NotificationModal = ({ visible, onClose, notifications }) => {
//   const renderItem = ({ item }) => (
//     <View style={styles.notificationItem}>
//       <Text style={styles.notificationText}>{item.message}</Text>
//       <Text style={styles.status}>{item.status}</Text>
//     </View>
//   );

//   return (
//     <Modal visible={visible} animationType="slide" transparent>
//       <View style={styles.modalOverlay}>
//         <View style={styles.modalContent}>
//           <Text style={styles.modalTitle}>Notifications</Text>
//           <FlatList
//             data={notifications}
//             keyExtractor={(item) => item.id.toString()}
//             renderItem={renderItem}
//             contentContainerStyle={{ paddingBottom: 10 }}
//           />
//           <TouchableOpacity onPress={onClose} style={styles.closeButton}>
//             <Text style={styles.closeButtonText}>Close</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// export default NotificationModal;

// const styles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.4)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     width: '90%',
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 20,
//     maxHeight: '80%',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   notificationItem: {
//     paddingVertical: 10,
//     borderBottomWidth: 0.5,
//     borderBottomColor: '#ccc',
//   },
//   notificationText: {
//     fontSize: 14,
//     color: '#333',
//   },
//   status: {
//     fontSize: 12,
//     color: 'gray',
//     marginTop: 2,
//   },
//   closeButton: {
//     marginTop: 15,
//     backgroundColor: '#007bff',
//     padding: 10,
//     borderRadius: 6,
//     alignItems: 'center',
//   },
//   closeButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
// });



import React, { useEffect } from 'react';
import { Modal, View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const NotificationModal = ({ visible, onClose, notifications, markAllSeen }) => {
  useEffect(() => {
    if (visible) {
      markAllSeen(); // Mark as seen when modal is shown
    }
  }, [visible]);

  const renderItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationText}>{item.message}</Text>
      <Text style={styles.status}>{item.status}</Text>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Notifications</Text>
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 10 }}
          />
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default NotificationModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  notificationItem: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  notificationText: {
    fontSize: 14,
    color: '#333',
  },
  status: {
    fontSize: 12,
    color: 'gray',
    marginTop: 2,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
