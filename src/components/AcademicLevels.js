import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, TextField, Select, MenuItem,
  FormControl, InputLabel, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Grid, Dialog, DialogTitle, DialogContent,
  DialogActions, Chip
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { academicAPI } from '../services/api';

const AcademicLevels = () => {
  const [levels, setLevels] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: ''
  });

  useEffect(() => {
    fetchLevels();
  }, []);

  const fetchLevels = async () => {
    try {
      const response = await academicAPI.getLevels();
      setLevels(Array.isArray(response.data) ? response.data : response.data.data || []);
    } catch (error) {
      console.error('Error fetching levels:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await academicAPI.createLevel(formData);
      setShowModal(false);
      setFormData({ name: '', type: '', description: '' });
      fetchLevels();
    } catch (error) {
      console.error('Error creating level:', error);
    }
  };

  return (
    <Box>
      <Box mb={4}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h4">Academic Levels & Years</Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowModal(true)}
            >
              Add Level
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Education Levels</Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Level Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Classes Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {levels.map(level => (
                  <TableRow key={level.id}>
                    <TableCell>{level.name}</TableCell>
                    <TableCell>
                      <Chip 
                        label={level.type}
                        color={
                          level.type === 'Primary' ? 'info' : 
                          level.type === 'Secondary' ? 'warning' : 'success'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{level.description}</TableCell>
                    <TableCell>{level.classes_count || 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Academic Level</DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Level Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., Lower Primary, Upper Primary, O-Level, A-Level"
              required
              margin="normal"
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                label="Type"
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <MenuItem value="Primary">Primary</MenuItem>
                <MenuItem value="Secondary">Secondary</MenuItem>
                <MenuItem value="Advanced">Advanced</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Brief description of this level"
              multiline
              rows={3}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Save Level</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default AcademicLevels;