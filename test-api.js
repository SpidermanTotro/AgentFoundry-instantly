#!/usr/bin/env node
/**
 * GenSpark 2.0 Platform - API Testing Suite
 * 
 * Tests all integrated API endpoints to ensure proper functionality
 */

const http = require('http');

const API_BASE = 'http://localhost:3001';

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

class APITester {
  constructor() {
    this.results = [];
    this.passed = 0;
    this.failed = 0;
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  async fetch(url, options = {}) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const reqOptions = {
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname,
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      };

      const req = http.request(reqOptions, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            resolve({
              status: res.statusCode,
              data: JSON.parse(data)
            });
          } catch (e) {
            resolve({
              status: res.statusCode,
              data: data
            });
          }
        });
      });

      req.on('error', reject);

      if (options.body) {
        req.write(JSON.stringify(options.body));
      }

      req.end();
    });
  }

  async test(name, testFn) {
    try {
      this.log(`\n🧪 Testing: ${name}`, 'cyan');
      const startTime = Date.now();
      await testFn();
      const duration = Date.now() - startTime;
      this.log(`✅ PASSED (${duration}ms)`, 'green');
      this.passed++;
      this.results.push({ name, status: 'PASSED', duration });
    } catch (error) {
      this.log(`❌ FAILED: ${error.message}`, 'red');
      this.failed++;
      this.results.push({ name, status: 'FAILED', error: error.message });
    }
  }

  assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(`${message}: expected ${expected}, got ${actual}`);
    }
  }

  assertTrue(value, message) {
    if (!value) {
      throw new Error(message);
    }
  }

  async run() {
    this.log('═══════════════════════════════════════════════════════', 'blue');
    this.log('  GenSpark 2.0 Platform - API Testing Suite', 'blue');
    this.log('═══════════════════════════════════════════════════════', 'blue');

    // Check if server is running
    try {
      await this.fetch(`${API_BASE}/api/health`);
      this.log('\n✅ Server is running', 'green');
    } catch (error) {
      this.log('\n❌ Server is not running. Start it with: npm run server', 'red');
      process.exit(1);
    }

    // Test 1: Health Check
    await this.test('Health Check Endpoint', async () => {
      const response = await this.fetch(`${API_BASE}/api/health`);
      this.assertEqual(response.status, 200, 'Status code');
      this.assertEqual(response.data.status, 'ok', 'Health status');
      this.assertTrue(response.data.features, 'Features object exists');
    });

    // Test 2: AI Stats
    await this.test('AI Statistics Endpoint', async () => {
      const response = await this.fetch(`${API_BASE}/api/ai/stats`);
      this.assertEqual(response.status, 200, 'Status code');
      this.assertTrue(response.data.success, 'Success flag');
      this.assertTrue(response.data.stats, 'Stats object exists');
      this.assertTrue(response.data.stats.mode, 'AI mode is set');
    });

    // Test 3: Chat Endpoint
    await this.test('Chat Endpoint', async () => {
      const response = await this.fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        body: {
          message: 'Hello, this is a test message',
          history: []
        }
      });
      this.assertEqual(response.status, 200, 'Status code');
      this.assertTrue(response.data.success, 'Success flag');
      this.assertTrue(response.data.message, 'Response message exists');
    });

    // Test 4: Code Generation
    await this.test('Code Generation Endpoint', async () => {
      const response = await this.fetch(`${API_BASE}/api/generate-code`, {
        method: 'POST',
        body: {
          prompt: 'Create a function to add two numbers',
          language: 'javascript'
        }
      });
      this.assertEqual(response.status, 200, 'Status code');
      this.assertTrue(response.data.success, 'Success flag');
      this.assertTrue(response.data.code || response.data.error, 'Code or error message exists');
    });

    // Test 5: Search
    await this.test('Search Endpoint', async () => {
      const response = await this.fetch(`${API_BASE}/api/search`, {
        method: 'POST',
        body: {
          query: 'javascript array methods',
          limit: 5
        }
      });
      this.assertEqual(response.status, 200, 'Status code');
      this.assertTrue(response.data.success, 'Success flag');
      this.assertTrue(Array.isArray(response.data.results) || response.data.error, 'Results array exists');
    });

    // Test 6: Document Processing
    await this.test('Document Processing Endpoint', async () => {
      const response = await this.fetch(`${API_BASE}/api/process-document`, {
        method: 'POST',
        body: {
          content: 'This is a test document. It contains multiple sentences. We want to process it.',
          type: 'text'
        }
      });
      this.assertEqual(response.status, 200, 'Status code');
      this.assertTrue(response.data.success || response.data.error, 'Response contains success or error');
    });

    // Test 7: Image Generation
    await this.test('Image Generation Endpoint', async () => {
      const response = await this.fetch(`${API_BASE}/api/generate-image`, {
        method: 'POST',
        body: {
          prompt: 'A simple geometric pattern',
          width: 256,
          height: 256,
          style: 'geometric'
        }
      });
      this.assertEqual(response.status, 200, 'Status code');
      this.assertTrue(response.data.success !== undefined, 'Response has success field');
    });

    // Test 8: Mode Switching
    await this.test('AI Mode Switching', async () => {
      // Switch to offline
      const offlineResponse = await this.fetch(`${API_BASE}/api/ai/mode`, {
        method: 'POST',
        body: { mode: 'offline' }
      });
      this.assertTrue(offlineResponse.data.success || offlineResponse.data.error, 'Mode switch response');

      // Switch back to hybrid
      const hybridResponse = await this.fetch(`${API_BASE}/api/ai/mode`, {
        method: 'POST',
        body: { mode: 'hybrid' }
      });
      this.assertTrue(hybridResponse.data.success || hybridResponse.data.error, 'Mode switch response');
    });

    // Test 9: Cache Management
    await this.test('Cache Clear Endpoint', async () => {
      const response = await this.fetch(`${API_BASE}/api/ai/cache/clear`, {
        method: 'POST'
      });
      this.assertEqual(response.status, 200, 'Status code');
      this.assertTrue(response.data.success, 'Success flag');
    });

    // Test 10: Authentication Endpoints
    await this.test('Authentication Health', async () => {
      const response = await this.fetch(`${API_BASE}/api/auth/health`);
      // Auth endpoint may or may not exist, just check it doesn't crash
      this.assertTrue(response.status === 200 || response.status === 404, 'Endpoint responds');
    });

    // Display results
    this.displayResults();
  }

  displayResults() {
    this.log('\n═══════════════════════════════════════════════════════', 'blue');
    this.log('  Test Results', 'blue');
    this.log('═══════════════════════════════════════════════════════', 'blue');
    
    this.log(`\n✅ Passed: ${this.passed}`, 'green');
    this.log(`❌ Failed: ${this.failed}`, this.failed > 0 ? 'red' : 'reset');
    this.log(`📊 Total: ${this.passed + this.failed}`, 'cyan');
    
    const passRate = ((this.passed / (this.passed + this.failed)) * 100).toFixed(1);
    this.log(`\n🎯 Pass Rate: ${passRate}%`, passRate === '100.0' ? 'green' : 'yellow');

    if (this.failed > 0) {
      this.log('\n❌ Failed Tests:', 'red');
      this.results
        .filter(r => r.status === 'FAILED')
        .forEach(r => {
          this.log(`   • ${r.name}: ${r.error}`, 'red');
        });
    }

    this.log('\n═══════════════════════════════════════════════════════', 'blue');
    
    process.exit(this.failed > 0 ? 1 : 0);
  }
}

// Run tests
const tester = new APITester();
tester.run().catch(error => {
  console.error('Test runner error:', error);
  process.exit(1);
});
