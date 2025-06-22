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
  IconButton,
  TextField,
  CircularProgress,
} from "@mui/material";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { useTheme } from "@mui/material/styles";
import { useLanguage } from "../context/language/LanguageContext";
import { getAllUsers } from "../services/user-service";
import SendEmailModal from "../components/SendEmailModal";
import { User } from "../types";

export const ClientsPage: React.FC = () => {
  const theme = useTheme();
  const { lang, t } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [selectedText, setSelectedText] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchAllUsers = async (currentPage: number) => {
    try {
      const response = await getAllUsers(currentPage, 15);
      setUsers((prev) => [...prev, ...response.data.users]);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchAllUsers(page);
  }, [page]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const nearBottom = scrollTop + clientHeight >= scrollHeight - 100;
    if (nearBottom && !isLoadingMore && page < totalPages) {
      setIsLoadingMore(true);
      setPage((prev) => prev + 1);
    }
  };

  const handleContact = (email: string, text: string) => {
    setSelectedEmail(email);
    setSelectedText(text);
    setModalOpen(true);
  };

  const filteredClients = users.filter((c) =>
    [c.name, c.email, c._id, c.phone ?? ""].some((field) =>
      field?.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <Box
      onScroll={handleScroll}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflowY: "auto",
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
          <Table stickyHeader>
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
              {filteredClients.map((c) => (
                <TableRow key={c._id}>
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
                    <IconButton onClick={() => handleContact(c.email, `Hi ${c.name},`)} size="small">
                      <ChatBubbleIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {isLoadingMore && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 2 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <SendEmailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        email={selectedEmail}
        text={selectedText}
      />
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
