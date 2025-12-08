/**
 * Integration Tests for GenSpark 2.0 Unified Platform
 * Tests ChatGPT 2.0 + Kimi + GenSpark integration
 */

const assert = require('assert');
const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3001/api';
const UNIFIED_API = `${API_BASE}/unified`;

class UnifiedPlatformTests {
  constructor() {
    this.testResults = {
      passed: 0,
      failed: 0,
      total: 0
    };
  }

  async runAllTests() {
    console.log('\n🧪 Starting GenSpark 2.0 Unified Platform Tests\n');
    console.log('=' .repeat(60));

    await this.testHealthCheck();
    await this.testCapabilities();
    await this.testUnifiedChat();
    await this.testLongContext();
    await this.testDocumentAnalysis();
    await this.testMathComputation();
    await this.testWebSearch();
    await this.testCodeExecution();
    await this.testAutoRouting();
    await this.testStatistics();

    console.log('\n' + '='.repeat(60));
    this.printSummary();
  }

  async test(name, testFn) {
    this.testResults.total++;
    process.stdout.write(`Testing ${name}... `);
    
    try {
      await testFn();
      this.testResults.passed++;
      console.log('✅ PASSED');
      return true;
    } catch (error) {
      this.testResults.failed++;
      console.log('❌ FAILED');
      console.error(`  Error: ${error.message}`);
      return false;
    }
  }

  async testHealthCheck() {
    await this.test('Health Check', async () => {
      const response = await fetch(`${API_BASE}/health`);
      const data = await response.json();
      
      assert.strictEqual(data.status, 'ok');
      assert.strictEqual(data.features.unifiedAI, true);
      assert(data.features.engines);
      assert(data.features.engines.chatgpt2);
      assert(data.features.engines.kimi);
      assert(data.features.engines.genspark);
    });
  }

  async testCapabilities() {
    await this.test('Get Capabilities', async () => {
      const response = await fetch(`${UNIFIED_API}/capabilities`);
      const data = await response.json();
      
      assert.strictEqual(data.success, true);
      assert(data.capabilities);
      assert(data.capabilities.orchestrator);
      assert(data.capabilities.engines);
      assert(data.capabilities.engines.chatgpt);
      assert(data.capabilities.engines.kimi);
    });
  }

  async testUnifiedChat() {
    await this.test('Unified Chat', async () => {
      const response = await fetch(`${UNIFIED_API}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Hello unified system!',
          personality: 'assistant'
        })
      });
      
      const data = await response.json();
      assert(data);
      assert(data.metadata);
      assert(data.metadata.orchestrated === true);
    });
  }

  async testLongContext() {
    await this.test('Long Context Processing', async () => {
      const messages = [
        { role: 'user', content: 'Tell me about AI' },
        { role: 'assistant', content: 'AI is artificial intelligence...' },
        { role: 'user', content: 'What about machine learning?' },
        { role: 'assistant', content: 'Machine learning is a subset of AI...' }
      ];

      const response = await fetch(`${UNIFIED_API}/long-context`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages })
      });
      
      const data = await response.json();
      assert(data);
      assert(data.success === true);
      assert(data.tokenCount > 0);
      assert(data.capability);
    });
  }

  async testDocumentAnalysis() {
    await this.test('Document Analysis', async () => {
      // Create a test file first
      const fs = require('fs').promises;
      const testFile = './test-document.txt';
      await fs.writeFile(testFile, 'This is a test document for analysis.');

      const response = await fetch(`${UNIFIED_API}/analyze-document`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath: testFile,
          options: { extractText: true }
        })
      });
      
      const data = await response.json();
      assert(data);
      assert(data.success === true);
      assert(data.content);
      assert(data.wordCount > 0);

      // Cleanup
      await fs.unlink(testFile);
    });
  }

  async testMathComputation() {
    await this.test('Mathematical Computation', async () => {
      const response = await fetch(`${UNIFIED_API}/compute-math`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expression: '2 + 2 * 3'
        })
      });
      
      const data = await response.json();
      assert(data);
      assert(data.success === true);
      assert(data.result === 8); // 2 + (2 * 3)
      assert(data.capability);
    });
  }

  async testWebSearch() {
    await this.test('Web Search', async () => {
      const response = await fetch(`${UNIFIED_API}/web-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: 'Latest AI news',
          options: { maxResults: 5 }
        })
      });
      
      const data = await response.json();
      assert(data);
      assert(data.success === true);
      assert(data.query === 'Latest AI news');
      assert(Array.isArray(data.results));
    });
  }

  async testCodeExecution() {
    await this.test('Code Execution', async () => {
      const response = await fetch(`${UNIFIED_API}/execute-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: '1 + 1',
          language: 'javascript'
        })
      });
      
      const data = await response.json();
      assert(data);
      assert(data.success === true);
      assert(data.output === 2);
    });
  }

  async testAutoRouting() {
    await this.test('Auto-Routing', async () => {
      // Test math routing
      const mathTask = {
        task: {
          expression: '10 * 5',
          description: 'Calculate this'
        }
      };

      const response = await fetch(`${UNIFIED_API}/auto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mathTask)
      });
      
      const data = await response.json();
      assert(data);
      assert(data.metadata);
      assert(data.metadata.orchestrated === true);
      // Should route to Kimi for math
      assert(data.metadata.taskType === 'math_computation');
    });
  }

  async testStatistics() {
    await this.test('Get Statistics', async () => {
      const response = await fetch(`${UNIFIED_API}/stats`);
      const data = await response.json();
      
      assert(data);
      assert(data.success === true);
      assert(data.stats);
      assert(data.stats.orchestrator);
      assert(data.stats.orchestrator.totalEngines >= 4);
      assert(data.stats.engines);
    });
  }

  printSummary() {
    console.log('\n📊 Test Summary:');
    console.log(`   Total Tests: ${this.testResults.total}`);
    console.log(`   ✅ Passed: ${this.testResults.passed}`);
    console.log(`   ❌ Failed: ${this.testResults.failed}`);
    
    const percentage = (this.testResults.passed / this.testResults.total * 100).toFixed(1);
    console.log(`   Success Rate: ${percentage}%\n`);

    if (this.testResults.failed === 0) {
      console.log('🎉 All tests passed! Integration is working correctly.\n');
    } else {
      console.log('⚠️  Some tests failed. Please check the errors above.\n');
    }
  }
}

// Run tests if executed directly
if (require.main === module) {
  const tests = new UnifiedPlatformTests();
  tests.runAllTests().catch(console.error);
}

module.exports = UnifiedPlatformTests;
