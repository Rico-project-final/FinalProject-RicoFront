import React, { useEffect, useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Button
} from "@mui/material";
import { useAuth } from "../context/auth-context";
import { useNavigate } from "react-router-dom";
// import {  } from "../services/user-service";  
import { Review } from "../types";

const CustomerProfilePage: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);

  //TODO :: finish server endpoint to fetch reviews by user
  const fetchReviews = async () => {
    // try {
    //   const response = await getReviewsByUser(user._id);
    //   setReviews(response.data);
    // } catch (error) {
    //   console.error("Failed to fetch reviews", error);
    // }
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

      {/* User Info */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            src={user?.profileImage || "/default-user.png"}
            sx={{ width: 64, height: 64 }}
          />
          <Box>
            <Typography variant="h6">{user?.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Reviews Section */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Your Reviews
      </Typography>
      <List component={Paper} sx={{ p: 2 }}>
        {/* TODO :: Add pagination - only display 15 each time */}
        {reviews.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No reviews submitted yet.
          </Typography>
        ) : (
          reviews.map((review) => (
            <ListItem
              key={review._id}
              sx={{ flexDirection: "column", alignItems: "flex-start" }}
            >
              <ListItemText
                primary={review.text}
                secondary={`Created at: ${new Date(
                  review.createdAt
                ).toLocaleDateString()}`}
              />
              <Divider sx={{ width: "100%", my: 1 }} />
            </ListItem>
          ))
        )}
      </List>
    </Box>
  );
};

export default CustomerProfilePage;
