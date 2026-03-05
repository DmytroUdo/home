/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import StagingPage from './pages/StagingPage';
import EstimatePage from './pages/EstimatePage';
import RenovationPage from './pages/RenovationPage';
import DashboardPage from './pages/DashboardPage';
import ContractsPage from './pages/ContractsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AdminPage from './pages/AdminPage';
import SubscriptionPage from './pages/SubscriptionPage';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen font-sans dark:bg-[#050505] dark:text-[#F5F5F0] bg-gray-50 text-gray-900 transition-colors duration-300">
            <Header />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/staging" element={<StagingPage />} />
                <Route path="/estimate" element={<EstimatePage />} />
                <Route path="/renovation" element={<RenovationPage />} />
                <Route path="/contracts" element={<ContractsPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/subscription" element={<SubscriptionPage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
