/**
 * Unified API Routes
 * Exposes all features from ChatGPT 2.0, Kimi, and GenSpark in a unified interface
 */

const express = require('express');
const router = express.Router();

// This will be set by the server
let orchestrator = null;

// Middleware to ensure orchestrator is initialized
const ensureInitialized = (req, res, next) => {
  if (!orchestrator || !orchestrator.initialized) {
    return res.status(503).json({
      success: false,
      error: 'Unified AI Orchestrator not initialized'
    });
  }
  next();
};

/**
 * Set orchestrator instance (called from server)
 */
router.setOrchestrator = (orch) => {
  orchestrator = orch;
};

/**
 * Unified chat endpoint
 * Intelligently routes to best engine based on message content
 */
router.post('/chat', ensureInitialized, async (req, res) => {
  try {
    const { message, personality, options } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    const result = await orchestrator.unifiedChat(message, {
      personality: personality || 'assistant',
      ...options
    });

    res.json(result);

  } catch (error) {
    console.error('Unified chat error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Long context processing (Kimi specialty)
 */
router.post('/long-context', ensureInitialized, async (req, res) => {
  try {
    const { messages, options } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        error: 'Messages array is required'
      });
    }

    const result = await orchestrator.route({
      messages: messages
    }, {
      taskType: 'long_context',
      ...options
    });

    res.json(result);

  } catch (error) {
    console.error('Long context error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Document analysis (Kimi specialty)
 */
router.post('/analyze-document', ensureInitialized, async (req, res) => {
  try {
    const { filePath, options } = req.body;

    if (!filePath) {
      return res.status(400).json({
        success: false,
        error: 'File path is required'
      });
    }

    const result = await orchestrator.route({
      filePath: filePath
    }, {
      taskType: 'document_analysis',
      ...options
    });

    res.json(result);

  } catch (error) {
    console.error('Document analysis error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Mathematical computation (Kimi specialty)
 */
router.post('/compute-math', ensureInitialized, async (req, res) => {
  try {
    const { expression, options } = req.body;

    if (!expression) {
      return res.status(400).json({
        success: false,
        error: 'Mathematical expression is required'
      });
    }

    const result = await orchestrator.route({
      expression: expression
    }, {
      taskType: 'math_computation',
      ...options
    });

    res.json(result);

  } catch (error) {
    console.error('Math computation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Web search (Kimi specialty)
 */
router.post('/web-search', ensureInitialized, async (req, res) => {
  try {
    const { query, options } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const result = await orchestrator.route({
      query: query
    }, {
      taskType: 'web_search',
      ...options
    });

    res.json(result);

  } catch (error) {
    console.error('Web search error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GitHub operations (ChatGPT 2.0 specialty)
 */
router.post('/github', ensureInitialized, async (req, res) => {
  try {
    const { operation, params } = req.body;

    if (!operation) {
      return res.status(400).json({
        success: false,
        error: 'GitHub operation is required'
      });
    }

    const result = await orchestrator.route({
      operation: operation,
      params: params || {}
    }, {
      taskType: 'github_integration'
    });

    res.json(result);

  } catch (error) {
    console.error('GitHub operation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * File operations (ChatGPT 2.0 specialty)
 */
router.post('/file-operation', ensureInitialized, async (req, res) => {
  try {
    const { operation, path, content } = req.body;

    if (!operation || !path) {
      return res.status(400).json({
        success: false,
        error: 'Operation and path are required'
      });
    }

    const result = await orchestrator.route({
      operation: operation,
      path: path,
      content: content
    }, {
      taskType: 'file_operations'
    });

    res.json(result);

  } catch (error) {
    console.error('File operation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Image generation (GenSpark specialty)
 */
router.post('/generate-image', ensureInitialized, async (req, res) => {
  try {
    const { prompt, options } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Image prompt is required'
      });
    }

    const result = await orchestrator.route({
      prompt: prompt
    }, {
      taskType: 'image_generation',
      ...options
    });

    res.json(result);

  } catch (error) {
    console.error('Image generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Code execution (Kimi + ChatGPT 2.0)
 */
router.post('/execute-code', ensureInitialized, async (req, res) => {
  try {
    const { code, language, options } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Code is required'
      });
    }

    const result = await orchestrator.route({
      code: code,
      language: language || 'javascript'
    }, {
      taskType: 'code_execution',
      ...options
    });

    res.json(result);

  } catch (error) {
    console.error('Code execution error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Get all capabilities from all engines
 */
router.get('/capabilities', ensureInitialized, async (req, res) => {
  try {
    const capabilities = orchestrator.getAllCapabilities();
    res.json({
      success: true,
      capabilities: capabilities
    });
  } catch (error) {
    console.error('Get capabilities error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Get unified statistics
 */
router.get('/stats', ensureInitialized, async (req, res) => {
  try {
    const stats = orchestrator.getStats();
    res.json({
      success: true,
      stats: stats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Auto-route endpoint - automatically detects task type
 */
router.post('/auto', ensureInitialized, async (req, res) => {
  try {
    const { task, options } = req.body;

    if (!task) {
      return res.status(400).json({
        success: false,
        error: 'Task is required'
      });
    }

    const result = await orchestrator.route(task, {
      preferredEngine: 'auto',
      fallbackEnabled: true,
      ...options
    });

    res.json(result);

  } catch (error) {
    console.error('Auto-route error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Health check for unified system
 */
router.get('/health', (req, res) => {
  const health = {
    status: 'ok',
    orchestrator: orchestrator ? 'initialized' : 'not initialized',
    timestamp: new Date().toISOString()
  };

  if (orchestrator && orchestrator.initialized) {
    health.engines = {
      chatgpt: !!orchestrator.engines.chatgpt,
      kimi: !!orchestrator.engines.kimi,
      genspark: !!orchestrator.engines.genspark,
      local: !!orchestrator.engines.local
    };
  }

  res.json(health);
});

module.exports = router;
