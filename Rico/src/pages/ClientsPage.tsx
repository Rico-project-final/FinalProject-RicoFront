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
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { useLanguage } from "../context/language/LanguageContext";
import {getAllUsers} from "../services/user-service";
import { User } from "../types";

export const ClientsPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");


  const fetchAllUsers = async ()=>{
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }
  const handleContact = ()=>{
    //TODO :: contact client using somehting?
    console.log("handle contact activated")
  }
  const filteredClients = users.filter((c) =>
  [c.name,c.email, c._id, c.phone ?? ''].some((field) => field?.includes(search))
);


useEffect(()=>{
    fetchAllUsers()

  },[])

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
                <TableCell sx={headCellSx} align="center">{t("email")}</TableCell>
                <TableCell sx={headCellSx} align="center">{t("name")}</TableCell>
                <TableCell sx={headCellSx} align="center">{t("contact")}</TableCell>
                <TableCell sx={headCellSx} align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* TODO :: Add pagination - only display 15 each time */}
              {filteredClients.map((c) => (
                <TableRow key={c._id} sx={{ textAlign: "center" }}>
                  <TableCell sx={bodyCellSx} align="center">{c._id.slice(-6)}</TableCell>
                  <TableCell sx={bodyCellSx} align="center">{c.email}</TableCell>
                  <TableCell sx={bodyCellSx} align="center">{c.name}</TableCell>
                  <TableCell sx={[bodyCellSx, { position: "relative" }]} align="center">
                    <IconButton
                      onClick={handleContact}
                      size="small"
                    >
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
  borderBottom: "2px solid #e0d7c6",
};

const bodyCellSx = {
  fontSize: 15,
  py: 1.5,
};
