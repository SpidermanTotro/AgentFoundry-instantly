import React from 'react';
import './StatusBar.css';

function StatusBar({ language, isLoading, systemStats, analysis }) {
  return (
    <div className="status-bar">
      <div className="status-left">
        <div className="status-item">
          <span className="status-icon">🟢</span>
          <span className="status-text">Offline AI</span>
        </div>
        
        <div className="status-item">
          <span className="status-icon">📝</span>
          <span className="status-text">{language.toUpperCase()}</span>
        </div>
        
        {analysis && (
          <>
            <div className="status-item">
              <span className="status-icon">📊</span>
              <span className="status-text">
                Lines: {analysis.metrics?.totalLines || 0}
              </span>
            </div>
            
            <div className="status-item">
              <span className="status-icon">🎯</span>
              <span className="status-text">
                Complexity: {analysis.complexity?.score || 0}
              </span>
            </div>
          </>
        )}
      </div>
      
      <div className="status-right">
        {isLoading && (
          <div className="status-item loading">
            <div className="status-spinner"></div>
            <span className="status-text">Analyzing...</span>
          </div>
        )}
        
        {systemStats && (
          <>
            <div className="status-item">
              <span className="status-icon">🔌</span>
              <span className="status-text">
                {systemStats.plugins?.totalPlugins || 0} plugins
              </span>
            </div>
            
            <div className="status-item">
              <span className="status-icon">🎓</span>
              <span className="status-text">
                {systemStats.learnedSkills || 0} skills
              </span>
            </div>
            
            <div className="status-item">
              <span className="status-icon">⚡</span>
              <span className="status-text">
                {systemStats.learningEnabled ? 'Learning ON' : 'Learning OFF'}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default StatusBar;
