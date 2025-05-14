import React, { useState } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox } from "@mui/material";
import { useLanguage } from "../context/language/LanguageContext";

const suggestions = [
  "הצעת בקרת איכות מחמירה במטבח: לבצע בדיקות איכות יזומות של מנות במטבח בסטנדרטים שמסעדה מציבה לעצמה.",
  "שיפור תהליך העברת ההזמנות במטבח: לקבוע את חלון הזמן המומלץ כך שלא ימתינו זמן רב לפני ההגשה.",
  "הקפדה על ניקיון ותחזוקה תדירה של הציוד: לבדוק תקינות של ציוד במטבח ולוודא ניקיון ואחסון מהירים של הכלים שמסופקים למטבח.",
  "הצבת עמדות לשיפור חוויית הלקוח: להציב עמדות שירות עצמי ללקוחות או עמדות קופה על חשבון הבית, במטרה לשפר את חוויית הלקוח.",
  "טיפוח צוות המלצרים ושיפור הכשרתם: להעניק הכשרות מקצועיות לצוות המלצרים, לעודד אותם להציע את התפריט ולבחון אותם בשיפור.",
  "שיפור תפריט המסעדה: לבצע סקרי שביעות רצון ללקוחות כדי להוציא מנות שאינן פופולריות ולהוסיף מנות חדשות ומעניינות.",
  "ניהול מלאי חכם: לעקוב אחרי מלאי המוצרים במטבח, לוודא שמנות לא אוזלות בזמן או שיש זמן תגובה מהיר לשחזור.",
  "הקפדה על דיוק בהזמנות: להקפיד על בדיקת הזמנות לפני ההגשה, בשל דיוק הזמנות על כל מנה ואחידות של האוכל.",
  "שיפור בתיאום בין המטבח למלצרים: להקים ערוץ תקשורת מהיר להעלאת בעיות מהמטבח בהתאם לדרישות הלקוחות.",
];

export const ImprovementSuggestionsPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const [checked, setChecked] = useState(Array(suggestions.length).fill(false));

  const handleCheck = (idx: number) => {
    setChecked((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#e7e1d2",
        direction: lang === "he" ? "rtl" : "ltr",
        px: 4,
        py: 4,
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          {t("title")}
        </Typography>

        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            boxShadow: "0 2px 8px #0001",
            backgroundColor: "#fff",
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f2e7" }}>
                <TableCell sx={headCellSx} width={120}>
                  {t("addTask")}
                </TableCell>
                <TableCell sx={headCellSx}>{t("suggestion")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {suggestions.map((s, i) => (
                <TableRow key={i}>
                  <TableCell align="center">
                    <Checkbox
                      checked={checked[i]}
                      onChange={() => handleCheck(i)}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }}>{s}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

const headCellSx = {
  fontWeight: 700,
  px: 2,
  py: 1.5,
};
