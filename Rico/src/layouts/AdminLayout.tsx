import React from 'react';
import { Box } from '@mui/material';
import Sidebar from '../components/Sidebar';
import AppNavbar from '../components/Navbar'

interface LayoutProps {
  children: React.ReactNode;
  handleToggle: () => void;
  isDarkMode: boolean;
}
const AdminLayout: React.FC<LayoutProps> = ({ children, handleToggle, isDarkMode }) => {
  return (
   
       <Box sx={{display: 'flex', flex:1 , flexDirection: 'column', minHeight: '100vh', background: '#f8f7f3'  }}>
        <AppNavbar handleToggle={handleToggle} isDarkMode={isDarkMode}/>
        <Box sx={{display: 'flex', minHeight: '100vh'}} >
       <Sidebar />
        {children}
    </Box>
    </Box>
  );
};

export default AdminLayout; 