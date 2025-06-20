import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Avatar,
  Typography,
  Divider,
  Paper,
  Button,
  TextField,
} from "@mui/material";
import { useAuth } from "../context/auth-context";
import { useNavigate } from "react-router-dom";
import { ReviewForUser } from "../types";
import { getReviewsByUser } from "../services/review-service";
import CommentModal from "../components/commentModal";

const CustomerProfilePage: React.FC = () => {
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
    } else {
      if (user.role !== "customer") {
        navigate("/dashboard");
      }
      fetchReviews();
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    // Clear any existing debounce timer
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Set a new debounce timer
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
    }, 500); // 500ms debounce delay

    // Cleanup function to clear timeout if searchTerm changes quickly
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
    <Box sx={{ p: 4, position: "relative" }}>
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
        }}
      >
        Logout
      </Button>

      {/* Header */}
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", textAlign: "center" }}>
        Welcome back, {user?.name}!
      </Typography>

      {/* User Info */}
      <Paper sx={{ p: 3, mb: 4, maxWidth: 600, mx: "auto" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            src={user?.profileImage || "/default-user.png"}
            sx={{ width: 64, height: 64 }}
          />
          <Box>
            <Typography variant="h6" sx={{ textAlign: "center" }}>
              {user?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
              {user?.email}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Reviews Section */}
      <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
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
        }}
      >
        {filteredReviews.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
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
                boxShadow: 1,
                bgcolor: "background.paper",
                "&:hover": {
                  bgcolor: "grey.100",
                },
                textAlign: "center",
              }}
            >
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                color="gray"
                sx={{ mb: 1 }}
              >
                {review.businessId?.BusinessName || "Unknown Business"}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {review.text.length > 100
                  ? `${review.text.slice(0, 100)}... (click to read more)`
                  : review.text}
              </Typography>
              <Divider />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
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
