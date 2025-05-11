import axios from 'axios';
import { Configuration, OpenAIApi } from 'openai';

// נשתמש ב-mock כברירת מחדל
const USE_MOCK = true;

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

interface Comment {
  text: string;
  category: 'food' | 'service' | 'experience';
  sentiment: 'positive' | 'negative';
  date: string;
  rating: number;
}

interface AnalysisResult {
  food: { excellent: number; good: number; poor: number };
  service: { excellent: number; good: number; poor: number };
  experience: { excellent: number; good: number; poor: number };
}

export const analyzeComments = async (comments: Comment[]): Promise<AnalysisResult> => {
  if (USE_MOCK) {
    return mockAnalyzeComments(comments);
  }

  try {
    const prompt = `Analyze the following restaurant reviews and categorize them into three categories: food, service, and overall experience. For each category, determine if the review is excellent, good, or poor. Return the results as a JSON object with the following structure:
    {
      "food": { "excellent": number, "good": number, "poor": number },
      "service": { "excellent": number, "good": number, "poor": number },
      "experience": { "excellent": number, "good": number, "poor": number }
    }
    
    Reviews:
    ${comments.map(c => `Category: ${c.category}, Sentiment: ${c.sentiment}, Text: ${c.text}`).join('\n')}`;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 500,
      temperature: 0.7,
    });

    const result = JSON.parse(response.data.choices[0].text || '{}');
    return result;
  } catch (error) {
    console.error('Error analyzing comments:', error);
    return mockAnalyzeComments(comments); // נשתמש ב-mock במקרה של שגיאה
  }
};

// Mock API endpoint for development
export const mockAnalyzeComments = async (comments: Comment[]): Promise<AnalysisResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Count comments by category and sentiment
  const result: AnalysisResult = {
    food: { excellent: 0, good: 0, poor: 0 },
    service: { excellent: 0, good: 0, poor: 0 },
    experience: { excellent: 0, good: 0, poor: 0 }
  };

  comments.forEach(comment => {
    const category = comment.category;
    if (comment.sentiment === 'positive') {
      result[category].excellent += 1;
    } else if (comment.sentiment === 'negative') {
      result[category].poor += 1;
    } else {
      result[category].good += 1;
    }
  });

  return result;
};

// Mock API endpoint for fetching comments
export const fetchComments = async (): Promise<Comment[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return [
    {
      text: 'האוכל היה מצוין! המנות היו מתובלות בצורה מושלמת, חומרי הגלם היו טריים והטעמים השתלבו נהדר.',
      category: 'food',
      sentiment: 'positive',
      date: '2024-03-20',
      rating: 5
    },
    {
      text: 'השירות היה מעולה, המלצרים היו אדיבים ומקצועיים.',
      category: 'service',
      sentiment: 'positive',
      date: '2024-03-19',
      rating: 5
    },
    {
      text: 'החוויה הכללית הייתה נהדרת, האווירה נעימה והמקום נקי ומסודר.',
      category: 'experience',
      sentiment: 'positive',
      date: '2024-03-18',
      rating: 5
    },
    {
      text: 'האוכל היה קר ולא טרי, מאכזב מאוד.',
      category: 'food',
      sentiment: 'negative',
      date: '2024-03-17',
      rating: 2
    },
    {
      text: 'השירות היה איטי והמלצרים לא היו זמינים.',
      category: 'service',
      sentiment: 'negative',
      date: '2024-03-16',
      rating: 2
    },
    {
      text: 'החוויה הכללית הייתה גרועה, המקום היה רועש מדי.',
      category: 'experience',
      sentiment: 'negative',
      date: '2024-03-15',
      rating: 2
    }
  ];
};

// פונקציה לקבלת תגובות ממוינות מהשרת
export const fetchAnalyzedComments = async (): Promise<{
  comments: Comment[];
  analysis: AnalysisResult;
}> => {
  try {
    const response = await axios.get('/api/comments/analyzed');
    return response.data;
  } catch (error) {
    console.error('Error fetching analyzed comments:', error);
    // במקרה של שגיאה, נחזיר נתונים לדוגמה
    return {
      comments: [
        {
          text: "האוכל היה מעולה! הטעמים היו מדהימים והשירות היה מצוין.",
          category: "food",
          sentiment: "positive",
          date: "2024-03-20",
          rating: 5
        },
        {
          text: "השירות היה איטי והמנות הגיעו קר.",
          category: "service",
          sentiment: "negative",
          date: "2024-03-19",
          rating: 2
        },
        {
          text: "חוויה נהדרת! האווירה הייתה נעימה והאוכל היה טעים.",
          category: "experience",
          sentiment: "positive",
          date: "2024-03-18",
          rating: 4
        }
      ],
      analysis: {
        food: { excellent: 65, good: 25, poor: 10 },
        service: { excellent: 45, good: 35, poor: 20 },
        experience: { excellent: 55, good: 30, poor: 15 }
      }
    };
  }
};

// פונקציה לקבלת הצעות טיפול לתגובה שלילית
export const getTreatmentSuggestions = async (comment: Comment): Promise<string[]> => {
  if (USE_MOCK) {
    // נתחיל עם הצעות בסיסיות
    const suggestions: { [key: string]: string[] } = {
      food: [
        "בדיקת טריות המזון לפני ההגשה",
        "שיפור מערכת שמירת המזון",
        "הדרכת צוות המטבח על טמפרטורות הגשה",
        "בדיקת איכות חומרי הגלם"
      ],
      service: [
        "הגדלת מספר המלצרים בשעות העומס",
        "שיפור מערכת ניהול התורים",
        "הדרכת צוות על זמני תגובה",
        "ייעול תהליכי קבלת הזמנות"
      ],
      experience: [
        "שיפור אקוסטיקה במקום",
        "התאמת תאורה לאווירה",
        "שיפור ניקיון ותחזוקה",
        "הוספת אזורי המתנה נוחים"
      ]
    };
    
    // נחזיר הצעות לפי הקטגוריה
    return suggestions[comment.category] || [];
  }

  try {
    const prompt = `Given the following negative restaurant review, provide 4 specific and actionable suggestions for improvement. The review is about ${comment.category} and says: "${comment.text}". 
    Return the suggestions as a JSON array of strings.`;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 200,
      temperature: 0.7,
    });

    const suggestions = JSON.parse(response.data.choices[0].text || '[]');
    return suggestions;
  } catch (error) {
    console.error('Error getting treatment suggestions:', error);
    return [];
  }
}; 