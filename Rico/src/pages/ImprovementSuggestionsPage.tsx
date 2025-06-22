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
  CircularProgress,
} from "@mui/material";
import { useLanguage } from "../context/language/LanguageContext";
import {
  getAllReviewAnalyses,
  updateReviewAnalysisResolved,
} from "../services/reviewAnalaysis-service";
import { createTask } from "../services/task-service";
import { ReviewAnalysis } from "../types";
import DueDateModal from "../components/dueDateModal";

export const ImprovementSuggestionsPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const [reviewAnalaysis, setReviewAnalaysis] = useState<ReviewAnalysis[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string>("");
  const [selectedSummary, setSelectedSummary] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");

  const fetchAllReviewAnalyses = async (currentPage: number) => {
    try {
      const response = await getAllReviewAnalyses(currentPage, 15);
      setReviewAnalaysis((prev) => [...prev, ...response.data.reviews]);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error("Failed to fetch review analyses", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchAllReviewAnalyses(page);
  }, [page]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const nearBottom = scrollTop + clientHeight >= scrollHeight - 100;
    if (nearBottom && !isLoadingMore && page < totalPages) {
      setIsLoadingMore(true);
      setPage((prev) => prev + 1);
    }
  };

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
    } catch (err) {
      console.error("Failed to create task:", err);
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
        bgcolor: "#e7e1d2",
        direction: lang === "he" ? "rtl" : "ltr",
        px: 4,
        py: 4,
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          {"הצעות ייעול"}
        </Typography>

        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            boxShadow: "0 2px 8px #0001",
            backgroundColor: "#fff",
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f2e7" }}>
                <TableCell sx={headCellSx} width={120}>
                  {t("addTask")}
                </TableCell>
                <TableCell sx={headCellSx}>{t("suggestion")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reviewAnalaysis
                .filter((review) => review.isResolved === false && review.suggestions)
                .map((s) => (
                  <TableRow key={s.reviewId}>
                    <TableCell align="center">
                      <Button onClick={() => handleClickSuggestion(s.reviewId)}>
                        {t("addTask")}
                      </Button>
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>{s.suggestions}</TableCell>
                  </TableRow>
                ))}
              {isLoadingMore && (
                <TableRow>
                  <TableCell colSpan={2} align="center" sx={{ py: 2 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
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
