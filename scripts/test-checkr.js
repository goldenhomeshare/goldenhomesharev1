#!/usr/bin/env node

// Simple command-line test script for Checkr implementation
// Run with: node scripts/test-checkr.js

const baseUrl = 'http://localhost:3000';

async function testEndpoint(endpoint, method = 'GET', body = null) {
  try {
    console.log(`\n🌐 Testing ${method} /api/checkr/${endpoint}`);
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${baseUrl}/api/checkr/${endpoint}`, options);
    const data = await response.json();
    
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    console.log(`📄 Response:`, JSON.stringify(data, null, 2));
    
    return {
      success: response.ok,
      status: response.status,
      data
    };
  } catch (error) {
    console.error(`❌ Error testing ${endpoint}:`, error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

async function runTests() {
  console.log('🧪 Checkr Implementation Test Suite');
  console.log('=====================================\n');

  const tests = [
    {
      name: 'Status Endpoint',
      endpoint: 'status',
      method: 'GET',
      expectedStatus: 401,
      description: 'Should require authentication'
    },
    {
      name: 'Verify Status Endpoint',
      endpoint: 'verify-status',
      method: 'GET',
      expectedStatus: 401,
      description: 'Should require authentication'
    },
    {
      name: 'Initiate Background Check',
      endpoint: 'initiate',
      method: 'POST',
      body: {
        package: 'basic_plus_criminal',
        includeDocuments: false
      },
      expectedStatus: 401,
      description: 'Should require authentication'
    },
    {
      name: 'Webhook Handler',
      endpoint: 'webhook',
      method: 'POST',
      body: {
        id: 'test-event-' + Date.now(),
        type: 'invitation.completed',
        created_at: new Date().toISOString(),
        data: {
          object: {
            id: 'inv_test_123',
            status: 'completed',
            candidate_id: 'cand_test_123',
            report_id: 'report_test_123'
          }
        }
      },
      expectedStatus: 200,
      description: 'Should process webhook events'
    }
  ];

  const results = [];

  for (const test of tests) {
    console.log(`\n📋 Test: ${test.name}`);
    console.log(`📝 ${test.description}`);
    
    const result = await testEndpoint(test.endpoint, test.method, test.body);
    
    const passed = result.status === test.expectedStatus;
    console.log(`${passed ? '✅' : '❌'} Expected: ${test.expectedStatus}, Got: ${result.status}`);
    
    results.push({
      name: test.name,
      passed,
      expected: test.expectedStatus,
      actual: result.status,
      result
    });
  }

  console.log('\n\n📊 Test Summary');
  console.log('===============');
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${total - passed}/${total}`);
  
  if (passed === total) {
    console.log('\n🎉 All tests passed! Checkr implementation is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the output above for details.');
  }

  console.log('\n📋 Individual Results:');
  results.forEach(result => {
    console.log(`  ${result.passed ? '✅' : '❌'} ${result.name}`);
  });

  console.log('\n🚀 Next Steps:');
  console.log('1. Visit http://localhost:3000/test-checkr for interactive testing');
  console.log('2. Test with authenticated user sessions');
  console.log('3. Verify database operations work correctly');
  console.log('4. Test real Checkr API integration');

  return results;
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch(`${baseUrl}/api/checkr/status`);
    return true;
  } catch (error) {
    console.error('❌ Server is not running. Please start the development server with:');
    console.error('   npm run dev');
    console.error('   or');
    console.error('   yarn dev');
    return false;
  }
}

// Main execution
async function main() {
  console.log('🔍 Checking if server is running...');
  
  const serverRunning = await checkServer();
  if (!serverRunning) {
    process.exit(1);
  }
  
  console.log('✅ Server is running, starting tests...\n');
  
  try {
    await runTests();
  } catch (error) {
    console.error('❌ Test execution failed:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testEndpoint, runTests }; 