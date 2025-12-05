import React, { useState } from 'react';
import ChatGPT2 from './components/ChatGPT2';
import CodeEditor from './components/CodeEditor';
import './App.css';

function App() {
  const [mode, setMode] = useState('chat'); // 'chat' or 'code'

  return (
    <div className="app-container">
      {/* Mode Switcher */}
      <div className="mode-switcher">
        <button 
          className={`mode-btn ${mode === 'chat' ? 'active' : ''}`}
          onClick={() => setMode('chat')}
        >
          💬 ChatGPT Mode
        </button>
        <button 
          className={`mode-btn ${mode === 'code' ? 'active' : ''}`}
          onClick={() => setMode('code')}
        >
          💻 Code Editor Mode
        </button>
      </div>

      {/* Render appropriate component */}
      {mode === 'chat' ? <ChatGPT2 /> : <CodeEditor />}
    </div>
  );
}

export default App;
