import React, { useState, useEffect } from 'react';
import { studentAPI, feeAPI } from '../services/api';

const BulkCollection = () => {
  const [students, setStudents] = useState([]);
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [classFilter, setClassFilter] = useState('');

  useEffect(() => {
    fetchStudents();
  }, [classFilter]);

  const fetchStudents = async () => {
    try {
      const response = await studentAPI.getAll();
      let filteredStudents = response.data;
      if (classFilter) {
        filteredStudents = filteredStudents.filter(s => s.class === classFilter);
      }
      setStudents(filteredStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handlePaymentSelect = (studentId, allocationId, amount) => {
    const paymentKey = `${studentId}-${allocationId}`;
    const existingIndex = selectedPayments.findIndex(p => `${p.student_id}-${p.allocation_id}` === paymentKey);
    
    if (existingIndex >= 0) {
      setSelectedPayments(selectedPayments.filter((_, index) => index !== existingIndex));
    } else {
      setSelectedPayments([...selectedPayments, {
        student_id: studentId,
        allocation_id: allocationId,
        amount: amount
      }]);
    }
  };

  const processBulkPayment = async () => {
    if (selectedPayments.length === 0) {
      alert('Please select at least one payment');
      return;
    }

    try {
      const paymentData = {
        payments: selectedPayments,
        payment_method: paymentMethod,
        payment_date: paymentDate
      };
      
      // Process each payment individually since we don't have bulk endpoint
      for (const payment of selectedPayments) {
        await feeAPI.createPayment({
          student_id: payment.student_id,
          fee_allocation_id: payment.allocation_id,
          amount: payment.amount,
          payment_method: paymentMethod,
          payment_date: paymentDate,
          remarks: 'Bulk payment'
        });
      }
      
      alert('Bulk payments processed successfully');
      setSelectedPayments([]);
      fetchStudents();
    } catch (error) {
      console.error('Error processing bulk payment:', error);
      alert('Error processing payments');
    }
  };

  const getTotalAmount = () => {
    return selectedPayments.reduce((total, payment) => total + parseFloat(payment.amount), 0);
  };

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="row">
            <div className="col-12 col-xl-8 mb-4 mb-xl-0">
              <h3 className="font-weight-bold">Bulk Fee Collection</h3>
              <h6 className="font-weight-normal mb-0">Collect fees from multiple students</h6>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Filter by Class</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter class"
                      value={classFilter}
                      onChange={(e) => setClassFilter(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Payment Method</label>
                    <select
                      className="form-control"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="cash">Cash</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="cheque">Cheque</option>
                      <option value="online">Online</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Payment Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>&nbsp;</label>
                    <button
                      className="btn btn-success btn-block"
                      onClick={processBulkPayment}
                      disabled={selectedPayments.length === 0}
                    >
                      Process Payments (UGX {getTotalAmount()?.toLocaleString()})
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <p className="card-title mb-0">Students with Pending Fees</p>
              <div className="table-responsive">
                <table className="table table-striped table-borderless">
                  <thead>
                    <tr>
                      <th>Select</th>
                      <th>Student</th>
                      <th>Class</th>
                      <th>Fee Type</th>
                      <th>Amount Due</th>
                      <th>Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => 
                      student.fee_allocations?.filter(a => a.status !== 'paid').map((allocation) => (
                        <tr key={`${student.id}-${allocation.id}`}>
                          <td>
                            <input
                              type="checkbox"
                              onChange={() => handlePaymentSelect(student.id, allocation.id, allocation.amount)}
                              checked={selectedPayments.some(p => p.student_id === student.id && p.allocation_id === allocation.id)}
                            />
                          </td>
                          <td>{student.first_name} {student.last_name}</td>
                          <td>{student.class}</td>
                          <td>{allocation.fee_group?.fee_type?.name}</td>
                          <td>UGX {allocation.amount?.toLocaleString()}</td>
                          <td>{new Date(allocation.due_date).toLocaleDateString()}</td>
                        </tr>
                      ))
                    )}
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

export default BulkCollection;