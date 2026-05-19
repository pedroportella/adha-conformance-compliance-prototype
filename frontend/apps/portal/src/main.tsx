import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app/App';
import '@health.gov.au/health-design-system/build/css/hds-all.css';
import '@adha/ui-library/theme.css';
import './styles/main.scss';

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
