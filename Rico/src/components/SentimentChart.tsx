/**
 * DonutChart Component
 * --------------------
 * Displays a donut (pie) chart visualizing the distribution of review sentiments:
 * positive, neutral, and negative.
 * 
 * Props:
 * - reviews: an array of ReviewAnalysis objects, each containing a sentiment field.
 */

import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Box } from "@mui/material";
import { ReviewAnalysis } from "../types";

type DonutChartProps = {
  reviews: ReviewAnalysis[];
};

// Define colors corresponding to each sentiment category
const COLORS = ["#A8E6A3", "#FFF1A8", "#F17878"]; // positive (green), neutral (yellow), negative (red)

const DonutChart: React.FC<DonutChartProps> = ({ reviews }) => {
  // Count the number of reviews per sentiment type
  const sentimentCounts = reviews.reduce(
    (acc, review) => {
      if (review.sentiment === "positive") acc.positive++;
      else if (review.sentiment === "neutral") acc.neutral++;
      else if (review.sentiment === "negative") acc.negative++;
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 }
  );

  // Prepare the data for the PieChart component with localized Hebrew labels
  const chartData = [
    { name: "מעולה", value: sentimentCounts.positive },
    { name: "טוב", value: sentimentCounts.neutral },
    { name: "לא טוב", value: sentimentCounts.negative },
  ];

  // Calculate total number of reviews (optional, e.g., for conditionally rendering)
  const total = chartData.reduce((sum, d) => sum + d.value, 0);
  // if (total === 0) return <Typography textAlign="center">אין נתונים</Typography>;

  return (
    <Box
      sx={{ width: "100%", height: 200 }}
      dir="rtl" // Right-to-left text direction for Hebrew
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            innerRadius={50}    
            outerRadius={80}   
            dataKey="value"     
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`} 
          >
            {/* Map each data slice to a color */}
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default DonutChart;
