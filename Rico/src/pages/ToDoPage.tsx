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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLanguage } from "../context/language/LanguageContext";
import { Task } from "../types";
import { getAllTasks, deleteTask, completeTask } from "../services/task-service";

export const ToDoPage: React.FC = () => {
  const { lang, t } = useLanguage();
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

  const getPriorityColor = (priority?: string) => {
    switch ((priority || "medium").toLowerCase()) {
      case "high":
        return "#ffcccc"; // light red
      case "medium":
        return "#fff4cc"; // light yellow
      case "low":
        return "#d5f5e3"; // light green
      default:
        return "#f0f0f0"; // default gray
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
        bgcolor: "#e7e1d2",
        direction: lang === "he" ? "rtl" : "ltr",
        px: 4,
        py: 4,
      }}
    >
      <Typography variant="h4" sx={{ mb: 3 }}>
        {t("todo")}
      </Typography>

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
              <TableCell sx={headCellSx} align="center">
                {t("task")}
              </TableCell>
              <TableCell sx={headCellSx} align="center">
                {t("status")}
              </TableCell>
              <TableCell sx={headCellSx} align="center">
                {t("priority")}
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
                <TableCell sx={bodyCellSx} align="center">
                  {t(task.priority ?? "medium")}
                </TableCell>
                <TableCell sx={bodyCellSx} align="center">
                  <Checkbox
                    checked={task.isCompleted}
                    onChange={() => handleToggle(task._id)}
                  />
                  <IconButton onClick={() => handleDelete(task._id)}>
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
  borderBottom: "2px solid #e0d7c6",
};

const bodyCellSx = {
  fontSize: 15,
  py: 1.5,
};
