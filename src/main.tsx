import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log('🚀 CHENDING Main.tsx starting...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('❌ Root element not found!');
  document.body.innerHTML = '<div style="padding: 20px; color: red; font-size: 18px;">ERROR: Root element not found!</div>';
} else {
  console.log('✅ Root element found, creating React root...');
  const root = ReactDOM.createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  console.log('✅ CHENDING App rendered successfully!');
}