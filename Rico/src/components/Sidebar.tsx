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
  useTheme,
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
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeItem, setActiveItem] = useState(location.pathname);

  const menuItems = [
    { id: '/dashboard', label: 'בית', icon: <HomeIcon /> },
    { id: '/reviews', label: 'תגובות', icon: <GridViewIcon /> },
    { id: '/data-analysis', label: 'ניתוח נתונים', icon: <BarChartIcon /> },
    { id: '/optimization', label: 'הצעות ייעול', icon: <AssignmentIcon /> },
  ];

  const pagesMenuItems = [
    { id: '/customers', label: 'לקוחות', icon: <PeopleIcon /> },
    { id: '/todo', label: 'משימות', icon: <CheckBoxIcon /> },
  ];

  const bottomMenuItems = [{ id: '/logout', label: 'התנתק', icon: <LogoutIcon /> }];

  const handleItemClick = async (id: string) => {
    setActiveItem(id);
    if (id === '/logout') {
      await logout();
      navigate('/'); // Redirect to home or login page
    }
  };

  const isDark = theme.palette.mode === 'dark';

  const MenuItem = ({
    item,
    isActive,
  }: {
    item: { id: string; label: string; icon: React.ReactNode };
    isActive: boolean;
  }) => {
    // Colors based on theme and active state
    const activeBgColor = isDark ? theme.palette.primary.dark : '#f3f1e7';
    const hoverBgColor = isDark ? theme.palette.primary.main : '#ece8d9';
    const textColor = isActive
      ? isDark
        ? theme.palette.primary.contrastText
        : '#222'
      : isDark
      ? theme.palette.text.primary
      : '#222';
    const iconColor = textColor;

    return (
      <ListItem disablePadding>
        <ListItemButton
          component={item.id === '/logout' ? 'button' : Link}
          to={item.id !== '/logout' ? item.id : undefined}
          onClick={() => handleItemClick(item.id)}
          selected={isActive}
          sx={{
            borderRadius: 2,
            mb: 0.5,
            color: textColor,
            backgroundColor: isActive ? activeBgColor : 'transparent',
            '&:hover': {
              backgroundColor: isActive ? hoverBgColor : isDark ? theme.palette.action.hover : '#f3f1e7',
            },
            '&.Mui-selected': {
              backgroundColor: activeBgColor,
              color: textColor,
              '&:hover': {
                backgroundColor: hoverBgColor,
              },
            },
            minHeight: 44,
            pl: 2,
            pr: 2,
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: iconColor }}>{item.icon}</ListItemIcon>
          <ListItemText
            primary={item.label}
            primaryTypographyProps={{
              fontSize: 15,
              fontWeight: isActive ? 600 : 400,
              fontFamily: 'inherit',
              color: textColor,
            }}
          />
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Box
      sx={{
        width: 240,
        backgroundColor: isDark ? theme.palette.background.paper : '#fff',
        borderRight: `1px solid ${isDark ? theme.palette.divider : '#f3f1e7'}`,
        minHeight: '100vh',
        py: 2,
        px: 1,
        display: 'flex',
        flexDirection: 'column',
        color: isDark ? theme.palette.text.primary : undefined,
      }}
    >
      <List>
        {menuItems.map((item) => (
          <MenuItem key={item.id} item={item} isActive={activeItem === item.id} />
        ))}
      </List>

      <Divider sx={{ my: 2, backgroundColor: isDark ? theme.palette.divider : '#f3f1e7' }} />
      <List>
        {pagesMenuItems.map((item) => (
          <MenuItem key={item.id} item={item} isActive={activeItem === item.id} />
        ))}
      </List>

      <Box />
      <Divider sx={{ my: 2, backgroundColor: isDark ? theme.palette.divider : '#f3f1e7' }} />
      <List>
        {bottomMenuItems.map((item) => (
          <MenuItem key={item.id} item={item} isActive={activeItem === item.id} />
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
