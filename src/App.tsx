import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './components/Landing';
import { MapLayout } from './components/MapLayout';
import { Settings } from './components/Settings';
import { Profile } from './components/Profile';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
   return (
      <BrowserRouter>
         <Routes>
            <Route path="/" element={<Landing />} />
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
      </BrowserRouter>
   );
}

export default App;
