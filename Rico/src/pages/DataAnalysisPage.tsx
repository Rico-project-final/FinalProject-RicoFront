import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useLanguage } from "../context/language/LanguageContext";
import DataCard from "../components/dataCard";
import CommentsColumn from "../components/commentsColumn";
import { ReviewAnalysis } from "../types";
import { getAllReviewAnalyses } from "../services/reviewAnalaysis-service";

export const DataAnalysisPage: React.FC = () => {
  const [reviewsAnalasys, setReviewsAnalasys] = useState<ReviewAnalysis[]>();
  const [error, setError] = useState<string | null>(null);

  const { lang, t } = useLanguage();

  useEffect(() => {
  const fetchReviews = async () => {
    try {
      const response = await getAllReviewAnalyses();
      setReviewsAnalasys(response.data); 
    } catch (error) {
      console.error("Failed to fetch review analyses:", error);
      setError("Failed to fetch review analyses");
    }
  };

  fetchReviews();
}, []);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#e7e1d2",
        direction: lang === "he" ? "rtl" : "ltr",
      }}
    >
      <Box component="main" sx={{ flex: 1, p: 4 }}>
        {/* Title */}
        <Typography variant="h4" sx={{ mb: 3 }}>
          {t("dataAnalysis")}
        </Typography>

        {/* Error display */}
        {error && (
          <Typography color="error" sx={{ mb: 2, fontWeight: "bold" }}>
            {error}
          </Typography>
        )}

        {/* Chart Data Cards */}
        <Box sx={{ display: "flex", gap: 3, mb: 4 }}>
          <DataCard
            title="experience"
            initialReviews={(reviewsAnalasys ?? []).filter((r) => r.category === "overall experience")}
          />
          <DataCard
            title="service"
            initialReviews={(reviewsAnalasys ?? []).filter((r) => r.category === "service")}
          />
          <DataCard
            title="food"
            initialReviews={(reviewsAnalasys ?? []).filter((r) => r.category === "food")}
          />
        </Box>

        {/* Comments Section */}
        <Box sx={{ display: "flex", gap: 3 }}>
          {/* Positive Comments */}
          <CommentsColumn
            type="positive"
            comments={
              reviewsAnalasys?.filter((item) => item.sentiment === "positive") || []
            }
          />

          {/* Negative Comments */}
          <CommentsColumn
            type="negative"
            comments={
              reviewsAnalasys?.filter((item) => item.sentiment === "negative") || []
            }
          />
        </Box>
      </Box>
    </Box>
  );
};
