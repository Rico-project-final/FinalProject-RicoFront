import React, { useEffect, useState } from "react";
import { useLanguage } from "../context/language/LanguageContext";
import dayjs from "dayjs";
import {
  Box,
  Button,
  Container,
  InputBase,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import { getAllReviews, triggerAllReviewAnalyses } from "../services/review-service";
import { Review } from "../types";
import CommentModal from "../components/commentModal";

export const CommentsPage: React.FC = () => {
  const today = dayjs().format("YYYY-MM-DD");
  const { lang, t } = useLanguage();
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [nameFilter, setNameFilter] = useState("");
  const [dateFilter, setDateFilter] = useState(today);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState<string>("");
  const [selectedClientName, setSelectedClientName] = useState<string>("");
  const [selectedCommentDate, setSelectedCommentDate] = useState<string>("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleCommentClick = (commentText: string, clientName: string, createdAt: string) => {
    setSelectedComment(commentText);
    setSelectedClientName(clientName);
    setSelectedCommentDate(new Date(createdAt).toLocaleDateString());
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedComment("");
  };

  const fetchReviews = async (currentPage: number) => {
    try {
      const response = await getAllReviews(currentPage, 15);
      setAllReviews((prev) => [...prev, ...response.data.reviews]);
      console.log("Fetched reviews:", response.data.reviews);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchReviews(page);
  }, [page]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const nearBottom = scrollTop + clientHeight >= scrollHeight - 100;

    if (nearBottom && !isLoadingMore && page < totalPages) {
      setIsLoadingMore(true);
      setPage((prev) => prev + 1);
    }
  };

  const applyFilters = () => {
    let filtered = [...allReviews];

    if (nameFilter.trim()) {
      filtered = filtered.filter((review) =>
        review.userId !== null &&
        typeof review.userId === "object" &&
        "name" in review.userId &&
        review.userId.name.toLowerCase().includes(nameFilter.trim().toLowerCase())
      );
    }

    if (dateFilter) {
      filtered = filtered.filter(
        (review) =>
          new Date(review.createdAt).toDateString() ===
          new Date(dateFilter).toDateString()
      );
    }

    setFilteredReviews(filtered);
  };

  const resetFilters = () => {
    setNameFilter("");
    setDateFilter(today);
    setFilteredReviews(allReviews);
  };

  const handleAllReviewAnalysis = async () => {
    await triggerAllReviewAnalyses();
  };

useEffect(() => {
  setFilteredReviews(allReviews); // show all by default
}, [allReviews]);

  return (
    <Box
      onScroll={handleScroll}
      sx={{
        display: "flex",
        height: "100vh",
        overflowY: "auto",
        bgcolor: "#e7e1d2",
        direction: lang === "he" ? "rtl" : "ltr",
      }}
    >
      <Container maxWidth="xl" sx={{ flex: 1, py: 4 }}>
        {/* Filters */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            mb: 2,
            flexWrap: "nowrap",
            overflowX: "auto",
            minHeight: "56px",
          }}
        >
          <InputBase
            placeholder={t("clientName")}
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            sx={dateInputSx}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <InputBase
              type="date"
              value={dateFilter || ""}
              onChange={(e) => setDateFilter(e.target.value)}
              sx={dateInputSx}
              placeholder="Select date"
              inputProps={{ max: today }}
            />
          </Box>

          <Button variant="outlined" onClick={applyFilters} sx={filterBtnSx}>
            {t("filter")}
          </Button>
          <Button
            variant="outlined"
            onClick={resetFilters}
            sx={{
              ...filterBtnSx,
              color: "#d44",
              borderColor: "#d44",
              ml: lang === "en" ? 0 : "auto",
              mr: lang === "he" ? 0 : "auto",
            }}
          >
            {t("resetFilter")}
          </Button>
          <Button
            variant="outlined"
            onClick={handleAllReviewAnalysis}
            sx={{ ...filterBtnSx, color: "green" }}
          >
            {t("Analyze")}
          </Button>
        </Box>

        {/* Table */}
        <Paper
          elevation={3}
          sx={{
            borderRadius: 2,
            overflow: "auto",
            bgcolor: "#f8f6f2",
            minHeight: "400px",
          }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="comments table">
            <TableHead>
              <TableRow sx={{ bgcolor: "#ede6d6", textAlign: "center" }}>
                <TableCell sx={thSx} align="center">{t("clientName")}</TableCell>
                <TableCell sx={thSx} align="center">{t("date")}</TableCell>
                <TableCell sx={thSx} align="center">{t("reviewDesc")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReviews.map((review) => (
                <TableRow
                  key={review._id}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() =>
                    handleCommentClick(
                      review.text,
                      review.userId && typeof review.userId === "object" && "name" in review.userId
                        ? review.userId.name
                        : "-",
                      review.createdAt
                    )
                  }
                >
                  <TableCell sx={tdSx} align="center">
                    {review.userId && typeof review.userId === "object" && "name" in review.userId
                      ? review.userId.name
                      : "-"}
                  </TableCell>
                  <TableCell sx={tdSx} align="center">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell sx={{ ...tdSx, maxWidth: 300 }} align="center">
                    <Box
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "300px",
                      }}
                      title={review.text}
                    >
                      {review.text}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}

              {isLoadingMore && (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 2 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>

        <CommentModal
          open={modalOpen}
          comment={selectedComment}
          clientName={selectedClientName}
          commentDate={selectedCommentDate}
          onClose={handleCloseModal}
        />
      </Container>
    </Box>
  );
};

// Styles
const filterBtnSx = {
  borderRadius: "20px",
  bgcolor: "#f3f0ea",
  border: "1px solid #cfc6b0",
  fontWeight: "bold",
  fontSize: 14,
  px: 2.5,
  py: 0.5,
};

const dateInputSx = {
  border: "1px solid #cfc6b0",
  bgcolor: "#f3f0ea",
  borderRadius: "20px",
  px: 2.5,
  py: 0.5,
  fontWeight: "bold",
  fontSize: 14,
};

const thSx = {
  fontWeight: "bold",
  borderBottom: "2px solid #e0d7c6",
  py: 2,
};

const tdSx = {
  py: 1.5,
};

export default CommentsPage;
