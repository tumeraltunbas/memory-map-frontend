import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { store } from './stores/store.ts';
import { toast } from 'react-toastify';

createRoot(document.getElementById('root')!).render(
   <StrictMode>
      <Provider store={store}>
         <App />
      </Provider>
   </StrictMode>
);

const persistedToast = localStorage.getItem('post-login-toast');
if (persistedToast) {
   try {
      const { type, message } = JSON.parse(persistedToast);
      if (type === 'error' && message) {
         toast.error(message);
      }
   } catch {}
   localStorage.removeItem('post-login-toast');
}
