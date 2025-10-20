import React, { useState, useEffect } from 'react';
import { feeAPI, studentAPI } from '../services/api';
import { FeeAllocateSkeleton } from './skeletons';

const FeeAllocate = () => {
  const [students, setStudents] = useState([]);
  const [feeGroups, setFeeGroups] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ student_id: '', fee_group_id: '' });

  useEffect(() => {
    fetchStudents();
    fetchFeeGroups();
    fetchAllocations();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await studentAPI.getAll();
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchFeeGroups = async () => {
    try {
      const response = await feeAPI.getGroups();
      setFeeGroups(response.data);
    } catch (error) {
      console.error('Error fetching fee groups:', error);
    }
  };

  const fetchAllocations = async () => {
    try {
      const response = await feeAPI.getAllocations();
      setAllocations(response.data);
    } catch (error) {
      console.error('Error fetching allocations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <FeeAllocateSkeleton />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await feeAPI.createAllocation(formData);
      fetchAllocations();
      setFormData({ student_id: '', fee_group_id: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating allocation:', error);
    }
  };

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="row">
            <div className="col-12 col-xl-8 mb-4 mb-xl-0">
              <h3 className="font-weight-bold">Allocate Fees</h3>
              <h6 className="font-weight-normal mb-0">Assign fees to students</h6>
            </div>
            <div className="col-12 col-xl-4">
              <div className="justify-content-end d-flex">
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                  {showForm ? 'Cancel' : 'Allocate Fee'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="row">
          <div className="col-md-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Allocate Fee to Student</h4>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Student</label>
                        <select
                          className="form-control"
                          value={formData.student_id}
                          onChange={(e) => setFormData({...formData, student_id: e.target.value})}
                          required
                        >
                          <option value="">Select Student</option>
                          {students.map((student) => (
                            <option key={student.id} value={student.id}>
                              {student.register_no} - {student.first_name} {student.last_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Fee Group</label>
                        <select
                          className="form-control"
                          value={formData.fee_group_id}
                          onChange={(e) => setFormData({...formData, fee_group_id: e.target.value})}
                          required
                        >
                          <option value="">Select Fee Group</option>
                          {feeGroups.map((group) => (
                            <option key={group.id} value={group.id}>
                              {group.name} - {group.class} (UGX {group.amount?.toLocaleString()})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary mr-2">Allocate</button>
                  <button type="button" className="btn btn-light" onClick={() => setShowForm(false)}>Cancel</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <p className="card-title mb-0">Fee Allocations</p>
              <div className="table-responsive">
                <table className="table table-striped table-borderless">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Fee Group</th>
                      <th>Amount</th>
                      <th>Due Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allocations.map((allocation) => (
                      <tr key={allocation.id}>
                        <td>{allocation.student?.first_name} {allocation.student?.last_name}</td>
                        <td>{allocation.fee_group?.name}</td>
                        <td>UGX {allocation.amount?.toLocaleString()}</td>
                        <td>{new Date(allocation.due_date).toLocaleDateString()}</td>
                        <td>
                          <div className={`badge badge-outline-${allocation.status === 'paid' ? 'success' : allocation.status === 'partial' ? 'warning' : 'danger'}`}>
                            {allocation.status}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeAllocate;