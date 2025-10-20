import React, { useState, useEffect } from 'react';
import { communicationAPI } from '../services/api';
import { EmailLogsSkeleton } from './skeletons';

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
    return <EmailLogsSkeleton />;
  }

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="row">
            <div className="col-12 col-xl-8 mb-4 mb-xl-0">
              <h3 className="font-weight-bold">Email Logs</h3>
              <h6 className="font-weight-normal mb-0">Track all sent emails and their delivery status</h6>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <p className="card-title">Email History</p>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Recipient</th>
                      <th>Subject</th>
                      <th>Type</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emailLogs.map((log) => (
                      <tr key={log.id}>
                        <td>{new Date(log.sent_at || log.created_at).toLocaleDateString()}</td>
                        <td>
                          <div>
                            <strong>{log.recipient_name}</strong>
                            <br />
                            <small className="text-muted">{log.recipient_email}</small>
                          </div>
                        </td>
                        <td>{log.subject}</td>
                        <td>
                          <span className="badge badge-info">
                            {log.email_type?.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${log.status === 'sent' ? 'badge-success' : 'badge-danger'}`}>
                            {log.status?.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {emailLogs.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-muted">No email logs found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailLogs;