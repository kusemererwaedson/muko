import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
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
import AcademicClasses from './components/AcademicClasses';
import AcademicTerms from './components/AcademicTerms';
import AcademicLevels from './components/AcademicLevels';
import SMSManagement from './components/SMSManagement';
import Layout from './components/Layout';
import { authAPI } from './services/api';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4B49AC',
    },
    secondary: {
      main: '#f50057',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 13,
    h1: { 
      fontSize: '1.8rem',
      '@media (max-width:600px)': { fontSize: '1.4rem' }
    },
    h2: { 
      fontSize: '1.6rem',
      '@media (max-width:600px)': { fontSize: '1.2rem' }
    },
    h3: { 
      fontSize: '1.4rem',
      '@media (max-width:600px)': { fontSize: '1.1rem' }
    },
    h4: { 
      fontSize: '1.2rem',
      '@media (max-width:600px)': { fontSize: '1rem' }
    },
    h5: { 
      fontSize: '1rem',
      '@media (max-width:600px)': { fontSize: '0.9rem' }
    },
    h6: { 
      fontSize: '0.9rem',
      '@media (max-width:600px)': { fontSize: '0.8rem' }
    },
    body1: { 
      fontSize: '0.8rem',
      '@media (max-width:600px)': { fontSize: '0.75rem' }
    },
    body2: { 
      fontSize: '0.75rem',
      '@media (max-width:600px)': { fontSize: '0.7rem' }
    },
    button: { 
      fontSize: '0.8rem',
      '@media (max-width:600px)': { fontSize: '0.75rem' }
    },
    caption: { 
      fontSize: '0.7rem',
      '@media (max-width:600px)': { fontSize: '0.65rem' }
    },
  },
  components: {
    MuiContainer: {
      defaultProps: {
        maxWidth: 'xl',
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          '@media (max-width:600px)': {
            margin: '0 4px',
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          '@media (max-width:900px)': {
            overflowX: 'auto',
            '& .MuiTable-root': {
              minWidth: 650,
            },
          },
        },
      },
    },
  },
});

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
      case 'academic-classes':
        return <AcademicClasses />;
      case 'academic-terms':
        return <AcademicTerms />;
      case 'academic-levels':
        return <AcademicLevels />;
      case 'communications-email-logs':
        return <EmailLogs />;
      case 'communications-bulk-reminders':
        return <BulkReminders />;
      case 'communications-sms':
        return <SMSManagement />;
      default:
        return <Dashboard />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout
        user={user}
        onLogout={handleLogout}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      >
        {renderContent()}
      </Layout>
    </ThemeProvider>
  );
}

export default App;