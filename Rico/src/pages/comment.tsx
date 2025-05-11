import React, { useState } from "react";
import { Link } from "react-router-dom";
import ricoLogo from '../assets/rico-logo.png';
import { useLanguage } from "../context/LanguageContext";

// Translation types and object
const translations = {
  he: {
    dashboard: "דשבורד",
    comments: "תגובות",
    filterBy: "סנן לפי",
    date: "תאריך",
    clientName: "שם הכותב",
    commentDesc: "תיאור התגובה",
    resetFilter: "איפוס סינון",
    allComments: "כל התגובות",
    commentsAddedThisWeek: "תגובות נוספו השבוע",
    search: "חיפוש",
    pages: "דפים",
    dataAnalysis: "ניתוח נתונים",
    optimizationSuggestions: "הצעות ייעול",
    clients: "לקוחות",
    toDo: "משימות",
    settings: "הגדרות",
    logout: "התנתק",
    filter: "סנן",
    userRole: "Admin"
  },
  en: {
    dashboard: "Dashboard",
    comments: "Comments",
    filterBy: "Filter By",
    date: "Date",
    clientName: "Client Name",
    commentDesc: "Comment Description",
    resetFilter: "Reset Filter",
    allComments: "All Comments",
    commentsAddedThisWeek: "Comments Added This Week",
    search: "Search",
    pages: "Pages",
    dataAnalysis: "Data Analysis",
    optimizationSuggestions: "Optimization Suggestions",
    clients: "Clients",
    toDo: "To-Do",
    settings: "Settings",
    logout: "Logout",
    filter: "Filter",
    userRole: "Admin"
  }
};

type Lang = "he" | "en";

export const CommentsPage: React.FC = () => {
  const { lang, setLang } = useLanguage();
  const [currentUser] = useState({ name: "yuval miles", role: translations[lang].userRole });
  const t = (key: keyof typeof translations["he"]) => translations[lang][key];

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh", minWidth: "100vw", minHeight: "100vh", background: "#e7e1d2", direction: lang === "he" ? "rtl" : "ltr" }}>
      {/* Sidebar */}
      <aside style={{ width: 250, background: "#fff", padding: 24, boxShadow: "2px 0 8px #0001" }}>
        <div style={{ marginBottom: 32, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <img src={ricoLogo} alt="RICO Logo" style={{ width: 80, height: 80, objectFit: "contain" }} />
        </div>
        <nav>
          <div style={{ marginBottom: 24 }}>
            <MenuItem icon="🏠" label={t("dashboard")}
              to="/" active={window.location.pathname === "/"} />
            <MenuItem icon="💬" label={t("comments")}
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
      {/* Main Content */}
      <main style={{ flex: 1, padding: 32 }}>
        {/* Top Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <input
            type="search"
            placeholder={t("search")}
            style={{
              borderRadius: 20,
              border: "1px solid #ddd",
              padding: "8px 16px",
              width: 220,
              outline: "none",
              background: "#f8f6f2"
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
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
        </div>
        {/* Filters */}
        <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16 }}>
          <button style={filterBtnStyle}>{t("filterBy")}</button>
          <input type="date" style={dateInputStyle} />
          <button style={filterBtnStyle}>{t("clientName")}</button>
          <button style={{ ...filterBtnStyle, color: "#d44", border: "1px solid #d44", marginLeft: lang === "en" ? 0 : "auto", marginRight: lang === "he" ? 0 : "auto" }}>{t("resetFilter")}</button>
        </div>
        {/* Table */}
        <div style={{ background: "#f8f6f2", borderRadius: 16, boxShadow: "0 2px 8px #0001", padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
            <thead>
              <tr style={{ background: "#ede6d6", color: "#222", textAlign: "center" }}>
                <th style={thStyle}>{t("clientName")}</th>
                <th style={thStyle}>{t("date")}</th>
                <th style={thStyle}>{t("commentDesc")}</th>
              </tr>
            </thead>
            <tbody>
              {/* Empty rows for now */}
              {[1,2,3].map(i => (
                <tr key={i} style={{ borderBottom: "1px solid #e0d7c6", textAlign: "center" }}>
                  <td style={tdStyle}></td>
                  <td style={tdStyle}></td>
                  <td style={tdStyle}></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Bottom Buttons */}
        <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 24 }}>
          <button style={bottomBtnStyle}>{t("allComments")}</button>
          <button style={bottomBtnStyle}>{t("commentsAddedThisWeek")}</button>
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

const filterBtnStyle: React.CSSProperties = {
  border: "1px solid #cfc6b0",
  background: "#f3f0ea",
  borderRadius: 20,
  padding: "6px 18px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: 14,
};

const dateInputStyle: React.CSSProperties = {
  border: "1px solid #cfc6b0",
  background: "#f3f0ea",
  borderRadius: 20,
  padding: "6px 18px",
  fontWeight: "bold",
  fontSize: 14,
};

const thStyle: React.CSSProperties = {
  padding: "16px 8px",
  fontWeight: "bold",
  borderBottom: "2px solid #e0d7c6",
};

const tdStyle: React.CSSProperties = {
  padding: "12px 8px",
  minHeight: 48,
};

const bottomBtnStyle: React.CSSProperties = {
  border: "1px solid #cfc6b0",
  background: "#f3f0ea",
  borderRadius: 20,
  padding: "10px 32px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: 16,
};
