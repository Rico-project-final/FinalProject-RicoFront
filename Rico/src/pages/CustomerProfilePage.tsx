/**
 * CustomerProfilePage Component
 * -----------------------------
 * This page is shown to authenticated customers and displays their review history.
 * It includes:
 * - Authentication check and role-based redirect
 * - Fetching reviews from the backend
 * - Search input with debounce to filter reviews by text or business name
 * - Display of each review in a card-style list
 * - Modal popup to view full comment details
 * - Logout button for ending the session
 */

import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Divider,
  Paper,
  Button,
  TextField,
  useTheme,
} from "@mui/material";
import { useAuth } from "../context/auth-context";
import { useNavigate } from "react-router-dom";
import { ReviewForUser } from "../types";
import { getReviewsByUser } from "../services/review-service";
import CommentModal from "../components/commentModal";
import AppNavbar from "../components/Navbar";

const CustomerProfilePage: React.FC = () => {
  const theme = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<ReviewForUser[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<ReviewForUser[]>([]);
  const [selectedReview, setSelectedReview] = useState<ReviewForUser | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchReviews = async () => {
    try {
      const response = await getReviewsByUser();
      setReviews(response.data);
      setFilteredReviews(response.data);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/");
    } else if (user.role !== "customer") {
      navigate("/dashboard");
    } else {
      fetchReviews();
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
  if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

  debounceTimeout.current = setTimeout(() => {
    const lowerTerm = searchTerm.toLowerCase();
    setFilteredReviews(
      searchTerm.trim() === ""
        ? reviews
        : reviews.filter((r) =>
            [r.businessId?.BusinessName ?? "", r.text]
              .join(" ")
              .toLowerCase()
              .includes(lowerTerm)
          )
    );
  }, 500);

  // ✅ ניקוי בטוח שמחזיר תמיד void
  return () => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
  };
}, [searchTerm, reviews]);


  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Box
      sx={{
        p: 4,
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
        minHeight: "100vh",
      }}
    >
      <AppNavbar />

      {/* Logout Button */}
      <Box
        sx={{
          position: "fixed",
          bottom: 24,
          left: 24,
          zIndex: 1300,
        }}
      >
        <Button
          onClick={handleLogout}
          variant="outlined"
          color="error"
          sx={{
            fontWeight: "bold",
            textTransform: "none",
            borderRadius: 3,
            fontSize: "1.1rem",
            px: 3,
            py: 1,
            bgcolor: theme.palette.background.paper,
            "&:hover": {
              bgcolor: theme.palette.action.hover,
            },
          }}
        >
          התנתק
        </Button>
      </Box>

      {/* Header */}
      <Typography
        variant="h4"
        sx={{ mb: 4, fontWeight: "bold", textAlign: "center" }}
      >
        שלום, {user?.name || "לקוח יקר"}!
      </Typography>

      {/* Subheader */}
      <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
        התגובות שלך
      </Typography>

      {/* Search Input */}
      <Box sx={{ maxWidth: 600, mx: "auto", mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="חפש לפי שם עסק או תוכן תגובה..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            sx: {
              bgcolor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.divider,
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.primary.light,
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.primary.main,
              },
            },
          }}
        />
      </Box>

      {/* Reviews List */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          maxWidth: 600,
          mx: "auto",
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {filteredReviews.length === 0 ? (
          <Typography
            variant="body2"
            sx={{ textAlign: "center", color: theme.palette.text.secondary }}
          >
            לא נמצאו תגובות.
          </Typography>
        ) : (
          filteredReviews.map((review) => (
            <Box
              key={review._id}
              onClick={() => setSelectedReview(review)}
              sx={{
                cursor: "pointer",
                p: 2,
                borderRadius: 2,
                boxShadow: theme.shadows[1],
                bgcolor: theme.palette.background.default,
                "&:hover": {
                  bgcolor: theme.palette.action.hover,
                },
              }}
            >
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                sx={{ mb: 1, color: theme.palette.text.secondary }}
              >
                {review.businessId?.BusinessName || "עסק לא ידוע"}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                {review.text.length > 100
                  ? `${review.text.slice(0, 100)}... (לחץ לקריאה נוספת)`
                  : review.text}
              </Typography>
              <Divider sx={{ borderColor: theme.palette.divider }} />
              <Typography variant="caption" color="text.secondary">
                נכתב בתאריך: {new Date(review.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          ))
        )}
      </Paper>

      {/* Modal */}
      {selectedReview && (
        <CommentModal
          open={Boolean(selectedReview)}
          comment={selectedReview.text}
          clientName={user?.name || "לקוח"}
          commentDate={selectedReview.createdAt}
          onClose={() => setSelectedReview(null)}
        />
      )}
    </Box>
  );
};

export default CustomerProfilePage;
