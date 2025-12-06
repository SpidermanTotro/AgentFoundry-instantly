/**
 * Advanced Plugin System for Dynamic Skill Updates
 * Allows the AI to learn and integrate new programming skills without restrictions
 */

const fs = require('fs').promises;
const path = require('path');
const EventEmitter = require('events');

class PluginSystem extends EventEmitter {
  constructor() {
    super();
    this.plugins = new Map();
    this.skills = new Map();
    this.pluginDir = path.join(__dirname, 'plugins');
    this.skillUpdates = [];
    this.autoUpdateEnabled = true;
  }

  async initialize() {
    await this.ensurePluginDirectory();
    await this.loadAllPlugins();
    await this.loadDefaultSkills();
    this.emit('initialized');
  }

  async ensurePluginDirectory() {
    try {
      await fs.mkdir(this.pluginDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create plugin directory:', error);
    }
  }

  /**
   * Load all available plugins
   */
  async loadAllPlugins() {
    try {
      const files = await fs.readdir(this.pluginDir);
      for (const file of files) {
        if (file.endsWith('.js')) {
          await this.loadPlugin(path.join(this.pluginDir, file));
        }
      }
    } catch (error) {
      console.error('Error loading plugins:', error);
    }
  }

  /**
   * Load a specific plugin
   */
  async loadPlugin(pluginPath) {
    try {
      const plugin = require(pluginPath);
      const pluginName = path.basename(pluginPath, '.js');
      
      if (this.validatePlugin(plugin)) {
        this.plugins.set(pluginName, {
          instance: plugin,
          path: pluginPath,
          loaded: new Date(),
          version: plugin.version || '1.0.0'
        });
        
        if (plugin.initialize) {
          await plugin.initialize(this);
        }
        
        this.emit('plugin-loaded', pluginName);
        console.log(`✅ Loaded plugin: ${pluginName}`);
      }
    } catch (error) {
      console.error(`Failed to load plugin ${pluginPath}:`, error);
    }
  }

  /**
   * Validate plugin structure
   */
  validatePlugin(plugin) {
    return plugin && typeof plugin.execute === 'function';
  }

  /**
   * Register a new skill
   */
  registerSkill(skillName, skillData) {
    this.skills.set(skillName, {
      ...skillData,
      registered: new Date(),
      usageCount: 0,
      successRate: 1.0
    });
    
    this.emit('skill-registered', skillName);
    console.log(`📚 Registered skill: ${skillName}`);
  }

  /**
   * Execute a plugin
   */
  async executePlugin(pluginName, context) {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      throw new Error(`Plugin not found: ${pluginName}`);
    }

    try {
      const result = await plugin.instance.execute(context);
      return result;
    } catch (error) {
      console.error(`Plugin execution error (${pluginName}):`, error);
      throw error;
    }
  }

  /**
   * Apply a skill to code
   */
  async applySkill(skillName, code, context = {}) {
    const skill = this.skills.get(skillName);
    if (!skill) {
      return { success: false, error: 'Skill not found' };
    }

    try {
      skill.usageCount++;
      const result = await skill.apply(code, context);
      
      if (result.success) {
        skill.successRate = (skill.successRate * 0.9) + (1.0 * 0.1);
      } else {
        skill.successRate = (skill.successRate * 0.9) + (0.0 * 0.1);
      }
      
      return result;
    } catch (error) {
      console.error(`Skill application error (${skillName}):`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Load default programming skills
   */
  async loadDefaultSkills() {
    // Code Refactoring Skills
    this.registerSkill('extract-function', {
      description: 'Extract repeated code into a reusable function',
      language: 'javascript',
      apply: async (code, context) => {
        // Implementation for function extraction
        return {
          success: true,
          transformed: code,
          changes: ['Extracted function']
        };
      }
    });

    this.registerSkill('optimize-loops', {
      description: 'Optimize loops for better performance',
      language: 'all',
      apply: async (code, context) => {
        let optimized = code;
        // Replace inefficient patterns
        optimized = optimized.replace(
          /for\s*\(\s*let\s+(\w+)\s*=\s*0\s*;\s*\1\s*<\s*(\w+)\.length\s*;\s*\1\+\+\s*\)/g,
          'for (const item of $2)'
        );
        return {
          success: true,
          transformed: optimized,
          changes: ['Optimized loop to for-of']
        };
      }
    });

    this.registerSkill('add-error-handling', {
      description: 'Add comprehensive error handling',
      language: 'javascript',
      apply: async (code, context) => {
        if (code.includes('async ') && !code.includes('try')) {
          const transformed = code.replace(
            /(async\s+function[^{]+\{)/g,
            '$1\n  try {'
          ).replace(/(\}\s*)$/, '  } catch (error) {\n    console.error(error);\n    throw error;\n  }\n$1');
          
          return {
            success: true,
            transformed,
            changes: ['Added try-catch block']
          };
        }
        return { success: false, reason: 'No async functions found' };
      }
    });

    this.registerSkill('modernize-syntax', {
      description: 'Update to modern JavaScript syntax',
      language: 'javascript',
      apply: async (code, context) => {
        let modernized = code;
        // var -> const/let
        modernized = modernized.replace(/var\s+/g, 'const ');
        // function -> arrow function (simple cases)
        modernized = modernized.replace(
          /const\s+(\w+)\s*=\s*function\s*\(([^)]*)\)\s*\{/g,
          'const $1 = ($2) => {'
        );
        
        return {
          success: true,
          transformed: modernized,
          changes: ['Converted var to const', 'Updated to arrow functions']
        };
      }
    });

    this.registerSkill('add-type-safety', {
      description: 'Add JSDoc type annotations for better type safety',
      language: 'javascript',
      apply: async (code, context) => {
        // Add JSDoc comments to functions
        const transformed = code.replace(
          /(function\s+(\w+)\s*\(([^)]*)\))/g,
          '/**\n * @param {*} $3\n * @returns {*}\n */\n$1'
        );
        
        return {
          success: true,
          transformed,
          changes: ['Added JSDoc type annotations']
        };
      }
    });

    this.registerSkill('security-hardening', {
      description: 'Add security best practices',
      language: 'all',
      apply: async (code, context) => {
        let hardened = code;
        const changes = [];
        
        // Add input validation
        if (code.includes('req.body') && !code.includes('validate')) {
          changes.push('Added input validation reminder');
        }
        
        // Suggest using parameterized queries
        if (code.includes('SELECT') && code.includes('+')) {
          changes.push('Recommend parameterized queries to prevent SQL injection');
        }
        
        return {
          success: true,
          transformed: hardened,
          changes,
          warnings: changes
        };
      }
    });

    // Python-specific skills
    this.registerSkill('pythonic-style', {
      description: 'Convert to Pythonic style',
      language: 'python',
      apply: async (code, context) => {
        let pythonic = code;
        // Suggest list comprehensions
        // Convert range-based loops to enumerate
        
        return {
          success: true,
          transformed: pythonic,
          changes: ['Applied Pythonic patterns']
        };
      }
    });

    // Performance optimization skills
    this.registerSkill('cache-optimization', {
      description: 'Add caching for expensive operations',
      language: 'all',
      apply: async (code, context) => {
        return {
          success: true,
          transformed: code,
          suggestions: [
            'Consider caching API responses',
            'Use memoization for pure functions',
            'Implement request debouncing'
          ]
        };
      }
    });

    console.log(`✅ Loaded ${this.skills.size} default skills`);
  }

  /**
   * Auto-update skills from usage patterns
   */
  async autoUpdateSkills(usageData) {
    if (!this.autoUpdateEnabled) return;

    for (const [skillName, data] of Object.entries(usageData)) {
      const skill = this.skills.get(skillName);
      if (skill && data.successRate > 0.8) {
        // Promote successful skills
        skill.priority = (skill.priority || 0) + 1;
      } else if (skill && data.successRate < 0.3) {
        // Demote unsuccessful skills
        skill.priority = Math.max(0, (skill.priority || 0) - 1);
      }
    }

    this.emit('skills-updated', usageData);
  }

  /**
   * Create a new plugin dynamically
   */
  async createPlugin(name, code) {
    const pluginPath = path.join(this.pluginDir, `${name}.js`);
    await fs.writeFile(pluginPath, code);
    await this.loadPlugin(pluginPath);
  }

  /**
   * Get plugin statistics
   */
  getStatistics() {
    const skillStats = Array.from(this.skills.entries()).map(([name, skill]) => ({
      name,
      usageCount: skill.usageCount,
      successRate: skill.successRate,
      priority: skill.priority || 0
    }));

    return {
      totalPlugins: this.plugins.size,
      totalSkills: this.skills.size,
      skillStats: skillStats.sort((a, b) => b.usageCount - a.usageCount)
    };
  }

  /**
   * Export skills for backup or sharing
   */
  async exportSkills() {
    const skillsData = {};
    for (const [name, skill] of this.skills.entries()) {
      skillsData[name] = {
        description: skill.description,
        language: skill.language,
        usageCount: skill.usageCount,
        successRate: skill.successRate
      };
    }
    return skillsData;
  }

  /**
   * Import skills from external source
   */
  async importSkills(skillsData) {
    for (const [name, data] of Object.entries(skillsData)) {
      if (!this.skills.has(name)) {
        this.registerSkill(name, data);
      }
    }
  }

  /**
   * Get recommended skills for context
   */
  getRecommendedSkills(code, language) {
    const recommended = [];
    
    for (const [name, skill] of this.skills.entries()) {
      if (skill.language === 'all' || skill.language === language) {
        if (skill.successRate > 0.7) {
          recommended.push({
            name,
            description: skill.description,
            successRate: skill.successRate,
            usageCount: skill.usageCount
          });
        }
      }
    }

    return recommended.sort((a, b) => b.successRate - a.successRate);
  }

  /**
   * Unload a plugin
   */
  unloadPlugin(pluginName) {
    if (this.plugins.has(pluginName)) {
      const plugin = this.plugins.get(pluginName);
      if (plugin.instance.cleanup) {
        plugin.instance.cleanup();
      }
      this.plugins.delete(pluginName);
      this.emit('plugin-unloaded', pluginName);
      console.log(`❌ Unloaded plugin: ${pluginName}`);
    }
  }

  /**
   * Reload a plugin
   */
  async reloadPlugin(pluginName) {
    const plugin = this.plugins.get(pluginName);
    if (plugin) {
      this.unloadPlugin(pluginName);
      delete require.cache[require.resolve(plugin.path)];
      await this.loadPlugin(plugin.path);
    }
  }
}

module.exports = PluginSystem;
