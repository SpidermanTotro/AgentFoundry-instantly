#!/usr/bin/env node
/**
 * Feature Tester - Automated testing from documentation
 * Tests all features mentioned in the documentation
 */

const http = require('http');
const https = require('https');

const BACKEND_URL = 'http://localhost:3001';
const FRONTEND_URL = 'http://localhost:3000';

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

class FeatureTester {
  constructor() {
    this.results = [];
    this.totalTests = 0;
    this.passedTests = 0;
  }

  async testEndpoint(name, method, path, data = null) {
    this.totalTests++;
    
    return new Promise((resolve) => {
      const url = BACKEND_URL + path;
      const options = {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000
      };

      const req = http.request(url, options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          const passed = res.statusCode < 400;
          this.results.push({
            name,
            passed,
            status: res.statusCode,
            response: body.substring(0, 100)
          });
          
          if (passed) this.passedTests++;
          resolve(passed);
        });
      });

      req.on('error', (error) => {
        this.results.push({
          name,
          passed: false,
          error: error.message
        });
        resolve(false);
      });

      req.on('timeout', () => {
        this.results.push({
          name,
          passed: false,
          error: 'Request timeout'
        });
        req.destroy();
        resolve(false);
      });

      if (data) {
        req.write(JSON.stringify(data));
      }
      
      req.end();
    });
  }

  printHeader() {
    console.log(`\n${colors.bright}${colors.cyan}╔════════════════════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}║     ChatGPT 2.0 - Feature Test Suite                  ║${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}╚════════════════════════════════════════════════════════╝${colors.reset}\n`);
  }

  printResult(result) {
    const icon = result.passed ? '✅' : '❌';
    const color = result.passed ? colors.green : colors.red;
    
    console.log(`${color}${icon} ${result.name}${colors.reset}`);
    
    if (result.status) {
      console.log(`   Status: ${result.status}`);
    }
    
    if (result.error) {
      console.log(`   ${colors.red}Error: ${result.error}${colors.reset}`);
    }
    
    console.log();
  }

  printSummary() {
    const percentage = ((this.passedTests / this.totalTests) * 100).toFixed(1);
    const color = percentage >= 80 ? colors.green : percentage >= 50 ? colors.yellow : colors.red;
    
    console.log(`\n${colors.bright}${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.bright}Summary${colors.reset}\n`);
    console.log(`Total Tests:  ${this.totalTests}`);
    console.log(`${colors.green}Passed:       ${this.passedTests}${colors.reset}`);
    console.log(`${colors.red}Failed:       ${this.totalTests - this.passedTests}${colors.reset}`);
    console.log(`${color}Success Rate: ${percentage}%${colors.reset}`);
    console.log(`${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}\n`);
  }

  async runTests() {
    this.printHeader();
    
    console.log(`${colors.cyan}Testing Backend Features...${colors.reset}\n`);

    // Test Health Check
    await this.testEndpoint('Health Check', 'GET', '/api/health');

    // Test Authentication
    await this.testEndpoint('Auth Login', 'POST', '/api/auth/login', {
      username: 'admin',
      password: 'admin123'
    });

    await this.testEndpoint('Auth Register', 'POST', '/api/auth/register', {
      username: 'testuser',
      email: 'test@example.com',
      password: 'test123'
    });

    // Test Vector DB
    await this.testEndpoint('Vector DB Search', 'POST', '/api/vectordb/search', {
      query: 'test'
    });

    // Test Chat
    await this.testEndpoint('Chat Endpoint', 'POST', '/api/chat', {
      message: 'Hello',
      history: []
    });

    // Test Multi-modal
    await this.testEndpoint('Image Generation', 'POST', '/api/generate-image', {
      prompt: 'test image'
    });

    await this.testEndpoint('Video Generation', 'POST', '/api/generate-video', {
      prompt: 'test video'
    });

    await this.testEndpoint('Audio Generation', 'POST', '/api/generate-audio', {
      text: 'test audio'
    });

    await this.testEndpoint('Web Search', 'POST', '/api/search', {
      query: 'test search'
    });

    // Print results
    console.log(`\n${colors.cyan}Test Results:${colors.reset}\n`);
    this.results.forEach(result => this.printResult(result));

    this.printSummary();

    // Generate report file
    this.generateReport();
  }

  generateReport() {
    const fs = require('fs');
    const timestamp = new Date().toISOString();
    
    const report = `# Feature Test Report
Generated: ${timestamp}

## Summary
- Total Tests: ${this.totalTests}
- Passed: ${this.passedTests}
- Failed: ${this.totalTests - this.passedTests}
- Success Rate: ${((this.passedTests / this.totalTests) * 100).toFixed(1)}%

## Detailed Results

${this.results.map(r => `
### ${r.name}
- Status: ${r.passed ? '✅ PASSED' : '❌ FAILED'}
${r.status ? `- HTTP Status: ${r.status}` : ''}
${r.error ? `- Error: ${r.error}` : ''}
${r.response ? `- Response: ${r.response}...` : ''}
`).join('\n')}

## Recommendations

${this.totalTests - this.passedTests > 0 ? `
- Fix failing tests
- Check server is running (npm run server)
- Verify API endpoints are correct
` : '✅ All tests passed! The application is working correctly.'}
`;

    fs.writeFileSync('test-report.md', report);
    console.log(`${colors.green}📄 Test report saved to test-report.md${colors.reset}\n`);
  }
}

// Run the tests
const tester = new FeatureTester();
tester.runTests().catch(error => {
  console.error(`${colors.red}Test suite failed:${colors.reset}`, error);
  process.exit(1);
});
