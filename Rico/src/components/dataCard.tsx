/**
 * DataCard Component
 * ------------------
 * This component displays a summary card for review sentiment data, such as "food", "service", or "overall".
 * It allows the user to select a time range (week, month, or year), and filters the reviews accordingly.
 * The filtered results are visualized using a donut chart and a counter showing the total number of reviews.
 * 
 * Props:
 * - title: A label for the category being displayed (e.g., "food", "service").
 * - initialReviews: All reviews available for this category; will be filtered based on selected time range.
 * 
 * This component is styled using MUI and supports light/dark theme via `useTheme`.
 */

import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  useTheme,
} from "@mui/material";
import DonutChart from "./SentimentChart";
import { ReviewAnalysis } from "../types";
import { useLanguage } from "../context/language/LanguageContext";
import dayjs from "dayjs";

// Props: title ("food", "service", or "overall") and the list of all initial reviews
interface DataCardProps {
  title: string;
  initialReviews: ReviewAnalysis[];
}

const DataCard: React.FC<DataCardProps> = ({ title, initialReviews }) => {
  const theme = useTheme(); // Access MUI theme (for light/dark mode)
  const { t } = useLanguage(); // Translation function from context

  // State for selected time range (week, month, or year)
  const [timePeriod, setTimePeriod] = useState<"week" | "month" | "year">("week");
  
  // State to hold the filtered reviews based on timePeriod
  const [filteredReviews, setFilteredReviews] = useState<ReviewAnalysis[]>([]);

  // Effect runs when `initialReviews`, `timePeriod`, or `title` changes
  useEffect(() => {
    const now = dayjs(); // Current date
    const startDate =
      timePeriod === "week"
        ? now.subtract(7, "day")
        : timePeriod === "month"
        ? now.subtract(1, "month")
        : now.subtract(1, "year"); // Calculate start date based on selected period

    // Filter reviews based on the calculated start date
    const reviews = initialReviews.filter((review) => {
      const created = dayjs(new Date(review.createdAt));
      return created.isValid() && created.isAfter(startDate);
    });

    setFilteredReviews(reviews); // Update filtered reviews
  }, [initialReviews, timePeriod, title]);

  // Handle timePeriod dropdown change
  const handleChange = (event: SelectChangeEvent) => {
    setTimePeriod(event.target.value as "week" | "month" | "year");
  };

  return (
    <Paper
      sx={{
        flex: 1,
        p: 3,
        minWidth: 220,
        borderRadius: 2,
        boxShadow: "0 2px 8px #0001", // Subtle box shadow
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      }}
    >
      {/* Card title ("food", "service", or "overall") */}
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
        {t(title as keyof typeof t)} {/* Translate the title */}
      </Typography>

      {/* Dropdown to select time period */}
      <FormControl variant="standard" sx={{ mb: 1, minWidth: 100, mx: "auto" }}>
        <Select
          value={timePeriod}
          onChange={handleChange}
          disableUnderline
          variant="standard"
          displayEmpty
          sx={{
            fontSize: 13,
            fontWeight: 500,
            color: theme.palette.text.primary,
            "& .MuiSelect-select": {
              display: "flex",
              justifyContent: "center",
              paddingY: 0.5,
              paddingX: 1,
            },
            "& .MuiSvgIcon-root": {
              fontSize: 22,
              color: theme.palette.text.primary,
            },
          }}
        >
          {/* Time period options */}
          <MenuItem value="week">This Week</MenuItem>
          <MenuItem value="month">This Month</MenuItem>
          <MenuItem value="year">This Year</MenuItem>
        </Select>
      </FormControl>

      {/* Donut chart visualizing sentiment based on filtered reviews */}
      <Box
        sx={{
          width: "100%",
          height: 160,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DonutChart reviews={filteredReviews} />
      </Box>

      {/* Display total number of reviews after filtering */}
      <Typography variant="caption" sx={{ mt: 1 }}>
        {filteredReviews.length} תגובות {/* "comments" in Hebrew */}
      </Typography>
    </Paper>
  );
};

export default DataCard;
