/**
 * StatsCards Component
 * 
 * Displays a horizontal list of statistic cards, each showing a translated label,
 * a numeric value from the provided totalStats object, and an icon.
 * 
 * Props:
 * - stats: An array of stat objects defining each card's label ,
 *          icon, and optional styling properties.
 * - totalStats: An object mapping stat labels to their corresponding numeric values.
 * 
 * This component uses the language context to translate labels dynamically,
 * and applies Material-UI theming and styling for consistent appearance.
 */

import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import { TranslationKeys } from "../context/language/types";
import { useLanguage } from "../context/language/LanguageContext";

interface Stat {
  label: keyof TranslationKeys;  
  icon: string;                  
  changeColor: string;           
  changeText: keyof TranslationKeys; 
}

interface StatsCardsProps {
  stats: Stat[];                     // Array of stats to display
  totalStats: Record<string, number>; // Object with stat values keyed by label strings
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats, totalStats }) => {
  const { t } = useLanguage(); 

  return (
    // Container Box that arranges stat cards side-by-side with spacing
    <Box sx={{ display: "flex", gap: 3, mb: 4 }}>
      {stats.map((stat) => (
        <Paper
          key={stat.label}
          sx={{
            backgroundColor: "background.paper", 
            borderRadius: 2,
            boxShadow: 3,
            p: 3,
            minWidth: 220,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
            {t(stat.label)}
          </Typography>

          <Typography sx={{ fontSize: 28, color: "text.primary" }}>
            {totalStats[stat.label as keyof typeof totalStats]} {stat.icon}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
};

export default StatsCards;
