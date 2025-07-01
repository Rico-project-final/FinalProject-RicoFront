/**
 * CommentsColumn Component
 * ------------------------
 * Displays a list of comments grouped by sentiment type ("positive" or "negative").
 * Each comment is styled with a color gradient based on its type and current theme (light/dark).
 * Users can open a modal ("SendEmailModal") to send an email response related to a specific comment.
 * 
 * Props:
 * - comments: Array of ReviewAnalysis objects representing individual comments.
 * - type: Either "positive" or "negative" to distinguish comment sentiment.
 */

import React, { useState } from "react";
import { Box, Button, Paper, Typography, useTheme } from "@mui/material";
import { useLanguage } from "../context/language/LanguageContext";
import { ReviewAnalysis } from "../types";
import SendEmailModal from "./SendEmailModal";

// Props: array of comments (ReviewAnalysis) and type ("positive" or "negative")
const CommentsColumn: React.FC<{
  comments: ReviewAnalysis[];
  type: "positive" | "negative";
}> = ({ comments, type }) => {
  const { t } = useLanguage(); 
  const theme = useTheme(); 
  
  // State to control the modal and the selected comment
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<ReviewAnalysis | null>(null);

  // When user clicks "הצעה לטיפול" button, open the modal and set selected comment
  const handleOpenModal = (analysis: ReviewAnalysis) => {
    setSelectedAnalysis(analysis);
    setModalOpen(true);
  };

  // Background gradient based on sentiment (positive/negative) and theme mode
  const bgGradient =
    type === "positive"
      ? theme.palette.mode === "light"
        ? `linear-gradient(135deg, rgba(0, 123, 255, 0.5) 0%, rgba(0, 86, 179, 0.4) 100%), #cce5ff`
        : `linear-gradient(135deg, rgba(13, 71, 161, 0.95) 0%, rgba(2, 48, 113, 0.9) 100%), #0d47a1`
      : theme.palette.mode === "light"
      ? `linear-gradient(135deg, rgba(255, 111, 145, 0.5) 0%, rgba(230, 81, 101, 0.4) 100%), #ffd6dd`
      : `linear-gradient(135deg, rgba(198, 40, 64, 0.95) 0%, rgba(154, 26, 48, 0.9) 100%), #c62840`;

  const textColor =
    type === "positive"
      ? theme.palette.mode === "light"
        ? "#004a99"
        : "#bbdefb"
      : theme.palette.mode === "light"
      ? "#b31237"
      : "#f8bbd0";

  return (
    <Box sx={{ flex: 1 }}>
      {/* Section title: "Positive" or "Negative" */}
      <Typography
        variant="h6"
        fontWeight="bold"
        textAlign="center"
        color={textColor}
        sx={{ mb: 2 }}
      >
        {t(type)}
      </Typography>

      {/* Loop over each comment and display it in a styled Paper */}
      {comments.map((comment, idx) => (
        <Paper
          key={comment.reviewId || idx}
          sx={{
            bgcolor: bgGradient,
            borderRadius: 2,
            p: 2,
            mb: 2,
            color: textColor,
            boxShadow: `0 4px 10px ${
              type === "positive"
                ? theme.palette.mode === "light"
                  ? "rgba(0, 123, 255, 0.3)"
                  : "rgba(0,123,255,0.4)"
                : theme.palette.mode === "light"
                ? "rgba(255,111,145,0.3)"
                : "rgba(255,111,145,0.4)"
            }`,
          }}
          elevation={6}
        >
          {/* Comment text */}
          <Typography sx={{ mb: 1 }}>{comment.text}</Typography>

          
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="outlined"
              size="small"
              sx={{
                mt: 1,
                backgroundColor: theme.palette.background.paper,
                color: textColor,
                borderColor: textColor,
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
              onClick={() => handleOpenModal(comment)}
            >
              הצעה לטיפול 
            </Button>
          </Box>
        </Paper>
      ))}

      {/* Modal to send email based on selected comment */}
      <SendEmailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        email={(selectedAnalysis?.userId as { email: string })?.email || ""}
        text={selectedAnalysis?.adminResponse || ""}
      />
    </Box>
  );
};

export default CommentsColumn;
