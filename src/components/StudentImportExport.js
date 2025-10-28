import React, { useState } from 'react';
import {
  Box, Button, ButtonGroup, Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Grid, Card, CardContent, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, CircularProgress
} from '@mui/material';
import {
  CloudDownload, CloudUpload, Description, Sync, Check, Error
} from '@mui/icons-material';
import { studentAPI } from '../services/api';

const StudentImportExport = ({ onImportComplete, className = '' }) => {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importResults, setImportResults] = useState(null);

  const handleExport = async (format = 'csv') => {
    setExporting(true);
    try {
      const response = await studentAPI.exportExcel(format);
      const contentType = format === 'excel' 
        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        : 'text/csv';
      const extension = format === 'excel' ? 'xlsx' : 'csv';
      
      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `students_${new Date().toISOString().split('T')[0]}.${extension}`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed: ' + error.message);
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImporting(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await studentAPI.importExcel(formData);
      const results = response.data || {
        success_count: 0,
        error_count: 1,
        errors: [{ row: 'N/A', lin: 'N/A', message: 'No response data' }]
      };
      setImportResults(results);
    } catch (error) {
      console.error('Import error:', error);
      const errorMessage = error.response?.data?.message || error.message;
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
    try {
      const response = await studentAPI.downloadTemplate();
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `student_template_${new Date().toISOString().split('T')[0]}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Template download error:', error);
      alert('Template download failed: ' + error.message);
    }
  };

  const handleSync = async () => {
    if (onImportComplete) onImportComplete();
  };

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <ButtonGroup size="small">
        <Button
          variant="outlined"
          color="success"
          startIcon={exporting ? <CircularProgress size={16} /> : <CloudDownload />}
          onClick={() => handleExport('csv')}
          disabled={exporting}
        >
          {exporting ? 'Exporting...' : 'CSV'}
        </Button>
        <Button
          variant="outlined"
          color="success"
          startIcon={<CloudDownload />}
          onClick={() => handleExport('excel')}
          disabled={exporting}
        >
          Excel
        </Button>
      </ButtonGroup>
      
      <Button
        size="small"
        variant="outlined"
        color="info"
        startIcon={<Description />}
        onClick={downloadTemplate}
      >
        Template
      </Button>
      
      <Button
        size="small"
        variant="outlined"
        color="primary"
        component="label"
        startIcon={importing ? <CircularProgress size={16} /> : <CloudUpload />}
        disabled={importing}
      >
        {importing ? 'Importing...' : 'Import'}
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleImport}
          disabled={importing}
          hidden
        />
      </Button>
      


      <Dialog open={!!importResults} onClose={() => {
        setImportResults(null);
        if (onImportComplete) onImportComplete();
      }} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            {importResults?.error_count > 0 ? <Error color="warning" sx={{ mr: 1 }} /> : <Check color="success" sx={{ mr: 1 }} />}
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
                    <Typography variant="body2">Imported</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card sx={{ bgcolor: 'error.light', color: 'error.contrastText' }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                  <Error sx={{ mr: 2, fontSize: 40 }} />
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
                Error Details ({importResults.errors.length})
              </Typography>
              <TableContainer component={Paper} sx={{ maxHeight: 250 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell width={60}>Row</TableCell>
                      <TableCell width={100}>LIN</TableCell>
                      <TableCell>Error</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {importResults.errors.map((error, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Chip label={error.row} color="error" size="small" />
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" color="text.secondary">
                            {error.lin || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{error.message}</Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setImportResults(null);
            if (onImportComplete) onImportComplete();
          }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentImportExport;