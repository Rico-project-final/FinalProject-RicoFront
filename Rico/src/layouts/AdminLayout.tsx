import React from 'react';
import { Box } from '@mui/material';
import Sidebar from '../components/Sidebar';
import AppNavbar from '../components/Navbar';
import { useCustomTheme } from "../context/ThemeContext";

interface LayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<LayoutProps> = ({ children }) => {
  const { mode } = useCustomTheme(); 

  return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: mode === 'dark' ? '#121212' : '#f8f7f3', 
      }}
    >
      <AppNavbar />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
