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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
   return (
      <BrowserRouter>
         <CursorProvider>
            <ToastContainer
               position="bottom-right"
               autoClose={3500}
               hideProgressBar={false}
               newestOnTop
               closeOnClick
               pauseOnFocusLoss
               draggable
               pauseOnHover
               theme="light"
            />
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
