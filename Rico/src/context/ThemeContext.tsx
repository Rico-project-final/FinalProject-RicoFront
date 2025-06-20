// context/ThemeContext.tsx
import React, { createContext, useContext, useState, useMemo } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";
import { lightTheme, darkTheme } from "../theme"; // ✅ Your MUI theme definitions

type ThemeMode = "light" | "dark";

export interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  theme: ReturnType<typeof createTheme>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>("light");

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const theme = useMemo(() => createTheme(mode === "light" ? lightTheme : darkTheme), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, theme }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useCustomTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useCustomTheme must be used within CustomThemeProvider");
  return context;
};
