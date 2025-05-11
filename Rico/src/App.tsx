import './App.css'
import { Dashboard } from './pages/Dashboard'
import { CommentsPage } from './pages/comment'
import { DataAnalysisPage } from './pages/DataAnalysisPage'
import { ImprovementSuggestionsPage } from './pages/ImprovementSuggestionsPage'
import { ClientsPage } from './pages/ClientsPage'
import { ToDoPage } from './pages/ToDoPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'

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
