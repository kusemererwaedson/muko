// src/components/academic/AcademicClasses.js
import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, TextField, Select, MenuItem,
  FormControl, InputLabel, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Grid, Dialog, DialogTitle, DialogContent,
  DialogActions, Snackbar, Alert, CircularProgress, IconButton, Tooltip, Skeleton
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Class as ClassIcon, Group as GroupIcon } from '@mui/icons-material';
import { academicAPI } from '../../services/api';

const AcademicClasses = () => {
  const [classes, setClasses] = useState([]);
  const [streams, setStreams] = useState([]);
  const [levels, setLevels] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('class');
  const [formData, setFormData] = useState({
    name: '',
    level_id: '',
    year_of_study: '',
    capacity: ''
  });
  const [streamFormData, setStreamFormData] = useState({
    name: ''
  });
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [dialogLoading, setDialogLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [classesRes, streamsRes, levelsRes] = await Promise.all([
        academicAPI.getClasses(),
        academicAPI.getStreams(),
        academicAPI.getLevels()
      ]);
      setClasses(Array.isArray(classesRes.data) ? classesRes.data : classesRes.data.data || []);
      setStreams(Array.isArray(streamsRes.data) ? streamsRes.data : streamsRes.data.data || []);
      setLevels(Array.isArray(levelsRes.data) ? levelsRes.data : levelsRes.data.data || []);
    } catch (error) {
      setSnackbar({ open: true, message: 'Error fetching data', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDialogLoading(true);
    try {
      if (modalType === 'class') {
        await academicAPI.createClass(formData);
        setSnackbar({ open: true, message: 'Class added successfully!', severity: 'success' });
      } else {
        await academicAPI.createStream(streamFormData);
        setSnackbar({ open: true, message: 'Stream added successfully!', severity: 'success' });
      }
      setShowModal(false);
      setFormData({ name: '', level_id: '', year_of_study: '', capacity: '' });
      setStreamFormData({ name: '' });
      fetchData();
    } catch (error) {
      setSnackbar({ open: true, message: 'Error creating item', severity: 'error' });
    } finally {
      setDialogLoading(false);
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Box>
      <Box mb={3} display="flex" alignItems="center" gap={2}>
        <ClassIcon color="primary" sx={{ fontSize: 40 }} />
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>Classes & Streams Management</Typography>
          <Typography variant="body1" color="text.secondary">Manage all academic classes and streams. Add, view, and organize with ease.</Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight={600} color="primary">Classes</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => openModal('class')} aria-label="Add Class">
                  Add Class
                </Button>
              </Box>
              {loading ? (
                <Skeleton variant="rectangular" height={180} />
              ) : (
                <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'grey.100' }}>
                        <TableCell>Name</TableCell>
                        <TableCell>Level</TableCell>
                        <TableCell>Year</TableCell>
                        <TableCell>Capacity</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {classes.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} align="center">No classes found.</TableCell>
                        </TableRow>
                      ) : (
                        classes.map((cls) => (
                          <TableRow key={cls.id} hover>
                            <TableCell>{cls.name}</TableCell>
                            <TableCell>{levels.find(l => l.id === cls.level_id)?.name || '-'}</TableCell>
                            <TableCell>{cls.year_of_study}</TableCell>
                            <TableCell>{cls.capacity}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight={600} color="primary">Streams</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => openModal('stream')} aria-label="Add Stream">
                  Add Stream
                </Button>
              </Box>
              {loading ? (
                <Skeleton variant="rectangular" height={180} />
              ) : (
                <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'grey.100' }}>
                        <TableCell>Name</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {streams.length === 0 ? (
                        <TableRow>
                          <TableCell align="center">No streams found.</TableCell>
                        </TableRow>
                      ) : (
                        streams.map((stream) => (
                          <TableRow key={stream.id} hover>
                            <TableCell>{stream.name}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={showModal} onClose={() => setShowModal(false)} fullWidth maxWidth="sm" aria-labelledby="add-edit-dialog">
        <DialogTitle id="add-edit-dialog">
          {modalType === 'class' ? 'Add Class' : 'Add Stream'}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            {modalType === 'class' ? (
              <>
                <TextField
                  label="Class Name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  fullWidth
                  margin="normal"
                  required
                  autoFocus
                />
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Level</InputLabel>
                  <Select
                    value={formData.level_id}
                    onChange={e => setFormData({ ...formData, level_id: e.target.value })}
                    label="Level"
                  >
                    {levels.map(level => (
                      <MenuItem key={level.id} value={level.id}>{level.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Year of Study"
                  value={formData.year_of_study}
                  onChange={e => setFormData({ ...formData, year_of_study: e.target.value })}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                  fullWidth
                  margin="normal"
                  required
                />
              </>
            ) : (
              <>
                <TextField
                  label="Stream Name"
                  value={streamFormData.name}
                  onChange={e => setStreamFormData({ ...streamFormData, name: e.target.value })}
                  fullWidth
                  margin="normal"
                  required
                  autoFocus
                  placeholder="e.g., A, B, Science, Arts"
                />
              </>
            )}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)} color="secondary">Cancel</Button>
          <Button type="submit" variant="contained" onClick={handleSubmit} disabled={dialogLoading}>
            {dialogLoading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AcademicClasses;