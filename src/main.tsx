import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log('Starting React application...');

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('Root element not found!');
  document.body.innerHTML = '<div style="padding: 20px; font-family: Arial;"><h1>Error: Root element not found</h1><p>The application could not start because the root element is missing.</p></div>';
} else {
  console.log('Root element found, creating React app...');
  
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
    console.log('React app rendered successfully!');
  } catch (error) {
    console.error('Error rendering React app:', error);
    rootElement.innerHTML = '<div style="padding: 20px; font-family: Arial;"><h1>Error: Failed to render React app</h1><p>Check the console for more details.</p></div>';
  }
}