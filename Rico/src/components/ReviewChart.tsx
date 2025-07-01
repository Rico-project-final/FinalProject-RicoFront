/**
 * ReviewChart Component
 * ---------------------
 * Displays a line chart showing the distribution of reviews across different categories.
 * Uses the Recharts library for the chart, styled with MUI theming.
 * 
 * Props:
 * - data: an array of objects representing review counts by category.
 *   Expected format example:
 *   [
 *     { name: 'January', food: 30, service: 20, experience: 25 },
 *     { name: 'February', food: 45, service: 35, experience: 40 },
 *     ...
 *   ]
 */

import { Typography, Paper } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "@mui/material/styles";

const ReviewChart = ({ data }: { data: any[] }) => {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        flex: 1,                     
        p: 3,                        
        borderRadius: 2,             
        backgroundColor: theme.palette.background.paper, 
        overflow: "hidden",          
      }}
    >
      {/* Chart title */}
      <Typography
        sx={{
          fontWeight: "bold",
          fontSize: 20,
          textAlign: "center",
          mb: 2,                    
          color: theme.palette.text.primary, 
        }}
      >
        התפלגות ביקורות לפי קטגוריה
      </Typography>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 20, left: 20, bottom: 10 }} // Spacing around the chart area
        >
          {/* X Axis showing category names */}
          <XAxis dataKey="name" stroke={theme.palette.text.secondary} />

          {/* Y Axis showing numeric values */}
          <YAxis
            stroke={theme.palette.text.secondary}
            tickMargin={12} // Adds spacing between axis ticks and labels
          />

          <Tooltip
            contentStyle={{
              backgroundColor: theme.palette.background.paper,
              borderColor: theme.palette.divider,
            }}
            labelStyle={{ color: theme.palette.text.primary }}
            itemStyle={{ color: theme.palette.text.primary }}
          />

          <Legend
            wrapperStyle={{
              color: theme.palette.text.primary,
              paddingTop: 8,
            }}
          />

          <Line type="monotone" dataKey="food" stroke="#6b7cff" />
          <Line type="monotone" dataKey="service" stroke="#e17cff" />
          <Line type="monotone" dataKey="experience" stroke="#ff7c7c" />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default ReviewChart;
