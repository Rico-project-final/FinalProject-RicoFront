import './App.css'
import { Dashboard } from './dashbord.tsx'
import { CommentsPage } from './comment.tsx'
import { DataAnalysisPage } from './DataAnalysisPage'
import { ImprovementSuggestionsPage } from './ImprovementSuggestionsPage'
import { ClientsPage } from './ClientsPage'
import { ToDoPage } from './ToDoPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './LanguageContext'

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/comments" element={<CommentsPage />} />
          <Route path="/data-analysis" element={<DataAnalysisPage />} />
          <Route path="/improvement" element={<ImprovementSuggestionsPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/todo" element={<ToDoPage />} />
        </Routes>
      </Router>
    </LanguageProvider>
  )
}

export default App
