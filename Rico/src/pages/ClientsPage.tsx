import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Menu,
  MenuItem as MuiMenuItem,
  TextField,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useLanguage } from "../context/language/LanguageContext";

const clients = [
  { id: "00001", name: "אורי נתן", phone: "052-6632457", date: "14 Feb 2019" },
  { id: "00002", name: "אפרי מויאל", phone: "053-6647867", date: "14 Feb 2019" },
  { id: "00003", name: "מתן בן סעד", phone: "054-6579876", date: "14 Feb 2019" },
  { id: "00004", name: "אביגיל גבאי", phone: "050-5656745", date: "14 Feb 2019" },
  { id: "00005", name: "אבי תקווה", phone: "050-4435425", date: "14 Feb 2019" },
  { id: "00006", name: "שלומית מלכי", phone: "053-6657827", date: "14 Feb 2019" },
  { id: "00007", name: "חיים שלום", phone: "050-4438854", date: "14 Feb 2019" },
  { id: "00008", name: "שגיא טל", phone: "050-9900388", date: "14 Feb 2019" },
];

export const ClientsPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeClientId, setActiveClientId] = useState<string | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, clientId: string) => {
    setAnchorEl(event.currentTarget);
    setActiveClientId(clientId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveClientId(null);
  };

  const handleEdit = (clientName: string) => {
    alert(`${lang === "he" ? "עריכת לקוח" : "Editing"}: ${clientName}`);
    handleMenuClose();
  };

  const filteredClients = clients.filter((c) =>
    [c.name, c.id, c.phone].some((field) => field.includes(search))
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#e7e1d2",
        direction: lang === "he" ? "rtl" : "ltr",
      }}
    >
      <Box sx={{ flex: 1, p: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder={t("searchClient")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 3, bgcolor: "white", borderRadius: 1 }}
        />

        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            boxShadow: "0 2px 8px #0001",
            overflow: "hidden",
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f2e7" }}>
                <TableCell sx={headCellSx} align="center">{t("id")}</TableCell>
                <TableCell sx={headCellSx} align="center">{t("name")}</TableCell>
                <TableCell sx={headCellSx} align="center">{t("phone")}</TableCell>
                <TableCell sx={headCellSx} align="center">{t("date")}</TableCell>
                <TableCell sx={headCellSx} align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredClients.map((c) => (
                <TableRow key={c.id} sx={{ textAlign: "center" }}>
                  <TableCell sx={bodyCellSx} align="center">{c.id}</TableCell>
                  <TableCell sx={bodyCellSx} align="center">{c.name}</TableCell>
                  <TableCell sx={bodyCellSx} align="center">{c.phone}</TableCell>
                  <TableCell sx={bodyCellSx} align="center">{c.date}</TableCell>
                  <TableCell sx={[bodyCellSx, { position: "relative" }]} align="center">
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, c.id)}
                      size="small"
                    >
                      <MoreVertIcon />
                    </IconButton>

                    {activeClientId === c.id && (
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: lang === "he" ? "left" : "right",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: lang === "he" ? "left" : "right",
                        }}
                      >
                        <MuiMenuItem onClick={() => handleEdit(c.name)}>
                          {lang === "he" ? "ערוך" : "Edit"}
                        </MuiMenuItem>
                      </Menu>
                    )}
                  </TableCell>
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
  fontWeight: "bold",
  fontSize: 16,
  py: 2,
  borderBottom: "2px solid #e0d7c6",
};

const bodyCellSx = {
  fontSize: 15,
  py: 1.5,
};
