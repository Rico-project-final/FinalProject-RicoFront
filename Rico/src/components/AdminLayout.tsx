import React from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const user = {
  username: 'yuval miles',
  userRole: 'Admin',
  userImage: 'https://randomuser.me/api/portraits/women/44.jpg',
};

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#f8f7f3' }} dir="rtl">
      <Sidebar />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar {...user} />
        <Box sx={{ p: 4, flex: 1 }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default AdminLayout; 