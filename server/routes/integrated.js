/**
 * Unified API Routes for GenSpark 2.0
 * 
 * Provides REST API endpoints for all integrated features from:
 * - Forge Spark MVP
 * - GenSpark 2.0
 * - AgentFoundry-instantly
 */

const express = require('express');
const router = express.Router();
const unifiedIntegration = require('../integrations/UnifiedIntegrationManager');

// ==================== CODE INTELLIGENCE ROUTES ====================

/**
 * POST /api/integrated/code/complete
 * Get AI code completion
 */
router.post('/code/complete', async (req, res) => {
  try {
    const { code, language = 'python', options = {} } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    const result = await unifiedIntegration.getCodeCompletion(code, language, options);
    res.json(result);
  } catch (error) {
    console.error('Code completion error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/integrated/code/analyze
 * Analyze code quality and complexity
 */
router.post('/code/analyze', async (req, res) => {
  try {
    const { code, language = 'python' } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    const result = await unifiedIntegration.analyzeCode(code, language);
    res.json(result);
  } catch (error) {
    console.error('Code analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/integrated/code/refactor
 * Refactor code with AI
 */
router.post('/code/refactor', async (req, res) => {
  try {
    const { code, language = 'python', refactoringType = 'optimize' } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    const result = await unifiedIntegration.refactorCode(code, language, refactoringType);
    res.json(result);
  } catch (error) {
    console.error('Code refactoring error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== WORKSPACE SUITE ROUTES ====================

/**
 * POST /api/integrated/workspace/slides
 * Create AI-powered presentation slides
 */
router.post('/workspace/slides', async (req, res) => {
  try {
    const { topic, slidesCount = 10, theme = 'professional' } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const result = await unifiedIntegration.createSlides(topic, slidesCount, theme);
    res.json(result);
  } catch (error) {
    console.error('Slides creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/integrated/workspace/document
 * Create AI document
 */
router.post('/workspace/document', async (req, res) => {
  try {
    const { title, content, format = 'markdown' } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const result = await unifiedIntegration.createDocument(title, content, format);
    res.json(result);
  } catch (error) {
    console.error('Document creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/integrated/workspace/sheet
 * Create AI spreadsheet
 */
router.post('/workspace/sheet', async (req, res) => {
  try {
    const { name, rows = 100, cols = 10 } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const result = await unifiedIntegration.createSheet(name, rows, cols);
    res.json(result);
  } catch (error) {
    console.error('Sheet creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== MEDIA GENERATION ROUTES ====================

/**
 * POST /api/integrated/media/image
 * Generate image with AI
 */
router.post('/media/image', async (req, res) => {
  try {
    const { prompt, options = {} } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const result = await unifiedIntegration.generateImage(prompt, options);
    res.json(result);
  } catch (error) {
    console.error('Image generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/integrated/media/video
 * Generate video with AI
 */
router.post('/media/video', async (req, res) => {
  try {
    const { prompt, options = {} } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const result = await unifiedIntegration.generateVideo(prompt, options);
    res.json(result);
  } catch (error) {
    console.error('Video generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/integrated/media/audio
 * Generate audio with AI
 */
router.post('/media/audio', async (req, res) => {
  try {
    const { text, options = {} } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const result = await unifiedIntegration.generateAudio(text, options);
    res.json(result);
  } catch (error) {
    console.error('Audio generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/integrated/media/gif
 * Create GIF animation
 */
router.post('/media/gif', async (req, res) => {
  try {
    const { images, options = {} } = req.body;
    
    if (!images || !Array.isArray(images)) {
      return res.status(400).json({ error: 'Images array is required' });
    }

    const result = await unifiedIntegration.createGif(images, options);
    res.json(result);
  } catch (error) {
    console.error('GIF creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== ADVANCED TOOLS ROUTES ====================

/**
 * POST /api/integrated/tools/extract-mpq
 * Extract game assets (MPQ format)
 */
router.post('/tools/extract-mpq', async (req, res) => {
  try {
    const { filePath, outputDir } = req.body;
    
    if (!filePath || !outputDir) {
      return res.status(400).json({ error: 'File path and output directory are required' });
    }

    const result = await unifiedIntegration.extractMPQ(filePath, outputDir);
    res.json(result);
  } catch (error) {
    console.error('MPQ extraction error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/integrated/tools/extract-casc
 * Extract game assets (CASC format)
 */
router.post('/tools/extract-casc', async (req, res) => {
  try {
    const { filePath, outputDir } = req.body;
    
    if (!filePath || !outputDir) {
      return res.status(400).json({ error: 'File path and output directory are required' });
    }

    const result = await unifiedIntegration.extractCASC(filePath, outputDir);
    res.json(result);
  } catch (error) {
    console.error('CASC extraction error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/integrated/tools/upscale-texture
 * Upscale game textures with AI
 */
router.post('/tools/upscale-texture', async (req, res) => {
  try {
    const { inputPath, outputPath, scale = 2 } = req.body;
    
    if (!inputPath || !outputPath) {
      return res.status(400).json({ error: 'Input and output paths are required' });
    }

    const result = await unifiedIntegration.upscaleTexture(inputPath, outputPath, scale);
    res.json(result);
  } catch (error) {
    console.error('Texture upscaling error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/integrated/tools/convert-model
 * Convert game models
 */
router.post('/tools/convert-model', async (req, res) => {
  try {
    const { inputPath, outputPath, format = 'obj' } = req.body;
    
    if (!inputPath || !outputPath) {
      return res.status(400).json({ error: 'Input and output paths are required' });
    }

    const result = await unifiedIntegration.convertModel(inputPath, outputPath, format);
    res.json(result);
  } catch (error) {
    console.error('Model conversion error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/integrated/tools/disassemble
 * Disassemble binary (x86/x64)
 */
router.post('/tools/disassemble', async (req, res) => {
  try {
    const { binaryPath, architecture = 'x86_64' } = req.body;
    
    if (!binaryPath) {
      return res.status(400).json({ error: 'Binary path is required' });
    }

    const result = await unifiedIntegration.disassembleX86(binaryPath, architecture);
    res.json(result);
  } catch (error) {
    console.error('Disassembly error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== AI TEXT GENERATION ROUTE ====================

/**
 * POST /api/integrated/ai/generate
 * Generate text with AI (supports offline GGUF models)
 */
router.post('/ai/generate', async (req, res) => {
  try {
    const { prompt, options = {} } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const result = await unifiedIntegration.generateText(prompt, options);
    res.json(result);
  } catch (error) {
    console.error('Text generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== STATUS & INFO ROUTES ====================

/**
 * GET /api/integrated/status
 * Get integration status
 */
router.get('/status', (req, res) => {
  try {
    const status = unifiedIntegration.getStatus();
    res.json(status);
  } catch (error) {
    console.error('Status error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/integrated/capabilities
 * Get feature capabilities
 */
router.get('/capabilities', (req, res) => {
  try {
    const capabilities = unifiedIntegration.getCapabilities();
    res.json(capabilities);
  } catch (error) {
    console.error('Capabilities error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/integrated/
 * Get comprehensive API information and available endpoints
 */
router.get('/', (req, res) => {
  res.json({
    name: 'GenSpark 2.0 Unified Integration API',
    version: '2.0.0',
    description: 'Unified API combining Forge Spark MVP, GenSpark 2.0, and AgentFoundry-instantly features',
    endpoints: {
      codeIntelligence: [
        'POST /api/integrated/code/complete',
        'POST /api/integrated/code/analyze',
        'POST /api/integrated/code/refactor'
      ],
      workspaceSuite: [
        'POST /api/integrated/workspace/slides',
        'POST /api/integrated/workspace/document',
        'POST /api/integrated/workspace/sheet'
      ],
      mediaGeneration: [
        'POST /api/integrated/media/image',
        'POST /api/integrated/media/video',
        'POST /api/integrated/media/audio',
        'POST /api/integrated/media/gif'
      ],
      advancedTools: [
        'POST /api/integrated/tools/extract-mpq',
        'POST /api/integrated/tools/extract-casc',
        'POST /api/integrated/tools/upscale-texture',
        'POST /api/integrated/tools/convert-model',
        'POST /api/integrated/tools/disassemble'
      ],
      ai: [
        'POST /api/integrated/ai/generate'
      ],
      info: [
        'GET /api/integrated/status',
        'GET /api/integrated/capabilities'
      ]
    }
  });
});

module.exports = router;
