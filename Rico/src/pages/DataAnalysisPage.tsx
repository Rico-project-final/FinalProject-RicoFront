import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useLanguage } from "../context/language/LanguageContext";
import DataCard from "../components/dataCard";
import CommentsColumn from "../components/commentsColumn";
import { ReviewAnalysis } from "../types";
import { getAllReviewAnalyses } from "../services/reviewAnalaysis-service";


export const DataAnalysisPage: React.FC = () => {
  const theme = useTheme();
  const {  t } = useLanguage();
  const [reviewsAnalasys, setReviewsAnalasys] = useState<ReviewAnalysis[]>();
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const fetchReviewsAnalysis = async (currentPage: number) => {
    try {
      const response = await getAllReviewAnalyses(currentPage, 10);
      setReviewsAnalasys((prev) => [...(prev ?? []), ...response.data.reviews]);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error("Failed to fetch review analyses:", error);
      setError("Failed to fetch review analyses");
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchReviewsAnalysis(page);
  }, [page]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const nearBottom = scrollTop + clientHeight >= scrollHeight - 100;

    if (nearBottom && !isLoadingMore && page < totalPages) {
      setIsLoadingMore(true);
      setPage((prev) => prev + 1);
    }
  };

  return (
    <Box
      onScroll={handleScroll}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflowY: "auto",
        bgcolor: theme.palette.background.default,
        flex: 1
      }}
    >
      <Box component="main" sx={{ p: 4 }}>
        {/* Title */}
        <Typography
          variant="h4"
          sx={{ mb: 3, color: theme.palette.text.primary ,textAlign:"center"}}
        >
          {t("dataAnalysis")}
        </Typography>

        {error && (
          <Typography
            color="error"
            sx={{ mb: 2, fontWeight: "bold" }}
          >
            {error}
          </Typography>
        )}

        {/* Chart Data Cards */}
        <Box sx={{ display: "flex", gap: 3, mb: 4 }}>
          <DataCard
            title="experience"
            initialReviews={(reviewsAnalasys ?? []).filter(
              (r) => r.category === "overall experience"
            )}
          />
          <DataCard
            title="service"
            initialReviews={(reviewsAnalasys ?? []).filter(
              (r) => r.category === "service"
            )}
          />
          <DataCard
            title="food"
            initialReviews={(reviewsAnalasys ?? []).filter(
              (r) => r.category === "food"
            )}
          />
        </Box>

        {/* Comments Section */}
        <Box sx={{ display: "flex", gap: 3 }}>
          {/* Positive Comments */}
          <CommentsColumn
            type="positive"
            comments={
              reviewsAnalasys?.filter((item) => item.sentiment === "positive") ||
              []
            }
          />

          {/* Negative Comments */}
          <CommentsColumn
            type="negative"
            comments={
              reviewsAnalasys?.filter((item) => item.sentiment === "negative") ||
              []
            }
          />
        </Box>
      </Box>
    </Box>
  );
};
