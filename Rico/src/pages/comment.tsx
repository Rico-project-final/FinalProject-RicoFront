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

  // Function to open modal on comment click
  const handleCommentClick = (commentText: string) => {
    setSelectedComment(commentText);
    setModalOpen(true);
  };
  // Function to close modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedComment("");
  };

  // Function for the modal's handle button
  const handleModalButtonClick = () => {
    alert("Handle button clicked!");
    handleCloseModal();
  };

  // Load data
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getAllReviews();
        setAllReviews(response.data);
        setFilteredReviews(response.data);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };
    fetchReviews();
  }, []);

  // Handle filters
  const applyFilters = () => {
    let filtered = [...allReviews];

    if (nameFilter.trim()) {
      filtered = filtered.filter((review) =>
        review.userId !== null && typeof review.userId === "object" && "name" in review.userId
          ? review.userId.name.toLowerCase().includes(nameFilter.trim().toLowerCase())
          : false
      );
    }

    if (dateFilter) {
      filtered = filtered.filter((review) =>
        new Date(review.createdAt).toDateString() === new Date(dateFilter).toDateString()
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

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
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

          {/* Date input */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <InputBase
              type="date"
              value={dateFilter || ""}
              onChange={(e) => setDateFilter(e.target.value)}
              sx={dateInputSx}
              placeholder="Select date"
              inputProps={{ max: today }} // Prevent future dates 
              
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
                <TableCell sx={thSx} align="center">
                  {t("clientName")}
                </TableCell>
                <TableCell sx={thSx} align="center">
                  {t("date")}
                </TableCell>
                <TableCell sx={thSx} align="center">
                  {t("reviewDesc")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReviews.map((review) => (
                <TableRow
                  key={review._id}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleCommentClick(review.text)}
                >
                  <TableCell sx={tdSx} align="center">
                    {review.userId !== null && typeof review.userId === "object" && "name" in review.userId
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
            </TableBody>
          </Table>
        </Paper>
            <CommentModal
          open={modalOpen}
          comment={selectedComment}
          onClose={handleCloseModal}
          onHandleClick={handleModalButtonClick}
          handleButtonText="Confirm"
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
