/**
 * Advanced Code Intelligence System
 * Provides deep code understanding, semantic analysis, and intelligent suggestions
 */

const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const prettier = require('prettier');
const fg = require('fast-glob');
const path = require('path');
const fs = require('fs').promises;

class CodeIntelligence {
  constructor() {
    this.projectContext = new Map();
    this.fileCache = new Map();
    this.dependencyGraph = new Map();
    this.semanticIndex = new Map();
  }

  /**
   * Analyze entire project structure
   */
  async analyzeProject(projectPath) {
    console.log('🔍 Analyzing project structure...');
    
    const files = await fg(['**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx', '**/*.py', '**/*.java'], {
      cwd: projectPath,
      ignore: ['node_modules/**', 'dist/**', 'build/**', '.git/**']
    });

    const analysis = {
      totalFiles: files.length,
      fileTypes: {},
      dependencies: new Set(),
      exports: new Map(),
      complexity: { total: 0, average: 0 },
      issues: [],
      structure: {}
    };

    for (const file of files) {
      const filePath = path.join(projectPath, file);
      const fileAnalysis = await this.analyzeFile(filePath);
      
      // Track file types
      const ext = path.extname(file);
      analysis.fileTypes[ext] = (analysis.fileTypes[ext] || 0) + 1;
      
      // Aggregate complexity
      analysis.complexity.total += fileAnalysis.complexity.score;
      
      // Collect dependencies
      fileAnalysis.dependencies.forEach(dep => analysis.dependencies.add(dep));
      
      // Build dependency graph
      this.dependencyGraph.set(file, fileAnalysis.dependencies);
      
      // Store exports
      if (fileAnalysis.exports.length > 0) {
        analysis.exports.set(file, fileAnalysis.exports);
      }
      
      // Collect issues
      analysis.issues.push(...fileAnalysis.issues.map(issue => ({
        ...issue,
        file
      })));
    }

    analysis.complexity.average = analysis.complexity.total / files.length;
    analysis.dependencies = Array.from(analysis.dependencies);
    
    console.log(`✅ Analyzed ${files.length} files`);
    return analysis;
  }

  /**
   * Analyze a single file
   */
  async analyzeFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const ext = path.extname(filePath);
      
      if (['.js', '.jsx', '.ts', '.tsx'].includes(ext)) {
        return this.analyzeJavaScriptFile(content, filePath);
      } else if (ext === '.py') {
        return this.analyzePythonFile(content, filePath);
      }
      
      return {
        complexity: { score: 0 },
        dependencies: [],
        exports: [],
        issues: []
      };
    } catch (error) {
      console.error(`Error analyzing ${filePath}:`, error.message);
      return {
        complexity: { score: 0 },
        dependencies: [],
        exports: [],
        issues: [{ type: 'error', message: error.message }]
      };
    }
  }

  /**
   * Analyze JavaScript/TypeScript file
   */
  analyzeJavaScriptFile(content, filePath) {
    const analysis = {
      complexity: { score: 0, functions: [] },
      dependencies: [],
      exports: [],
      issues: [],
      functions: [],
      classes: [],
      variables: []
    };

    try {
      const ast = parse(content, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript', 'decorators-legacy', 'classProperties']
      });

      let complexity = 1;
      
      traverse(ast, {
        // Track imports
        ImportDeclaration: (path) => {
          analysis.dependencies.push(path.node.source.value);
        },
        
        // Track exports
        ExportNamedDeclaration: (path) => {
          if (path.node.declaration) {
            if (path.node.declaration.declarations) {
              path.node.declaration.declarations.forEach(dec => {
                analysis.exports.push(dec.id.name);
              });
            } else if (path.node.declaration.id) {
              analysis.exports.push(path.node.declaration.id.name);
            }
          }
        },
        
        ExportDefaultDeclaration: (path) => {
          analysis.exports.push('default');
        },
        
        // Track functions
        FunctionDeclaration: (path) => {
          const funcComplexity = this.calculateFunctionComplexity(path);
          analysis.functions.push({
            name: path.node.id?.name || 'anonymous',
            complexity: funcComplexity,
            params: path.node.params.length,
            async: path.node.async,
            line: path.node.loc?.start.line
          });
          complexity += funcComplexity;
        },
        
        ArrowFunctionExpression: (path) => {
          const funcComplexity = this.calculateFunctionComplexity(path);
          complexity += funcComplexity;
        },
        
        // Track classes
        ClassDeclaration: (path) => {
          analysis.classes.push({
            name: path.node.id.name,
            methods: path.node.body.body.filter(m => m.type === 'ClassMethod').length,
            line: path.node.loc?.start.line
          });
        },
        
        // Track complexity
        IfStatement: () => complexity++,
        WhileStatement: () => complexity++,
        ForStatement: () => complexity++,
        SwitchCase: () => complexity++,
        ConditionalExpression: () => complexity++,
        LogicalExpression: () => complexity++,
        CatchClause: () => complexity++,
        
        // Detect potential issues
        CallExpression: (path) => {
          // Detect console.log in production code
          if (path.node.callee.object?.name === 'console') {
            analysis.issues.push({
              type: 'warning',
              message: 'Console statement found - consider removing for production',
              line: path.node.loc?.start.line
            });
          }
          
          // Detect eval usage
          if (path.node.callee.name === 'eval') {
            analysis.issues.push({
              type: 'error',
              message: 'eval() is dangerous and should be avoided',
              line: path.node.loc?.start.line
            });
          }
        }
      });

      analysis.complexity.score = complexity;
      analysis.complexity.level = complexity <= 10 ? 'low' : complexity <= 20 ? 'medium' : 'high';
      
    } catch (error) {
      analysis.issues.push({
        type: 'error',
        message: `Parse error: ${error.message}`
      });
    }

    return analysis;
  }

  /**
   * Calculate function-specific complexity
   */
  calculateFunctionComplexity(path) {
    let complexity = 1;
    
    path.traverse({
      IfStatement: () => complexity++,
      WhileStatement: () => complexity++,
      ForStatement: () => complexity++,
      SwitchCase: () => complexity++,
      ConditionalExpression: () => complexity++,
      LogicalExpression: () => complexity++,
      CatchClause: () => complexity++
    });
    
    return complexity;
  }

  /**
   * Analyze Python file (simplified)
   */
  analyzePythonFile(content, filePath) {
    const analysis = {
      complexity: { score: 0 },
      dependencies: [],
      exports: [],
      issues: []
    };

    // Simple regex-based analysis for Python
    const importMatches = content.matchAll(/^(?:from|import)\s+(\S+)/gm);
    for (const match of importMatches) {
      analysis.dependencies.push(match[1]);
    }

    // Count complexity indicators
    const complexityIndicators = [
      /\bif\b/g,
      /\bfor\b/g,
      /\bwhile\b/g,
      /\btry\b/g,
      /\band\b/g,
      /\bor\b/g
    ];

    let complexity = 1;
    for (const pattern of complexityIndicators) {
      const matches = content.match(pattern);
      if (matches) complexity += matches.length;
    }

    analysis.complexity.score = complexity;
    
    return analysis;
  }

  /**
   * Format code with Prettier
   */
  async formatCode(code, language) {
    try {
      const parser = this.getPrettierParser(language);
      if (!parser) return code;

      return await prettier.format(code, {
        parser,
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'es5'
      });
    } catch (error) {
      console.error('Format error:', error.message);
      return code;
    }
  }

  getPrettierParser(language) {
    const parserMap = {
      javascript: 'babel',
      typescript: 'typescript',
      jsx: 'babel',
      tsx: 'typescript',
      json: 'json',
      html: 'html',
      css: 'css',
      markdown: 'markdown'
    };
    return parserMap[language];
  }

  /**
   * Detect code smells
   */
  detectCodeSmells(code, language) {
    const smells = [];

    // Long parameter list
    const longParamRegex = /function\s+\w+\s*\(([^)]{50,})\)/g;
    if (longParamRegex.test(code)) {
      smells.push({
        type: 'long-parameter-list',
        severity: 'warning',
        message: 'Function has too many parameters',
        suggestion: 'Consider using an options object'
      });
    }

    // Duplicated code
    const lines = code.split('\n');
    const lineMap = new Map();
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.length > 20) {
        if (!lineMap.has(line)) {
          lineMap.set(line, []);
        }
        lineMap.get(line).push(i + 1);
      }
    }

    for (const [line, occurrences] of lineMap.entries()) {
      if (occurrences.length > 2) {
        smells.push({
          type: 'duplicated-code',
          severity: 'info',
          message: `Line duplicated ${occurrences.length} times`,
          lines: occurrences,
          suggestion: 'Extract to a function or constant'
        });
      }
    }

    // Magic numbers
    const magicNumberRegex = /(?<![a-zA-Z0-9_])((?!0|1|2|10|100)\d{2,})(?![a-zA-Z0-9_])/g;
    const magicNumbers = code.match(magicNumberRegex);
    if (magicNumbers && magicNumbers.length > 0) {
      smells.push({
        type: 'magic-number',
        severity: 'info',
        message: 'Magic numbers detected',
        suggestion: 'Use named constants instead'
      });
    }

    // Nested callbacks (callback hell)
    const nestedCallbacks = (code.match(/function\s*\([^)]*\)\s*{[^}]*function\s*\([^)]*\)\s*{/g) || []).length;
    if (nestedCallbacks > 2) {
      smells.push({
        type: 'callback-hell',
        severity: 'warning',
        message: 'Deep callback nesting detected',
        suggestion: 'Consider using async/await or Promises'
      });
    }

    return smells;
  }

  /**
   * Generate smart code suggestions based on context
   */
  generateContextualSuggestions(code, cursorPosition, language) {
    const beforeCursor = code.substring(0, cursorPosition);
    const afterCursor = code.substring(cursorPosition);
    const currentLine = beforeCursor.split('\n').pop();
    
    const suggestions = [];

    // Import suggestions
    if (currentLine.trim().startsWith('import') || currentLine.includes('require')) {
      suggestions.push(...this.getImportSuggestions(currentLine, language));
    }

    // Function suggestions
    if (currentLine.trim().endsWith('function') || currentLine.trim().endsWith('=>')) {
      suggestions.push(...this.getFunctionSuggestions(beforeCursor, language));
    }

    // Method chaining suggestions
    if (currentLine.trim().endsWith('.')) {
      suggestions.push(...this.getMethodChainingSuggestions(beforeCursor, language));
    }

    // Variable suggestions
    if (/(?:const|let|var)\s+\w*$/.test(currentLine)) {
      suggestions.push(...this.getVariableSuggestions(beforeCursor, language));
    }

    // Control structure suggestions
    if (/^\s*(?:if|while|for)\s*$/.test(currentLine)) {
      suggestions.push(...this.getControlStructureSuggestions(currentLine, language));
    }

    return suggestions;
  }

  getImportSuggestions(line, language) {
    const commonImports = {
      javascript: [
        { text: "import React from 'react';", label: 'React', detail: 'UI library' },
        { text: "import { useState, useEffect } from 'react';", label: 'React Hooks', detail: 'State management' },
        { text: "import express from 'express';", label: 'Express', detail: 'Web framework' },
        { text: "import axios from 'axios';", label: 'Axios', detail: 'HTTP client' }
      ],
      typescript: [
        { text: "import type { } from '';", label: 'Type Import', detail: 'TypeScript type import' }
      ]
    };

    return (commonImports[language] || []).map(imp => ({
      ...imp,
      kind: 'import',
      score: 0.9
    }));
  }

  getFunctionSuggestions(context, language) {
    return [
      {
        text: 'async function name(params) {\n  \n}',
        label: 'async function',
        detail: 'Asynchronous function',
        kind: 'function',
        score: 0.95
      },
      {
        text: '(params) => {\n  \n}',
        label: 'arrow function',
        detail: 'ES6 arrow function',
        kind: 'function',
        score: 0.9
      }
    ];
  }

  getMethodChainingSuggestions(context, language) {
    return [
      { text: 'map()', label: 'map', detail: 'Transform array elements', kind: 'method', score: 0.95 },
      { text: 'filter()', label: 'filter', detail: 'Filter array elements', kind: 'method', score: 0.95 },
      { text: 'reduce()', label: 'reduce', detail: 'Reduce to single value', kind: 'method', score: 0.9 },
      { text: 'find()', label: 'find', detail: 'Find first matching element', kind: 'method', score: 0.9 },
      { text: 'forEach()', label: 'forEach', detail: 'Iterate over elements', kind: 'method', score: 0.85 },
      { text: 'some()', label: 'some', detail: 'Test if any element matches', kind: 'method', score: 0.85 },
      { text: 'every()', label: 'every', detail: 'Test if all elements match', kind: 'method', score: 0.85 }
    ];
  }

  getVariableSuggestions(context, language) {
    // Suggest variable names based on context
    const suggestions = [];
    
    if (context.includes('fetch') || context.includes('axios')) {
      suggestions.push({ text: 'data', label: 'data', detail: 'API response data', kind: 'variable', score: 0.9 });
      suggestions.push({ text: 'response', label: 'response', detail: 'HTTP response', kind: 'variable', score: 0.9 });
    }

    if (context.includes('useState')) {
      suggestions.push({ text: 'state', label: 'state', detail: 'Component state', kind: 'variable', score: 0.85 });
    }

    return suggestions;
  }

  getControlStructureSuggestions(line, language) {
    const keyword = line.trim();
    
    if (keyword === 'if') {
      return [{
        text: 'if (condition) {\n  \n}',
        label: 'if statement',
        detail: 'Conditional statement',
        kind: 'snippet',
        score: 0.95
      }];
    }

    if (keyword === 'for') {
      return [
        {
          text: 'for (const item of array) {\n  \n}',
          label: 'for...of loop',
          detail: 'Iterate over array',
          kind: 'snippet',
          score: 0.95
        },
        {
          text: 'for (let i = 0; i < length; i++) {\n  \n}',
          label: 'for loop',
          detail: 'Traditional for loop',
          kind: 'snippet',
          score: 0.85
        }
      ];
    }

    return [];
  }

  /**
   * Build semantic index for better code understanding
   */
  buildSemanticIndex(code, language) {
    const index = {
      identifiers: new Set(),
      functions: new Set(),
      classes: new Set(),
      imports: new Set(),
      keywords: new Set()
    };

    if (language === 'javascript' || language === 'typescript') {
      try {
        const ast = parse(code, {
          sourceType: 'module',
          plugins: ['jsx', 'typescript']
        });

        traverse(ast, {
          Identifier: (path) => index.identifiers.add(path.node.name),
          FunctionDeclaration: (path) => index.functions.add(path.node.id?.name),
          ClassDeclaration: (path) => index.classes.add(path.node.id.name),
          ImportDeclaration: (path) => index.imports.add(path.node.source.value)
        });
      } catch (error) {
        // Fallback to regex
      }
    }

    return {
      identifiers: Array.from(index.identifiers),
      functions: Array.from(index.functions),
      classes: Array.from(index.classes),
      imports: Array.from(index.imports)
    };
  }
}

module.exports = CodeIntelligence;
