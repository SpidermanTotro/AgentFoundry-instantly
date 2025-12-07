#!/usr/bin/env node
/**
 * GenSpark 2.0 Platform Unified Launcher
 * 
 * Starts all integrated applications in coordinated manner:
 * - ChatGPT 2.0 UNRESTRICTED (Main Hub)
 * - GenSpark 2.0 (Offline AI)
 * - GenSpark AI Developer
 * - All supporting services
 * 
 * Features:
 * - Automatic port management
 * - Health checking
 * - Graceful shutdown
 * - Process monitoring
 * - Integrated logging
 */

const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const config = require('./genspark-integration.config');

class GenSparkPlatform {
  constructor() {
    this.processes = new Map();
    this.healthChecks = new Map();
    this.startTime = Date.now();
    this.mode = process.env.AI_MODE || config.platform.mode;
    
    // Color codes for logging
    this.colors = {
      reset: '\x1b[0m',
      bright: '\x1b[1m',
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      magenta: '\x1b[35m',
      cyan: '\x1b[36m'
    };
  }

  log(message, color = 'reset') {
    const timestamp = new Date().toISOString();
    console.log(`${this.colors[color]}[${timestamp}] ${message}${this.colors.reset}`);
  }

  async checkPort(port) {
    return new Promise((resolve) => {
      const server = http.createServer();
      server.once('error', () => resolve(false));
      server.once('listening', () => {
        server.close();
        resolve(true);
      });
      server.listen(port);
    });
  }

  async waitForHealthy(port, path = '/api/health', maxAttempts = 30) {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const response = await fetch(`http://localhost:${port}${path}`);
        if (response.ok) {
          return true;
        }
      } catch (error) {
        // Service not ready yet
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    return false;
  }

  startProcess(name, command, args, options = {}) {
    const cwd = options.cwd || process.cwd();
    const env = { ...process.env, ...options.env };

    this.log(`Starting ${name}...`, 'cyan');
    
    const proc = spawn(command, args, {
      cwd,
      env,
      stdio: options.silent ? 'ignore' : ['ignore', 'pipe', 'pipe']
    });

    if (!options.silent) {
      proc.stdout.on('data', (data) => {
        const lines = data.toString().split('\n').filter(line => line.trim());
        lines.forEach(line => {
          this.log(`[${name}] ${line}`, options.color || 'reset');
        });
      });

      proc.stderr.on('data', (data) => {
        const lines = data.toString().split('\n').filter(line => line.trim());
        lines.forEach(line => {
          this.log(`[${name}] ${line}`, 'yellow');
        });
      });
    }

    proc.on('error', (error) => {
      this.log(`[${name}] Error: ${error.message}`, 'red');
    });

    proc.on('exit', (code) => {
      if (code !== 0 && code !== null) {
        this.log(`[${name}] Exited with code ${code}`, 'red');
      }
      this.processes.delete(name);
    });

    this.processes.set(name, proc);
    return proc;
  }

  async startMainServer() {
    this.log('═══════════════════════════════════════════════════════', 'bright');
    this.log('  GenSpark 2.0 Platform - Unified Launcher', 'bright');
    this.log('═══════════════════════════════════════════════════════', 'bright');
    this.log('', 'reset');
    this.log(`Mode: ${this.mode}`, 'green');
    this.log(`Main Port: ${config.ports.main}`, 'green');
    this.log('', 'reset');

    // Start main ChatGPT 2.0 UNRESTRICTED server
    const portAvailable = await this.checkPort(config.ports.main);
    if (!portAvailable) {
      this.log(`Port ${config.ports.main} is already in use. Checking if server is running...`, 'yellow');
      const isHealthy = await this.waitForHealthy(config.ports.main, '/api/health', 5);
      if (isHealthy) {
        this.log('Main server already running and healthy!', 'green');
        return true;
      }
      this.log('Port in use but server not responding. Please stop the process using this port.', 'red');
      return false;
    }

    this.startProcess(
      'ChatGPT 2.0 UNRESTRICTED',
      'node',
      ['server/index.js'],
      {
        env: {
          PORT: config.ports.main,
          NODE_ENV: process.env.NODE_ENV || 'development',
          DEV_MODE: config.features.devMode ? 'true' : 'false',
          AI_MODE: this.mode
        },
        color: 'blue'
      }
    );

    // Wait for main server to be healthy
    this.log('Waiting for main server to be ready...', 'cyan');
    const isHealthy = await this.waitForHealthy(config.ports.main);
    
    if (!isHealthy) {
      this.log('Main server failed to start within timeout', 'red');
      return false;
    }

    this.log('✅ Main server is ready!', 'green');
    return true;
  }

  async startFrontend() {
    this.log('Starting frontend development server...', 'cyan');
    
    this.startProcess(
      'Frontend (Vite)',
      'npm',
      ['run', 'dev'],
      {
        env: {
          VITE_API_URL: `http://localhost:${config.ports.main}`,
          VITE_WS_URL: `ws://localhost:${config.ports.main}`
        },
        color: 'magenta'
      }
    );

    // Give frontend time to start
    await new Promise(resolve => setTimeout(resolve, 3000));
    this.log('✅ Frontend server started!', 'green');
  }

  async startGenSpark2() {
    const gensparkPath = path.join(process.cwd(), 'genspark-2.0');
    
    if (!fs.existsSync(gensparkPath)) {
      this.log('GenSpark 2.0 directory not found, skipping...', 'yellow');
      return;
    }

    this.log('Starting GenSpark 2.0 Offline AI Platform...', 'cyan');
    
    const portAvailable = await this.checkPort(config.ports.genspark);
    if (!portAvailable) {
      this.log(`Port ${config.ports.genspark} already in use, skipping GenSpark 2.0...`, 'yellow');
      return;
    }

    this.startProcess(
      'GenSpark 2.0',
      'node',
      ['src/server.js'],
      {
        cwd: gensparkPath,
        env: {
          PORT: config.ports.genspark,
          NODE_ENV: process.env.NODE_ENV || 'development'
        },
        color: 'green'
      }
    );

    this.log('✅ GenSpark 2.0 started!', 'green');
  }

  async startAIDeveloper() {
    const aiDevPath = path.join(process.cwd(), 'genspark-ai-developer');
    
    if (!fs.existsSync(aiDevPath)) {
      this.log('GenSpark AI Developer directory not found, skipping...', 'yellow');
      return;
    }

    this.log('Starting GenSpark AI Developer...', 'cyan');
    
    const portAvailable = await this.checkPort(config.ports.aiDeveloper);
    if (!portAvailable) {
      this.log(`Port ${config.ports.aiDeveloper} already in use, skipping AI Developer...`, 'yellow');
      return;
    }

    this.startProcess(
      'AI Developer',
      'node',
      ['src/server.js'],
      {
        cwd: aiDevPath,
        env: {
          PORT: config.ports.aiDeveloper,
          NODE_ENV: process.env.NODE_ENV || 'development'
        },
        color: 'cyan'
      }
    );

    this.log('✅ AI Developer started!', 'green');
  }

  async displayStatus() {
    this.log('', 'reset');
    this.log('═══════════════════════════════════════════════════════', 'bright');
    this.log('  GenSpark 2.0 Platform - STATUS', 'bright');
    this.log('═══════════════════════════════════════════════════════', 'bright');
    this.log('', 'reset');
    this.log(`✅ Mode: ${this.mode}`, 'green');
    this.log('', 'reset');
    this.log('🌐 Running Services:', 'bright');
    this.log(`   • ChatGPT 2.0 UNRESTRICTED: http://localhost:${config.ports.main}`, 'blue');
    this.log(`   • Frontend (Vite): http://localhost:5173`, 'magenta');
    
    if (this.processes.has('GenSpark 2.0')) {
      this.log(`   • GenSpark 2.0: http://localhost:${config.ports.genspark}`, 'green');
    }
    
    if (this.processes.has('AI Developer')) {
      this.log(`   • AI Developer: http://localhost:${config.ports.aiDeveloper}`, 'cyan');
    }
    
    this.log('', 'reset');
    this.log('📡 API Endpoints:', 'bright');
    this.log(`   • Health: http://localhost:${config.ports.main}/api/health`, 'blue');
    this.log(`   • Chat: http://localhost:${config.ports.main}/api/chat`, 'blue');
    this.log(`   • Auth: http://localhost:${config.ports.main}/api/auth`, 'blue');
    this.log(`   • Vector DB: http://localhost:${config.ports.main}/api/vectordb`, 'blue');
    this.log('', 'reset');
    this.log('🎯 Features Available:', 'bright');
    this.log(`   • AI Mode: ${this.mode}`, 'green');
    this.log(`   • Authentication: ${config.features.authentication ? '✅' : '❌'}`, 'green');
    this.log(`   • Vector Database: ${config.features.vectorDatabase ? '✅' : '❌'}`, 'green');
    this.log(`   • WebSocket Streaming: ${config.features.websocketStreaming ? '✅' : '❌'}`, 'green');
    this.log(`   • Multi-modal AI: ${config.features.multiModal ? '✅' : '❌'}`, 'green');
    this.log(`   • Offline Capable: ${config.aiEngines.primary.offline.enabled ? '✅' : '❌'}`, 'green');
    this.log('', 'reset');
    this.log('Press Ctrl+C to stop all services', 'yellow');
    this.log('═══════════════════════════════════════════════════════', 'bright');
  }

  async start() {
    try {
      // Start main server
      const mainStarted = await this.startMainServer();
      if (!mainStarted) {
        this.log('Failed to start main server. Exiting...', 'red');
        process.exit(1);
      }

      // Start frontend
      await this.startFrontend();

      // Start additional services
      await this.startGenSpark2();
      await this.startAIDeveloper();

      // Display status
      await this.displayStatus();

      // Setup graceful shutdown
      this.setupShutdown();

    } catch (error) {
      this.log(`Error starting platform: ${error.message}`, 'red');
      console.error(error);
      process.exit(1);
    }
  }

  setupShutdown() {
    const shutdown = async (signal) => {
      this.log('', 'reset');
      this.log(`Received ${signal}, shutting down gracefully...`, 'yellow');
      
      // Stop all processes
      for (const [name, proc] of this.processes.entries()) {
        this.log(`Stopping ${name}...`, 'cyan');
        proc.kill('SIGTERM');
      }

      // Wait a bit for graceful shutdown
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Force kill any remaining processes
      for (const [name, proc] of this.processes.entries()) {
        proc.kill('SIGKILL');
      }

      this.log('All services stopped. Goodbye!', 'green');
      process.exit(0);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  }
}

// Start the platform
if (require.main === module) {
  const platform = new GenSparkPlatform();
  platform.start();
}

module.exports = GenSparkPlatform;
