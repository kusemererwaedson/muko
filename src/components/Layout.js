// src/components/Layout.js
import React, { useState } from 'react';
import { authAPI } from '../services/api';

const Layout = ({ children, user, onLogout, currentPage, setCurrentPage }) => {
  const [collapsedMenus, setCollapsedMenus] = useState({
    fees: false,
    accounting: false,
    communications: false
  });

  const toggleMenu = (menuName) => {
    setCollapsedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };
  const handleToggleSidebar = () => {
    document.body.classList.toggle('sidebar-icon-only');
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      onLogout();
    }
  };

  return (
    <div className="container-scroller">
      <nav className="navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
        <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
          <h4 className="text-primary d-none d-lg-block sidebar-brand-full">Muko High School</h4>
          <h4 className="text-primary d-lg-none sidebar-brand-mini">MHS</h4>
        </div>
        <div className="navbar-menu-wrapper d-flex align-items-center justify-content-end">
          <button 
            className="navbar-toggler navbar-toggler align-self-center" 
            type="button" 
            data-toggle="minimize"
            onClick={handleToggleSidebar}
            style={{background: 'none', border: 'none', color: '#4B49AC', marginRight: 'auto'}}
          >
            <span className="icon-menu"></span>
          </button>
          <ul className="navbar-nav navbar-nav-right">
            <li className="nav-item nav-profile dropdown">
              <a className="nav-link dropdown-toggle" href="#" data-toggle="dropdown" id="profileDropdown">
                <img src="/template/images/faces/face28.jpg" alt="profile"/>
              </a>
              <div className="dropdown-menu dropdown-menu-right navbar-dropdown" aria-labelledby="profileDropdown">
                <a className="dropdown-item">
                  <i className="ti-settings text-primary"></i>
                  Settings
                </a>
                <button onClick={handleLogout} className="dropdown-item" style={{border: 'none', background: 'none', width: '100%', textAlign: 'left'}}>
                  <i className="ti-power-off text-primary"></i>
                  Logout
                </button>
              </div>
            </li>
          </ul>
        </div>
      </nav>
      
      <div className="container-fluid page-body-wrapper">
        <nav className="sidebar sidebar-offcanvas" id="sidebar">
          <ul className="nav">
            <li className="nav-item">
              <a 
                className="nav-link pr-4"
                href="#"
                onClick={() => setCurrentPage('dashboard')}
                style={currentPage === 'dashboard' ? {background: '#4B49AC', color: '#fff'} : {}}
              >
                <i className="icon-grid menu-icon"></i>
                <span className="menu-title">Dashboard</span>
              </a>
            </li>
            <li className="nav-item">
              <a 
                className="nav-link pr-4"
                href="#"
                onClick={() => setCurrentPage('students')}
                style={currentPage === 'students' ? {background: '#4B49AC', color: '#fff'} : {}}
              >
                <i className="icon-head menu-icon"></i>
                <span className="menu-title">Students</span>
              </a>
            </li>
            <li className="nav-item">
              <a 
                className="nav-link pr-4"
                href="#"
                onClick={(e) => { e.preventDefault(); toggleMenu('fees'); }}
                onMouseEnter={(e) => e.preventDefault()}
                onMouseOver={(e) => e.preventDefault()}
                aria-expanded={collapsedMenus.fees} 
                aria-controls="fees"
                style={{...{pointerEvents: 'auto'}, ...(currentPage.startsWith('fees') ? {background: '#4B49AC', color: '#fff'} : {})}}
              >
                <i className="icon-credit-card menu-icon"></i>
                <span className="menu-title">Fee Management</span>
                <i className="menu-arrow"></i>
              </a>
              <div className={`collapse ${collapsedMenus.fees ? 'show' : ''}`} id="fees">
                <ul className="nav flex-column sub-menu" style={{background: '#fff', margin: 0, padding: 0, marginTop: '5px'}}>
                  <li className="nav-item">
                    <a 
                      className="nav-link"
                      href="#"
                      onClick={() => setCurrentPage('fees-dashboard')}
                      style={currentPage === 'fees-dashboard' ? {background: '#4B49AC', color: '#fff', width: '100%', display: 'block', paddingLeft: '50px'} : {background: '#fff', color: '#4B49AC', width: '100%', display: 'block', paddingLeft: '50px'}}
                    >
                      Dashboard
                    </a>
                  </li>
                  <li className="nav-item">
                    <a 
                      className="nav-link"
                      href="#"
                      onClick={() => setCurrentPage('fees-types')}
                      style={currentPage === 'fees-types' ? {background: '#4B49AC', color: '#fff', width: '100%', display: 'block', paddingLeft: '50px'} : {background: '#fff', color: '#4B49AC', width: '100%', display: 'block', paddingLeft: '50px'}}
                    >
                      Fee Types
                    </a>
                  </li>
                  <li className="nav-item">
                    <a 
                      className="nav-link"
                      href="#"
                      onClick={() => setCurrentPage('fees-groups')}
                      style={currentPage === 'fees-groups' ? {background: '#4B49AC', color: '#fff', width: '100%', display: 'block', paddingLeft: '50px'} : {background: '#fff', color: '#4B49AC', width: '100%', display: 'block', paddingLeft: '50px'}}
                    >
                      Fee Groups
                    </a>
                  </li>
                  <li className="nav-item">
                    <a 
                      className="nav-link"
                      href="#"
                      onClick={() => setCurrentPage('fees-allocate')}
                      style={currentPage === 'fees-allocate' ? {background: '#4B49AC', color: '#fff', width: '100%', display: 'block', paddingLeft: '50px'} : {background: '#fff', color: '#4B49AC', width: '100%', display: 'block', paddingLeft: '50px'}}
                    >
                      Allocate Fees
                    </a>
                  </li>
                  <li className="nav-item">
                    <a 
                      className="nav-link"
                      href="#"
                      onClick={() => setCurrentPage('fees-payments')}
                      style={currentPage === 'fees-payments' ? {background: '#4B49AC', color: '#fff', width: '100%', display: 'block', paddingLeft: '50px'} : {background: '#fff', color: '#4B49AC', width: '100%', display: 'block', paddingLeft: '50px'}}
                    >
                      Payments
                    </a>
                  </li>
                  <li className="nav-item">
                    <a 
                      className="nav-link"
                      href="#"
                      onClick={() => setCurrentPage('fees-bulk-collection')}
                      style={currentPage === 'fees-bulk-collection' ? {background: '#4B49AC', color: '#fff', width: '100%', display: 'block', paddingLeft: '50px'} : {background: '#fff', color: '#4B49AC', width: '100%', display: 'block', paddingLeft: '50px'}}
                    >
                      Bulk Collection
                    </a>
                  </li>
                  <li className="nav-item">
                    <a 
                      className="nav-link"
                      href="#"
                      onClick={() => setCurrentPage('fees-reports')}
                      style={currentPage === 'fees-reports' ? {background: '#4B49AC', color: '#fff', width: '100%', display: 'block', paddingLeft: '50px'} : {background: '#fff', color: '#4B49AC', width: '100%', display: 'block', paddingLeft: '50px'}}
                    >
                      Reports
                    </a>
                  </li>
                </ul>
              </div>
            </li>
            <li className="nav-item">
              <a 
                className="nav-link pr-4"
                href="#"
                onClick={(e) => { e.preventDefault(); toggleMenu('accounting'); }}
                onMouseEnter={(e) => e.preventDefault()}
                onMouseOver={(e) => e.preventDefault()}
                aria-expanded={collapsedMenus.accounting} 
                aria-controls="accounting"
                style={{...{pointerEvents: 'auto'}, ...(currentPage.startsWith('accounting') ? {background: '#4B49AC', color: '#fff'} : {})}}
              >
                <i className="icon-paper menu-icon"></i>
                <span className="menu-title">Accounting</span>
                <i className="menu-arrow"></i>
              </a>
              <div className={`collapse ${collapsedMenus.accounting ? 'show' : ''}`} id="accounting">
                <ul className="nav flex-column sub-menu" style={{background: '#fff', margin: 0, padding: 0, marginTop: '5px'}}>
                  <li className="nav-item">
                    <a 
                      className="nav-link"
                      href="#"
                      onClick={() => setCurrentPage('accounting-transactions')}
                      style={currentPage === 'accounting-transactions' ? {background: '#4B49AC', color: '#fff', width: '100%', display: 'block', paddingLeft: '50px'} : {background: '#fff', color: '#4B49AC', width: '100%', display: 'block', paddingLeft: '50px'}}
                    >
                      Transactions
                    </a>
                  </li>
                  <li className="nav-item">
                    <a 
                      className="nav-link"
                      href="#"
                      onClick={() => setCurrentPage('accounting-accounts')}
                      style={currentPage === 'accounting-accounts' ? {background: '#4B49AC', color: '#fff', width: '100%', display: 'block', paddingLeft: '50px'} : {background: '#fff', color: '#4B49AC', width: '100%', display: 'block', paddingLeft: '50px'}}
                    >
                      Accounts
                    </a>
                  </li>
                  <li className="nav-item">
                    <a 
                      className="nav-link"
                      href="#"
                      onClick={() => setCurrentPage('accounting-voucher-heads')}
                      style={currentPage === 'accounting-voucher-heads' ? {background: '#4B49AC', color: '#fff', width: '100%', display: 'block', paddingLeft: '50px'} : {background: '#fff', color: '#4B49AC', width: '100%', display: 'block', paddingLeft: '50px'}}
                    >
                      Voucher Heads
                    </a>
                  </li>
                </ul>
              </div>
            </li>
            <li className="nav-item">
              <a 
                className="nav-link pr-4"
                href="#"
                onClick={(e) => { e.preventDefault(); toggleMenu('communications'); }}
                onMouseEnter={(e) => e.preventDefault()}
                onMouseOver={(e) => e.preventDefault()}
                aria-expanded={collapsedMenus.communications} 
                aria-controls="communications"
                style={{...{pointerEvents: 'auto'}, ...(currentPage.startsWith('communications') ? {background: '#4B49AC', color: '#fff'} : {})}}
              >
                <i className="icon-speech menu-icon"></i>
                <span className="menu-title">Communications</span>
                <i className="menu-arrow"></i>
              </a>
              <div className={`collapse ${collapsedMenus.communications ? 'show' : ''}`} id="communications">
                <ul className="nav flex-column sub-menu" style={{background: '#fff', margin: 0, padding: 0, marginTop: '5px'}}>
                  <li className="nav-item">
                    <a 
                      className="nav-link"
                      href="#"
                      onClick={() => setCurrentPage('communications-email-logs')}
                      style={currentPage === 'communications-email-logs' ? {background: '#4B49AC', color: '#fff', width: '100%', display: 'block', paddingLeft: '50px'} : {background: '#fff', color: '#4B49AC', width: '100%', display: 'block', paddingLeft: '50px'}}
                    >
                      Email Logs
                    </a>
                  </li>
                  <li className="nav-item">
                    <a 
                      className="nav-link"
                      href="#"
                      onClick={() => setCurrentPage('communications-bulk-reminders')}
                      style={currentPage === 'communications-bulk-reminders' ? {background: '#4B49AC', color: '#fff', width: '100%', display: 'block', paddingLeft: '50px'} : {background: '#fff', color: '#4B49AC', width: '100%', display: 'block', paddingLeft: '50px'}}
                    >
                      Bulk Reminders
                    </a>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </nav>
        
        <div className="main-panel">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;