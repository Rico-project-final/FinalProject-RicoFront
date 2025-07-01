/**
 * QrCodeSection Component
 * -----------------------
 * This component allows the user to generate and display a QR code.
 * - Displays a section with a title, a button to generate the QR code,
 *   and if a QR code image exists, it shows the image and a download button.
 * 
 * Props:
 * - qrImage: string | null - URL or base64 of the generated QR code image.
 * - onGenerateQR: () => void - Callback function to trigger QR code generation.
 */

import React from "react";
import { Paper, Typography, Button } from "@mui/material";

interface QrCodeSectionProps {
  qrImage: string | null;          // The current QR code image URL or null if none
  onGenerateQR: () => void;        // Callback to generate a new QR code
}

const QrCodeSection: React.FC<QrCodeSectionProps> = ({ qrImage, onGenerateQR }) => (
  <Paper
    sx={{
      minWidth: 280,
      p: 3,
      borderRadius: 2,
      backgroundColor: "background.paper",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 2,
    }}
  >
    {/* Section title */}
    <Typography sx={{ fontWeight: "bold", fontSize: 20, color: "text.primary" }}>
      יצירת QR
    </Typography>

    {/* Button to generate QR code */}
    <Button onClick={onGenerateQR} variant="contained">
      צור QR
    </Button>

    {/* If a QR image is available, display it and show a download button */}
    {qrImage && (
      <>
        <img
          src={qrImage}
          alt="QR Code"
          style={{ marginTop: 16, width: 200, height: 200 }}
        />
        <Button
          onClick={() => {
            // Create a temporary link to download the QR code image
            const link = document.createElement("a");
            link.href = qrImage;
            link.download = "business-qr.png";
            link.click();
          }}
          variant="outlined"
        >
          הורד QR
        </Button>
      </>
    )}
  </Paper>
);

export default QrCodeSection;
