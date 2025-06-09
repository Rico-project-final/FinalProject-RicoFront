import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  MenuItem,
  Container,
  useTheme,
} from "@mui/material";
import ricoLogo from "../assets/rico-logo.png"; // Update path if needed
import { useLanguage } from "../context/language/LanguageContext";
import LoginModal from "../components/loginModal";
import { useAuth } from "../context/auth-context";
import { useNavigate } from "react-router-dom";

const BusinessRegistrationPage: React.FC = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const { user} = useAuth();
  const { t } = useLanguage();
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
      if (user) {
        if (user.role === 'admin') {
          navigate('/dashboard');
        } else {
          setLoginOpen(false);
          navigate('/customerProfile')
        }
      }
    }, [user, loginOpen, navigate]);

  return (
    <Box
      sx={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: theme.palette.background.default,
        scrollBehavior: "smooth",
      }}
    >
      {/* Login Button - top right */}
        <Button
          onClick={() => setLoginOpen(true)}
          sx={{
          position: 'fixed',
          top: 16,
          right: 16,
          background: '#fff',
          borderRadius: '1rem',
          padding: '0.5rem 1rem',
          fontSize: '1rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          color: 'black',
          textTransform: 'none',
          zIndex: 1000,
          '&:hover': {
            background: '#eee',
          },
        }}
        >
          {t("login")}
        </Button>
        {/* Login Modal */}
              <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      {/* Header */}
      <Box
        sx={{
            display: "flex",
          flexDirection: "column",
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.secondary.main,
          textAlign: "center",
          py: 6,
        }}
      >
        <Box sx={{flexDirection: "row",justifyContent:"space-evenly", alignItems: "center", display: "flex"}}>
            <Box
          component="img"
          src={ricoLogo}
          alt="Rico Logo"
          sx={{
            height: 80,
            mb: 2,
          }}
        />
        <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
          Rico
        </Typography>
        </Box>
        
        <Typography variant="h5">your AI helper for your business</Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            flexWrap: "wrap",
            mt: 3,
          }}
        >
          <Button  sx={buttonsSxProp } variant="outlined" color="secondary" href="#services">
            About our services
          </Button>
          <Button sx={buttonsSxProp } variant="outlined" color="secondary" href="#register">
            Register your business
          </Button>
          <Button sx={buttonsSxProp } variant="outlined" color="secondary" href="#benefits">
           benefits from RICO
          </Button>
        </Box>
      </Box>

      {/* Section 1 */}
      <Box id="services" sx={{ py: 6, px: 3 }}>
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom color="secondary">
            About Our Services
          </Typography>
          <Typography variant="body1" color="text.primary">
            Rico helps businesses analyze customer feedback using advanced AI to uncover key
            insights, improve service, and make better decisions. From sentiment analysis to
            task automation — RICO’s got your back.
          </Typography>
        </Container>
      </Box>

      {/* Section 2 */}
      <Box
        id="register"
        sx={{
          py: 6,
          px: 3,
          backgroundColor: theme.palette.mode === "dark" ? "#1e1e1e" : "#e8eef4",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom color="secondary">
            Get started with Rico’s services
          </Typography>
          <Typography variant="body2" gutterBottom color="text.secondary">
            Fill out the form below to register your business
          </Typography>
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 2,
            }}
          >
            <TextField label="First Name" required variant="outlined" />
            <TextField label="Last Name" required variant="outlined" />
            <TextField label="Email" type="email" required variant="outlined" />
            <TextField label="Company Name" required variant="outlined" />
            <TextField
              label="Industry"
              select
              defaultValue=""
              required
              variant="outlined"
            >
              <MenuItem value="tech">Technology</MenuItem>
              <MenuItem value="food">Food & Beverage</MenuItem>
              <MenuItem value="fashion">Fashion</MenuItem>
              <MenuItem value="health">Health</MenuItem>
            </TextField>
            <Button type="submit" variant="contained" color="secondary" sx={[buttonsSxProp,{ alignSelf: "center" }]}>
              Register Now
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Section 3 */}
      <Box id="benefits" sx={{ py: 6, px: 3 }}>
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom color="secondary">
            What Can You Benefit from RICO
          </Typography>
          <Typography variant="body1" color="text.primary">
            With RICO, you’ll get:
            <ul>
              <li>Automated sentiment analysis of customer reviews</li>
              <li>Task suggestions based on AI insights</li>
              <li>Performance tracking dashboards</li>
              <li>Seamless integration into your business workflow</li>
            </ul>
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default BusinessRegistrationPage;


const buttonsSxProp = {
    position: "relative",
  transition: "all 0.3s ease-in-out",
  boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
  py: 0.5,
  px: 1.25,
  backgroundColor: "rgb(0, 107, 179)",
  borderRadius: "99px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  gap: "10px",
  fontWeight: "bold",
  border: "3px solid #ffffff4d",
  outline: "none",
  overflow: "hidden",
  fontSize: "14px",
  cursor: "pointer",
   textTransform: "none" ,
  "&:hover": {
    transform: "scale(1.05)",
    borderColor: "#fff9",
    "& .icon": {
      transform: "translateX(4px)",
    },
    "&::before": {
      animation: "shine 1.5s ease-out infinite",
    },
  },
  "& .icon": {
    width: "24px",
    height: "24px",
    transition: "all 0.3s ease-in-out",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    width: "100px",
    height: "100%",
    backgroundImage:
      "linear-gradient(120deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.8), rgba(255,255,255,0) 70%)",
    top: 0,
    left: "-100px",
    opacity: 0.6,
  },
}