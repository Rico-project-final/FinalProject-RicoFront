import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ReviewAnalysisModalProps {
  open: boolean;
  onClose: () => void;
  initialText?: string;
}

const ReviewAnalysisModal: React.FC<ReviewAnalysisModalProps> = ({
  open,
  onClose,
  initialText = "",
}) => {
  const [text, setText] = useState(initialText);

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  const handleSendEmail = () => {
    console.log("Sending admin response email:", text);

    // Example: Here you would actually call your email API or service
    // await sendEmailToAdmin({ message: text });

    alert("Email sent!"); // Feedback to user
    onClose(); // Optional: close modal after sending
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">Admin Response</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your admin response..."
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button variant="contained" onClick={handleSendEmail}>
            Send Email
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ReviewAnalysisModal;
