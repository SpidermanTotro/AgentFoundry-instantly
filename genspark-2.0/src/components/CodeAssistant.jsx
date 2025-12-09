import React from 'react';
import './CodeAssistant.css';

function CodeAssistant({ suggestions, onClose, onApply }) {
  return (
    <div className="code-assistant">
      <div className="assistant-header">
        <div className="header-title">
          <span className="header-icon">✨</span>
          <h3>AI Suggestions</h3>
          <span className="suggestion-count">{suggestions.length}</span>
        </div>
        <button onClick={onClose} className="close-btn">✕</button>
      </div>
      <div className="suggestions-list">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="suggestion-item">
            <div className="suggestion-header">
              <div className="suggestion-meta">
                <span className="suggestion-type">{suggestion.type || suggestion.kind || 'suggestion'}</span>
                {suggestion.score && (
                  <span className="suggestion-score">
                    {Math.round((suggestion.score > 1 ? suggestion.score : suggestion.score * 100))}% confidence
                  </span>
                )}
              </div>
              {suggestion.label && (
                <span className="suggestion-label">{suggestion.label}</span>
              )}
            </div>
            
            {suggestion.description && (
              <p className="suggestion-description">{suggestion.description}</p>
            )}
            
            {suggestion.text && (
              <pre className="suggestion-code">{suggestion.text}</pre>
            )}
            
            {suggestion.documentation && (
              <div className="suggestion-docs">{suggestion.documentation}</div>
            )}
            
            <button 
              className="apply-btn"
              onClick={() => onApply && onApply(suggestion)}
            >
              <span className="btn-icon">✓</span>
              Apply Suggestion
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CodeAssistant;
