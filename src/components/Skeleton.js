import React from 'react';

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