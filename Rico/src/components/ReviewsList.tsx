/**
 * ReviewsList Component
 * ---------------------
 * Displays a list of reviews added during the week.
 * Each review is clickable and triggers a modal showing more details.
 *
 * Props:
 * - reviews: array of Review objects to display
 * - onOpenModal: callback function to open the modal, receives
 *   the comment text, client name, and comment date
 */

import React from "react";
import { Box, Typography, Divider, Paper } from "@mui/material";
import { Review } from "../types";

interface ReviewsListProps {
  reviews: Review[];
  onOpenModal: (comment: string, clientName: string, date: string | Date) => void;
}

const ReviewsList: React.FC<ReviewsListProps> = ({ reviews, onOpenModal }) => {
  return (
    <Paper
      sx={{
        flex: 1,             
        p: 3,                
        borderRadius: 2,     
        overflow: "hidden",  
      }}
    >
      <Box>
        <Typography
          sx={{ fontWeight: "bold", fontSize: 20, textAlign: "center", mb: 2 }}
        >
          ביקורות שהתווספו השבוע
        </Typography>

        {/* Map over each review */}
        {reviews.map((c, i) => (
          <Box key={i} sx={{ mb: 2 }}>
            {/* Review text is clickable */}
            <Typography
              sx={{ mb: 1, cursor: "pointer", fontSize: 14, color: "text.primary" }}
              onClick={() =>
                onOpenModal(
                  c.text,
                  // Determine client name based on source
                  c.source === "google"
                    ? c.authorName || "Google תגובה מ"
                    : (c.userId as { name: string })?.name || "Anonymous",
                  c.createdAt // Pass the date to modal
                )
              }
            >
              {c.text}
            </Typography>

            {/* Divider except after last review */}
            {i < reviews.length - 1 && (
              <Divider sx={{ mt: 2, borderColor: "divider" }} />
            )}
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default ReviewsList;
