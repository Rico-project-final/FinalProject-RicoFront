import React, { useState } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useLanguage } from "../context/language/LanguageContext";
import { ReviewAnalysis } from "../types";
import SendEmailModal from "./SendEmailModal";

const CommentsColumn: React.FC<{
  comments: ReviewAnalysis[];
  type: "positive" | "negative";
}> = ({ comments, type }) => {
  const { t } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<ReviewAnalysis | null>(null);

  const handleOpenModal = (analysis: ReviewAnalysis) => {
    setSelectedAnalysis(analysis);
    setModalOpen(true);
  };

  return (
    <Box sx={{ flex: 1 }}>
      <Typography
        variant="h6"
        fontWeight="bold"
        textAlign="center"
        color={type === "positive" ? "#2e7d32" : "#c62828"}
        sx={{ mb: 2 }}
      >
        {t(type)}
      </Typography>

      {comments.map((comment, idx) => (
        <Paper
          key={comment.reviewId || idx}
          sx={{
            bgcolor: type === "positive" ? "#eafaf3" : "#faecea",
            borderRadius: 2,
            p: 2,
            mb: 2,
          }}
        >
          <Typography sx={{ mb: 1 }}>{comment.text}</Typography>
          <Button
            variant="outlined"
            size="small"
              sx={{
                  mt: 1,
                  backgroundColor: "#fff",
                  color: type === "positive" ? "green" : "red",
                  borderColor: type === "positive" ? "green" : "red",
                  '&:hover': {
                    backgroundColor: "#f0f0f0",
                  },
          }}
            onClick={() => handleOpenModal(comment)}
          >
            הצעה לטיפול
          </Button>
        </Paper>
      ))}

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
