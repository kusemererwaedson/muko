import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Select, MenuItem,
  FormControl, InputLabel, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Grid, Chip, CircularProgress
} from '@mui/material';
import { Assessment as AssessmentIcon, FilterList } from '@mui/icons-material';
import { feeAPI, academicAPI } from '../../services/api';

const Reports = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [feeTypes, setFeeTypes] = useState([]);
  const [filters, setFilters] = useState({
    class: '',
    fee_type_id: '',
    status: ''
  });

  useEffect(() => {
    fetchFilters();
  }, []);

  const fetchFilters = async () => {
    try {
      const [classesRes, feeTypesRes] = await Promise.all([
        academicAPI.getClasses(),
        feeAPI.getTypes()
      ]);
      setClasses(Array.isArray(classesRes.data) ? classesRes.data : classesRes.data.data || []);
      setFeeTypes(Array.isArray(feeTypesRes.data) ? feeTypesRes.data : feeTypesRes.data.data || []);
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.class) params.class = filters.class;
      if (filters.fee_type_id) params.fee_type_id = filters.fee_type_id;
      if (filters.status) params.status = filters.status;

      const response = await feeAPI.getReports(params);
      const data = Array.isArray(response.data) ? response.data : response.data.data || [];
      setReportData(data);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderBalanceReport = () => {
    const totals = reportData.reduce((acc, row) => ({
      amount: acc.amount + parseFloat(row.amount || 0),
      paid: acc.paid + parseFloat(row.paid || 0),
      balance: acc.balance + parseFloat(row.balance || 0)
    }), { amount: 0, paid: 0, balance: 0 });

    return (
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.100' }}>
            <TableCell sx={{ fontWeight: 600 }}>Student</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Reg No</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Class</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Fee Type</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="right">Amount</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="right">Paid</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="right">Balance</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="center">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reportData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                <Typography color="text.secondary">No data found. Click "Generate Report" to view results.</Typography>
              </TableCell>
            </TableRow>
          ) : (
            reportData.map((row, idx) => (
              <TableRow key={idx} hover>
                <TableCell>{row.student_name}</TableCell>
                <TableCell>{row.registration_no}</TableCell>
                <TableCell>{row.class}</TableCell>
                <TableCell>{row.fee_type}</TableCell>
                <TableCell align="right">UGX {parseFloat(row.amount).toLocaleString()}</TableCell>
                <TableCell align="right">UGX {parseFloat(row.paid).toLocaleString()}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: row.balance > 0 ? 'error.main' : 'success.main' }}>
                  UGX {parseFloat(row.balance).toLocaleString()}
                </TableCell>
                <TableCell>{new Date(row.due_date).toLocaleDateString()}</TableCell>
                <TableCell align="center">
                  <Chip 
                    label={row.status === 'overdue' ? `Overdue (${row.days_overdue}d)` : row.status}
                    color={row.status === 'paid' ? 'success' : row.status === 'overdue' ? 'error' : 'warning'}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))
          )}
          {reportData.length > 0 && (
            <TableRow sx={{ bgcolor: 'primary.50' }}>
              <TableCell colSpan={4} sx={{ fontWeight: 700 }}>TOTAL</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>UGX {totals.amount.toLocaleString()}</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>UGX {totals.paid.toLocaleString()}</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: totals.balance > 0 ? 'error.main' : 'success.main' }}>
                UGX {totals.balance.toLocaleString()}
              </TableCell>
              <TableCell colSpan={2}></TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  };

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>Fee Balance Reports</Typography>
        <Typography variant="body1" color="text.secondary">
          View student fee balances with filters for class, fee type, and payment status
        </Typography>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <FilterList color="primary" />
            <Typography variant="h6">Filters</Typography>
          </Box>
          <Grid container spacing={2} alignItems="end">
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Class</InputLabel>
                <Select
                  value={filters.class}
                  label="Class"
                  onChange={(e) => setFilters({...filters, class: e.target.value})}
                >
                  <MenuItem value="">All Classes</MenuItem>
                  {classes.map((cls) => (
                    <MenuItem key={cls.id} value={cls.name}>{cls.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Fee Type</InputLabel>
                <Select
                  value={filters.fee_type_id}
                  label="Fee Type"
                  onChange={(e) => setFilters({...filters, fee_type_id: e.target.value})}
                >
                  <MenuItem value="">All Fee Types</MenuItem>
                  {feeTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="due">Due</MenuItem>
                  <MenuItem value="overdue">Overdue</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AssessmentIcon />}
                onClick={generateReport}
                disabled={loading}
                size="large"
              >
                {loading ? 'Generating...' : 'Generate Report'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Fee Balance Report ({reportData.length} records)
          </Typography>
          <TableContainer component={Paper} elevation={0}>
            {renderBalanceReport()}
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Reports;
