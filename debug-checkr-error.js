#!/usr/bin/env node

// Debug script to identify the root cause of /test-checkr 500 error

console.log('🔍 Debugging Checkr Integration Issues...\n');

// Test 1: Environment Variables
console.log('1. Checking Environment Variables:');
console.log('   CHECKR_API_KEY:', process.env.CHECKR_API_KEY ? 'SET' : 'MISSING');
console.log('   CHECKR_WEBHOOK_SECRET:', process.env.CHECKR_WEBHOOK_SECRET ? 'SET' : 'MISSING');
console.log('   CHECKR_BASE_URL:', process.env.CHECKR_BASE_URL || 'NOT_SET (will use default)');
console.log('   DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'MISSING');

// Test 2: Database Connection
console.log('\n2. Testing Database Connection:');
try {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  
  prisma.$connect().then(() => {
    console.log('   ✅ Database connection successful');
    prisma.$disconnect();
  }).catch((error) => {
    console.log('   ❌ Database connection failed:', error.message);
  });
} catch (error) {
  console.log('   ❌ Prisma setup error:', error.message);
}

// Test 3: Checkr Client
console.log('\n3. Testing Checkr Client:');
try {
  // Test if we can import the Checkr client
  const { checkr } = require('./app/lib/checkr');
  console.log('   ✅ Checkr client imported successfully');
  
  // Test environment validation
  const env = checkr.getEnvironment();
  console.log('   Environment:', env);
} catch (error) {
  console.log('   ❌ Checkr client error:', error.message);
}

// Test 4: Auth Session
console.log('\n4. Testing Authentication:');
try {
  const { getKindeServerSession } = require('@kinde-oss/kinde-auth-nextjs/server');
  console.log('   ✅ Kinde auth imported successfully');
} catch (error) {
  console.log('   ❌ Kinde auth error:', error.message);
}

console.log('\n🔍 Debug complete. Check for errors above.'); 