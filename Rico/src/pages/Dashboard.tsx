import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  Button,
  Stack
} from '@mui/material';
import { 
  PeopleOutline as PeopleIcon,
  QuestionAnswer as QuestionIcon,
  ChatBubbleOutline as CommentIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample data for the chart
const chartData = [
  { month: 'ינו', food: 1, service: 1.2, overall: 0.8 },
  { month: 'פבר', food: 1.3, service: 2.2, overall: 1.5 },
  { month: 'מרץ', food: 2.5, service: 1.8, overall: 1.2 },
  { month: 'אפר', food: 1.2, service: 1, overall: 2.2 },
  { month: 'מאי', food: 2.1, service: 0.5, overall: 1.5 },
  { month: 'יונ', food: 2.2, service: 1.8, overall: 0.5 },
];

interface StatCardProps {
  title: string;
  value: number;
  percentChange: number;
  isIncrease: boolean;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, percentChange, isIncrease, icon }) => {
  return (
    <Card elevation={0} sx={{ height: '100%', borderRadius: 2 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right' }}>
            {title}
          </Typography>
          <Box sx={{ backgroundColor: 'rgba(235, 235, 255, 0.8)', p: 1, borderRadius: '50%' }}>
            {icon}
          </Box>
        </Box>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'right' }}>
          {value}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: isIncrease ? 'success.main' : 'error.main',
            justifyContent: 'flex-end'
          }}
        >
          {isIncrease ?
            <TrendingUpIcon fontSize="small" sx={{ ml: 0.5 }} /> :
            <TrendingDownIcon fontSize="small" sx={{ ml: 0.5 }} />
          }
          <Typography variant="body2">
            {percentChange}% {isIncrease ? 'עלייה' : 'ירידה'} מאתמול
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

interface ReviewCardProps {
  review: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <Box sx={{ py: 3, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
      <Typography variant="body2" sx={{ mb: 2, textAlign: 'right' }}>
        {review}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 1 }}>
        <Button
          variant="outlined"
          size="small"
          sx={{
            borderRadius: 2,
            borderColor: 'rgba(0,0,0,0.2)',
            color: 'text.primary',
            textTransform: 'none',
            px: 2
          }}
        >
          הצג תגובה
        </Button>
        <Button
          variant="outlined"
          size="small"
          sx={{
            borderRadius: 2,
            borderColor: 'rgba(0,0,0,0.2)',
            color: 'text.primary',
            textTransform: 'none',
            px: 2
          }}
        >
          הצעה לטיפול
        </Button>
      </Box>
    </Box>
  );
};

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ p: 4, backgroundColor: '#f8f7f3', minHeight: '100vh' }} dir="rtl">
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold', textAlign: 'right' }}>
        לוח בקרה
      </Typography>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <StatCard 
            title="לקוחות" 
            value={112} 
            percentChange={8.5} 
            isIncrease={true}
            icon={<PeopleIcon sx={{ color: '#7B68EE' }} />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard 
            title="שאלונים" 
            value={100} 
            percentChange={4.3} 
            isIncrease={false}
            icon={<QuestionIcon sx={{ color: '#7B68EE' }} />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard 
            title="תגובות" 
            value={52} 
            percentChange={1.8} 
            isIncrease={true}
            icon={<CommentIcon sx={{ color: '#7B68EE' }} />}
          />
        </Grid>
      </Grid>
      
      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Chart Section - right */}
        <Grid item xs={12} lg={5}>
          <Paper 
            elevation={0} 
            sx={{ 
              borderRadius: 2, 
              p: 3,
              height: '100%'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'right' }}>
                כל התחומים
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
        </Grid>
        
        {/* Reviews Section - left */}
        <Grid item xs={12} lg={7}>
          <Paper 
            elevation={0} 
            sx={{ 
              borderRadius: 2, 
              overflow: 'hidden',
              mb: 3
            }}
          >
            <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'right' }}>
                תגובות שנוספו השבוע
              </Typography>
            </Box>
            
            <ReviewCard
              review="האוכל שהוגש היה מאכזב מאוד. הטעמים היו שטוחים, המנות לא היו מתובלות מספיק, וחלק מהאוכל אפילו הגיע קר. ציפיתי להרבה יותר בהתחשב במחיר ששילמנו."
            />
            
            <ReviewCard
              review="האוכל היה מצוין! המנות היו מתובלות בצורה מושלמת, חומרי הגלם היו טריים והטעמים השתלבו נהדר. הכל הוגש בזמן ובטמפרטורה הנכונה, ממש חוויה קולינרית מהנה. בהחלט נחזור שוב!"
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;