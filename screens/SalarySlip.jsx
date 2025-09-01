
// // import React, { useEffect, useState } from 'react';
// // import {
// //   View,
// //   Text,
// //   ScrollView,
// //   ActivityIndicator,
// //   TouchableOpacity,
// //   StyleSheet,
// //   Alert,
// //   PermissionsAndroid,
// //   Platform,
// // } from 'react-native';
// // import axios from 'axios';
// // import RNHTMLtoPDF from 'react-native-html-to-pdf';
// // import RNFS from 'react-native-fs';
// // import FileViewer from 'react-native-file-viewer';
// // import Share from 'react-native-share';

// //  //const BASE_URL = 'https://erpnextcloud.cbditsolutions.com';
// // //const BASE_URL = 'https://mpda.in';

// // const SalarySlipModernScreen = ({ route }) => {
// //   const { sid, employeeData,erpUrl } = route.params || {};
// //   const [slips, setSlips] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const BASE_URL = erpUrl;

// //   useEffect(() => {
// //     fetchAllSlips();
// //   }, []);

// //   const fetchAllSlips = async () => {
// //     try {
// //       const res = await axios.get(
// //         `${BASE_URL}/api/resource/Salary Slip?fields=["name","start_date","end_date"]&filters=[["employee","=","${employeeData.name}"]]&order_by=start_date desc`,
// //         { headers: { Cookie: `sid=${sid}` } }
// //       );
// //       setSlips(res.data.data || []);
// //     } catch (err) {
// //       Alert.alert('Error', 'Error fetching slips');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const requestStoragePermission = async () => {
// //     if (Platform.OS === 'android' && Platform.Version <= 28) {
// //       const granted = await PermissionsAndroid.request(
// //         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
// //         {
// //           title: 'Storage Permission',
// //           message: 'App needs access to save PDF.',
// //           buttonPositive: 'OK',
// //         }
// //       );
// //       return granted === PermissionsAndroid.RESULTS.GRANTED;
// //     }
// //     return true;
// //   };

// //   const toWords = (num) => `INR ${Number(num).toLocaleString('en-IN')} only.`;

// //   const generateHTML = (slip) => `
// //     <html>
// //       <head>
// //         <style>
// //           body { font-family: Arial; padding: 20px; }
// //           h2, h3 { text-align: center; margin: 0; }
// //           .company { text-align: center; margin-bottom: 10px; }
// //           .row { margin-top: 6px; }
// //           table { width: 100%; border-collapse: collapse; margin-top: 10px; }
// //           th, td { border: 1px solid #000; padding: 6px; text-align: left; }
// //           .footer { margin-top: 20px; font-size: 14px; text-align: center; }
// //         </style>
// //       </head>
// //       <body>
// //         <div class="company">
// //           <h2>CBD IT SOLUTION PVT LTD</h2>
// //           <p>6th FLOOR, NAVARE PLAZA, RAMNAGAR,<br>DOMBIVLI (E) - 421201</p>
// //         </div>
// //         <h3>Payslip for ${slip.start_date} to ${slip.end_date}</h3>
// //         <div class="row"><strong>Employee Name:</strong> ${slip.employee_name}</div>
// //         <div class="row"><strong>Employee ID:</strong> ${slip.employee}</div>
// //         <div class="row"><strong>Designation:</strong> ${slip.designation || ''}</div>
// //         <div class="row"><strong>Paid Days:</strong> ${slip.payment_days}</div>
// //         <div class="row"><strong>LOP Days:</strong> ${slip.absent_days}</div>

// //         <h3>Earnings</h3>
// //         <table>
// //           <tr><th>Component</th><th>Amount</th></tr>
// //           ${(slip.earnings || []).map(e => `<tr><td>${e.salary_component}</td><td>${e.amount}</td></tr>`).join('')}
// //           <tr><th>Total Earnings</th><th>${slip.gross_pay}</th></tr>
// //         </table>

// //         <h3>Deductions</h3>
// //         <table>
// //           <tr><th>Component</th><th>Amount</th></tr>
// //           ${(slip.deductions || []).map(d => `<tr><td>${d.salary_component}</td><td>${d.amount}</td></tr>`).join('')}
// //           <tr><th>Total Deductions</th><th>${slip.total_deduction}</th></tr>
// //         </table>

// //         <h3>Net Pay</h3>
// //         <table>
// //           <tr><td>Net Pay</td><td>${slip.net_pay}</td></tr>
// //           <tr><td colspan="2"><strong>Amount in words:</strong> ${toWords(slip.net_pay)}</td></tr>
// //         </table>

// //         <div class="footer">
// //           <p>This is a system-generated payslip.</p>
// //         </div>
// //       </body>
// //     </html>
// //   `;

// //   const sanitizeFileName = (name) => {
// //     return name.replace(/[^a-zA-Z0-9-_]/g, '_');
// //   };

// //   const generatePDF = async (slipId) => {
// //     try {
// //       const hasPermission = await requestStoragePermission();
// //       if (!hasPermission) {
// //         Alert.alert('Permission Denied', 'Cannot save PDF without permission');
// //         return;
// //       }

// //       const res = await axios.get(`${BASE_URL}/api/resource/Salary Slip/${slipId}`, {
// //         headers: { Cookie: `sid=${sid}` },
// //       });
// //       const slip = res.data.data;

// //       const rawName = `SalSlip_${slip.employee}_${slip.name}`;
// //       const safeFileName = sanitizeFileName(rawName);

// //       const pdf = await RNHTMLtoPDF.convert({
// //         html: generateHTML(slip),
// //         fileName: safeFileName,
// //         directory: 'Documents',
// //       });

// //       const finalPath = Platform.OS === 'android'
// //         ? `${RNFS.DownloadDirectoryPath}/${safeFileName}.pdf`
// //         : pdf.filePath;

// //       if (Platform.OS === 'android') {
// //         await RNFS.copyFile(pdf.filePath, finalPath);
// //       }

// //       Alert.alert(
// //         'PDF Saved',
// //         `PDF saved at:\n${finalPath}`,
// //         [
// //           {
// //             text: 'Open',
// //             onPress: () =>
// //               FileViewer.open(finalPath).catch(() =>
// //                 Alert.alert('Error', 'No app found to open PDF.')
// //               ),
// //           },
// //           {
// //             text: 'Share',
// //             onPress: () => {
// //               Share.open({
// //                 title: 'Share Slip',
// //                 url: `file://${finalPath}`,
// //                 type: 'application/pdf',
// //               }).catch(() => {});
// //             },
// //           },
// //           { text: 'OK' },
// //         ]
// //       );
// //     } catch (err) {
// //       console.error('PDF generation failed:', err);
// //       Alert.alert('Error', 'PDF generation failed');
// //     }
// //   };

// //   if (loading) return <ActivityIndicator style={{ marginTop: 100 }} size="large" />;
// //   if (!slips.length) return <Text style={{ padding: 20 }}>No Salary Slips Found</Text>;

// //   return (
// //     <ScrollView style={styles.container}>
// //       <Text style={styles.title}>All Salary Slips</Text>
// //       {slips.map((slip, index) => (
// //         <TouchableOpacity
// //           key={index}
// //           style={styles.card}
// //           onPress={() => generatePDF(slip.name)}
// //         >
// //           <Text style={styles.cardText}>
// //             Month: {new Date(slip.start_date).toLocaleDateString()} to {new Date(slip.end_date).toLocaleDateString()}
// //           </Text>
// //           <Text style={styles.downloadText}>Download PDF</Text>
// //         </TouchableOpacity>
// //       ))}
// //     </ScrollView>
// //   );
// // };

// // export default SalarySlipModernScreen;

// // const styles = StyleSheet.create({
// //   container: { padding: 16 },
// //   title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
// //   card: {
// //     backgroundColor: '#f0f0f0',
// //     padding: 14,
// //     marginBottom: 10,
// //     borderRadius: 6,
// //   },
// //   cardText: { fontSize: 16, color: '#333' },
// //   downloadText: { fontSize: 14, color: '#007bff', marginTop: 6 },
// // });




import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import axios from 'axios';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import Share from 'react-native-share';

const SalarySlipModernScreen = ({ route }) => {
  const { sid, employeeData, erpUrl } = route.params || {};
  const [slips, setSlips] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = erpUrl;

  useEffect(() => {
    fetchAllSlips();
  }, []);

  const fetchAllSlips = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/resource/Salary Slip?fields=["name","start_date","end_date"]&filters=[["employee","=","${employeeData.name}"]]&order_by=start_date desc`,
        { headers: { Cookie: `sid=${sid}` } }
      );
      setSlips(res.data.data || []);
    } catch (err) {
      Alert.alert('Error', 'Error fetching slips');
    } finally {
      setLoading(false);
    }
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android' && Platform.Version <= 29) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to save PDF.',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const toWords = (num) => `INR ${Number(num).toLocaleString('en-IN')} only.`;

  const generateHTML = (slip) => `
    <html>
      <head>
        <style>
          body { font-family: Arial; padding: 20px; }
          h2, h3 { text-align: center; margin: 0; }
          .company { text-align: center; margin-bottom: 10px; }
          .row { margin-top: 6px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #000; padding: 6px; text-align: left; }
          .footer { margin-top: 20px; font-size: 14px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="company">
          <h2>CBD IT SOLUTION PVT LTD</h2>
          <p>6th FLOOR, NAVARE PLAZA, RAMNAGAR,<br>DOMBIVLI (E) - 421201</p>
        </div>
        <h3>Payslip for ${slip.start_date} to ${slip.end_date}</h3>
        <div class="row"><strong>Employee Name:</strong> ${slip.employee_name}</div>
        <div class="row"><strong>Employee ID:</strong> ${slip.employee}</div>
        <div class="row"><strong>Designation:</strong> ${slip.designation || ''}</div>
        <div class="row"><strong>Paid Days:</strong> ${slip.payment_days}</div>
        <div class="row"><strong>LOP Days:</strong> ${slip.absent_days}</div>

        <h3>Earnings</h3>
        <table>
          <tr><th>Component</th><th>Amount</th></tr>
          ${(slip.earnings || []).map(e => `<tr><td>${e.salary_component}</td><td>${e.amount}</td></tr>`).join('')}
          <tr><th>Total Earnings</th><th>${slip.gross_pay}</th></tr>
        </table>

        <h3>Deductions</h3>
        <table>
          <tr><th>Component</th><th>Amount</th></tr>
          ${(slip.deductions || []).map(d => `<tr><td>${d.salary_component}</td><td>${d.amount}</td></tr>`).join('')}
          <tr><th>Total Deductions</th><th>${slip.total_deduction}</th></tr>
        </table>

        <h3>Net Pay</h3>
        <table>
          <tr><td>Net Pay</td><td>${slip.net_pay}</td></tr>
          <tr><td colspan="2"><strong>Amount in words:</strong> ${toWords(slip.net_pay)}</td></tr>
        </table>

        <div class="footer">
          <p>This is a system-generated payslip.</p>
        </div>
      </body>
    </html>
  `;

  const sanitizeFileName = (name) => {
    return name.replace(/[^a-zA-Z0-9-_]/g, '_');
  };

  


  const generatePDF = async (slipId) => {
  try {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert(
        'Storage Permission Denied',
        'You need to allow storage access to save the PDF file.\n\nGo to Settings > Apps > [Your App] > Permissions to enable it.',
        [{ text: 'OK' }]
      );
      return;
    }

    const res = await axios.get(`${BASE_URL}/api/resource/Salary Slip/${slipId}`, {
      headers: { Cookie: `sid=${sid}` },
    });
    const slip = res.data.data;

    const rawName = `SalSlip_${slip.employee}_${slip.name}`;
    const safeFileName = sanitizeFileName(rawName);
    const timestamp = Date.now();
    const finalFileName = `${safeFileName}_${timestamp}.pdf`;

    // Generate temporary PDF
    const tempPdf = await RNHTMLtoPDF.convert({
      html: generateHTML(slip),
      fileName: finalFileName,
      base64: false,
    });

    // Preferred path - Download/SalarySlip
    const preferredDir = `${RNFS.DownloadDirectoryPath}/SalarySlip`;
    const fallbackDir = `${RNFS.DocumentDirectoryPath}/SalarySlip`; // Android/data/com.erpnext/files

    let targetDir = preferredDir;
    let finalPath = `${targetDir}/${finalFileName}`;

    try {
      const folderExists = await RNFS.exists(preferredDir);
      if (!folderExists) {
        await RNFS.mkdir(preferredDir);
      }
      await RNFS.copyFile(tempPdf.filePath, finalPath); // Try saving to Downloads
    } catch (err) {
      console.warn('❗ Falling back to internal storage:', err.message);

      // Fallback to Documents
      targetDir = fallbackDir;
      finalPath = `${targetDir}/${finalFileName}`;

      const fallbackExists = await RNFS.exists(fallbackDir);
      if (!fallbackExists) {
        await RNFS.mkdir(fallbackDir);
      }
      await RNFS.copyFile(tempPdf.filePath, finalPath);
    }

    Alert.alert(
      'PDF Saved',
      `PDF saved at:\n${finalPath}`,
      [
        {
          text: 'Open',
          onPress: () =>
            FileViewer.open(finalPath).catch(() =>
              Alert.alert('Error', 'No app found to open PDF.')
            ),
        },
        {
          text: 'Share',
          onPress: () =>
            Share.open({
              title: 'Share Slip',
              url: `file://${finalPath}`,
              type: 'application/pdf',
            }).catch(() => {}),
        },
        { text: 'OK' },
      ]
    );
  } catch (err) {
    console.error('PDF generation failed:', err);
    Alert.alert('Error', 'PDF generation failed');
  }
};


  if (loading) return <ActivityIndicator style={{ marginTop: 100 }} size="large" />;
  if (!slips.length) return <Text style={{ padding: 20, color:'black' }}>No Salary Slips Found</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>All Salary Slips</Text>
      {slips.map((slip, index) => (
        <TouchableOpacity
          key={index}
          style={styles.card}
          onPress={() => generatePDF(slip.name)}
        >
          <Text style={styles.cardText}>
            Month: {new Date(slip.start_date).toLocaleDateString()} to {new Date(slip.end_date).toLocaleDateString()}
          </Text>
          <Text style={styles.downloadText}>Download PDF</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default SalarySlipModernScreen;

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 14,
    marginBottom: 10,
    borderRadius: 6,
  },
  cardText: { fontSize: 16, color: '#333' },
  downloadText: { fontSize: 14, color: '#007bff', marginTop: 6 },
});


