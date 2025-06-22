import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import DonutChart from "./SentimentChart";
import { ReviewAnalysis } from "../types";
import { useLanguage } from "../context/language/LanguageContext";
import dayjs from "dayjs";

interface DataCardProps {
  title: string; // "food", "service", "overall"
  initialReviews: ReviewAnalysis[];
}

const DataCard: React.FC<DataCardProps> = ({ title, initialReviews }) => {
  // Default timePeriod is 'week' -> filter reviews from the past 7 days by default
  const [timePeriod, setTimePeriod] = useState<"week" | "month" | "year">("week");
  const [filteredReviews, setFilteredReviews] = useState<ReviewAnalysis[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    const now = dayjs();
    const startDate =
      timePeriod === "week"
        ? now.subtract(7, "day")
        : timePeriod === "month"
        ? now.subtract(1, "month")
        : now.subtract(1, "year");

    const reviews = initialReviews.filter((review) => {
      const created = dayjs(new Date(review.createdAt));
      return created.isValid() && created.isAfter(startDate);
    });

    setFilteredReviews(reviews);
  }, [initialReviews, timePeriod, title]);

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
        boxShadow: "0 2px 8px #0001",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
        {t(title as keyof typeof t)}
      </Typography>

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
            "& .MuiSelect-select": {
              display: "flex",
              justifyContent: "center",
              paddingY: 0.5,
              paddingX: 1,
            },
            "& .MuiSvgIcon-root": {
              fontSize: 22,
            },
          }}
        >
          <MenuItem value="week">This Week</MenuItem>
          <MenuItem value="month">This Month</MenuItem>
          <MenuItem value="year">This Year</MenuItem>
        </Select>
      </FormControl>

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

      <Typography variant="caption" sx={{ mt: 1 }}>
        {filteredReviews.length} {t("reviews") || "reviews"}
      </Typography>
    </Paper>
  );
};

export default DataCard;
