import React from "react";
import {
  Box,
  Modal,
  Typography,
  IconButton,
  Button,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface CommentModalProps {
  open: boolean;
  comment: string;
  clientName: string;
  commentDate: string | Date;
  onClose: () => void;
  onHandleClick: () => void;
  handleButtonText?: string;
}

const CommentModal: React.FC<CommentModalProps> = ({
  open,
  comment,
  clientName,
  commentDate,
  onClose,
  onHandleClick,
  handleButtonText = "Handle",
}) => {
  const formattedDate = new Date(commentDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="comment-modal-title" aria-describedby="comment-modal-description">
      <Box
        component={Paper}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 3,
          outline: "none",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography id="comment-modal-title" variant="h6" component="h2">
            {clientName} - {formattedDate}
          </Typography>
          <IconButton aria-label="close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography id="comment-modal-description" sx={{ mb: 3 }}>
          {comment}
        </Typography>
        <Button variant="contained" fullWidth onClick={onHandleClick}>
          {handleButtonText}
        </Button>
      </Box>
    </Modal>
  );
};

export default CommentModal;
