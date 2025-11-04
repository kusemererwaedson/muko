// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Students from './components/student/Students';
import FeeTypes from './components/fees/FeeTypes';
import FeeGroups from './components/fees/FeeGroups';
import FeeAllocate from './components/fees/FeeAllocate';
import FeePayments from './components/fees/FeePayments';
import BulkCollection from './components/fees/BulkCollection';
import Reports from './components/fees/Reports';
import FeeDashboard from './components/fees/FeeDashboard';
import Transactions from './components/accounting/Transactions';
import Accounts from './components/accounting/Accounts';
import VoucherHeads from './components/accounting/VoucherHeads';
import EmailLogs from './components/communications/EmailLogs';
import BulkReminders from './components/communications/BulkReminders';
import AcademicClasses from './components/academic/AcademicClasses';
import AcademicTerms from './components/academic/AcademicTerms';
import AcademicLevels from './components/academic/AcademicLevels';
import SMSManagement from './components/communications/SMSManagement';
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

// Protected Route Component
const ProtectedRoute = ({ children, user }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Layout Wrapper Component
const LayoutWrapper = ({ user, onLogout, children }) => {
  const navigate = useNavigate();
  
  // Map routes to page names for the sidebar
  const getPageFromPath = (path) => {
    const routeMap = {
      '/': 'dashboard',
      '/students': 'students',
      '/fees/dashboard': 'fees-dashboard',
      '/fees/types': 'fees-types',
      '/fees/groups': 'fees-groups',
      '/fees/allocate': 'fees-allocate',
      '/fees/payments': 'fees-payments',
      '/fees/bulk-collection': 'fees-bulk-collection',
      '/fees/reports': 'fees-reports',
      '/accounting/transactions': 'accounting-transactions',
      '/accounting/accounts': 'accounting-accounts',
      '/accounting/voucher-heads': 'accounting-voucher-heads',
      '/academic/classes': 'academic-classes',
      '/academic/terms': 'academic-terms',
      '/academic/levels': 'academic-levels',
      '/communications/email-logs': 'communications-email-logs',
      '/communications/bulk-reminders': 'communications-bulk-reminders',
      '/communications/sms': 'communications-sms',
    };
    return routeMap[path] || 'dashboard';
  };

  const handlePageChange = (pageName) => {
    const pageMap = {
      'dashboard': '/',
      'students': '/students',
      'fees-dashboard': '/fees/dashboard',
      'fees-types': '/fees/types',
      'fees-groups': '/fees/groups',
      'fees-allocate': '/fees/allocate',
      'fees-payments': '/fees/payments',
      'fees-bulk-collection': '/fees/bulk-collection',
      'fees-reports': '/fees/reports',
      'accounting-transactions': '/accounting/transactions',
      'accounting-accounts': '/accounting/accounts',
      'accounting-voucher-heads': '/accounting/voucher-heads',
      'academic-classes': '/academic/classes',
      'academic-terms': '/academic/terms',
      'academic-levels': '/academic/levels',
      'communications-email-logs': '/communications/email-logs',
      'communications-bulk-reminders': '/communications/bulk-reminders',
      'communications-sms': '/communications/sms',
    };
    navigate(pageMap[pageName] || '/');
  };

  return (
    <Layout
      user={user}
      onLogout={onLogout}
      currentPage={getPageFromPath(window.location.pathname)}
      setCurrentPage={handlePageChange}
    >
      {children}
    </Layout>
  );
};

function AppContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
    navigate('/');
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still logout locally even if API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={
        user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />
      } />
      
      <Route path="/" element={
        <ProtectedRoute user={user}>
          <LayoutWrapper user={user} onLogout={handleLogout}>
            <Dashboard />
          </LayoutWrapper>
        </ProtectedRoute>
      } />
      
      <Route path="/students" element={
        <ProtectedRoute user={user}>
          <LayoutWrapper user={user} onLogout={handleLogout}>
            <Students setCurrentPage={(page) => {
              const pageMap = {
                'fees-payments': '/fees/payments',
              };
              navigate(pageMap[page] || '/');
            }} />
          </LayoutWrapper>
        </ProtectedRoute>
      } />
      
      <Route path="/fees/dashboard" element={
        <ProtectedRoute user={user}>
          <LayoutWrapper user={user} onLogout={handleLogout}>
            <FeeDashboard setCurrentPage={(page) => navigate(`/${page.replace('-', '/')}`)} />
          </LayoutWrapper>
        </ProtectedRoute>
      } />
      
      <Route path="/fees/types" element={
        <ProtectedRoute user={user}>
          <LayoutWrapper user={user} onLogout={handleLogout}>
            <FeeTypes />
          </LayoutWrapper>
        </ProtectedRoute>
      } />
      
      <Route path="/fees/groups" element={
        <ProtectedRoute user={user}>
          <LayoutWrapper user={user} onLogout={handleLogout}>
            <FeeGroups />
          </LayoutWrapper>
        </ProtectedRoute>
      } />
      
      <Route path="/fees/allocate" element={
        <ProtectedRoute user={user}>
          <LayoutWrapper user={user} onLogout={handleLogout}>
            <FeeAllocate />
          </LayoutWrapper>
        </ProtectedRoute>
      } />
      
      <Route path="/fees/payments" element={
        <ProtectedRoute user={user}>
          <LayoutWrapper user={user} onLogout={handleLogout}>
            <FeePayments />
          </LayoutWrapper>
        </ProtectedRoute>
      } />
      
      <Route path="/fees/bulk-collection" element={
        <ProtectedRoute user={user}>
          <LayoutWrapper user={user} onLogout={handleLogout}>
            <BulkCollection />
          </LayoutWrapper>
        </ProtectedRoute>
      } />
      
      <Route path="/fees/reports" element={
        <ProtectedRoute user={user}>
          <LayoutWrapper user={user} onLogout={handleLogout}>
            <Reports />
          </LayoutWrapper>
        </ProtectedRoute>
      } />
      
      <Route path="/accounting/transactions" element={
        <ProtectedRoute user={user}>
          <LayoutWrapper user={user} onLogout={handleLogout}>
            <Transactions />
          </LayoutWrapper>
        </ProtectedRoute>
      } />
      
      <Route path="/accounting/accounts" element={
        <ProtectedRoute user={user}>
          <LayoutWrapper user={user} onLogout={handleLogout}>
            <Accounts />
          </LayoutWrapper>
        </ProtectedRoute>
      } />
      
      <Route path="/accounting/voucher-heads" element={
        <ProtectedRoute user={user}>
          <LayoutWrapper user={user} onLogout={handleLogout}>
            <VoucherHeads />
          </LayoutWrapper>
        </ProtectedRoute>
      } />
      
      <Route path="/academic/classes" element={
        <ProtectedRoute user={user}>
          <LayoutWrapper user={user} onLogout={handleLogout}>
            <AcademicClasses />
          </LayoutWrapper>
        </ProtectedRoute>
      } />
      
      <Route path="/academic/terms" element={
        <ProtectedRoute user={user}>
          <LayoutWrapper user={user} onLogout={handleLogout}>
            <AcademicTerms />
          </LayoutWrapper>
        </ProtectedRoute>
      } />
      
      <Route path="/academic/levels" element={
        <ProtectedRoute user={user}>
          <LayoutWrapper user={user} onLogout={handleLogout}>
            <AcademicLevels />
          </LayoutWrapper>
        </ProtectedRoute>
      } />
      
      <Route path="/communications/email-logs" element={
        <ProtectedRoute user={user}>
          <LayoutWrapper user={user} onLogout={handleLogout}>
            <EmailLogs />
          </LayoutWrapper>
        </ProtectedRoute>
      } />
      
      <Route path="/communications/bulk-reminders" element={
        <ProtectedRoute user={user}>
          <LayoutWrapper user={user} onLogout={handleLogout}>
            <BulkReminders />
          </LayoutWrapper>
        </ProtectedRoute>
      } />
      
      <Route path="/communications/sms" element={
        <ProtectedRoute user={user}>
          <LayoutWrapper user={user} onLogout={handleLogout}>
            <SMSManagement />
          </LayoutWrapper>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;