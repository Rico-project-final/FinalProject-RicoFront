import React, { useState } from 'react';
import {
  Box,
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
  LogoutOutlined as LogoutIcon,
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth-context';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
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

  const handleItemClick = async (id: string) => {
    setActiveItem(id);
    if (id === '/logout') {
      await logout();
      navigate('/'); // Redirect to home or login page
    }
  };

  const MenuItem = ({
    item,
    isActive,
  }: {
    item: { id: string; label: string; icon: React.ReactNode };
    isActive: boolean;
  }) => (
    <ListItem disablePadding>
      <ListItemButton
        component={item.id === '/logout' ? 'button' : Link}
        to={item.id !== '/logout' ? item.id : undefined}
        onClick={() => handleItemClick(item.id)}
        selected={isActive}
        sx={{
          borderRadius: 2,
          mb: 0.5,
          color: '#222',
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
          pr: 2,
        }}
      >
        <ListItemIcon sx={{ minWidth: 36, color: '#222' }}>{item.icon}</ListItemIcon>
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

  return (
    <Box
      sx={{
        width: 240,
        backgroundColor: '#fff',
        borderRight: '1px solid #f3f1e7',
        minHeight: '100%',
        py: 2,
        px: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <List>
        {menuItems.map((item) => (
          <MenuItem key={item.id} item={item} isActive={activeItem === item.id} />
        ))}
      </List>

      <Divider sx={{ my: 2, background: '#f3f1e7' }} />
      <Typography
        variant="caption"
        sx={{
          px: 2,
          py: 1,
          color: '#888',
          fontWeight: 500,
          letterSpacing: 1,
        }}
      >
        PAGES
      </Typography>
      <List>
        {pagesMenuItems.map((item) => (
          <MenuItem key={item.id} item={item} isActive={activeItem === item.id} />
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />
      <Divider sx={{ my: 2, background: '#f3f1e7' }} />
      <List>
        {bottomMenuItems.map((item) => (
          <MenuItem key={item.id} item={item} isActive={activeItem === item.id} />
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
