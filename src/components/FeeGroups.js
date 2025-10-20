import React, { useState, useEffect } from 'react';
import { feeAPI } from '../services/api';
import { FeeGroupsSkeleton } from './skeletons';

const FeeGroups = () => {
  const [feeGroups, setFeeGroups] = useState([]);
  const [feeTypes, setFeeTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', class: '', fee_type_id: '', amount: '', due_date: ''
  });

  useEffect(() => {
    fetchFeeGroups();
    fetchFeeTypes();
  }, []);

  const fetchFeeGroups = async () => {
    try {
      const response = await feeAPI.getGroups();
      setFeeGroups(response.data);
    } catch (error) {
      console.error('Error fetching fee groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeeTypes = async () => {
    try {
      const response = await feeAPI.getTypes();
      setFeeTypes(response.data);
    } catch (error) {
      console.error('Error fetching fee types:', error);
    }
  };

  if (loading) {
    return <FeeGroupsSkeleton />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await feeAPI.createGroup(formData);
      fetchFeeGroups();
      setFormData({ name: '', class: '', fee_type_id: '', amount: '', due_date: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating fee group:', error);
    }
  };

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="row">
            <div className="col-12 col-xl-8 mb-4 mb-xl-0">
              <h3 className="font-weight-bold">Fee Groups</h3>
              <h6 className="font-weight-normal mb-0">Manage fee groups by class and type</h6>
            </div>
            <div className="col-12 col-xl-4">
              <div className="justify-content-end d-flex">
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                  {showForm ? 'Cancel' : 'Add Fee Group'}
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
                <h4 className="card-title">Add New Fee Group</h4>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="e.g., S1 Tuition Fee"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Class</label>
                        <select
                          className="form-control"
                          value={formData.class}
                          onChange={(e) => setFormData({...formData, class: e.target.value})}
                          required
                        >
                          <option value="">Select Class</option>
                          <option value="S1">S1</option>
                          <option value="S2">S2</option>
                          <option value="S3">S3</option>
                          <option value="S4">S4</option>
                          <option value="S5">S5</option>
                          <option value="S6">S6</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Fee Type</label>
                        <select
                          className="form-control"
                          value={formData.fee_type_id}
                          onChange={(e) => setFormData({...formData, fee_type_id: e.target.value})}
                          required
                        >
                          <option value="">Select Fee Type</option>
                          {feeTypes.map((type) => (
                            <option key={type.id} value={type.id}>{type.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
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
                  </div>
                  <div className="form-group">
                    <label>Due Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.due_date}
                      onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                      required
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
              <p className="card-title mb-0">Fee Groups List</p>
              <div className="table-responsive">
                <table className="table table-striped table-borderless">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Class</th>
                      <th>Fee Type</th>
                      <th>Amount</th>
                      <th>Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feeGroups.map((group) => (
                      <tr key={group.id}>
                        <td>{group.name}</td>
                        <td>{group.class}</td>
                        <td>{group.fee_type?.name}</td>
                        <td>UGX {group.amount?.toLocaleString()}</td>
                        <td>{new Date(group.due_date).toLocaleDateString()}</td>
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

export default FeeGroups;