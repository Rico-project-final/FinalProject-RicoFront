import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Button, Divider } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useLanguage } from "../context/language/LanguageContext";
import { TranslationKeys } from "../context/language/types";
import { getDashboardStats } from "../services/user-service";
import { Review } from "../types";

export const Dashboard: React.FC = () => {
 const [stats, setStats] = useState<Array<{
  label: keyof TranslationKeys;
  icon: string;
  changeColor: string;
  changeText: keyof TranslationKeys;
  bg: string;
}>>([
  {
    label: "totalClients",
    icon: "👤",
    changeColor: "green",
    changeText: "upFromYesterday",
    bg: "#f3f0ea",
  },
  {
    label: "totalTasks",
    icon: "📈",
    changeColor: "red",
    changeText: "downFromYesterday",
    bg: "#eafaf3",
  },
  {
    label: "totalReviews", 
    icon: "💬",
    changeColor: "green",
    changeText: "upFromYesterday",
    bg: "#faecea",
  },
]);

const [totalStats, setTotalStats] = useState({ totalReviews: 0, totalClients: 0, totalTasks: 0 });
const [reviews, setReviews] = useState<Review[]>([]);
const [error, setError] = useState<string | null>(null);
const [chartData, setChartData] = useState<any>();
const { lang, t } = useLanguage();

  // const chartData = [
  //   { name: "Jan", [t("food")]: 2, [t("service")]: 1, [t("experience")]: 1 },
  //   { name: "Feb", [t("food")]: 1, [t("service")]: 2, [t("experience")]: 2 },
  //   { name: "Mar", [t("food")]: 2, [t("service")]: 2, [t("experience")]: 1 },
  //   { name: "Apr", [t("food")]: 1, [t("service")]: 3, [t("experience")]: 2 },
  //   { name: "Mai", [t("food")]: 3, [t("service")]: 2, [t("experience")]: 1 },
  //   { name: "Jun", [t("food")]: 2, [t("service")]: 1, [t("experience")]: 3 },
  // ];

  const fetchDashboardData = async () => {
  try {
    const response = await getDashboardStats();
    setTotalStats(response.data);
    setReviews(response.data.lastWeekReviews);
    setChartData(response.data.chartData);
  } catch (e: any) {
    setError("error while loading data");
  }
};

  useEffect(() => {
    try {

      fetchDashboardData()
    } catch (e: any) {
      setError("שגיאה בטעינת הנתונים");
    }
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#e7e1d2",
        direction: lang === "he" ? "rtl" : "ltr",
      }}
    >
      <Box sx={{ flex: 1, p: 4 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          {t("dashboard")}
        </Typography>

        {/* Stats Cards */}
        <Box sx={{ display: "flex", gap: 3, mb: 4 }}>
          {stats.map((stat,index) => (
            <Paper
              key={stat.label}
              sx={{
                backgroundColor: "#fff",
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
              <Typography sx={{ fontSize: 14, color: "#888" }}>
                {t(stat.label)}
              </Typography>
              <Typography sx={{ fontSize: 28 }}> {totalStats[stat.label as keyof typeof totalStats]} {stat.icon}</Typography>
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
              backgroundColor: "#fff",
            }}
          >
            <Typography
              sx={{ fontWeight: "bold", fontSize: 20, textAlign: "center", mb: 2 }}
            >
              {t("reviewsAddedThisWeek")}
            </Typography>

            {reviews.map((c, i) => (
              <Box key={i}>
                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                  <Button variant="outlined" sx={commentButtonSx}>
                    {t("viewReview")}
                  </Button>
                  <Button variant="outlined" sx={commentButtonSx}>
                    {t("suggestTreatment")}
                  </Button>
                </Box>
                {i < reviews.length - 1 && <Divider sx={{ mb: 2 }} />}
              </Box>
            ))}
          </Paper>

          {/* Chart */}
          <Paper
            sx={{
              flex: 1,
              p: 3,
              borderRadius: 2,
              backgroundColor: "#fff",
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
              <Typography sx={{ fontWeight: "bold", fontSize: 20 }}>
                {t("allAreas")}
              </Typography>
              <Typography sx={{ fontSize: 14, color: "#888" }}>
                {t("thisYear")} ▼
              </Typography>
            </Box>

            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey={t("food")} stroke="#6b7cff" />
                <Line type="monotone" dataKey={t("service")} stroke="#e17cff" />
                <Line type="monotone" dataKey={t("experience")} stroke="#ff7c7c" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

const commentButtonSx = {
  border: "1px solid #cfc6b0",
  backgroundColor: "#f3f0ea",
  borderRadius: "20px",
  px: 3,
  py: 0.75,
  textTransform: "none",
  fontWeight: "bold",
  fontSize: 14,
};
