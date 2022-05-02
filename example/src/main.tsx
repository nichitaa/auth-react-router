/**
 * @author Pasecinic Nichita
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

const root = document.getElementById('root');

const app = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

createRoot(root!).render(app);
