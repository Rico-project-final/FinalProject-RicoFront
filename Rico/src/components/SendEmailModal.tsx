import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  Snackbar,
  Alert,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { sendResponseToCustomer } from "../services/business-service";

interface SendEmailModalProps {
  open: boolean;
  onClose: () => void;
  email: string;
  text: string;
}

const SendEmailModal: React.FC<SendEmailModalProps> = ({
  open,
  onClose,
  email,
  text,
}) => {
  const theme = useTheme(); // 👈 Access MUI theme
  const [emailResponse, setEmailResponse] = useState<string>(text);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  useEffect(() => {
    setEmailResponse(text);
  }, [text]);

  const handleSendEmail = async () => {
    try {
      if (!email || !text) return;

      const response = await sendResponseToCustomer(email, emailResponse);
      if (response.status !== 200) throw new Error("Failed to send email");

      setSnackbarMessage("Email sent successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      onClose();
    } catch (error) {
      console.error("Failed to send email:", error);
      setSnackbarMessage("Failed to send email. Please try again later.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: 320, sm: 400 },
            bgcolor: theme.palette.background.default, // respects light/dark mode
            color: theme.palette.text.primary, // ensures text color adjusts
            boxShadow: 24,
            p: 4,
            borderRadius: 3,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: theme.palette.text.primary, // explicitly override
              }}
            >
              Admin Response
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={4}
            value={emailResponse}
            onChange={(e) => setEmailResponse(e.target.value)}
            placeholder="Enter your admin response..."
            sx={{
              backgroundColor: theme.palette.mode === "dark" ? "#2c2c2c" : "#fff",
              borderRadius: 1,
            }}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleSendEmail}
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                },
              }}
            >
              Send Email
            </Button>
          </Box>
        </Box>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{
            width: "100%",
            bgcolor: theme.palette.mode === "dark" ? "#333" : "#fefefe",
            color: theme.palette.text.primary,
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SendEmailModal;
