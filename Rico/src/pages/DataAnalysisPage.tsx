import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useLanguage } from "../context/language/LanguageContext";
import DataCard from "../components/dataCard";
import CommentsColumn from "../components/commentsColumn";
import ReviewAnalysisModal from "../components/ReviewAnalysisModal";
import { ReviewAnalysis } from "../types";
import { getAllReviewAnalyses } from "../services/reviewAnalaysis-service";

export const DataAnalysisPage: React.FC = () => {
  const [reviewsAnalasys, setReviewsAnalasys] = useState<ReviewAnalysis[]>();
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState<string>("");
  const [selectedAnalysis, setSelectedAnalysis] = useState<ReviewAnalysis | null>(null);

  const { lang, t } = useLanguage();

  const fetchReviewsAnalysis = async () => {
    try {
      const response = await getAllReviewAnalyses();
      setReviewsAnalasys(response.data);
    } catch (error) {
      console.error("Failed to fetch review analyses:", error);
      setError("Failed to fetch review analyses");
    }
  };

  useEffect(() => {
    fetchReviewsAnalysis();
  }, []);

  const handleOpenModal = (comment: string) => {
    setSelectedComment(comment);
    setModalOpen(true);
  };

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
            title={t("experience")}
            reviews={
              (reviewsAnalasys ?? []).filter((r) => r.category === "overall")
            }
          />
          <DataCard
            title={t("service")}
            reviews={
              (reviewsAnalasys ?? []).filter((r) => r.category === "service")
            }
          />
          <DataCard
            title={t("food")}
            reviews={
              (reviewsAnalasys ?? []).filter((r) => r.category === "food")
            }
          />
        </Box>

        {/* Comments Section */}
        <Box sx={{ display: "flex", gap: 3 }}>
          {/* Positive Comments */}
          <CommentsColumn
            type="positive"
            comments={
              reviewsAnalasys
                ?.filter((item) => item.sentiment === "positive")
                .map((item) => item.text || "") || []
            } 
            onCommentClick={handleOpenModal}
          />

          {/* Negative Comments */}
          <CommentsColumn
            type="negative"
            comments={
              reviewsAnalasys
                ?.filter((item) => item.sentiment === "negative")
                .map((item) => item.text || "") || []
            }
            onCommentClick={handleOpenModal}
          />
        </Box>

        {/* Suggest Treatment Modal */}
        {/* TODO :: set defoult value to be sugeested response*/}
        <ReviewAnalysisModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          initialText={selectedComment}
        />
      </Box>
    </Box>
  );
};
