import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './components/Landing';
import { MapLayout } from './components/MapLayout';

function App() {
   return (
      <BrowserRouter>
         <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/map" element={<MapLayout />} />
            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
         </Routes>
      </BrowserRouter>
   );
}

export default App;
