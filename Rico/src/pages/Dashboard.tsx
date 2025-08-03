import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider
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
import { Review, ReviewAnalysis } from "../types";
import CommentModal from "../components/commentModal";
import { getAllReviewAnalysesNoPage } from "../services/reviewAnalaysis-service";
import GoogleMapSearch from "../components/GoogleMapSearch";
import GoogleIcon from "@mui/icons-material/Google";
import { generateBusinessQr} from '../services/business-service';
import { connectGoogleBusiness, checkGoogleConnection } from "../services/googleBusiness-service";


export const Dashboard: React.FC = () => {
  const theme = useTheme();
  const { lang, t } = useLanguage();

  const [stats, setStats] = useState<
    Array<{
      label: keyof TranslationKeys;
      icon: string;
      changeColor: string;
      changeText: keyof TranslationKeys;
    }>
  >([]);

  const [totalStats, setTotalStats] = useState({
    totalReviews: 0,
    totalClients: 0,
    totalTasks: 0,
  });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewChartData, setReviewChartData] = useState<any[]>([]);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [selectedBusiness, setSelectedBusiness] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [selectedComment, setSelectedComment] = useState<string>("");
  const [selectedClientName, setSelectedClientName] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string | Date>(new Date());
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  // סטייטים לתהליך OAuth
  const [isConnecting, setIsConnecting] = useState(false);
  const [oauthError, setOauthError] = useState<string | null>(null);
  const [oauthSuccess, setOauthSuccess] = useState<string | null>(null);
  const [isGoogleConnected, setIsGoogleConnected] = useState<boolean>(false);
  const [googlePlaceId, setGooglePlaceId] = useState<string>("");
  console.log(isConnecting,oauthError, oauthSuccess,googlePlaceId,)
  let oauthWindow: Window | null = null;
  // שלב ראשוני - לחיצה על התחברות לעסק
  const handleConnectBusiness = async (
    place: google.maps.places.PlaceResult
  ) => {
    setSelectedBusiness(place);
    setIsConnecting(true);
    setOauthError(null);
    setOauthSuccess(null);

    const clientId = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;
    const redirectUri = `${window.location.origin}/google-business-callback`;

    const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=https://www.googleapis.com/auth/business.manage&access_type=offline&prompt=consent`;

    const width = 500;
    const height = 600;
    const left = window.screenX + (window.innerWidth - width) / 2;
    const top = window.screenY + (window.innerHeight - height) / 2;

    oauthWindow = window.open(
      oauthUrl,
      "_blank",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    if (!oauthWindow) {
      setIsConnecting(false);
      setOauthError("לא הצלחנו לפתוח את חלון ההתחברות");
      return;
    }
        }

    // מאזין לאירוע postMessage מהחלון שנפתח (callback)
  const handleMessage = async (event: MessageEvent) => {
  // בדיקת מקור להבטחת אבטחה
  if (event.origin !== window.location.origin) return;

  const { data } = event;
  if (data.type === "google-oauth-code" && data.code) {
    // סגירת חלון ההתחברות והסרת מאזין
    if (oauthWindow) {
      oauthWindow.close();
    }
    window.removeEventListener("message", handleMessage);

    if (!selectedBusiness?.place_id) {
      alert("מזהה העסק בגוגל לא זמין.");
      return;
    }

    try {
      setIsConnecting(true);

      const response = await connectGoogleBusiness(data.code, selectedBusiness.place_id);

      // בדיקה אם הבקשה הצליחה
      if (response.status === 200) {
        setOauthSuccess("התחברת בהצלחה לעסק!");
        setIsGoogleConnected(true);
        setGooglePlaceId(selectedBusiness.place_id);
      } else {
        setOauthError("אירעה שגיאה בהתחברות לעסק.");
      }
    } catch (err) {
      console.error("OAuth Error:", err);
      setOauthError("אירעה שגיאה בהתחברות לגוגל עסקי.");
    } finally {
      setIsConnecting(false);
    }
  }
};

  const handlePlaceSelected = (place: google.maps.places.PlaceResult) => {
    setSelectedBusiness(place);
  };

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

    const initialData = months.map((month) => ({ name: month, food: 0, service: 0, experience: 0 }));

    reviews.forEach((review) => {
      const monthIndex = new Date(review.createdAt).getMonth();
      const categoryKey = review.category === "overall experience" ? "experience" : review.category;
      (initialData[monthIndex] as any)[categoryKey]++;
    });

    return initialData;
  };

  useEffect(() => {
    setStats([
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
      const response = await getAllReviewAnalysesNoPage();
      const chart = transformReviewsToChartData(response.data);
      setReviewChartData(chart);
    } catch (error) {
      console.error("Failed to fetch review analyses:", error);
      setError("Failed to fetch review analyses");
    }
  };

  const fetchConnectionStatus = async () => {
    try {
      const res = await checkGoogleConnection();
      setIsGoogleConnected(res.data.isGoogleConnected);
      console.log("Google connection status:", res.data.isGoogleConnected);
      console.log("res:", res.status);
    } catch (error) {
      console.error("Error checking Google connection:", error);
    }
  };

  fetchDashboardData();
  fetchReviews();
  fetchConnectionStatus();
}, []);


  if (error) return <Typography color="error">{error}</Typography>;

  //TODO :: Remove this func?
  function handleSyncReviews(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: theme.palette.background.default, direction:  "rtl"}}>
      <Box sx={{ flex: 1, p: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, color: theme.palette.text.primary }}>{t("dashboard")}</Typography>

        <Box sx={{ display: "flex", gap: 3, mb: 4 }}>
          {stats.map((stat) => (
            <Paper key={stat.label} sx={{ backgroundColor: theme.palette.background.paper, borderRadius: 2, boxShadow: 3, p: 3, minWidth: 220, flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography sx={{ fontSize: 14, color: theme.palette.text.secondary }}>{t(stat.label)}</Typography>
              <Typography sx={{ fontSize: 28, color: theme.palette.text.primary }}>{totalStats[stat.label as keyof typeof totalStats]} {stat.icon}</Typography>
            </Paper>
          ))}
        </Box>

        <Box sx={{ display: "flex", gap: 3 }}>
          <Paper sx={{ flex: 1, p: 3, borderRadius: 2, backgroundColor: theme.palette.background.paper }}>
            <Typography sx={{ fontWeight: "bold", fontSize: 20, textAlign: "center", mb: 2, color: theme.palette.text.primary }}>{t("reviewsAddedThisWeek")}</Typography>
            {reviews.map((c, i) => (
              <Box key={i} sx={{ mb: 2 }}>
                <Typography sx={{ mb: 1, cursor: "pointer", fontSize: 14, color: theme.palette.text.primary }}
                  onClick={() => handleOpenModal(c.text, (c.userId as { name: string }).name, c.createdAt)}>
                  {c.text}
                </Typography>
                {i < reviews.length - 1 && <Divider sx={{ mt: 2, borderColor: theme.palette.divider }} />}
              </Box>
            ))}
          </Paper>

          <Paper sx={{ flex: 1, p: 3, borderRadius: 2, backgroundColor: theme.palette.background.paper }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Typography sx={{ fontWeight: "bold", fontSize: 20, color: theme.palette.text.primary }}>{t("allAreas")}</Typography>
              <Typography sx={{ fontSize: 14, color: theme.palette.text.secondary }}>{t("thisYear")} ▼</Typography>
            </Box>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={reviewChartData}>
                <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
                <YAxis stroke={theme.palette.text.secondary} />
                <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, borderColor: theme.palette.divider }} labelStyle={{ color: theme.palette.text.primary }} itemStyle={{ color: theme.palette.text.primary }} />
                <Legend wrapperStyle={{ color: theme.palette.text.primary }} />
                <Line type="monotone" dataKey="food" stroke="#6b7cff" />
                <Line type="monotone" dataKey="service" stroke="#e17cff" />
                <Line type="monotone" dataKey="experience" stroke="#ff7c7c" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 4, flexWrap: "wrap" }}>
          <Paper sx={{ minWidth: 280, p: 3, borderRadius: 2, backgroundColor: theme.palette.background.paper, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <Typography sx={{ fontWeight: "bold", fontSize: 20, color: theme.palette.text.primary }}>יצירת QR</Typography>
            <Button onClick={handleGenerateQR} variant="contained">צור QR</Button>
            {qrImage && (
              <>
                <img src={qrImage} alt="QR Code" style={{ marginTop: 16, width: 200, height: 200 }} />
                <Button onClick={() => { const link = document.createElement("a"); link.href = qrImage; link.download = "business-qr.png"; link.click(); }} variant="outlined">הורד QR</Button>
              </>
            )}
          </Paper>
      {!isGoogleConnected ? (
  <Box sx={{ mt: 4 }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
      <GoogleIcon sx={{ color: '#4285F4', fontSize: 28 }} />
      <Typography sx={{ fontWeight: "bold", fontSize: 20, color: theme.palette.text.primary }}>
        התחברות לגוגל עסקי
      </Typography>
    </Box>

    <Paper
      sx={{
        minWidth: 280,
        height: 300,
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <GoogleMapSearch
        onPlaceSelected={handlePlaceSelected}
        onConnectBusiness={handleConnectBusiness}
        selectedBusiness={selectedBusiness}
      />
    </Paper>
  </Box>
) : (
  <Paper sx={{ mt: 4, p: 3 }}>
    <Typography>✔️ העסק שלך מחובר ל Google</Typography>
    <Typography variant="body2">סנכרון אחרון: 22/06/2025</Typography>
    <Button variant="outlined" onClick={handleSyncReviews}>
      סנכרן שוב ביקורות
    </Button>
    
  </Paper>
)}

      </Box>
      </Box>

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
