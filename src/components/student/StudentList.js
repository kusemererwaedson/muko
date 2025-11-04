import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, IconButton, Pagination,
  Skeleton
} from '@mui/material';
import { Add as AddIcon, Visibility as VisibilityIcon, Payment as PaymentIcon } from '@mui/icons-material';
import { studentAPI } from '../services/api';


function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async (page = 1) => {
    try {
      setLoading(true);
      const response = await studentAPI.getAll({ page, per_page: 10 });
      
      if (response.data.data) {
        setStudents(response.data.data);
        setPagination({
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          per_page: response.data.per_page,
          total: response.data.total
        });
      } else {
        setStudents(response.data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    fetchStudents(page);
  };

  if (loading) return (
    <Box p={3}>
      <Skeleton variant="text" width={200} height={30} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={400} />
    </Box>
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" gutterBottom>Students</Typography>
          <Typography variant="body1" color="text.secondary">Manage student records</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />}>Add New Student</Button>
      </Box>

      <Card>
        <CardContent>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Register No</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Class</TableCell>
                  <TableCell>Guardian</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.length > 0 ? students.map(student => (
                  <TableRow key={student.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">{student.registration_no || student.lin}</Typography>
                    </TableCell>
                    <TableCell>{student.full_name}</TableCell>
                    <TableCell>{student.class_name || student.school_class?.name || 'N/A'}</TableCell>
                    <TableCell>{student.guardian_name}</TableCell>
                    <TableCell>{student.guardian_phone}</TableCell>
                    <TableCell>
                      <Chip 
                        label={student.active ? 'Active' : 'Inactive'}
                        color={student.active ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" color="info" sx={{ mr: 1 }}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="success">
                        <PaymentIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">No students found</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          {pagination.last_page > 1 && (
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
              <Typography variant="body2" color="text.secondary">
                Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of {pagination.total} entries
              </Typography>
              <Pagination
                count={pagination.last_page}
                page={pagination.current_page}
                onChange={(event, page) => handlePageChange(page)}
                color="primary"
                size="small"
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default StudentList;