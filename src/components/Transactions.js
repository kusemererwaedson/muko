import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, TextField, Select, MenuItem,
  FormControl, InputLabel, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Grid, Collapse, Chip,
  Skeleton, useTheme, useMediaQuery, Stack, Divider
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { accountingAPI } from '../services/api';


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
    }
  };

  const fetchVoucherHeads = async () => {
    try {
      const response = await accountingAPI.getVoucherHeads();
      setVoucherHeads(response.data);
    } catch (error) {
      console.error('Error fetching voucher heads:', error);
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
      await accountingAPI.createTransaction(formData);
      fetchTransactions();
      setFormData({
        voucher_head_id: '', account_id: '', amount: '', type: 'debit',
        description: '', date: new Date().toISOString().split('T')[0]
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

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

      <Collapse in={showForm}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Add New Transaction</Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Voucher Head</InputLabel>
                    <Select
                      value={formData.voucher_head_id}
                      label="Voucher Head"
                      onChange={(e) => setFormData({...formData, voucher_head_id: e.target.value})}
                    >
                      {voucherHeads.map((head) => (
                        <MenuItem key={head.id} value={head.id}>{head.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Account</InputLabel>
                    <Select
                      value={formData.account_id}
                      label="Account"
                      onChange={(e) => setFormData({...formData, account_id: e.target.value})}
                    >
                      {accounts.map((account) => (
                        <MenuItem key={account.id} value={account.id}>{account.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select
                      value={formData.type}
                      label="Type"
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                    >
                      <MenuItem value="debit">Debit</MenuItem>
                      <MenuItem value="credit">Credit</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </Grid>
              </Grid>
              <Box mt={2}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <Button type="submit" variant="contained" fullWidth={isMobile}>Save</Button>
                  <Button variant="outlined" onClick={() => setShowForm(false)} fullWidth={isMobile}>Cancel</Button>
                </Stack>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Collapse>

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
                          UGX {transaction.amount?.toLocaleString()}
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
                    <TableCell sx={{ minWidth: 100 }}>Amount</TableCell>
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
                      <TableCell>UGX {transaction.amount?.toLocaleString()}</TableCell>
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
