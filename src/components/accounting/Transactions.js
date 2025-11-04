// src/components/accounting/Transaction.js
import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, TextField, Select, MenuItem,
  FormControl, InputLabel, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Grid, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, Skeleton, useTheme, useMediaQuery, Snackbar, Alert, 
  CircularProgress, FormHelperText
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { accountingAPI } from '../../services/api';


const Transactions = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [voucherHeads, setVoucherHeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    voucher_head_id: '', account_id: '', amount: '', type: 'debit',
    description: '', date: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [dialogLoading, setDialogLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
    fetchAccounts();
    fetchVoucherHeads();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await accountingAPI.getTransactions();
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setSnackbar({ 
        open: true, 
        message: 'Failed to load transactions', 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await accountingAPI.getAccounts();
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setSnackbar({ 
        open: true, 
        message: 'Failed to load accounts', 
        severity: 'error' 
      });
    }
  };

  const fetchVoucherHeads = async () => {
    try {
      const response = await accountingAPI.getVoucherHeads();
      setVoucherHeads(response.data);
    } catch (error) {
      console.error('Error fetching voucher heads:', error);
      setSnackbar({ 
        open: true, 
        message: 'Failed to load voucher heads', 
        severity: 'error' 
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDialogLoading(true);
    setErrors({});

    try {
      const response = await accountingAPI.createTransaction(formData);
      
      setSnackbar({ 
        open: true, 
        message: response.data?.message || 'Transaction created successfully!', 
        severity: 'success' 
      });
      
      setFormData({
        voucher_head_id: '', 
        account_id: '', 
        amount: '', 
        type: 'debit',
        description: '', 
        date: new Date().toISOString().split('T')[0]
      });
      setShowForm(false);
      fetchTransactions();
      fetchAccounts(); // Refresh accounts to show updated balances
      
    } catch (error) {
      console.error('Error creating transaction:', error);
      
      if (error.response) {
        const status = error.response.status;
        
        // Validation errors (422) - including insufficient balance
        if (status === 422) {
          const validationErrors = error.response.data?.errors || {};
          setErrors(validationErrors);
          
          // Show first error in snackbar
          const firstError = Object.values(validationErrors)[0]?.[0];
          setSnackbar({ 
            open: true, 
            message: firstError || 'Please check your input', 
            severity: 'error' 
          });
        }
        // Server errors (500)
        else if (status === 500) {
          setSnackbar({ 
            open: true, 
            message: error.response.data?.message || 'Server error. Please try again later', 
            severity: 'error' 
          });
        }
        // Not found (404)
        else if (status === 404) {
          setSnackbar({ 
            open: true, 
            message: error.response.data?.message || 'Resource not found', 
            severity: 'error' 
          });
        }
        // Unauthorized (401)
        else if (status === 401) {
          setSnackbar({ 
            open: true, 
            message: 'Session expired. Please log in again', 
            severity: 'error' 
          });
        }
        // Forbidden (403)
        else if (status === 403) {
          setSnackbar({ 
            open: true, 
            message: 'You do not have permission to perform this action', 
            severity: 'error' 
          });
        }
        // Other errors
        else {
          setSnackbar({ 
            open: true, 
            message: error.response.data?.message || 'An error occurred', 
            severity: 'error' 
          });
        }
      } 
      // Network errors
      else if (error.request) {
        setSnackbar({ 
          open: true, 
          message: 'Network error. Please check your internet connection', 
          severity: 'error' 
        });
      } 
      // Other errors
      else {
        setSnackbar({ 
          open: true, 
          message: 'An unexpected error occurred', 
          severity: 'error' 
        });
      }
    } finally {
      setDialogLoading(false);
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const handleCloseDialog = () => {
    setShowForm(false);
    setErrors({});
    setFormData({
      voucher_head_id: '', 
      account_id: '', 
      amount: '', 
      type: 'debit',
      description: '', 
      date: new Date().toISOString().split('T')[0]
    });
  };

  // Get selected account's current balance
  const selectedAccount = accounts.find(acc => acc.id === formData.account_id);
  const currentBalance = selectedAccount?.current_balance || 0;

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
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>Transactions</Typography>
            <Typography variant="body1" color="text.secondary">
              Manage financial transactions
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box display="flex" justifyContent={{ xs: 'flex-start', md: 'flex-end' }} mt={{ xs: 2, md: 0 }}>
              <Button
                variant={showForm ? "outlined" : "contained"}
                startIcon={<AddIcon />}
                onClick={() => setShowForm(!showForm)}
                fullWidth={isMobile}
              >
                {showForm ? 'Cancel' : 'Add Transaction'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Dialog 
        open={showForm} 
        onClose={handleCloseDialog} 
        fullWidth 
        maxWidth="sm" 
        aria-labelledby="add-transaction-dialog"
      >
        <DialogTitle id="add-transaction-dialog">
          Add New Transaction
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <FormControl 
              fullWidth 
              margin="normal" 
              required
              error={!!errors.voucher_head_id}
            >
              <InputLabel>Voucher Head</InputLabel>
              <Select
                value={formData.voucher_head_id}
                onChange={e => setFormData({ ...formData, voucher_head_id: e.target.value })}
                label="Voucher Head"
                autoFocus
              >
                {voucherHeads.map((head) => (
                  <MenuItem key={head.id} value={head.id}>{head.name}</MenuItem>
                ))}
              </Select>
              {errors.voucher_head_id && (
                <FormHelperText>{errors.voucher_head_id[0]}</FormHelperText>
              )}
            </FormControl>

            <FormControl 
              fullWidth 
              margin="normal" 
              required
              error={!!errors.account_id}
            >
              <InputLabel>Account</InputLabel>
              <Select
                value={formData.account_id}
                onChange={e => setFormData({ ...formData, account_id: e.target.value })}
                label="Account"
              >
                {accounts.map((account) => (
                  <MenuItem key={account.id} value={account.id}>
                    {account.name} (Balance: {parseFloat(account.current_balance).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })})
                  </MenuItem>
                ))}
              </Select>
              {errors.account_id && (
                <FormHelperText>{errors.account_id[0]}</FormHelperText>
              )}
            </FormControl>

            {/* Display current balance of selected account */}
            {formData.account_id && (
              <Box 
                sx={{ 
                  p: 2, 
                  mt: 1, 
                  bgcolor: 'info.lighter', 
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'info.main'
                }}
              >
                <Typography variant="body2" color="info.dark">
                  Current Balance: <strong>
                    {parseFloat(currentBalance).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </strong>
                </Typography>
              </Box>
            )}

            <FormControl 
              fullWidth 
              margin="normal"
              error={!!errors.type}
            >
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
                label="Type"
              >
                <MenuItem value="debit">Debit (Expense/Withdrawal)</MenuItem>
                <MenuItem value="credit">Credit (Income/Deposit)</MenuItem>
              </Select>
              {errors.type && (
                <FormHelperText>{errors.type[0]}</FormHelperText>
              )}
            </FormControl>

            <TextField
              label="Amount"
              type="number"
              value={formData.amount}
              onChange={e => setFormData({ ...formData, amount: e.target.value })}
              fullWidth
              margin="normal"
              required
              inputProps={{ min: 0.01, step: "0.01" }}
              error={!!errors.amount}
              helperText={errors.amount?.[0]}
            />

            <TextField
              label="Date"
              type="date"
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
              fullWidth
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
              error={!!errors.date}
              helperText={errors.date?.[0]}
            />

            <TextField
              label="Description"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              margin="normal"
              multiline
              rows={3}
              error={!!errors.description}
              helperText={errors.description?.[0]}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={dialogLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={dialogLoading}
            startIcon={dialogLoading ? <CircularProgress size={20} /> : null}
          >
            {dialogLoading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Card sx={{ width: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Transaction History</Typography>
          {isMobile ? (
            // Mobile Card Layout
            <Box>
              {transactions.length > 0 ? transactions.map((transaction) => (
                <Card key={transaction.id} sx={{ mb: 2, border: '1px solid', borderColor: 'divider' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {transaction.voucher_head?.name || 'N/A'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(transaction.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Chip 
                        label={transaction.type}
                        color={transaction.type === 'credit' ? 'success' : 'error'}
                        size="small"
                      />
                    </Box>
                    
                    <Grid container spacing={1} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Account</Typography>
                        <Typography variant="body2">{transaction.account?.name || 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Amount</Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {parseFloat(transaction.amount).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">Description</Typography>
                        <Typography variant="body2">{transaction.description || 'N/A'}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              )) : (
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No transactions found
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Box>
          ) : (
            // Desktop Table Layout
            <TableContainer component={Paper} elevation={0} sx={{ overflowX: 'auto', width: '100%' }}>
              <Table stickyHeader sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ minWidth: 100 }}>Date</TableCell>
                    <TableCell sx={{ minWidth: 120 }}>Voucher Head</TableCell>
                    <TableCell sx={{ minWidth: 120 }}>Account</TableCell>
                    <TableCell sx={{ minWidth: 80 }}>Type</TableCell>
                    <TableCell sx={{ minWidth: 100 }} align="right">Amount</TableCell>
                    <TableCell sx={{ minWidth: 150 }}>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.length > 0 ? transactions.map((transaction) => (
                    <TableRow key={transaction.id} hover>
                      <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                      <TableCell>{transaction.voucher_head?.name || 'N/A'}</TableCell>
                      <TableCell>{transaction.account?.name || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip 
                          label={transaction.type}
                          color={transaction.type === 'credit' ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        {parseFloat(transaction.amount).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </TableCell>
                      <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {transaction.description || 'N/A'}
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                          No transactions found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Transactions;