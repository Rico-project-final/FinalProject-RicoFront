import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const translations = {
  he: {
    dashboard: "דשבורד",
    comments: "תגובות",
    dataAnalysis: "ניתוח נתונים",
    optimizationSuggestions: "הצעות ייעול",
    clients: "לקוחות",
    toDo: "משימות",
    settings: "הגדרות",
    logout: "התנתק",
    pages: "דפים",
    search: "חיפוש",
    filterBy: "סנן לפי",
    thisWeek: "השבוע",
    food: "אוכל",
    service: "שירות",
    experience: "חוויה כוללת",
    filter: "סנן",
    date: "תאריך",
    clientName: "שם הלקוח",
    all: "הכל"
  },
  en: {
    dashboard: "Dashboard",
    comments: "Comments",
    dataAnalysis: "Data Analysis",
    optimizationSuggestions: "Optimization Suggestions",
    clients: "Clients",
    toDo: "To-Do",
    settings: "Settings",
    logout: "Logout",
    pages: "Pages",
    search: "Search",
    filterBy: "Filter By",
    thisWeek: "This Week",
    food: "Food",
    service: "Service",
    experience: "Overall Experience",
    filter: "Filter",
    date: "Date",
    clientName: "Client Name",
    all: "All"
  }
};

type Lang = "he" | "en";

export const DataAnalysisPage: React.FC = () => {
  const { lang, setLang } = useLanguage();
  const [currentUser] = useState({ name: "yuval miles", role: "Admin" });
  const t = (key: keyof typeof translations["he"]) => translations[lang][key];

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
        <div style={{ marginBottom: 32, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ fontWeight: "bold", fontSize: 24 }}>🖋️</div>
          <span style={{ fontWeight: "bold", fontSize: 20 }}>RICO</span>
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
        {/* Main Title */}
        <h1 style={{ marginBottom: 24 }}>{t("dataAnalysis")}</h1>
        {/* Filters */}
        <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 32 }}>
          <button style={filterBtnStyle}>{t("filterBy")}</button>
          <button style={filterBtnStyle}>{t("date")}</button>
          <button style={filterBtnStyle}>{t("clientName")}</button>
          <button style={filterBtnStyle}>{t("all")}</button>
          <input
            type="search"
            placeholder={t("search")}
            style={{
              borderRadius: 20,
              border: "1px solid #ddd",
              padding: "8px 16px",
              width: 220,
              outline: "none",
              background: "#f8f6f2",
              marginRight: lang === "he" ? 0 : 16,
              marginLeft: lang === "en" ? 0 : 16
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
        {/* Example Charts Section */}
        <div style={{ display: "flex", gap: 24, marginBottom: 32 }}>
          <DataCard title={t("experience")}/>
          <DataCard title={t("service")}/>
          <DataCard title={t("food")}/>
        </div>
        {/* Comments Section - two columns */}
        <div style={{ display: "flex", gap: 24, background: "#e7e1d2" }}>
          {/* Positive Comments */}
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: "bold", fontSize: 20, marginBottom: 16, textAlign: "center" }}>{t("comments")}</div>
            <div style={{ background: "#eafaf3", borderRadius: 16, padding: 16, marginBottom: 16 }}>
              <div style={{ marginBottom: 8 }}>
                "האוכל היה מצוין! המנות היו מתובלות בצורה מושלמת, חומרי הגלם היו טריים והטעמים השתלבו נהדר. הכל הוגש בזמן ובטמפרטורה הנכונה, ממש חוויה קולינרית מהנה. בהחלט נחזור שוב!"
              </div>
              <button style={{ ...buttonStyle, background: "#d2f5e3" }}>הצעת טיפול</button>
            </div>
            <div style={{ background: "#eafaf3", borderRadius: 16, padding: 16 }}>
              <div style={{ marginBottom: 8 }}>
                "השירות היה אדיב והאוכל טעים. כל מה שהובטח היה קיים והכל הגיע בזמן. בהחלט נחזור!"
              </div>
              <button style={{ ...buttonStyle, background: "#d2f5e3" }}>הצעת טיפול</button>
            </div>
          </div>
          {/* Negative Comments */}
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: "bold", fontSize: 20, marginBottom: 16, textAlign: "center" }}>{t("comments")}</div>
            <div style={{ background: "#faecea", borderRadius: 16, padding: 16, marginBottom: 16 }}>
              <div style={{ marginBottom: 8 }}>
                "האוכל שהוגש היה מאכזב מאוד. הטעמים היו שטוחים, המנות לא היו מתובלות מספיק, וחלק מהאוכל אפילו הגיע קר. ציפיתי להרבה יותר בהתחשב במחיר ששילמנו."
              </div>
              <button style={{ ...buttonStyle, background: "#f5d2d2" }}>הצעת טיפול</button>
            </div>
            <div style={{ background: "#faecea", borderRadius: 16, padding: 16 }}>
              <div style={{ marginBottom: 8 }}>
                "החוויה הקולינרית הייתה פשוט מאכזבת. המנות קטנות, חלק מהן חסרות טעם ובאופן כללי לא נהנינו מהאוכל."
              </div>
              <button style={{ ...buttonStyle, background: "#f5d2d2" }}>הצעת טיפול</button>
            </div>
          </div>
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

function DataCard({ title }: { title: string }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, flex: 1, padding: 24, minWidth: 220, boxShadow: "0 2px 8px #0001", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
      <div style={{ fontWeight: "bold", fontSize: 18, marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 14, color: "#888", marginBottom: 8 }}>This Week ▼</div>
      {/* Placeholder for chart */}
      <div style={{ width: "100%", height: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 120, height: 120, borderRadius: "50%", background: "#e7e1d2", display: "flex", alignItems: "center", justifyContent: "center", color: "#bbb", fontSize: 32 }}>
          📊
        </div>
      </div>
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

const buttonStyle: React.CSSProperties = {
  border: "1px solid #cfc6b0",
  background: "#f3f0ea",
  borderRadius: 20,
  padding: "6px 18px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: 14,
}; 