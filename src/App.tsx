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

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#050505] text-[#F5F5F0] font-sans">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/staging" element={<StagingPage />} />
            <Route path="/estimate" element={<EstimatePage />} />
            <Route path="/renovation" element={<RenovationPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
