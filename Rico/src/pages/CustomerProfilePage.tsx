import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Avatar,
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
      const response = await getReviewsByUser(user?.id!);
      setReviews(response.data.reviews);
      setFilteredReviews(response.data.reviews);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/");
    } else {
      if (user.role !== "customer") {
        navigate("/dashboard");
      }
      fetchReviews();
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      if (searchTerm.trim() === "") {
        setFilteredReviews(reviews);
        return;
      }

      const lowerTerm = searchTerm.toLowerCase();

      const filtered = reviews.filter((review) => {
        const businessName = review.businessId?.BusinessName?.toLowerCase() || "";
        const reviewText = review.text.toLowerCase();

        return (
          businessName.includes(lowerTerm) ||
          reviewText.includes(lowerTerm)
        );
      });

      setFilteredReviews(filtered);
    }, 500);

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
        position: "relative",
        bgcolor: theme.palette.mode === "dark" ? "#121212" : "background.default",
        color: theme.palette.text.primary,
        minHeight: "100vh",
      }}
    >
      {/* Sticky Logout Button */}
      <Button
        onClick={handleLogout}
        variant="outlined"
        color="error"
        sx={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 999,
          fontWeight: "bold",
          bgcolor: theme.palette.mode === "dark" ? "#333" : undefined,
          "&:hover": {
            bgcolor: theme.palette.mode === "dark" ? "#444" : undefined,
          },
        }}
      >
        Logout
      </Button>

      {/* Header */}
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          fontWeight: "bold",
          textAlign: "center",
          color: theme.palette.text.primary,
        }}
      >
        Welcome back, {user?.name}!
      </Typography>

      {/* User Info */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          maxWidth: 600,
          mx: "auto",
          bgcolor: theme.palette.mode === "dark" ? "#1e1e1e" : "background.paper",
          color: theme.palette.text.primary,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            src={user?.profileImage || "/default-user.png"}
            sx={{ width: 64, height: 64 }}
          />
          <Box>
            <Typography
              variant="h6"
              sx={{ textAlign: "center", color: theme.palette.text.primary }}
            >
              {user?.name}
            </Typography>
            <Typography
              variant="body2"
              color={theme.palette.text.secondary}
              sx={{ textAlign: "center" }}
            >
              {user?.email}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Reviews Section */}
      <Typography
        variant="h6"
        sx={{ mb: 2, textAlign: "center", color: theme.palette.text.primary }}
      >
        Your Reviews
      </Typography>

      {/* Search box */}
      <Box sx={{ maxWidth: 600, mx: "auto", mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by business name or review text..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            sx: {
              bgcolor: theme.palette.mode === "dark" ? "#2c2c2c" : undefined,
              color: theme.palette.text.primary,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.mode === "dark" ? "#555" : undefined,
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.mode === "dark" ? "#888" : undefined,
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.mode === "dark" ? "#aaa" : undefined,
              },
            },
          }}
          sx={{
            input: {
              color: theme.palette.text.primary,
            },
          }}
        />
      </Box>

      <Box
        component={Paper}
        sx={{
          p: 2,
          maxWidth: 600,
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          bgcolor: theme.palette.mode === "dark" ? "#1e1e1e" : "background.paper",
          color: theme.palette.text.primary,
        }}
      >
        {filteredReviews.length === 0 ? (
          <Typography
            variant="body2"
            color={theme.palette.text.secondary}
            sx={{ textAlign: "center" }}
          >
            No reviews found.
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
                boxShadow: theme.palette.mode === "dark" ? "0 0 8px #222" : 1,
                bgcolor: theme.palette.mode === "dark" ? "#2c2c2c" : "background.paper",
                "&:hover": {
                  bgcolor: theme.palette.mode === "dark" ? "#3a3a3a" : "grey.100",
                },
                textAlign: "center",
              }}
            >
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                color={theme.palette.mode === "dark" ? "#aaa" : "gray"}
                sx={{ mb: 1 }}
              >
                {review.businessId?.BusinessName || "Unknown Business"}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1, color: theme.palette.text.primary }}>
                {review.text.length > 100
                  ? `${review.text.slice(0, 100)}... (click to read more)`
                  : review.text}
              </Typography>
              <Divider sx={{ borderColor: theme.palette.divider }} />
              <Typography
                variant="caption"
                color={theme.palette.text.secondary}
                sx={{ mt: 1 }}
              >
                Created at: {new Date(review.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          ))
        )}
      </Box>

      {/* Comment Modal */}
      {selectedReview && (
        <CommentModal
          open={Boolean(selectedReview)}
          comment={selectedReview.text}
          clientName={user?.name || "Customer"}
          commentDate={selectedReview.createdAt}
          onClose={() => setSelectedReview(null)}
        />
      )}
    </Box>
  );
};

export default CustomerProfilePage;
