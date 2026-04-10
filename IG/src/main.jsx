import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { AppStateProvider } from './hooks/useAppState';
import { ToastProvider } from './components/Toast';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppStateProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </AppStateProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
