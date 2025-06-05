#!/usr/bin/env node

/**
 * Comprehensive Background Check Sync Issue Diagnostic Tool
 * 
 * This script analyzes why some accounts sync properly while others don't.
 * Run with: node diagnose-sync-issues.js [email]
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const targetEmail = process.argv[2];
  
  console.log('🔍 BACKGROUND CHECK SYNC DIAGNOSTIC TOOL');
  console.log('=========================================\n');

  if (targetEmail) {
    console.log(`🎯 Analyzing specific email: ${targetEmail}\n`);
    await analyzeSpecificEmail(targetEmail);
  } else {
    console.log('📊 Running comprehensive system analysis...\n');
    await analyzeSystemWide();
  }

  await prisma.$disconnect();
}

async function analyzeSpecificEmail(email) {
  console.log(`📧 EMAIL ANALYSIS: ${email}`);
  console.log('=' .repeat(50));
  
  // 1. Find all users with this email
  const users = await prisma.user.findMany({
    where: { email: email }
  });
  
  console.log(`\n👥 USERS WITH THIS EMAIL: ${users.length}`);
  users.forEach((user, i) => {
    console.log(`  ${i + 1}. User ID: ${user.id}`);
    console.log(`     Name: ${user.firstName} ${user.lastName}`);
    console.log(`     Verified: ${user.isVerified}`);
    console.log(`     Created: ${user.createdAt}`);
    console.log('');
  });

  // 2. Find all background checks for this email
  const backgroundChecks = await prisma.background_checks.findMany({
    where: { candidateEmail: email },
    orderBy: { createdAt: 'desc' }
  });

  console.log(`\n🔍 BACKGROUND CHECKS FOR THIS EMAIL: ${backgroundChecks.length}`);
  backgroundChecks.forEach((check, i) => {
    console.log(`  ${i + 1}. Check ID: ${check.id}`);
    console.log(`     Status: ${check.status}`);
    console.log(`     Checkr Status: ${check.checkrStatus}`);
    console.log(`     User ID: ${check.candidateUserId}`);
    console.log(`     Invitation ID: ${check.invitationId}`);
    console.log(`     Report ID: ${check.reportId}`);
    console.log(`     Candidate ID: ${check.candidateId}`);
    console.log(`     Created: ${check.createdAt}`);
    console.log(`     Completed: ${check.completedAt}`);
    console.log('');
  });

  // 3. Check for potential issues
  await identifyIssues(email, users, backgroundChecks);

  // 4. Checkr API status check
  await checkCheckrStatus(backgroundChecks);
}

async function analyzeSystemWide() {
  console.log('📊 SYSTEM-WIDE ANALYSIS');
  console.log('=' .repeat(30));

  // 1. Overall statistics
  const totalUsers = await prisma.user.count();
  const verifiedUsers = await prisma.user.count({ where: { isVerified: true } });
  const totalChecks = await prisma.background_checks.count();
  
  console.log(`\n📈 OVERALL STATISTICS:`);
  console.log(`  Total Users: ${totalUsers}`);
  console.log(`  Verified Users: ${verifiedUsers} (${((verifiedUsers/totalUsers)*100).toFixed(1)}%)`);
  console.log(`  Total Background Checks: ${totalChecks}`);

  // 2. Background check status breakdown
  const statusBreakdown = await prisma.background_checks.groupBy({
    by: ['status'],
    _count: { status: true }
  });

  console.log(`\n📊 BACKGROUND CHECK STATUS BREAKDOWN:`);
  statusBreakdown.forEach(item => {
    console.log(`  ${item.status}: ${item._count.status}`);
  });

  // 3. Find problematic patterns
  console.log(`\n🚨 POTENTIAL ISSUES:`);

  // Users with multiple background checks
  const multipleChecks = await prisma.$queryRaw`
    SELECT "candidateEmail", COUNT(*) as check_count 
    FROM "background_checks" 
    GROUP BY "candidateEmail" 
    HAVING COUNT(*) > 1
    ORDER BY check_count DESC
  `;

  if (multipleChecks.length > 0) {
    console.log(`  📧 Emails with multiple background checks: ${multipleChecks.length}`);
    multipleChecks.slice(0, 5).forEach(item => {
      console.log(`    ${item.candidateEmail}: ${item.check_count} checks`);
    });
  }

  // Pending checks older than 24 hours
  const oldPendingChecks = await prisma.background_checks.findMany({
    where: {
      status: 'PENDING',
      createdAt: {
        lt: new Date(Date.now() - 24 * 60 * 60 * 1000)
      }
    }
  });

  if (oldPendingChecks.length > 0) {
    console.log(`  ⏰ Pending checks older than 24h: ${oldPendingChecks.length}`);
    oldPendingChecks.slice(0, 5).forEach(check => {
      console.log(`    ${check.candidateEmail} - ${check.createdAt}`);
    });
  }

  // Users with background checks but not verified
  const unverifiedWithCompletedChecks = await prisma.user.findMany({
    where: {
      isVerified: false,
      background_checks_background_checks_candidateUserIdToUser: {
        some: {
          status: 'COMPLETED'
        }
      }
    },
    include: {
      background_checks_background_checks_candidateUserIdToUser: true
    }
  });

  if (unverifiedWithCompletedChecks.length > 0) {
    console.log(`  ❌ Unverified users with completed checks: ${unverifiedWithCompletedChecks.length}`);
    unverifiedWithCompletedChecks.slice(0, 5).forEach(user => {
      console.log(`    ${user.email} - ${user.background_checks_background_checks_candidateUserIdToUser.length} checks`);
    });
  }

  // Missing invitation IDs
  const missingIds = await prisma.background_checks.findMany({
    where: {
      invitationId: null
    }
  });

  if (missingIds.length > 0) {
    console.log(`  🆔 Checks missing invitation IDs: ${missingIds.length}`);
    missingIds.slice(0, 5).forEach(check => {
      console.log(`    ${check.candidateEmail} - Missing invitation ID`);
    });
  }
}

async function identifyIssues(email, users, backgroundChecks) {
  console.log(`\n🚨 POTENTIAL ISSUES FOR ${email}:`);
  
  let issueCount = 0;

  // Issue 1: Multiple users with same email
  if (users.length > 1) {
    console.log(`  ❌ Multiple user accounts (${users.length}) - may cause verification conflicts`);
    issueCount++;
  }

  // Issue 2: Multiple background checks
  if (backgroundChecks.length > 1) {
    console.log(`  ⚠️ Multiple background checks (${backgroundChecks.length}) - may cause sync confusion`);
    
    const statuses = backgroundChecks.map(c => c.status);
    const uniqueStatuses = [...new Set(statuses)];
    console.log(`    Statuses: ${uniqueStatuses.join(', ')}`);
    issueCount++;
  }

  // Issue 3: Missing critical IDs
  const missingIds = backgroundChecks.filter(c => !c.invitationId);
  if (missingIds.length > 0) {
    console.log(`  🆔 ${missingIds.length} check(s) missing invitation IDs`);
    issueCount++;
  }

  // Issue 4: User ID mismatches
  const userIds = users.map(u => u.id);
  const checkUserIds = backgroundChecks.map(c => c.candidateUserId).filter(Boolean);
  const orphanedChecks = checkUserIds.filter(id => !userIds.includes(id));
  
  if (orphanedChecks.length > 0) {
    console.log(`  👤 ${orphanedChecks.length} background check(s) reference non-existent users`);
    issueCount++;
  }

  // Issue 5: Verification status mismatch
  const completedChecks = backgroundChecks.filter(c => c.status === 'COMPLETED');
  const unverifiedUsers = users.filter(u => !u.isVerified);
  
  if (completedChecks.length > 0 && unverifiedUsers.length > 0) {
    console.log(`  ✅ ${completedChecks.length} completed check(s) but ${unverifiedUsers.length} unverified user(s)`);
    issueCount++;
  }

  if (issueCount === 0) {
    console.log(`  ✅ No obvious issues detected`);
  }
}

async function checkCheckrStatus(backgroundChecks) {
  console.log(`\n🌐 CHECKR API STATUS CHECK:`);
  
  const checksWithInvitations = backgroundChecks.filter(c => c.invitationId);
  
  if (checksWithInvitations.length === 0) {
    console.log(`  ⚠️ No checks with invitation IDs to verify`);
    return;
  }

  console.log(`  📡 Checking ${checksWithInvitations.length} invitation(s) with Checkr...`);
  
  for (const check of checksWithInvitations.slice(0, 3)) { // Limit to first 3 to avoid rate limits
    try {
      const response = await fetch(`${process.env.CHECKR_API_BASE_URL}/v1/invitations/${check.invitationId}`, {
        headers: {
          'Authorization': `Basic ${Buffer.from(process.env.CHECKR_API_KEY + ':').toString('base64')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const invitation = await response.json();
        console.log(`    ✅ ${check.invitationId}: ${invitation.status}`);
        
        if (invitation.status !== check.status?.toLowerCase()) {
          console.log(`      🔄 Status mismatch! DB: ${check.status}, Checkr: ${invitation.status}`);
        }
      } else {
        console.log(`    ❌ ${check.invitationId}: HTTP ${response.status}`);
      }
    } catch (error) {
      console.log(`    ❌ ${check.invitationId}: ${error.message}`);
    }
  }
}

// Analysis by specific problematic patterns
async function runSpecificAnalysis(pattern) {
  switch (pattern) {
    case 'multiple-checks':
      await analyzeMultipleChecks();
      break;
    case 'sync-failures':
      await analyzeSyncFailures();
      break;
    case 'verification-mismatches':
      await analyzeVerificationMismatches();
      break;
    default:
      console.log('Available patterns: multiple-checks, sync-failures, verification-mismatches');
  }
}

async function analyzeMultipleChecks() {
  console.log('🔍 ANALYZING ACCOUNTS WITH MULTIPLE BACKGROUND CHECKS');
  console.log('=' .repeat(55));
  
  const multipleChecks = await prisma.$queryRaw`
    SELECT "candidateEmail", COUNT(*) as check_count,
           array_agg("status") as statuses,
           array_agg("id") as check_ids
    FROM "background_checks" 
    GROUP BY "candidateEmail" 
    HAVING COUNT(*) > 1
    ORDER BY check_count DESC
  `;

  for (const account of multipleChecks) {
    console.log(`\n📧 ${account.candidateEmail} (${account.check_count} checks)`);
    console.log(`   Statuses: ${account.statuses.join(', ')}`);
    console.log(`   IDs: ${account.check_ids.join(', ')}`);
  }
}

// Run the analysis
main().catch(console.error); 