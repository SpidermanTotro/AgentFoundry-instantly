/**
 * GenSpark 2.0 Platform - Complete Integration Configuration
 * 
 * This file orchestrates all components of the GenSpark platform:
 * - Web applications (ChatGPT 2.0, GenSpark 2.0, AI Developer)
 * - AI engines (Online, Offline, Hybrid, GGUF models)
 * - Cross-platform builds (Linux, Windows, macOS)
 * - Offline-Online synchronization
 */

module.exports = {
  // Platform Information
  platform: {
    name: 'GenSpark 2.0',
    version: '2.0.0',
    description: 'Complete AI Platform with Full Feature Integration',
    mode: process.env.AI_MODE || 'hybrid' // 'offline', 'online', 'hybrid'
  },

  // Application Ports Configuration
  ports: {
    main: process.env.PORT || 3001,           // Main ChatGPT 2.0 UNRESTRICTED
    genspark: 3002,                            // GenSpark 2.0 Offline AI
    aiDeveloper: 3003,                         // GenSpark AI Developer
    github: 3004,                              // GitHub 2.0 Integration
    forgeSpark: 3005                           // Forge Spark MVP
  },

  // AI Engine Configuration
  aiEngines: {
    // Primary engines
    primary: {
      offline: {
        enabled: true,
        engine: 'OfflineGenSparkAI',
        features: [
          'text-generation',
          'code-generation',
          'image-analysis',
          'document-processing',
          'web-search-local',
          'nlp-processing'
        ]
      },
      online: {
        enabled: true,
        engine: 'CompleteGenSparkAI',
        providers: ['google', 'anthropic', 'openai', 'cohere'],
        features: [
          'text-generation',
          'code-generation',
          'image-generation',
          'image-analysis',
          'video-generation',
          'audio-generation',
          'music-generation',
          'web-search',
          'web-crawling'
        ]
      }
    },

    // GGUF Model Support
    gguf: {
      enabled: true,
      engine: 'GGUFEngine',
      modelsPath: './models',
      binPath: './bin/llama.cpp',
      availableModels: [
        'llama2-7b',
        'mistral-7b',
        'codellama-7b',
        'phi-2',
        'tinyllama'
      ],
      defaultModel: 'tinyllama', // Smallest, fastest for quick testing
      features: [
        'text-generation',
        'code-completion',
        'chat',
        'code-explanation',
        'bug-fixing'
      ]
    },

    // Fallback strategy
    fallback: {
      enabled: true,
      order: ['gguf', 'offline', 'online'],
      autoSwitch: true
    }
  },

  // Web Applications Integration
  applications: {
    chatgpt2: {
      name: 'ChatGPT 2.0 UNRESTRICTED',
      path: './',
      port: 3001,
      features: [
        'unrestricted-chat',
        'multi-modal-ai',
        'file-system-access',
        'code-execution',
        'web-browsing',
        'authentication',
        'vector-db-rag',
        'websocket-streaming'
      ],
      routes: {
        api: '/api',
        chat: '/api/chat',
        health: '/api/health',
        auth: '/api/auth',
        vectordb: '/api/vectordb'
      }
    },

    genspark2: {
      name: 'GenSpark 2.0',
      path: './genspark-2.0',
      port: 3002,
      features: [
        'offline-ai',
        'gguf-models',
        'workspace-management',
        'media-generation',
        'gif-creation',
        'document-processing',
        'code-intelligence'
      ],
      routes: {
        api: '/api',
        workspace: '/api/workspace',
        media: '/api/media',
        ai: '/api/ai'
      }
    },

    aiDeveloper: {
      name: 'GenSpark AI Developer',
      path: './genspark-ai-developer',
      port: 3003,
      features: [
        'live-streaming',
        'real-file-generation',
        'code-completion',
        'project-scaffolding',
        'offline-capable'
      ],
      routes: {
        api: '/api',
        stream: '/api/stream',
        files: '/api/files'
      }
    },

    github2: {
      name: 'GitHub 2.0',
      path: './github-2.0',
      port: 3004,
      features: [
        'repository-management',
        'issue-tracking',
        'pr-management',
        'code-review',
        'ai-integration'
      ]
    },

    forgeSpark: {
      name: 'Forge Spark MVP',
      path: './forge-spark-mvp',
      port: 3005,
      features: [
        'game-reverse-engineering',
        'binary-analysis',
        'disassembly',
        'memory-analysis'
      ]
    }
  },

  // Cross-Platform Build Configuration
  builds: {
    desktop: {
      enabled: true,
      platforms: ['linux', 'windows', 'macos'],
      electron: {
        version: '39.2.5',
        builder: {
          appId: 'com.genspark.v2',
          productName: 'GenSpark 2.0',
          directories: {
            output: 'dist-electron',
            buildResources: 'public'
          }
        }
      },
      linux: {
        targets: ['AppImage', 'deb', 'rpm'],
        category: 'Development',
        maintainer: 'GenSpark Team',
        icon: 'public/icon.png'
      },
      windows: {
        targets: ['nsis', 'portable', 'zip'],
        icon: 'public/icon.ico'
      },
      macos: {
        targets: ['dmg', 'zip'],
        icon: 'public/icon.icns',
        category: 'public.app-category.developer-tools'
      }
    },

    web: {
      enabled: true,
      bundler: 'vite',
      outputDir: 'dist',
      optimization: {
        minify: true,
        sourcemap: true,
        codesplitting: true
      }
    },

    docker: {
      enabled: true,
      images: [
        {
          name: 'genspark-all-in-one',
          file: 'Dockerfile',
          compose: 'docker-compose.yml'
        }
      ]
    }
  },

  // Offline-Online Synchronization
  sync: {
    enabled: true,
    strategy: 'adaptive', // 'offline-first', 'online-first', 'adaptive'
    
    offlineFirst: {
      // Try offline methods first, fallback to online
      priority: ['gguf', 'offline-engine', 'cache', 'online']
    },

    onlineFirst: {
      // Try online methods first, fallback to offline
      priority: ['online', 'cache', 'gguf', 'offline-engine']
    },

    adaptive: {
      // Automatically choose based on network and requirements
      networkCheck: true,
      switchThreshold: 5000, // ms - if online takes longer, switch to offline
      cacheStrategy: 'smart', // 'aggressive', 'conservative', 'smart'
    },

    cache: {
      enabled: true,
      maxSize: 1000, // entries
      ttl: 3600000, // 1 hour in ms
      storage: 'memory' // 'memory', 'disk', 'hybrid'
    }
  },

  // Feature Flags
  features: {
    // Core features
    authentication: true,
    vectorDatabase: true,
    websocketStreaming: true,
    
    // AI features
    textGeneration: true,
    codeGeneration: true,
    imageGeneration: true,
    imageAnalysis: true,
    videoGeneration: true,
    audioGeneration: true,
    musicGeneration: true,
    
    // Integration features
    webSearch: true,
    webCrawling: true,
    fileSystem: true,
    codeExecution: true,
    
    // Advanced features
    rag: true,
    multiModal: true,
    conversationManagement: true,
    workspaceManagement: true,
    
    // Development features
    devMode: process.env.DEV_MODE === 'true',
    debugLogging: process.env.NODE_ENV === 'development',
    performanceMetrics: true
  },

  // API Integration Points
  apiIntegration: {
    // Internal APIs (between applications)
    internal: {
      crossAppCommunication: true,
      sharedAuth: true,
      sharedCache: true,
      eventBus: true
    },

    // External APIs
    external: {
      rateLimit: {
        enabled: true,
        maxRequests: 100,
        windowMs: 60000 // 1 minute
      },
      retry: {
        enabled: true,
        maxRetries: 3,
        backoff: 'exponential'
      }
    }
  },

  // Performance Configuration
  performance: {
    // Response time targets (ms)
    targets: {
      textGeneration: 2000,
      codeGeneration: 1500,
      imageGeneration: 5000,
      webSearch: 1000,
      documentProcessing: 1000
    },

    // Resource limits
    limits: {
      maxConcurrentRequests: 10,
      maxMemoryUsage: '2GB',
      maxCacheSize: '500MB'
    },

    // Optimization
    optimization: {
      lazyLoading: true,
      codesplitting: true,
      compression: true,
      caching: true
    }
  },

  // Monitoring and Logging
  monitoring: {
    enabled: true,
    logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    metrics: {
      performance: true,
      errors: true,
      usage: true
    },
    healthChecks: {
      enabled: true,
      interval: 30000, // 30 seconds
      endpoints: [
        '/api/health',
        '/api/stats'
      ]
    }
  },

  // Security Configuration
  security: {
    cors: {
      enabled: true,
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true
    },
    rateLimit: {
      enabled: true,
      maxRequests: 100,
      windowMs: 60000
    },
    apiKeys: {
      enabled: true,
      required: false // Optional for local development
    },
    encryption: {
      enabled: false, // Enable for production
      algorithm: 'aes-256-gcm'
    }
  },

  // Development Configuration
  development: {
    hotReload: true,
    sourceMaps: true,
    verboseLogging: true,
    mockData: false,
    skipAuth: true
  },

  // Production Configuration
  production: {
    minify: true,
    compression: true,
    caching: 'aggressive',
    logging: 'errors-only',
    monitoring: 'full'
  }
};
