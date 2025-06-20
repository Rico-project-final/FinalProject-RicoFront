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
  TextField,
  IconButton,
} from "@mui/material";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { useTheme } from "@mui/material/styles";
import { useLanguage } from "../context/language/LanguageContext";
import { getAllUsers } from "../services/user-service";
import { User } from "../types";

export const ClientsPage: React.FC = () => {
  const theme = useTheme();
  const { lang, t } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  const fetchAllUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleContact = () => {
    // TODO :: contact client using something?
    console.log("handle contact activated");
  };

  const filteredClients = users.filter((c) =>
    [c.name, c.email, c._id, c.phone ?? ""].some((field) =>
      field?.toLowerCase().includes(search.toLowerCase())
    )
  );

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        direction: lang === "he" ? "rtl" : "ltr",
        color: theme.palette.text.primary,
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
          sx={{
            mb: 3,
            bgcolor: theme.palette.mode === "dark" ? "#303030" : "white",
            borderRadius: 1,
            input: { color: theme.palette.text.primary },
          }}
        />

        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            boxShadow: "0 2px 8px #0001",
            overflow: "hidden",
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: theme.palette.action.hover }}>
                <TableCell sx={headCellSx} align="center">
                  {t("id")}
                </TableCell>
                <TableCell sx={headCellSx} align="center">
                  {t("email")}
                </TableCell>
                <TableCell sx={headCellSx} align="center">
                  {t("name")}
                </TableCell>
                <TableCell sx={headCellSx} align="center">
                  {t("contact")}
                </TableCell>
                <TableCell sx={headCellSx} align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* TODO :: Add pagination - only display 15 each time */}
              {filteredClients.map((c) => (
                <TableRow key={c._id} sx={{ textAlign: "center" }}>
                  <TableCell sx={bodyCellSx} align="center">
                    {c._id.slice(-6)}
                  </TableCell>
                  <TableCell sx={bodyCellSx} align="center">
                    {c.email}
                  </TableCell>
                  <TableCell sx={bodyCellSx} align="center">
                    {c.name}
                  </TableCell>
                  <TableCell
                    sx={[bodyCellSx, { position: "relative" }]}
                    align="center"
                  >
                    <IconButton onClick={handleContact} size="small">
                      <ChatBubbleIcon />
                    </IconButton>
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
  borderBottom: "2px solid",
  borderColor: "divider",
};

const bodyCellSx = {
  fontSize: 15,
  py: 1.5,
};

export default ClientsPage;
