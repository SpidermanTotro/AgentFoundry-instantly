import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import CodeAssistant from './components/CodeAssistant';
import ChatPanel from './components/ChatPanel';
import StatusBar from './components/StatusBar';
import SkillsPanel from './components/SkillsPanel';
import ChatGPT2 from './components/ChatGPT2';
import './App.css';

function App() {
  const [viewMode, setViewMode] = useState('chat'); // 'chat' or 'code'
  const [code, setCode] = useState(`// Advanced AI Copilot - Offline & Unrestricted
// Professional code intelligence with self-learning capabilities

/**
 * Welcome to Advanced AI Copilot!
 * 
 * Features:
 * ✓ Offline AI - No API keys required
 * ✓ Advanced code analysis with AST parsing
 * ✓ Real-time complexity and quality metrics
 * ✓ Self-learning skill system
 * ✓ Unlimited code intelligence
 * ✓ Multi-language support with deep understanding
 * 
 * Start typing to experience intelligent suggestions...
 */

async function fetchUserData(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
}

// Try asking the AI:
// - "Analyze this code"
// - "Optimize performance"
// - "Refactor for better quality"
// - "Explain complexity"
`);
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('vs-dark');
  const [showChat, setShowChat] = useState(false);
  const [showSkills, setShowSkills] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [systemStats, setSystemStats] = useState(null);
  const [autoAnalyze, setAutoAnalyze] = useState(false);
  const editorRef = useRef(null);

  const languages = [
    'javascript', 'typescript', 'python', 'java', 'cpp', 
    'csharp', 'go', 'rust', 'php', 'ruby', 'html', 'css', 'json'
  ];

  useEffect(() => {
    // Fetch system stats on mount
    fetchSystemStats();
    
    // Auto-analyze on code change if enabled
    if (autoAnalyze && code) {
      const timer = setTimeout(() => {
        analyzeCode();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [code, autoAnalyze]);

  const fetchSystemStats = async () => {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      if (data.success) {
        setSystemStats(data.statistics);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Configure advanced editor options
    editor.updateOptions({
      suggestOnTriggerCharacters: true,
      quickSuggestions: {
        other: true,
        comments: true,
        strings: true
      },
      parameterHints: {
        enabled: true
      },
      formatOnPaste: true,
      formatOnType: true
    });
  };

  const getSuggestion = async () => {
    setIsLoading(true);
    try {
      const cursorPosition = editorRef.current?.getPosition();
      const offset = editorRef.current?.getModel()?.getOffsetAt(cursorPosition) || code.length;
      
      const response = await fetch('/api/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code, 
          language, 
          cursorPosition: offset 
        })
      });
      const data = await response.json();
      if (data.success) {
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error('Error getting suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeCode = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language })
      });
      const data = await response.json();
      if (data.success) {
        setAnalysis(data.analysis);
        console.log('Analysis complete:', data);
      }
    } catch (error) {
      console.error('Error analyzing code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const explainCode = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language })
      });
      const data = await response.json();
      if (data.success) {
        // Show explanation in a modal or panel
        alert(data.explanation);
      }
    } catch (error) {
      console.error('Error explaining code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRefactoringSuggestions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/refactor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language })
      });
      const data = await response.json();
      if (data.success) {
        console.log('Refactoring suggestions:', data.suggestions);
        setSuggestions(data.suggestions.map(s => ({
          text: s.title,
          score: s.successRate || 85,
          type: 'refactor',
          description: s.description
        })));
      }
    } catch (error) {
      console.error('Error getting refactoring suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCode = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/format', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language })
      });
      const data = await response.json();
      if (data.success && data.formatted) {
        setCode(data.formatted);
      }
    } catch (error) {
      console.error('Error formatting code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getComplexityColor = () => {
    if (!analysis?.complexity) return '#4ade80';
    const level = analysis.complexity.level;
    return level === 'low' ? '#4ade80' : level === 'medium' ? '#fbbf24' : '#f87171';
  };

  const getMaintainabilityColor = () => {
    if (!analysis?.metrics?.maintainabilityIndex) return '#4ade80';
    const score = analysis.metrics.maintainabilityIndex.score;
    return score > 85 ? '#4ade80' : score > 65 ? '#fbbf24' : score > 35 ? '#fb923c' : '#f87171';
  };

  // If in ChatGPT mode, render ChatGPT2 component
  if (viewMode === 'chat') {
    return <ChatGPT2 onSwitchToCode={() => setViewMode('code')} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <div className="logo-container">
            <svg className="logo-icon" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div>
              <h1>Copilot Pro</h1>
              <span className="subtitle">Advanced AI • Offline • Unrestricted</span>
            </div>
          </div>
        </div>
        
        <div className="header-center">
          {analysis && (
            <div className="metrics-display">
              <div className="metric">
                <span className="metric-label">Complexity</span>
                <span className="metric-value" style={{ color: getComplexityColor() }}>
                  {analysis.complexity.score} ({analysis.complexity.level})
                </span>
              </div>
              <div className="metric">
                <span className="metric-label">Quality</span>
                <span className="metric-value" style={{ color: getMaintainabilityColor() }}>
                  {analysis.metrics?.maintainabilityIndex?.score || 'N/A'}
                </span>
              </div>
              <div className="metric">
                <span className="metric-label">Issues</span>
                <span className="metric-value" style={{ color: analysis.issues.length > 0 ? '#f87171' : '#4ade80' }}>
                  {analysis.issues.length}
                </span>
              </div>
            </div>
          )}
        </div>
        
        <div className="header-controls">
          <button 
            onClick={() => setViewMode('chat')}
            className="icon-btn"
            title="Switch to ChatGPT Mode"
            style={{ background: '#10a37f', color: 'white', padding: '8px 16px', borderRadius: '8px', fontWeight: '600' }}
          >
            💬 ChatGPT Mode
          </button>
          
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="language-select"
          >
            {languages.map(lang => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>
          
          <button 
            onClick={() => setAutoAnalyze(!autoAnalyze)}
            className={`icon-btn ${autoAnalyze ? 'active' : ''}`}
            title="Auto-analyze"
          >
            ⚡
          </button>
          
          <button 
            onClick={() => setTheme(theme === 'vs-dark' ? 'light' : 'vs-dark')}
            className="icon-btn"
            title="Toggle theme"
          >
            {theme === 'vs-dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <div className="main-content">
        <div className="editor-section">
          <div className="toolbar">
            <div className="toolbar-left">
              <button 
                onClick={analyzeCode} 
                disabled={isLoading}
                className="toolbar-btn primary"
              >
                <span className="btn-icon">🔍</span>
                Analyze
              </button>
              <button 
                onClick={getSuggestion} 
                disabled={isLoading}
                className="toolbar-btn"
              >
                <span className="btn-icon">✨</span>
                Suggest
              </button>
              <button 
                onClick={explainCode} 
                disabled={isLoading}
                className="toolbar-btn"
              >
                <span className="btn-icon">📖</span>
                Explain
              </button>
              <button 
                onClick={getRefactoringSuggestions} 
                disabled={isLoading}
                className="toolbar-btn"
              >
                <span className="btn-icon">🔧</span>
                Refactor
              </button>
              <button 
                onClick={formatCode} 
                disabled={isLoading}
                className="toolbar-btn"
              >
                <span className="btn-icon">💅</span>
                Format
              </button>
            </div>
            
            <div className="toolbar-right">
              <button 
                onClick={() => setShowSkills(!showSkills)}
                className={`toolbar-btn ${showSkills ? 'active' : ''}`}
              >
                <span className="btn-icon">📚</span>
                Skills
              </button>
              <button 
                onClick={() => setShowChat(!showChat)}
                className={`toolbar-btn ${showChat ? 'active' : ''}`}
              >
                <span className="btn-icon">💬</span>
                Chat
              </button>
            </div>
          </div>

          <div className="editor-container">
            <Editor
              height="calc(100vh - 220px)"
              language={language}
              value={code}
              theme={theme}
              onChange={handleEditorChange}
              onMount={handleEditorMount}
              options={{
                minimap: { enabled: true },
                fontSize: 14,
                fontFamily: "'Cascadia Code', 'Fira Code', 'Monaco', monospace",
                fontLigatures: true,
                lineNumbers: 'on',
                roundedSelection: true,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                suggestOnTriggerCharacters: true,
                quickSuggestions: true,
                folding: true,
                foldingStrategy: 'indentation',
                renderLineHighlight: 'all',
                bracketPairColorization: { enabled: true },
                guides: {
                  bracketPairs: true,
                  indentation: true
                }
              }}
            />
          </div>

          {suggestions.length > 0 && (
            <CodeAssistant 
              suggestions={suggestions} 
              onClose={() => setSuggestions([])}
              onApply={(suggestion) => {
                // Apply suggestion to code
                console.log('Applying:', suggestion);
              }}
            />
          )}
        </div>

        {showSkills && (
          <SkillsPanel 
            onClose={() => setShowSkills(false)}
            systemStats={systemStats}
          />
        )}

        {showChat && (
          <ChatPanel 
            code={code} 
            language={language} 
            onClose={() => setShowChat(false)}
            analysis={analysis}
          />
        )}
      </div>

      <StatusBar 
        language={language}
        isLoading={isLoading}
        systemStats={systemStats}
        analysis={analysis}
      />

      {isLoading && (
        <div className="loading-indicator">
          <div className="spinner-border"></div>
          <span>Processing with AI...</span>
        </div>
      )}
    </div>
  );
}

export default App;
