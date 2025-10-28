import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Payment as PaymentIcon,
  AccountBalance as AccountBalanceIcon,
  AccountBalance,
  Email as EmailIcon,
  ExpandLess,
  ExpandMore,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  ClassOutlined,
  CalendarMonth,
  GradeOutlined,
  AccountBalanceWallet,
  Groups,
  AssignmentOutlined,
  ReceiptLongOutlined,
  CreditCard,
  PaidOutlined,
  Assessment,
  Receipt,
  AccountTree,
  ContactMail,
  NotificationsActive,
  Sms
} from '@mui/icons-material';
import { authAPI } from '../services/api';

const drawerWidth = 280;

const Layout = ({ children, user, onLogout, currentPage, setCurrentPage }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [collapsedMenus, setCollapsedMenus] = useState({
    academic: false,
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

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    handleProfileMenuClose();
    onLogout();
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'students', label: 'Students', icon: <PeopleIcon /> },
    {
      id: 'academic',
      label: 'Academic Management',
      icon: <SchoolIcon />,
      children: [
        { id: 'academic-classes', label: 'Classes & Streams', icon: <ClassOutlined /> },
        { id: 'academic-terms', label: 'Terms Management', icon: <CalendarMonth /> },
        { id: 'academic-levels', label: 'Levels & Years', icon: <GradeOutlined /> }
      ]
    },
    {
      id: 'fees',
      label: 'Fee Management',
      icon: <PaymentIcon />,
      children: [
        { id: 'fees-dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
        { id: 'fees-types', label: 'Fee Types', icon: <AssignmentOutlined /> },
        { id: 'fees-groups', label: 'Fee Groups', icon: <Groups /> },
        { id: 'fees-allocate', label: 'Allocate Fees', icon: <AccountBalanceWallet /> },
        { id: 'fees-payments', label: 'Payments', icon: <CreditCard /> },
        { id: 'fees-bulk-collection', label: 'Bulk Collection', icon: <PaidOutlined /> },
        { id: 'fees-reports', label: 'Reports', icon: <Assessment /> }
      ]
    },
    {
      id: 'accounting',
      label: 'Accounting',
      icon: <AccountBalanceIcon />,
      children: [
        { id: 'accounting-transactions', label: 'Transactions', icon: <Receipt /> },
        { id: 'accounting-accounts', label: 'Accounts', icon: <AccountBalance /> },
        { id: 'accounting-voucher-heads', label: 'Voucher Heads', icon: <AccountTree /> }
      ]
    },
    {
      id: 'communications',
      label: 'Communications',
      icon: <EmailIcon />,
      children: [
        { id: 'communications-email-logs', label: 'Email Logs', icon: <ContactMail /> },
        { id: 'communications-bulk-reminders', label: 'Bulk Reminders', icon: <NotificationsActive /> },
        { id: 'communications-sms', label: 'SMS Management', icon: <Sms /> }
      ]
    }
  ];

  const renderMenuItem = (item) => {
    if (item.children) {
      const isActive = currentPage.startsWith(item.id);
      return (
        <React.Fragment key={item.id}>
          <ListItem
            button
            onClick={() => toggleMenu(item.id)}
            selected={isActive}
            sx={{
              py: 0.5,
              cursor: 'pointer',
              '&:hover': {
                '& .MuiListItemIcon-root': {
                  color: 'primary.main',
                },
                '& .MuiTypography-root': {
                  color: 'primary.main',
                }
              },
              '& .MuiListItemIcon-root': {
                color: isActive ? 'primary.main' : 'inherit',
              },
              '& .MuiTypography-root': {
                color: isActive ? 'primary.main' : 'inherit',
                fontWeight: isActive ? 600 : 500,
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              {React.cloneElement(item.icon, { 
                sx: { 
                  fontSize: 18,
                  transition: 'color 0.2s ease-in-out'
                } 
              })}
            </ListItemIcon>
            <ListItemText 
              primary={item.label} 
              primaryTypographyProps={{ 
                fontSize: '0.8rem', 
                fontWeight: isActive ? 600 : 500,
                transition: 'color 0.2s ease-in-out'
              }}
            />
            {collapsedMenus[item.id] ? 
              <ExpandLess sx={{ fontSize: 18 }} /> : 
              <ExpandMore sx={{ fontSize: 18 }} />
            }
          </ListItem>
          <Collapse in={collapsedMenus[item.id]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding
              sx={{
                position: 'relative',
                ml: 3,
                borderLeft: '1px solid',
                borderColor: 'divider'
              }}
            >
              {item.children.map((child) => {
                const isChildActive = currentPage === child.id;
                return (
                  <ListItem
                    key={child.id}
                    button
                    sx={{
                      pl: 2,
                      py: 0.25,
                      cursor: 'pointer',
                      position: 'relative',
                      '&::before': {
                        display: isChildActive ? 'block' : 'none',
                        content: '""',
                        position: 'absolute',
                        left: -1,
                        top: 0,
                        bottom: 0,
                        width: '2px',
                        bgcolor: 'primary.main',
                      },
                      '&:hover': {
                        bgcolor: 'transparent',
                        '& .MuiTypography-root, & .MuiListItemIcon-root': {
                          color: 'primary.main',
                        }
                      }
                    }}
                    onClick={() => setCurrentPage(child.id)}
                    selected={isChildActive}
                  >
                    <ListItemIcon sx={{ 
                      minWidth: 28,
                      mr: 1,
                      color: isChildActive ? 'primary.main' : 'text.secondary',
                      transition: 'color 0.2s ease-in-out'
                    }}>
                      {React.cloneElement(child.icon, { sx: { fontSize: 16 } })}
                    </ListItemIcon>
                    <ListItemText 
                      primary={child.label} 
                      primaryTypographyProps={{ 
                        fontSize: '0.75rem',
                        color: isChildActive ? 'primary.main' : 'text.secondary',
                        fontWeight: isChildActive ? 600 : 400,
                        transition: 'all 0.2s ease-in-out'
                      }}
                    />
                  </ListItem>
                );
              })}
            </List>
          </Collapse>
        </React.Fragment>
      );
    }

    const isActive = currentPage === item.id;
    return (
      <ListItem
        key={item.id}
        button
        onClick={() => setCurrentPage(item.id)}
        selected={isActive}
        sx={{
          py: 0.5,
          cursor: 'pointer',
          position: 'relative',
          '&::before': {
            display: isActive ? 'block' : 'none',
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '2px',
            bgcolor: 'primary.main',
          },
          '&:hover': {
            bgcolor: 'transparent',
            '& .MuiListItemIcon-root': {
              color: 'primary.main',
            },
            '& .MuiTypography-root': {
              color: 'primary.main',
            }
          }
        }}
      >
        <ListItemIcon sx={{ 
          minWidth: 36,
          color: isActive ? 'primary.main' : 'inherit',
          transition: 'color 0.2s ease-in-out'
        }}>
          {React.cloneElement(item.icon, { sx: { fontSize: 18 } })}
        </ListItemIcon>
        <ListItemText 
          primary={item.label} 
          primaryTypographyProps={{ 
            fontSize: '0.8rem', 
            fontWeight: isActive ? 600 : 500,
            color: isActive ? 'primary.main' : 'inherit',
            transition: 'color 0.2s ease-in-out'
          }}
        />
      </ListItem>
    );
  };

  const drawer = (
    <div>
      <Toolbar sx={{ minHeight: '56px !important' }}>
        <Typography variant="h6" noWrap component="div" color="primary" sx={{ fontSize: '1rem', fontWeight: 600 }}>
          School Sych
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map(renderMenuItem)}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { 
            xs: '100%',
            md: sidebarOpen ? `calc(100% - ${drawerWidth}px)` : '100%'
          },
          ml: { 
            xs: 0,
            md: sidebarOpen ? `${drawerWidth}px` : 0
          },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontSize: '1rem' }}>
            School Management System
          </Typography>
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="profile-menu"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {user?.first_name?.charAt(0) || 'U'}
            </Avatar>
          </IconButton>
          <Menu
            id="profile-menu"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
          >
            <MenuItem onClick={handleProfileMenuClose} sx={{ fontSize: '0.8rem' }}>
              <SettingsIcon sx={{ mr: 1, fontSize: 18 }} />
              Settings
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ fontSize: '0.8rem' }}>
              <LogoutIcon sx={{ mr: 1, fontSize: 18 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ 
          width: { xs: 0, md: sidebarOpen ? drawerWidth : 0 }, 
          flexShrink: { md: 0 },
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="persistent"
          open={sidebarOpen}
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1, sm: 2, md: 3 },
          width: { 
            xs: '100%',
            md: sidebarOpen ? `calc(100% - ${drawerWidth}px)` : '100%'
          },
          ml: { 
            xs: 0,
            md: sidebarOpen ? 0 : 0
          },
          mt: { xs: 7, md: 8 },
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;