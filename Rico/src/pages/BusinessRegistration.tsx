import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Container,
  useTheme,
} from "@mui/material";
import ricoLogo from "../assets/rico-logo.png";
import { useLanguage } from "../context/language/LanguageContext";
import LoginModal from "../components/loginModal";
import { useAuth } from "../context/auth-context";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';


const BusinessRegistrationPage: React.FC = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const {
    user,
    registerBusiness,
    isLoading,
    registerBusinessWithGoogle,
    clearError,
  } = useAuth();
  const { t } = useLanguage();

  const [form, setForm] = useState({
  name: "",
  email: "",
  password: "",
  phone: "",
  companyName: "",
});

  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    companyName: "",
  });

  const validateForm = () => {
    const errors: any = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{7,15}$/;

    if (!form.name.trim()) errors.name = "Name is required";
    if (!form.email.trim()) errors.email = "Email is required";
    else if (!emailRegex.test(form.email)) errors.email = "Invalid email format";
    if (!form.password.trim()) errors.password = "Password is required";
    else if (form.password.length < 6) errors.password = "Password must be at least 6 characters";
    if (!form.phone.trim()) errors.phone = "Phone is required";
    else if (!phoneRegex.test(form.phone)) errors.phone = "Phone must be numeric and 10 digits";
    if (!form.companyName.trim()) errors.companyName = "Company name is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" })); // Clear error on input
  };

  const handleSubmit = async () => {
  clearError();
  if (!validateForm()) return;

  try {
    await registerBusiness(
      form.email,
      form.password,
      form.companyName,
      form.name,
      form.phone
    );
  } catch (err: any) {
    console.error("Register failed:", err);

    // Check if error message matches
    const errorMessage = err.response?.data?.message || '';
    if (err.response?.status === 400 && errorMessage === 'Email already exists') {
      alert('Email already exists');
    } else {
      alert(errorMessage || 'Registration failed');
    }
  }
};
const handleGoogleSignUpSuccess = async (credentialResponse: any) => {
  try {
    clearError();
    const credential = credentialResponse.credential;

    if (!validateForm()) return;

    await registerBusinessWithGoogle(
      credential,
      form.password,
      form.companyName,
      form.phone
    );

    navigate('/dashboard');
  } catch (err) {
    console.error("Google Sign-up failed:", err);
    alert("Google Sign-up failed");
  }
};


  useEffect(() => {
    if (user) {
      if (user.role === "admin") navigate("/dashboard");
      else {
        setLoginOpen(false);
        navigate("/customerProfile");
      }
    }
  }, [user, loginOpen, navigate]);

  return (
    <Box sx={{ fontFamily: "Arial, sans-serif", backgroundColor: theme.palette.background.default }}>
      <Button
        onClick={() => setLoginOpen(true)}
        sx={{
          position: "fixed",
          top: 16,
          right: 16,
          background: "#fff",
          borderRadius: "1rem",
          padding: "0.5rem 1rem",
          fontSize: "1rem",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          color: "black",
          textTransform: "none",
          zIndex: 1000,
          "&:hover": { background: "#eee" },
        }}
      >
        {t("login")}
      </Button>
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

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
        <Box sx={{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", display: "flex" }}>
          <Box component="img" src={ricoLogo} alt="Rico Logo" sx={{ height: 80, mb: 2 }} />
          <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>Rico</Typography>
        </Box>
        <Typography variant="h5">your AI helper for your business</Typography>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap", mt: 3 }}>
          <Button sx={buttonsSxProp} variant="outlined" color="secondary" href="#services">
            About our services
          </Button>
          <Button sx={buttonsSxProp} variant="outlined" color="secondary" href="#register">
            Register your business
          </Button>
          <Button sx={buttonsSxProp} variant="outlined" color="secondary" href="#benefits">
            Benefits from RICO
          </Button>
        </Box>
      </Box>

      {/* Services Section */}
      <Box id="services" sx={{ py: 6, px: 3 }}>
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom color="secondary">About Our Services</Typography>
          <Typography variant="body1" color="text.primary">
            Rico helps businesses analyze customer feedback using advanced AI to uncover key insights, improve service, and make better decisions.
          </Typography>
        </Container>
      </Box>

      {/* Register Section */}
      <Box id="register" sx={{ py: 6, px: 3, backgroundColor: theme.palette.mode === "dark" ? "#1e1e1e" : "#e8eef4" }}>
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom color="secondary">Get started with Rico’s services</Typography>
          <Typography variant="body2" gutterBottom color="text.secondary">Fill out the form below to register your business</Typography>
          <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField
              name="name"
              label="Name"
              required
              variant="outlined"
              value={form.name}
              onChange={handleChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
            />
            <TextField
              name="email"
              label="Email"
              type="email"
              required
              variant="outlined"
              value={form.email}
              onChange={handleChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
            />
            <TextField
              name="password"
              label="Password"
              type="password"
              required
              variant="outlined"
              value={form.password}
              onChange={handleChange}
              error={!!formErrors.password}
              helperText={formErrors.password}
            />
            <TextField
              name="phone"
              label="Phone"
              required
              variant="outlined"
              value={form.phone}
              onChange={handleChange}
              error={!!formErrors.phone}
              helperText={formErrors.phone}
            />
            <TextField
              name="companyName"
              label="Company Name"
              required
              variant="outlined"
              value={form.companyName}
              onChange={handleChange}
              error={!!formErrors.companyName}
              helperText={formErrors.companyName}
            />
            
            <Box sx={{ mt: 3, alignSelf: "center" , display:"flex",alignItems:"center", justifyContent: "center",  gap: 2 }}>
              <Button
              onClick={handleSubmit}
              variant="contained"
              color="secondary"
              sx={[buttonsSxProp, { alignSelf: "center" }]}
              disabled={isLoading}
            >
              Register Now
            </Button>

            <GoogleLogin
              onSuccess={handleGoogleSignUpSuccess}
              onError={() => alert("Google Sign-Up failed")}
              useOneTap={false}
            />
          </Box>

          </Box>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Box id="benefits" sx={{ py: 6, px: 3 }}>
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom color="secondary">
            What Can You Benefit from RICO
          </Typography>
          <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
            With RICO, you’ll get:
          </Typography>
          <Box component="ul" sx={{ pl: 4, color: "text.primary" }}>
            <li>Automated sentiment analysis of customer reviews</li>
            <li>Task suggestions based on AI insights</li>
            <li>Performance tracking dashboards</li>
            <li>Seamless integration into your business workflow</li>
          </Box>
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
  textTransform: "none",
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
};
