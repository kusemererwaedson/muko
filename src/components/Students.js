import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  InputAdornment,
  Pagination,
  Tooltip,
  Skeleton,
  useTheme,
  useMediaQuery,
  Stack,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Payment as PaymentIcon,
  Clear as ClearIcon,
  People as PeopleIcon,
  CloudDownload as CloudDownloadIcon,
  Layers as LayersIcon
} from '@mui/icons-material';
import { studentAPI, academicAPI } from '../services/api';

import StudentImportExport from './StudentImportExport';

const Students = ({ setCurrentPage }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0
  });
  const [showForm, setShowForm] = useState(false);
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [streamFilter, setStreamFilter] = useState('');
  const [viewingStudent, setViewingStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [classes, setClasses] = useState([]);
  const [streams, setStreams] = useState([]);
  const [allStreams, setAllStreams] = useState([]);

  const [bulkStudents, setBulkStudents] = useState([{
    lin: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    class_id: '',
    stream_id: '',
    gender: 'male',
    birthday: '',
    admission_date: '',
    address: '',
    guardian_name: '',
    guardian_phone: '',
    guardian_email: '',
    guardian_relationship: ''
  }]);
  const [formData, setFormData] = useState({
    lin: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    class_id: '',
    stream_id: '',
    gender: 'male',
    birthday: '',
    admission_date: '',
    address: '',
    guardian_name: '',
    guardian_phone: '',
    guardian_email: '',
    guardian_relationship: '',
    picture: null
  });

  useEffect(() => {
    fetchStudents();
    fetchClasses();
    fetchAllStreams();
  }, []);

  const fetchStudents = async (page = 1, filters = {}) => {
    try {
      setLoading(true);
      const params = {
        page,
        per_page: 15,
        ...(searchTerm && { search: searchTerm }),
        ...(classFilter && { class_id: classFilter }),
        ...(streamFilter && { stream_id: streamFilter }),
        ...filters
      };
      
      // Remove empty params
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === undefined) {
          delete params[key];
        }
      });
      
      console.log('Fetching with params:', params);
      let response;
      
      try {
        response = await studentAPI.getAll(params);
      } catch (error) {
        // If pagination fails, try without pagination
        console.log('Pagination failed, trying without params:', error);
        response = await studentAPI.getAll();
      }
      
      console.log('Students response:', response.data);
      
      if (response.data && typeof response.data === 'object' && response.data.data) {
        // Paginated response from Laravel
        setStudents(response.data.data);
        setFilteredStudents(response.data.data);
        setPagination({
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          per_page: response.data.per_page,
          total: response.data.total
        });
      } else if (Array.isArray(response.data)) {
        // Non-paginated response (array)
        setStudents(response.data);
        setFilteredStudents(response.data);
        setPagination({
          current_page: 1,
          last_page: 1,
          per_page: response.data.length,
          total: response.data.length
        });
      } else {
        console.error('Unexpected response format:', response.data);
        setStudents([]);
        setFilteredStudents([]);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
      setFilteredStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await studentAPI.getClasses();
      console.log('Classes fetched from API:', response.data);
      setClasses(response.data || []);
    } catch (error) {
      console.error('Error fetching classes from API:', error);
      setClasses([]);
    }
  };

  const fetchStreams = async (classId) => {
    try {
      const response = await studentAPI.getStreams(classId);
      setStreams(response.data);
    } catch (error) {
      console.error('Error fetching streams:', error);
    }
  };

  const fetchAllStreams = async () => {
    try {
      const response = await academicAPI.getStreams();
      setAllStreams(response.data || []);
    } catch (error) {
      console.error('Error fetching all streams:', error);
      setAllStreams([]);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm || classFilter || streamFilter) {
        fetchStudents(1);
      }
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm, classFilter, streamFilter]);
  
  const handlePageChange = (page) => {
    fetchStudents(page, { search: searchTerm, class_id: classFilter, stream_id: streamFilter });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentAPI.delete(id);
        fetchStudents(pagination.current_page);
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await studentAPI.update(editingStudent.id, formData);
      } else {
        await studentAPI.create(formData);
      }
      fetchStudents(pagination.current_page);
      resetForm();
    } catch (error) {
      console.error('Error saving student:', error);
      alert('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  const resetForm = () => {
    setFormData({
      lin: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      class_id: '',
      stream_id: '',
      gender: 'male',
      birthday: '',
      admission_date: '',
      address: '',
      guardian_name: '',
      guardian_phone: '',
      guardian_email: '',
      guardian_relationship: '',
      picture: null
    });
    setShowForm(false);
    setEditingStudent(null);
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    try {
      await studentAPI.bulkCreate({ students: bulkStudents });
      fetchStudents(1);
      setShowBulkForm(false);
      setBulkStudents([{
        lin: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        class_id: '',
        stream_id: '',
        gender: 'male',
        birthday: '',
        admission_date: '',
        address: '',
        guardian_name: '',
        guardian_phone: '',
        guardian_email: '',
        guardian_relationship: ''
      }]);
      alert('Students created successfully!');
    } catch (error) {
      console.error('Error creating bulk students:', error);
      alert('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  const addBulkStudent = () => {
    setBulkStudents([...bulkStudents, {
      lin: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      class_id: '',
      stream_id: '',
      gender: 'male',
      birthday: '',
      admission_date: '',
      address: '',
      guardian_name: '',
      guardian_phone: '',
      guardian_email: '',
      guardian_relationship: ''
    }]);
  };

  const removeBulkStudent = (index) => {
    if (bulkStudents.length > 1) {
      setBulkStudents(bulkStudents.filter((_, i) => i !== index));
    }
  };

  const updateBulkStudent = (index, field, value) => {
    const updated = [...bulkStudents];
    updated[index][field] = value;
    setBulkStudents(updated);
  };

  const handleEdit = (student) => {
    setFormData(student);
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleView = async (student) => {
    console.log('Viewing student:', student);
    setViewingStudent(student);
    try {
      const response = await studentAPI.getById(student.id);
      console.log('Student details:', response.data);
      setStudentDetails(response.data);
    } catch (error) {
      console.error('Error fetching student details:', error);
    }
  };

  const handleCollectFees = (student) => {
    // Store student data for fee collection and navigate
    localStorage.setItem('selectedStudent', JSON.stringify(student));
    if (setCurrentPage) {
      setCurrentPage('fees-payments');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setClassFilter('');
    setStreamFilter('');
    fetchStudents(1, { search: '', class_id: '', stream_id: '' });
  };



  if (loading) {
    return (
      <Box>
        {/* Header Skeleton */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Skeleton variant="text" width={150} height={32} sx={{ mb: 1 }} />
            <Skeleton variant="text" width={200} height={20} />
          </Box>
          <Skeleton variant="rectangular" width={140} height={36} sx={{ borderRadius: 1 }} />
        </Box>
        
        {/* Form Skeleton */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Skeleton variant="text" width={180} height={24} sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              {[...Array(6)].map((_, i) => (
                <Grid item xs={12} md={6} key={i}>
                  <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
                </Grid>
              ))}
            </Grid>
            <Box mt={2} display="flex" gap={1}>
              <Skeleton variant="rectangular" width={80} height={36} sx={{ borderRadius: 1 }} />
              <Skeleton variant="rectangular" width={80} height={36} sx={{ borderRadius: 1 }} />
            </Box>
          </CardContent>
        </Card>
        
        {/* Table Skeleton */}
        <Card>
          <CardContent>
            <Skeleton variant="text" width={120} height={24} sx={{ mb: 2 }} />
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    {['Name', 'Register No', 'Class', 'Guardian', 'Phone', 'Status', 'Actions'].map((header, i) => (
                      <TableCell key={i}>
                        <Skeleton variant="text" width={80} height={16} />
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[...Array(8)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton variant="text" width={120} height={16} /></TableCell>
                      <TableCell><Skeleton variant="text" width={80} height={16} /></TableCell>
                      <TableCell><Skeleton variant="text" width={60} height={16} /></TableCell>
                      <TableCell><Skeleton variant="text" width={100} height={16} /></TableCell>
                      <TableCell><Skeleton variant="text" width={90} height={16} /></TableCell>
                      <TableCell><Skeleton variant="rectangular" width={60} height={20} sx={{ borderRadius: 3 }} /></TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Skeleton variant="circular" width={24} height={24} />
                          <Skeleton variant="circular" width={24} height={24} />
                        </Box>
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
  }

  return (
    <Box>
      <Box mb={4}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              Students Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage student records and information
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1}
              justifyContent={{ xs: 'stretch', md: 'flex-end' }}
              mt={{ xs: 2, md: 0 }}
            >
              <Button
                variant={showForm ? "outlined" : "contained"}
                startIcon={<AddIcon />}
                onClick={() => setShowForm(!showForm)}
                size="small"
                fullWidth={isMobile}
              >
                {showForm ? 'Cancel' : 'Add Student'}
              </Button>
              <Button
                variant={showBulkForm ? "outlined" : "text"}
                startIcon={<LayersIcon />}
                onClick={() => setShowBulkForm(!showBulkForm)}
                size="small"
                fullWidth={isMobile}
              >
                {showBulkForm ? 'Cancel' : 'Bulk Add'}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center">
              <CloudDownloadIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" color="text.secondary">
                Import/Export Students
              </Typography>
            </Box>
            <StudentImportExport onImportComplete={() => fetchStudents(1)} />
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search by name or register number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Class</InputLabel>
                <Select
                  value={classFilter}
                  label="Class"
                  onChange={(e) => setClassFilter(e.target.value)}
                >
                  <MenuItem value="">All Classes</MenuItem>
                  {classes.map(cls => (
                    <MenuItem key={cls.id} value={cls.id}>{cls.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Stream</InputLabel>
                <Select
                  value={streamFilter}
                  label="Stream"
                  onChange={(e) => setStreamFilter(e.target.value)}
                >
                  <MenuItem value="">All Streams</MenuItem>
                  {Array.isArray(allStreams) && allStreams.map(stream => (
                    <MenuItem key={stream.id} value={stream.id}>{stream.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack 
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'stretch', sm: 'center' }}
                justifyContent={{ xs: 'flex-start', md: 'flex-end' }}
                spacing={1}
              >
                {(searchTerm || classFilter || streamFilter) && (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<ClearIcon />}
                    onClick={clearFilters}
                    fullWidth={isMobile}
                  >
                    Clear Filters
                  </Button>
                )}
                <Box display="flex" alignItems="center" justifyContent={{ xs: 'center', sm: 'flex-start' }}>
                  <PeopleIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Total: <Typography component="span" color="primary" fontWeight="bold">{pagination.total}</Typography> students
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Dialog 
        open={showForm} 
        onClose={resetForm} 
        maxWidth="lg" 
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">
              {editingStudent ? 'Edit Student' : 'Add New Student'}
            </Typography>
            {isMobile && (
              <IconButton onClick={resetForm} size="small">
                <ClearIcon />
              </IconButton>
            )}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="LIN (Learner Identification Number)"
                  value={formData.lin}
                  onChange={(e) => setFormData({...formData, lin: e.target.value})}
                  placeholder="e.g., LIN2024001"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="file"
                  label="Student Picture"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ accept: 'image/*' }}
                  onChange={(e) => setFormData({...formData, picture: e.target.files[0]})}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                  placeholder="e.g., John"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Middle Name"
                  value={formData.middle_name}
                  onChange={(e) => setFormData({...formData, middle_name: e.target.value})}
                  placeholder="e.g., Paul"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                  placeholder="e.g., Doe"
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth required>
                  <InputLabel>Class</InputLabel>
                  <Select
                    value={formData.class_id}
                    label="Class"
                    onChange={(e) => {
                      setFormData({...formData, class_id: e.target.value, stream_id: ''});
                      if (e.target.value) fetchStreams(e.target.value);
                    }}
                  >
                    {classes.map(cls => (
                      <MenuItem key={cls.id} value={cls.id}>{cls.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Stream</InputLabel>
                  <Select
                    value={formData.stream_id}
                    label="Stream"
                    onChange={(e) => setFormData({...formData, stream_id: e.target.value})}
                  >
                    {streams.map(stream => (
                      <MenuItem key={stream.id} value={stream.id}>{stream.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth required>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    value={formData.gender}
                    label="Gender"
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Birthday"
                  value={formData.birthday}
                  onChange={(e) => setFormData({...formData, birthday: e.target.value})}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Admission Date"
                  value={formData.admission_date}
                  onChange={(e) => setFormData({...formData, admission_date: e.target.value})}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Guardian Name"
                  value={formData.guardian_name}
                  onChange={(e) => setFormData({...formData, guardian_name: e.target.value})}
                  placeholder="e.g., Jane Doe"
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Guardian Phone"
                  value={formData.guardian_phone}
                  onChange={(e) => setFormData({...formData, guardian_phone: e.target.value})}
                  placeholder="e.g., +256700123456"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="email"
                  label="Guardian Email"
                  value={formData.guardian_email}
                  onChange={(e) => setFormData({...formData, guardian_email: e.target.value})}
                  placeholder="e.g., jane.doe@email.com"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Relationship</InputLabel>
                  <Select
                    value={formData.guardian_relationship}
                    label="Relationship"
                    onChange={(e) => setFormData({...formData, guardian_relationship: e.target.value})}
                  >
                    <MenuItem value="father">Father</MenuItem>
                    <MenuItem value="mother">Mother</MenuItem>
                    <MenuItem value="guardian">Guardian</MenuItem>
                    <MenuItem value="uncle">Uncle</MenuItem>
                    <MenuItem value="aunt">Aunt</MenuItem>
                    <MenuItem value="grandparent">Grandparent</MenuItem>
                    <MenuItem value="sibling">Sibling</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  multiline
                  rows={isMobile ? 2 : 3}
                  placeholder="Enter guardian's address"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, flexDirection: isMobile ? 'column' : 'row', gap: 1 }}>
          <Button onClick={resetForm} fullWidth={isMobile}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" fullWidth={isMobile}>
            {editingStudent ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={showBulkForm} 
        onClose={() => setShowBulkForm(false)} 
        maxWidth="xl" 
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Add Multiple Students</Typography>
            {isMobile && (
              <IconButton onClick={() => setShowBulkForm(false)} size="small">
                <ClearIcon />
              </IconButton>
            )}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleBulkSubmit} sx={{ pt: 1 }}>
            {bulkStudents.map((student, index) => (
              <Card key={index} sx={{ mb: 2, p: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">Student {index + 1}</Typography>
                  {bulkStudents.length > 1 && (
                    <Button size="small" color="error" onClick={() => removeBulkStudent(index)}>Remove</Button>
                  )}
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="LIN"
                      value={student.lin}
                      onChange={(e) => updateBulkStudent(index, 'lin', e.target.value)}
                      required
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={student.first_name}
                      onChange={(e) => updateBulkStudent(index, 'first_name', e.target.value)}
                      required
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Middle Name"
                      value={student.middle_name}
                      onChange={(e) => updateBulkStudent(index, 'middle_name', e.target.value)}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={student.last_name}
                      onChange={(e) => updateBulkStudent(index, 'last_name', e.target.value)}
                      required
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth required size="small">
                      <InputLabel>Class</InputLabel>
                      <Select
                        value={student.class_id}
                        label="Class"
                        onChange={(e) => updateBulkStudent(index, 'class_id', e.target.value)}
                      >
                        {classes.map(cls => (
                          <MenuItem key={cls.id} value={cls.id}>{cls.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth required size="small">
                      <InputLabel>Gender</InputLabel>
                      <Select
                        value={student.gender}
                        label="Gender"
                        onChange={(e) => updateBulkStudent(index, 'gender', e.target.value)}
                      >
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Admission Date"
                      value={student.admission_date}
                      onChange={(e) => updateBulkStudent(index, 'admission_date', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      required
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Guardian Name"
                      value={student.guardian_name}
                      onChange={(e) => updateBulkStudent(index, 'guardian_name', e.target.value)}
                      required
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Guardian Phone"
                      value={student.guardian_phone}
                      onChange={(e) => updateBulkStudent(index, 'guardian_phone', e.target.value)}
                      required
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="email"
                      label="Guardian Email"
                      value={student.guardian_email}
                      onChange={(e) => updateBulkStudent(index, 'guardian_email', e.target.value)}
                      size="small"
                    />
                  </Grid>
                </Grid>
              </Card>
            ))}
            
            <Box textAlign="center" mb={3}>
              <Button variant="outlined" onClick={addBulkStudent}>
                Add Another Student
              </Button>
            </Box>
                  
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, flexDirection: isMobile ? 'column' : 'row', gap: 1 }}>
          <Button onClick={() => setShowBulkForm(false)} fullWidth={isMobile}>Cancel</Button>
          <Button onClick={handleBulkSubmit} variant="contained" fullWidth={isMobile}>
            Save All Students
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={!!viewingStudent} 
        onClose={() => {setViewingStudent(null); setStudentDetails(null);}} 
        maxWidth="lg" 
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">
              Student Details - {viewingStudent?.first_name} {viewingStudent?.last_name}
            </Typography>
            {isMobile && (
              <IconButton onClick={() => {setViewingStudent(null); setStudentDetails(null);}} size="small">
                <ClearIcon />
              </IconButton>
            )}
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {viewingStudent && (
            <>
              <Card elevation={2} sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <PeopleIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6" color="primary">Personal Information</Typography>
                    </Box>
                    <Stack spacing={1.5}>
                      <Box display="flex" alignItems="center">
                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>Register No:</Typography>
                        <Typography variant="body2" fontWeight="medium">{viewingStudent?.registration_no || viewingStudent?.lin || 'N/A'}</Typography>
                      </Box>
                      <Box display="flex" alignItems="center">
                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>Full Name:</Typography>
                        <Typography variant="body2" fontWeight="medium">{viewingStudent?.first_name} {viewingStudent?.middle_name ? viewingStudent.middle_name + ' ' : ''}{viewingStudent?.last_name}</Typography>
                      </Box>
                      <Box display="flex" alignItems="center">
                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>Class:</Typography>
                        <Chip label={viewingStudent?.class_name || viewingStudent?.school_class?.name || 'N/A'} size="small" color="primary" variant="outlined" />
                      </Box>
                      <Box display="flex" alignItems="center">
                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>Stream:</Typography>
                        <Chip label={viewingStudent?.stream?.name || 'Not Assigned'} size="small" color="secondary" variant="outlined" />
                      </Box>
                      <Box display="flex" alignItems="center">
                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>Level:</Typography>
                        <Chip label={viewingStudent?.school_class?.level?.name || 'N/A'} size="small" color="info" variant="outlined" />
                      </Box>
                      <Box display="flex" alignItems="center">
                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>Gender:</Typography>
                        <Typography variant="body2" fontWeight="medium" sx={{ textTransform: 'capitalize' }}>{viewingStudent?.gender || 'N/A'}</Typography>
                      </Box>
                      <Box display="flex" alignItems="center">
                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>Birthday:</Typography>
                        <Typography variant="body2" fontWeight="medium">{viewingStudent?.birthday ? new Date(viewingStudent.birthday).toLocaleDateString() : 'N/A'}</Typography>
                      </Box>
                      <Box display="flex" alignItems="center">
                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>Admission:</Typography>
                        <Typography variant="body2" fontWeight="medium">{viewingStudent?.admission_date ? new Date(viewingStudent.admission_date).toLocaleDateString() : 'N/A'}</Typography>
                      </Box>
                      <Box display="flex" alignItems="center">
                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>Status:</Typography>
                        <Chip 
                          label={viewingStudent?.active ? 'Active' : 'Inactive'} 
                          color={viewingStudent?.active ? 'success' : 'error'} 
                          size="small"
                          sx={{ fontWeight: 'medium' }}
                        />
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <PeopleIcon color="secondary" sx={{ mr: 1 }} />
                      <Typography variant="h6" color="secondary">Guardian Information</Typography>
                    </Box>
                    <Stack spacing={1.5}>
                      <Box display="flex" alignItems="center">
                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>Name:</Typography>
                        <Typography variant="body2" fontWeight="medium">{viewingStudent?.guardian_name || 'N/A'}</Typography>
                      </Box>
                      <Box display="flex" alignItems="center">
                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>Relationship:</Typography>
                        <Chip label={viewingStudent?.guardian_relationship || 'N/A'} size="small" variant="outlined" sx={{ textTransform: 'capitalize' }} />
                      </Box>
                      <Box display="flex" alignItems="center">
                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>Phone:</Typography>
                        <Typography variant="body2" fontWeight="medium">{viewingStudent?.guardian_phone || 'N/A'}</Typography>
                      </Box>
                      <Box display="flex" alignItems="center">
                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>Email:</Typography>
                        <Typography variant="body2" fontWeight="medium">{viewingStudent?.guardian_email || 'N/A'}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Address:</Typography>
                        <Typography variant="body2" fontWeight="medium" sx={{ wordBreak: 'break-word' }}>{viewingStudent?.address || 'N/A'}</Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </Card>
                
              {studentDetails ? (
                <>
                  <Box mt={3}>
                    <Card elevation={2} sx={{ p: 2 }}>
                      <Box display="flex" alignItems="center" mb={2}>
                        <PaymentIcon color="warning" sx={{ mr: 1 }} />
                        <Typography variant="h6" color="warning.main">Fee Allocations</Typography>
                      </Box>
                      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        <Table size="small">
                          <TableHead>
                            <TableRow sx={{ bgcolor: 'grey.50' }}>
                              <TableCell sx={{ fontWeight: 'bold' }}>Fee Type</TableCell>
                              <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                              <TableCell sx={{ fontWeight: 'bold' }}>Due Date</TableCell>
                              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {(studentDetails.fee_allocations || studentDetails.feeAllocations)?.length > 0 ? (
                              (studentDetails.fee_allocations || studentDetails.feeAllocations).map((allocation) => (
                                <TableRow key={allocation.id} hover>
                                  <TableCell>{allocation.fee_group?.fee_type?.name || allocation.feeGroup?.feeType?.name || 'N/A'}</TableCell>
                                  <TableCell>
                                    <Typography variant="body2" fontWeight="medium" color="success.main">
                                      UGX {allocation.amount?.toLocaleString()}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>{new Date(allocation.due_date || allocation.dueDate).toLocaleDateString()}</TableCell>
                                  <TableCell>
                                    <Chip 
                                      label={allocation.status} 
                                      color={allocation.status === 'paid' ? 'success' : allocation.status === 'partial' ? 'info' : 'warning'} 
                                      size="small"
                                      sx={{ fontWeight: 'medium' }}
                                    />
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                                  <Typography variant="body2" color="text.secondary">No fee allocations found</Typography>
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Card>
                  </Box>
                  
                  <Box mt={3}>
                    <Card elevation={2} sx={{ p: 2 }}>
                      <Box display="flex" alignItems="center" mb={2}>
                        <PaymentIcon color="success" sx={{ mr: 1 }} />
                        <Typography variant="h6" color="success.main">Payment History</Typography>
                      </Box>
                      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        <Table size="small">
                          <TableHead>
                            <TableRow sx={{ bgcolor: 'grey.50' }}>
                              <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                              <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                              <TableCell sx={{ fontWeight: 'bold' }}>Payment Method</TableCell>
                              <TableCell sx={{ fontWeight: 'bold' }}>Reference</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {(studentDetails.fee_payments || studentDetails.feePayments)?.length > 0 ? (
                              (studentDetails.fee_payments || studentDetails.feePayments).map((payment) => (
                                <TableRow key={payment.id} hover>
                                  <TableCell>{new Date(payment.payment_date || payment.paymentDate).toLocaleDateString()}</TableCell>
                                  <TableCell>
                                    <Typography variant="body2" fontWeight="medium" color="success.main">
                                      UGX {payment.amount?.toLocaleString()}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Chip label={payment.payment_method || payment.paymentMethod} size="small" variant="outlined" />
                                  </TableCell>
                                  <TableCell>{payment.reference || payment.remarks || 'N/A'}</TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                                  <Typography variant="body2" color="text.secondary">No payments found</Typography>
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Card>
                  </Box>
                </>
              ) : (
                <>
                  <Box mt={3}>
                    <Skeleton variant="text" width={150} height={24} sx={{ mb: 2 }} />
                    <TableContainer component={Paper} elevation={0}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            {['Fee Type', 'Amount', 'Due Date', 'Status'].map((header, i) => (
                              <TableCell key={i}>
                                <Skeleton variant="text" width={80} height={16} />
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {[...Array(3)].map((_, i) => (
                            <TableRow key={i}>
                              <TableCell><Skeleton variant="text" width={100} height={16} /></TableCell>
                              <TableCell><Skeleton variant="text" width={80} height={16} /></TableCell>
                              <TableCell><Skeleton variant="text" width={80} height={16} /></TableCell>
                              <TableCell><Skeleton variant="rectangular" width={60} height={20} sx={{ borderRadius: 3 }} /></TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                  
                  <Box mt={3}>
                    <Skeleton variant="text" width={150} height={24} sx={{ mb: 2 }} />
                    <TableContainer component={Paper} elevation={0}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            {['Date', 'Amount', 'Payment Method', 'Reference'].map((header, i) => (
                              <TableCell key={i}>
                                <Skeleton variant="text" width={80} height={16} />
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {[...Array(3)].map((_, i) => (
                            <TableRow key={i}>
                              <TableCell><Skeleton variant="text" width={80} height={16} /></TableCell>
                              <TableCell><Skeleton variant="text" width={80} height={16} /></TableCell>
                              <TableCell><Skeleton variant="text" width={100} height={16} /></TableCell>
                              <TableCell><Skeleton variant="text" width={60} height={16} /></TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => {setViewingStudent(null); setStudentDetails(null);}} fullWidth={isMobile}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" display="flex" alignItems="center">
              <PeopleIcon color="primary" sx={{ mr: 1 }} />
              Students List
            </Typography>
          </Box>
          
          {isMobile ? (
            // Mobile Card Layout
            <Box>
              {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                <Card key={student.id} sx={{ mb: 2, border: '1px solid', borderColor: 'divider' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold" color="primary">
                          {student.first_name} {student.last_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {student.registration_no || student.lin}
                        </Typography>
                      </Box>
                      <Chip 
                        label={student.active ? 'Active' : 'Inactive'} 
                        color={student.active ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                    
                    <Grid container spacing={1} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Class</Typography>
                        <Typography variant="body2">{student.class_name || student.school_class?.name || 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Gender</Typography>
                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                          {student.gender}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">Guardian</Typography>
                        <Typography variant="body2">{student.guardian_name}</Typography>
                      </Grid>
                    </Grid>
                    
                    <Divider sx={{ my: 1 }} />
                    
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => handleView(student)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Student">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEdit(student)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Collect Fees">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleCollectFees(student)}
                        >
                          <PaymentIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </CardContent>
                </Card>
              )) : (
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No students found
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Box>
          ) : (
            // Desktop Table Layout
            <TableContainer component={Paper} elevation={0} sx={{ overflowX: 'auto' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ minWidth: 120 }}>Register No</TableCell>
                    <TableCell sx={{ minWidth: 150 }}>Name</TableCell>
                    <TableCell sx={{ minWidth: 80 }}>Class</TableCell>
                    {!isTablet && <TableCell sx={{ minWidth: 80 }}>Gender</TableCell>}
                    <TableCell sx={{ minWidth: 150 }}>Guardian</TableCell>
                    <TableCell sx={{ minWidth: 80 }}>Status</TableCell>
                    <TableCell sx={{ minWidth: 150, width: 150 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                    <TableRow key={student.id} hover>
                      <TableCell>
                        <Typography variant="body2" color="primary" fontWeight="medium">
                          {student.registration_no || student.lin}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {student.first_name} {student.last_name}
                          </Typography>
                          {isTablet && (
                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                              {student.gender}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={student.class_name || student.school_class?.name || 'N/A'} size="small" variant="outlined" />
                      </TableCell>
                      {!isTablet && (
                        <TableCell>
                          <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                            {student.gender}
                          </Typography>
                        </TableCell>
                      )}
                      <TableCell>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {student.guardian_name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={student.active ? 'Active' : 'Inactive'} 
                          color={student.active ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={0.5}>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              color="info"
                              onClick={() => handleView(student)}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Student">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEdit(student)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Collect Fees">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleCollectFees(student)}
                            >
                              <PaymentIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={isTablet ? 6 : 7} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                          No students found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          
          {pagination.last_page > 1 && (
            <Box 
              display="flex" 
              flexDirection={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between" 
              alignItems={{ xs: 'center', sm: 'center' }}
              gap={2}
              mt={3}
            >
              <Typography variant="body2" color="text.secondary" textAlign={{ xs: 'center', sm: 'left' }}>
                Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of {pagination.total} entries
              </Typography>
              <Pagination
                count={pagination.last_page}
                page={pagination.current_page}
                onChange={(event, page) => handlePageChange(page)}
                color="primary"
                size={isMobile ? "small" : "medium"}
                siblingCount={isMobile ? 0 : 1}
                boundaryCount={isMobile ? 1 : 2}
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Students;