import React, { useState, useEffect } from 'react';
import { accountingAPI } from '../services/api';
import { AccountsSkeleton } from './skeletons';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: '', description: '' });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await accountingAPI.getAccounts();
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <AccountsSkeleton />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await accountingAPI.createAccount(formData);
      fetchAccounts();
      setFormData({ name: '', type: '', description: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating account:', error);
    }
  };

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="row">
            <div className="col-12 col-xl-8 mb-4 mb-xl-0">
              <h3 className="font-weight-bold">Accounts</h3>
              <h6 className="font-weight-normal mb-0">Manage chart of accounts</h6>
            </div>
            <div className="col-12 col-xl-4">
              <div className="justify-content-end d-flex">
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                  {showForm ? 'Cancel' : 'Add Account'}
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
                <h4 className="card-title">Add New Account</h4>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Account Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Account Type</label>
                        <select
                          className="form-control"
                          value={formData.type}
                          onChange={(e) => setFormData({...formData, type: e.target.value})}
                          required
                        >
                          <option value="">Select Type</option>
                          <option value="asset">Asset</option>
                          <option value="liability">Liability</option>
                          <option value="equity">Equity</option>
                          <option value="income">Income</option>
                          <option value="expense">Expense</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      className="form-control"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
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
              <p className="card-title mb-0">Chart of Accounts</p>
              <div className="table-responsive">
                <table className="table table-striped table-borderless">
                  <thead>
                    <tr>
                      <th>Account Name</th>
                      <th>Type</th>
                      <th>Description</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map((account) => (
                      <tr key={account.id}>
                        <td>{account.name}</td>
                        <td>
                          <div className="badge badge-outline-primary">
                            {account.type}
                          </div>
                        </td>
                        <td>{account.description}</td>
                        <td>{new Date(account.created_at).toLocaleDateString()}</td>
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

export default Accounts;