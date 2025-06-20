import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
} from "@mui/material";
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
import { useLanguage } from "../context/language/LanguageContext";
import { TranslationKeys } from "../context/language/types";
import { getDashboardStats } from "../services/user-service";
import { generateBusinessQr } from "../services/business-service";
import { Review, ReviewAnalysis } from "../types";
import CommentModal from "../components/commentModal";
import { getAllReviewAnalyses } from "../services/reviewAnalaysis-service";

export const Dashboard: React.FC = () => {
  const theme = useTheme();
  const { lang, t } = useLanguage();

  const [stats, setStats] = useState<Array<{
    label: keyof TranslationKeys;
    icon: string;
    changeColor: string;
    changeText: keyof TranslationKeys;
  }>>([
    {
      label: "totalClients",
      icon: "👤",
      changeColor: "green",
      changeText: "upFromYesterday",
    },
    {
      label: "totalTasks",
      icon: "📈",
      changeColor: "red",
      changeText: "downFromYesterday",
    },
    {
      label: "totalReviews",
      icon: "💬",
      changeColor: "green",
      changeText: "upFromYesterday",
    },
  ]);

  const [totalStats, setTotalStats] = useState({ totalReviews: 0, totalClients: 0, totalTasks: 0 });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewChartData, setReviewChartData] = useState<any[]>([]);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [selectedComment, setSelectedComment] = useState<string>("");
  const [selectedClientName, setSelectedClientName] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string | Date>(new Date());
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  const handleGenerateQR = async () => {
    try {
      const res = await generateBusinessQr();
      setQrImage(res.data.image);
    } catch (err) {
      console.error("Error generating QR:", err);
    }
  };

  const handleOpenModal = (comment: string, clientName: string, date: string | Date) => {
    setSelectedComment(comment);
    setSelectedClientName(clientName);
    setSelectedDate(date);
    setIsCommentModalOpen(true);
  };

  const transformReviewsToChartData = (reviews: ReviewAnalysis[]) => {
    const months = Array.from({ length: 12 }, (_, i) =>
      new Date(0, i).toLocaleString("default", { month: "short" })
    );

    const initialData = months.map((month) => ({
      name: month,
      food: 0,
      service: 0,
      experience: 0,
    }));

    reviews.forEach((review) => {
      const monthIndex = new Date(review.createdAt).getMonth();
      const categoryKey =
        review.category === "overall experience" ? "experience" : review.category;

      (initialData[monthIndex] as any)[categoryKey]++;
    });

    return initialData;
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getDashboardStats();
        setTotalStats(response.data);
        setReviews(response.data.lastWeekReviews);
      } catch (e: any) {
        setError("error while loading data");
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await getAllReviewAnalyses();
        const chart = transformReviewsToChartData(response.data);
        setReviewChartData(chart);
      } catch (error) {
        console.error("Failed to fetch review analyses:", error);
        setError("Failed to fetch review analyses");
      }
    };

    fetchDashboardData();
    fetchReviews();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        direction: lang === "he" ? "rtl" : "ltr",
      }}
    >
      <Box sx={{ flex: 1, p: 4 }}>
        <Typography
          variant="h4"
          sx={{ mb: 3, color: theme.palette.text.primary }}
        >
          {t("dashboard")}
        </Typography>

        {/* Stats Cards */}
        <Box sx={{ display: "flex", gap: 3, mb: 4 }}>
          {stats.map((stat) => (
            <Paper
              key={stat.label}
              sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: 2,
                boxShadow: 3,
                p: 3,
                minWidth: 220,
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Typography
                sx={{ fontSize: 14, color: theme.palette.text.secondary }}
              >
                {t(stat.label)}
              </Typography>
              <Typography
                sx={{ fontSize: 28, color: theme.palette.text.primary }}
              >
                {totalStats[stat.label as keyof typeof totalStats]} {stat.icon}
              </Typography>
            </Paper>
          ))}
        </Box>

        {/* Comments & Graph Section */}
        <Box sx={{ display: "flex", gap: 3 }}>
          {/* Comments */}
          <Paper
            sx={{
              flex: 1,
              p: 3,
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: 20,
                textAlign: "center",
                mb: 2,
                color: theme.palette.text.primary,
              }}
            >
              {t("reviewsAddedThisWeek")}
            </Typography>
            {reviews.map((c, i) => (
              <Box key={i} sx={{ mb: 2 }}>
                <Typography
                  sx={{
                    mb: 1,
                    cursor: "pointer",
                    fontSize: 14,
                    color: theme.palette.text.primary,
                  }}
                  onClick={() =>
                    handleOpenModal(
                      c.text,
                      (c.userId as { name: string }).name,
                      c.createdAt
                    )
                  }
                >
                  {c.text}
                </Typography>
                {i < reviews.length - 1 && (
                  <Divider
                    sx={{
                      mt: 2,
                      borderColor: theme.palette.divider,
                    }}
                  />
                )}
              </Box>
            ))}
          </Paper>

          {/* Chart */}
          <Paper
            sx={{
              flex: 1,
              p: 3,
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography
                sx={{ fontWeight: "bold", fontSize: 20, color: theme.palette.text.primary }}
              >
                {t("allAreas")}
              </Typography>
              <Typography
                sx={{ fontSize: 14, color: theme.palette.text.secondary }}
              >
                {t("thisYear")} ▼
              </Typography>
            </Box>

            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={reviewChartData}>
                <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
                <YAxis stroke={theme.palette.text.secondary} />
                <Tooltip
                  contentStyle={{ backgroundColor: theme.palette.background.paper, borderColor: theme.palette.divider }}
                  labelStyle={{ color: theme.palette.text.primary }}
                  itemStyle={{ color: theme.palette.text.primary }}
                />
                <Legend wrapperStyle={{ color: theme.palette.text.primary }} />
                <Line type="monotone" dataKey="food" stroke="#6b7cff" />
                <Line type="monotone" dataKey="service" stroke="#e17cff" />
                <Line type="monotone" dataKey="experience" stroke="#ff7c7c" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Box>

        {/* QR Code Section */}
        <Paper
          sx={{
            mt: 4,
            p: 3,
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            sx={{ fontWeight: "bold", fontSize: 20, color: theme.palette.text.primary }}
          >
            generateQR
          </Typography>
          <Button onClick={handleGenerateQR} variant="contained">
            generateQR
          </Button>

          {qrImage && (
            <>
              <img
                src={qrImage}
                alt="QR Code"
                style={{ marginTop: 16, width: 200, height: 200 }}
              />
              <Button
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = qrImage;
                  link.download = "business-qr.png";
                  link.click();
                }}
                variant="outlined"
              >
                downloadQR
              </Button>
            </>
          )}
        </Paper>
      </Box>

      {/* Comment Modal */}
      <CommentModal
        open={isCommentModalOpen}
        comment={selectedComment}
        clientName={selectedClientName}
        commentDate={selectedDate}
        onClose={() => setIsCommentModalOpen(false)}
      />
    </Box>
  );
};
