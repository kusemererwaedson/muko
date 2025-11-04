import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, TextField, Select, MenuItem,
  FormControl, InputLabel, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Grid, Dialog, DialogTitle, DialogContent,
  DialogActions, Chip, Checkbox, FormControlLabel
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { academicAPI } from '../../services/api';

const AcademicTerms = () => {
  const [terms, setTerms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    start_date: '',
    end_date: '',
    year: new Date().getFullYear(),
    is_current: false
  });

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      const response = await academicAPI.getTerms();
      setTerms(Array.isArray(response.data) ? response.data : response.data.data || []);
    } catch (error) {
      console.error('Error fetching terms:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await academicAPI.createTerm(formData);
      setShowModal(false);
      setFormData({
        name: '',
        start_date: '',
        end_date: '',
        year: new Date().getFullYear(),
        is_current: false
      });
      fetchTerms();
    } catch (error) {
      console.error('Error creating term:', error);
    }
  };

  const setCurrentTerm = async (termId) => {
    try {
      await academicAPI.setCurrentTerm(termId);
      fetchTerms();
    } catch (error) {
      console.error('Error setting current term:', error);
    }
  };

  return (
    <Box>
      <Box mb={4}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h4">Terms Management</Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowModal(true)}
            >
              Add Term
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Academic Terms</Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Term Name</TableCell>
                  <TableCell>Year</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Duration (Days)</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {terms.map(term => (
                  <TableRow key={term.id}>
                    <TableCell>{term.name}</TableCell>
                    <TableCell>{term.year}</TableCell>
                    <TableCell>{new Date(term.start_date).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(term.end_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {Math.ceil((new Date(term.end_date) - new Date(term.start_date)) / (1000 * 60 * 60 * 24))}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={term.is_current ? 'Current' : 'Inactive'}
                        color={term.is_current ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {!term.is_current && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => setCurrentTerm(term.id)}
                        >
                          Set Current
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Academic Term</DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Term Name</InputLabel>
              <Select
                value={formData.name}
                label="Term Name"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              >
                <MenuItem value="Term 1">Term 1</MenuItem>
                <MenuItem value="Term 2">Term 2</MenuItem>
                <MenuItem value="Term 3">Term 3</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Year"
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({...formData, year: e.target.value})}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({...formData, start_date: e.target.value})}
              required
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData({...formData, end_date: e.target.value})}
              required
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.is_current}
                  onChange={(e) => setFormData({...formData, is_current: e.target.checked})}
                />
              }
              label="Set as current term"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Save Term</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default AcademicTerms;