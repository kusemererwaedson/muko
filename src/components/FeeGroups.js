import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, TextField, Select, MenuItem,
  FormControl, InputLabel, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Grid, Collapse,
  Skeleton
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { feeAPI } from '../services/api';


const FeeGroups = () => {
  const [feeGroups, setFeeGroups] = useState([]);
  const [feeTypes, setFeeTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', class: '', fee_type_id: '', amount: '', due_date: ''
  });

  useEffect(() => {
    fetchFeeGroups();
    fetchFeeTypes();
  }, []);

  const fetchFeeGroups = async () => {
    try {
      const response = await feeAPI.getGroups();
      setFeeGroups(Array.isArray(response.data) ? response.data : response.data.data || []);
    } catch (error) {
      console.error('Error fetching fee groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeeTypes = async () => {
    try {
      const response = await feeAPI.getTypes();
      setFeeTypes(Array.isArray(response.data) ? response.data : response.data.data || []);
    } catch (error) {
      console.error('Error fetching fee types:', error);
    }
  };

  if (loading) {
    return (
      <Box p={3}>
        <Skeleton variant="text" width={200} height={30} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={400} />
      </Box>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await feeAPI.createGroup(formData);
      fetchFeeGroups();
      setFormData({ name: '', class: '', fee_type_id: '', amount: '', due_date: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating fee group:', error);
    }
  };

  return (
    <Box>
      <Box mb={4}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>Fee Groups</Typography>
            <Typography variant="body1" color="text.secondary">
              Manage fee groups by class and type
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box display="flex" justifyContent={{ xs: 'flex-start', md: 'flex-end' }} mt={{ xs: 2, md: 0 }}>
              <Button
                variant={showForm ? "outlined" : "contained"}
                startIcon={<AddIcon />}
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? 'Cancel' : 'Add Fee Group'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Collapse in={showForm}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Add New Fee Group</Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., S1 Tuition Fee"
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Class</InputLabel>
                    <Select
                      value={formData.class}
                      label="Class"
                      onChange={(e) => setFormData({...formData, class: e.target.value})}
                    >
                      {['S1', 'S2', 'S3', 'S4', 'S5', 'S6'].map(cls => (
                        <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Fee Type</InputLabel>
                    <Select
                      value={formData.fee_type_id}
                      label="Fee Type"
                      onChange={(e) => setFormData({...formData, fee_type_id: e.target.value})}
                    >
                      {feeTypes.map((type) => (
                        <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Amount (UGX)"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="e.g., 500000"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Due Date"
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
              <Box mt={2}>
                <Button type="submit" variant="contained" sx={{ mr: 1 }}>Save</Button>
                <Button variant="outlined" onClick={() => setShowForm(false)}>Cancel</Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Collapse>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Fee Groups List</Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Class</TableCell>
                  <TableCell>Fee Type</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Due Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {feeGroups.map((group) => (
                  <TableRow key={group.id} hover>
                    <TableCell>{group.name}</TableCell>
                    <TableCell>{group.class}</TableCell>
                    <TableCell>{group.fee_type?.name}</TableCell>
                    <TableCell>UGX {group.amount?.toLocaleString()}</TableCell>
                    <TableCell>{new Date(group.due_date).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FeeGroups;
