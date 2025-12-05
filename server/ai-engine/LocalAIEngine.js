/**
 * Advanced Local AI Engine for Offline Code Intelligence
 * Provides sophisticated code analysis, pattern recognition, and intelligent suggestions
 * without requiring external API calls
 */

const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const NodeCache = require('node-cache');
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

class LocalAIEngine {
  constructor() {
    this.cache = new NodeCache({ stdTTL: 3600 }); // 1 hour cache
    this.initializeDatabase();
    this.loadPatterns();
    this.skillDatabase = new Map();
    this.contextMemory = [];
    this.learningEnabled = true;
  }

  initializeDatabase() {
    const dbPath = path.join(__dirname, 'code_intelligence.db');
    this.db = new Database(dbPath);
    
    // Create tables for code patterns and learning
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS code_patterns (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        language TEXT NOT NULL,
        pattern TEXT NOT NULL,
        category TEXT NOT NULL,
        confidence REAL DEFAULT 0.8,
        usage_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS code_completions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        context TEXT NOT NULL,
        suggestion TEXT NOT NULL,
        language TEXT NOT NULL,
        accepted INTEGER DEFAULT 0,
        rejected INTEGER DEFAULT 0,
        score REAL DEFAULT 0.5
      );

      CREATE TABLE IF NOT EXISTS learned_skills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        skill_name TEXT UNIQUE NOT NULL,
        skill_data TEXT NOT NULL,
        version INTEGER DEFAULT 1,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS code_context (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        file_path TEXT,
        code_snippet TEXT,
        analysis TEXT,
        dependencies TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    this.insertDefaultPatterns();
  }

  insertDefaultPatterns() {
    const defaultPatterns = [
      // JavaScript/TypeScript patterns
      { language: 'javascript', pattern: 'async/await', category: 'async', confidence: 0.95 },
      { language: 'javascript', pattern: 'promise-chain', category: 'async', confidence: 0.85 },
      { language: 'javascript', pattern: 'error-handling', category: 'best-practice', confidence: 0.9 },
      { language: 'javascript', pattern: 'arrow-function', category: 'syntax', confidence: 0.95 },
      { language: 'javascript', pattern: 'destructuring', category: 'syntax', confidence: 0.9 },
      { language: 'javascript', pattern: 'spread-operator', category: 'syntax', confidence: 0.9 },
      
      // Python patterns
      { language: 'python', pattern: 'list-comprehension', category: 'syntax', confidence: 0.95 },
      { language: 'python', pattern: 'context-manager', category: 'best-practice', confidence: 0.9 },
      { language: 'python', pattern: 'decorator', category: 'advanced', confidence: 0.85 },
      { language: 'python', pattern: 'generator', category: 'advanced', confidence: 0.85 },
      
      // General patterns
      { language: 'all', pattern: 'null-check', category: 'safety', confidence: 0.95 },
      { language: 'all', pattern: 'type-validation', category: 'safety', confidence: 0.9 },
      { language: 'all', pattern: 'optimization', category: 'performance', confidence: 0.85 },
    ];

    const stmt = this.db.prepare(`
      INSERT OR IGNORE INTO code_patterns (language, pattern, category, confidence)
      VALUES (?, ?, ?, ?)
    `);

    for (const pattern of defaultPatterns) {
      stmt.run(pattern.language, pattern.pattern, pattern.category, pattern.confidence);
    }
  }

  loadPatterns() {
    this.patterns = {
      javascript: this.getJavaScriptPatterns(),
      typescript: this.getTypeScriptPatterns(),
      python: this.getPythonPatterns(),
      java: this.getJavaPatterns(),
      go: this.getGoPatterns(),
      rust: this.getRustPatterns(),
      common: this.getCommonPatterns()
    };
  }

  /**
   * Advanced Code Analysis using AST
   */
  analyzeCode(code, language) {
    const cacheKey = `analysis_${language}_${this.hashCode(code)}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const analysis = {
      complexity: this.calculateComplexity(code, language),
      patterns: this.detectPatterns(code, language),
      issues: this.detectIssues(code, language),
      suggestions: this.generateSuggestions(code, language),
      dependencies: this.extractDependencies(code, language),
      metrics: this.calculateMetrics(code, language)
    };

    this.cache.set(cacheKey, analysis);
    
    // Learn from this code
    if (this.learningEnabled) {
      this.learnFromCode(code, language, analysis);
    }

    return analysis;
  }

  /**
   * Parse JavaScript/TypeScript code and extract structure
   */
  parseJavaScript(code) {
    try {
      return parse(code, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript', 'decorators-legacy', 'classProperties']
      });
    } catch (error) {
      console.error('Parse error:', error.message);
      return null;
    }
  }

  /**
   * Calculate code complexity (Cyclomatic Complexity)
   */
  calculateComplexity(code, language) {
    if (language === 'javascript' || language === 'typescript') {
      const ast = this.parseJavaScript(code);
      if (!ast) return { score: 0, level: 'unknown' };

      let complexity = 1;
      traverse(ast, {
        IfStatement: () => complexity++,
        WhileStatement: () => complexity++,
        ForStatement: () => complexity++,
        SwitchCase: () => complexity++,
        ConditionalExpression: () => complexity++,
        LogicalExpression: () => complexity++,
        CatchClause: () => complexity++
      });

      return {
        score: complexity,
        level: complexity <= 5 ? 'low' : complexity <= 10 ? 'medium' : 'high',
        recommendation: complexity > 10 ? 'Consider refactoring into smaller functions' : 'Good complexity level'
      };
    }

    // Simplified complexity for other languages
    const lines = code.split('\n').length;
    const score = Math.ceil(lines / 10);
    return { score, level: score <= 5 ? 'low' : 'medium' };
  }

  /**
   * Detect code patterns and idioms
   */
  detectPatterns(code, language) {
    const patterns = [];
    const langPatterns = this.patterns[language] || this.patterns.common;

    for (const [name, pattern] of Object.entries(langPatterns)) {
      if (pattern.test && pattern.test(code)) {
        patterns.push({
          name,
          confidence: pattern.confidence || 0.8,
          suggestion: pattern.suggestion,
          example: pattern.example
        });
      }
    }

    return patterns;
  }

  /**
   * Detect potential issues and code smells
   */
  detectIssues(code, language) {
    const issues = [];

    // Common issues
    if (code.includes('var ')) {
      issues.push({
        type: 'style',
        severity: 'warning',
        message: 'Use "let" or "const" instead of "var"',
        line: this.findLineNumber(code, 'var ')
      });
    }

    if (code.includes('==') && !code.includes('===')) {
      issues.push({
        type: 'safety',
        severity: 'warning',
        message: 'Use strict equality (===) instead of loose equality (==)',
        line: this.findLineNumber(code, '==')
      });
    }

    if (code.match(/function\s+\w+\s*\([^)]*\)\s*\{[^}]{500,}\}/)) {
      issues.push({
        type: 'complexity',
        severity: 'info',
        message: 'Function is too long. Consider breaking it into smaller functions',
        suggestion: 'Extract logical blocks into separate functions'
      });
    }

    // Check for missing error handling
    if (language === 'javascript' && code.includes('async ') && !code.includes('try')) {
      issues.push({
        type: 'error-handling',
        severity: 'error',
        message: 'Async function without try-catch block',
        suggestion: 'Add try-catch for proper error handling'
      });
    }

    return issues;
  }

  /**
   * Generate intelligent code suggestions
   */
  generateSuggestions(code, language) {
    const suggestions = [];
    const ast = language === 'javascript' ? this.parseJavaScript(code) : null;

    if (ast) {
      // Detect opportunities for optimization
      traverse(ast, {
        ForStatement: (path) => {
          suggestions.push({
            type: 'optimization',
            title: 'Consider using Array methods',
            description: 'Modern Array methods (map, filter, reduce) are often more readable',
            priority: 'medium',
            example: 'arr.map(item => item * 2)'
          });
        },
        FunctionDeclaration: (path) => {
          if (path.node.params.length > 4) {
            suggestions.push({
              type: 'refactor',
              title: 'Too many parameters',
              description: 'Consider using an options object',
              priority: 'high',
              example: 'function(options) { const { a, b, c } = options; }'
            });
          }
        }
      });
    }

    // Add language-specific suggestions
    suggestions.push(...this.getLanguageSpecificSuggestions(code, language));

    return suggestions;
  }

  /**
   * Extract dependencies and imports
   */
  extractDependencies(code, language) {
    const dependencies = {
      imports: [],
      exports: [],
      external: []
    };

    if (language === 'javascript' || language === 'typescript') {
      const ast = this.parseJavaScript(code);
      if (ast) {
        traverse(ast, {
          ImportDeclaration: (path) => {
            dependencies.imports.push({
              source: path.node.source.value,
              specifiers: path.node.specifiers.map(s => s.local.name)
            });
          },
          ExportNamedDeclaration: (path) => {
            dependencies.exports.push('named');
          },
          ExportDefaultDeclaration: (path) => {
            dependencies.exports.push('default');
          }
        });
      }
    }

    return dependencies;
  }

  /**
   * Calculate code metrics
   */
  calculateMetrics(code, language) {
    const lines = code.split('\n');
    const nonEmptyLines = lines.filter(line => line.trim().length > 0);
    const commentLines = lines.filter(line => line.trim().startsWith('//') || line.trim().startsWith('/*'));

    return {
      totalLines: lines.length,
      codeLines: nonEmptyLines.length,
      commentLines: commentLines.length,
      commentRatio: commentLines.length / nonEmptyLines.length,
      averageLineLength: nonEmptyLines.reduce((sum, line) => sum + line.length, 0) / nonEmptyLines.length,
      maintainabilityIndex: this.calculateMaintainabilityIndex(code, language)
    };
  }

  /**
   * Calculate Maintainability Index
   */
  calculateMaintainabilityIndex(code, language) {
    const complexity = this.calculateComplexity(code, language);
    const metrics = {
      lines: code.split('\n').length,
      complexity: complexity.score
    };

    // Simplified maintainability index
    const mi = Math.max(0, Math.min(100, 
      171 - 5.2 * Math.log(metrics.lines) - 0.23 * metrics.complexity
    ));

    return {
      score: Math.round(mi),
      rating: mi > 85 ? 'excellent' : mi > 65 ? 'good' : mi > 35 ? 'moderate' : 'poor'
    };
  }

  /**
   * Advanced code completion with context awareness
   */
  async generateCompletion(context, cursorPosition, language) {
    const beforeCursor = context.substring(0, cursorPosition);
    const afterCursor = context.substring(cursorPosition);
    
    // Analyze context
    const contextAnalysis = this.analyzeContext(beforeCursor, language);
    
    // Generate completions based on context
    const completions = [];

    // Check for common patterns
    if (beforeCursor.trim().endsWith('function') || beforeCursor.trim().endsWith('const')) {
      completions.push(...this.getFunctionCompletions(contextAnalysis, language));
    }

    if (beforeCursor.includes('import')) {
      completions.push(...this.getImportCompletions(contextAnalysis, language));
    }

    if (beforeCursor.trim().endsWith('.')) {
      completions.push(...this.getMethodCompletions(contextAnalysis, language));
    }

    // Add smart completions from learned patterns
    completions.push(...this.getLearnedCompletions(contextAnalysis, language));

    return completions;
  }

  /**
   * Analyze code context
   */
  analyzeContext(code, language) {
    return {
      language,
      variables: this.extractVariables(code),
      functions: this.extractFunctions(code),
      imports: this.extractDependencies(code, language).imports,
      scope: this.determineScope(code),
      recentTokens: code.split(/\s+/).slice(-10)
    };
  }

  extractVariables(code) {
    const variables = [];
    const varRegex = /(?:const|let|var)\s+(\w+)/g;
    let match;
    while ((match = varRegex.exec(code)) !== null) {
      variables.push(match[1]);
    }
    return variables;
  }

  extractFunctions(code) {
    const functions = [];
    const funcRegex = /(?:function\s+(\w+)|const\s+(\w+)\s*=\s*(?:async\s+)?\([^)]*\)\s*=>)/g;
    let match;
    while ((match = funcRegex.exec(code)) !== null) {
      functions.push(match[1] || match[2]);
    }
    return functions;
  }

  determineScope(code) {
    const openBraces = (code.match(/{/g) || []).length;
    const closeBraces = (code.match(/}/g) || []).length;
    return {
      depth: openBraces - closeBraces,
      type: code.includes('class ') ? 'class' : 'function'
    };
  }

  /**
   * Get function completions
   */
  getFunctionCompletions(context, language) {
    return [
      {
        label: 'async function',
        insertText: 'async function ${1:functionName}(${2:params}) {\n  ${3:// code}\n}',
        kind: 'function',
        documentation: 'Create an async function',
        score: 0.9
      },
      {
        label: 'arrow function',
        insertText: '${1:name} = (${2:params}) => {\n  ${3:// code}\n}',
        kind: 'function',
        documentation: 'Create an arrow function',
        score: 0.95
      }
    ];
  }

  getImportCompletions(context, language) {
    const commonImports = {
      javascript: [
        { module: 'express', usage: 'Web framework' },
        { module: 'react', usage: 'UI library' },
        { module: 'axios', usage: 'HTTP client' },
        { module: 'lodash', usage: 'Utility library' }
      ],
      python: [
        { module: 'numpy', usage: 'Numerical computing' },
        { module: 'pandas', usage: 'Data analysis' },
        { module: 'requests', usage: 'HTTP library' }
      ]
    };

    const imports = commonImports[language] || commonImports.javascript;
    return imports.map(imp => ({
      label: `import ${imp.module}`,
      insertText: `import ${imp.module}`,
      kind: 'module',
      documentation: imp.usage,
      score: 0.85
    }));
  }

  getMethodCompletions(context, language) {
    return [
      { label: 'map', kind: 'method', score: 0.9 },
      { label: 'filter', kind: 'method', score: 0.9 },
      { label: 'reduce', kind: 'method', score: 0.85 },
      { label: 'forEach', kind: 'method', score: 0.85 },
      { label: 'find', kind: 'method', score: 0.9 },
      { label: 'some', kind: 'method', score: 0.8 },
      { label: 'every', kind: 'method', score: 0.8 }
    ];
  }

  getLearnedCompletions(context, language) {
    const stmt = this.db.prepare(`
      SELECT suggestion, score FROM code_completions
      WHERE language = ? AND accepted > rejected
      ORDER BY score DESC LIMIT 10
    `);
    
    const results = stmt.all(language);
    return results.map(r => ({
      label: r.suggestion,
      kind: 'learned',
      score: r.score,
      documentation: 'Learned from previous usage'
    }));
  }

  /**
   * Learn from code patterns
   */
  learnFromCode(code, language, analysis) {
    // Store context for learning
    this.contextMemory.push({ code, language, analysis, timestamp: Date.now() });
    
    // Keep only recent context (last 100 items)
    if (this.contextMemory.length > 100) {
      this.contextMemory.shift();
    }

    // Extract and store new patterns
    for (const pattern of analysis.patterns) {
      const stmt = this.db.prepare(`
        INSERT OR REPLACE INTO code_patterns (language, pattern, category, confidence, usage_count)
        VALUES (?, ?, ?, ?, COALESCE((SELECT usage_count + 1 FROM code_patterns WHERE pattern = ?), 1))
      `);
      stmt.run(language, pattern.name, 'learned', pattern.confidence, pattern.name);
    }
  }

  /**
   * Update skills dynamically
   */
  updateSkill(skillName, skillData) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO learned_skills (skill_name, skill_data, version, last_updated)
      VALUES (?, ?, COALESCE((SELECT version + 1 FROM learned_skills WHERE skill_name = ?), 1), CURRENT_TIMESTAMP)
    `);
    stmt.run(skillName, JSON.stringify(skillData), skillName);
    this.skillDatabase.set(skillName, skillData);
  }

  /**
   * Get all learned skills
   */
  getSkills() {
    const stmt = this.db.prepare('SELECT * FROM learned_skills ORDER BY last_updated DESC');
    return stmt.all();
  }

  // Language-specific patterns
  getJavaScriptPatterns() {
    return {
      asyncAwait: {
        test: (code) => code.includes('async') && code.includes('await'),
        confidence: 0.95,
        suggestion: 'Modern async/await pattern detected',
        example: 'async function fetchData() { const data = await fetch(url); }'
      },
      destructuring: {
        test: (code) => /const\s+\{[^}]+\}\s*=/.test(code),
        confidence: 0.9,
        suggestion: 'Using object destructuring - good practice',
        example: 'const { name, age } = person;'
      }
    };
  }

  getTypeScriptPatterns() {
    return {
      ...this.getJavaScriptPatterns(),
      typeAnnotation: {
        test: (code) => /:\s*(string|number|boolean|any)/.test(code),
        confidence: 0.95,
        suggestion: 'Type annotations improve code safety'
      }
    };
  }

  getPythonPatterns() {
    return {
      listComprehension: {
        test: (code) => /\[[^\]]+for\s+\w+\s+in\s+/.test(code),
        confidence: 0.95,
        suggestion: 'List comprehension - Pythonic way'
      }
    };
  }

  getJavaPatterns() {
    return {
      singleton: {
        test: (code) => /private\s+static.*getInstance/.test(code),
        confidence: 0.9,
        suggestion: 'Singleton pattern detected'
      }
    };
  }

  getGoPatterns() {
    return {
      errorHandling: {
        test: (code) => /if\s+err\s*!=\s*nil/.test(code),
        confidence: 0.95,
        suggestion: 'Proper Go error handling'
      }
    };
  }

  getRustPatterns() {
    return {
      resultType: {
        test: (code) => /Result<.*>/.test(code),
        confidence: 0.9,
        suggestion: 'Using Result type for error handling'
      }
    };
  }

  getCommonPatterns() {
    return {
      nullCheck: {
        test: (code) => /!==?\s*null|null\s*!==?/.test(code),
        confidence: 0.9,
        suggestion: 'Null checking for safety'
      }
    };
  }

  getLanguageSpecificSuggestions(code, language) {
    const suggestions = [];
    
    if (language === 'javascript' && !code.includes('use strict')) {
      suggestions.push({
        type: 'best-practice',
        title: 'Add "use strict"',
        description: 'Enable strict mode for better error checking',
        priority: 'medium'
      });
    }

    return suggestions;
  }

  // Utility functions
  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash;
  }

  findLineNumber(code, searchStr) {
    const lines = code.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(searchStr)) return i + 1;
    }
    return 0;
  }
}

module.exports = LocalAIEngine;
