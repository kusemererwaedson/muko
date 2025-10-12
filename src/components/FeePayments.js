import React, { useState, useEffect } from 'react';
import { feeAPI, studentAPI } from '../services/api';

const FeePayments = () => {
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    student_id: '', fee_allocation_id: '', amount: '', payment_method: 'cash',
    payment_date: new Date().toISOString().split('T')[0], remarks: ''
  });

  useEffect(() => {
    fetchPayments();
    fetchStudents();
    fetchAllocations();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await feeAPI.getPayments();
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await studentAPI.getAll();
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchAllocations = async () => {
    try {
      const response = await feeAPI.getAllocations();
      setAllocations(response.data.filter(a => a.status !== 'paid'));
    } catch (error) {
      console.error('Error fetching allocations:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.student_id || !formData.fee_allocation_id || !formData.amount || !formData.payment_date) {
      alert('Please fill in all required fields.');
      return;
    }
    
    if (parseFloat(formData.amount) <= 0) {
      alert('Amount must be greater than 0.');
      return;
    }
    
    try {
      await feeAPI.createPayment(formData);
      fetchPayments();
      fetchAllocations();
      setFormData({
        student_id: '', fee_allocation_id: '', amount: '', payment_method: 'cash',
        payment_date: new Date().toISOString().split('T')[0], remarks: ''
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating payment:', error);
    }
  };

  const getStudentAllocations = () => {
    return allocations.filter(a => a.student_id == formData.student_id);
  };

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="row">
            <div className="col-12 col-xl-8 mb-4 mb-xl-0">
              <h3 className="font-weight-bold">Fee Payments</h3>
              <h6 className="font-weight-normal mb-0">Record fee payments</h6>
            </div>
            <div className="col-12 col-xl-4">
              <div className="justify-content-end d-flex">
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                  {showForm ? 'Cancel' : 'Record Payment'}
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
                <h4 className="card-title">Record Fee Payment</h4>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Student</label>
                        <select
                          className="form-control"
                          value={formData.student_id}
                          onChange={(e) => setFormData({...formData, student_id: e.target.value, fee_allocation_id: ''})}
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
                        <label>Fee Allocation</label>
                        <select
                          className="form-control"
                          value={formData.fee_allocation_id}
                          onChange={(e) => setFormData({...formData, fee_allocation_id: e.target.value})}
                          required
                          disabled={!formData.student_id}
                        >
                          <option value="">Select Fee Allocation</option>
                          {getStudentAllocations().map((allocation) => (
                            <option key={allocation.id} value={allocation.id}>
                              {allocation.fee_group?.name} - UGX {allocation.amount?.toLocaleString()}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>Amount (UGX)</label>
                        <input
                          type="number"
                          className="form-control"
                          value={formData.amount}
                          onChange={(e) => setFormData({...formData, amount: e.target.value})}
                          placeholder="e.g., 500000"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>Payment Method</label>
                        <select
                          className="form-control"
                          value={formData.payment_method}
                          onChange={(e) => setFormData({...formData, payment_method: e.target.value})}
                        >
                          <option value="cash">Cash</option>
                          <option value="bank_transfer">Bank Transfer</option>
                          <option value="cheque">Cheque</option>
                          <option value="online">Online</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>Payment Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={formData.payment_date}
                          onChange={(e) => setFormData({...formData, payment_date: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Remarks</label>
                    <textarea
                      className="form-control"
                      value={formData.remarks}
                      onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                      placeholder="e.g., paid 200,000 ugx"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary mr-2">Record Payment</button>
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
              <p className="card-title mb-0">Payment History</p>
              <div className="table-responsive">
                <table className="table table-striped table-borderless">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Fee Type</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Date</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id}>
                        <td>{payment.student?.first_name} {payment.student?.last_name}</td>
                        <td>{payment.fee_allocation?.fee_group?.fee_type?.name}</td>
                        <td>UGX {payment.amount?.toLocaleString()}</td>
                        <td>
                          <div className="badge badge-outline-success">
                            {payment.payment_method}
                          </div>
                        </td>
                        <td>{new Date(payment.payment_date).toLocaleDateString()}</td>
                        <td>{payment.remarks}</td>
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

export default FeePayments;