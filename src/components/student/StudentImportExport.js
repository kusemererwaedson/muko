// src/components/student/StudentImportExport.js
import React, { useState } from 'react';
import {
  Box, Button, ButtonGroup, Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Grid, Card, CardContent, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, CircularProgress, Alert
} from '@mui/material';
import {
  CloudDownload, CloudUpload, Description, Check, Error as ErrorIcon
} from '@mui/icons-material';
import { studentAPI } from '../../services/api';

const StudentImportExport = ({ onImportComplete, className = '' }) => {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importResults, setImportResults] = useState(null);
  const [error, setError] = useState(null);

  const handleExport = async (format = 'csv') => {
    setExporting(true);
    setError(null);
    
    try {
      const response = await studentAPI.exportExcel(format);
      
      // Check if we got valid data
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      const contentType = format === 'excel' 
        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        : 'text/csv;charset=utf-8;';
      const extension = format === 'excel' ? 'xlsx' : 'csv';
      
      // Create blob from response
      const blob = new Blob([response.data], { type: contentType });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `students_${new Date().toISOString().split('T')[0]}.${extension}`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log(`Successfully exported ${format} file`);
    } catch (error) {
      console.error('Export error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Export failed';
      setError(`Export failed: ${errorMessage}`);
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    const validExtensions = ['.csv', '.xls', '.xlsx'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      setError('Please upload a valid CSV or Excel file (.csv, .xls, .xlsx)');
      event.target.value = '';
      return;
    }

    setImporting(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('Importing file:', file.name, 'Type:', file.type, 'Size:', file.size);
      
      const response = await studentAPI.importExcel(formData);
      
      console.log('Import response:', response.data);
      
      const results = response.data || {
        success_count: 0,
        error_count: 1,
        errors: [{ row: 'N/A', lin: 'N/A', message: 'No response data received from server' }]
      };
      
      setImportResults(results);
      
      // Call parent callback if successful
      if (results.success_count > 0 && onImportComplete) {
        onImportComplete();
      }
    } catch (error) {
      console.error('Import error:', error);
      console.error('Error response:', error.response);
      
      // Try to parse error message
      let errorMessage = 'Import failed';
      
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.errors) {
          // Backend returned structured errors
          setImportResults({
            success_count: error.response.data.success_count || 0,
            error_count: error.response.data.error_count || 1,
            errors: error.response.data.errors
          });
          return;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      const errorResults = {
        success_count: 0,
        error_count: 1,
        errors: [{ row: 'N/A', lin: 'N/A', message: errorMessage }]
      };
      
      setImportResults(errorResults);
    } finally {
      setImporting(false);
      event.target.value = '';
    }
  };

  const downloadTemplate = async () => {
    setError(null);
    
    try {
      console.log('Downloading template...');
      
      const response = await studentAPI.downloadTemplate();
      
      if (!response.data) {
        throw new Error('No template data received from server');
      }
      
      // Create blob from response
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `student_import_template_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('Template downloaded successfully');
    } catch (error) {
      console.error('Template download error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Template download failed';
      setError(`Template download failed: ${errorMessage}`);
    }
  };

  const closeResults = () => {
    setImportResults(null);
    if (importResults?.success_count > 0 && onImportComplete) {
      onImportComplete();
    }
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box display="flex" alignItems="center" gap={1}>
        <ButtonGroup size="small" variant="outlined">
          <Button
            color="success"
            startIcon={exporting ? <CircularProgress size={16} /> : <CloudDownload />}
            onClick={() => handleExport('csv')}
            disabled={exporting || importing}
          >
            {exporting ? 'Exporting...' : 'Export CSV'}
          </Button>
          <Button
            color="success"
            startIcon={exporting ? <CircularProgress size={16} /> : <CloudDownload />}
            onClick={() => handleExport('excel')}
            disabled={exporting || importing}
          >
            {exporting ? 'Exporting...' : 'Export Excel'}
          </Button>
        </ButtonGroup>
        
        <Button
          size="small"
          variant="outlined"
          color="info"
          startIcon={<Description />}
          onClick={downloadTemplate}
          disabled={exporting || importing}
        >
          Download Template
        </Button>
        
        <Button
          size="small"
          variant="outlined"
          color="primary"
          component="label"
          startIcon={importing ? <CircularProgress size={16} /> : <CloudUpload />}
          disabled={importing || exporting}
        >
          {importing ? 'Importing...' : 'Import Students'}
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleImport}
            disabled={importing}
            hidden
          />
        </Button>
      </Box>

      {/* Import Results Dialog */}
      <Dialog 
        open={!!importResults} 
        onClose={closeResults}
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            {importResults?.error_count > 0 ? (
              <ErrorIcon color="warning" sx={{ mr: 1 }} />
            ) : (
              <Check color="success" sx={{ mr: 1 }} />
            )}
            Import Results
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                  <Check sx={{ mr: 2, fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4">{importResults?.success_count || 0}</Typography>
                    <Typography variant="body2">Successfully Imported</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={6}>
              <Card sx={{ bgcolor: 'error.light', color: 'error.contrastText' }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                  <ErrorIcon sx={{ mr: 2, fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4">{importResults?.error_count || 0}</Typography>
                    <Typography variant="body2">Failed</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {importResults?.error_count > 0 && importResults?.errors && (
            <Box>
              <Typography variant="h6" color="error" gutterBottom>
                Error Details ({importResults.errors.length} errors)
              </Typography>
              
              <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell width={80} sx={{ fontWeight: 'bold' }}>Row</TableCell>
                      <TableCell width={120} sx={{ fontWeight: 'bold' }}>LIN</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Error Message</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {importResults.errors.map((error, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Chip 
                            label={error.row} 
                            color="error" 
                            size="small" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {error.lin || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="error">
                            {error.message}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
          
          {importResults?.success_count > 0 && importResults?.error_count === 0 && (
            <Alert severity="success">
              All students were imported successfully! The student list will be refreshed.
            </Alert>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={closeResults} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentImportExport;