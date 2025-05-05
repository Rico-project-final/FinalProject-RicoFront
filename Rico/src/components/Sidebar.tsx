import React, { useState } from 'react';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton,
  ListItemIcon, 
  ListItemText, 
  Typography, 
  Divider 
} from '@mui/material';
import { 
  Home as HomeIcon, 
  GridView as GridViewIcon, 
  BarChart as BarChartIcon, 
  Assignment as AssignmentIcon, 
  People as PeopleIcon, 
  CheckBox as CheckBoxIcon, 
  Settings as SettingsIcon, 
  Logout as LogoutIcon 
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const drawerWidth = 210;

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);

  const menuItems = [
    { id: '/', label: 'Dashboard', icon: <HomeIcon /> },
    { id: '/reviews', label: 'Reviews', icon: <GridViewIcon /> },
    { id: '/analytics', label: 'Data Analysis', icon: <BarChartIcon /> },
    { id: '/optimization', label: 'Optimization Ideas', icon: <AssignmentIcon /> },
  ];

  const pagesMenuItems = [
    { id: '/customers', label: 'Customers', icon: <PeopleIcon /> },
    { id: '/todo', label: 'To-Do', icon: <CheckBoxIcon /> },
  ];

  const bottomMenuItems = [
    { id: '/settings', label: 'Settings', icon: <SettingsIcon /> },
    { id: '/logout', label: 'Logout', icon: <LogoutIcon /> },
  ];

  const handleItemClick = (id: string) => {
    setActiveItem(id);
  };

  const MenuItem = ({ 
    item, 
    isActive 
  }: { 
    item: { id: string; label: string; icon: React.ReactNode }; 
    isActive: boolean;
  }) => {
    return (
      <ListItem disablePadding>
        <ListItemButton
          component={Link}
          to={item.id}
          onClick={() => handleItemClick(item.id)}
          selected={isActive}
          sx={{
            borderRadius: 1,
            mb: 0.5,
            color: isActive ? 'white' : 'rgba(255, 255, 255, 0.7)',
            backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
            '&.Mui-selected': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
              },
            },
          }}
        >
          <ListItemIcon 
            sx={{ 
              minWidth: 40, 
              color: isActive ? 'white' : 'rgba(255, 255, 255, 0.7)' 
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText 
            primary={item.label} 
            primaryTypographyProps={{ 
              fontSize: 14,
              fontWeight: isActive ? 500 : 400,
            }} 
          />
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#1c2532',
          color: 'white',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255,255,255,0.1)',
            }}
          >
            <Typography variant="h6" fontWeight="bold" color="white">
              R
            </Typography>
          </Box>
          <Typography
            variant="h6"
            fontWeight="bold"
            color="white"
            sx={{ ml: 1 }}
          >
            RICO
          </Typography>
        </Box>
      </Box>

      {/* Main Menu */}
      <Box sx={{ overflow: 'auto', px: 1, flex: 1 }}>
        <List>
          {menuItems.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              isActive={activeItem === item.id}
            />
          ))}
        </List>

        {/* Pages Section */}
        <Box sx={{ mt: 2, mb: 1 }}>
          <Typography
            variant="caption"
            sx={{
              px: 2,
              py: 1,
              color: 'rgba(255,255,255,0.5)',
              fontWeight: 500,
              display: 'block',
            }}
          >
            PAGES
          </Typography>
          <List>
            {pagesMenuItems.map((item) => (
              <MenuItem
                key={item.id}
                item={item}
                isActive={activeItem === item.id}
              />
            ))}
          </List>
        </Box>
      </Box>

      {/* Bottom Menu */}
      <Box sx={{ p: 1, mt: 'auto' }}>
        <List>
          {bottomMenuItems.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              isActive={activeItem === item.id}
            />
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;