import React, { useState, useEffect } from 'react';
import { feeAPI, studentAPI } from '../services/api';
import { ReportsSkeleton } from './skeletons';

const Reports = () => {
  const [reportType, setReportType] = useState('due');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    class: '',
    dateFrom: '',
    dateTo: ''
  });

  if (loading) {
    return <ReportsSkeleton />;
  }

  const generateReport = async () => {
    setLoading(true);
    try {
      let data = [];
      
      if (reportType === 'due') {
        const allocations = await feeAPI.getAllocations();
        data = allocations.data.filter(a => a.status !== 'paid');
      } else if (reportType === 'payment-history') {
        const payments = await feeAPI.getPayments();
        data = payments.data;
      } else if (reportType === 'class-wise') {
        const students = await studentAPI.getAll();
        const studentsByClass = {};
        students.data.forEach(student => {
          if (!studentsByClass[student.class]) {
            studentsByClass[student.class] = {
              class: student.class,
              totalStudents: 0,
              totalDue: 0,
              totalPaid: 0
            };
          }
          studentsByClass[student.class].totalStudents++;
          
          student.fee_allocations?.forEach(allocation => {
            studentsByClass[student.class].totalDue += parseFloat(allocation.amount);
          });
          
          student.fee_payments?.forEach(payment => {
            studentsByClass[student.class].totalPaid += parseFloat(payment.amount);
          });
        });
        data = Object.values(studentsByClass);
      }
      
      setReportData(data);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderDueReport = () => (
    <table className="table table-striped table-borderless">
      <thead>
        <tr>
          <th>Student</th>
          <th>Class</th>
          <th>Fee Type</th>
          <th>Amount Due</th>
          <th>Due Date</th>
          <th>Days Overdue</th>
        </tr>
      </thead>
      <tbody>
        {reportData.map((allocation) => {
          const daysOverdue = Math.max(0, Math.floor((new Date() - new Date(allocation.due_date)) / (1000 * 60 * 60 * 24)));
          return (
            <tr key={allocation.id}>
              <td>{allocation.student?.first_name} {allocation.student?.last_name}</td>
              <td>{allocation.student?.class}</td>
              <td>{allocation.fee_group?.fee_type?.name}</td>
              <td>UGX {allocation.amount?.toLocaleString()}</td>
              <td>{new Date(allocation.due_date).toLocaleDateString()}</td>
              <td>
                <span className={`badge ${daysOverdue > 0 ? 'badge-danger' : 'badge-success'}`}>
                  {daysOverdue > 0 ? `${daysOverdue} days` : 'Not due'}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  const renderPaymentReport = () => (
    <table className="table table-striped table-borderless">
      <thead>
        <tr>
          <th>Student</th>
          <th>Fee Type</th>
          <th>Amount</th>
          <th>Payment Method</th>
          <th>Payment Date</th>
          <th>Collected By</th>
        </tr>
      </thead>
      <tbody>
        {reportData.map((payment) => (
          <tr key={payment.id}>
            <td>{payment.student?.first_name} {payment.student?.last_name}</td>
            <td>{payment.fee_allocation?.fee_group?.fee_type?.name}</td>
            <td>UGX {payment.amount?.toLocaleString()}</td>
            <td>{payment.payment_method}</td>
            <td>{new Date(payment.payment_date).toLocaleDateString()}</td>
            <td>{payment.collected_by?.name || 'System'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderClassWiseReport = () => (
    <table className="table table-striped table-borderless">
      <thead>
        <tr>
          <th>Class</th>
          <th>Total Students</th>
          <th>Total Due</th>
          <th>Total Paid</th>
          <th>Collection Rate</th>
        </tr>
      </thead>
      <tbody>
        {reportData.map((classData) => {
          const collectionRate = classData.totalDue > 0 ? ((classData.totalPaid / classData.totalDue) * 100).toFixed(2) : 0;
          return (
            <tr key={classData.class}>
              <td>{classData.class}</td>
              <td>{classData.totalStudents}</td>
              <td>UGX {classData.totalDue?.toLocaleString()}</td>
              <td>UGX {classData.totalPaid?.toLocaleString()}</td>
              <td>
                <span className={`badge ${collectionRate > 80 ? 'badge-success' : collectionRate > 50 ? 'badge-warning' : 'badge-danger'}`}>
                  {collectionRate}%
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="row">
            <div className="col-12 col-xl-8 mb-4 mb-xl-0">
              <h3 className="font-weight-bold">Fee Reports</h3>
              <h6 className="font-weight-normal mb-0">Generate various fee-related reports</h6>
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
                    <label>Report Type</label>
                    <select
                      className="form-control"
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                    >
                      <option value="due">Due Fees Report</option>
                      <option value="payment-history">Payment History</option>
                      <option value="class-wise">Class-wise Collection</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label>Class Filter</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Class"
                      value={filters.class}
                      onChange={(e) => setFilters({...filters, class: e.target.value})}
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label>From Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={filters.dateFrom}
                      onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label>To Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={filters.dateTo}
                      onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>&nbsp;</label>
                    <button
                      className="btn btn-primary btn-block"
                      onClick={generateReport}
                      disabled={loading}
                    >
                      {loading ? 'Generating...' : 'Generate Report'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {reportData.length > 0 && (
        <div className="row">
          <div className="col-md-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <p className="card-title mb-0">
                  {reportType === 'due' && 'Due Fees Report'}
                  {reportType === 'payment-history' && 'Payment History Report'}
                  {reportType === 'class-wise' && 'Class-wise Collection Report'}
                </p>
                <div className="table-responsive">
                  {reportType === 'due' && renderDueReport()}
                  {reportType === 'payment-history' && renderPaymentReport()}
                  {reportType === 'class-wise' && renderClassWiseReport()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;