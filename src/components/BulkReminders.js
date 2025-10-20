import React, { useState, useEffect } from 'react';
import { communicationAPI, studentAPI } from '../services/api';
import { BulkRemindersSkeleton } from './skeletons';

const BulkReminders = () => {
  const [formData, setFormData] = useState({
    class: '',
    section: '',
    message_type: 'due_reminder',
    custom_message: ''
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    fetchStudentOptions();
  }, []);

  const fetchStudentOptions = async () => {
    try {
      const response = await studentAPI.getAll();
      const students = response.data;
      
      const uniqueClasses = [...new Set(students.map(s => s.class).filter(Boolean))];
      const uniqueSections = [...new Set(students.map(s => s.section).filter(Boolean))];
      
      setClasses(uniqueClasses.sort());
      setSections(uniqueSections.sort());
    } catch (error) {
      console.error('Error fetching student options:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  if (initialLoading) {
    return <BulkRemindersSkeleton />;
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await communicationAPI.sendBulkReminders(formData);
      setMessage(response.data.message || 'Bulk reminders sent successfully!');
      setFormData({
        class: '',
        section: '',
        message_type: 'due_reminder',
        custom_message: ''
      });
    } catch (error) {
      setMessage('Error sending bulk reminders: ' + (error.response?.data?.message || 'Please try again'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="row">
            <div className="col-12 col-xl-8 mb-4 mb-xl-0">
              <h3 className="font-weight-bold">Bulk Reminders</h3>
              <h6 className="font-weight-normal mb-0">Send fee reminders to multiple students at once</h6>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Send Bulk Fee Reminders</h4>
              
              {message && (
                <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="class">Class (Optional)</label>
                  <select
                    className="form-control"
                    id="class"
                    name="class"
                    value={formData.class}
                    onChange={handleInputChange}
                  >
                    <option value="">All Classes</option>
                    {classes.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                  <small className="form-text text-muted">Leave empty to send to all classes</small>
                </div>

                <div className="form-group">
                  <label htmlFor="section">Section (Optional)</label>
                  <select
                    className="form-control"
                    id="section"
                    name="section"
                    value={formData.section}
                    onChange={handleInputChange}
                  >
                    <option value="">All Sections</option>
                    {sections.map(sec => (
                      <option key={sec} value={sec}>{sec}</option>
                    ))}
                  </select>
                  <small className="form-text text-muted">Leave empty to send to all sections</small>
                </div>

                <div className="form-group">
                  <label htmlFor="message_type">Message Type</label>
                  <select
                    className="form-control"
                    id="message_type"
                    name="message_type"
                    value={formData.message_type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="due_reminder">Due Reminder</option>
                    <option value="overdue_notice">Overdue Notice</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="custom_message">Custom Message (Optional)</label>
                  <textarea
                    className="form-control"
                    id="custom_message"
                    name="custom_message"
                    rows="4"
                    value={formData.custom_message}
                    onChange={handleInputChange}
                    placeholder="Add any additional message..."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary mr-2"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Bulk Reminders'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-light"
                  onClick={() => setFormData({
                    class: '',
                    section: '',
                    message_type: 'due_reminder',
                    custom_message: ''
                  })}
                >
                  Clear
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-4 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Instructions</h4>
              <div className="template-demo">
                <div className="alert alert-info">
                  <h6>How it works:</h6>
                  <ul className="mb-0">
                    <li>Select class and section (optional)</li>
                    <li>Choose message type</li>
                    <li>Add custom message if needed</li>
                    <li>Click send to email all guardians</li>
                  </ul>
                </div>
                <div className="alert alert-warning">
                  <h6>Note:</h6>
                  <p className="mb-0">Only students with outstanding fees and valid guardian emails will receive reminders.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkReminders;