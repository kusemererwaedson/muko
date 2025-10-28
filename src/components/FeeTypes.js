import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { feeAPI } from '../services/api';


const FeeTypes = () => {
  const [feeTypes, setFeeTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', from: '', to: '' });

  useEffect(() => {
    fetchFeeTypes();
  }, []);

  const fetchFeeTypes = async () => {
    try {
      const response = await feeAPI.getTypes();
      setFeeTypes(Array.isArray(response.data) ? response.data : response.data.data || []);
    } catch (error) {
      console.error('Error fetching fee types:', error);
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
              <Skeleton variant="text" width={220} height={20} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Box display="flex" justifyContent={{ xs: 'flex-start', md: 'flex-end' }} mt={{ xs: 2, md: 0 }}>
                <Skeleton variant="rectangular" width={140} height={36} sx={{ borderRadius: 1 }} />
              </Box>
            </Grid>
          </Grid>
        </Box>
        
        {/* Table Card Skeleton */}
        <Card>
          <CardContent>
            <Skeleton variant="text" width={140} height={24} sx={{ mb: 2 }} />
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    {['Name', 'Description', 'Created'].map((header, i) => (
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
                      <TableCell><Skeleton variant="text" width={200} height={16} /></TableCell>
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
      await feeAPI.createType(formData);
      fetchFeeTypes();
      setFormData({ name: '', description: '', from: '', to: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating fee type:', error);
    }
  };

  return (
    <Box>
      <Box mb={4}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              Fee Types
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage different types of fees
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box display="flex" justifyContent={{ xs: 'flex-start', md: 'flex-end' }} mt={{ xs: 2, md: 0 }}>
              <Button
                variant={showForm ? "outlined" : "contained"}
                startIcon={<AddIcon />}
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? 'Cancel' : 'Add Fee Type'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Dialog open={showForm} onClose={() => setShowForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Fee Type</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., Tuition Fee"
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="e.g., Monthly tuition fee for students (UGX)"
              multiline
              rows={3}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Valid From"
              type="date"
              value={formData.from}
              onChange={(e) => setFormData({...formData, from: e.target.value})}
              required
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Valid To"
              type="date"
              value={formData.to}
              onChange={(e) => setFormData({...formData, to: e.target.value})}
              required
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowForm(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Fee Types List
          </Typography>
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
                {feeTypes.map((type) => (
                  <TableRow key={type.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {type.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {type.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(type.created_at).toLocaleDateString()}
                      </Typography>
                    </TableCell>
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

export default FeeTypes;
