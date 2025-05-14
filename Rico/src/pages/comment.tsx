import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/language/LanguageContext";
import {
  Box,
  Button,
  Container,
  InputBase,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { TranslationKeys } from "../context/language/types";



type Lang = "he" | "en";

export const CommentsPage: React.FC = () => {
  const { lang, t } = useLanguage(); // ✅ Using t from context
  
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        bgcolor: "#e7e1d2",
        direction: lang === "he" ? "rtl" : "ltr",
      }}
    >
      <Container maxWidth="xl" sx={{ flex: 1, py: 4 }}>
        {/* Search bar */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
          <InputBase
            placeholder={t("search")}
            sx={{
              borderRadius: "20px",
              border: "1px solid #ddd",
              px: 2,
              py: 1,
              width: 220,
              bgcolor: "#f8f6f2",
            }}
          />
        </Box>

        {/* Filters */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
          <Button variant="outlined" sx={filterBtnSx}>{t("filterBy")}</Button>
          <InputBase type="date" sx={dateInputSx} />
          <Button variant="outlined" sx={filterBtnSx}>{t("clientName")}</Button>
          <Button
            variant="outlined"
            sx={{
              ...filterBtnSx,
              color: "#d44",
              borderColor: "#d44",
              ml: lang === "en" ? 0 : "auto",
              mr: lang === "he" ? 0 : "auto",
            }}
          >
            {t("resetFilter")}
          </Button>
        </Box>

        {/* Table */}
        <Paper
          elevation={3}
          sx={{ borderRadius: 2, overflow: "hidden", bgcolor: "#f8f6f2" }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="comments table">
            <TableHead>
              <TableRow sx={{ bgcolor: "#ede6d6", textAlign: "center" }}>
                <TableCell sx={thSx} align="center">{t("clientName")}</TableCell>
                <TableCell sx={thSx} align="center">{t("date")}</TableCell>
                <TableCell sx={thSx} align="center">{t("commentDesc")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[1, 2, 3].map(i => (
                <TableRow key={i}>
                  <TableCell sx={tdSx} align="center"></TableCell>
                  <TableCell sx={tdSx} align="center"></TableCell>
                  <TableCell sx={tdSx} align="center"></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        {/* Bottom Buttons */}
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 3 }}>
          <Button variant="outlined" sx={bottomBtnSx}>{t("allComments")}</Button>
          <Button variant="outlined" sx={bottomBtnSx}>{t("commentsAddedThisWeek")}</Button>
        </Box>
      </Container>
    </Box>
  );
};

// Reusable Styles
const filterBtnSx = {
  borderRadius: "20px",
  bgcolor: "#f3f0ea",
  border: "1px solid #cfc6b0",
  fontWeight: "bold",
  fontSize: 14,
  px: 2.5,
  py: 0.5,
};

const dateInputSx = {
  border: "1px solid #cfc6b0",
  bgcolor: "#f3f0ea",
  borderRadius: "20px",
  px: 2.5,
  py: 0.5,
  fontWeight: "bold",
  fontSize: 14,
};

const thSx = {
  fontWeight: "bold",
  borderBottom: "2px solid #e0d7c6",
  py: 2,
};

const tdSx = {
  py: 1.5,
};

const bottomBtnSx = {
  borderRadius: "20px",
  bgcolor: "#f3f0ea",
  border: "1px solid #cfc6b0",
  px: 4,
  py: 1,
  fontWeight: "bold",
  fontSize: 16,
};
