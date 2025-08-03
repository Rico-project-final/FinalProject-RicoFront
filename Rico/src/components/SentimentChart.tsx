import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Box } from "@mui/material";
import { ReviewAnalysis } from "../types";

type DonutChartProps = {
  reviews: ReviewAnalysis[];
};

const COLORS = ["#A8E6A3", "#FFF1A8", "#F17878"]; // positive, neutral, negative

const DonutChart: React.FC<DonutChartProps> = ({ reviews }) => {
  const sentimentCounts = reviews.reduce(
    (acc, review) => {
      if (review.sentiment === "positive") acc.positive++;
      else if (review.sentiment === "neutral") acc.neutral++;
      else if (review.sentiment === "negative") acc.negative++;
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 }
  );

  const chartData = [
    { name: "מעולה", value: sentimentCounts.positive },
    { name: "טוב", value: sentimentCounts.neutral },
    { name: "לא טוב", value: sentimentCounts.negative },
  ];

  return (
    <Box sx={{ width: "100%", height: 200 }}
     dir="rtl"
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
