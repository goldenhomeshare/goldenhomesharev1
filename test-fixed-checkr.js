#!/usr/bin/env node

async function testFixedCheckr() {
  console.log('🧪 Testing FIXED Checkr Configuration...\n');
  
  const apiKey = process.env.CHECKR_API_KEY;
  const baseUrl = process.env.CHECKR_BASE_URL;
  
  console.log('🔧 Current Configuration:');
  console.log(`   API Key: ${apiKey ? apiKey.substring(0, 12) + '...' : 'NOT SET'}`);
  console.log(`   Base URL: ${baseUrl}`);
  console.log(`   Environment: ${process.env.CHECKR_ENVIRONMENT}`);
  
  if (!apiKey) {
    console.log('❌ Please set CHECKR_API_KEY first');
    return;
  }
  
  // Check API key format
  if (apiKey.startsWith('test_')) {
    console.log('✅ Using staging API key - safe for testing');
  } else if (apiKey.startsWith('live_')) {
    console.log('⚠️  Using production API key - be careful!');
  } else {
    console.log('⚠️  API key format unclear - should start with test_ or live_');
  }
  
  try {
    console.log('\n🔍 Testing real Checkr API...');
    const response = await fetch('https://api.checkr.com/v1/packages', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`📊 Response Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('🎉 SUCCESS! Checkr API is working!');
      console.log(`📦 Found ${data.data?.length || 0} packages`);
      
      if (data.data && data.data.length > 0) {
        console.log('\n📋 First 3 packages:');
        data.data.slice(0, 3).forEach((pkg, i) => {
          console.log(`   ${i + 1}. ${pkg.name} (${pkg.slug})`);
        });
      }
    } else {
      const errorText = await response.text();
      console.log('❌ API Error:', errorText);
      
      if (response.status === 401) {
        console.log('\n🔐 Authentication failed:');
        console.log('   • Double-check your API key is correct');
        console.log('   • Make sure you copied the full key from Checkr dashboard');
      }
    }
    
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
  
  console.log('\n🎯 Next steps:');
  console.log('1. Make sure you have a real test_ API key from Checkr dashboard');
  console.log('2. Update your .env.local with the corrected URL');
  console.log('3. Restart your dev server');
  console.log('4. Test your app endpoints');
}

testFixedCheckr(); 