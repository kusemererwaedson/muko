// src/components/accounting/Accounts.js
import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, TextField, Select, MenuItem,
  FormControl, InputLabel, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Grid, Dialog, DialogTitle, DialogContent, 
  DialogActions, Chip, Skeleton, Snackbar, Alert, CircularProgress, 
  FormHelperText
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { accountingAPI } from '../../services/api';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    type: '',
    description: '', 
    account_type: '', 
    provider: '', 
    account_number: '', 
    current_balance: ''
  });
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [dialogLoading, setDialogLoading] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await accountingAPI.getAccounts();
      setAccounts(response.data);
      setErrors({});
    } catch (error) {
      console.error('Error fetching accounts:', error);
      let errorMessage = 'Failed to load accounts';
      
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection';
      }
      
      setSnackbar({ 
        open: true, 
        message: errorMessage, 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDialogLoading(true);
    setErrors({});

    try {
      const response = await accountingAPI.createAccount(formData);
      
      setSnackbar({ 
        open: true, 
        message: response.data?.message || 'Account created successfully!', 
        severity: 'success' 
      });
      
      setFormData({ 
        name: '', 
        type: '',
        description: '', 
        account_type: '', 
        provider: '', 
        account_number: '', 
        current_balance: ''
      });
      setShowForm(false);
      fetchAccounts();
      
    } catch (error) {
      console.error('Error creating account:', error);
      
      if (error.response) {
        const status = error.response.status;
        
        // Validation errors (422)
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
      name: '', 
      type: '',
      description: '', 
      account_type: '', 
      provider: '', 
      account_number: '', 
      current_balance: ''
    });
  };

  if (loading) {
    return (
      <Box>
        {/* Header Skeleton */}
        <Box mb={4}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item xs={12} md={8}>
              <Skeleton variant="text" width={150} height={32} sx={{ mb: 1 }} />
              <Skeleton variant="text" width={200} height={20} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Box display="flex" justifyContent={{ xs: 'flex-start', md: 'flex-end' }} mt={{ xs: 2, md: 0 }}>
                <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 1 }} />
              </Box>
            </Grid>
          </Grid>
        </Box>
        
        {/* Accounts Table Skeleton */}
        <Card>
          <CardContent>
            <Skeleton variant="text" width={160} height={24} sx={{ mb: 2 }} />
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    {['Account Name','Description','Account Type','Provider','Account Number','Opening Balance'].map((header, i) => (
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
                      <TableCell><Skeleton variant="text" width={150} height={16} /></TableCell>
                      <TableCell><Skeleton variant="rectangular" width={60} height={20} sx={{ borderRadius: 3 }} /></TableCell>
                      <TableCell><Skeleton variant="text" width={100} height={16} /></TableCell>
                      <TableCell><Skeleton variant="text" width={100} height={16} /></TableCell>
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

  return (
    <Box>
      <Box mb={4}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>Accounts</Typography>
            <Typography variant="body1" color="text.secondary">
              Manage chart of accounts
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box display="flex" justifyContent={{ xs: 'flex-start', md: 'flex-end' }} mt={{ xs: 2, md: 0 }}>
              <Button
                variant={showForm ? "outlined" : "contained"}
                startIcon={<AddIcon />}
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? 'Cancel' : 'Add Account'}
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
        aria-labelledby="add-account-dialog"
      >
        <DialogTitle id="add-account-dialog">
          Add New Account
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Account Name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              margin="normal"
              required
              autoFocus
              error={!!errors.name}
              helperText={errors.name?.[0]}
            />

            <FormControl 
              fullWidth 
              margin="normal" 
              required
              error={!!errors.type}
            >
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
                label="Type"
              >
                <MenuItem value="Asset">Asset</MenuItem>
                <MenuItem value="Liability">Liability</MenuItem>
                <MenuItem value="Equity">Equity</MenuItem>
                <MenuItem value="Revenue">Revenue</MenuItem>
                <MenuItem value="Expense">Expense</MenuItem>
              </Select>
              {errors.type && <FormHelperText>{errors.type[0]}</FormHelperText>}
            </FormControl>

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

            <FormControl 
              fullWidth 
              margin="normal" 
              required
              error={!!errors.account_type}
            >
              <InputLabel>Account Type</InputLabel>
              <Select
                value={formData.account_type}
                onChange={e => setFormData({ ...formData, account_type: e.target.value })}
                label="Account Type"
              >
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="bank">Bank</MenuItem>
                <MenuItem value="mobile_money">Mobile Money</MenuItem>
              </Select>
              {errors.account_type && <FormHelperText>{errors.account_type[0]}</FormHelperText>}
            </FormControl>
            
            <TextField
              label="Provider"
              value={formData.provider}
              onChange={e => setFormData({ ...formData, provider: e.target.value })}
              fullWidth
              margin="normal"
              error={!!errors.provider}
              helperText={errors.provider?.[0] || 'Required for Bank and Mobile Money'}
            />

            <TextField
              label="Account Number"
              value={formData.account_number}
              onChange={e => setFormData({ ...formData, account_number: e.target.value })}
              fullWidth
              margin="normal"
              error={!!errors.account_number}
              helperText={errors.account_number?.[0]}
            />

            <TextField
              label="Opening Balance"
              value={formData.current_balance}
              onChange={e => setFormData({ ...formData, current_balance: e.target.value })}
              fullWidth
              margin="normal"
              type="number"
              required
              inputProps={{ min: 0, step: "0.01" }}
              error={!!errors.current_balance}
              helperText={errors.current_balance?.[0]}
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

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Chart of Accounts</Typography>
          {accounts.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography variant="body1" color="text.secondary">
                No accounts found. Create your first account to get started.
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Account Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Account Type</TableCell>
                    <TableCell>Provider</TableCell>
                    <TableCell>Account Number</TableCell>
                    <TableCell align="right">Current Balance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {accounts.map((account) => (
                    <TableRow key={account.id} hover>
                      <TableCell>{account.name}</TableCell>
                      <TableCell>{account.type}</TableCell>
                      <TableCell>{account.description || '-'}</TableCell>
                      <TableCell>
                        <Chip 
                          label={account.account_type} 
                          color="primary" 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>{account.provider || '-'}</TableCell>
                      <TableCell>{account.account_number || '-'}</TableCell>
                      <TableCell align="right">
                        {parseFloat(account.current_balance).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Accounts;