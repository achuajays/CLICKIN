import React from 'react';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm pl-16">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">CLICKIN</h1>
        </div>
      </header>
      
      <main className="pl-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="relative min-h-[600px]">
            <Canvas />
            <Toolbar />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;