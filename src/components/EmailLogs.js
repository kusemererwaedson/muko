import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip,
  Skeleton
} from '@mui/material';
import { communicationAPI } from '../services/api';


const EmailLogs = () => {
  const [emailLogs, setEmailLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmailLogs();
  }, []);

  const fetchEmailLogs = async () => {
    try {
      const response = await communicationAPI.getEmailLogs();
      setEmailLogs(response.data);
    } catch (error) {
      console.error('Error fetching email logs:', error);
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

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>Email Logs</Typography>
        <Typography variant="body1" color="text.secondary">
          Track all sent emails and their delivery status
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Email History</Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Recipient</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {emailLogs.map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell>{new Date(log.sent_at || log.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">{log.recipient_name}</Typography>
                        <Typography variant="caption" color="text.secondary">{log.recipient_email}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{log.subject}</TableCell>
                    <TableCell>
                      <Chip 
                        label={log.email_type?.replace('_', ' ').toUpperCase()} 
                        color="info" 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={log.status?.toUpperCase()}
                        color={log.status === 'sent' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {emailLogs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No email logs found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EmailLogs;
