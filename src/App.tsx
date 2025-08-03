import './App.css';
import './styles/cursor.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './components/Landing';
import { MapLayout } from './components/MapLayout';
import { Settings } from './components/Settings';
import { Profile } from './components/Profile';
import { Login } from './components/Auth/Login';
import { Register } from './components/Auth/Register';
import { ProtectedRoute } from './components/ProtectedRoute';
import { CursorProvider } from './contexts/CursorContext';

function App() {
   return (
      <BrowserRouter>
         <CursorProvider>
            <Routes>
               <Route path="/" element={<Landing />} />
               <Route path="/login" element={<Login />} />
               <Route path="/register" element={<Register />} />

               {/* Protected Routes */}
               <Route
                  path="/map"
                  element={
                     <ProtectedRoute>
                        <MapLayout />
                     </ProtectedRoute>
                  }
               />
               <Route
                  path="/settings"
                  element={
                     <ProtectedRoute>
                        <Settings />
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

               {/* Redirect any unknown routes to home */}
               <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
         </CursorProvider>
      </BrowserRouter>
   );
}

export default App;
