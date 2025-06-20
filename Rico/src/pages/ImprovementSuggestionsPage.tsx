import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useLanguage } from "../context/language/LanguageContext";
import {
  getAllReviewAnalyses,
  updateReviewAnalysisResolved,
} from "../services/reviewAnalaysis-service";
import { createTask } from "../services/task-service";
import { ReviewAnalysis } from "../types";
import DueDateModal from "../components/dueDateModal";

export const ImprovementSuggestionsPage: React.FC = () => {
  const theme = useTheme();
  const { lang, t } = useLanguage();
  const [reviewAnalaysis, setReviewAnalaysis] = useState<ReviewAnalysis[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string>("");
  const [selectedSummary, setSelectedSummary] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");

  const fetchAllReviewAnalyses = async () => {
    try {
      const response = await getAllReviewAnalyses();
      setReviewAnalaysis(response.data);
    } catch (error) {
      console.error("Failed to fetch review analyses", error);
    }
  };

  useEffect(() => {
    fetchAllReviewAnalyses();
  }, []);

  const handleClickSuggestion = (reviewId: string) => {
    const review = reviewAnalaysis.find((r) => r.reviewId === reviewId);
    if (!review) return;

    setSelectedReviewId(reviewId);
    setSelectedSuggestion(review.suggestions || "New Suggestion");
    setSelectedSummary(review.analysisSummary);
    setIsModalOpen(true);
  };

  const handleCreateTask = async (selectedDueDate: string) => {
    if (!selectedReviewId) return;

    try {
      await updateReviewAnalysisResolved(selectedReviewId);
      //TODO :: Replace "admin" with real userId from context
      await createTask({
        title: selectedSuggestion,
        description: selectedSummary,
        relatedReview: selectedReviewId,
        isCompleted: false,
        dueDate: selectedDueDate,
        createdBy: "admin", // Replace with real userId from context
      });
      setReviewAnalaysis((prev) =>
        prev.map((review) =>
          review.reviewId === selectedReviewId
            ? { ...review, isResolved: true }
            : review
        )
      );
      setIsModalOpen(false);
      setDueDate("");
      setSelectedReviewId(null);
      fetchAllReviewAnalyses();
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        direction: lang === "he" ? "rtl" : "ltr",
        px: 4,
        py: 4,
        color: theme.palette.text.primary,
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          הצעות לשיפור
        </Typography>

        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            boxShadow: "0 2px 8px #0001",
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: theme.palette.action.hover }}>
                <TableCell sx={headCellSx} width={120}>
                  {t("addTask")}
                </TableCell>
                <TableCell sx={headCellSx}>{t("suggestion")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* TODO :: Add pagination - only display 15 each time */}
              {reviewAnalaysis
                .filter((review) => review.isResolved === false)
                .map((s, i) =>
                  s.suggestions ? (
                    <TableRow key={i}>
                      <TableCell align="center">
                        <Button onClick={() => handleClickSuggestion(s.reviewId)}>
                          {t("addTask")}
                        </Button>
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>{s.suggestions}</TableCell>
                    </TableRow>
                  ) : null
                )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <DueDateModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleCreateTask}
        dueDate={dueDate}
        setDueDate={setDueDate}
        title={t("selectDueDate")}
      />
    </Box>
  );
};

const headCellSx = {
  fontWeight: 700,
  px: 2,
  py: 1.5,
};

export default ImprovementSuggestionsPage;
