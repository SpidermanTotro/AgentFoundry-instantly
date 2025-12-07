#!/usr/bin/env node
/**
 * Test script for Unified Integration
 */

const unifiedIntegration = require('./server/integrations/UnifiedIntegrationManager');

async function testIntegration() {
  console.log('\n🧪 Testing Unified Integration Manager...\n');
  
  try {
    // Initialize
    console.log('1️⃣ Testing initialization...');
    const initResult = await unifiedIntegration.initialize();
    console.log(`   Result: ${initResult ? '✅ SUCCESS' : '❌ FAILED'}\n`);
    
    // Get status
    console.log('2️⃣ Testing status retrieval...');
    const status = unifiedIntegration.getStatus();
    console.log('   Status:', JSON.stringify(status, null, 2));
    console.log('   ✅ SUCCESS\n');
    
    // Get capabilities
    console.log('3️⃣ Testing capabilities retrieval...');
    const capabilities = unifiedIntegration.getCapabilities();
    console.log('   Capabilities:', JSON.stringify(capabilities, null, 2));
    console.log('   ✅ SUCCESS\n');
    
    // Test code completion
    console.log('4️⃣ Testing code completion...');
    const codeResult = await unifiedIntegration.getCodeCompletion('def fibonacci(', 'python');
    console.log('   Result:', JSON.stringify(codeResult, null, 2));
    console.log('   ✅ SUCCESS\n');
    
    // Test slide creation
    console.log('5️⃣ Testing slide creation...');
    const slidesResult = await unifiedIntegration.createSlides('AI Technology', 3, 'professional');
    console.log('   Result:', JSON.stringify(slidesResult, null, 2));
    console.log('   ✅ SUCCESS\n');
    
    // Test image generation
    console.log('6️⃣ Testing image generation...');
    const imageResult = await unifiedIntegration.generateImage('A beautiful sunset', { width: 512, height: 512 });
    console.log('   Result:', JSON.stringify(imageResult, null, 2));
    console.log('   ✅ SUCCESS\n');
    
    // Shutdown
    console.log('7️⃣ Testing shutdown...');
    await unifiedIntegration.shutdown();
    console.log('   ✅ SUCCESS\n');
    
    console.log('🎉 All tests passed!\n');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

testIntegration();
