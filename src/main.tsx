import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './assets/fonts.css';
import { LanguageProvider } from './contexts/LanguageContext';
import { IntlWrapper } from './components/IntlWrapper';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <IntlWrapper>
        <App />
      </IntlWrapper>
    </LanguageProvider>
  </StrictMode>
);
