import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Routes
import { AdminRoute } from './routes/AdminRoute';
import { MemberRoute } from './routes/MemberRoute';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import MemberLayout from './layouts/MemberLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import Projects from './pages/admin/Projects';
import Tasks from './pages/admin/Tasks';
import Team from './pages/admin/Team';
import Profile from './pages/admin/Profile';
import Settings from './pages/admin/Settings';

// Member Pages
import MemberDashboard from './pages/member/Dashboard';
import MyTasks from './pages/member/MyTasks';
import ProjectDetails from './pages/member/ProjectDetails';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--surface-color)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-color)',
              },
              success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
              error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
            }} 
          />
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="projects" element={<Projects />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="team" element={<Team />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
            </Route>

          {/* Member Routes */}
          <Route 
            path="/member" 
            element={
              <MemberRoute>
                <MemberLayout />
              </MemberRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<MemberDashboard />} />
            <Route path="tasks" element={<MyTasks />} />
            <Route path="projects/:id" element={<ProjectDetails />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Catch All */}
          <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
