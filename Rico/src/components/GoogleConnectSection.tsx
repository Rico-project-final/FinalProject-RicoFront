/**
 * GoogleConnectSection Component
 * ------------------------------
 * Manages the UI for connecting a business to Google Business Profile,
 * displaying the Google Places search if not connected, and showing
 * sync status and controls if connected.
 * 
 * Props:
 * - isGoogleConnected: Whether the business is already connected to Google.
 * - isSyncing: Indicates if a review sync operation is currently in progress.
 * - lastSyncDate: Date of the last successful sync, or null if none.
 * - onSyncReviews: Callback to trigger syncing reviews from Google.
 * - onPlaceSelected: Callback when a place is selected in the Google map search.
 * - onConnectBusiness: Callback to connect the selected place as the business.
 * - selectedBusiness: The currently selected business place result from Google Places.
 */

import React from "react";
import { Box, Paper, Typography, Button, CircularProgress } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import GoogleMapSearch from "../components/GoogleMapSearch";

interface GoogleConnectSectionProps {
  isGoogleConnected: boolean;
  isSyncing: boolean;
  lastSyncDate: Date | null;
  onSyncReviews: () => void;
  onPlaceSelected: (place: google.maps.places.PlaceResult) => void;
  onConnectBusiness: (place: google.maps.places.PlaceResult) => void;
  selectedBusiness: google.maps.places.PlaceResult | null;
}

const GoogleConnectSection: React.FC<GoogleConnectSectionProps> = ({
  isGoogleConnected,
  isSyncing,
  lastSyncDate,
  onSyncReviews,
  onPlaceSelected,
  onConnectBusiness,
  selectedBusiness,
}) => {
  // If not connected to Google Business, show search UI to select and connect a business
  if (!isGoogleConnected) {
    return (
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <GoogleIcon sx={{ color: "#4285F4", fontSize: 28 }} />
          <Typography sx={{ fontWeight: "bold", fontSize: 20, color: "text.primary" }}>
            התחברות לGoogle Business
          </Typography>
        </Box>

        <Paper
          sx={{
            minWidth: 280,
            height: 300,
            borderRadius: 2,
            backgroundColor: "background.paper",
          }}
        >
          {/* Google Map search component to find and select a business */}
          <GoogleMapSearch
            onPlaceSelected={onPlaceSelected}
            onConnectBusiness={onConnectBusiness}
            selectedBusiness={selectedBusiness}
          />
        </Paper>
      </Box>
    );
  }

  // If connected, show sync status, last sync date, and sync button
  return (
    <Paper sx={{ mt: 4, p: 3 }}>
      <Typography>✔️ העסק שלך מחובר ל-Google</Typography>
      <Typography variant="body2">
        סנכרון אחרון: {lastSyncDate ? lastSyncDate.toLocaleDateString() : "לא בוצע סנכרון עדיין"}
      </Typography>

      {isSyncing ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
          {/* Show loading spinner and syncing text during sync */}
          <CircularProgress size={20} />
          <Typography variant="body2">הביקורות מסונכרנות כעת...</Typography>
        </Box>
      ) : (
        // Sync button to manually trigger reviews sync
        <Button variant="outlined" onClick={onSyncReviews}>
          סנכרן שוב ביקורות
        </Button>
      )}
    </Paper>
  );
};

export default GoogleConnectSection;
