import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log('=== MAIN.TSX STARTING ===');
console.log('React version:', React.version);

const rootElement = document.getElementById('root');
console.log('Root element found:', !!rootElement);

if (!rootElement) {
  console.error('Root element not found!');
  document.body.innerHTML = '<div style="padding: 20px; color: red; font-size: 18px;">ERROR: Root element not found!</div>';
} else {
  console.log('Creating React root...');
  try {
    const root = ReactDOM.createRoot(rootElement);
    console.log('React root created successfully');
    
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('=== APP RENDERED SUCCESSFULLY ===');
  } catch (error) {
    console.error('Error creating React root:', error);
    rootElement.innerHTML = `<div style="padding: 20px; color: red; font-size: 18px;">Error: ${error}</div>`;
  }
}