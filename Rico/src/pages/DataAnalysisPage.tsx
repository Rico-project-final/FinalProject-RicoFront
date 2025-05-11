import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const chartData = [
  { month: 'ינו', food: 1, service: 1.2, overall: 0.8 },
  { month: 'פבר', food: 1.3, service: 2.2, overall: 1.5 },
  { month: 'מרץ', food: 2.5, service: 1.8, overall: 1.2 },
  { month: 'אפר', food: 1.2, service: 1, overall: 2.2 },
  { month: 'מאי', food: 2.1, service: 0.5, overall: 1.5 },
  { month: 'יונ', food: 2.2, service: 1.8, overall: 0.5 },
];

const DataAnalysisPage: React.FC = () => {
  return (
    <Box sx={{ p: 4, backgroundColor: '#f8f7f3', minHeight: '100vh' }} dir="rtl">
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold', textAlign: 'right' }}>
        ניתוח נתונים
      </Typography>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          p: 3,
          height: '100%',
          maxWidth: 700,
          margin: '0 auto',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'right' }}>
            מגמות לפי חודשים
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <Typography variant="body2">שנה זו</Typography>
            <Box component="span" sx={{ mr: 1 }}>▼</Box>
          </Box>
        </Box>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 10,
            }}
          >
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend align="center" verticalAlign="bottom" />
            <Line
              type="monotone"
              dataKey="food"
              name="אוכל"
              stroke="#8884d8"
              strokeWidth={2}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="service"
              name="שירות"
              stroke="#e91e63"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="overall"
              name="חוויה כוללת"
              stroke="#82ca9d"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
};

export default DataAnalysisPage; 