import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './Layouts/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import UpgradePage from './pages/Upgrade';
import LeadersPage from './pages/LeadersPage';
import AboutPage from './pages/AboutPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/Profile';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PaymentPage from './pages/PaymentPage';
import CasePage from './pages/CasePage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="upgrade" element={<UpgradePage />} />
          <Route path="leaders" element={<LeadersPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="case/:id" element={<CasePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />

          <Route path="cabinet" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="deposit" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
          <Route path="admin" element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;