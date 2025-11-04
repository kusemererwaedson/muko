import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, TextField, Select, MenuItem,
  FormControl, InputLabel, Grid, Alert,
  Skeleton
} from '@mui/material';
import { Send as SendIcon, Clear as ClearIcon } from '@mui/icons-material';
import { communicationAPI, studentAPI } from '../../services/api';


const BulkReminders = () => {
  const [formData, setFormData] = useState({
    class: '',
    section: '',
    message_type: 'due_reminder',
    custom_message: ''
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    fetchStudentOptions();
  }, []);

  const fetchStudentOptions = async () => {
    try {
      const response = await studentAPI.getAll();
      const students = response.data;
      
      const uniqueClasses = [...new Set(students.map(s => s.class).filter(Boolean))];
      const uniqueSections = [...new Set(students.map(s => s.section).filter(Boolean))];
      
      setClasses(uniqueClasses.sort());
      setSections(uniqueSections.sort());
    } catch (error) {
      console.error('Error fetching student options:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Box p={3}>
        <Skeleton variant="text" width={200} height={30} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={400} />
      </Box>
    );
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await communicationAPI.sendBulkReminders(formData);
      setMessage(response.data.message || 'Bulk reminders sent successfully!');
      setFormData({
        class: '',
        section: '',
        message_type: 'due_reminder',
        custom_message: ''
      });
    } catch (error) {
      setMessage('Error sending bulk reminders: ' + (error.response?.data?.message || 'Please try again'));
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setFormData({
      class: '',
      section: '',
      message_type: 'due_reminder',
      custom_message: ''
    });
    setMessage('');
  };

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>Bulk Reminders</Typography>
        <Typography variant="body1" color="text.secondary">
          Send fee reminders to multiple students at once
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Send Bulk Fee Reminders</Typography>
              
              {message && (
                <Alert severity={message.includes('Error') ? 'error' : 'success'} sx={{ mb: 2 }}>
                  {message}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Class (Optional)</InputLabel>
                      <Select
                        name="class"
                        value={formData.class}
                        label="Class (Optional)"
                        onChange={handleInputChange}
                      >
                        <MenuItem value="">All Classes</MenuItem>
                        {classes.map(cls => (
                          <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Section (Optional)</InputLabel>
                      <Select
                        name="section"
                        value={formData.section}
                        label="Section (Optional)"
                        onChange={handleInputChange}
                      >
                        <MenuItem value="">All Sections</MenuItem>
                        {sections.map(sec => (
                          <MenuItem key={sec} value={sec}>{sec}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>Message Type</InputLabel>
                      <Select
                        name="message_type"
                        value={formData.message_type}
                        label="Message Type"
                        onChange={handleInputChange}
                      >
                        <MenuItem value="due_reminder">Due Reminder</MenuItem>
                        <MenuItem value="overdue_notice">Overdue Notice</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="custom_message"
                      label="Custom Message (Optional)"
                      multiline
                      rows={4}
                      value={formData.custom_message}
                      onChange={handleInputChange}
                      placeholder="Add any additional message..."
                    />
                  </Grid>
                </Grid>

                <Box mt={3}>
                  <Button 
                    type="submit" 
                    variant="contained"
                    startIcon={<SendIcon />}
                    disabled={loading}
                    sx={{ mr: 1 }}
                  >
                    {loading ? 'Sending...' : 'Send Bulk Reminders'}
                  </Button>
                  <Button 
                    variant="outlined"
                    startIcon={<ClearIcon />}
                    onClick={clearForm}
                  >
                    Clear
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Instructions</Typography>
              
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>How it works:</Typography>
                <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                  <li>Select class and section (optional)</li>
                  <li>Choose message type</li>
                  <li>Add custom message if needed</li>
                  <li>Click send to email all guardians</li>
                </Box>
              </Alert>
              
              <Alert severity="warning">
                <Typography variant="subtitle2" gutterBottom>Note:</Typography>
                <Typography variant="body2" sx={{ mb: 0 }}>
                  Only students with outstanding fees and valid guardian emails will receive reminders.
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BulkReminders;
