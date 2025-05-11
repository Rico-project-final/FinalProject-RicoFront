import React, { useState } from "react";
import { Link } from "react-router-dom";
import ricoLogo from '../assets/rico-logo.png';
import { useLanguage } from "../context/LanguageContext";

const clients = [
  { id: "00001", name: "אורי נתן", phone: "052-6632457", date: "14 Feb 2019" },
  { id: "00002", name: "אפרי מויאל", phone: "053-6647867", date: "14 Feb 2019" },
  { id: "00003", name: "מתן בן סעד", phone: "054-6579876", date: "14 Feb 2019" },
  { id: "00004", name: "אביגיל גבאי", phone: "050-5656745", date: "14 Feb 2019" },
  { id: "00005", name: "אבי תקווה", phone: "050-4435425", date: "14 Feb 2019" },
  { id: "00006", name: "שלומית מלכי", phone: "053-6657827", date: "14 Feb 2019" },
  { id: "00007", name: "חיים שלום", phone: "050-4438854", date: "14 Feb 2019" },
  { id: "00008", name: "שגיא טל", phone: "050-9900388", date: "14 Feb 2019" },
];

const translations = {
  he: {
    title: "לקוחות",
    id: "מספר מזהה",
    name: "שם",
    phone: "טלפון",
    date: "תאריך",
    search: "חפש שם לקוח",
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
    title: "Clients",
    id: "ID",
    name: "Name",
    phone: "Phone",
    date: "Date",
    search: "Search client name",
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

export const ClientsPage: React.FC = () => {
  const { lang, setLang } = useLanguage();
  const [currentUser] = useState({ name: "yuval miles", role: "Admin" });
  const t = translations[lang];
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // Close menu on outside click
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      setOpenMenu(null);
    };
    if (openMenu) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [openMenu]);

  const filteredClients = clients.filter(c =>
    c.name.includes(search) || c.id.includes(search) || c.phone.includes(search)
  );

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
          <MenuItem icon="👥" label={t.clients} active />
          <MenuItem icon="📝" label={t.todo} to="/todo" active={window.location.pathname === "/todo"} />
          <div style={{ marginTop: 32 }}>
            <MenuItem icon="⚙️" label={t.settings} to="/settings" active={window.location.pathname === "/settings"} />
            <MenuItem icon="🚪" label={t.logout} to="/logout" active={window.location.pathname === "/logout"} />
          </div>
        </nav>
      </aside>
      {/* Main Content */}
      <main style={{ flex: 1, padding: 32 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <input
            type="search"
            placeholder={t.search}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              borderRadius: 20,
              border: "1px solid #ddd",
              padding: "8px 16px",
              width: 260,
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
        {/* Table */}
        <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001", padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
            <thead>
              <tr style={{ background: "#f5f2e7", color: "#222", textAlign: "center" }}>
                <th style={thStyle}>{t.id}</th>
                <th style={thStyle}>{t.name}</th>
                <th style={thStyle}>{t.phone}</th>
                <th style={thStyle}>{t.date}</th>
                <th style={thStyle}></th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((c, i) => (
                <tr key={c.id} style={{ borderBottom: "1px solid #e0d7c6", textAlign: "center", position: "relative" }}>
                  <td style={tdStyle}>{c.id}</td>
                  <td style={tdStyle}>{c.name}</td>
                  <td style={tdStyle}>{c.phone}</td>
                  <td style={tdStyle}>{c.date}</td>
                  <td style={tdStyle}>
                    <span
                      style={{ fontSize: 22, cursor: "pointer" }}
                      onClick={e => {
                        e.stopPropagation();
                        setOpenMenu(openMenu === c.id ? null : c.id);
                      }}
                    >⋯</span>
                    {openMenu === c.id && (
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: lang === "he" ? 0 : "unset",
                          right: lang === "en" ? 0 : "unset",
                          background: "#fff",
                          boxShadow: "0 2px 8px #0002",
                          borderRadius: 8,
                          zIndex: 10,
                          minWidth: 100,
                          padding: 0
                        }}
                        onClick={e => e.stopPropagation()}
                      >
                        <button
                          style={{
                            width: "100%",
                            padding: "10px 16px",
                            border: "none",
                            background: "none",
                            textAlign: lang === "he" ? "left" : "right",
                            cursor: "pointer"
                          }}
                          onClick={() => {
                            setOpenMenu(null);
                            alert(`עריכת לקוח: ${c.name}`);
                          }}
                        >
                          {lang === "he" ? "ערוך" : "Edit"}
                        </button>
                      </div>
                    )}
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