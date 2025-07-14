import React from 'react';

function App() {
  console.log('App component is rendering');
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
          CHENDING - Trend Analysis Platform
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-lg text-gray-700 text-center">
            Application is loading successfully!
          </p>
          <div className="mt-4 text-center">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Test Button
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;