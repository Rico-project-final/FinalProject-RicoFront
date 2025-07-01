import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  Modal,
  Backdrop,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useLanguage } from "../context/language/LanguageContext";
import { TranslationKeys } from "../context/language/types";
import { getDashboardStats } from "../services/user-service";
import { Review, ReviewAnalysis } from "../types";
import CommentModal from "../components/commentModal";
import { getAllReviewAnalysesNoPage, getReviewAnalysisStatus } from "../services/reviewAnalaysis-service";
import {
  generateBusinessQr,
  getLastSyncDate,
} from "../services/business-service";
import {
  connectGoogleBusiness,
  checkGoogleConnection,
  syncGoogleReviews,
} from "../services/googleBusiness-service";

import StatsCards from "../components/StatsCards";
import ReviewsList from "../components/ReviewsList";
import ReviewChart from "../components/ReviewChart";
import QrCodeSection from "../components/QrCodeSection";
import GoogleConnectSection from "../components/GoogleConnectSection";

export const Dashboard: React.FC = () => {
  const theme = useTheme();
  const { lang, t } = useLanguage();

  const [stats] = useState<Array<{
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

  const [totalStats, setTotalStats] = useState({
    totalReviews: 0,
    totalClients: 0,
    totalTasks: 0,
  });

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewChartData, setReviewChartData] = useState<any[]>([]);
  const [qrImage, setQrImage] = useState<string | null>(null);

  const [selectedComment, setSelectedComment] = useState<string>("");
  const [selectedClientName, setSelectedClientName] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string | Date>(new Date());
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  const [selectedBusiness, setSelectedBusiness] = useState<google.maps.places.PlaceResult | null>(null);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [lastSyncDate, setLastSyncDate] = useState<Date | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [previousReviewCount, setPreviousReviewCount] = useState<number | null>(null);


  const showError = (msg: string) => {
    setErrorMessage(msg);
    setOpenSnackbar(true);
  };

  let oauthWindow: Window | null = null;

  // פונקציה חדשה לבדיקת סטטוס הניתוח מול השרת
const MAX_RETRIES = 20;

const checkReviewAnalysisStatus = async (retryCount = 0): Promise<void> => {
  if (retryCount >= MAX_RETRIES) {
    setIsAnalyzing(false);
    showError("Timeout while waiting for review analysis.");
    return;
  }

  try {
    const res = await getReviewAnalysisStatus();
    const { allAnalyzed } = res.data;

    if (!allAnalyzed) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      return checkReviewAnalysisStatus(retryCount + 1);
    }

    // Update and stop
    const dashboardRes = await getDashboardStats();
    setTotalStats(dashboardRes.data);
    setReviews(dashboardRes.data.lastWeekReviews);

    const analysisRes = await getAllReviewAnalysesNoPage();
    const chart = transformReviewsToChartData(analysisRes.data);
    setReviewChartData(chart);

    setIsAnalyzing(false);
  } catch (error) {
    console.error("Error checking analysis status:", error);
    showError("שגיאה בבדיקת סטטוס ניתוח ביקורות.");
    setIsAnalyzing(false);
  }
};



// עדכון handleSyncReviews
const handleSyncReviews = async () => {
  try {
    setIsSyncing(true);
    setIsAnalyzing(true);

    await syncGoogleReviews();

    const date = await getLastSyncDate();
    setLastSyncDate(date.data.lastSyncDate ? new Date(date.data.lastSyncDate) : null);

    await checkReviewAnalysisStatus();
  } catch (error) {
    console.error("Error syncing reviews:", error);
    showError("שגיאה בסנכרון ביקורות מגוגל.");
    setIsAnalyzing(false);
  } finally {
    setIsSyncing(false);
  }
};


  const handlePlaceSelected = (place: google.maps.places.PlaceResult) => {
  setSelectedBusiness(place);
  if (place.place_id) {
    localStorage.setItem("selectedPlaceId", place.place_id);
  }
};

  const handleConnectBusiness = async (place: google.maps.places.PlaceResult) => {
    setSelectedBusiness(place);
    setIsGoogleConnected(false);
    console.log("Connecting to Google Business for place:", place);

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
      showError("לא הצלחנו לפתוח את חלון ההתחברות");
    }
  };

const handleMessage = async (event: MessageEvent) => {
  if (event.origin !== window.location.origin) return;

  const { data } = event;
  if (data.type === "google-oauth-code" && data.code) {
    if (oauthWindow) oauthWindow.close();
    window.removeEventListener("message", handleMessage);

    const savedPlaceId = localStorage.getItem("selectedPlaceId");

    if (!savedPlaceId) {
      showError("מזהה העסק בגוגל לא זמין.");
      return;
    }

    try {
      const response = await connectGoogleBusiness(data.code, savedPlaceId);
      if (response.status === 200) {
        console.log("Google Business connected successfully:", response.data);
        setIsGoogleConnected(true);
        localStorage.removeItem("selectedPlaceId"); // ניקוי אחרי הצלחה
      } else {
        console.error("Failed to connect Google Business:", response);
        showError("החיבור לעסק בגוגל נכשל.");
      }
    } catch (err) {
      console.error("OAuth Error:", err);
      showError("שגיאה בחיבור לחשבון גוגל.");
    }
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

      const fetchDashboardData = async () => {
      try {
        const response = await getDashboardStats();
        setTotalStats(response.data);
        setReviews(response.data.lastWeekReviews);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        showError("שגיאה בטעינת נתוני לוח המחוונים.");
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await getAllReviewAnalysesNoPage();
        const chart = transformReviewsToChartData(response.data);
        setReviewChartData(chart);
      } catch (error) {
        console.error("Error fetching review analyses:", error);
        showError("שגיאה בטעינת נתוני הביקורות.");
      }
    };

    const fetchConnectionStatus = async () => {
      try {
        const res = await checkGoogleConnection();
        setIsGoogleConnected(res.data.isGoogleConnected);
      } catch (error) {
        console.error("Error checking Google connection:", error);
        showError("שגיאה בבדיקת מצב החיבור לחשבון גוגל.");
      }
    };

  useEffect(() => {

    fetchDashboardData();
    fetchReviews();
    fetchConnectionStatus();
    fetchLastSyncDate();

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleGenerateQR = async () => {
    try {
      const res = await generateBusinessQr();
      setQrImage(res.data.image);
    } catch (error) {
      console.error("Error generating QR code:", error);
      showError("שגיאה ביצירת קוד QR.");
    }
  };

  const fetchLastSyncDate = async () => {
  try {
    const res = await getLastSyncDate();
    setLastSyncDate(res.data.lastSyncDate ? new Date(res.data.lastSyncDate) : null);
  } catch (error) {
    console.error("Error fetching last sync date:", error);
  }
};

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
        <Typography variant="h4" sx={{ mb: 3, color: theme.palette.text.primary }}>
          דשבורד
        </Typography>
        <StatsCards stats={stats} totalStats={totalStats} />

        <Box sx={{ display: "flex", gap: 3 }}>
          <Paper sx={{ flex: 1, p: 3, borderRadius: 2, backgroundColor: theme.palette.background.paper }}>
            <ReviewsList reviews={reviews} onOpenModal={handleOpenModal} />
          </Paper>

          <Paper sx={{ flex: 1, p: 3, borderRadius: 2, backgroundColor: theme.palette.background.paper }}>
            <ReviewChart data={reviewChartData} />
          </Paper>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 4 }}>
          <QrCodeSection qrImage={qrImage} onGenerateQR={handleGenerateQR} />

          <GoogleConnectSection
              isGoogleConnected={isGoogleConnected}
              isSyncing={isAnalyzing && isSyncing}
              lastSyncDate={lastSyncDate}
              onSyncReviews={handleSyncReviews}
              onPlaceSelected={handlePlaceSelected}
              onConnectBusiness={handleConnectBusiness}
              selectedBusiness={selectedBusiness}
            />

        </Box>
      </Box>

      <CommentModal
        open={isCommentModalOpen}
        comment={selectedComment}
        clientName={selectedClientName}
        commentDate={selectedDate}
        onClose={() => setIsCommentModalOpen(false)}
      />

      {/* Snackbar for errors */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="error"
          variant="filled"
          onClose={() => setOpenSnackbar(false)}
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
      {isAnalyzing && (
  <Box
    sx={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0,0,0,0.4)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1300,
    }}
  >
    <Paper
      elevation={3}
      sx={{
        padding: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 250,
        borderRadius: 2,
      }}
    >
  <Modal
        open={isAnalyzing}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
            sx: { backgroundColor: "rgba(0, 0, 0, 0.4)" },
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: 2,
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: 24,
          }}
        >
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            מנתח תגובות...
          </Typography>
        </Box>
      </Modal>

    </Paper>
  </Box>
)}
    </Box>
  );
};

