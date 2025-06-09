import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from '../pages/Dashboard';
import { CommentsPage } from '../pages/comment';
import { DataAnalysisPage } from '../pages/DataAnalysisPage';
import { ImprovementSuggestionsPage } from '../pages/ImprovementSuggestionsPage';
import { ClientsPage } from '../pages/ClientsPage';
import { ToDoPage } from '../pages/ToDoPage';
import  AdminLayout  from '../layouts/AdminLayout'; // ✅ make sure this path is correct
import LoginPage from '../pages/LoginPage';
import { useAuth } from '../context/auth-context';
import LandingPage from '../pages/LandingPage';
import GreetingPage from '../pages/GreetingPage';
import BusinessRegistrationPage from '../pages/BusinessRegistration';
import CustomerProfilePage from '../pages/CustomerProfilePage';
interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading ,isAdmin  } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};
interface AppRoutesProps {
  handleToggle: () => void;
  isDarkMode: boolean;
}
const AppRoutes: React.FC<AppRoutesProps> = ({handleToggle, isDarkMode }) => {
  return (
    <Routes>
      <Route path="/" element={<BusinessRegistrationPage />}/>
      {/* <Route path="/" element={<LandingPage />}/> */}
      <Route path="/customerProfile" element={<CustomerProfilePage />}/>
      <Route path="/login" element={<LoginPage />}/>
      <Route path="/GreetingPage" element={<GreetingPage />}/>
      <Route path="/dashboard" element={
        <PrivateRoute>
           <AdminLayout handleToggle={handleToggle} isDarkMode={isDarkMode}>
              <Dashboard />
            </AdminLayout>
        </PrivateRoute>
        } />
      
      <Route path="/reviews" element={
        <PrivateRoute>
            <AdminLayout handleToggle={handleToggle} isDarkMode={isDarkMode}>
                <CommentsPage />
            </AdminLayout>
        </PrivateRoute>
        } />
      <Route path="/data-analysis" element={
        <PrivateRoute>
            <AdminLayout handleToggle={handleToggle} isDarkMode={isDarkMode}>
                 <DataAnalysisPage />
            </AdminLayout>
        </PrivateRoute>
        } />
      <Route path="/optimization" element={
          <PrivateRoute>
           <AdminLayout handleToggle={handleToggle} isDarkMode={isDarkMode}>
                  <ImprovementSuggestionsPage />
            </AdminLayout>
          </PrivateRoute>
        } />
      <Route path="/customers" element={
        <PrivateRoute>
              <AdminLayout handleToggle={handleToggle} isDarkMode={isDarkMode}>
                  <ClientsPage />
              </AdminLayout>
        </PrivateRoute>
        }/>
      <Route path="/todo" element={
        <PrivateRoute>
              <AdminLayout handleToggle={handleToggle} isDarkMode={isDarkMode}>
                  <ToDoPage />
              </AdminLayout>
        </PrivateRoute>
        } />

        
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
