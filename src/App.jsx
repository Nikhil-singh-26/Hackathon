import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import MarketplacePreview from './components/MarketplacePreview';
import Achievements from './components/Achievements';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';

import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

import VendorProfilePage from './pages/VendorProfilePage';

import DashboardLayout from './pages/dashboard/DashboardLayout';
import OverviewPage from './pages/dashboard/OverviewPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import EventsPage from './pages/dashboard/EventsPage';
import AnalyticsPage from './pages/dashboard/AnalyticsPage';
import VendorDashboard from './pages/dashboard/VendorDashboard';
import OrganizerDashboard from './pages/dashboard/OrganizerDashboard';
import ChatsPage from './pages/dashboard/ChatsPage'; // Added this
import ChatPage from './pages/ChatPage';

import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuth } from './hooks/useAuth'; // Assuming useAuth hook is available

import './App.css';

function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <MarketplacePreview />
        <Achievements />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Routes>
      {/* Public landing page */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/vendor/:id" element={<><Navbar /><VendorProfilePage /><Footer /></>} />

      {/* Auth pages */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/signup" element={<SignupPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

      {/* Protected dashboard with nested routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<OverviewPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="chat" element={<ChatsPage />} /> 
        <Route path="chat/:chatId" element={<ChatPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
