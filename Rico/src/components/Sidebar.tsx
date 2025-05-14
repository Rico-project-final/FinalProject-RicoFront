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
  Divider,
} from '@mui/material';
import {
  HomeOutlined as HomeIcon,
  GridViewOutlined as GridViewIcon,
  BarChartOutlined as BarChartIcon,
  AssignmentOutlined as AssignmentIcon,
  PeopleOutline as PeopleIcon,
  CheckBoxOutlined as CheckBoxIcon,
  SettingsOutlined as SettingsIcon,
  LogoutOutlined as LogoutIcon,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/rico-logo.png';

const drawerWidth = 240;

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);

  const menuItems = [
    { id: '/dashboard', label: 'Dashboard', icon: <HomeIcon /> },
    { id: '/reviews', label: 'תגובות', icon: <GridViewIcon /> },
    { id: '/data-analysis', label: 'ניתוח נתונים', icon: <BarChartIcon /> },
    { id: '/optimization', label: 'הצעות ייעול', icon: <AssignmentIcon /> },
  ];

  const pagesMenuItems = [
    { id: '/customers', label: 'לקוחות', icon: <PeopleIcon /> },
    { id: '/todo', label: 'To-Do', icon: <CheckBoxIcon /> },
  ];

  const bottomMenuItems = [
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
            borderRadius: 2,
            mb: 0.5,
            color: isActive ? '#222' : '#222',
            backgroundColor: isActive ? '#f3f1e7' : 'transparent',
            '&:hover': {
              backgroundColor: '#f3f1e7',
            },
            '&.Mui-selected': {
              backgroundColor: '#f3f1e7',
              color: '#222',
              '&:hover': {
                backgroundColor: '#ece8d9',
              },
            },
            minHeight: 44,
            pl: 2,
            pr: 2
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 36,
              color: isActive ? '#222' : '#222',
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText
            primary={item.label}
            primaryTypographyProps={{
              fontSize: 15,
              fontWeight: isActive ? 600 : 400,
              fontFamily: 'inherit',
            }}
          />
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#fff',
          color: '#222',
          borderRight: '1px solid #f3f1e7',
        },
      }}
    >
      {/* לוגו */}
      <Box sx={{ p: 2, pt: 3, pb: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src={logo} alt="Rico Logo" style={{ width: 70, height: 70, objectFit: 'contain', marginBottom: 4 }} />
        <Typography variant="h6" fontWeight="bold" color="#222" sx={{ letterSpacing: 2, mt: 1 }}>
          RICO
        </Typography>
      </Box>
      <List sx={{ mt: 2 }}>
        {menuItems.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            isActive={activeItem === item.id}
          />
        ))}
      </List>
      <Divider sx={{ my: 2, background: '#f3f1e7' }} />
      <Typography
        variant="caption"
        sx={{
          px: 3,
          py: 1,
          color: '#888',
          fontWeight: 500,
          display: 'block',
          letterSpacing: 1,
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
      <Box sx={{ flexGrow: 1 }} />
      <Divider sx={{ my: 2, background: '#f3f1e7' }} />
      <List>
        {bottomMenuItems.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            isActive={activeItem === item.id}
          />
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;