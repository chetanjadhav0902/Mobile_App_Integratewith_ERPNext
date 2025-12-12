
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




// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   PermissionsAndroid,
//   Platform,
// } from 'react-native';
// import axios from 'axios';
// import RNHTMLtoPDF from 'react-native-html-to-pdf';
// import RNFS from 'react-native-fs';
// import FileViewer from 'react-native-file-viewer';
// import Share from 'react-native-share';

// const SalarySlipModernScreen = ({ route }) => {
//   const { sid, employeeData, erpUrl } = route.params || {};
//   const [slips, setSlips] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const BASE_URL = erpUrl;

//   useEffect(() => {
//     fetchAllSlips();
//   }, []);

//   const fetchAllSlips = async () => {
//     try {
//       const res = await axios.get(
//         `${BASE_URL}/api/resource/Salary Slip?fields=["name","start_date","end_date"]&filters=[["employee","=","${employeeData.name}"]]&order_by=start_date desc`,
//         { headers: { Cookie: `sid=${sid}` } }
//       );
//       setSlips(res.data.data || []);
//     } catch (err) {
//       Alert.alert('Error', 'Error fetching slips');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const requestStoragePermission = async () => {
//     if (Platform.OS === 'android' && Platform.Version <= 29) {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//         {
//           title: 'Storage Permission',
//           message: 'App needs access to save PDF.',
//           buttonPositive: 'OK',
//         }
//       );
//       return granted === PermissionsAndroid.RESULTS.GRANTED;
//     }
//     return true;
//   };

//   const toWords = (num) => `INR ${Number(num).toLocaleString('en-IN')} only.`;

//   const generateHTML = (slip) => `
//     <html>
//       <head>
//         <style>
//           body { font-family: Arial; padding: 20px; }
//           h2, h3 { text-align: center; margin: 0; }
//           .company { text-align: center; margin-bottom: 10px; }
//           .row { margin-top: 6px; }
//           table { width: 100%; border-collapse: collapse; margin-top: 10px; }
//           th, td { border: 1px solid #000; padding: 6px; text-align: left; }
//           .footer { margin-top: 20px; font-size: 14px; text-align: center; }
//         </style>
//       </head>
//       <body>
//         <div class="company">
//           <h2>${slip.company}</h2>
//           <p>6th FLOOR, NAVARE PLAZA, RAMNAGAR,<br>DOMBIVLI (E) - 421201</p>
//         </div>
//         <h3>Payslip for ${slip.start_date} to ${slip.end_date}</h3>
//         <div class="row"><strong>Employee Name:</strong> ${slip.employee_name}</div>
//         <div class="row"><strong>Employee ID:</strong> ${slip.employee}</div>
//         <div class="row"><strong>Designation:</strong> ${slip.designation || ''}</div>
//         <div class="row"><strong>Paid Days:</strong> ${slip.payment_days}</div>
//         <div class="row"><strong>LOP Days:</strong> ${slip.absent_days}</div>

//         <h3>Earnings</h3>
//         <table>
//           <tr><th>Component</th><th>Amount</th></tr>
//           ${(slip.earnings || []).map(e => `<tr><td>${e.salary_component}</td><td>${e.amount}</td></tr>`).join('')}
//           <tr><th>Total Earnings</th><th>${slip.gross_pay}</th></tr>
//         </table>

//         <h3>Deductions</h3>
//         <table>
//           <tr><th>Component</th><th>Amount</th></tr>
//           ${(slip.deductions || []).map(d => `<tr><td>${d.salary_component}</td><td>${d.amount}</td></tr>`).join('')}
//           <tr><th>Total Deductions</th><th>${slip.total_deduction}</th></tr>
//         </table>

//         <h3>Net Pay</h3>
//         <table>
//           <tr><td>Net Pay</td><td>${slip.net_pay}</td></tr>
//           <tr><td colspan="2"><strong>Amount in words:</strong> ${toWords(slip.net_pay)}</td></tr>
//         </table>

//         <div class="footer">
//           <p>This is a system-generated payslip.</p>
//         </div>
//       </body>
//     </html>
//   `;

//   const sanitizeFileName = (name) => {
//     return name.replace(/[^a-zA-Z0-9-_]/g, '_');
//   };

  


//   const generatePDF = async (slipId) => {
//   try {
//     const hasPermission = await requestStoragePermission();
//     if (!hasPermission) {
//       Alert.alert(
//         'Storage Permission Denied',
//         'You need to allow storage access to save the PDF file.\n\nGo to Settings > Apps > [Your App] > Permissions to enable it.',
//         [{ text: 'OK' }]
//       );
//       return;
//     }

//     const res = await axios.get(`${BASE_URL}/api/resource/Salary Slip/${slipId}`, {
//       headers: { Cookie: `sid=${sid}` },
//     });
//     const slip = res.data.data;

//     const rawName = `SalSlip_${slip.employee}_${slip.name}`;
//     const safeFileName = sanitizeFileName(rawName);
//     const timestamp = Date.now();
//     const finalFileName = `${safeFileName}_${timestamp}.pdf`;

//     // Generate temporary PDF
//     const tempPdf = await RNHTMLtoPDF.convert({
//       html: generateHTML(slip),
//       fileName: finalFileName,
//       base64: false,
//     });

//     // Preferred path - Download/SalarySlip
//     const preferredDir = `${RNFS.DownloadDirectoryPath}/SalarySlip`;
//     const fallbackDir = `${RNFS.DocumentDirectoryPath}/SalarySlip`; // Android/data/com.erpnext/files

//     let targetDir = preferredDir;
//     let finalPath = `${targetDir}/${finalFileName}`;

//     try {
//       const folderExists = await RNFS.exists(preferredDir);
//       if (!folderExists) {
//         await RNFS.mkdir(preferredDir);
//       }
//       await RNFS.copyFile(tempPdf.filePath, finalPath); // Try saving to Downloads
//     } catch (err) {
//       console.warn('❗ Falling back to internal storage:', err.message);

//       // Fallback to Documents
//       targetDir = fallbackDir;
//       finalPath = `${targetDir}/${finalFileName}`;

//       const fallbackExists = await RNFS.exists(fallbackDir);
//       if (!fallbackExists) {
//         await RNFS.mkdir(fallbackDir);
//       }
//       await RNFS.copyFile(tempPdf.filePath, finalPath);
//     }

//     Alert.alert(
//       'PDF Saved',
//       `PDF saved at:\n${finalPath}`,
//       [
//         {
//           text: 'Open',
//           onPress: () =>
//             FileViewer.open(finalPath).catch(() =>
//               Alert.alert('Error', 'No app found to open PDF.')
//             ),
//         },
//         {
//           text: 'Share',
//           onPress: () =>
//             Share.open({
//               title: 'Share Slip',
//               url: `file://${finalPath}`,
//               type: 'application/pdf',
//             }).catch(() => {}),
//         },
//         { text: 'OK' },
//       ]
//     );
//   } catch (err) {
//     console.error('PDF generation failed:', err);
//     Alert.alert('Error', 'PDF generation failed');
//   }
// };


//   if (loading) return <ActivityIndicator style={{ marginTop: 100 }} size="large" />;
//   if (!slips.length) return <Text style={{ padding: 20, color:'black' }}>No Salary Slips Found</Text>;

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>All Salary Slips</Text>
//       {slips.map((slip, index) => (
//         <TouchableOpacity
//           key={index}
//           style={styles.card}
//           onPress={() => generatePDF(slip.name)}
//         >
//           <Text style={styles.cardText}>
//             Month: {new Date(slip.start_date).toLocaleDateString()} to {new Date(slip.end_date).toLocaleDateString()}
//           </Text>
//           <Text style={styles.downloadText}>Download PDF</Text>
//         </TouchableOpacity>
//       ))}
//     </ScrollView>
//   );
// };

// export default SalarySlipModernScreen;

// const styles = StyleSheet.create({
//   container: { padding: 16 },
//   title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
//   card: {
//     backgroundColor: '#f0f0f0',
//     padding: 14,
//     marginBottom: 10,
//     borderRadius: 6,
//   },
//   cardText: { fontSize: 16, color: '#333' },
//   downloadText: { fontSize: 14, color: '#007bff', marginTop: 6 },
// });



//new salary slip address code from company with child table


// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   PermissionsAndroid,
//   Platform,
// } from 'react-native';
// import axios from 'axios';
// import RNHTMLtoPDF from 'react-native-html-to-pdf';
// import RNFS from 'react-native-fs';
// import FileViewer from 'react-native-file-viewer';
// import Share from 'react-native-share';

// const SalarySlipModernScreen = ({ route }) => {
//   const { sid, employeeData, erpUrl } = route.params || {};
//   const [slips, setSlips] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const BASE_URL = erpUrl;

//   useEffect(() => {
//     fetchAllSlips();
//   }, []);

//   const fetchAllSlips = async () => {
//     try {
//       const res = await axios.get(
//         `${BASE_URL}/api/resource/Salary Slip?fields=["name","start_date","end_date"]&filters=[["employee","=","${employeeData.name}"]]&order_by=start_date desc`,
//         { headers: { Cookie: `sid=${sid}` } }
//       );
//       setSlips(res.data.data || []);
//     } catch (err) {
//       Alert.alert('Error', 'Error fetching slips');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const requestStoragePermission = async () => {
//     if (Platform.OS === 'android' && Platform.Version <= 29) {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//         {
//           title: 'Storage Permission',
//           message: 'App needs access to save PDF.',
//           buttonPositive: 'OK',
//         }
//       );
//       return granted === PermissionsAndroid.RESULTS.GRANTED;
//     }
//     return true;
//   };

//   const toWords = (num) => `INR ${Number(num).toLocaleString('en-IN')} only.`;

//   // ✅ Fetch company address from Address doctype (using links)
//   const fetchCompanyAddress = async (companyName) => {
//     try {
//       console.log("🔍 Fetching address for company:", companyName);

//       // Step 1️⃣: Get limited list of address names
//       const listRes = await axios.get(
//         `${BASE_URL}/api/resource/Address?fields=["name"]&limit_page_length=100`,
//         { headers: { Cookie: `sid=${sid}` } }
//       );

//       const addressList = listRes.data.data || [];
//       console.log(`📦 Found ${addressList.length} address records`);

//       // Step 2️⃣: Loop through address list and fetch each full record
//       for (const addr of addressList) {
//         const detailRes = await axios.get(
//           `${BASE_URL}/api/resource/Address/${encodeURIComponent(addr.name)}`,
//           { headers: { Cookie: `sid=${sid}` } }
//         );

//         const full = detailRes.data.data;

//         // ✅ Match company link
//         if (
//           Array.isArray(full.links) &&
//           full.links.some(
//             (l) =>
//               l.link_doctype === "Company" &&
//               l.link_name.toLowerCase().trim() === companyName.toLowerCase().trim()
//           )
//         ) {
//           console.log("🏢 Found company address:", full.name);
//           return {
//             address_line1: full.salary_slip_address || "—",
//             pincode: full.pincode || "—",
//           };
//         }
//       }

//       console.warn(`⚠️ No matching address found for company: ${companyName}`);
//       return { address_line1: "Address not found", pincode: "" };
//     } catch (err) {
//       console.error("❌ Error fetching company address:", err.message);
//       return { address_line1: "Address not found", pincode: "" };
//     }
//   };

//   const generateHTML = (slip, companyAddress) => `
//     <html>
//       <head>
//         <style>
//           body { font-family: Arial; padding: 20px; }
//           h2, h3 { text-align: center; margin: 0; }
//           .company { text-align: center; margin-bottom: 10px; }
//           .row { margin-top: 6px; }
//           table { width: 100%; border-collapse: collapse; margin-top: 10px; }
//           th, td { border: 1px solid #000; padding: 6px; text-align: left; }
//           .footer { margin-top: 20px; font-size: 14px; text-align: center; }
//         </style>
//       </head>
//       <body>
//         <div class="company">
//           <h2>${slip.company || 'Company Name'}</h2>
//           <p>${companyAddress.address_line1 || ''}<br>${companyAddress.pincode || ''}</p>
//         </div>
//         <h3>Payslip for ${slip.start_date} to ${slip.end_date}</h3>
//         <div class="row"><strong>Employee Name:</strong> ${slip.employee_name}</div>
//         <div class="row"><strong>Employee ID:</strong> ${slip.employee}</div>
//         <div class="row"><strong>Designation:</strong> ${slip.designation || ''}</div>
//         <div class="row"><strong>Paid Days:</strong> ${slip.payment_days}</div>
//         <div class="row"><strong>LOP Days:</strong> ${slip.absent_days}</div>

//         <h3>Earnings</h3>
//         <table>
//           <tr><th>Component</th><th>Amount</th></tr>
//           ${(slip.earnings || [])
//             .map(
//               (e) =>
//                 `<tr><td>${e.salary_component}</td><td>${e.amount}</td></tr>`
//             )
//             .join('')}
//           <tr><th>Total Earnings</th><th>${slip.gross_pay}</th></tr>
//         </table>

//         <h3>Deductions</h3>
//         <table>
//           <tr><th>Component</th><th>Amount</th></tr>
//           ${(slip.deductions || [])
//             .map(
//               (d) =>
//                 `<tr><td>${d.salary_component}</td><td>${d.amount}</td></tr>`
//             )
//             .join('')}
//           <tr><th>Total Deductions</th><th>${slip.total_deduction}</th></tr>
//         </table>

//         <h3>Net Pay</h3>
//         <table>
//           <tr><td>Net Pay</td><td>${slip.net_pay}</td></tr>
//           <tr><td colspan="2"><strong>Amount in words:</strong> ${toWords(
//             slip.net_pay
//           )}</td></tr>
//         </table>

//         <div class="footer">
//           <p>This is a system-generated payslip.</p>
//         </div>
//       </body>
//     </html>
//   `;

//   const sanitizeFileName = (name) => {
//     return name.replace(/[^a-zA-Z0-9-_]/g, '_');
//   };

//   const generatePDF = async (slipId) => {
//     try {
//       const hasPermission = await requestStoragePermission();
//       if (!hasPermission) {
//         Alert.alert(
//           'Storage Permission Denied',
//           'You need to allow storage access to save the PDF file.\n\nGo to Settings > Apps > [Your App] > Permissions to enable it.',
//           [{ text: 'OK' }]
//         );
//         return;
//       }

//       const res = await axios.get(`${BASE_URL}/api/resource/Salary Slip/${slipId}`, {
//         headers: { Cookie: `sid=${sid}` },
//       });
//       const slip = res.data.data;

//       // 🧩 Fetch matching address for this company
//       const companyAddress = await fetchCompanyAddress(slip.company);

//       const rawName = `SalSlip_${slip.employee}_${slip.name}`;
//       const safeFileName = sanitizeFileName(rawName);
//       const timestamp = Date.now();
//       const finalFileName = `${safeFileName}_${timestamp}.pdf`;

//       // Generate temporary PDF
//       const tempPdf = await RNHTMLtoPDF.convert({
//         html: generateHTML(slip, companyAddress),
//         fileName: finalFileName,
//         base64: false,
//       });

//       const preferredDir = `${RNFS.DownloadDirectoryPath}/SalarySlip`;
//       const fallbackDir = `${RNFS.DocumentDirectoryPath}/SalarySlip`;

//       let targetDir = preferredDir;
//       let finalPath = `${targetDir}/${finalFileName}`;

//       try {
//         const folderExists = await RNFS.exists(preferredDir);
//         if (!folderExists) {
//           await RNFS.mkdir(preferredDir);
//         }
//         await RNFS.copyFile(tempPdf.filePath, finalPath);
//       } catch (err) {
//         console.warn('❗ Falling back to internal storage:', err.message);
//         targetDir = fallbackDir;
//         finalPath = `${targetDir}/${finalFileName}`;
//         const fallbackExists = await RNFS.exists(fallbackDir);
//         if (!fallbackExists) {
//           await RNFS.mkdir(fallbackDir);
//         }
//         await RNFS.copyFile(tempPdf.filePath, finalPath);
//       }

//       Alert.alert(
//         'PDF Saved',
//         `PDF saved at:\n${finalPath}`,
//         [
//           {
//             text: 'Open',
//             onPress: () =>
//               FileViewer.open(finalPath).catch(() =>
//                 Alert.alert('Error', 'No app found to open PDF.')
//               ),
//           },
//           {
//             text: 'Share',
//             onPress: () =>
//               Share.open({
//                 title: 'Share Slip',
//                 url: `file://${finalPath}`,
//                 type: 'application/pdf',
//               }).catch(() => {}),
//           },
//           { text: 'OK' },
//         ]
//       );
//     } catch (err) {
//       console.error('PDF generation failed:', err);
//       Alert.alert('Error', 'PDF generation failed');
//     }
//   };

//   if (loading) return <ActivityIndicator style={{ marginTop: 100 }} size="large" />;
//   if (!slips.length) return <Text style={{ padding: 20, color: 'black' }}>No Salary Slips Found</Text>;

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>All Salary Slips</Text>
//       {slips.map((slip, index) => (
//         <TouchableOpacity
//           key={index}
//           style={styles.card}
//           onPress={() => generatePDF(slip.name)}
//         >
//           <Text style={styles.cardText}>
//             Month: {new Date(slip.start_date).toLocaleDateString()} to{' '}
//             {new Date(slip.end_date).toLocaleDateString()}
//           </Text>
//           <Text style={styles.downloadText}>Download PDF</Text>
//         </TouchableOpacity>
//       ))}
//     </ScrollView>
//   );
// };

// export default SalarySlipModernScreen;

// const styles = StyleSheet.create({
//   container: { padding: 16 },
//   title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
//   card: {
//     backgroundColor: '#f0f0f0',
//     padding: 14,
//     marginBottom: 10,
//     borderRadius: 6,
//   },
//   cardText: { fontSize: 16, color: '#333' },
//   downloadText: { fontSize: 14, color: '#007bff', marginTop: 6 },
// });




// address from company as salary_slip_address


// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   PermissionsAndroid,
//   Platform,
// } from 'react-native';
// import axios from 'axios';
// import RNHTMLtoPDF from 'react-native-html-to-pdf';
// import RNFS from 'react-native-fs';
// import FileViewer from 'react-native-file-viewer';
// import Share from 'react-native-share';

// const SalarySlipModernScreen = ({ route }) => {
//   const { sid, employeeData, erpUrl } = route.params || {};
//   const [slips, setSlips] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const BASE_URL = erpUrl;

//   useEffect(() => {
//     fetchAllSlips();
//   }, []);

//   const fetchAllSlips = async () => {
//     try {
//       const res = await axios.get(
//         `${BASE_URL}/api/resource/Salary Slip?fields=["name","start_date","end_date"]&filters=[["employee","=","${employeeData.name}"]]&order_by=start_date desc`,
//         { headers: { Cookie: `sid=${sid}` } }
//       );
//       setSlips(res.data.data || []);
//     } catch (err) {
//       Alert.alert('Error', 'Error fetching slips');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const requestStoragePermission = async () => {
//     if (Platform.OS === 'android' && Platform.Version <= 29) {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//         {
//           title: 'Storage Permission',
//           message: 'App needs access to save PDF.',
//           buttonPositive: 'OK',
//         }
//       );
//       return granted === PermissionsAndroid.RESULTS.GRANTED;
//     }
//     return true;
//   };

//   const toWords = (num) => `INR ${Number(num).toLocaleString('en-IN')} only.`;

//   // ✅ NEW: Fetch company address directly from Company doctype
//  const fetchCompanyAddress = async (companyNameFromSlip) => {
//   try {
//     console.log("🏢 Fetching salary_slip_address for company:", companyNameFromSlip);

//     // Step 1️⃣: Get all companies with name field only
//     const listRes = await axios.get(
//       `${BASE_URL}/api/resource/Company?fields=["name"]&limit_page_length=0`,
//       { headers: { Cookie: `sid=${sid}` } }
//     );

//     const companies = listRes.data.data || [];
//     console.log(`📦 Found ${companies.length} companies in ERPNext`);

//     // Step 2️⃣: Match the company name from Salary Slip with Company doctype
//     const matchedCompany = companies.find(
//       (c) =>
//         c.name.toLowerCase().trim() === companyNameFromSlip.toLowerCase().trim()
//     );

//     if (!matchedCompany) {
//       console.warn(`⚠️ No matching company found for "${companyNameFromSlip}"`);
//       return { salary_slip_address: "Company not found" };
//     }

//     console.log("✅ Matched company:", matchedCompany.name);

//     // Step 3️⃣: Fetch that company’s details to get salary_slip_address
//     const companyRes = await axios.get(
//       `${BASE_URL}/api/resource/Company/${encodeURIComponent(matchedCompany.name)}`,
//       { headers: { Cookie: `sid=${sid}` } }
//     );

//     const company = companyRes.data.data;
//     const salarySlipAddress = company.salary_slip_address;

//     if (!salarySlipAddress) {
//       console.warn(`⚠️ salary_slip_address not set for company: ${matchedCompany.name}`);
//       return { salary_slip_address: "Address not available" };
//     }

//     console.log("✅ salary_slip_address fetched:", salarySlipAddress);
//     return { salary_slip_address: salarySlipAddress };

//   } catch (err) {
//     console.error("❌ Error fetching salary_slip_address:", err.message);
//     if (err.response && err.response.status === 404) {
//       console.warn(`⚠️ Company not found in ERPNext: "${companyNameFromSlip}"`);
//     }
//     return { salary_slip_address: "Address not found" };
//   }
// };

//   const generateHTML = (slip, companyAddress) => `
//   <html>
//     <head>
//       <style>
//         body { font-family: Arial; padding: 20px; }
//         h2, h3 { text-align: center; margin: 0; }
//         .company { text-align: center; margin-bottom: 10px; }
//         .row { margin-top: 6px; }
//         table { width: 100%; border-collapse: collapse; margin-top: 10px; }
//         th, td { border: 1px solid #000; padding: 6px; text-align: left; }
//         .footer { margin-top: 20px; font-size: 14px; text-align: center; }
//       </style>
//     </head>
//     <body>
//       <div class="company">
//         <h2>${slip.company || 'Company Name'}</h2>
//         <p>${companyAddress.salary_slip_address || 'Address not available'}</p>
//       </div>

//       <h3>Payslip for ${slip.start_date} to ${slip.end_date}</h3>

//       <div class="row"><strong>Employee Name:</strong> ${slip.employee_name}</div>
//       <div class="row"><strong>Employee ID:</strong> ${slip.employee}</div>
//       <div class="row"><strong>Designation:</strong> ${slip.designation || ''}</div>
//       <div class="row"><strong>Paid Days:</strong> ${slip.payment_days}</div>
//       <div class="row"><strong>LOP Days:</strong> ${slip.absent_days}</div>

//       <h3>Earnings</h3>
//       <table>
//         <tr><th>Component</th><th>Amount</th></tr>
//         ${(slip.earnings || [])
//           .map(
//             (e) =>
//               `<tr><td>${e.salary_component}</td><td>${e.amount}</td></tr>`
//           )
//           .join('')}
//         <tr><th>Total Earnings</th><th>${slip.gross_pay}</th></tr>
//       </table>

//       <h3>Deductions</h3>
//       <table>
//         <tr><th>Component</th><th>Amount</th></tr>
//         ${(slip.deductions || [])
//           .map(
//             (d) =>
//               `<tr><td>${d.salary_component}</td><td>${d.amount}</td></tr>`
//           )
//           .join('')}
//         <tr><th>Total Deductions</th><th>${slip.total_deduction}</th></tr>
//       </table>

//       <h3>Net Pay</h3>
//       <table>
//         <tr><td>Net Pay</td><td>${slip.net_pay}</td></tr>
//         <tr><td colspan="2"><strong>Amount in words:</strong> ${toWords(
//           slip.net_pay
//         )}</td></tr>
//       </table>

//       <div class="footer">
//         <p>This is a system-generated payslip.</p>
//       </div>
//     </body>
//   </html>
// `;

//   const sanitizeFileName = (name) => {
//     return name.replace(/[^a-zA-Z0-9-_]/g, '_');
//   };

//   const generatePDF = async (slipId) => {
//     try {
//       const hasPermission = await requestStoragePermission();
//       if (!hasPermission) {
//         Alert.alert(
//           'Storage Permission Denied',
//           'You need to allow storage access to save the PDF file.\n\nGo to Settings > Apps > [Your App] > Permissions to enable it.',
//           [{ text: 'OK' }]
//         );
//         return;
//       }

//       const res = await axios.get(`${BASE_URL}/api/resource/Salary Slip/${slipId}`, {
//         headers: { Cookie: `sid=${sid}` },
//       });
//       const slip = res.data.data;

//       // ✅ Fetch company address directly from Company doctype
//       const companyAddress = await fetchCompanyAddress(slip.company);

//       const rawName = `SalSlip_${slip.employee}_${slip.name}`;
//       const safeFileName = sanitizeFileName(rawName);
//       const timestamp = Date.now();
//       const finalFileName = `${safeFileName}_${timestamp}.pdf`;

//       // Generate temporary PDF
//       const tempPdf = await RNHTMLtoPDF.convert({
//         html: generateHTML(slip, companyAddress),
//         fileName: finalFileName,
//         base64: false,
//       });

//       const preferredDir = `${RNFS.DownloadDirectoryPath}/SalarySlip`;
//       const fallbackDir = `${RNFS.DocumentDirectoryPath}/SalarySlip`;

//       let targetDir = preferredDir;
//       let finalPath = `${targetDir}/${finalFileName}`;

//       try {
//         const folderExists = await RNFS.exists(preferredDir);
//         if (!folderExists) {
//           await RNFS.mkdir(preferredDir);
//         }
//         await RNFS.copyFile(tempPdf.filePath, finalPath);
//       } catch (err) {
//         console.warn('❗ Falling back to internal storage:', err.message);
//         targetDir = fallbackDir;
//         finalPath = `${targetDir}/${finalFileName}`;
//         const fallbackExists = await RNFS.exists(fallbackDir);
//         if (!fallbackExists) {
//           await RNFS.mkdir(fallbackDir);
//         }
//         await RNFS.copyFile(tempPdf.filePath, finalPath);
//       }

//       Alert.alert(
//         'PDF Saved',
//         `PDF saved at:\n${finalPath}`,
//         [
//           {
//             text: 'Open',
//             onPress: () =>
//               FileViewer.open(finalPath).catch(() =>
//                 Alert.alert('Error', 'No app found to open PDF.')
//               ),
//           },
//           {
//             text: 'Share',
//             onPress: () =>
//               Share.open({
//                 title: 'Share Slip',
//                 url: `file://${finalPath}`,
//                 type: 'application/pdf',
//               }).catch(() => {}),
//           },
//           { text: 'OK' },
//         ]
//       );
//     } catch (err) {
//       console.error('PDF generation failed:', err);
//       Alert.alert('Error', 'PDF generation failed');
//     }
//   };

//   if (loading) return <ActivityIndicator style={{ marginTop: 100 }} size="large" />;
//   if (!slips.length) return <Text style={{ padding: 20, color: 'black' }}>No Salary Slips Found</Text>;

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>All Salary Slips</Text>
//       {slips.map((slip, index) => (
//         <TouchableOpacity
//           key={index}
//           style={styles.card}
//           onPress={() => generatePDF(slip.name)}
//         >
//           <Text style={styles.cardText}>
//             Month: {new Date(slip.start_date).toLocaleDateString()} to{' '}
//             {new Date(slip.end_date).toLocaleDateString()}
//           </Text>
//           <Text style={styles.downloadText}>Download PDF</Text>
//         </TouchableOpacity>
//       ))}
//     </ScrollView>
//   );
// };

// export default SalarySlipModernScreen;

// const styles = StyleSheet.create({
//   container: { padding: 16 },
//   title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
//   card: {
//     backgroundColor: '#f0f0f0',
//     padding: 14,
//     marginBottom: 10,
//     borderRadius: 6,
//   },
//   cardText: { fontSize: 16, color: '#333' },
//   downloadText: { fontSize: 14, color: '#007bff', marginTop: 6 },
// });





//updated code with add company and address

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
import { toWords } from 'number-to-words'; // ✅ Added for amount in words

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

  // ✅ Improved Amount in Words (Indian format)
  const amountInWords = (num) => {
    if (!num || isNaN(num)) return 'Zero Rupees Only';
    const n = Math.round(Number(num));
    const words = toWords(n);
    return `${words.charAt(0).toUpperCase() + words.slice(1)} Rupees Only`;
  };

  // ✅ Fetch company address directly from Company doctype
  const fetchCompanyAddress = async (companyNameFromSlip) => {
    try {
      console.log("🏢 Fetching salary_slip_address for company:", companyNameFromSlip);

      const listRes = await axios.get(
        `${BASE_URL}/api/resource/Company?fields=["name"]&limit_page_length=0`,
        { headers: { Cookie: `sid=${sid}` } }
      );

      const companies = listRes.data.data || [];
      const matchedCompany = companies.find(
        (c) =>
          c.name.toLowerCase().trim() === companyNameFromSlip.toLowerCase().trim()
      );

      if (!matchedCompany) {
        console.warn(`⚠️ No matching company found for "${companyNameFromSlip}"`);
        return { salary_slip_address: "Company not found" };
      }

      const companyRes = await axios.get(
        `${BASE_URL}/api/resource/Company/${encodeURIComponent(matchedCompany.name)}`,
        { headers: { Cookie: `sid=${sid}` } }
      );

      const company = companyRes.data.data;
      const salarySlipAddress = company.salary_slip_address;

      if (!salarySlipAddress) {
        console.warn(`⚠️ salary_slip_address not set for company: ${matchedCompany.name}`);
        return { salary_slip_address: "" };
      }

      console.log("✅ salary_slip_address fetched:", salarySlipAddress);
      return { salary_slip_address: salarySlipAddress };
    } catch (err) {
      console.error("❌ Error fetching salary_slip_address:", err.message);
      if (err.response && err.response.status === 404) {
        console.warn(`⚠️ Company not found in ERPNext: "${companyNameFromSlip}"`);
      }
      return { salary_slip_address: "" };
    }
  };

  // ✅ PDF HTML Template (added amount in words)
  const generateHTML = (slip, companyAddress) => `
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
        <h2>${slip.company || 'Company Name'}</h2>
        <p>${companyAddress.salary_slip_address || ''}</p>
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
        ${(slip.earnings || [])
          .map((e) => `<tr><td>${e.salary_component}</td><td>${e.amount}</td></tr>`)
          .join('')}
        <tr><th>Total Earnings</th><th>${slip.gross_pay}</th></tr>
      </table>

      <h3>Deductions</h3>
      <table>
        <tr><th>Component</th><th>Amount</th></tr>
        ${(slip.deductions || [])
          .map((d) => `<tr><td>${d.salary_component}</td><td>${d.amount}</td></tr>`)
          .join('')}
        <tr><th>Total Deductions</th><th>${slip.total_deduction}</th></tr>
      </table>

      <h3>Net Pay</h3>
      <table>
        <tr><td>Net Pay</td><td>${slip.net_pay}</td></tr>
        <tr><td colspan="2"><strong>Amount in Words:</strong> ${amountInWords(
          slip.net_pay
        )}</td></tr>
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

      const companyAddress = await fetchCompanyAddress(slip.company);

      const rawName = `SalSlip_${slip.employee}_${slip.name}`;
      const safeFileName = sanitizeFileName(rawName);
      const timestamp = Date.now();
      const finalFileName = `${safeFileName}_${timestamp}.pdf`;

      const tempPdf = await RNHTMLtoPDF.convert({
        html: generateHTML(slip, companyAddress),
        fileName: finalFileName,
        base64: false,
      });

      const preferredDir = `${RNFS.DownloadDirectoryPath}/SalarySlip`;
      const fallbackDir = `${RNFS.DocumentDirectoryPath}/SalarySlip`;

      let targetDir = preferredDir;
      let finalPath = `${targetDir}/${finalFileName}`;

      try {
        const folderExists = await RNFS.exists(preferredDir);
        if (!folderExists) {
          await RNFS.mkdir(preferredDir);
        }
        await RNFS.copyFile(tempPdf.filePath, finalPath);
      } catch (err) {
        console.warn('❗ Falling back to internal storage:', err.message);
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
  if (!slips.length) return <Text style={{ padding: 20, color: 'black' }}>No Salary Slips Found</Text>;

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
            Month: {new Date(slip.start_date).toLocaleDateString()} to{' '}
            {new Date(slip.end_date).toLocaleDateString()}
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



// import React, { useEffect, useState } from "react";
// import { View, ActivityIndicator, StyleSheet } from "react-native";
// import { WebView } from "react-native-webview";

// const SiteSurveyScreen = ({ route }) => {
//   const { sid, erpUrl } = route.params || {};
//   const [url, setUrl] = useState(null);

//   useEffect(() => {
//     // 👉 Load “Site Survey” doctype directly
//     const finalUrl = `${erpUrl}/app/salary-slip/`;
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

// export default SiteSurveyScreen;
