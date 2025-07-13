import prisma, { checkDatabaseConnection, disconnectPrisma } from "../app/lib/db";

async function runHealthCheck() {
  console.log("🔍 Running database health check...\n");
  
  try {
    // Test basic connection
    console.log("Testing basic connection...");
    const healthResult = await checkDatabaseConnection();
    console.log(`Status: ${healthResult.status}`);
    console.log(`Timestamp: ${healthResult.timestamp}`);
    
    if (healthResult.status === 'error') {
      console.error("Error:", healthResult.error);
      return;
    }

    // Test concurrent connections
    console.log("\n🔗 Testing concurrent connections...");
    const concurrentPromises = Array.from({ length: 10 }, async (_, i) => {
      try {
        const start = Date.now();
        await prisma.user.count();
        const duration = Date.now() - start;
        console.log(`Connection ${i + 1}: ${duration}ms`);
        return { success: true, duration };
      } catch (error: any) {
        console.error(`Connection ${i + 1} failed:`, error.message);
        return { success: false, error: error.message };
      }
    });

    const results = await Promise.all(concurrentPromises);
    const successful = results.filter(r => r.success).length;
    const avgDuration = results
      .filter(r => r.success)
      .reduce((sum, r) => sum + (r as any).duration, 0) / successful;

    console.log(`\n📊 Results:`);
    console.log(`Successful connections: ${successful}/10`);
    console.log(`Average duration: ${avgDuration.toFixed(2)}ms`);

    // Test query performance
    console.log("\n⚡ Testing query performance...");
    const queryStart = Date.now();
    const productCount = await prisma.product.count();
    const queryDuration = Date.now() - queryStart;
    console.log(`Product count query: ${productCount} products in ${queryDuration}ms`);

    const profileStart = Date.now();
    const profileCount = await prisma.housemateProfile.count();
    const profileDuration = Date.now() - profileStart;
    console.log(`Profile count query: ${profileCount} profiles in ${profileDuration}ms`);

    console.log("\n✅ Health check completed successfully!");

  } catch (error) {
    console.error("❌ Health check failed:", error);
  } finally {
    await disconnectPrisma();
    console.log("\n🔌 Database connection closed.");
  }
}

// Connection pool monitoring
async function monitorConnectionPool() {
  console.log("📡 Monitoring connection pool for 30 seconds...\n");
  
  const startTime = Date.now();
  const interval = setInterval(async () => {
    try {
      const start = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      const duration = Date.now() - start;
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      console.log(`[${elapsed}s] Connection test: ${duration}ms`);
    } catch (error: any) {
      console.error(`[${Math.round((Date.now() - startTime) / 1000)}s] Connection failed:`, error.message);
    }
  }, 2000);

  setTimeout(async () => {
    clearInterval(interval);
    await disconnectPrisma();
    console.log("\n🏁 Monitoring completed.");
    process.exit(0);
  }, 30000);
}

// Main function
async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'health':
      await runHealthCheck();
      break;
    case 'monitor':
      await monitorConnectionPool();
      break;
    default:
      console.log("Database Health Check Utility");
      console.log("\nUsage:");
      console.log("  npm run db:health    - Run basic health check");
      console.log("  npm run db:monitor   - Monitor connection pool");
      console.log("\nOr directly:");
      console.log("  npx tsx scripts/db-health-check.ts health");
      console.log("  npx tsx scripts/db-health-check.ts monitor");
      break;
  }
}

main().catch(console.error); 