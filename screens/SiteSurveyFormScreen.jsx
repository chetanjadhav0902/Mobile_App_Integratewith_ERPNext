
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "react-native-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";

const { width } = Dimensions.get("window");

const SiteSurveyFormScreen = ({ route, navigation }) => {
  const { survey, sid, erpUrl } = route.params || {};
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    capacity: "",
    upload_image: null,
    upload_electric_bill: null,
    location_details: "",
    status: "",
    site_type: "",
    completed_date: "",
    type_of_mounting: "",
    connected_load:"",
    remarks:"",
  });
  const [imageUri, setImageUri] = useState(null);
  const [electricBillUri, setElectricBillUri] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const statusOptions = ["Open", "Pending", "Completed"];
  const siteTypeOptions = ["RCC", "Ground Mount", "Shed (Profile Sheet)", "Car Port (Parking)", "RCC & Shed", "RCC & Ground Mount", "Shed & Parking", "Ground Mount & Parking", "RCC, Shed, Ground Mount, Parking"];
  const structureOptions = ["Normal", "Elevated"];
  
  const storagespaceOptions= ["Yes", "No"];

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const res = await fetch(`${erpUrl}/api/resource/Site Survey/${survey.name}`, {
          headers: { Cookie: `sid=${sid}` },
        });
        const data = await res.json();
        const s = data.data;
        setFormData({
          capacity: s.capacity || "",
          location_details: s.location_details || "",
          upload_image: s.upload_image || null,
          upload_electric_bill: s.upload_electric_bill || null,
          status: s.status || "",
          site_type: s.site_type || "",
          completed_date: s.completed_date || "",
          structure: s.structure || "",
          type_of_mounting:s.type_of_mounting || "",
          connected_load:s.connected_load || "",
          storage_space:s.storage_space || "",
          remarks:s.remarks || "",
        });
        setImageUri(s.upload_image || null);
        setElectricBillUri(s.upload_electric_bill || null);
      } catch (err) {
        console.log("Fetch survey failed:", err);
      }
    };

    if (survey?.name) fetchSurvey();
  }, [survey]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const pickImage = async (type) => {
    const options = {
      mediaType: "photo",
      quality: 0.8,
      maxWidth: 1024,
      maxHeight: 1024,
    };
    Alert.alert("Select Option", "Choose image source", [
      {
        text: "Camera",
        onPress: () =>
          ImagePicker.launchCamera(options, (res) => {
            if (res.assets && res.assets[0]) {
              const asset = res.assets[0];
              if (type === "image") {
                setImageUri(asset.uri);
                setFormData((prev) => ({ ...prev, upload_image: asset }));
              } else {
                setElectricBillUri(asset.uri);
                setFormData((prev) => ({ ...prev, upload_electric_bill: asset }));
              }
            }
          }),
      },
      {
        text: "Gallery",
        onPress: () =>
          ImagePicker.launchImageLibrary(options, (res) => {
            if (res.assets && res.assets[0]) {
              const asset = res.assets[0];
              if (type === "image") {
                setImageUri(asset.uri);
                setFormData((prev) => ({ ...prev, upload_image: asset }));
              } else {
                setElectricBillUri(asset.uri);
                setFormData((prev) => ({ ...prev, upload_electric_bill: asset }));
              }
            }
          }),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const validateForm = () => {
    if (!formData.capacity.trim()) {
      Alert.alert("Validation Error", "Please enter capacity");
      return false;
    }
    if (!formData.location_details.trim()) {
      Alert.alert("Validation Error", "Please enter location details");
      return false;
    }
    return true;
  };

  const uploadFile = async (fileAsset, fieldname) => {
    if (!fileAsset || (typeof fileAsset === "string" && fileAsset.startsWith("/files/"))) {
      return fileAsset;
    }

    if (!fileAsset.uri) return null;

    const data = new FormData();
    data.append("file", {
      uri: fileAsset.uri,
      type: fileAsset.type || "image/jpeg",
      name: fileAsset.fileName || `upload_${Date.now()}.jpg`,
    });
    data.append("doctype", "Site Survey");
    data.append("docname", survey.name);
    data.append("fieldname", fieldname);

    const response = await fetch(`${erpUrl}/api/method/upload_file`, {
      method: "POST",
      headers: { Cookie: `sid=${sid}` },
      body: data,
    });

    if (!response.ok) throw new Error(`Upload failed: ${response.status}`);
    const result = await response.json();
    return result?.message?.file_url || null;
  };

  const submitForm = async () => {
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      let uploadedImageUrl = formData.upload_image;
      let uploadedBillUrl = formData.upload_electric_bill;

      if (formData.upload_image && formData.upload_image.uri)
        uploadedImageUrl = await uploadFile(formData.upload_image, "upload_image");
      if (formData.upload_electric_bill && formData.upload_electric_bill.uri)
        uploadedBillUrl = await uploadFile(formData.upload_electric_bill, "upload_electric_bill");

      const updateData = {
        capacity: formData.capacity,
        location_details: formData.location_details,
        status: formData.status,
        site_type: formData.site_type,
        completed_date: formData.completed_date,
        structure: formData.structure,
        type_of_mounting:formData.type_of_mounting,
        connected_load:formData.connected_load,
        upload_image: uploadedImageUrl,
        upload_electric_bill: uploadedBillUrl,
        storage_space:formData.storage_space,
        remarks:formData.remarks,
      };

      const response = await fetch(`${erpUrl}/api/resource/Site Survey/${survey.name}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: `sid=${sid}`,
        },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      await response.json();

      Alert.alert("Success", "Site survey updated successfully!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to update site survey: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (label, value, editable = false, fieldName = null) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {editable && fieldName ? (
        <TextInput
          style={styles.input}
          value={formData[fieldName]}
          onChangeText={(text) => handleInputChange(fieldName, text)}
          placeholder={`Enter ${label.toLowerCase()}`}
          placeholderTextColor="#999"
          editable={!submitting}
        />
      ) : (
        <Text style={styles.fieldValue}>{value || "Not specified"}</Text>
      )}
    </View>
  );

  const renderImageField = (label, currentUri, type) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TouchableOpacity
        style={styles.imagePicker}
        onPress={() => pickImage(type)}
        disabled={submitting}
        activeOpacity={0.7}
      >
        <Ionicons name="camera-outline" size={22} color="#3F51B5" />
        <Text style={styles.imagePickerText}>
          {currentUri ? "Change Image" : "Pick Image"}
        </Text>
      </TouchableOpacity>
      {currentUri && (
        <Image
          source={{
            uri: currentUri.startsWith("/files/")
              ? `${erpUrl}${currentUri}`
              : currentUri,
          }}
          style={styles.previewImage}
          resizeMode="cover"
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.surveyIdContainer}>
          <Text style={styles.surveyId}>Survey ID: {survey?.name}</Text>
        </View>

        {/* Lead Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lead Information</Text>
          <View style={styles.row}>{renderField("Lead", survey?.lead)}{renderField("Lead Name", survey?.lead_name)}</View>
          <View style={styles.row}>{renderField("Contact Email", survey?.contact_mail)}{renderField("Surveyed By", survey?.surveyed_by)}</View>
        </View>

        {/* Status Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status Information</Text>
          <View style={styles.row}>
            <View style={[styles.fieldContainer, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.fieldLabel}>Status</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={formData.status}
                  onValueChange={(val) => handleInputChange("status", val)}
                  enabled={!submitting}
                >
                  <Picker.Item label="Select Status" value="" />
                  {statusOptions.map((opt, idx) => (
                    <Picker.Item key={idx} label={opt} value={opt} />
                  ))}
                </Picker>
              </View>
            </View>

            {formData.status === "Completed" && (
              <View style={[styles.fieldContainer, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.fieldLabel}>Completed Date</Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setShowDatePicker(true)}
                  disabled={submitting}
                >
                  <Text>
                    {formData.completed_date ? formData.completed_date : "Select Date"}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={
                      formData.completed_date
                        ? new Date(formData.completed_date)
                        : new Date()
                    }
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        handleInputChange(
                          "completed_date",
                          selectedDate.toISOString().split("T")[0]
                        );
                      }
                    }}
                  />
                )}
              </View>
            )}
          </View>
        </View>

        {/* Site Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Site Details</Text>
          <View style={styles.row}>
            <View style={[styles.fieldContainer, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.fieldLabel}>Site Type</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={formData.site_type}
                  onValueChange={(val) => handleInputChange("site_type", val)}
                  enabled={!submitting}
                >
                  <Picker.Item label="Select Site Type" value="" />
                  {siteTypeOptions.map((opt, idx) => (
                    <Picker.Item key={idx} label={opt} value={opt} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={[styles.fieldContainer, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>Type of Mounting Required</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={formData.type_of_mounting}
                  onValueChange={(val) => handleInputChange("type_of_mounting", val)}
                  enabled={!submitting}
                >
                  <Picker.Item label="Select Structure" value="" />
                  {structureOptions.map((opt, idx) => (
                    <Picker.Item key={idx} label={opt} value={opt} />
                  ))}
                </Picker>
              </View>
            </View>


            <View style={[styles.fieldContainer, { flex: 1}]}>
              <Text style={styles.fieldLabel}>Storage Space</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={formData.storage_space}
                  onValueChange={(val) => handleInputChange("storage_space", val)}
                  enabled={!submitting}
                >
                  <Picker.Item label="Select Storage Space" value="" />
                  {storagespaceOptions.map((opt, idx) => (
                    <Picker.Item key={idx} label={opt} value={opt} />
                  ))}
                </Picker>
              </View>
            </View>

          </View>
          {renderField("Capacity", formData.capacity, true, "capacity")}
          
          {renderField("Connected_load", formData.connected_load, true, "connected_load")}
        </View>

        {/* Location Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location Details</Text>
          {renderField("Location Details", formData.location_details, true, "location_details")}
        </View>


        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Remarks</Text>
          {renderField("Remarks", formData.remarks, true, "remarks")}
        </View>


        {/* Uploads */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upload Documents</Text>
          {renderImageField("Upload Site Image", imageUri, "image")}
          {renderImageField("Upload Electric Bill", electricBillUri, "electric_bill")}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={submitForm}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
             
              <Text style={styles.submitButtonText}>Submit Site Survey</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F9" },
  scrollContainer: { paddingBottom: 40, paddingHorizontal: 10 },
  surveyIdContainer: {
    backgroundColor: "#E3F2FD",
    paddingVertical: 10,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  surveyId: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: "#1976D2",
    textAlign: "center",
  },
  section: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: width * 0.045,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingBottom: 6,
  },
  fieldContainer: { flex: 1, marginBottom: 14 },
  fieldLabel: { fontSize: 13, fontWeight: "600", color: "#555", marginBottom: 6 },
  fieldValue: {
    fontSize: 14,
    color: "#333",
    padding: 10,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  input: {
    fontSize: 14,
    color: "#333",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#3F51B5",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#3F51B5",
    borderRadius: 8,
    overflow: "hidden",
  },
  imagePicker: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderStyle: "dashed",
  },
  imagePickerText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#3F51B5",
    fontWeight: "500",
  },
  previewImage: {
    width: "100%",
    height: width * 0.55,
    borderRadius: 10,
    marginTop: 10,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3F51B5",
    marginHorizontal: 16,
    marginVertical: 20,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#3F51B5",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  submitButtonDisabled: { backgroundColor: "#9FA8DA" },
  submitButtonText: { color: "#fff", fontSize: 14, fontWeight: "bold", marginLeft: 8 },
  row: {
    flexDirection: width < 600 ? "column" : "row",
    justifyContent: "space-between",
  },
});

export default SiteSurveyFormScreen;


