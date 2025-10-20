import React, { useState, useEffect } from 'react';
import { feeAPI } from '../services/api';
import { FeeTypesSkeleton } from './skeletons';

const FeeTypes = () => {
  const [feeTypes, setFeeTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchFeeTypes();
  }, []);

  const fetchFeeTypes = async () => {
    try {
      const response = await feeAPI.getTypes();
      setFeeTypes(response.data);
    } catch (error) {
      console.error('Error fetching fee types:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <FeeTypesSkeleton />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await feeAPI.createType(formData);
      fetchFeeTypes();
      setFormData({ name: '', description: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating fee type:', error);
    }
  };

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="row">
            <div className="col-12 col-xl-8 mb-4 mb-xl-0">
              <h3 className="font-weight-bold">Fee Types</h3>
              <h6 className="font-weight-normal mb-0">Manage different types of fees</h6>
            </div>
            <div className="col-12 col-xl-4">
              <div className="justify-content-end d-flex">
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                  {showForm ? 'Cancel' : 'Add Fee Type'}
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
                <h4 className="card-title">Add New Fee Type</h4>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g., Tuition Fee"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      className="form-control"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="e.g., Monthly tuition fee for students (UGX)"
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
              <p className="card-title mb-0">Fee Types List</p>
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
                    {feeTypes.map((type) => (
                      <tr key={type.id}>
                        <td>{type.name}</td>
                        <td>{type.description}</td>
                        <td>{new Date(type.created_at).toLocaleDateString()}</td>
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

export default FeeTypes;