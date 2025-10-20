import React, { useState, useEffect } from 'react';
import { feeAPI, accountingAPI } from '../services/api';
import { DashboardSkeleton } from './Skeleton';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    totalCollected: 0,
    totalDue: 0,
    overdueCount: 0,
    recentPayments: [],
    monthlyCollection: []
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchTransactions();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await feeAPI.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await accountingAPI.getTransactions();
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="row">
            <div className="col-12 col-xl-8 mb-4 mb-xl-0">
              <h3 className="font-weight-bold">Welcome to Muko High School</h3>
              <h6 className="font-weight-normal mb-0">
                All systems are running smoothly! You have{' '}
                <span className="text-primary">{dashboardData.overdueCount} overdue fees</span>
              </h6>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 grid-margin stretch-card">
          <div className="card tale-bg">
            <div className="card-people">
              <div className="weather-info">
                <div className="d-flex">
                  <div>
                    <h2 className="mb-0 font-weight-normal">
                      <i className="icon-sun mr-2"></i>{dashboardData.totalStudents}
                    </h2>
                  </div>
                  <div className="ml-2">
                    <h4 className="location font-weight-normal">Total Students</h4>
                    <h6 className="font-weight-normal">Active Students</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-6 grid-margin transparent">
          <div className="row">
            <div className="col-md-6 mb-4 stretch-card transparent">
              <div className="card card-tale">
                <div className="card-body">
                  <p className="mb-4">Total Collected</p>
                  <p className="fs-20 mb-2">UGX {dashboardData.totalCollected?.toLocaleString()}</p>
                  <p>This Year</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4 stretch-card transparent">
              <div className="card card-dark-blue">
                <div className="card-body">
                  <p className="mb-4">Total Due</p>
                  <p className="fs-20 mb-2">UGX {dashboardData.totalDue?.toLocaleString()}</p>
                  <p>Outstanding</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-6 mb-4 mb-lg-0 stretch-card transparent">
              <div className="card card-light-blue">
                <div className="card-body">
                  <p className="mb-4">Overdue Fees</p>
                  <p className="fs-20 mb-2">{dashboardData.overdueCount}</p>
                  <p>Students</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 stretch-card transparent">
              <div className="card card-light-danger">
                <div className="card-body">
                  <p className="mb-4">Collection Rate</p>
                  <p className="fs-20 mb-2">
                    {(dashboardData.totalCollected + dashboardData.totalDue) > 0 
                      ? Math.round((dashboardData.totalCollected / (dashboardData.totalCollected + dashboardData.totalDue)) * 100)
                      : 0}%
                  </p>
                  <p>This Year</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Monthly Summary</h4>
              <div className="row">
                <div className="col-6">
                  <h3 className="text-success">UGX {dashboardData.totalCollected?.toLocaleString()}</h3>
                  <p className="text-muted">Monthly Income</p>
                </div>
                <div className="col-6">
                  <h3 className="text-danger">UGX {transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + parseFloat(t.amount || 0), 0).toLocaleString()}</h3>
                  <p className="text-muted">Monthly Expenses</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-6 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Income vs Expenses</h4>
              <div style={{height: '200px', display: 'flex', alignItems: 'end', justifyContent: 'space-around', padding: '20px'}}>
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => {
                  const monthPayments = dashboardData.recentPayments.filter(p => new Date(p.payment_date).getMonth() === index);
                  const monthTransactions = transactions.filter(t => new Date(t.date).getMonth() === index);
                  const income = monthPayments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
                  const expenses = monthTransactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
                  const maxAmount = Math.max(dashboardData.totalCollected || 0, ...transactions.map(t => parseFloat(t.amount || 0)), 100000);
                  const incomeHeight = (income / maxAmount) * 120 + 10;
                  const expenseHeight = (expenses / maxAmount) * 120 + 10;
                  return (
                    <div key={month} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                      <div style={{display: 'flex', alignItems: 'end', gap: '2px'}}>
                        <div 
                          style={{
                            width: '12px',
                            height: `${incomeHeight}px`,
                            backgroundColor: '#28a745',
                            borderRadius: '2px'
                          }}
                          title={`Income: UGX ${income.toLocaleString()}`}
                        ></div>
                        <div 
                          style={{
                            width: '12px',
                            height: `${expenseHeight}px`,
                            backgroundColor: '#dc3545',
                            borderRadius: '2px'
                          }}
                          title={`Expenses: UGX ${expenses.toLocaleString()}`}
                        ></div>
                      </div>
                      <small style={{fontSize: '10px', marginTop: '5px'}}>{month.slice(0,3)}</small>
                    </div>
                  );
                })}
              </div>
              <div className="d-flex justify-content-center mt-2">
                <div className="d-flex align-items-center mr-3">
                  <div style={{width: '12px', height: '12px', backgroundColor: '#28a745', marginRight: '5px'}}></div>
                  <small>Income</small>
                </div>
                <div className="d-flex align-items-center">
                  <div style={{width: '12px', height: '12px', backgroundColor: '#dc3545', marginRight: '5px'}}></div>
                  <small>Expenses</small>
                </div>
              </div>
              <div className="mt-3">
                <h5>Recent Payments</h5>
                {dashboardData.recentPayments.slice(0, 3).map((payment) => (
                  <div key={payment.id} className="d-flex justify-content-between mb-2">
                    <span>{payment.student?.first_name} {payment.student?.last_name}</span>
                    <span className="text-success">UGX {payment.amount?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <p className="card-title">All Transactions</p>
              <div className="table-responsive">
                <table className="table table-striped table-borderless">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Voucher Head</th>
                      <th>Account</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td>{new Date(transaction.date).toLocaleDateString()}</td>
                        <td>{transaction.voucher_head?.name}</td>
                        <td>{transaction.account?.name}</td>
                        <td>
                          <div className={`badge badge-outline-${transaction.type === 'credit' ? 'success' : 'danger'}`}>
                            {transaction.type}
                          </div>
                        </td>
                        <td>UGX {transaction.amount?.toLocaleString()}</td>
                        <td>{transaction.description}</td>
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

export default Dashboard;