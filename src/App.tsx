import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-600 mb-8 text-center">
          CHENDING - Trend Analysis Platform
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Welcome to CHENDING</h2>
          <p className="text-gray-600 mb-4">
            Discover trends before they're trending. This is a test page to ensure the application is working correctly.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-blue-800 mb-2">System Status</h3>
            <ul className="text-blue-700 space-y-1">
              <li>✅ React Application Loaded</li>
              <li>✅ Tailwind CSS Working</li>
              <li>✅ Basic Components Rendering</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Quick Test</h3>
          <button 
            onClick={() => alert('Button clicked! Application is working.')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Test Button
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;