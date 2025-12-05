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
const CompleteGenSparkAI = require('./ai-engine/CompleteGenSparkAI');
// const OfflineGenSparkAI = require('./ai-engine/OfflineGenSparkAI'); // Temporarily disabled - missing gpu.js
const ChatGPT2_Unrestricted = require('./ai-engine/ChatGPT2_Unrestricted');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize advanced AI systems
const aiEngine = new LocalAIEngine();
const pluginSystem = new PluginSystem();
const codeIntelligence = new CodeIntelligence();
const gensparkAI = new CompleteGenSparkAI();
// const offlineAI = new OfflineGenSparkAI(); // Temporarily disabled
const chatGPT2 = new ChatGPT2_Unrestricted();

// Initialize COMPLETE GenSpark AI with ALL API keys
(async () => {
  await gensparkAI.initialize({
    googleApiKey: process.env.GOOGLE_API_KEY,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    replicateApiToken: process.env.REPLICATE_API_TOKEN,
    elevenLabsApiKey: process.env.ELEVENLABS_API_KEY,
    serpApiKey: process.env.SERP_API_KEY
  });
  console.log('✅ COMPLETE GenSpark AI Suite initialized');
  console.log('📦 All Features: Image Gen, Video Gen, Audio Gen, Web Search, Document AI');
})();

// Initialize OFFLINE GenSpark AI (100% Offline Mode)
// Temporarily disabled - missing gpu.js dependency
/*
(async () => {
  await offlineAI.initialize({
    devMode: process.env.DEV_MODE === 'true' || process.env.NODE_ENV === 'development'
  });
  console.log('✅ OFFLINE GenSpark AI Suite initialized');
  console.log('🔒 100% Offline - No Internet Required');
  console.log('🔧 Dev Mode:', offlineAI.devMode ? 'ENABLED' : 'DISABLED');
})();
*/

// Initialize ChatGPT 2.0 UNRESTRICTED
(async () => {
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  const Anthropic = require('@anthropic-ai/sdk');
  
  const aiProviders = {};
  if (process.env.GOOGLE_API_KEY) {
    aiProviders.gemini = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  }
  if (process.env.ANTHROPIC_API_KEY) {
    aiProviders.claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }

  await chatGPT2.initialize({
    githubToken: process.env.GITHUB_TOKEN,
    aiProviders
  });
  console.log('✅ ChatGPT 2.0 UNRESTRICTED initialized');
  console.log('🔓 ALL RESTRICTIONS REMOVED');
  console.log('💬 Chat, Browse Web, GitHub, Files, Code Execution');
})();

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
    message: 'GenSpark AI Copilot Pro - Complete Suite Running',
    mode: gensparkAI.mode,
    genspark_features: true,
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

// ==================== COMPLETE GENSPARK AI ENDPOINTS ====================

// 🎨 IMAGE GENERATION
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt, model, size, count } = req.body;
    const result = await gensparkAI.generateImage(prompt, { model, size, count });
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🔍 IMAGE ANALYSIS
app.post('/api/analyze-image', async (req, res) => {
  try {
    const { imageUrl, prompt } = req.body;
    const result = await gensparkAI.analyzeImage(imageUrl, prompt);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🎬 VIDEO GENERATION
app.post('/api/generate-video', async (req, res) => {
  try {
    const { prompt, duration, fps, width, height } = req.body;
    const result = await gensparkAI.generateVideo(prompt, { duration, fps, width, height });
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🎵 AUDIO GENERATION (TTS)
app.post('/api/generate-audio', async (req, res) => {
  try {
    const { text, voice, model } = req.body;
    const result = await gensparkAI.generateAudio(text, { voice, model });
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🎼 MUSIC GENERATION
app.post('/api/generate-music', async (req, res) => {
  try {
    const { prompt, duration, genre } = req.body;
    const result = await gensparkAI.generateMusic(prompt, { duration, genre });
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🔍 WEB SEARCH
app.post('/api/search', async (req, res) => {
  try {
    const { query, limit, type } = req.body;
    const result = await gensparkAI.searchWeb(query, { limit, type });
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🌐 WEB CRAWLING
app.post('/api/crawl', async (req, res) => {
  try {
    const { url, depth, extractCode, extractImages, extractLinks } = req.body;
    const result = await gensparkAI.crawlWebsite(url, { depth, extractCode, extractImages, extractLinks });
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 📄 DOCUMENT PROCESSING
app.post('/api/process-document', async (req, res) => {
  try {
    const { filePath, type } = req.body;
    const result = await gensparkAI.processDocument(filePath, type);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 💬 ADVANCED TEXT GENERATION
app.post('/api/generate-text', async (req, res) => {
  try {
    const { prompt, provider, temperature, maxTokens, systemPrompt } = req.body;
    const result = await gensparkAI.generateText(prompt, { provider, temperature, maxTokens, systemPrompt });
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 📊 GENSPARK AI STATS
app.get('/api/genspark-stats', async (req, res) => {
  try {
    const stats = await gensparkAI.getStats();
    res.json({
      success: true,
      ...stats,
      message: 'Complete GenSpark AI Suite - All Features Available'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== OFFLINE GENSPARK AI ENDPOINTS ====================

// 🎨 OFFLINE IMAGE GENERATION
app.post('/api/offline/generate-image', async (req, res) => {
  try {
    const { prompt, width, height, style, complexity } = req.body;
    const result = await offlineAI.generateImage(prompt, { width, height, style, complexity });
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🔍 OFFLINE IMAGE ANALYSIS
app.post('/api/offline/analyze-image', async (req, res) => {
  try {
    const { imageData, prompt } = req.body;
    const result = await offlineAI.analyzeImage(imageData, prompt);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🎬 OFFLINE VIDEO GENERATION
app.post('/api/offline/generate-video', async (req, res) => {
  try {
    const { prompt, duration, fps, width, height } = req.body;
    const result = await offlineAI.generateVideo(prompt, { duration, fps, width, height });
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🎵 OFFLINE AUDIO GENERATION
app.post('/api/offline/generate-audio', async (req, res) => {
  try {
    const { text, rate, pitch, volume } = req.body;
    const result = await offlineAI.generateAudio(text, { rate, pitch, volume });
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🎼 OFFLINE MUSIC GENERATION
app.post('/api/offline/generate-music', async (req, res) => {
  try {
    const { prompt, duration, genre, tempo } = req.body;
    const result = await offlineAI.generateMusic(prompt, { duration, genre, tempo });
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🔍 OFFLINE WEB SEARCH
app.post('/api/offline/search', async (req, res) => {
  try {
    const { query, limit } = req.body;
    const result = await offlineAI.searchWeb(query, { limit });
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 📄 OFFLINE DOCUMENT PROCESSING
app.post('/api/offline/process-document', async (req, res) => {
  try {
    const { content, type } = req.body;
    const result = await offlineAI.processDocument(content, type);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 💬 OFFLINE TEXT GENERATION
app.post('/api/offline/generate-text', async (req, res) => {
  try {
    const { prompt, maxLength, temperature } = req.body;
    const result = await offlineAI.generateText(prompt, { maxLength, temperature });
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 📊 OFFLINE AI STATS
app.get('/api/offline/stats', async (req, res) => {
  try {
    const stats = await offlineAI.getStats();
    res.json({
      success: true,
      ...stats
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== DEV MODE ENDPOINTS ====================

// 🔧 DEV MODE: Execute command
app.post('/api/dev/execute', async (req, res) => {
  try {
    const { command, params } = req.body;
    const result = await offlineAI.executeDevCommand(command, params);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🔧 DEV MODE: Inspect cache
app.get('/api/dev/cache', async (req, res) => {
  try {
    const result = await offlineAI.executeDevCommand('inspect-cache');
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🔧 DEV MODE: Performance analysis
app.get('/api/dev/performance', async (req, res) => {
  try {
    const result = await offlineAI.executeDevCommand('analyze-performance');
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🔧 DEV MODE: Generate report
app.get('/api/dev/report', async (req, res) => {
  try {
    const result = await offlineAI.executeDevCommand('generate-report');
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🔧 DEV MODE: Run benchmarks
app.post('/api/dev/benchmark', async (req, res) => {
  try {
    const { operation } = req.body;
    const result = await offlineAI.executeDevCommand('benchmark', { operation: operation || 'all' });
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🔧 DEV MODE: Memory usage
app.get('/api/dev/memory', async (req, res) => {
  try {
    const result = await offlineAI.executeDevCommand('memory-usage');
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🔧 DEV MODE: Test feature
app.post('/api/dev/test', async (req, res) => {
  try {
    const { feature } = req.body;
    const result = await offlineAI.executeDevCommand('test-feature', { feature });
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🔧 DEV MODE: Export knowledge base
app.get('/api/dev/knowledge', async (req, res) => {
  try {
    const result = await offlineAI.executeDevCommand('export-knowledge');
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== CHATGPT 2.0 UNRESTRICTED ENDPOINTS ====================

// 💬 CHAT COMPLETION (Unrestricted)
app.post('/api/chatgpt/chat', async (req, res) => {
  try {
    const { message, personality, contextLength, unrestricted } = req.body;
    const result = await chatGPT2.chat(message, { personality, contextLength, unrestricted });
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🌐 REAL-TIME WEB BROWSING (ChatGPT Can't Do This)
app.post('/api/chatgpt/browse', async (req, res) => {
  try {
    const { url } = req.body;
    const result = await chatGPT2.browseWeb(url);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🔍 REAL-TIME WEB SEARCH (ChatGPT Has Limited Access)
app.post('/api/chatgpt/search-realtime', async (req, res) => {
  try {
    const { query } = req.body;
    const result = await chatGPT2.searchWebRealtime(query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 📦 GITHUB: List Repositories (ChatGPT Can't Do This)
app.post('/api/chatgpt/github/repos', async (req, res) => {
  try {
    const { username } = req.body;
    const result = await chatGPT2.githubListRepos(username);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🐛 GITHUB: Create Issue (ChatGPT Can't Do This)
app.post('/api/chatgpt/github/issue', async (req, res) => {
  try {
    const { owner, repo, title, body } = req.body;
    const result = await chatGPT2.githubCreateIssue(owner, repo, title, body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🔀 GITHUB: Create Pull Request (ChatGPT Can't Do This)
app.post('/api/chatgpt/github/pr', async (req, res) => {
  try {
    const { owner, repo, title, head, base, body } = req.body;
    const result = await chatGPT2.githubCreatePR(owner, repo, title, head, base, body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 📂 FILE SYSTEM: Read File (ChatGPT Can't Do This)
app.post('/api/chatgpt/fs/read', async (req, res) => {
  try {
    const { path } = req.body;
    const result = await chatGPT2.readLocalFile(path);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✍️ FILE SYSTEM: Write File (ChatGPT Can't Do This)
app.post('/api/chatgpt/fs/write', async (req, res) => {
  try {
    const { path, content } = req.body;
    const result = await chatGPT2.writeLocalFile(path, content);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 📁 FILE SYSTEM: List Directory (ChatGPT Can't Do This)
app.post('/api/chatgpt/fs/list', async (req, res) => {
  try {
    const { path } = req.body;
    const result = await chatGPT2.listDirectory(path);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 💻 CODE EXECUTION (ChatGPT Has Limited Sandbox)
app.post('/api/chatgpt/execute', async (req, res) => {
  try {
    const { code, language } = req.body;
    const result = await chatGPT2.executeCode(code, language);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🧠 MEMORY: Save (ChatGPT Loses Memory)
app.post('/api/chatgpt/memory/save', async (req, res) => {
  try {
    const { key, value, category } = req.body;
    const result = await chatGPT2.saveToMemory(key, value, category);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🧠 MEMORY: Get (ChatGPT Loses Memory)
app.post('/api/chatgpt/memory/get', async (req, res) => {
  try {
    const { key } = req.body;
    const result = await chatGPT2.getFromMemory(key);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🧠 MEMORY: Get All (ChatGPT Loses Memory)
app.get('/api/chatgpt/memory/all', async (req, res) => {
  try {
    const { category } = req.query;
    const result = await chatGPT2.getAllMemories(category);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🎭 PERSONALITY: Set (ChatGPT Has One Mode)
app.post('/api/chatgpt/personality', async (req, res) => {
  try {
    const { personality } = req.body;
    const result = await chatGPT2.setPersonality(personality);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🗑️ CLEAR HISTORY
app.post('/api/chatgpt/clear', async (req, res) => {
  try {
    const result = await chatGPT2.clearHistory();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 📊 CHATGPT 2.0 STATS
app.get('/api/chatgpt/stats', async (req, res) => {
  try {
    const result = await chatGPT2.getStats();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
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

// Start server with Socket.io support
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Socket.io real-time streaming
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);

  socket.on('chat-stream', async (data) => {
    try {
      const { message, conversationHistory, mode } = data;
      
      // Simulate streaming response (in production, integrate with AI provider's streaming API)
      const response = await chatGPT2.chat({
        message,
        conversationHistory,
        mode,
        useMemory: true
      });

      // Stream response word by word
      const words = (response.response || response.message || '').split(' ');
      for (let i = 0; i < words.length; i++) {
        socket.emit('chat-token', { 
          token: words[i] + ' ',
          isComplete: i === words.length - 1
        });
        await new Promise(resolve => setTimeout(resolve, 50)); // Simulate streaming delay
      }
    } catch (error) {
      socket.emit('chat-error', { error: error.message });
    }
  });

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`\n🚀 ========================================`);
  console.log(`   Advanced AI Copilot Server`);
  console.log(`   ========================================`);
  console.log(`   Status: ONLINE`);
  console.log(`   Mode: ChatGPT 2.0 + GenSpark AI + Copilot`);
  console.log(`   Port: ${PORT}`);
  console.log(`   Restrictions: NONE`);
  console.log(`   Features:`);
  console.log(`   ✓ ChatGPT 2.0 UNRESTRICTED`);
  console.log(`   ✓ Local AI Engine`);
  console.log(`   ✓ Code Intelligence`);
  console.log(`   ✓ GenSpark AI Suite`);
  console.log(`   ✓ WebSocket Streaming`);
  console.log(`   ✓ Multi-modal AI`);
  console.log(`   ========================================\n`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`💬 ChatGPT 2.0: http://localhost:${PORT}`);
  console.log(`📊 Stats: http://localhost:${PORT}/api/stats\n`);
});

module.exports = { app, server, io };
