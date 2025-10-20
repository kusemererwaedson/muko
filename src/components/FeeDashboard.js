import React, { useState, useEffect } from 'react';
import { feeAPI } from '../services/api';
import { FeeDashboardSkeleton } from './skeletons';

const FeeDashboard = ({ setCurrentPage }) => {
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    totalCollected: 0,
    totalDue: 0,
    overdueCount: 0,
    recentPayments: [],
    monthlyCollection: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
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

  if (loading) {
    return <FeeDashboardSkeleton />;
  }

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="row">
            <div className="col-12 col-xl-8 mb-4 mb-xl-0">
              <h3 className="font-weight-bold">Fee Management Dashboard</h3>
              <h6 className="font-weight-normal mb-0">Comprehensive fee tracking and collection overview</h6>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 col-xl-3 grid-margin stretch-card">
          <div className="card bg-gradient-primary text-white">
            <div className="card-body">
              <p className="mb-2">Total Students</p>
              <h5 className="mb-0">{dashboardData.totalStudents}</h5>
            </div>
          </div>
        </div>
        
        <div className="col-md-6 col-xl-3 grid-margin stretch-card">
          <div className="card bg-gradient-success text-white">
            <div className="card-body">
              <p className="mb-2">Total Collected</p>
              <h5 className="mb-0">UGX {dashboardData.totalCollected?.toLocaleString()}</h5>
            </div>
          </div>
        </div>
        
        <div className="col-md-6 col-xl-3 grid-margin stretch-card">
          <div className="card bg-gradient-warning text-white">
            <div className="card-body">
              <p className="mb-2">Total Due</p>
              <h5 className="mb-0">UGX {dashboardData.totalDue?.toLocaleString()}</h5>
            </div>
          </div>
        </div>
        
        <div className="col-md-6 col-xl-3 grid-margin stretch-card">
          <div className="card bg-gradient-danger text-white">
            <div className="card-body">
              <p className="mb-2">Overdue</p>
              <h5 className="mb-0">{dashboardData.overdueCount}</h5>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                <p className="card-title mb-0">Monthly Collection</p>
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <div style={{width: '20px', height: '3px', backgroundColor: '#4BC0C0', marginRight: '8px'}}></div>
                  <span style={{fontSize: '12px', color: '#666'}}>Collection Amount</span>
                </div>
              </div>
              <div style={{height: '250px', position: 'relative', padding: '20px'}}>
                <svg width="300" height="200" viewBox="0 0 300 200" style={{width: '100%', overflow: 'visible'}}>
                  {/* Grid lines */}
                  {[0, 1, 2, 3, 4].map(i => (
                    <line key={i} x1="0" y1={i * 40} x2="300" y2={i * 40} stroke="#f0f0f0" strokeWidth="1" />
                  ))}
                  
                  {/* Line path */}
                  <polyline
                    fill="none"
                    stroke="#4BC0C0"
                    strokeWidth="3"
                    points={
                      ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                        .map((month, index) => {
                          const monthData = dashboardData.monthlyCollection?.find(m => m.month === index + 1);
                          const amount = monthData ? parseFloat(monthData.total) : 0;
                          const maxAmount = Math.max(...(dashboardData.monthlyCollection?.map(m => parseFloat(m.total)) || [1]));
                          const x = (index / 11) * 300;
                          const y = maxAmount > 0 ? 160 - (amount / maxAmount) * 140 : 160;
                          return `${x},${y}`;
                        })
                        .join(' ')
                    }
                  />
                  
                  {/* Data points */}
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => {
                    const monthData = dashboardData.monthlyCollection?.find(m => m.month === index + 1);
                    const amount = monthData ? parseFloat(monthData.total) : 0;
                    const maxAmount = Math.max(...(dashboardData.monthlyCollection?.map(m => parseFloat(m.total)) || [1]));
                    const x = (index / 11) * 300;
                    const y = maxAmount > 0 ? 160 - (amount / maxAmount) * 140 : 160;
                    return (
                      <circle
                        key={month}
                        cx={x}
                        cy={y}
                        r="4"
                        fill="#4BC0C0"
                        title={`${month}: UGX ${amount.toLocaleString()}`}
                      />
                    );
                  })}
                </svg>
                
                {/* Month labels */}
                <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px'}}>
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
                    <small key={month} style={{fontSize: '11px'}}>{month}</small>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-6 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <p className="card-title">Recent Payments</p>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.recentPayments.map((payment) => (
                      <tr key={payment.id}>
                        <td>{payment.student?.first_name} {payment.student?.last_name}</td>
                        <td>UGX {payment.amount?.toLocaleString()}</td>
                        <td>{new Date(payment.payment_date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Quick Actions</h4>
              <div className="row">
                <div className="col-md-6 mb-2">
                  <button 
                    className="btn btn-primary btn-block"
                    onClick={() => setCurrentPage('fees-bulk-collection')}
                  >
                    <i className="ti-money"></i> Bulk Collection
                  </button>
                </div>
                <div className="col-md-6 mb-2">
                  <button 
                    className="btn btn-info btn-block"
                    onClick={() => setCurrentPage('communications-bulk-reminders')}
                  >
                    <i className="ti-email"></i> Send Reminders
                  </button>
                </div>
                <div className="col-md-6 mb-2">
                  <button 
                    className="btn btn-warning btn-block"
                    onClick={() => setCurrentPage('fees-reports')}
                  >
                    <i className="ti-list"></i> Due Report
                  </button>
                </div>
                <div className="col-md-6 mb-2">
                  <button 
                    className="btn btn-success btn-block"
                    onClick={() => setCurrentPage('fees-allocate')}
                  >
                    <i className="ti-plus"></i> Allocate Fees
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeDashboard;