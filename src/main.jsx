import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.jsx';
import ErrorBoundary from './components/UI/ErrorBoundary';
import './index.css';
import LanguageProvider from './i18n/LanguageProvider';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>
);
