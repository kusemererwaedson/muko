import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Select, MenuItem,
  FormControl, InputLabel, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Grid, Collapse, Chip,
  Skeleton, TextField, List, ListItem, ListItemButton, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, Stack
} from '@mui/material';
import {
  Add as AddIcon, Clear as ClearIcon, Search as SearchIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { feeAPI, studentAPI } from '../services/api';

const FeeAllocate = () => {
  const [students, setStudents] = useState([]);
  const [feeGroups, setFeeGroups] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ student_id: '', fee_group_id: '', class: '', stream: '' });
  const [filters, setFilters] = useState({ name: '' });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [errorDialog, setErrorDialog] = useState({ open: false, message: '' });

  useEffect(() => {
    fetchStudents();
    fetchFeeGroups();
    fetchAllocations();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await studentAPI.getAll();
      const studentsData = response.data.data || response.data || [];
      setStudents(Array.isArray(studentsData) ? studentsData : []);
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
    }
  };

  const fetchFeeGroups = async () => {
    try {
      const response = await feeAPI.getGroups();
      const groupsData = response.data.data || response.data || [];
      setFeeGroups(Array.isArray(groupsData) ? groupsData : []);
    } catch (error) {
      console.error('Error fetching fee groups:', error);
      setFeeGroups([]);
    }
  };

  const fetchAllocations = async () => {
    try {
      const response = await feeAPI.getAllocations();
      const allocationsData = response.data.data || response.data || [];
      setAllocations(Array.isArray(allocationsData) ? allocationsData : []);
    } catch (error) {
      console.error('Error fetching allocations:', error);
      setAllocations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedGroup = feeGroups.find(g => g.id === formData.fee_group_id);
    const existingAllocation = allocations.find(a =>
      a.student_id === formData.student_id &&
      a.fee_group?.fee_type_id === selectedGroup?.fee_type_id
    );
    if (existingAllocation) {
      setErrorDialog({ open: true, message: 'This student is already allocated to this fee type.' });
      return;
    }
    try {
      await feeAPI.createAllocation(formData);
      fetchAllocations();
      setFormData({ student_id: '', fee_group_id: '', class: '', stream: '' });
      setSelectedStudent(null);
      setFilters({ name: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating allocation:', error);
    }
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setFormData({
      ...formData,
      student_id: student.id,
      class: student.class_name || '',
      stream: student.stream_name || ''
    });
    setFilters({ name: '' });
  };

  const clearFilters = () => {
    setFilters({ name: '' });
    setSelectedStudent(null);
    setFormData({ student_id: '', fee_group_id: '', class: '', stream: '' });
  };

  const filteredStudents = students.filter((student) => {
    return !filters.name ||
      `${student.first_name} ${student.last_name}`.toLowerCase().includes(filters.name.toLowerCase()) ||
      student.registration_no?.toString().toLowerCase().includes(filters.name.toLowerCase());
  });

  if (loading) {
    return (
      <Box p={4}>
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        background: 'linear-gradient(135deg, #f9fafb, #eef1f8)',
        minHeight: '100vh'
      }}
    >
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Box mb={4} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ color: '#1e293b' }}>
              Fee Allocation
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b' }}>
              Manage and assign fees to students easily.
            </Typography>
          </Box>
          <Button
            variant={showForm ? "outlined" : "contained"}
            startIcon={showForm ? <ClearIcon /> : <AddIcon />}
            onClick={() => setShowForm(!showForm)}
            sx={{
              borderRadius: 3,
              fontWeight: 600,
              textTransform: 'none',
              px: 3,
              py: 1.2,
              boxShadow: showForm ? 0 : '0 4px 14px rgba(59,130,246,0.3)',
            }}
          >
            {showForm ? 'Cancel' : 'New Allocation'}
          </Button>
        </Box>
      </motion.div>

      {/* Form Section */}
      <Collapse in={showForm}>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card
            sx={{
              mb: 4,
              borderRadius: 3,
              boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Create Fee Allocation
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Box component="form" onSubmit={handleSubmit}>
                {/* Student Selection */}
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box display="flex" gap={1}>
                      <TextField
                        label="Search Student"
                        placeholder="Type student name or reg no"
                        value={filters.name}
                        onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                        fullWidth
                        InputProps={{
                          startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                        }}
                      />
                      {selectedStudent && (
                        <Button variant="outlined" size="small" onClick={clearFilters}>
                          Clear
                        </Button>
                      )}
                    </Box>
                    {filters.name && (
                      <Paper
                        sx={{
                          mt: 1,
                          borderRadius: 2,
                          border: '1px solid #e2e8f0',
                          maxHeight: 200,
                          overflow: 'auto',
                        }}
                      >
                        {filteredStudents.slice(0, 10).map((s) => (
                          <ListItemButton key={s.id} onClick={() => handleStudentSelect(s)}>
                            <Box>
                              <Typography fontWeight={600}>
                                {s.first_name} {s.last_name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Reg: {s.registration_no || 'N/A'} — Class: {s.class_name || 'N/A'}
                              </Typography>
                            </Box>
                          </ListItemButton>
                        ))}
                      </Paper>
                    )}
                    {selectedStudent && (
                      <Paper sx={{ mt: 1, p: 2, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
                        <Typography variant="body2" color="primary.main" fontWeight={600} gutterBottom>
                          Selected Student
                        </Typography>
                        <Typography variant="body2">
                          <strong>Name:</strong> {selectedStudent.first_name} {selectedStudent.last_name}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Reg No:</strong> {selectedStudent.registration_no || 'N/A'} | 
                          <strong> Class:</strong> {selectedStudent.class_name || 'N/A'} | 
                          <strong> Stream:</strong> {selectedStudent.stream_name || 'N/A'}
                        </Typography>
                      </Paper>
                    )}
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl sx={{ width: 200 }}>
                      <InputLabel>Select Fee Group</InputLabel>
                      <Select
                        value={formData.fee_group_id}
                        label="Select Fee Group"
                        onChange={(e) => setFormData({ ...formData, fee_group_id: e.target.value })}
                      >
                        {feeGroups.map((group) => (
                          <MenuItem key={group.id} value={group.id}>
                            <Box>
                              <Typography fontWeight={500}>{group.name}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                UGX {group.amount?.toLocaleString()}
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                {/* Action Buttons */}
                <Stack direction="row" spacing={2} mt={4}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={!formData.student_id || !formData.fee_group_id}
                    sx={{
                      borderRadius: 3,
                      px: 4,
                      py: 1.2,
                      fontWeight: 600,
                    }}
                  >
                    Allocate Fee
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => setShowForm(false)}
                    sx={{
                      borderRadius: 3,
                      px: 4,
                      py: 1.2,
                      fontWeight: 600,
                    }}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Collapse>

      {/* Allocations Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Fee Allocations
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
              <Table>
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Student</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Fee Group</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Due Date</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allocations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">No allocations yet.</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    allocations.map((a) => (
                      <TableRow key={a.id} hover>
                        <TableCell>{a.student?.first_name} {a.student?.last_name}</TableCell>
                        <TableCell>{a.fee_group?.name}</TableCell>
                        <TableCell>UGX {a.amount?.toLocaleString()}</TableCell>
                        <TableCell>{new Date(a.due_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Chip
                            label={a.status}
                            size="small"
                            color={
                              a.status === 'paid' ? 'success' :
                                a.status === 'partial' ? 'warning' : 'error'
                            }
                            sx={{ textTransform: 'capitalize', fontWeight: 600 }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Error Dialog */}
      <Dialog open={errorDialog.open} onClose={() => setErrorDialog({ open: false, message: '' })}>
        <DialogTitle sx={{ color: 'error.main', display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon /> Duplicate Allocation
        </DialogTitle>
        <DialogContent>
          <Typography>{errorDialog.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorDialog({ open: false, message: '' })}>OK</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FeeAllocate;
