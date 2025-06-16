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
import { ReviewAnalysis , SendEmailPayload} from "../types";
import { sendAdminResponseEmail } from "../services/reviewAnalaysis-service";

interface ReviewAnalysisModalProps {
  open: boolean;
  onClose: () => void;
  reviewAnalysis: ReviewAnalysis | null;
}

const ReviewAnalysisModal: React.FC<ReviewAnalysisModalProps> = ({
  open,
  onClose,
  reviewAnalysis,
}) => {
  const [text, setText] = useState("");

  useEffect(() => {
    setText(reviewAnalysis?.adminResponse ?? "");
  }, [reviewAnalysis]);

  // TODO :: 
const handleSendEmail = async () => {
  try {
    if (!reviewAnalysis) {
      alert("No review selected.");
      return;
    }

    let customerEmail = "";

    if (
      reviewAnalysis.userId &&
      typeof reviewAnalysis.userId === "object" &&
      "email" in reviewAnalysis.userId
    ) {
      customerEmail = reviewAnalysis.userId.email;
    }
    console.log("reviewId:", reviewAnalysis.reviewId);
    console.log("adminResponse:", text);
    console.log("Customer Email:", customerEmail);
   /* const payload = {
      reviewId: reviewAnalysis.reviewId,
      adminResponse: text,
      customerEmail, 
    } as SendEmailPayload;

    await sendAdminResponseEmail(payload); */

    alert("Email sent successfully!");
    onClose();
  } catch (error) {
    console.error("Failed to send email:", error);
    alert("Failed to send email. Please try again later.");
  }
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
