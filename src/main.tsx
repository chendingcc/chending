import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log('main.tsx is executing');

const rootElement = document.getElementById('root');
console.log('Root element:', rootElement);

if (!rootElement) {
  console.error('Root element not found!');
  document.body.innerHTML = '<div style="padding: 20px; font-family: Arial;">Error: Root element not found</div>';
} else {
  try {
    console.log('Creating React root...');
    const root = ReactDOM.createRoot(rootElement);
    console.log('Rendering App...');
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('App rendered successfully');
  } catch (error) {
    console.error('Error rendering app:', error);
    rootElement.innerHTML = `<div style="padding: 20px; font-family: Arial; color: red;">Error: ${error.message}</div>`;
  }
}