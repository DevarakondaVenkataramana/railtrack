import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SearchResults from './pages/SearchResults';
import TrainDetails from './pages/TrainDetails';
import MyJourneys from './pages/MyJourneys';
import JourneyDetails from './pages/JourneyDetails';
import Profile from './pages/Profile';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import ManageTrains from './pages/ManageTrains';
import AddTrain from './pages/AddTrain';
import EditTrain from './pages/EditTrain';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/trains/:id" element={<TrainDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected User Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-journeys"
                element={
                  <ProtectedRoute>
                    <MyJourneys />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/journeys/:id"
                element={
                  <ProtectedRoute>
                    <JourneyDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Admin-only Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/trains"
                element={
                  <AdminRoute>
                    <ManageTrains />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/trains/add"
                element={
                  <AdminRoute>
                    <AddTrain />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/trains/edit/:id"
                element={
                  <AdminRoute>
                    <EditTrain />
                  </AdminRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
