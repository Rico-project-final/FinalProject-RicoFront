import React, { useState } from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import { useLanguage } from "../context/language/LanguageContext";

export const DataAnalysisPage: React.FC = () => {
  const { lang, t } = useLanguage();

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#e7e1d2",
        direction: lang === "he" ? "rtl" : "ltr",
      }}
    >
      <Box component="main" sx={{ flex: 1, p: 4 }}>
        {/* Title */}
        <Typography variant="h4" sx={{ mb: 3 }}>
          {t("dataAnalysis")}
        </Typography>

        {/* Filters */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 4 }}>
          <FilterButton label={t("filterBy")} />
          <FilterButton label={t("date")} />
          <FilterButton label={t("clientName")} />
          <FilterButton label={t("all")} />
        </Box>

        {/* Chart Data Cards */}
        <Box sx={{ display: "flex", gap: 3, mb: 4 }}>
          <DataCard title={t("experience")} />
          <DataCard title={t("service")} />
          <DataCard title={t("food")} />
        </Box>

        {/* Comments Section */}
        <Box sx={{ display: "flex", gap: 3 }}>
          {/* Positive */}
          <CommentsColumn
            type="positive"
            comments={[
              "האוכל היה מצוין! המנות היו מתובלות בצורה מושלמת, חומרי הגלם היו טריים והטעמים השתלבו נהדר. הכל הוגש בזמן ובטמפרטורה הנכונה, ממש חוויה קולינרית מהנה. בהחלט נחזור שוב!",
              "השירות היה אדיב והאוכל טעים. כל מה שהובטח היה קיים והכל הגיע בזמן. בהחלט נחזור!",
            ]}
          />
          {/* Negative */}
          <CommentsColumn
            type="negative"
            comments={[
              "האוכל שהוגש היה מאכזב מאוד. הטעמים היו שטוחים, המנות לא היו מתובלות מספיק, וחלק מהאוכל אפילו הגיע קר. ציפיתי להרבה יותר בהתחשב במחיר ששילמנו.",
              "החוויה הקולינרית הייתה פשוט מאכזבת. המנות קטנות, חלק מהן חסרות טעם ובאופן כללי לא נהנינו מהאוכל.",
            ]}
          />
        </Box>
      </Box>
    </Box>
  );
};

// Button Component
const FilterButton: React.FC<{ label: string }> = ({ label }) => (
  <Button
    variant="outlined"
    sx={{
      borderRadius: "20px",
      bgcolor: "#f3f0ea",
      border: "1px solid #cfc6b0",
      fontWeight: "bold",
      fontSize: 14,
      px: 3,
      py: 1,
    }}
  >
    {label}
  </Button>
);

// Card Component
const DataCard: React.FC<{ title: string }> = ({ title }) => {
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
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "#e7e1d2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#bbb",
            fontSize: 32,
          }}
        >
          📊
        </Box>
      </Box>
    </Paper>
  );
};

// Comments Column
const CommentsColumn: React.FC<{
  comments: string[];
  type: "positive" | "negative";
}> = ({ comments, type }) => {
  const { t } = useLanguage();

  return (
    <Box sx={{ flex: 1 }}>
      <Typography
        variant="h6"
        fontWeight="bold"
        textAlign="center"
        sx={{ mb: 2 }}
      >
        {t("comments")}
      </Typography>

      {comments.map((comment, idx) => (
        <Paper
          key={idx}
          sx={{
            bgcolor: type === "positive" ? "#eafaf3" : "#faecea",
            borderRadius: 2,
            p: 2,
            mb: 2,
          }}
        >
          <Typography sx={{ mb: 1 }}>{comment}</Typography>
          <Button
            variant="outlined"
            sx={{
              borderRadius: 20,
              bgcolor: type === "positive" ? "#d2f5e3" : "#f5d2d2",
              border: "1px solid #cfc6b0",
              fontWeight: "bold",
              fontSize: 14,
              px: 3,
              py: 1,
            }}
          >
            {t("suggestTreatment")}
          </Button>
        </Paper>
      ))}
    </Box>
  );
};
