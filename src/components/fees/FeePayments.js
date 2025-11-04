import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, TextField, Select, MenuItem,
  FormControl, InputLabel, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Chip,
  Skeleton
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { feeAPI, studentAPI } from '../../services/api';

const FeePayments = () => {
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    student_id: '', fee_allocation_id: '', amount: '', payment_method: 'cash',
    payment_date: new Date().toISOString().split('T')[0], remarks: ''
  });

  useEffect(() => {
    fetchPayments();
    fetchStudents();
    fetchAllocations();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await feeAPI.getPayments();
      const paymentsData = response.data.data || response.data || [];
      console.log('Payments response:', response.data);
      console.log('Payments data:', paymentsData);
      setPayments(Array.isArray(paymentsData) ? paymentsData : []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

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

  const fetchAllocations = async () => {
    try {
      const response = await feeAPI.getAllocations();
      const allocationsData = response.data.data || response.data || [];
      const validAllocations = Array.isArray(allocationsData) ? allocationsData : [];
      const unpaidAllocations = validAllocations.filter(a => a.status !== 'paid');
      console.log('All allocations:', validAllocations);
      console.log('Unpaid allocations:', unpaidAllocations);
      setAllocations(unpaidAllocations);
    } catch (error) {
      console.error('Error fetching allocations:', error);
      setAllocations([]);
    }
  };

  if (loading) {
    return (
      <Box>
        {/* Header Skeleton */}
        <Box mb={4}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item xs={12} md={8}>
              <Skeleton variant="text" width={150} height={32} sx={{ mb: 1 }} />
              <Skeleton variant="text" width={180} height={20} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Box display="flex" justifyContent={{ xs: 'flex-start', md: 'flex-end' }} mt={{ xs: 2, md: 0 }}>
                <Skeleton variant="rectangular" width={150} height={36} sx={{ borderRadius: 1 }} />
              </Box>
            </Grid>
          </Grid>
        </Box>
        
        {/* Form Card Skeleton */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Skeleton variant="text" width={200} height={24} sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
              </Grid>
              <Grid item xs={12} md={4}>
                <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
              </Grid>
              <Grid item xs={12} md={4}>
                <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
              </Grid>
              <Grid item xs={12} md={4}>
                <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
              </Grid>
              <Grid item xs={12}>
                <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 1 }} />
              </Grid>
            </Grid>
            <Box mt={2} display="flex" gap={1}>
              <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 1 }} />
              <Skeleton variant="rectangular" width={70} height={36} sx={{ borderRadius: 1 }} />
            </Box>
          </CardContent>
        </Card>
        
        {/* Payment History Table Skeleton */}
        <Card>
          <CardContent>
            <Skeleton variant="text" width={140} height={24} sx={{ mb: 2 }} />
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    {['Student', 'Fee Type', 'Amount', 'Method', 'Date', 'Remarks'].map((header, i) => (
                      <TableCell key={i}>
                        <Skeleton variant="text" width={80} height={16} />
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[...Array(6)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton variant="text" width={120} height={16} /></TableCell>
                      <TableCell><Skeleton variant="text" width={100} height={16} /></TableCell>
                      <TableCell><Skeleton variant="text" width={80} height={16} /></TableCell>
                      <TableCell><Skeleton variant="rectangular" width={60} height={20} sx={{ borderRadius: 3 }} /></TableCell>
                      <TableCell><Skeleton variant="text" width={80} height={16} /></TableCell>
                      <TableCell><Skeleton variant="text" width={100} height={16} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await feeAPI.createPayment(formData);
      fetchPayments();
      fetchAllocations();
      setFormData({
        student_id: '', fee_allocation_id: '', amount: '', payment_method: 'cash',
        payment_date: new Date().toISOString().split('T')[0], remarks: ''
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating payment:', error);
    }
  };

  const getStudentAllocations = () => {
    if (!formData.student_id) return [];
    return allocations.filter(a => Number(a.student_id) === Number(formData.student_id));
  };

  const handleClearForm = () => {
    setFormData({
      student_id: '', fee_allocation_id: '', amount: '', payment_method: 'cash',
      payment_date: new Date().toISOString().split('T')[0], remarks: ''
    });
  };

  return (
    <Box>
      <Box mb={4}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>Fee Payments</Typography>
            <Typography variant="body1" color="text.secondary">
              Record fee payments
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box display="flex" justifyContent={{ xs: 'flex-start', md: 'flex-end' }} mt={{ xs: 2, md: 0 }}>
              <Button
                variant={showForm ? "outlined" : "contained"}
                startIcon={<AddIcon />}
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? 'Cancel' : 'Record Payment'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Dialog 
        open={showForm} 
        onClose={() => setShowForm(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { minHeight: '400px' }
        }}
      >
        <DialogTitle>Record Fee Payment</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel shrink>Student</InputLabel>
                  <Select
                    value={formData.student_id}
                    label="Student"
                    displayEmpty
                    onChange={(e) => setFormData({...formData, student_id: e.target.value, fee_allocation_id: ''})}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 300,
                        },
                      },
                    }}
                  >
                    {students.map((student) => (
                      <MenuItem 
                        key={student.id} 
                        value={student.id}
                        sx={{ py: 1.5 }}
                      >
                        <Box>
                          <Typography variant="body1" fontWeight={500}>
                            {student.register_no}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {student.first_name} {student.last_name}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required disabled={!formData.student_id}>
                  <InputLabel shrink>Fee Type</InputLabel>
                  <Select
                    value={formData.fee_allocation_id}
                    label="Fee Type"
                    displayEmpty
                    onChange={(e) => setFormData({...formData, fee_allocation_id: e.target.value})}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 300,
                        },
                      },
                    }}
                  >
                    {getStudentAllocations().length === 0 ? (
                      <MenuItem disabled>
                        <Typography variant="body2" color="text.secondary">
                          No unpaid allocations for this student
                        </Typography>
                      </MenuItem>
                    ) : (
                      getStudentAllocations().map((allocation) => (
                        <MenuItem 
                          key={allocation.id} 
                          value={allocation.id}
                          sx={{ py: 1.5 }}
                        >
                          <Box>
                            <Typography variant="body1" fontWeight={500}>
                              {allocation.fee_group?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              UGX {allocation.amount?.toLocaleString()}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Amount (UGX)"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Payment Method</InputLabel>
                  <Select
                    value={formData.payment_method}
                    label="Payment Method"
                    onChange={(e) => setFormData({...formData, payment_method: e.target.value})}
                  >
                    <MenuItem value="cash">Cash</MenuItem>
                    <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                    <MenuItem value="cheque">Cheque</MenuItem>
                    <MenuItem value="online">Online</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Payment Date"
                  type="date"
                  value={formData.payment_date}
                  onChange={(e) => setFormData({...formData, payment_date: e.target.value})}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Remarks"
                  multiline
                  rows={3}
                  value={formData.remarks}
                  onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                  placeholder="Optional payment notes..."
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClearForm} color="inherit">
            Clear
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button onClick={() => setShowForm(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!formData.fee_allocation_id}>
            Record Payment
          </Button>
        </DialogActions>
      </Dialog>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Payment History</Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell>Fee Type</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Remarks</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id} hover>
                    <TableCell>{payment.student?.first_name} {payment.student?.last_name}</TableCell>
                    <TableCell>{payment.fee_allocation?.fee_group?.fee_type?.name}</TableCell>
                    <TableCell>UGX {payment.amount?.toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip label={payment.payment_method} size="small" color="success" />
                    </TableCell>
                    <TableCell>{new Date(payment.payment_date).toLocaleDateString()}</TableCell>
                    <TableCell>{payment.remarks}</TableCell>
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

export default FeePayments;