import { createTheme } from '@mui/material/styles';

// Light and dark mode theme configurations
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#f1e0c6',
    },
    secondary: {
      main: '#212121',
    },
    background: {
      default: '#f4f6f8',
    },
    text: {
      primary: '#212121',
      secondary: '#555555',
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    background: {
      default: "#222831", 
      paper: "#2e3440",   
    },
    text: {
      primary: "#eeeeee",
      secondary: "#b0bec5",
    },
  },
});


export { lightTheme, darkTheme };
