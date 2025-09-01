import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, ScrollView
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const TimesheetScreen = ({ route, navigation }) => {
  const { sid, employeeData, erpUrl } = route.params;
  const [projects, setProjects] = useState([]);
  const [activityTypes, setActivityTypes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [fromTime, setFromTime] = useState(new Date());
  const [toTime, setToTime] = useState(new Date());
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);
  const [minutes, setMinutes] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(null);
  const [taskError, setTaskError] = useState('');
  const [overlapError, setOverlapError] = useState('');

  const headers = {
    'Authorization': `token ${sid}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  useEffect(() => {
    fetchProjects();
    fetchActivityTypes();
    fetchTasks();
    const now = new Date();
    setFromTime(now);
    const oneHourLater = new Date(now);
    oneHourLater.setHours(oneHourLater.getHours() + 1);
    setToTime(oneHourLater);
  }, []);

  useEffect(() => {
    const calculatedMinutes = (toTime.getTime() - fromTime.getTime()) / (1000 * 60);
    setMinutes(calculatedMinutes > 0 ? calculatedMinutes : 0);
  }, [fromTime, toTime]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${erpUrl}/api/resource/Project?fields=["name","project_name"]`, { headers });
      setProjects(res.data.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivityTypes = async () => {
    try {
      const res = await axios.get(`${erpUrl}/api/resource/Activity Type?fields=["name"]`, { headers });
      setActivityTypes(res.data.data);
    } catch (err) {
      console.error('Error fetching activity types:', err);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${erpUrl}/api/resource/Task?fields=["name","subject"]`, { headers });
      setTasks(res.data.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatAPITime = (date) => {
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, -1);
  };

  const handleTimeChange = (event, selectedDate) => {
    setShowPicker(null);
    if (selectedDate) {
      if (showPicker === 'from') {
        setFromTime(selectedDate);
        if (selectedDate >= toTime) {
          const adjustedToTime = new Date(selectedDate);
          adjustedToTime.setHours(adjustedToTime.getHours() + 1);
          setToTime(adjustedToTime);
        }
      } else if (showPicker === 'to') {
        setToTime(selectedDate);
      }
    }
  };

  const validateTask = async (taskName) => {
    if (!taskName) return true;
    try {
      const res = await axios.get(
        `${erpUrl}/api/resource/Task?fields=["name"]&filters=[["name","=","${taskName}"]]`,
        { headers }
      );
      return res.data.data.length > 0;
    } catch (err) {
      console.error('Error validating task:', err);
      return false;
    }
  };

  const checkForOverlap = async (fromTime, toTime) => {
    try {
      const response = await axios.get(
        `${erpUrl}/api/method/erpnext.projects.doctype.timesheet.timesheet.get_overlap_for_employee`,
        {
          params: {
            employee: employeeData.name,
            start_time: formatAPITime(fromTime),
            end_time: formatAPITime(toTime),
            exclude_timesheet: null
          },
          headers
        }
      );
      return response.data.message;
    } catch (error) {
      console.error('Overlap check error:', error.response?.data || error.message);
      return { overlap: false, message: null };
    }
  };

  const submitTimesheet = async () => {
    if (minutes <= 0) {
      return Alert.alert("Error", "End time must be after start time");
    }

    if (selectedTask) {
      const isValidTask = await validateTask(selectedTask);
      if (!isValidTask) {
        setTaskError("Task does not exist in the system");
        return;
      }
      setTaskError('');
    }

    setLoading(true);
    setOverlapError('');

    try {
      const overlapResult = await checkForOverlap(fromTime, toTime);
      
      if (overlapResult && overlapResult.overlap) {
        setOverlapError(overlapResult.message || "This time period overlaps with existing entries");
        return;
      }

      const payload = {
        doctype: "Timesheet",
        employee: employeeData.name,
        employee_name: employeeData.employee_name,
        company: employeeData.company,
        time_logs: [{
          activity_type: selectedActivity || null,
          from_time: formatAPITime(fromTime),
          to_time: formatAPITime(toTime),
          hours: (minutes / 60).toFixed(2),
          project: selectedProject || null,
          task: selectedTask || null,
          description: description,
          is_billable: 1,
          completed: completed ? 1 : 0
        }]
      };

      await axios.post(`${erpUrl}/api/resource/Timesheet`, payload, { headers });
      Alert.alert("Success", "Timesheet submitted successfully!");
      
      // Reset form
      setSelectedProject('');
      setSelectedActivity('');
      setSelectedTask('');
      setDescription('');
      setCompleted(false);
      const now = new Date();
      setFromTime(now);
      const oneHourLater = new Date(now);
      oneHourLater.setHours(oneHourLater.getHours() + 1);
      setToTime(oneHourLater);

    } catch (error) {
      console.error('Submission error:', error.response?.data || error.message);
      let errorMessage = "Failed to submit timesheet";
      if (error.response?.data?.exc?.includes("OverlapError")) {
        errorMessage = "This time period overlaps with existing entries";
      } else if (error.response?.data?.exc?.includes("LinkValidationError")) {
        errorMessage = "One of the referenced records doesn't exist";
      }
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Add Timesheet Entry</Text>
      
      <Text style={styles.label}>Project (Optional)</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedProject}
          onValueChange={setSelectedProject}
          style={styles.picker}
          dropdownIconColor='gray'
        >
          <Picker.Item label="Select Project" value="" color='black'     />
          {projects.map((project) => (
            <Picker.Item 
              key={project.name} 
              label={`${project.project_name || project.name}`} 
              value={project.name} 
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Task (Optional)</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedTask}
          onValueChange={setSelectedTask}
          style={styles.picker}
          dropdownIconColor='gray'
        >
          <Picker.Item label="Select Task" value="" color='black'/>
          {tasks.map((task) => (
            <Picker.Item 
              key={task.name} 
              label={`${task.subject || task.name}`} 
              value={task.name} 
            />
          ))}
        </Picker>
      </View>
      {taskError ? <Text style={styles.errorText}>{taskError}</Text> : null}
      {overlapError ? <Text style={styles.errorText}>{overlapError}</Text> : null}

      <Text style={styles.label}>Activity Type (Optional)</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedActivity}
          onValueChange={setSelectedActivity}
          style={styles.picker}
          dropdownIconColor='gray'
        >
          <Picker.Item label="Select Activity Type" value="" color='black'/>
          {activityTypes.map((activity) => (
            <Picker.Item key={activity.name} label={activity.name} value={activity.name} />
          ))}
        </Picker>
      </View>

      <View style={styles.timeRow}>
        <View style={styles.timeContainer}>
          <Text style={styles.label}>Start Time*</Text>
          <TouchableOpacity 
            style={styles.dateButton} 
            onPress={() => setShowPicker('from')}
          >
            <Text style={[styles.dateButtonText, { color: 'black' }] }>
              {formatTime(fromTime)}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.timeContainer}>
          <Text style={styles.label}>End Time*</Text>
          <TouchableOpacity 
            style={styles.dateButton} 
            onPress={() => setShowPicker('to')}
            
          >
            <Text style={styles.dateButtonText}>
              {formatTime(toTime)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.hoursContainer}>
        <Text style={styles.hoursLabel}>Duration: {Math.round(minutes)} min ({hoursToHhMm(minutes)})</Text>
      </View>

      {showPicker && (
        <DateTimePicker
          value={showPicker === 'from' ? fromTime : toTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleTimeChange}
        />
      )}

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        multiline
        placeholder="Add work details..."
        value={description}
        onChangeText={setDescription}
        placeholderTextColor='gray'
      />

      <View style={styles.completedContainer}>
        <Text style={styles.label}>Completed:</Text>
        <TouchableOpacity
          style={[styles.completedButton, completed && styles.completedActive]}
          onPress={() => setCompleted(!completed)}
        >
          <Text style={completed ? styles.completedTextActive : styles.completedText}>
            {completed ? 'Yes' : 'No'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[styles.submitButton, loading && styles.disabledButton]} 
        onPress={submitTimesheet}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Submit Timesheet</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

// Helper function to convert minutes to hh:mm format
const hoursToHhMm = (minutes) => {
  const hh = Math.floor(minutes / 60);
  const mm = Math.round(minutes % 60);
  return `${hh}:${mm.toString().padStart(2, '0')}`;
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#f5f5f5'
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color:'gray'
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
    color:'black'
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginBottom: 10,
    backgroundColor: '#fff',
    height: 40,
    justifyContent: 'center',
    
  },
  picker: {
    height: 40,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    minHeight: 80,
    fontSize: 14,
    color:'black'
    

  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  timeContainer: {
    width: '48%'
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#fff',
    height: 40,
    justifyContent: 'center'
  },
  dateButtonText: {
    fontSize: 14,
    textAlign: 'center',
    color:'black'
  },
  hoursContainer: {
    padding: 10,
    backgroundColor: '#e3f2fd',
    borderRadius: 6,
    marginBottom: 10
  },
  hoursLabel: {
    fontWeight: 'bold',
    fontSize: 14,
    color:'black'
  },
  completedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  completedButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    borderRadius: 6,
    width: 70,
    alignItems: 'center'
  },
  completedActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50'
  },
  completedText: {
    color: '#333',
    fontSize: 14
  },
  completedTextActive: {
    color: '#fff',
    fontSize: 14
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center'
  },
  disabledButton: {
    backgroundColor: '#81C784'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 12
  }
});

export default TimesheetScreen;