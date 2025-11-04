import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, TextField,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Grid, Collapse,
  Skeleton
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { accountingAPI } from '../../services/api';


const VoucherHeads = () => {
  const [voucherHeads, setVoucherHeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchVoucherHeads();
  }, []);

  const fetchVoucherHeads = async () => {
    try {
      const response = await accountingAPI.getVoucherHeads();
      setVoucherHeads(response.data);
    } catch (error) {
      console.error('Error fetching voucher heads:', error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await accountingAPI.createVoucherHead(formData);
      fetchVoucherHeads();
      setFormData({ name: '', description: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating voucher head:', error);
    }
  };

  return (
    <Box>
      <Box mb={4}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>Voucher Heads</Typography>
            <Typography variant="body1" color="text.secondary">
              Manage voucher categories
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box display="flex" justifyContent={{ xs: 'flex-start', md: 'flex-end' }} mt={{ xs: 2, md: 0 }}>
              <Button
                variant={showForm ? "outlined" : "contained"}
                startIcon={<AddIcon />}
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? 'Cancel' : 'Add Voucher Head'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Collapse in={showForm}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Add New Voucher Head</Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g., Office Supplies, Transport, Utilities"
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Brief description of this voucher category"
                margin="normal"
              />
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
          <Typography variant="h6" gutterBottom>Voucher Heads List</Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Created</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {voucherHeads.map((head) => (
                  <TableRow key={head.id} hover>
                    <TableCell>{head.name}</TableCell>
                    <TableCell>{head.description}</TableCell>
                    <TableCell>{new Date(head.created_at).toLocaleDateString()}</TableCell>
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

export default VoucherHeads;
