import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  IconButton,
  CircularProgress,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLanguage } from "../context/language/LanguageContext";
import { Task } from "../types";
import { getAllTasks, deleteTask, completeTask } from "../services/task-service";

export const ToDoPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const theme = useTheme();
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchAllTasks = async (currentPage: number) => {
    try {
      const response = await getAllTasks(currentPage, 10);
      setTaskList((prev) => [...prev, ...response.data.tasks]);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchAllTasks(page);
  }, [page]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const nearBottom = scrollTop + clientHeight >= scrollHeight - 100;

    if (nearBottom && !isLoadingMore && page < totalPages) {
      setIsLoadingMore(true);
      setPage((prev) => prev + 1);
    }
  };

  const handleToggle = async (id: string) => {
    setTaskList((prev) =>
      prev.map((task) =>
        task._id === id
          ? {
              ...task,
              isCompleted: !task.isCompleted,
              updatedAt: new Date().toISOString(),
            }
          : task
      )
    );
    await completeTask(id);
  };

  const handleDelete = async (id: string) => {
    setTaskList((prev) => prev.filter((task) => task._id !== id));
    await deleteTask(id);
  };

  // Adjust priority colors for dark mode
  const getPriorityColor = (priority?: string) => {
    const mode = theme.palette.mode;
    switch ((priority || "medium").toLowerCase()) {
      case "high":
        return mode === "dark" ? "#663333" : "#ffcccc"; // darker red in dark mode
      case "medium":
        return mode === "dark" ? "#665e33" : "#fff4cc"; // darker yellow in dark mode
      case "low":
        return mode === "dark" ? "#335d33" : "#d5f5e3"; // darker green in dark mode
      default:
        return mode === "dark" ? theme.palette.background.paper : "#f0f0f0";
    }
  };

  return (
    <Box
      onScroll={handleScroll}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflowY: "auto",
        bgcolor: theme.palette.background.default,
        direction:  "rtl",
        px: 4,
        py: 4,
        color: theme.palette.text.primary,
        flex:1
      }}
    >
      <Typography variant="h4" sx={{ mb: 3, textAlign:"center" }}>
        {t("todo")}
      </Typography>

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
                {t("task")}
              </TableCell>
              <TableCell sx={headCellSx} align="center">
                {t("status")}
              </TableCell>
              {/* <TableCell sx={headCellSx} align="center">
                {t("priority")}
              </TableCell> */}
              <TableCell sx={headCellSx} align="center">
                {"תאריך סיום"}
              </TableCell>
              <TableCell sx={headCellSx} align="center">
                {t("actions")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {taskList.map((task) => (
              <TableRow
                key={task._id}
                sx={{ backgroundColor: getPriorityColor(task.priority) }}
              >
                <TableCell sx={bodyCellSx} align="center">
                  {task.title}
                </TableCell>
                <TableCell sx={bodyCellSx} align="center">
                  {t(task.isCompleted ? "done" : "notDone")}
                </TableCell>
                {/* <TableCell sx={bodyCellSx} align="center">
                  {t(task.priority!)}
                </TableCell> */}
                <TableCell sx={bodyCellSx} align="center">
                  {new Date(task.dueDate!).toLocaleDateString("en-GB").replace(/-/g, "/")}
                </TableCell>
                <TableCell sx={bodyCellSx} align="center">
                  <Checkbox
                    checked={task.isCompleted}
                    onChange={() => handleToggle(task._id)}
                    color="primary"
                  />
                  <IconButton onClick={() => handleDelete(task._id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {isLoadingMore && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 2 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

// Styles
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

export default ToDoPage;
