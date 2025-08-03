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
import picAnalisis from "../assets/20c194b5-5edb-45a8-8cd3-d7dd5f4f74a6.png";
import LoginModal from "../components/loginModal";
import { useAuth } from "../context/auth-context";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';


const BusinessRegistrationPage: React.FC = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const {
    error,
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

  const validateForm = (isGoogle : boolean) => {
    const errors: any = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{7,15}$/;

    if (!form.name.trim()) errors.name = "Name is required";
    if (!form.email.trim() && !isGoogle) errors.email = "Email is required";
    else if (!emailRegex.test(form.email)&& !isGoogle) errors.email = "Invalid email format";
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
  if (!validateForm(false)) return;

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
  clearError();
  try {
    clearError();
    const credential = credentialResponse.credential;

    if (!validateForm(true)) return;

    await registerBusinessWithGoogle(
      credential,
      form.password,
      form.companyName,
      form.phone
    );

    navigate('/dashboard');
  } catch (err) {
    console.error("Google Sign-up failed:", err);
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
   <Box
      sx={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: theme.palette.background.default,
        scrollBehavior: "smooth",
        minHeight: "100vh",
      }}
    >
            {/* Login button */}
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
            background: '#f0f0f0',
            transform: 'scale(1.02)',
          },
        }}
      >
        {t("login")}
      </Button>
      {/* Login Modal */}
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

    {/* Logo Section - Separate */}
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
                {/* Decorative Background */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.3,
          }}
        />

        <Box sx={{ position: "relative", zIndex: 1 }}>
          {/* לוגו */}
          <Box
            sx={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              mb: 2,
              flexWrap: "wrap",
            }}
          >
            <Box
              component="img"
              src={ricoLogo}
              alt="Rico Logo"
              sx={{
                height: { xs: 140, md: 160 },
                mr: 2,
                filter: "brightness(0) invert(1)",
              }}
            />
          </Box>
          
          <Typography 
            variant="h5" 
            sx={{ 
              color: 'white', 
              opacity: 0.9,
              fontSize: { xs: '1.1rem', md: '1.3rem' }
            }}
          >
          </Typography>
        </Box>
      </Box>

      {/* Content Section - Text and Image */}
      <Box
        sx={{
          py: 8,
          px: 3,
          backgroundColor: 'white',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              textAlign: { xs: "center", md: "right" },
            }}
          >
            {/* תמונה מלווה */}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                order: { xs: 2, md: 1 }
              }}
            >
              <Box
                component="img"
                src={picAnalisis}
                alt="הדמיית ניתוח פידבק"
                sx={{
                  maxWidth: 500,
                  width: "100%",
                  
                }}
              />
            </Box>

            {/* טקסט - צד ימין */}
            <Box 
              sx={{ 
                flex: 1,
                maxWidth: 600, 
                direction: "rtl",
                order: { xs: 1, md: 2 }
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 'bold',
                  color: theme.palette.primary.main,
                  mb: 3,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  lineHeight: 1.2
                }}
              >
                המהפכה הדיגיטלית של העסק שלכם מתחילה כאן
              </Typography>
              
              <Typography
                variant="h6"
                color="text.primary"
                sx={{
                  lineHeight: 1.8,
                  fontSize: { xs: "1.1rem", md: "1.3rem" },
                  mb: 4,
                  color: theme.palette.text.secondary
                }}
              >
                Rico מסייע לעסקים להבין טוב יותר את הלקוחות שלהם באמצעות ניתוח משוב מבוסס בינה מלאכותית.
                <br />
                מערכת חכמה שחושפת רגשות, מזהה בעיות שירות, וממליצה על שיפורים – הכל בצורה אוטומטית ויעילה.
                <br />
                מרגשות לקוחות ועד תובנות אסטרטגיות – Rico הופך תגובות לפעולה.
                <br />
                <br />
                <strong style={{ color: theme.palette.primary.main }}>
                  הצטרפו עכשיו – וקבלו שליטה מלאה על חוויית הלקוח שלכם.
                </strong>
              </Typography>

              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Button
                  sx={buttonsSxProp}
                  variant="contained"
                  color="primary"
                  href="#register"
                  size="large"
                >
                  לחצו להרשמת העסק שלכם
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
      {/* Video Section */}
            <Box 
              id="video"
              sx={{ 
                py: 8, 
                px: 3,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: 'white'
              }}
            >
              <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                  <Typography 
                    variant="h3" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 'bold',
                      mb: 2,
                      color: 'white',
                      fontSize: { xs: '2rem', md: '3rem' }
                    }}
                  >
                    
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      maxWidth: 600, 
                      mx: 'auto', 
                      lineHeight: 1.6,
                      opacity: 0.9,
                      mb: 4,
                      fontSize: { xs: '1rem', md: '1.25rem' }
                    }}
                  >
                  </Typography>
                </Box>
      
                <Box
                  sx={{
                    position: 'relative',
                    maxWidth: 900,
                    mx: 'auto',
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    p: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
                    }
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      paddingBottom: '56.25%', // 16:9 aspect ratio
                      height: 0,
                      borderRadius: 3,
                      overflow: 'hidden',
                      background: '#000',
                    }}
                  >
                    <Box
                      component="iframe"
                      src="https://www.youtube.com/embed/3bakQ8Oh1mc"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: 'none',
                      }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </Box>
                </Box>
              </Container>
            </Box>

      {/* Register Section */}
      <Box
  id="register"
  sx={{
    py: 8,
    px: 3,
    background: `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`,
  }}
>
  <Container maxWidth="md">
    <Typography
      variant="h3"
      gutterBottom
      color="secondary"
      sx={{
        direction: "rtl",
        textAlign: "center",
        fontWeight: "bold",
        mb: 2,
        fontSize: { xs: "2rem", md: "3rem" },
      }}
    >
      התחילו עם השירותים של Rico
    </Typography>
    <Typography
      variant="h6"
      gutterBottom
      color="text.secondary"
      sx={{
        textAlign: "center",
        mb: 4,
        fontSize: { xs: "1rem", md: "1.25rem" },
      }}
    >
      מלאו את הטופס למטה כדי לרשום את העסק שלכם
    </Typography>

    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderRadius: 4,
        p: { xs: 3, md: 5 },
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        maxWidth: 600,
        mx: "auto",
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {error && <Box
  role="alert"
  sx={{
    backgroundColor: "#fdecea",
    color: "#611a15",
    padding: 2,
    border: "1px solid #f5c6cb",
    borderRadius: 1,
    marginY: 2,
  }}
>
  {error}
</Box>}
        <TextField
          name="name"
          label="שם מלא"
          required
          variant="outlined"
          fullWidth
          value={form.name}
          onChange={handleChange}
          error={!!formErrors.name}
          helperText={formErrors.name}
          sx={textFieldStyle}
        />
        <TextField
          name="email"
          label="אימייל"
          type="email"
          required
          variant="outlined"
          fullWidth
          value={form.email}
          onChange={handleChange}
          error={!!formErrors.email}
          helperText={formErrors.email}
          sx={textFieldStyle}
        />
        <TextField
          name="password"
          label="סיסמה"
          type="password"
          required
          variant="outlined"
          fullWidth
          value={form.password}
          onChange={handleChange}
          error={!!formErrors.password}
          helperText={formErrors.password}
          sx={textFieldStyle}
        />
        <TextField
          name="phone"
          label="טלפון"
          required
          variant="outlined"
          fullWidth
          value={form.phone}
          onChange={handleChange}
          error={!!formErrors.phone}
          helperText={formErrors.phone}
          sx={textFieldStyle}
        />
        <TextField
          name="companyName"
          label="שם העסק"
          required
          variant="outlined"
          fullWidth
          value={form.companyName}
          onChange={handleChange}
          error={!!formErrors.companyName}
          helperText={formErrors.companyName}
          sx={textFieldStyle}
        />

        <Box
          sx={{
            mt: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="secondary"
            sx={[
              buttonsSxProp,
              {
                px: 6,
                py: 2,
                fontSize: "1.1rem",
                mt: 2,
              },
            ]}
            disabled={isLoading}
          >
            הירשמו עכשיו
          </Button>

          <GoogleLogin
            onSuccess={handleGoogleSignUpSuccess}
            onError={() => alert("Google Sign-Up failed")}
            useOneTap={false}
          />
        </Box>
      </Box>
    </Box>
  </Container>
</Box>


{/* Benefits Section */}
      <Box id="benefits" sx={{ 
        py: 8, 
        px: 3, 
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: 'white'
      }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            gutterBottom 
            color="secondary" 
            sx={{ 
              direction: "rtl",
              textAlign: "center", 
              fontWeight: "bold", 
              mb: 6,
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            מה אתם יכולים להרוויח מ-RICO
          </Typography>
          
          <Box sx={{ 
            direction: "rtl",
            textAlign: "right",
            display: 'flex', 
            flexDirection: 'column', 
            gap: 4,
            maxWidth: 800,
            mx: 'auto'
          }}>
            {[
              {
                title: "ניתוח סנטימנט אוטומטי",
                description: "ניתוח סנטימנט אוטומטי של ביקורות לקוחות באמצעות אלגוריתמי בינה מלאכותית מתקדמים"
              },
              {
                title: "הצעות משימות מבוססות AI", 
                description: "הצעות משימות מבוססות תובנות בינה מלאכותית לשיפור פעילות העסק שלכם"
              },
              {
                title: "דשבורד מעקב ביצועים",
                description: "דשבורד מעקב ביצועים עם אנליטיקה בזמן אמת ותובנות מתקדמות"
              },
              {
                title: "אינטגרציה חלקה",
                description: "אינטגרציה חלקה לתהליכי העבודה של העסק שלכם ללא הפרעה לפעילות השוטפת"
              }
            ].map((benefit, index) => (
              <Box
                key={index}
                sx={{
                  p: 4,
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: 3,
                  boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                  border: `1px solid ${theme.palette.divider}`,
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
                    borderColor: theme.palette.primary.main,
                  }
                }}
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.primary.main,
                    mr: 3,
                    flexShrink: 0,
                  }}
                />
                <Box>
                  <Typography 
                    variant="h6" 
                    color="text.primary"
                    sx={{ fontWeight: 'bold', mb: 1 }}
                  >
                    {benefit.title}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}
                  >
                    {benefit.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
      {/* Footer */}
      <Box
        sx={{
          backgroundColor: `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`,
          color: 'black',
          textAlign: 'center',
          py: 6,
          px: 3,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" sx={{ opacity: 0.6 }}>
            © 2025 Rico. כל הזכויות שמורות
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default BusinessRegistrationPage;
const textFieldStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    '&:hover fieldset': {
      borderColor: '#006bb3',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#006bb3',
    },
  },
};
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
