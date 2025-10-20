import React from 'react';

// Dashboard Skeleton
export const DashboardSkeleton = () => (
  <div className="content-wrapper">
    <div className="row">
      <div className="col-md-12 grid-margin">
        <div className="skeleton" style={{height: '24px', width: '40%', marginBottom: '8px'}}></div>
        <div className="skeleton" style={{height: '16px', width: '60%'}}></div>
      </div>
    </div>
    <div className="row">
      <div className="col-md-6 grid-margin stretch-card">
        <div className="card tale-bg">
          <div className="card-people">
            <div className="weather-info">
              <div className="skeleton" style={{height: '48px', width: '80px', marginBottom: '8px'}}></div>
              <div className="skeleton" style={{height: '20px', width: '120px'}}></div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-6 grid-margin transparent">
        <div className="row">
          {[1,2,3,4].map(i => (
            <div key={i} className="col-md-6 mb-4 stretch-card transparent">
              <div className="card">
                <div className="card-body">
                  <div className="skeleton" style={{height: '16px', width: '70%', marginBottom: '8px'}}></div>
                  <div className="skeleton" style={{height: '24px', width: '90%'}}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="row">
      <div className="col-md-6 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <div className="skeleton" style={{height: '20px', width: '30%', marginBottom: '10px'}}></div>
            <div className="skeleton" style={{height: '200px', width: '100%'}}></div>
          </div>
        </div>
      </div>
      <div className="col-md-6 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <div className="skeleton" style={{height: '20px', width: '25%', marginBottom: '10px'}}></div>
            <div className="skeleton" style={{height: '150px', width: '100%'}}></div>
            <div className="skeleton" style={{height: '20px', width: '30%', marginTop: '15px', marginBottom: '10px'}}></div>
            {[1,2,3].map(i => (
              <div key={i} style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                <div className="skeleton" style={{height: '16px', width: '60%'}}></div>
                <div className="skeleton" style={{height: '16px', width: '30%'}}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    <div className="row">
      <div className="col-md-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <div className="skeleton" style={{height: '20px', width: '25%', marginBottom: '15px'}}></div>
            <div className="table-responsive">
              <table className="table table-striped table-borderless">
                <thead>
                  <tr>
                    {['Date', 'Voucher Head', 'Account', 'Type', 'Amount', 'Description'].map((header, i) => (
                      <th key={i}><div className="skeleton" style={{height: '16px', width: '80%'}}></div></th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[1,2,3,4,5,6,7].map(row => (
                    <tr key={row}>
                      {[1,2,3,4,5,6].map(col => (
                        <td key={col}><div className="skeleton" style={{height: '16px', width: '90%'}}></div></td>
                      ))}
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

// Students Table Skeleton
export const StudentsTableSkeleton = () => (
  <div className="content-wrapper">
    <div className="row">
      <div className="col-md-12 grid-margin">
        <div className="skeleton" style={{height: '24px', width: '35%', marginBottom: '8px'}}></div>
        <div className="skeleton" style={{height: '16px', width: '50%'}}></div>
      </div>
    </div>
    <div className="row">
      <div className="col-md-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="skeleton" style={{height: '38px', width: '100%'}}></div>
              </div>
              <div className="col-md-3">
                <div className="skeleton" style={{height: '38px', width: '100%'}}></div>
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
            <div className="skeleton" style={{height: '20px', width: '25%', marginBottom: '15px'}}></div>
            <div className="table-responsive">
              <table className="table table-striped table-borderless">
                <thead>
                  <tr>
                    {['Register No', 'Name', 'Class', 'Gender', 'Guardian', 'Status', 'Actions'].map((header, i) => (
                      <th key={i}><div className="skeleton" style={{height: '16px', width: '80%'}}></div></th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[1,2,3,4,5].map(row => (
                    <tr key={row}>
                      {[1,2,3,4,5,6,7].map(col => (
                        <td key={col}><div className="skeleton" style={{height: '16px', width: col === 7 ? '120px' : '90%'}}></div></td>
                      ))}
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

// Generic Card Skeleton
const Skeleton = () => (
  <div className="content-wrapper">
    <div className="row">
      <div className="col-md-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <div className="skeleton" style={{height: '20px', marginBottom: '15px', width: '30%'}}></div>
            <div className="skeleton" style={{height: '40px', marginBottom: '10px'}}></div>
            <div className="skeleton" style={{height: '40px', marginBottom: '10px'}}></div>
            <div className="skeleton" style={{height: '40px', width: '80%'}}></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Skeleton;