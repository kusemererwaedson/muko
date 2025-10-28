import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, TextField, Select, MenuItem,
  FormControl, InputLabel, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Grid, Dialog, DialogTitle, DialogContent,
  DialogActions, Chip
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { communicationAPI } from '../services/api';

const SMSManagement = () => {
  const [smsLogs, setSmsLogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    recipients: 'all',
    message: '',
    schedule_date: '',
    class_id: '',
    level_id: ''
  });

  useEffect(() => {
    fetchSmsLogs();
  }, []);

  const fetchSmsLogs = async () => {
    try {
      const response = await communicationAPI.getSmsLogs();
      setSmsLogs(response.data);
    } catch (error) {
      console.error('Error fetching SMS logs:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await communicationAPI.sendSms(formData);
      setShowModal(false);
      setFormData({
        recipients: 'all',
        message: '',
        schedule_date: '',
        class_id: '',
        level_id: ''
      });
      fetchSmsLogs();
    } catch (error) {
      console.error('Error sending SMS:', error);
    }
  };

  return (
    <Box>
      <Box mb={4}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h4">SMS Management</Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<SendIcon />}
              onClick={() => setShowModal(true)}
            >
              Send SMS
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>SMS History</Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Recipients</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Delivered</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {smsLogs.map(sms => (
                  <TableRow key={sms.id} hover>
                    <TableCell>{new Date(sms.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{sms.recipient_count} recipients</TableCell>
                    <TableCell>{sms.message.substring(0, 50)}...</TableCell>
                    <TableCell>
                      <Chip 
                        label={sms.status}
                        color={
                          sms.status === 'sent' ? 'success' : 
                          sms.status === 'pending' ? 'warning' : 'error'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{sms.delivered_count}/{sms.recipient_count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Send SMS</DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Recipients</InputLabel>
                  <Select
                    value={formData.recipients}
                    label="Recipients"
                    onChange={(e) => setFormData({...formData, recipients: e.target.value})}
                  >
                    <MenuItem value="all">All Parents</MenuItem>
                    <MenuItem value="class">Specific Class</MenuItem>
                    <MenuItem value="level">Specific Level</MenuItem>
                    <MenuItem value="defaulters">Fee Defaulters</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              {formData.recipients === 'class' && (
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Select Class</InputLabel>
                    <Select
                      value={formData.class_id}
                      label="Select Class"
                      onChange={(e) => setFormData({...formData, class_id: e.target.value})}
                    >
                      <MenuItem value="">Select Class</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}

              {formData.recipients === 'level' && (
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Select Level</InputLabel>
                    <Select
                      value={formData.level_id}
                      label="Select Level"
                      onChange={(e) => setFormData({...formData, level_id: e.target.value})}
                    >
                      <MenuItem value="">Select Level</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Message"
                  multiline
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Type your message here..."
                  inputProps={{ maxLength: 160 }}
                  required
                  helperText={`${formData.message.length}/160 characters`}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Schedule Date (Optional)"
                  type="datetime-local"
                  value={formData.schedule_date}
                  onChange={(e) => setFormData({...formData, schedule_date: e.target.value})}
                  InputLabelProps={{ shrink: true }}
                  helperText="Leave empty to send immediately"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {formData.schedule_date ? 'Schedule SMS' : 'Send Now'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default SMSManagement;