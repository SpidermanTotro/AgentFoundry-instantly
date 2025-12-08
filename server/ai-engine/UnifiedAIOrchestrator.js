/**
 * Unified AI Orchestrator
 * 
 * Coordinates and unifies features from:
 * - ChatGPT 2.0 (unrestricted chat, GitHub, file ops)
 * - Kimi AI (long context, document analysis, math)
 * - GenSpark (multi-modal, workspace, offline AI)
 * 
 * Provides intelligent routing and capability detection
 */

const ChatGPT2_Unrestricted = require('./ChatGPT2_Unrestricted');
const KimiAI = require('./KimiAI');
const GenSparkAI = require('./GenSparkAI');
const LocalAIEngine = require('./LocalAIEngine');

class UnifiedAIOrchestrator {
  constructor() {
    this.engines = {
      chatgpt: null,
      kimi: null,
      genspark: null,
      local: null
    };
    this.initialized = false;
    this.capabilityMap = new Map();
    this.routingRules = new Map();
  }

  async initialize(config = {}) {
    console.log('\n🚀 Initializing Unified AI Orchestrator...\n');

    try {
      // Initialize ChatGPT 2.0
      this.engines.chatgpt = new ChatGPT2_Unrestricted();
      await this.engines.chatgpt.initialize({
        githubToken: config.githubToken,
        aiProviders: config.aiProviders
      });
      console.log('✅ ChatGPT 2.0 UNRESTRICTED loaded');

      // Initialize Kimi AI
      this.engines.kimi = new KimiAI();
      await this.engines.kimi.initialize(config);
      console.log('✅ Kimi AI loaded');

      // Initialize GenSpark AI
      this.engines.genspark = new GenSparkAI();
      await this.engines.genspark.initialize({
        googleApiKey: config.googleApiKey,
        anthropicApiKey: config.anthropicApiKey,
        cohereApiKey: config.cohereApiKey
      });
      console.log('✅ GenSpark AI loaded');

      // Initialize Local AI Engine
      this.engines.local = new LocalAIEngine();
      await this.engines.local.initialize(config);
      console.log('✅ Local AI Engine loaded');

      // Setup capability routing
      this.setupCapabilityRouting();

      this.initialized = true;
      console.log('\n✨ Unified AI Orchestrator ready!\n');
      this.printCapabilities();

    } catch (error) {
      console.error('Orchestrator initialization error:', error);
      this.initialized = true; // Continue with partial initialization
    }
  }

  /**
   * Setup intelligent capability routing
   */
  setupCapabilityRouting() {
    // ChatGPT 2.0 strengths
    this.capabilityMap.set('unrestricted_chat', 'chatgpt');
    this.capabilityMap.set('github_integration', 'chatgpt');
    this.capabilityMap.set('file_operations', 'chatgpt');
    this.capabilityMap.set('code_execution', 'chatgpt');
    this.capabilityMap.set('persistent_memory', 'chatgpt');

    // Kimi AI strengths
    this.capabilityMap.set('long_context', 'kimi');
    this.capabilityMap.set('document_analysis', 'kimi');
    this.capabilityMap.set('math_computation', 'kimi');
    this.capabilityMap.set('web_search', 'kimi');
    this.capabilityMap.set('code_interpreter', 'kimi');

    // GenSpark strengths
    this.capabilityMap.set('multi_modal', 'genspark');
    this.capabilityMap.set('image_generation', 'genspark');
    this.capabilityMap.set('video_generation', 'genspark');
    this.capabilityMap.set('audio_generation', 'genspark');
    this.capabilityMap.set('online_ai', 'genspark');

    // Local AI strengths
    this.capabilityMap.set('offline_mode', 'local');
    this.capabilityMap.set('code_intelligence', 'local');
    this.capabilityMap.set('ast_analysis', 'local');
    this.capabilityMap.set('privacy_mode', 'local');
  }

  /**
   * Intelligent request routing based on task type
   */
  async route(task, options = {}) {
    if (!this.initialized) {
      throw new Error('Orchestrator not initialized');
    }

    const { 
      taskType, 
      preferredEngine = 'auto',
      fallbackEnabled = true 
    } = options;

    // Auto-detect task type if not specified
    const detectedType = taskType || this.detectTaskType(task);
    
    // Get best engine for this task
    const engineName = preferredEngine === 'auto' 
      ? this.capabilityMap.get(detectedType) || 'chatgpt'
      : preferredEngine;

    console.log(`🎯 Routing ${detectedType} → ${engineName}`);

    try {
      // Route to appropriate engine
      const engine = this.engines[engineName];
      if (!engine) {
        throw new Error(`Engine ${engineName} not available`);
      }

      return await this.executeTask(engine, engineName, task, detectedType, options);

    } catch (error) {
      if (fallbackEnabled) {
        console.warn(`⚠️  ${engineName} failed, falling back...`);
        return await this.fallbackExecution(task, engineName, options);
      }
      throw error;
    }
  }

  /**
   * Detect task type from request
   */
  detectTaskType(task) {
    const taskStr = JSON.stringify(task).toLowerCase();

    // Document analysis patterns
    if (taskStr.includes('.pdf') || taskStr.includes('.docx') || taskStr.includes('document')) {
      return 'document_analysis';
    }

    // Long context patterns
    if (task.messages && task.messages.length > 20) {
      return 'long_context';
    }

    // Math patterns
    if (taskStr.includes('calculate') || taskStr.includes('math') || /\d+[\+\-\*\/]\d+/.test(taskStr)) {
      return 'math_computation';
    }

    // GitHub patterns
    if (taskStr.includes('github') || taskStr.includes('repository') || taskStr.includes('pull request')) {
      return 'github_integration';
    }

    // Image generation patterns
    if (taskStr.includes('image') || taskStr.includes('generate picture') || taskStr.includes('create art')) {
      return 'image_generation';
    }

    // Video generation patterns
    if (taskStr.includes('video') || taskStr.includes('animation')) {
      return 'video_generation';
    }

    // Web search patterns
    if (taskStr.includes('search') || taskStr.includes('find information') || taskStr.includes('look up')) {
      return 'web_search';
    }

    // File operations patterns
    if (taskStr.includes('read file') || taskStr.includes('write file') || taskStr.includes('file system')) {
      return 'file_operations';
    }

    // Default to unrestricted chat
    return 'unrestricted_chat';
  }

  /**
   * Execute task on specific engine
   */
  async executeTask(engine, engineName, task, taskType, options) {
    const startTime = Date.now();

    let result;
    
    switch (taskType) {
      case 'unrestricted_chat':
        result = await this.handleChat(engine, task, options);
        break;
      
      case 'long_context':
        result = await this.handleLongContext(engine, task, options);
        break;
      
      case 'document_analysis':
        result = await this.handleDocumentAnalysis(engine, task, options);
        break;
      
      case 'math_computation':
        result = await this.handleMathComputation(engine, task, options);
        break;
      
      case 'github_integration':
        result = await this.handleGitHub(engine, task, options);
        break;
      
      case 'web_search':
        result = await this.handleWebSearch(engine, task, options);
        break;
      
      case 'file_operations':
        result = await this.handleFileOps(engine, task, options);
        break;
      
      case 'image_generation':
        result = await this.handleImageGeneration(engine, task, options);
        break;

      case 'code_execution':
        result = await this.handleCodeExecution(engine, task, options);
        break;
      
      default:
        result = await this.handleGeneric(engine, task, options);
    }

    const executionTime = Date.now() - startTime;

    return {
      ...result,
      metadata: {
        ...result.metadata,
        engine: engineName,
        taskType: taskType,
        executionTime: executionTime,
        orchestrated: true
      }
    };
  }

  /**
   * Task handlers for different capabilities
   */
  
  async handleChat(engine, task, options) {
    if (engine.chat) {
      return await engine.chat(task.message, task.personality, options);
    }
    throw new Error('Chat capability not available on this engine');
  }

  async handleLongContext(engine, task, options) {
    if (engine.processLongContext) {
      return await engine.processLongContext(task.messages, options);
    }
    throw new Error('Long context capability not available on this engine');
  }

  async handleDocumentAnalysis(engine, task, options) {
    if (engine.analyzeDocument) {
      return await engine.analyzeDocument(task.filePath, options);
    }
    throw new Error('Document analysis capability not available on this engine');
  }

  async handleMathComputation(engine, task, options) {
    if (engine.computeMath) {
      return await engine.computeMath(task.expression, options);
    }
    throw new Error('Math computation capability not available on this engine');
  }

  async handleGitHub(engine, task, options) {
    if (engine.githubOperation) {
      return await engine.githubOperation(task.operation, task.params);
    }
    throw new Error('GitHub integration not available on this engine');
  }

  async handleWebSearch(engine, task, options) {
    if (engine.webSearch) {
      return await engine.webSearch(task.query, options);
    } else if (engine.searchRealtime) {
      return await engine.searchRealtime(task.query);
    }
    throw new Error('Web search capability not available on this engine');
  }

  async handleFileOps(engine, task, options) {
    if (engine.readFile && task.operation === 'read') {
      return await engine.readFile(task.path);
    } else if (engine.writeFile && task.operation === 'write') {
      return await engine.writeFile(task.path, task.content);
    }
    throw new Error('File operations not available on this engine');
  }

  async handleImageGeneration(engine, task, options) {
    if (engine.generateImage) {
      return await engine.generateImage(task.prompt, options);
    }
    throw new Error('Image generation not available on this engine');
  }

  async handleCodeExecution(engine, task, options) {
    if (engine.executeCode) {
      return await engine.executeCode(task.code, task.language);
    } else if (engine.interpretCode) {
      return await engine.interpretCode(task.code, task.language, options);
    }
    throw new Error('Code execution not available on this engine');
  }

  async handleGeneric(engine, task, options) {
    // Try to find any compatible method
    if (engine.process) {
      return await engine.process(task, options);
    }
    throw new Error('No compatible handler found');
  }

  /**
   * Fallback execution when primary engine fails
   */
  async fallbackExecution(task, failedEngine, options) {
    const taskType = this.detectTaskType(task);
    
    // Try engines in fallback order
    const fallbackOrder = ['chatgpt', 'kimi', 'genspark', 'local'];
    
    for (const engineName of fallbackOrder) {
      if (engineName === failedEngine) continue;
      
      const engine = this.engines[engineName];
      if (!engine) continue;

      try {
        console.log(`🔄 Trying fallback: ${engineName}`);
        return await this.executeTask(engine, engineName, task, taskType, { 
          ...options, 
          fallbackEnabled: false 
        });
      } catch (error) {
        console.warn(`⚠️  ${engineName} also failed:`, error.message);
      }
    }

    throw new Error('All engines failed to process the task');
  }

  /**
   * Unified chat interface combining all engines
   */
  async unifiedChat(message, options = {}) {
    const {
      personality = 'assistant',
      useKimiContext = false,
      useChatGPTMemory = true,
      useGenSparkMultiModal = false
    } = options;

    // Build unified context
    const context = {
      message: message,
      personality: personality,
      engines: {
        chatgpt: useChatGPTMemory,
        kimi: useKimiContext,
        genspark: useGenSparkMultiModal
      }
    };

    // Route based on message characteristics
    return await this.route({
      message: message,
      personality: personality
    }, {
      taskType: 'unrestricted_chat',
      ...options
    });
  }

  /**
   * Get all available capabilities
   */
  getAllCapabilities() {
    const capabilities = {
      orchestrator: {
        version: '1.0.0',
        unifiedEngines: Object.keys(this.engines).length,
        initialized: this.initialized
      },
      engines: {}
    };

    // Collect capabilities from each engine
    if (this.engines.chatgpt && this.engines.chatgpt.getCapabilities) {
      capabilities.engines.chatgpt = this.engines.chatgpt.getCapabilities();
    }

    if (this.engines.kimi && this.engines.kimi.getCapabilities) {
      capabilities.engines.kimi = this.engines.kimi.getCapabilities();
    }

    if (this.engines.genspark) {
      capabilities.engines.genspark = {
        provider: 'GenSpark AI',
        mode: this.engines.genspark.mode,
        providers: this.engines.genspark.providers.size
      };
    }

    if (this.engines.local) {
      capabilities.engines.local = {
        provider: 'Local AI Engine',
        offlineMode: true
      };
    }

    return capabilities;
  }

  /**
   * Get unified statistics
   */
  getStats() {
    const stats = {
      orchestrator: {
        totalEngines: Object.keys(this.engines).length,
        activeEngines: Object.values(this.engines).filter(e => e).length,
        capabilities: this.capabilityMap.size
      },
      engines: {}
    };

    // Collect stats from each engine
    if (this.engines.chatgpt && this.engines.chatgpt.getStats) {
      stats.engines.chatgpt = this.engines.chatgpt.getStats();
    }

    if (this.engines.kimi && this.engines.kimi.getStats) {
      stats.engines.kimi = this.engines.kimi.getStats();
    }

    return stats;
  }

  /**
   * Print available capabilities
   */
  printCapabilities() {
    console.log('\n📋 Available Capabilities:\n');
    
    console.log('🤖 ChatGPT 2.0 UNRESTRICTED:');
    console.log('  ✅ Unrestricted chat (no filters)');
    console.log('  ✅ GitHub integration (repos, PRs, issues)');
    console.log('  ✅ File system access (read/write)');
    console.log('  ✅ Code execution');
    console.log('  ✅ Persistent memory\n');

    console.log('🧠 Kimi AI:');
    console.log('  ✅ Ultra-long context (200K tokens)');
    console.log('  ✅ Document analysis (PDF, DOCX, Excel)');
    console.log('  ✅ Mathematical computation');
    console.log('  ✅ Advanced web search');
    console.log('  ✅ Code interpreter\n');

    console.log('✨ GenSpark AI:');
    console.log('  ✅ Multi-modal AI (text, images, audio)');
    console.log('  ✅ Image generation');
    console.log('  ✅ Video generation');
    console.log('  ✅ Audio generation');
    console.log('  ✅ Online AI providers\n');

    console.log('🔒 Local AI Engine:');
    console.log('  ✅ 100% offline mode');
    console.log('  ✅ Code intelligence');
    console.log('  ✅ AST analysis');
    console.log('  ✅ Privacy-first processing\n');

    console.log('🎯 Intelligent Routing: AUTO-ENABLED\n');
  }
}

module.exports = UnifiedAIOrchestrator;
