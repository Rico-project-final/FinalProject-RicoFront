import { Box, Button, Paper, Typography } from "@mui/material";
import { useLanguage } from "../context/language/LanguageContext";


const CommentsColumn: React.FC<{
  comments: string[];
  type: "positive" | "negative";
}> = ({ comments, type }) => {
  const { t } = useLanguage();

  return (
    <Box sx={{ flex: 1 }}>
      <Typography
        variant="h6"
        fontWeight="bold"
        textAlign="center"
        color={type === "positive" ? "#d2f5e3" : "#f5d2d2"}
        sx={{ mb: 2 }}
      >
        {t(type)}
      </Typography>

      {comments.map((comment, idx) => (
        <Paper
          key={idx}
          sx={{
            bgcolor: type === "positive" ? "#eafaf3" : "#faecea",
            borderRadius: 2,
            p: 2,
            mb: 2,
          }}
        >
          <Typography sx={{ mb: 1 }}>{comment}</Typography>
          <Button
            variant="outlined"
            sx={{
              borderRadius: 20,
              bgcolor: type === "positive" ? "#d2f5e3" : "#f5d2d2",
              border: "1px solid #cfc6b0",
              fontWeight: "bold",
              fontSize: 14,
              px: 3,
              py: 1,
            }}
          >
            {t("suggestTreatment")}
          </Button>
        </Paper>
      ))}
    </Box>
  );
};
export default CommentsColumn;