import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, TextField, Select, MenuItem,
  FormControl, InputLabel, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Grid, Checkbox, Chip,
  Skeleton, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Payment as PaymentIcon, CheckCircle as SuccessIcon, Error as ErrorIcon } from '@mui/icons-material';
import { studentAPI, feeAPI } from '../services/api';


const BulkCollection = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [classFilter, setClassFilter] = useState('');
  const [dialog, setDialog] = useState({ open: false, type: '', message: '' });

  useEffect(() => {
    fetchStudents();
  }, [classFilter]);

  const fetchStudents = async () => {
    try {
      const response = await studentAPI.getAll();
      const studentsData = response.data.data || response.data || [];
      const validStudents = Array.isArray(studentsData) ? studentsData : [];
      
      let filteredStudents = validStudents;
      if (classFilter) {
        filteredStudents = validStudents.filter(s => 
          s.class_name?.toLowerCase().includes(classFilter.toLowerCase())
        );
      }
      setStudents(filteredStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box>
        {/* Header Skeleton */}
        <Box mb={4}>
          <Skeleton variant="text" width={200} height={32} sx={{ mb: 1 }} />
          <Skeleton variant="text" width={250} height={20} />
        </Box>
        
        {/* Controls Card Skeleton */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="end">
              <Grid item xs={12} md={3}>
                <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
              </Grid>
              <Grid item xs={12} md={3}>
                <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
              </Grid>
              <Grid item xs={12} md={3}>
                <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
              </Grid>
              <Grid item xs={12} md={3}>
                <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        
        {/* Students Table Skeleton */}
        <Card>
          <CardContent>
            <Skeleton variant="text" width={220} height={24} sx={{ mb: 2 }} />
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    {['Select', 'Student', 'Class', 'Fee Type', 'Amount Due', 'Due Date'].map((header, i) => (
                      <TableCell key={i}>
                        <Skeleton variant="text" width={80} height={16} />
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[...Array(6)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton variant="rectangular" width={18} height={18} /></TableCell>
                      <TableCell><Skeleton variant="text" width={120} height={16} /></TableCell>
                      <TableCell><Skeleton variant="rectangular" width={60} height={20} sx={{ borderRadius: 3 }} /></TableCell>
                      <TableCell><Skeleton variant="text" width={100} height={16} /></TableCell>
                      <TableCell><Skeleton variant="text" width={80} height={16} /></TableCell>
                      <TableCell><Skeleton variant="text" width={80} height={16} /></TableCell>
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

  const calculateDueAmount = (allocation) => {
    const totalPaid = allocation.fee_payments?.reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0) || 0;
    return parseFloat(allocation.amount || 0) - totalPaid;
  };

  const handlePaymentSelect = (studentId, allocationId, dueAmount) => {
    const paymentKey = `${studentId}-${allocationId}`;
    const existingIndex = selectedPayments.findIndex(p => `${p.student_id}-${p.allocation_id}` === paymentKey);
    
    if (existingIndex >= 0) {
      setSelectedPayments(selectedPayments.filter((_, index) => index !== existingIndex));
    } else {
      setSelectedPayments([...selectedPayments, {
        student_id: studentId,
        allocation_id: allocationId,
        amount: dueAmount
      }]);
    }
  };

  const processBulkPayment = async () => {
    if (selectedPayments.length === 0) {
      setDialog({ open: true, type: 'error', message: 'Please select at least one payment' });
      return;
    }

    try {
      for (const payment of selectedPayments) {
        await feeAPI.createPayment({
          student_id: payment.student_id,
          fee_allocation_id: payment.allocation_id,
          amount: payment.amount,
          payment_method: paymentMethod,
          payment_date: paymentDate,
          remarks: 'Bulk payment'
        });
      }
      
      setDialog({ open: true, type: 'success', message: `Successfully processed ${selectedPayments.length} payment(s)` });
      setSelectedPayments([]);
      fetchStudents();
    } catch (error) {
      console.error('Error processing bulk payment:', error);
      setDialog({ open: true, type: 'error', message: 'Error processing payments. Please try again.' });
    }
  };

  const getTotalAmount = () => {
    return selectedPayments.reduce((total, payment) => total + parseFloat(payment.amount), 0);
  };

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>Bulk Fee Collection</Typography>
        <Typography variant="body1" color="text.secondary">
          Collect fees from multiple students
        </Typography>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="end">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Filter by Class"
                placeholder="Enter class"
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={paymentMethod}
                  label="Payment Method"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                  <MenuItem value="cheque">Cheque</MenuItem>
                  <MenuItem value="online">Online</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Payment Date"
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<PaymentIcon />}
                onClick={processBulkPayment}
                disabled={selectedPayments.length === 0}
              >
                Process (UGX {getTotalAmount()?.toLocaleString()})
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Students with Pending Fees</Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Select</TableCell>
                  <TableCell>Student</TableCell>
                  <TableCell>Class</TableCell>
                  <TableCell>Fee Type</TableCell>
                  <TableCell>Amount Due</TableCell>
                  <TableCell>Due Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => 
                  student.fee_allocations?.filter(a => {
                    const dueAmount = calculateDueAmount(a);
                    return dueAmount > 0;
                  }).map((allocation) => {
                    const dueAmount = calculateDueAmount(allocation);
                    return (
                      <TableRow key={`${student.id}-${allocation.id}`} hover>
                        <TableCell>
                          <Checkbox
                            onChange={() => handlePaymentSelect(student.id, allocation.id, dueAmount)}
                            checked={selectedPayments.some(p => p.student_id === student.id && p.allocation_id === allocation.id)}
                          />
                        </TableCell>
                        <TableCell>{student.first_name} {student.last_name}</TableCell>
                        <TableCell>
                          <Chip label={student.class_name || 'N/A'} size="small" />
                        </TableCell>
                        <TableCell>{allocation.fee_group?.fee_type?.name}</TableCell>
                        <TableCell>UGX {dueAmount.toLocaleString()}</TableCell>
                        <TableCell>{new Date(allocation.due_date).toLocaleDateString()}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={dialog.open} onClose={() => setDialog({ ...dialog, open: false })}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {dialog.type === 'success' ? (
            <><SuccessIcon color="success" /> Success</>
          ) : (
            <><ErrorIcon color="error" /> Error</>
          )}
        </DialogTitle>
        <DialogContent>
          <Typography>{dialog.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog({ ...dialog, open: false })} variant="contained">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BulkCollection;