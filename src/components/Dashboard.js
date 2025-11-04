// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  Skeleton,
  useTheme,
  useMediaQuery,
  Stack,
  alpha,
  Divider
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  AttachMoney,
  AccountBalance,
  PhoneAndroid,
  Money
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { feeAPI, accountingAPI } from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    totalCollected: 0,
    totalDue: 0,
    overdueCount: 0,
    recentPayments: [],
    monthlyCollection: [],
    totalExpenses: 0,
    cashAtHand: 0,
    cashInBank: 0,
    cashOnMobileMoney: 0,
    accounts: []
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Chart data
  const monthlyCollectionData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Collections (UGX)',
        data: dashboardData.monthlyCollection || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: '#4B49AC',
        borderColor: '#4B49AC',
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const feeStatusData = {
    labels: ['Paid', 'Pending', 'Overdue'],
    datasets: [
      {
        data: [
          dashboardData.totalCollected || 0,
          dashboardData.totalDue || 0,
          dashboardData.overdueAmount || 0
        ],
        backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
        borderWidth: 0,
      },
    ],
  };

  const expenseBreakdownData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Expenses (UGX)',
        data: dashboardData.expenseCategories || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: '#f44336',
        borderColor: '#f44336',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return 'UGX ' + value.toLocaleString();
          }
        }
      }
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  useEffect(() => {
    fetchDashboardData();
    fetchTransactions();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await feeAPI.getDashboard();
      console.log('Dashboard API Response:', response.data);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await accountingAPI.getTransactions();
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  if (loading) {
    return (
      <Box>
        <Skeleton variant="text" width={300} height={40} sx={{ mb: 2 }} />
        <Skeleton variant="text" width={200} height={20} sx={{ mb: 4 }} />
        
        {/* Dashboard Cards Skeleton */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: { xs: 2, md: 3 } }}>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={{ xs: 100, sm: 120 }} sx={{ borderRadius: 1, flex: '1 1 300px' }} />
          ))}
        </Box>
        
        {/* Financial Summary Skeleton */}
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1, mb: 3 }} />
        
        {/* Charts Skeleton */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: { xs: 2, md: 4 } }}>
          {[...Array(4)].map((_, i) => (
            <Card key={i} sx={{ flex: '1 1 400px' }}>
              <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
                <Skeleton variant="text" width={250} height={24} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={{ xs: 200, sm: 250, md: 300 }} />
              </CardContent>
            </Card>
          ))}
        </Box>
        
        {/* Accounts Table Skeleton */}
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 1, mb: 3 }} />
        
        {/* Transactions Table Skeleton */}
        <Grid container spacing={{ xs: 1, sm: 2, md: 3 }} mt={2}>
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
                <Skeleton variant="text" width={150} height={24} sx={{ mb: 2 }} />
                <Box>
                  {[...Array(6)].map((_, i) => (
                    <Box key={i} display="flex" gap={2} py={1}>
                      <Skeleton variant="text" width={80} height={16} />
                      <Skeleton variant="text" width={120} height={16} />
                      <Skeleton variant="text" width={100} height={16} />
                      <Skeleton variant="rectangular" width={60} height={20} sx={{ borderRadius: 3 }} />
                      <Skeleton variant="text" width={80} height={16} />
                      <Skeleton variant="text" width={150} height={16} />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  }

  const collectionRate = (dashboardData.totalCollected + dashboardData.totalDue) > 0 
    ? Math.round((dashboardData.totalCollected / (dashboardData.totalCollected + dashboardData.totalDue)) * 100)
    : 0;

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Welcome to Muko High School
        </Typography>
        <Typography variant="body1" color="text.secondary">
          All systems are running smoothly! You have{' '}
          <Typography component="span" color="primary" fontWeight="bold">
            {dashboardData.overdueCount} overdue fees
          </Typography>
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: { xs: 2, md: 3 } }}>
        <Grid item xs={12} sm={6} md={2.4}>
           <Card sx={{
             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
             color: 'white',
             height: '100%',
             minHeight: '100px',
             border: `1px solid ${theme.palette.divider}`,
             borderRadius: 2,
             transition: 'all 0.2s ease',
             '&:hover': {
               transform: 'translateY(-2px)',
               boxShadow: theme.shadows[4]
             }
           }}>
             <CardContent sx={{ p: 2.5 }}>
               <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                 <Stack spacing={0.5} flex={1}>
                   <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 600, opacity: 0.9 }}>
                     Total Students
                   </Typography>
                   <Typography variant="h5" sx={{ fontWeight: 700, fontSize: '1.25rem', lineHeight: 1.2 }}>
                     {dashboardData.totalStudents}
                   </Typography>
                   <Typography variant="caption" sx={{ fontSize: '0.65rem', opacity: 0.8 }}>
                     Active
                   </Typography>
                 </Stack>
                 <Box sx={{
                   background: `linear-gradient(135deg, ${alpha('#fff', 0.2)} 0%, ${alpha('#fff', 0.1)} 100%)`,
                   borderRadius: 2.5,
                   p: 1.2,
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center'
                 }}>
                   <People sx={{ fontSize: 28, color: 'white' }} />
                 </Box>
               </Stack>
             </CardContent>
           </Card>
         </Grid>
        
        <Grid item xs={12} sm={6} md={2.4}>
           <Card sx={{
             background: 'linear-gradient(135deg, #43a047 0%, #1b5e20 100%)',
             color: 'white',
             height: '100%',
             minHeight: '100px',
             border: `1px solid ${theme.palette.divider}`,
             borderRadius: 2,
             transition: 'all 0.2s ease',
             '&:hover': {
               transform: 'translateY(-2px)',
               boxShadow: theme.shadows[4]
             }
           }}>
             <CardContent sx={{ p: 2.5 }}>
               <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ width: '100%' }}>
                 <Stack spacing={0.5} flex={1} sx={{ minWidth: 0 }}>
                   <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 600, opacity: 0.9 }}>
                     Total Collected
                   </Typography>
                   <Typography variant="h5" sx={{ 
                     fontWeight: 500, 
                     fontSize: '1.0rem', 
                     lineHeight: 1.2,
                     overflow: 'hidden',
                     textOverflow: 'ellipsis',
                     whiteSpace: 'nowrap'
                   }}>
                     UGX {dashboardData.totalCollected?.toLocaleString()}
                   </Typography>
                 </Stack>
                 <Box sx={{
                   background: `linear-gradient(135deg, ${alpha('#fff', 0.2)} 0%, ${alpha('#fff', 0.1)} 100%)`,
                   borderRadius: 2.5,
                   p: 1.2,
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center'
                 }}>
                   <AttachMoney sx={{ fontSize: 28, color: 'white' }} />
                 </Box>
               </Stack>
             </CardContent>
           </Card>
         </Grid>
        
        <Grid item xs={12} sm={6} md={2.4}>
           <Card sx={{
             background: 'linear-gradient(135deg, #ff9800 0%, #e65100 100%)',
             color: 'white',
             height: '100%',
             minHeight: '100px',
             border: `1px solid ${theme.palette.divider}`,
             borderRadius: 2,
             transition: 'all 0.2s ease',
             '&:hover': {
               transform: 'translateY(-2px)',
               boxShadow: theme.shadows[4]
             }
           }}>
             <CardContent sx={{ p: 2.5 }}>
               <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                 <Stack spacing={0.5} flex={1}>
                   <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 600, opacity: 0.9 }}>
                     Total Due
                   </Typography>
                   <Typography variant="h6" sx={{ 
                     fontWeight: 500, 
                     fontSize: '1.0rem', 
                     lineHeight: 1.2,
                     overflow: 'hidden',
                     textOverflow: 'ellipsis',
                     whiteSpace: 'nowrap' 
                   }}>
                     UGX {dashboardData.totalDue?.toLocaleString()}
                   </Typography>
                 </Stack>
                 <Box sx={{
                   background: `linear-gradient(135deg, ${alpha('#fff', 0.2)} 0%, ${alpha('#fff', 0.1)} 100%)`,
                   borderRadius: 2.5,
                   p: 1.2,
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center'
                 }}>
                   <TrendingDown sx={{ fontSize: 28, color: 'white' }} />
                 </Box>
               </Stack>
             </CardContent>
           </Card>
         </Grid>
        
        <Grid item xs={12} sm={6} md={2.4}>
           <Card sx={{
             background: 'linear-gradient(135deg, #f44336 0%, #b71c1c 100%)',
             color: 'white',
             height: '100%',
             minHeight: '100px',
             border: `1px solid ${theme.palette.divider}`,
             borderRadius: 2,
             transition: 'all 0.2s ease',
             '&:hover': {
               transform: 'translateY(-2px)',
               boxShadow: theme.shadows[4]
             }
           }}>
             <CardContent sx={{ p: 2.5 }}>
               <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                 <Stack spacing={0.5} flex={1}>
                   <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 600, opacity: 0.9 }}>
                     Total Expenses
                   </Typography>
                   <Typography variant="h5" sx={{ 
                     fontWeight: 500, 
                     fontSize: '1.0rem', 
                     lineHeight: 1.2,
                     overflow: 'hidden',
                     textOverflow: 'ellipsis',
                     whiteSpace: 'nowrap' 
                   }}>
                     UGX {dashboardData.totalExpenses?.toLocaleString()}
                   </Typography>
                 </Stack>
                 <Box sx={{
                   background: `linear-gradient(135deg, ${alpha('#fff', 0.2)} 0%, ${alpha('#fff', 0.1)} 100%)`,
                   borderRadius: 2.5,
                   p: 1.2,
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center'
                 }}>
                   <TrendingDown sx={{ fontSize: 28, color: 'white' }} />
                 </Box>
               </Stack>
             </CardContent>
           </Card>
         </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
           <Card sx={{
             background: 'linear-gradient(135deg, #2196f3 0%, #0d47a1 100%)',
             color: 'white',
             height: '100%',
             minHeight: '100px',
             border: `1px solid ${theme.palette.divider}`,
             borderRadius: 2,
             transition: 'all 0.2s ease',
             '&:hover': {
               transform: 'translateY(-2px)',
               boxShadow: theme.shadows[4]
             }
           }}>
             <CardContent sx={{ p: 2.5 }}>
               <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                 <Stack spacing={0.5} flex={1}>
                   <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 600, opacity: 0.9 }}>
                     Collection Rate
                   </Typography>
                   <Typography variant="h5" sx={{ fontWeight: 700, fontSize: '1.25rem', lineHeight: 1.2 }}>
                     {collectionRate}%
                   </Typography>
                 </Stack>
                 <Box sx={{
                   background: `linear-gradient(135deg, ${alpha('#fff', 0.2)} 0%, ${alpha('#fff', 0.1)} 100%)`,
                   borderRadius: 2.5,
                   p: 1.2,
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center'
                 }}>
                   <TrendingUp sx={{ fontSize: 28, color: 'white' }} />
                 </Box>
               </Stack>
             </CardContent>
           </Card>
         </Grid>
      </Grid>

      {/* Financial Summary Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Financial Summary</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ 
                p: 2, 
                bgcolor: alpha(theme.palette.success.main, 0.1), 
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`
              }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{
                    p: 1.5,
                    bgcolor: alpha(theme.palette.success.main, 0.2),
                    borderRadius: 2,
                    display: 'flex'
                  }}>
                    <Money sx={{ fontSize: 32, color: theme.palette.success.main }} />
                  </Box>
                  <Stack>
                    <Typography variant="caption" color="text.secondary">Cash at Hand</Typography>
                    <Typography variant="h6" color="success.main" fontWeight="bold">
                      UGX {dashboardData.cashAtHand?.toLocaleString()}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ 
                p: 2, 
                bgcolor: alpha(theme.palette.primary.main, 0.1), 
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
              }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{
                    p: 1.5,
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                    borderRadius: 2,
                    display: 'flex'
                  }}>
                    <AccountBalance sx={{ fontSize: 32, color: theme.palette.primary.main }} />
                  </Box>
                  <Stack>
                    <Typography variant="caption" color="text.secondary">Cash in Bank</Typography>
                    <Typography variant="h6" color="primary.main" fontWeight="bold">
                      UGX {dashboardData.cashInBank?.toLocaleString()}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ 
                p: 2, 
                bgcolor: alpha(theme.palette.info.main, 0.1), 
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`
              }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{
                    p: 1.5,
                    bgcolor: alpha(theme.palette.info.main, 0.2),
                    borderRadius: 2,
                    display: 'flex'
                  }}>
                    <PhoneAndroid sx={{ fontSize: 32, color: theme.palette.info.main }} />
                  </Box>
                  <Stack>
                    <Typography variant="caption" color="text.secondary">Mobile Money</Typography>
                    <Typography variant="h6" color="info.main" fontWeight="bold">
                      UGX {dashboardData.cashOnMobileMoney?.toLocaleString()}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ 
                p: 2, 
                bgcolor: alpha(theme.palette.warning.main, 0.1), 
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`
              }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{
                    p: 1.5,
                    bgcolor: alpha(theme.palette.warning.main, 0.2),
                    borderRadius: 2,
                    display: 'flex'
                  }}>
                    <AttachMoney sx={{ fontSize: 32, color: theme.palette.warning.main }} />
                  </Box>
                  <Stack>
                    <Typography variant="caption" color="text.secondary">Total Balance</Typography>
                    <Typography variant="h6" color="warning.main" fontWeight="bold">
                      UGX {(
                        (dashboardData.cashAtHand || 0) + 
                        (dashboardData.cashInBank || 0) + 
                        (dashboardData.cashOnMobileMoney || 0)
                      ).toLocaleString()}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: { xs: 2, md: 4 } }}>
          <Card sx={{ flex: '1 1 400px' }}>
            <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
              <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Monthly Fee Collection Trend</Typography>
              <Box height={{ xs: 200, sm: 250, md: 300 }}>
                <Line data={monthlyCollectionData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        
          <Card sx={{ flex: '1 1 400px' }}>
            <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
              <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Fee Status Distribution</Typography>
              <Box height={{ xs: 200, sm: 250, md: 300 }}>
                <Doughnut data={feeStatusData} options={doughnutOptions} />
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ flex: '1 1 400px' }}>
            <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
              <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Monthly Expense Breakdown</Typography>
              <Box height={{ xs: 180, sm: 220, md: 250 }}>
                <Bar data={expenseBreakdownData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        
          <Card sx={{ flex: '1 1 400px' }}>
            <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
              <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Recent Payments</Typography>
              {dashboardData.recentPayments.slice(0, 5).map((payment) => (
                <Box key={payment.id} display="flex" justifyContent="space-between" alignItems="center" py={1}>
                  <Typography variant="body2">
                    {payment.student?.first_name} {payment.student?.last_name}
                  </Typography>
                  <Chip 
                    label={`UGX ${payment.amount?.toLocaleString()}`} 
                    color="success" 
                    size="small"
                  />
                </Box>
              ))}
              <Box mt={2}>
                <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Monthly Summary</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <TrendingUp color="success" sx={{ mr: 1 }} />
                      <Typography variant="h6" color="success.main">
                        UGX {dashboardData.totalCollected?.toLocaleString()}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">Income</Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <TrendingDown color="error" sx={{ mr: 1 }} />
                      <Typography variant="h6" color="error.main">
                        UGX {dashboardData.totalExpenses?.toLocaleString()}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">Expenses</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
      </Box>

      {/* Account Balances Table */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Account Balances</Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Account Name</TableCell>
                  <TableCell>Account Type</TableCell>
                  <TableCell>Provider</TableCell>
                  <TableCell align="right">Current Balance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dashboardData.accounts && dashboardData.accounts.length > 0 ? (
                  dashboardData.accounts.map((account) => (
                    <TableRow key={account.id} hover>
                      <TableCell>{account.name}</TableCell>
                      <TableCell>
                        <Chip 
                          label={account.account_type} 
                          color={
                            account.account_type === 'cash' ? 'success' :
                            account.account_type === 'bank' ? 'primary' : 'info'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{account.provider || '-'}</TableCell>
                      <TableCell align="right">
                        <Typography 
                          variant="body2" 
                          fontWeight="bold"
                          color={parseFloat(account.current_balance) > 0 ? 'success.main' : 'text.secondary'}
                        >
                          UGX {parseFloat(account.current_balance).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No accounts found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Card sx={{ width: '100%' }}>
        <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
          <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>All Transactions</Typography>
          <TableContainer component={Paper} elevation={0} sx={{ overflowX: 'auto', width: '100%' }}>
            <Table stickyHeader sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ minWidth: 100 }}>Date</TableCell>
                  <TableCell sx={{ minWidth: 120 }}>Voucher</TableCell>
                  <TableCell sx={{ minWidth: 150 }}>Description</TableCell>
                  <TableCell sx={{ minWidth: 100 }}>Type</TableCell>
                  <TableCell sx={{ minWidth: 120 }} align="right">Amount</TableCell>
                  <TableCell sx={{ minWidth: 100 }}>Account</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dashboardData.recentPayments && dashboardData.recentPayments.length > 0 ? (
                  dashboardData.recentPayments.map((payment) => (
                    <TableRow key={payment.id} hover>
                      <TableCell>{new Date(payment.payment_date).toLocaleDateString()}</TableCell>
                      <TableCell>PAY-{payment.id}</TableCell>
                      <TableCell>
                        {payment.student?.first_name} {payment.student?.last_name} - 
                        {payment.fee_allocation?.fee_group?.fee_type?.name}
                      </TableCell>
                      <TableCell>
                        <Chip label="Credit" color="success" size="small" />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" color="success.main" fontWeight="bold">
                          UGX {parseFloat(payment.amount).toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>{payment.payment_method}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No recent transactions found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;