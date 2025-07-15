import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log('🚀 Main.tsx 开始执行...');
console.log('📍 当前环境:', import.meta.env.MODE);
console.log('📍 Base URL:', import.meta.env.BASE_URL);

// 检查根元素
const rootElement = document.getElementById('root');
console.log('📍 Root元素:', rootElement);

if (!rootElement) {
  console.error('❌ 找不到root元素!');
  document.body.innerHTML = `
    <div style="padding: 20px; color: red; font-size: 18px; font-family: Arial;">
      <h1>❌ 错误: 找不到root元素</h1>
      <p>请检查index.html中是否存在id="root"的div元素</p>
    </div>
  `;
} else {
  console.log('✅ Root元素找到，开始渲染React应用...');
  
  try {
    const root = ReactDOM.createRoot(rootElement);
    
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    console.log('✅ React应用渲染成功!');
  } catch (error) {
    console.error('❌ React渲染失败:', error);
    document.body.innerHTML = `
      <div style="padding: 20px; color: red; font-size: 16px; font-family: Arial;">
        <h1>❌ React渲染错误</h1>
        <pre>${error}</pre>
      </div>
    `;
  }
}