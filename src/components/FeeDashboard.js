import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Grid, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper,
  Skeleton
} from '@mui/material';
import {
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Payment as PaymentIcon,
  Email as EmailIcon,
  Assessment as AssessmentIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { feeAPI } from '../services/api';


const FeeDashboard = ({ setCurrentPage }) => {
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    totalCollected: 0,
    totalDue: 0,
    overdueCount: 0,
    recentPayments: [],
    monthlyCollection: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await feeAPI.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
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

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>Fee Management Dashboard</Typography>
        <Typography variant="body1" color="text.secondary">
          Comprehensive fee tracking and collection overview
        </Typography>
      </Box>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PeopleIcon sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="body2">Total Students</Typography>
                  <Typography variant="h4">{dashboardData.totalStudents}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUpIcon sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="body2">Total Collected</Typography>
                  <Typography variant="h5">UGX {dashboardData.totalCollected?.toLocaleString()}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <WarningIcon sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="body2">Total Due</Typography>
                  <Typography variant="h5">UGX {dashboardData.totalDue?.toLocaleString()}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ErrorIcon sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="body2">Overdue</Typography>
                  <Typography variant="h4">{dashboardData.overdueCount}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent Payments</Typography>
              <TableContainer component={Paper} elevation={0}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Student</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboardData.recentPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{payment.student?.first_name} {payment.student?.last_name}</TableCell>
                        <TableCell>UGX {payment.amount?.toLocaleString()}</TableCell>
                        <TableCell>{new Date(payment.payment_date).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Quick Actions</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<PaymentIcon />}
                    onClick={() => setCurrentPage('fees-bulk-collection')}
                    sx={{ mb: 1 }}
                  >
                    Bulk Collection
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="info"
                    startIcon={<EmailIcon />}
                    onClick={() => setCurrentPage('communications-bulk-reminders')}
                    sx={{ mb: 1 }}
                  >
                    Send Reminders
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="warning"
                    startIcon={<AssessmentIcon />}
                    onClick={() => setCurrentPage('fees-reports')}
                  >
                    Due Report
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    startIcon={<AddIcon />}
                    onClick={() => setCurrentPage('fees-allocate')}
                  >
                    Allocate Fees
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FeeDashboard;
