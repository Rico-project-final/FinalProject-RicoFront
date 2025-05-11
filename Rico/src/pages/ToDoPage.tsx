import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ricoLogo from '../assets/rico-logo.png';
import { useLanguage } from "../context/LanguageContext";

const tasks = [
  { id: 1, text: "להתקשר ללקוח חדש", done: false },
  { id: 2, text: "לשלוח הצעת מחיר", done: false },
  { id: 3, text: "לעדכן פרטי לקוח במערכת", done: false },
  { id: 4, text: "לבדוק שביעות רצון לקוח", done: false },
  { id: 5, text: "לתאם פגישה עם ספק", done: false },
];

const translations = {
  he: {
    title: "משימות",
    task: "משימה",
    status: "סטטוס",
    done: "בוצע",
    notDone: "לא בוצע",
    addTask: "הוסף משימה",
    dashboard: "דשבורד",
    comments: "תגובות",
    dataAnalysis: "ניתוח נתונים",
    improvement: "הצעות ייעול",
    clients: "לקוחות",
    todo: "משימות",
    pages: "דפים",
    settings: "הגדרות",
    logout: "התנתק",
  },
  en: {
    title: "To-Do",
    task: "Task",
    status: "Status",
    done: "Done",
    notDone: "Not Done",
    addTask: "Add Task",
    dashboard: "Dashboard",
    comments: "Comments",
    dataAnalysis: "Data Analysis",
    improvement: "Improvement Suggestions",
    clients: "Clients",
    todo: "To-Do",
    pages: "Pages",
    settings: "Settings",
    logout: "Logout",
  },
};

type Lang = "he" | "en";

export const ToDoPage: React.FC = () => {
  const { lang, setLang } = useLanguage();
  const [currentUser] = useState({ name: "yuval miles", role: "Admin" });
  const t = translations[lang];
  const [taskList, setTaskList] = useState<Task[]>(() => {
    const stored = localStorage.getItem("tasks");
    return stored ? JSON.parse(stored) : tasks;
  });
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(taskList));
  }, [taskList]);

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTaskList([...taskList, { id: Date.now(), text: newTask, done: false }]);
      setNewTask("");
    }
  };

  const handleToggle = (id: number) => {
    setTaskList(taskList.map(task => task.id === id ? { ...task, done: !task.done } : task));
  };

  const handleDelete = (id: number) => {
    setTaskList(taskList.filter(task => task.id !== id));
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#e7e1d2", direction: lang === "he" ? "rtl" : "ltr" }}>
      {/* Sidebar */}
      <aside style={{
        width: 250,
        background: "#fff",
        padding: 24,
        boxShadow: "2px 0 8px #0001",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <div style={{ marginBottom: 32, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <img src={ricoLogo} alt="RICO Logo" style={{ width: 80, height: 80, objectFit: "contain" }} />
        </div>
        <nav>
          <div style={{ marginBottom: 24 }}>
            <MenuItem icon="🏠" label={t.dashboard} to="/" active={window.location.pathname === "/"} />
            <MenuItem icon="💬" label={t.comments} to="/comments" active={window.location.pathname === "/comments"} />
            <MenuItem icon="📊" label={t.dataAnalysis} to="/data-analysis" active={window.location.pathname === "/data-analysis"} />
            <MenuItem icon="💡" label={t.improvement} to="/improvement" active={window.location.pathname === "/improvement"} />
          </div>
          <div style={{ color: "#aaa", fontSize: 12, marginBottom: 8 }}>{t.pages}</div>
          <MenuItem icon="👥" label={t.clients} to="/clients" active={window.location.pathname === "/clients"} />
          <MenuItem icon="📝" label={t.todo} active />
          <div style={{ marginTop: 32 }}>
            <MenuItem icon="⚙️" label={t.settings} to="/settings" active={window.location.pathname === "/settings"} />
            <MenuItem icon="🚪" label={t.logout} to="/logout" active={window.location.pathname === "/logout"} />
          </div>
        </nav>
      </aside>
      {/* Main Content */}
      <main style={{ flex: 1, padding: 24 }}>
        {/* Header */}
        <h1 style={{ marginBottom: 24 }}>{t.title}</h1>
        {/* Add Task */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
          <input
            type="text"
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddTask()}
            placeholder={t.task}
            style={{
              borderRadius: 20,
              border: "1px solid #ddd",
              padding: "8px 16px",
              width: 260,
              outline: "none",
              background: "#f8f6f2"
            }}
          />
          <button onClick={handleAddTask} style={{ borderRadius: 20, border: "1px solid #cfc6b0", background: "#f3f0ea", padding: "8px 24px", fontWeight: "bold", cursor: "pointer" }}>{t.addTask}</button>
        </div>
        {/* Table */}
        <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001", padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
            <thead>
              <tr style={{ background: "#f5f2e7", color: "#222", textAlign: "center" }}>
                <th style={thStyle}>{t.task}</th>
                <th style={thStyle}>{t.status}</th>
                <th style={thStyle}></th>
                <th style={thStyle}></th>
              </tr>
            </thead>
            <tbody>
              {taskList.map((task) => (
                <tr key={task.id} style={{ borderBottom: "1px solid #e0d7c6", textAlign: "center" }}>
                  <td style={tdStyle}>{task.text}</td>
                  <td style={tdStyle}>{task.done ? t.done : t.notDone}</td>
                  <td style={tdStyle}>
                    <input type="checkbox" checked={task.done} onChange={() => handleToggle(task.id)} />
                  </td>
                  <td style={tdStyle}>
                    <button onClick={() => handleDelete(task.id)} style={{ background: "none", border: "none", cursor: "pointer" }}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

function MenuItem({ icon, label, active = false, to }: { icon: string; label: string; active?: boolean; to?: string }) {
  if (to) {
    return (
      <Link to={to} style={{ textDecoration: "none", color: "inherit" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 16px",
            borderRadius: 8,
            background: active ? "#e7e1d2" : "none",
            color: active ? "#222" : "#555",
            fontWeight: active ? "bold" : "normal",
            marginBottom: 8,
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: 18 }}>{icon}</span>
          <span>{label}</span>
        </div>
      </Link>
    );
  }
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 16px",
        borderRadius: 8,
        background: active ? "#e7e1d2" : "none",
        color: active ? "#222" : "#555",
        fontWeight: active ? "bold" : "normal",
        marginBottom: 8,
        cursor: "pointer",
      }}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: "16px 8px",
  fontWeight: "bold",
  borderBottom: "2px solid #e0d7c6",
};

const tdStyle: React.CSSProperties = {
  padding: "12px 8px",
  minHeight: 48,
}; 