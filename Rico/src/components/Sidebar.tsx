/**
 * Sidebar Component
 * -----------------
 * Provides a vertical navigation menu for the app with main navigation links,
 * pages section, and a logout button at the bottom.
 * 
 * Features:
 * - Highlights the active menu item based on current URL path
 * - Supports dark and light themes with corresponding styles
 * - Handles logout functionality and redirects to home
 */

import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
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
  const theme = useTheme(); // MUI theme for styling
  const location = useLocation(); // current URL path to track active menu item
  const navigate = useNavigate(); // navigation function for redirects
  const { logout } = useAuth(); // auth context to handle logout

  // State to track which menu item is currently active
  const [activeItem, setActiveItem] = useState(location.pathname);

  // Define main menu navigation items with icon and label
  const menuItems = [
    { id: '/dashboard', label: 'בית', icon: <HomeIcon /> },
    { id: '/reviews', label: 'תגובות', icon: <GridViewIcon /> },
    { id: '/data-analysis', label: 'ניתוח נתונים', icon: <BarChartIcon /> },
    { id: '/optimization', label: 'הצעות ייעול', icon: <AssignmentIcon /> },
  ];

  // Secondary pages menu items
  const pagesMenuItems = [
    { id: '/customers', label: 'לקוחות', icon: <PeopleIcon /> },
    { id: '/todo', label: 'משימות', icon: <CheckBoxIcon /> },
  ];

  // Bottom menu item for logout
  const bottomMenuItems = [{ id: '/logout', label: 'התנתק', icon: <LogoutIcon /> }];

  // Handle menu item clicks - update active item, handle logout logic
  const handleItemClick = async (id: string) => {
    setActiveItem(id);
    if (id === '/logout') {
      await logout();
      navigate('/'); // Redirect to home or login page after logout
    }
  };

  const isDark = theme.palette.mode === 'dark'; // Track dark mode for styling

  // Component for rendering a single menu item with styles and behavior
  const MenuItem = ({
    item,
    isActive,
  }: {
    item: { id: string; label: string; icon: React.ReactNode };
    isActive: boolean;
  }) => {
    // Define colors based on theme mode and active state
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
          // Use Link for navigation except for logout (button)
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
      {/* Main menu items */}
      <List>
        {menuItems.map((item) => (
          <MenuItem key={item.id} item={item} isActive={activeItem === item.id} />
        ))}
      </List>

      {/* Divider and PAGES section label */}
      <Divider sx={{ my: 2, backgroundColor: isDark ? theme.palette.divider : '#f3f1e7' }} />


      {/* Pages menu items */}
      <List>
        {pagesMenuItems.map((item) => (
          <MenuItem key={item.id} item={item} isActive={activeItem === item.id} />
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />
      <Divider sx={{ my: 2, backgroundColor: isDark ? theme.palette.divider : '#f3f1e7' }} />

      {/* Logout button */}
      <List>
        {bottomMenuItems.map((item) => (
          <MenuItem key={item.id} item={item} isActive={activeItem === item.id} />
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
