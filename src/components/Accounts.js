import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, TextField, Select, MenuItem,
  FormControl, InputLabel, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Chip,
  Skeleton
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { accountingAPI } from '../services/api';


const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: '', description: '' });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await accountingAPI.getAccounts();
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
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
                    {['Account Name', 'Type', 'Description', 'Created'].map((header, i) => (
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
                      <TableCell><Skeleton variant="rectangular" width={60} height={20} sx={{ borderRadius: 3 }} /></TableCell>
                      <TableCell><Skeleton variant="text" width={150} height={16} /></TableCell>
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await accountingAPI.createAccount(formData);
      fetchAccounts();
      setFormData({ name: '', type: '', description: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating account:', error);
    }
  };

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

      <Dialog open={showForm} onClose={() => setShowForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Account</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Account Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Account Type</InputLabel>
                  <Select
                    value={formData.type}
                    label="Account Type"
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <MenuItem value="asset">Asset</MenuItem>
                    <MenuItem value="liability">Liability</MenuItem>
                    <MenuItem value="equity">Equity</MenuItem>
                    <MenuItem value="income">Income</MenuItem>
                    <MenuItem value="expense">Expense</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowForm(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Chart of Accounts</Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Account Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Created</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {accounts.map((account) => (
                  <TableRow key={account.id} hover>
                    <TableCell>{account.name}</TableCell>
                    <TableCell>
                      <Chip label={account.type} color="primary" size="small" />
                    </TableCell>
                    <TableCell>{account.description}</TableCell>
                    <TableCell>{new Date(account.created_at).toLocaleDateString()}</TableCell>
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

export default Accounts;