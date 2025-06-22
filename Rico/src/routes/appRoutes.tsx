import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from '../pages/Dashboard';
import { CommentsPage } from '../pages/CommentsPage';
import { DataAnalysisPage } from '../pages/DataAnalysisPage';
import { ImprovementSuggestionsPage } from '../pages/ImprovementSuggestionsPage';
import { ClientsPage } from '../pages/ClientsPage';
import { ToDoPage } from '../pages/ToDoPage';
import  AdminLayout  from '../layouts/AdminLayout'; 
import LoginPage from '../pages/AccessDeniedPage';
import { useAuth } from '../context/auth-context';
import LandingPage from '../pages/LandingPage';
import GreetingPage from '../pages/GreetingPage';
import BusinessRegistrationPage from '../pages/BusinessRegistration';
import CustomerProfilePage from '../pages/CustomerProfilePage';
import VerifyEmailPage from '../pages/VerifyEmailPage';


interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isLoading ,isAdmin  } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/deniedAccess" />;
  }
  return <>{children}</>;
};
const AppRoutes: React.FC = () => {

  return (
    <Routes>
      <Route path="/" element={<BusinessRegistrationPage />}/>
      <Route path="/review/:businessId" element={<LandingPage />} />
      <Route path="/customerProfile" element={<CustomerProfilePage />}/>
      <Route path="/verifyEmail" element={<VerifyEmailPage />} />
      <Route path="/deniedAccess" element={<LoginPage />}/>
      <Route path="/GreetingPage" element={<GreetingPage />}/>
      <Route path="/dashboard" element={
        <PrivateRoute>
           <AdminLayout>
              <Dashboard />
            </AdminLayout>
        </PrivateRoute>
        } />
      
      <Route path="/reviews" element={
        <PrivateRoute>
            <AdminLayout>
                <CommentsPage />
            </AdminLayout>
        </PrivateRoute>
        } />
      <Route path="/data-analysis" element={
        <PrivateRoute>
            <AdminLayout>
                 <DataAnalysisPage />
            </AdminLayout>
        </PrivateRoute>
        } />
      <Route path="/optimization" element={
          <PrivateRoute>
           <AdminLayout>
                  <ImprovementSuggestionsPage />
            </AdminLayout>
          </PrivateRoute>
        } />
      <Route path="/customers" element={
        <PrivateRoute>
              <AdminLayout>
                  <ClientsPage />
              </AdminLayout>
        </PrivateRoute>
        }/>
      <Route path="/todo" element={
        <PrivateRoute>
              <AdminLayout>
                  <ToDoPage />
              </AdminLayout>
        </PrivateRoute>
        } />

        
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
