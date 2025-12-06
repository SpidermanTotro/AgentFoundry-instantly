import React, { useState, useEffect } from 'react';
import './SkillsPanel.css';

function SkillsPanel({ onClose, systemStats }) {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('all');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/skills');
      const data = await response.json();
      if (data.success) {
        setSkills(data.skills);
      }
    } catch (error) {
      console.error('Failed to fetch skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportSkills = async () => {
    try {
      const response = await fetch('/api/skills/export');
      const data = await response.json();
      if (data.success) {
        const blob = new Blob([JSON.stringify(data.skills, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'copilot-skills.json';
        a.click();
      }
    } catch (error) {
      console.error('Failed to export skills:', error);
    }
  };

  const getSkillColor = (successRate) => {
    if (successRate >= 0.8) return '#4ade80';
    if (successRate >= 0.6) return '#fbbf24';
    return '#f87171';
  };

  const filteredSkills = skills.filter(skill => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'popular') return skill.usageCount > 5;
    if (selectedTab === 'effective') return skill.successRate >= 0.8;
    return true;
  });

  return (
    <div className="skills-panel">
      <div className="skills-header">
        <h3>📚 Skills & Capabilities</h3>
        <div className="skills-actions">
          <button onClick={exportSkills} className="export-btn">
            💾 Export
          </button>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>
      </div>

      <div className="skills-tabs">
        <button 
          className={`tab ${selectedTab === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedTab('all')}
        >
          All Skills
        </button>
        <button 
          className={`tab ${selectedTab === 'popular' ? 'active' : ''}`}
          onClick={() => setSelectedTab('popular')}
        >
          Most Used
        </button>
        <button 
          className={`tab ${selectedTab === 'effective' ? 'active' : ''}`}
          onClick={() => setSelectedTab('effective')}
        >
          Most Effective
        </button>
      </div>

      <div className="system-stats">
        {systemStats && (
          <>
            <div className="stat-card">
              <div className="stat-label">Total Skills</div>
              <div className="stat-value">{systemStats.plugins?.totalSkills || 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Plugins</div>
              <div className="stat-value">{systemStats.plugins?.totalPlugins || 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Learned</div>
              <div className="stat-value">{systemStats.learnedSkills || 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Learning</div>
              <div className="stat-value">
                {systemStats.learningEnabled ? '✓' : '✗'}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="skills-list">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading skills...</p>
          </div>
        ) : filteredSkills.length === 0 ? (
          <div className="empty-state">
            <p>No skills found</p>
          </div>
        ) : (
          filteredSkills.map((skill, index) => (
            <div key={index} className="skill-card">
              <div className="skill-header">
                <h4>{skill.name}</h4>
                <div className="skill-badges">
                  <span className="badge language">{skill.language || 'all'}</span>
                  {skill.usageCount > 0 && (
                    <span className="badge usage">{skill.usageCount} uses</span>
                  )}
                </div>
              </div>
              
              <p className="skill-description">{skill.description}</p>
              
              <div className="skill-metrics">
                <div className="metric">
                  <span className="metric-label">Success Rate</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${(skill.successRate || 0.5) * 100}%`,
                        backgroundColor: getSkillColor(skill.successRate || 0.5)
                      }}
                    ></div>
                  </div>
                  <span 
                    className="metric-value"
                    style={{ color: getSkillColor(skill.successRate || 0.5) }}
                  >
                    {Math.round((skill.successRate || 0.5) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SkillsPanel;
