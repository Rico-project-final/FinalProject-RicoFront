import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Box, 
  TextField, 
  InputAdornment, 
  Typography, 
  Avatar, 
  Stack 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface NavbarProps {
  username: string;
  userRole: string;
  userImage: string;
}

const Navbar: React.FC<NavbarProps> = ({ username, userRole, userImage }) => {
  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        backgroundColor: 'white', 
        color: 'text.primary',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Search Bar */}
        <Box sx={{ maxWidth: 'md', width: '100%', mx: 4 }}>
          <TextField
            placeholder="Search"
            variant="outlined"
            fullWidth
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
              sx: {
                backgroundColor: '#f5f5f5',
                borderRadius: '24px',
                '& fieldset': { border: 'none' },
              }
            }}
          />
        </Box>

        {/* Language and User Profile */}
        <Stack direction="row" spacing={4} alignItems="center">
          {/* Language Selector */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer'
            }}
          >
            <Typography sx={{ color: 'text.secondary' }}>Hebrew</Typography>
            <KeyboardArrowDownIcon sx={{ color: 'text.secondary' }} />
          </Box>

          {/* User Profile */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer'
            }}
          >
            <Avatar 
              src={userImage} 
              alt={username}
              sx={{ width: 40, height: 40, mr: 1 }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {username}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {userRole}
              </Typography>
            </Box>
            <KeyboardArrowDownIcon sx={{ color: 'text.secondary', ml: 0.5 }} />
          </Box>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;