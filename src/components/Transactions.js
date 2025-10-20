import React, { useState, useEffect } from 'react';
import { accountingAPI } from '../services/api';
import { TransactionsSkeleton } from './skeletons';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [voucherHeads, setVoucherHeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    voucher_head_id: '', account_id: '', amount: '', type: 'debit',
    description: '', date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchTransactions();
    fetchAccounts();
    fetchVoucherHeads();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await accountingAPI.getTransactions();
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await accountingAPI.getAccounts();
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const fetchVoucherHeads = async () => {
    try {
      const response = await accountingAPI.getVoucherHeads();
      setVoucherHeads(response.data);
    } catch (error) {
      console.error('Error fetching voucher heads:', error);
    }
  };

  if (loading) {
    return <TransactionsSkeleton />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting transaction data:', formData);
    
    try {
      const response = await accountingAPI.createTransaction(formData);
      console.log('Transaction created successfully:', response.data);
      
      fetchTransactions();
      setFormData({
        voucher_head_id: '', account_id: '', amount: '', type: 'debit',
        description: '', date: new Date().toISOString().split('T')[0]
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating transaction:', error);
      
      let errorMessage = 'Failed to create transaction. ';
      if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else if (error.response?.data?.errors) {
        const errors = Object.values(error.response.data.errors).flat();
        errorMessage += errors.join(', ');
      } else {
        errorMessage += error.message || 'Unknown error occurred.';
      }
      
      alert(errorMessage);
    }
  };

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="row">
            <div className="col-12 col-xl-8 mb-4 mb-xl-0">
              <h3 className="font-weight-bold">Transactions</h3>
              <h6 className="font-weight-normal mb-0">Manage financial transactions</h6>
            </div>
            <div className="col-12 col-xl-4">
              <div className="justify-content-end d-flex">
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                  {showForm ? 'Cancel' : 'Add Transaction'}
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
                <h4 className="card-title">Add New Transaction</h4>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Voucher Head</label>
                        <select
                          className="form-control"
                          value={formData.voucher_head_id}
                          onChange={(e) => setFormData({...formData, voucher_head_id: e.target.value})}
                          required
                        >
                          <option value="">Select Voucher Head</option>
                          {voucherHeads.map((head) => (
                            <option key={head.id} value={head.id}>{head.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Account</label>
                        <select
                          className="form-control"
                          value={formData.account_id}
                          onChange={(e) => setFormData({...formData, account_id: e.target.value})}
                          required
                        >
                          <option value="">Select Account</option>
                          {accounts.map((account) => (
                            <option key={account.id} value={account.id}>{account.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>Amount</label>
                        <input
                          type="number"
                          className="form-control"
                          value={formData.amount}
                          onChange={(e) => setFormData({...formData, amount: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>Type</label>
                        <select
                          className="form-control"
                          value={formData.type}
                          onChange={(e) => setFormData({...formData, type: e.target.value})}
                        >
                          <option value="debit">Debit</option>
                          <option value="credit">Credit</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={formData.date}
                          onChange={(e) => setFormData({...formData, date: e.target.value})}
                          required
                        />
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
              <p className="card-title mb-0">Transaction History</p>
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

export default Transactions;