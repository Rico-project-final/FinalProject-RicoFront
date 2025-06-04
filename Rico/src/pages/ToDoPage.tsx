import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLanguage } from "../context/language/LanguageContext";
import { Task } from "../types";
import { getAllTasks, deleteTask ,completeTask } from "../services/task-service";

const mockTasks: Task[] = [
  {
    _id: "1",
    title: "להתקשר ללקוח חדש",
    isCompleted: false,
    createdBy: "admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "2",
    title: "לשלוח הצעת מחיר",
    isCompleted: false,
    createdBy: "admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const ToDoPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  const fetchAllTasks = async () => {
     const response = await getAllTasks();
     setTaskList(response.data);
  }
  useEffect(() => {
   fetchAllTasks()
  }, []);

  const handleAddTask = () => {
    if (newTask.trim()) {
      const now = new Date().toISOString();
      setTaskList([
        ...taskList,
        {
          _id: Date.now().toString(),
          title: newTask,
          isCompleted: false,
          createdBy: "admin",
          createdAt: now,
          updatedAt: now,
        },
      ]);
      setNewTask("");
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

  const handleDelete =async (id: string) => {
    setTaskList((prev) => prev.filter((task) => task._id !== id));
    await deleteTask(id);
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
        {/* Header */}
        <Typography variant="h4" sx={{ mb: 3 }}>
          {t("todo")}
        </Typography>

        {/* Add Task */}
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <TextField
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
            placeholder={t("task")}
            variant="outlined"
            size="small"
            sx={{
              bgcolor: "#f8f6f2",
              borderRadius: "20px",
              width: 260,
            }}
            InputProps={{
              sx: {
                px: 2,
                py: 1,
                borderRadius: "20px",
              },
            }}
          />
          <Button
            onClick={handleAddTask}
            variant="outlined"
            sx={{
              borderRadius: "20px",
              bgcolor: "#f3f0ea",
              border: "1px solid #cfc6b0",
              fontWeight: "bold",
              px: 4,
            }}
          >
            {t("addTask")}
          </Button>
        </Box>

        {/* Task Table */}
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
                <TableCell sx={headCellSx} align="center">{t("priority")}</TableCell>
                <TableCell sx={headCellSx} align="center">{t("actions")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {taskList.map((task) => (
                <TableRow key={task._id}>
                  <TableCell sx={bodyCellSx} align="center">
                    {task.title}
                  </TableCell>
                  <TableCell sx={bodyCellSx} align="center">
                    {t(task.isCompleted ? "done" : "notDone")}
                  </TableCell>
                  <TableCell sx={bodyCellSx} align="center">
                    {t(task.priority?? "medium")}
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
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

// Cell styles
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
