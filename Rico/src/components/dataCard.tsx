import { Box, Paper, Typography } from "@mui/material";
import DonutChart from "./SentimentChart"; // adjust path if needed
import { ReviewAnalysis } from "../types";

interface DataCardProps {
  title: string;
  reviews: ReviewAnalysis[];
}

const DataCard: React.FC<DataCardProps> = ({ title, reviews }) => {
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
      }}
    >
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
        This Week ▼
      </Typography>
      <Box
        sx={{
          width: "100%",
          height: 160,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DonutChart reviews={reviews} />
      </Box>
    </Paper>
  );
};

export default DataCard;
