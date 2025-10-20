import React, { useState, useEffect } from 'react';
import { accountingAPI } from '../services/api';
import { VoucherHeadsSkeleton } from './skeletons';

const VoucherHeads = () => {
  const [voucherHeads, setVoucherHeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchVoucherHeads();
  }, []);

  const fetchVoucherHeads = async () => {
    try {
      const response = await accountingAPI.getVoucherHeads();
      setVoucherHeads(response.data);
    } catch (error) {
      console.error('Error fetching voucher heads:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <VoucherHeadsSkeleton />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await accountingAPI.createVoucherHead(formData);
      fetchVoucherHeads();
      setFormData({ name: '', description: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating voucher head:', error);
    }
  };

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="row">
            <div className="col-12 col-xl-8 mb-4 mb-xl-0">
              <h3 className="font-weight-bold">Voucher Heads</h3>
              <h6 className="font-weight-normal mb-0">Manage voucher categories</h6>
            </div>
            <div className="col-12 col-xl-4">
              <div className="justify-content-end d-flex">
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                  {showForm ? 'Cancel' : 'Add Voucher Head'}
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
                <h4 className="card-title">Add New Voucher Head</h4>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g., Office Supplies, Transport, Utilities"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      className="form-control"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Brief description of this voucher category"
                      rows="3"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary mr-2">Save</button>
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
              <p className="card-title mb-0">Voucher Heads List</p>
              <div className="table-responsive">
                <table className="table table-striped table-borderless">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {voucherHeads.map((head) => (
                      <tr key={head.id}>
                        <td>{head.name}</td>
                        <td>{head.description}</td>
                        <td>{new Date(head.created_at).toLocaleDateString()}</td>
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

export default VoucherHeads;