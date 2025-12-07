/**
 * Integrated AI Engine - GenSpark 2.0 Platform
 * 
 * Manages seamless switching between:
 * - GGUF models (offline, fastest for code)
 * - Offline AI (transformers.js, local processing)
 * - Online AI (cloud providers, advanced features)
 * 
 * Features:
 * - Automatic fallback
 * - Smart caching
 * - Performance monitoring
 * - Offline-first capability
 */

const config = require('../../genspark-integration.config');
const NodeCache = require('node-cache');

class IntegratedAIEngine {
  constructor() {
    this.initialized = false;
    this.mode = config.platform.mode;
    this.engines = {};
    this.cache = new NodeCache({
      stdTTL: config.sync.cache.ttl / 1000,
      maxKeys: config.sync.cache.maxSize
    });
    this.metrics = {
      requests: 0,
      cacheHits: 0,
      cacheMisses: 0,
      engineUsage: {},
      averageResponseTime: {}
    };
  }

  async initialize() {
    console.log('🚀 Initializing Integrated AI Engine...');
    console.log(`   Mode: ${this.mode}`);

    try {
      // Initialize offline engine (always available)
      if (config.aiEngines.primary.offline.enabled) {
        const { default: OfflineGenSparkAI } = await import('./OfflineGenSparkAI.js');
        this.engines.offline = new OfflineGenSparkAI();
        await this.engines.offline.initialize({ devMode: config.features.devMode });
        console.log('   ✅ Offline AI Engine ready');
      }

      // Initialize GGUF engine if enabled
      if (config.aiEngines.gguf.enabled) {
        try {
          const { GGUFEngine } = require('../../genspark-2.0/src/ai/gguf-engine.js');
          this.engines.gguf = new GGUFEngine();
          
          // Try to initialize with default model
          const initialized = await this.engines.gguf.initialize(config.aiEngines.gguf.defaultModel);
          if (initialized) {
            console.log('   ✅ GGUF Engine ready');
            console.log(`      Model: ${config.aiEngines.gguf.defaultModel}`);
          } else {
            console.log('   ⚠️  GGUF models not found (download required)');
            this.engines.gguf = null;
          }
        } catch (error) {
          console.log('   ⚠️  GGUF Engine not available:', error.message);
          this.engines.gguf = null;
        }
      }

      // Initialize online engine if enabled
      if (config.aiEngines.primary.online.enabled && this.mode !== 'offline') {
        try {
          const CompleteGenSparkAI = require('./CompleteGenSparkAI');
          this.engines.online = new CompleteGenSparkAI();
          await this.engines.online.initialize();
          console.log('   ✅ Online AI Engine ready');
        } catch (error) {
          console.log('   ⚠️  Online AI Engine not available:', error.message);
          this.engines.online = null;
        }
      }

      this.initialized = true;
      console.log('✅ Integrated AI Engine initialized successfully!');
      
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Integrated AI Engine:', error);
      // Continue with available engines
      this.initialized = true;
      return false;
    }
  }

  /**
   * Generate text using the best available engine
   */
  async generateText(prompt, options = {}) {
    this.metrics.requests++;
    const startTime = Date.now();

    try {
      // Check cache first
      const cacheKey = this._getCacheKey('text', prompt, options);
      const cached = this.cache.get(cacheKey);
      if (cached) {
        this.metrics.cacheHits++;
        return { ...cached, cached: true };
      }
      this.metrics.cacheMisses++;

      // Determine which engine to use
      const engine = this._selectEngine('text-generation', options);
      
      if (!engine) {
        throw new Error('No AI engine available for text generation');
      }

      // Generate using selected engine
      let result;
      const engineName = this._getEngineName(engine);
      
      if (engine === this.engines.gguf) {
        result = await engine.generate(prompt, options);
      } else if (engine === this.engines.offline) {
        result = await engine.generateText(prompt, options);
      } else if (engine === this.engines.online) {
        result = await engine.generateText(prompt, options);
      }

      // Track metrics
      const responseTime = Date.now() - startTime;
      this._trackMetrics(engineName, responseTime);

      // Cache result
      this.cache.set(cacheKey, result);

      return {
        ...result,
        engine: engineName,
        responseTime,
        cached: false
      };

    } catch (error) {
      // Try fallback if enabled
      if (config.aiEngines.fallback.enabled) {
        return await this._tryFallback('text-generation', prompt, options, error);
      }
      throw error;
    }
  }

  /**
   * Generate code using the best available engine
   */
  async generateCode(prompt, language = 'javascript', options = {}) {
    this.metrics.requests++;
    const startTime = Date.now();

    try {
      // Check cache first
      const cacheKey = this._getCacheKey('code', prompt, { language, ...options });
      const cached = this.cache.get(cacheKey);
      if (cached) {
        this.metrics.cacheHits++;
        return { ...cached, cached: true };
      }
      this.metrics.cacheMisses++;

      // Prefer GGUF for code generation if available
      let engine;
      if (this.engines.gguf && this.mode !== 'online') {
        engine = this.engines.gguf;
      } else {
        engine = this._selectEngine('code-generation', options);
      }

      if (!engine) {
        throw new Error('No AI engine available for code generation');
      }

      // Generate using selected engine
      let result;
      const engineName = this._getEngineName(engine);

      if (engine === this.engines.gguf) {
        result = await engine.complete(prompt, language);
      } else if (engine === this.engines.offline) {
        result = await engine.generateCode(prompt, language, options);
      } else if (engine === this.engines.online) {
        result = await engine.generateCode(prompt, language, options);
      }

      // Track metrics
      const responseTime = Date.now() - startTime;
      this._trackMetrics(engineName, responseTime);

      // Cache result
      this.cache.set(cacheKey, result);

      return {
        ...result,
        engine: engineName,
        responseTime,
        cached: false
      };

    } catch (error) {
      if (config.aiEngines.fallback.enabled) {
        return await this._tryFallback('code-generation', prompt, { language, ...options }, error);
      }
      throw error;
    }
  }

  /**
   * Generate images (requires online or specific offline setup)
   */
  async generateImage(prompt, options = {}) {
    this.metrics.requests++;
    const startTime = Date.now();

    try {
      const cacheKey = this._getCacheKey('image', prompt, options);
      const cached = this.cache.get(cacheKey);
      if (cached) {
        this.metrics.cacheHits++;
        return { ...cached, cached: true };
      }
      this.metrics.cacheMisses++;

      let engine;
      
      // Online mode preferred for images
      if (this.engines.online && this.mode !== 'offline') {
        engine = this.engines.online;
      } else if (this.engines.offline) {
        engine = this.engines.offline;
      } else {
        throw new Error('No AI engine available for image generation');
      }

      const engineName = this._getEngineName(engine);
      const result = await engine.generateImage(prompt, options);

      const responseTime = Date.now() - startTime;
      this._trackMetrics(engineName, responseTime);

      this.cache.set(cacheKey, result);

      return {
        ...result,
        engine: engineName,
        responseTime,
        cached: false
      };

    } catch (error) {
      if (config.aiEngines.fallback.enabled) {
        return await this._tryFallback('image-generation', prompt, options, error);
      }
      throw error;
    }
  }

  /**
   * Process documents
   */
  async processDocument(content, type = 'text', options = {}) {
    this.metrics.requests++;
    const startTime = Date.now();

    try {
      const cacheKey = this._getCacheKey('document', content.substring(0, 100), { type, ...options });
      const cached = this.cache.get(cacheKey);
      if (cached) {
        this.metrics.cacheHits++;
        return { ...cached, cached: true };
      }
      this.metrics.cacheMisses++;

      // Prefer offline for document processing (faster, private)
      const engine = this.engines.offline || this.engines.online;
      
      if (!engine) {
        throw new Error('No AI engine available for document processing');
      }

      const engineName = this._getEngineName(engine);
      const result = await engine.processDocument(content, type, options);

      const responseTime = Date.now() - startTime;
      this._trackMetrics(engineName, responseTime);

      this.cache.set(cacheKey, result);

      return {
        ...result,
        engine: engineName,
        responseTime,
        cached: false
      };

    } catch (error) {
      throw error;
    }
  }

  /**
   * Perform web search
   */
  async search(query, options = {}) {
    this.metrics.requests++;
    const startTime = Date.now();

    try {
      const cacheKey = this._getCacheKey('search', query, options);
      const cached = this.cache.get(cacheKey);
      if (cached) {
        this.metrics.cacheHits++;
        return { ...cached, cached: true };
      }
      this.metrics.cacheMisses++;

      let engine;
      
      // Online preferred for search, but offline has local KB
      if (this.engines.online && this.mode !== 'offline') {
        engine = this.engines.online;
      } else if (this.engines.offline) {
        engine = this.engines.offline;
      } else {
        throw new Error('No AI engine available for search');
      }

      const engineName = this._getEngineName(engine);
      const result = await engine.search(query, options);

      const responseTime = Date.now() - startTime;
      this._trackMetrics(engineName, responseTime);

      this.cache.set(cacheKey, result);

      return {
        ...result,
        engine: engineName,
        responseTime,
        cached: false
      };

    } catch (error) {
      if (config.aiEngines.fallback.enabled && this.engines.offline) {
        return await this.engines.offline.search(query, options);
      }
      throw error;
    }
  }

  /**
   * Select best engine for a given task
   */
  _selectEngine(task, options = {}) {
    const strategy = config.sync.strategy;

    // Force specific engine if requested
    if (options.preferEngine) {
      return this.engines[options.preferEngine];
    }

    // Offline mode - only use offline engines
    if (this.mode === 'offline') {
      return this.engines.gguf || this.engines.offline;
    }

    // Online mode - prefer online
    if (this.mode === 'online') {
      return this.engines.online || this.engines.offline;
    }

    // Hybrid mode - adaptive selection
    if (strategy === 'adaptive') {
      // For code tasks, prefer GGUF if available
      if (task === 'code-generation' && this.engines.gguf) {
        return this.engines.gguf;
      }

      // For tasks requiring latest info, prefer online
      if (task === 'web-search' && this.engines.online) {
        return this.engines.online;
      }

      // Default: try online first, fallback to offline
      return this.engines.online || this.engines.gguf || this.engines.offline;
    }

    // Offline-first strategy
    if (strategy === 'offline-first') {
      return this.engines.gguf || this.engines.offline || this.engines.online;
    }

    // Online-first strategy
    if (strategy === 'online-first') {
      return this.engines.online || this.engines.gguf || this.engines.offline;
    }

    // Default fallback
    return this.engines.offline;
  }

  /**
   * Try fallback engines if primary fails
   */
  async _tryFallback(task, prompt, options, originalError) {
    const fallbackOrder = config.aiEngines.fallback.order;
    const usedEngine = this._getEngineName(this._selectEngine(task, options));

    console.log(`⚠️  ${usedEngine} failed, trying fallback...`);

    for (const engineName of fallbackOrder) {
      if (engineName === usedEngine.toLowerCase()) continue;
      
      const engine = this.engines[engineName];
      if (!engine) continue;

      try {
        console.log(`   Trying ${engineName}...`);
        
        let result;
        if (task === 'text-generation') {
          result = await (engine.generateText || engine.generate).call(engine, prompt, options);
        } else if (task === 'code-generation') {
          result = await (engine.generateCode || engine.complete).call(engine, prompt, options.language || 'javascript', options);
        } else if (task === 'image-generation') {
          result = await engine.generateImage(prompt, options);
        }

        console.log(`   ✅ Fallback successful with ${engineName}`);
        return {
          ...result,
          engine: engineName,
          fallback: true,
          originalError: originalError.message
        };

      } catch (error) {
        console.log(`   ❌ ${engineName} also failed: ${error.message}`);
        continue;
      }
    }

    throw new Error(`All engines failed. Original error: ${originalError.message}`);
  }

  /**
   * Get engine name for tracking
   */
  _getEngineName(engine) {
    if (engine === this.engines.gguf) return 'GGUF';
    if (engine === this.engines.offline) return 'Offline';
    if (engine === this.engines.online) return 'Online';
    return 'Unknown';
  }

  /**
   * Track performance metrics
   */
  _trackMetrics(engineName, responseTime) {
    if (!this.metrics.engineUsage[engineName]) {
      this.metrics.engineUsage[engineName] = 0;
      this.metrics.averageResponseTime[engineName] = [];
    }
    
    this.metrics.engineUsage[engineName]++;
    this.metrics.averageResponseTime[engineName].push(responseTime);

    // Keep only last 100 response times for average
    if (this.metrics.averageResponseTime[engineName].length > 100) {
      this.metrics.averageResponseTime[engineName].shift();
    }
  }

  /**
   * Generate cache key
   */
  _getCacheKey(type, input, options) {
    const crypto = require('crypto');
    const data = JSON.stringify({ type, input, options });
    return crypto.createHash('md5').update(data).digest('hex');
  }

  /**
   * Get current statistics
   */
  getStats() {
    const avgTimes = {};
    for (const [engine, times] of Object.entries(this.metrics.averageResponseTime)) {
      avgTimes[engine] = times.length > 0 
        ? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
        : 0;
    }

    return {
      mode: this.mode,
      initialized: this.initialized,
      availableEngines: {
        gguf: !!this.engines.gguf,
        offline: !!this.engines.offline,
        online: !!this.engines.online
      },
      metrics: {
        totalRequests: this.metrics.requests,
        cacheHits: this.metrics.cacheHits,
        cacheMisses: this.metrics.cacheMisses,
        cacheHitRate: this.metrics.requests > 0 
          ? ((this.metrics.cacheHits / this.metrics.requests) * 100).toFixed(2) + '%'
          : '0%',
        engineUsage: this.metrics.engineUsage,
        averageResponseTime: avgTimes
      },
      cache: {
        size: this.cache.keys().length,
        maxSize: config.sync.cache.maxSize
      }
    };
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.flushAll();
    console.log('✅ Cache cleared');
  }

  /**
   * Set mode (offline, online, hybrid)
   */
  setMode(mode) {
    if (['offline', 'online', 'hybrid'].includes(mode)) {
      this.mode = mode;
      console.log(`✅ AI mode set to: ${mode}`);
      return true;
    }
    return false;
  }
}

module.exports = IntegratedAIEngine;
