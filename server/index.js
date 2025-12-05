/**
 * Advanced AI Copilot Server - Professional Grade
 * Offline-capable with local AI engine, unlimited code intelligence
 * and self-updating skill system
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const LocalAIEngine = require('./ai-engine/LocalAIEngine');
const PluginSystem = require('./ai-engine/PluginSystem');
const CodeIntelligence = require('./ai-engine/CodeIntelligence');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize advanced AI systems
const aiEngine = new LocalAIEngine();
const pluginSystem = new PluginSystem();
const codeIntelligence = new CodeIntelligence();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Initialize plugin system
(async () => {
  await pluginSystem.initialize();
  console.log('✅ Plugin system initialized');
})();

// ==================== API Routes ====================

// Health check with system stats
app.get('/api/health', (req, res) => {
  const stats = pluginSystem.getStatistics();
  res.json({
    status: 'ok',
    message: 'Advanced AI Copilot Server Running',
    mode: 'offline',
    features: {
      localAI: true,
      codeIntelligence: true,
      pluginSystem: true,
      selfLearning: aiEngine.learningEnabled,
      restrictions: 'none'
    },
    stats: {
      totalPlugins: stats.totalPlugins,
      totalSkills: stats.totalSkills,
      uptime: process.uptime()
    }
  });
});

// Advanced code completion with local AI
app.post('/api/complete', async (req, res) => {
  try {
    const { code, language, cursorPosition } = req.body;
    
    // Use local AI engine for completions
    const completions = await aiEngine.generateCompletion(code, cursorPosition, language);
    
    // Add contextual suggestions from code intelligence
    const contextual = codeIntelligence.generateContextualSuggestions(
      code,
      cursorPosition,
      language
    );
    
    res.json({
      success: true,
      mode: 'offline-ai',
      suggestions: [...completions, ...contextual].slice(0, 10),
      metadata: {
        language,
        contextAware: true,
        learned: true
      }
    });
  } catch (error) {
    console.error('Completion error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Advanced code analysis
app.post('/api/analyze', async (req, res) => {
  try {
    const { code, language } = req.body;
    
    // Deep code analysis
    const analysis = aiEngine.analyzeCode(code, language);
    
    // Detect code smells
    const smells = codeIntelligence.detectCodeSmells(code, language);
    
    // Build semantic index
    const semanticIndex = codeIntelligence.buildSemanticIndex(code, language);
    
    res.json({
      success: true,
      analysis: {
        ...analysis,
        codeSmells: smells,
        semanticIndex
      },
      recommendations: analysis.suggestions,
      quality: {
        complexity: analysis.complexity,
        maintainability: analysis.metrics.maintainabilityIndex,
        issues: analysis.issues.length
      }
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Chat assistance with context awareness
app.post('/api/chat', async (req, res) => {
  try {
    const { message, code, context } = req.body;
    
    // Analyze current code for context
    const codeAnalysis = code ? aiEngine.analyzeCode(code, context.language) : null;
    
    // Generate intelligent response based on context
    let response = '';
    
    if (message.toLowerCase().includes('explain')) {
      if (codeAnalysis) {
        response = `**Code Analysis:**\n\n`;
        response += `**Complexity:** ${codeAnalysis.complexity.level} (score: ${codeAnalysis.complexity.score})\n`;
        response += `**Maintainability:** ${codeAnalysis.metrics.maintainabilityIndex.rating}\n\n`;
        
        if (codeAnalysis.patterns.length > 0) {
          response += `**Patterns Detected:**\n`;
          codeAnalysis.patterns.forEach(p => {
            response += `- ${p.name}: ${p.suggestion}\n`;
          });
          response += '\n';
        }
        
        if (codeAnalysis.issues.length > 0) {
          response += `**Issues Found:**\n`;
          codeAnalysis.issues.slice(0, 5).forEach(i => {
            response += `- [${i.severity}] ${i.message}\n`;
          });
        }
      } else {
        response = 'Please provide code to analyze.';
      }
    } else if (message.toLowerCase().includes('optimize') || message.toLowerCase().includes('improve')) {
      const skills = pluginSystem.getRecommendedSkills(code, context.language);
      response = `**Optimization Suggestions:**\n\n`;
      skills.slice(0, 5).forEach(skill => {
        response += `✓ **${skill.name}**: ${skill.description}\n`;
        response += `  Success Rate: ${Math.round(skill.successRate * 100)}%\n\n`;
      });
    } else if (message.toLowerCase().includes('refactor')) {
      if (codeAnalysis && codeAnalysis.suggestions.length > 0) {
        response = `**Refactoring Suggestions:**\n\n`;
        codeAnalysis.suggestions.forEach((s, i) => {
          response += `${i + 1}. **${s.title}**\n`;
          response += `   ${s.description}\n`;
          if (s.example) response += `   Example: \`${s.example}\`\n`;
          response += `   Priority: ${s.priority}\n\n`;
        });
      } else {
        response = 'No specific refactoring suggestions at this time.';
      }
    } else {
      response = `I'm your advanced AI coding assistant. I can:\n\n`;
      response += `✓ Analyze code complexity and quality\n`;
      response += `✓ Detect patterns and code smells\n`;
      response += `✓ Suggest optimizations and refactorings\n`;
      response += `✓ Provide context-aware completions\n`;
      response += `✓ Learn from your coding patterns\n`;
      response += `✓ Work completely offline\n\n`;
      response += `Ask me to "explain", "optimize", or "refactor" your code!`;
    }
    
    res.json({
      success: true,
      response,
      timestamp: new Date().toISOString(),
      mode: 'offline-ai',
      contextAnalysis: codeAnalysis ? {
        complexity: codeAnalysis.complexity,
        issues: codeAnalysis.issues.length,
        patterns: codeAnalysis.patterns.length
      } : null
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Code explanation with deep analysis
app.post('/api/explain', async (req, res) => {
  try {
    const { code, language } = req.body;
    
    const analysis = aiEngine.analyzeCode(code, language);
    
    let explanation = `## Code Explanation\n\n`;
    explanation += `**Language:** ${language}\n`;
    explanation += `**Complexity:** ${analysis.complexity.level} (${analysis.complexity.score})\n`;
    explanation += `**Maintainability:** ${analysis.metrics.maintainabilityIndex.rating} (${analysis.metrics.maintainabilityIndex.score}/100)\n\n`;
    
    explanation += `### Structure\n`;
    explanation += `- Total Lines: ${analysis.metrics.totalLines}\n`;
    explanation += `- Code Lines: ${analysis.metrics.codeLines}\n`;
    explanation += `- Comment Ratio: ${Math.round(analysis.metrics.commentRatio * 100)}%\n\n`;
    
    if (analysis.dependencies.imports.length > 0) {
      explanation += `### Dependencies\n`;
      analysis.dependencies.imports.forEach(imp => {
        explanation += `- ${imp.source}\n`;
      });
      explanation += '\n';
    }
    
    if (analysis.patterns.length > 0) {
      explanation += `### Patterns Detected\n`;
      analysis.patterns.forEach(p => {
        explanation += `- **${p.name}** (${Math.round(p.confidence * 100)}% confidence)\n`;
        explanation += `  ${p.suggestion}\n`;
      });
      explanation += '\n';
    }
    
    if (analysis.issues.length > 0) {
      explanation += `### Issues & Recommendations\n`;
      analysis.issues.forEach(issue => {
        explanation += `- [${issue.severity.toUpperCase()}] ${issue.message}\n`;
        if (issue.suggestion) explanation += `  Suggestion: ${issue.suggestion}\n`;
      });
    }
    
    res.json({
      success: true,
      explanation,
      analysis,
      mode: 'offline-ai'
    });
  } catch (error) {
    console.error('Explanation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Advanced refactoring with skill application
app.post('/api/refactor', async (req, res) => {
  try {
    const { code, language, focus } = req.body;
    
    const analysis = aiEngine.analyzeCode(code, language);
    const recommendedSkills = pluginSystem.getRecommendedSkills(code, language);
    
    const suggestions = [];
    
    // Apply skills to generate refactoring suggestions
    for (const skill of recommendedSkills.slice(0, 5)) {
      const result = await pluginSystem.applySkill(skill.name, code);
      if (result.success) {
        suggestions.push({
          title: skill.name,
          description: skill.description,
          before: code.substring(0, 150) + '...',
          after: result.transformed ? result.transformed.substring(0, 150) + '...' : 'See full result',
          changes: result.changes || [],
          impact: skill.successRate > 0.8 ? 'high' : 'medium',
          successRate: Math.round(skill.successRate * 100)
        });
      }
    }
    
    // Add analysis-based suggestions
    analysis.suggestions.forEach(s => {
      suggestions.push({
        title: s.title,
        description: s.description,
        impact: s.priority,
        category: s.type,
        example: s.example
      });
    });
    
    res.json({
      success: true,
      suggestions,
      analysis: {
        complexity: analysis.complexity,
        maintainability: analysis.metrics.maintainabilityIndex,
        issues: analysis.issues.length
      },
      mode: 'offline-ai'
    });
  } catch (error) {
    console.error('Refactor error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Format code with Prettier
app.post('/api/format', async (req, res) => {
  try {
    const { code, language } = req.body;
    
    const formatted = await codeIntelligence.formatCode(code, language);
    
    res.json({
      success: true,
      formatted,
      mode: 'offline'
    });
  } catch (error) {
    console.error('Format error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Project analysis endpoint
app.post('/api/analyze-project', async (req, res) => {
  try {
    const { projectPath } = req.body;
    
    const analysis = await codeIntelligence.analyzeProject(projectPath);
    
    res.json({
      success: true,
      analysis,
      mode: 'offline-ai'
    });
  } catch (error) {
    console.error('Project analysis error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Skill management endpoints
app.get('/api/skills', (req, res) => {
  const skills = pluginSystem.getRecommendedSkills('', 'all');
  const stats = pluginSystem.getStatistics();
  
  res.json({
    success: true,
    skills,
    statistics: stats,
    mode: 'offline'
  });
});

app.post('/api/skills/register', async (req, res) => {
  try {
    const { skillName, skillData } = req.body;
    
    pluginSystem.registerSkill(skillName, skillData);
    aiEngine.updateSkill(skillName, skillData);
    
    res.json({
      success: true,
      message: `Skill '${skillName}' registered successfully`
    });
  } catch (error) {
    console.error('Skill registration error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/skills/export', async (req, res) => {
  try {
    const skills = await pluginSystem.exportSkills();
    const aiSkills = aiEngine.getSkills();
    
    res.json({
      success: true,
      skills: {
        plugin: skills,
        learned: aiSkills
      }
    });
  } catch (error) {
    console.error('Skill export error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Learning control endpoints
app.post('/api/learning/toggle', (req, res) => {
  aiEngine.learningEnabled = !aiEngine.learningEnabled;
  
  res.json({
    success: true,
    learningEnabled: aiEngine.learningEnabled
  });
});

app.get('/api/stats', (req, res) => {
  const pluginStats = pluginSystem.getStatistics();
  const aiSkills = aiEngine.getSkills();
  
  res.json({
    success: true,
    statistics: {
      plugins: pluginStats,
      learnedSkills: aiSkills.length,
      learningEnabled: aiEngine.learningEnabled,
      memorySize: aiEngine.contextMemory.length,
      uptime: process.uptime()
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 ========================================`);
  console.log(`   Advanced AI Copilot Server`);
  console.log(`   ========================================`);
  console.log(`   Status: ONLINE`);
  console.log(`   Mode: OFFLINE AI (No API required)`);
  console.log(`   Port: ${PORT}`);
  console.log(`   Restrictions: NONE`);
  console.log(`   Features:`);
  console.log(`   ✓ Local AI Engine`);
  console.log(`   ✓ Code Intelligence`);
  console.log(`   ✓ Plugin System`);
  console.log(`   ✓ Self-Learning`);
  console.log(`   ✓ Unlimited Skills`);
  console.log(`   ========================================\n`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`📊 Stats: http://localhost:${PORT}/api/stats\n`);
});

module.exports = app;
