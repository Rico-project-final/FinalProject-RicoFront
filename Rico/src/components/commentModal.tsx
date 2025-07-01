/**
 * CommentModal Component
 * ----------------------
 * This component displays a modal dialog with a single client comment.
 * It includes:
 * - Client name and formatted date at the top
 * - The comment body in the center
 * - A close button in the top-right corner
 *
 * Props:
 * - open: Whether the modal is visible
 * - comment: The content of the comment
 * - clientName: Name of the customer who wrote the comment
 * - commentDate: Date the comment was written (string or Date object)
 * - onClose: Function to close the modal
 */


import React from "react";
import {
  Box,
  Modal,
  Typography,
  IconButton,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// Define the props for the CommentModal component
interface CommentModalProps {
  open: boolean;           // Whether the modal is open
  comment: string;         // The text of the comment
  clientName: string;      // The name of the client who wrote the comment
  commentDate: string | Date; // The date the comment was written
  onClose: () => void;     // Callback to close the modal
}

// CommentModal component definition
const CommentModal: React.FC<CommentModalProps> = ({
  open,
  comment,
  clientName,
  commentDate,
  onClose,
}) => {
  // Format the comment date as "DD MMM YYYY"
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
        {/* Header section: shows the date and client name + close button on the right */}
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

        {/* Comment body section */}
        <Typography id="comment-modal-description">
          {comment} {/* Display the actual comment text */}
        </Typography>
      </Box>
    </Modal>
  );
};

export default CommentModal;
