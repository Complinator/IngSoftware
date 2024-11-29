import React from 'react';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  IconButton
} from '@mui/material';
import { 
  Chat as ChatIcon, 
  Settings as SettingsIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ChatComponent from './chatbot/chat'; // Import your existing ChatComponent
import { Router, Route, Routes, Navigate, useNavigate, useLocation, Outlet } from 'react-router-dom';
import SelectPDF from './selectPDF/SelectPDF';
import ChatbotDataSelection from './ChatbotDataSelection';
import LogoutIcon from '@mui/icons-material/Logout';
import FolderIcon from '@mui/icons-material/Folder';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 240;

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const ChatLayoutComponent = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  //console.log(isAuthenticated);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Chat', icon: <ChatIcon />, path: 'chat' },
    { text: 'PDF Settings', icon: <SettingsIcon />, path: 'select-pdf' },
    { text: 'Bot Select', icon: <SmartToyIcon />, path: 'bot-selection' }
  ];

  const drawer = (
    <div>
      <Toolbar />
      <List>
      {menuItems.map((item) => (
          <ListItem 
            button={true.toString()}
            key={item.text} 
            onClick={() => {
              navigate(item.path);
              if (mobileOpen) handleDrawerToggle();
            }}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar sx={{justifyContent: "space-between"}}>
            <Box sx={{ display: 'flex', verticalAlign: "middle" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{height: "fit-content", margin: "auto"}}>
              Chat Application
            </Typography>
            </Box>
            <IconButton
              color="inherit"
              sx={{ ml: 2 }}
              onClick={logout}
            >
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
        >
          <Toolbar /> {/* This toolbar is for spacing below the AppBar */}
            <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ChatLayoutComponent;