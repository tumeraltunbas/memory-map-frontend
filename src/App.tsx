import './App.css';
import './styles/cursor.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './components/Landing';
import { MapLayout } from './components/MapLayout';
import { Settings } from './components/Settings';
import { Profile } from './components/Profile';
import { Login } from './components/Auth/Login';
import { Register } from './components/Auth/Register';
import { ForgotPassword } from './components/Auth/ForgotPassword';
import { ResetPassword } from './components/Auth/ResetPassword';
import { ProtectedRoute } from './components/ProtectedRoute';
import { CursorProvider } from './contexts/CursorContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CustomCursor } from './components/Cursor/CustomCursor';

function App() {
   return (
      <BrowserRouter>
         <CursorProvider>
            <CustomCursor />
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
               <Route path="/forgot-password" element={<ForgotPassword />} />
               <Route path="/reset-password" element={<ResetPassword />} />

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

               <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
         </CursorProvider>
      </BrowserRouter>
   );
}

export default App;
