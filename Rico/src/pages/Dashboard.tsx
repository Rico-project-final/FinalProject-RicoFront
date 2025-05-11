import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";
import ricoLogo from '../assets/rico-logo.png';
import { useLanguage } from "../context/LanguageContext";

// הגדרת טיפוסים לתרגומים
type TranslationKeys = {
  dashboard: string;
  totalClients: string;
  totalQuestionnaires: string;
  totalComments: string;
  upFromYesterday: string;
  downFromYesterday: string;
  commentsAddedThisWeek: string;
  viewComment: string;
  suggestTreatment: string;
  allAreas: string;
  thisYear: string;
  search: string;
  pages: string;
  responses: string;
  dataAnalysis: string;
  optimizationSuggestions: string;
  clients: string;
  toDo: string;
  food: string;
  service: string;
  experience: string;
  settings: string;
  logout: string;
};

type Translations = {
  he: TranslationKeys;
  en: TranslationKeys;
};

// תרגומים
const translations: Translations = {
  he: {
    dashboard: "דשבורד",
    totalClients: "סך כל הלקוחות",
    totalQuestionnaires: "סך כל השאלונים",
    totalComments: "סך כל התגובות",
    upFromYesterday: "עלה מאתמול",
    downFromYesterday: "ירד מאתמול",
    commentsAddedThisWeek: "תגובות שנוספו השבוע",
    viewComment: "צפה בתגובה",
    suggestTreatment: "הצעה לטיפול",
    allAreas: "כל התחומים",
    thisYear: "השנה הנוכחית",
    search: "חיפוש",
    pages: "דפים",
    responses: "תגובות",
    dataAnalysis: "ניתוח נתונים",
    optimizationSuggestions: "הצעות ייעול",
    clients: "לקוחות",
    toDo: "משימות",
    food: "אוכל",
    service: "שירות",
    experience: "חוויה",
    settings: "הגדרות",
    logout: "התנתק"
  },
  en: {
    dashboard: "Dashboard",
    totalClients: "Total Clients",
    totalQuestionnaires: "Total Questionnaires",
    totalComments: "Total Comments",
    upFromYesterday: "Up from yesterday",
    downFromYesterday: "Down from yesterday",
    commentsAddedThisWeek: "Comments Added This Week",
    viewComment: "View Comment",
    suggestTreatment: "Suggest Treatment",
    allAreas: "All Areas",
    thisYear: "This Year",
    search: "Search",
    pages: "Pages",
    responses: "Responses",
    dataAnalysis: "Data Analysis",
    optimizationSuggestions: "Optimization Suggestions",
    clients: "Clients",
    toDo: "To-Do",
    food: "Food",
    service: "Service",
    experience: "Experience",
    settings: "Settings",
    logout: "Logout"
  }
};

/**
 * Dashboard - מסך דשבורד ראשי לפי עיצוב Figma.
 */
export const Dashboard: React.FC = () => {
  // סטייטים לנתונים
  const [stats, setStats] = useState<Array<{
    label: keyof TranslationKeys;
    icon: string;
    changeColor: string;
    changeText: keyof TranslationKeys;
    bg: string;
  }>>([
    {
      label: "totalClients",
      icon: "👤",
      changeColor: "green",
      changeText: "upFromYesterday",
      bg: "#f3f0ea",
    },
    {
      label: "totalQuestionnaires",
      icon: "📈",
      changeColor: "red",
      changeText: "downFromYesterday",
      bg: "#eafaf3",
    },
    {
      label: "totalComments",
      icon: "💬",
      changeColor: "green",
      changeText: "upFromYesterday",
      bg: "#faecea",
    },
  ]);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState({ name: "משתמש", role: "Admin" });
  const { lang, setLang } = useLanguage();

  // פונקציה לקבלת תרגום
  const t = (key: keyof TranslationKeys) => translations[lang][key];

  // נתוני גרף לדוגמה
  const chartData = [
    { name: "Jan", [t("food")]: 2, [t("service")]: 1, [t("experience")]: 1 },
    { name: "Feb", [t("food")]: 1, [t("service")]: 2, [t("experience")]: 2 },
    { name: "Mar", [t("food")]: 2, [t("service")]: 2, [t("experience")]: 1 },
    { name: "Apr", [t("food")]: 1, [t("service")]: 3, [t("experience")]: 2 },
    { name: "Mai", [t("food")]: 3, [t("service")]: 2, [t("experience")]: 1 },
    { name: "Jun", [t("food")]: 2, [t("service")]: 1, [t("experience")]: 3 },
  ];

  // דוגמה לטעינת נתונים עם טיפול בשגיאות
  useEffect(() => {
    try {
      // setStats(...), setComments(...)
      // כאן נוסיף טעינת נתוני משתמש
      // setCurrentUser({ name: "שם משתמש", role: "Admin" });
    } catch (e: any) {
      setError("שגיאה בטעינת הנתונים");
    }
  }, []);

  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#e7e1d2", direction: lang === "he" ? "rtl" : "ltr" }}>
      {/* סרגל צד */}
      <aside style={{ width: 250, background: "#fff", padding: 24, boxShadow: "2px 0 8px #0001", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ marginBottom: 32, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <img src={ricoLogo} alt="RICO Logo" style={{ width: 80, height: 80, objectFit: "contain" }} />
        </div>
        <nav>
          <div style={{ marginBottom: 24 }}>
            <MenuItem icon="🏠" label={t("dashboard")}
              to="/" active={window.location.pathname === "/"} />
            <MenuItem icon="💬" label={t("responses")}
              to="/comments" active={window.location.pathname === "/comments"} />
            <MenuItem icon="📊" label={t("dataAnalysis")}
              to="/data-analysis" active={window.location.pathname === "/data-analysis"} />
            <MenuItem icon="💡" label={t("optimizationSuggestions")}
              to="/improvement" active={window.location.pathname === "/improvement"} />
          </div>
          <div style={{ color: "#aaa", fontSize: 12, marginBottom: 8 }}>{t("pages")}</div>
          <MenuItem icon="👥" label={t("clients")}
            to="/clients" active={window.location.pathname === "/clients"} />
          <MenuItem icon="📝" label={t("toDo")}
            to="/todo" active={window.location.pathname === "/todo"} />
          <div style={{ marginTop: 32 }}>
            <MenuItem icon="⚙️" label={t("settings")}
              to="/settings" active={window.location.pathname === "/settings"} />
            <MenuItem icon="🚪" label={t("logout")}
              to="/logout" active={window.location.pathname === "/logout"} />
          </div>
        </nav>
      </aside>
      {/* תוכן ראשי */}
      <main style={{ flex: 1, padding: 32 }}>
        {/* כותרת עליונה */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <input
            type="search"
            placeholder={t("search")}
            style={{
              borderRadius: 20,
              border: "1px solid #ddd",
              padding: "8px 16px",
              width: 200,
              outline: "none",
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <select 
              value={lang}
              onChange={e => setLang(e.target.value as "he" | "en")}
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
        </div>
        {/* כותרת דשבורד */}
        <h1 style={{ marginBottom: 24 }}>{t("dashboard")}</h1>
        {/* כרטיסי סטטיסטיקה */}
        <div style={{ display: "flex", gap: 24, marginBottom: 32 }}>
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              style={{
                background: "#fff",
                borderRadius: 16,
                boxShadow: "0 2px 8px #0001",
                padding: 24,
                minWidth: 220,
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 8,
              }}
            >
              <div style={{ fontSize: 14, color: "#888" }}>{t(stat.label)}</div>
              <div style={{ fontSize: 28 }}>{stat.icon}</div>
            </div>
          ))}
        </div>
        {/* תגובות וגרף */}
        <div style={{ display: "flex", gap: 24 }}>
          {/* תגובות */}
          <div style={{ background: "#fff", borderRadius: 16, flex: 1, padding: 24 }}>
            <div style={{ fontWeight: "bold", fontSize: 20, marginBottom: 16, textAlign: "center" }}>
              {t("commentsAddedThisWeek")}
            </div>
            {comments.map((c, i) => (
              <div
                key={i}
                style={{
                  borderBottom: i < comments.length - 1 ? "1px solid #eee" : "none",
                  paddingBottom: 16,
                  marginBottom: 16,
                }}
              >
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={buttonStyle}>{t("viewComment")}</button>
                  <button style={buttonStyle}>{t("suggestTreatment")}</button>
                </div>
              </div>
            ))}
          </div>
          {/* גרף */}
          <div style={{ background: "#fff", borderRadius: 16, flex: 1, padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontWeight: "bold", fontSize: 20 }}>{t("allAreas")}</div>
              <div style={{ fontSize: 14, color: "#888" }}>{t("thisYear")} ▼</div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey={t("food")} stroke="#6b7cff" />
                <Line type="monotone" dataKey={t("service")} stroke="#e17cff" />
                <Line type="monotone" dataKey={t("experience")} stroke="#ff7c7c" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

// קומפוננטת תפריט צד
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

// עיצוב כפתור
const buttonStyle: React.CSSProperties = {
  border: "1px solid #cfc6b0",
  background: "#f3f0ea",
  borderRadius: 20,
  padding: "6px 18px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: 14,
};
