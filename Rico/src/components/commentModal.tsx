import React from "react";
import {
  Box,
  Modal,
  Typography,
  IconButton,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface CommentModalProps {
  open: boolean;
  comment: string;
  clientName: string;
  commentDate: string | Date;
  onClose: () => void;
}

const CommentModal: React.FC<CommentModalProps> = ({
  open,
  comment,
  clientName,
  commentDate,
  onClose,
}) => {
  const formattedDate = new Date(commentDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="comment-modal-title"
      aria-describedby="comment-modal-description"
    >
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
        {/* Header section: date left, name right */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {formattedDate}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="h6">{clientName}</Typography>
            <IconButton aria-label="close" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Comment content */}
        <Typography id="comment-modal-description">
          {comment}
        </Typography>
      </Box>
    </Modal>
  );
};

export default CommentModal;
