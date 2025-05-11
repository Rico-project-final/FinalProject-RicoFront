import React, { useState } from "react";
import { Link } from "react-router-dom";
import ricoLogo from '../assets/rico-logo.png';
import { useLanguage } from "../context/LanguageContext";

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

const translations = {
  he: {
    title: "הצעות לייעול",
    addTask: "הוסף משימה",
    suggestion: "הצעה",
    dashboard: "דשבורד",
    comments: "תגובות",
    dataAnalysis: "ניתוח נתונים",
    improvement: "הצעות ייעול",
    pages: "דפים",
    clients: "לקוחות",
    todo: "משימות",
    settings: "הגדרות",
    logout: "התנתק",
  },
  en: {
    title: "Improvement Suggestions",
    addTask: "Add Task",
    suggestion: "Suggestion",
    dashboard: "Dashboard",
    comments: "Comments",
    dataAnalysis: "Data Analysis",
    improvement: "Improvement Suggestions",
    pages: "Pages",
    clients: "Clients",
    todo: "To-Do",
    settings: "Settings",
    logout: "Logout",
  },
};

type Lang = "he" | "en";

export const ImprovementSuggestionsPage: React.FC = () => {
  const { lang, setLang } = useLanguage();
  const [currentUser] = useState({ name: "yuval miles", role: "Admin" });
  const t = translations[lang];
  const [checked, setChecked] = useState(Array(suggestions.length).fill(false));

  const handleCheck = (idx: number) => {
    setChecked((prev) => prev.map((v, i) => (i === idx ? !v : v)));
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
            <MenuItem icon="💡" label={t.improvement} active />
          </div>
          <div style={{ color: "#aaa", fontSize: 12, marginBottom: 8 }}>{t.pages}</div>
          <MenuItem icon="👥" label={t.clients} to="/clients" active={window.location.pathname === "/clients"} />
          <MenuItem icon="📝" label={t.todo} to="/todo" active={window.location.pathname === "/todo"} />
          <div style={{ marginTop: 32 }}>
            <MenuItem icon="⚙️" label={t.settings} to="/settings" active={window.location.pathname === "/settings"} />
            <MenuItem icon="🚪" label={t.logout} to="/logout" active={window.location.pathname === "/logout"} />
          </div>
        </nav>
      </aside>
      {/* Main Content */}
      <main style={{ flex: 1, padding: 32 }}>
        {/* Main Title */}
        <h1 style={{ marginBottom: 24 }}>{t.title}</h1>
        {/* Filters */}
        <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 32 }}>
          <select
            value={lang}
            onChange={e => setLang(e.target.value as Lang)}
            style={{
              padding: "4px 8px",
              borderRadius: 4,
              border: "1px solid #ddd",
              background: "#fff"
            }}
          >
            <option value="he">עברית</option>
            <option value="en">English</option>
          </select>
          <div>
            <div style={{ fontWeight: "bold" }}>{currentUser.name}</div>
            <div style={{ fontSize: 12, color: "#888" }}>{currentUser.role}</div>
          </div>
        </div>
        <table style={{ width: "100%", background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001", borderCollapse: "separate", borderSpacing: 0 }}>
          <thead>
            <tr>
              <th style={{ width: 120, padding: 12, background: "#f5f2e7", fontWeight: 700 }}>{t.addTask}</th>
              <th style={{ padding: 12, background: "#f5f2e7", fontWeight: 700 }}>{t.suggestion}</th>
            </tr>
          </thead>
          <tbody>
            {suggestions.map((s, i) => (
              <tr key={i}>
                <td style={{ textAlign: "center", padding: 12 }}>
                  <input type="checkbox" checked={checked[i]} onChange={() => handleCheck(i)} />
                </td>
                <td style={{ padding: 12 }}>{s}</td>
              </tr>
            ))}
          </tbody>
        </table>
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