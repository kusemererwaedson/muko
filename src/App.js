// src/App.js
import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Students from './components/Students';
import FeeTypes from './components/FeeTypes';
import FeeGroups from './components/FeeGroups';
import FeeAllocate from './components/FeeAllocate';
import FeePayments from './components/FeePayments';
import BulkCollection from './components/BulkCollection';
import Reports from './components/Reports';
import FeeDashboard from './components/FeeDashboard';
import Transactions from './components/Transactions';
import Accounts from './components/Accounts';
import VoucherHeads from './components/VoucherHeads';
import EmailLogs from './components/EmailLogs';
import BulkReminders from './components/BulkReminders';
import Layout from './components/Layout';
import './App.css';
import { authAPI } from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [logoutError, setLogoutError] = useState('');


  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setCurrentPage('dashboard');
      setLogoutError('');
    } catch (error) {
      console.error('Logout error:', error);
      setLogoutError('Logout failed. Please try again.');
    }
  };



  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'students':
        return <Students setCurrentPage={setCurrentPage} />;
      case 'fees-dashboard':
        return <FeeDashboard setCurrentPage={setCurrentPage} />;
      case 'fees-types':
        return <FeeTypes />;
      case 'fees-groups':
        return <FeeGroups />;
      case 'fees-allocate':
        return <FeeAllocate />;
      case 'fees-payments':
        return <FeePayments />;
      case 'fees-bulk-collection':
        return <BulkCollection />;
      case 'fees-reports':
        return <Reports />;
      case 'accounting-transactions':
        return <Transactions />;
      case 'accounting-accounts':
        return <Accounts />;
      case 'accounting-voucher-heads':
        return <VoucherHeads />;
      case 'communications-email-logs':
        return <EmailLogs />;
      case 'communications-bulk-reminders':
        return <BulkReminders />;
      default:
        return <Dashboard />;
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout
      user={user}
      onLogout={handleLogout}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
    >
      {renderContent()}
    </Layout>
  );
}

export default App;