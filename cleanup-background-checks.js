#!/usr/bin/env node

/**
 * Background Check Cleanup and Fix Tool
 * 
 * This script fixes common issues that prevent background checks from syncing properly.
 * Run with: node cleanup-background-checks.js [action] [email]
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const action = process.argv[2];
  const targetEmail = process.argv[3];
  
  console.log('🔧 BACKGROUND CHECK CLEANUP TOOL');
  console.log('================================\n');

  if (!action) {
    showHelp();
    return;
  }

  switch (action) {
    case 'fix-duplicates':
      await fixDuplicateChecks(targetEmail);
      break;
    case 'fix-user-links':
      await fixUserLinks(targetEmail);
      break;
    case 'fix-verification':
      await fixVerificationStatus(targetEmail);
      break;
    case 'remove-orphans':
      await removeOrphanedChecks();
      break;
    case 'sync-all':
      await syncAllPendingChecks();
      break;
    case 'clean-email':
      if (!targetEmail) {
        console.log('❌ Email required for clean-email action');
        return;
      }
      await cleanupEmailRecords(targetEmail);
      break;
    default:
      console.log(`❌ Unknown action: ${action}`);
      showHelp();
  }

  await prisma.$disconnect();
}

function showHelp() {
  console.log('Available actions:');
  console.log('  fix-duplicates [email]    - Remove duplicate background checks');
  console.log('  fix-user-links [email]    - Fix user ID links in background checks');
  console.log('  fix-verification [email]  - Fix user verification status');
  console.log('  remove-orphans            - Remove background checks with no valid user');
  console.log('  sync-all                  - Attempt to sync all pending checks with Checkr');
  console.log('  clean-email <email>       - Comprehensive cleanup for specific email');
  console.log('');
  console.log('Examples:');
  console.log('  node cleanup-background-checks.js fix-duplicates user@example.com');
  console.log('  node cleanup-background-checks.js clean-email user@example.com');
  console.log('  node cleanup-background-checks.js sync-all');
}

async function fixDuplicateChecks(targetEmail) {
  console.log('🔍 FIXING DUPLICATE BACKGROUND CHECKS');
  console.log('=====================================\n');

  let whereClause = {};
  if (targetEmail) {
    whereClause = { candidateEmail: targetEmail };
    console.log(`🎯 Targeting email: ${targetEmail}\n`);
  }

  // Find emails with multiple background checks
  let duplicateEmails;
  if (targetEmail) {
    duplicateEmails = await prisma.$queryRaw`
      SELECT "candidateEmail", COUNT(*) as check_count,
             array_agg("id" ORDER BY "createdAt" DESC) as check_ids,
             array_agg("status" ORDER BY "createdAt" DESC) as statuses
      FROM "background_checks" 
      WHERE "candidateEmail" = ${targetEmail}
      GROUP BY "candidateEmail" 
      HAVING COUNT(*) > 1
      ORDER BY check_count DESC
    `;
  } else {
    duplicateEmails = await prisma.$queryRaw`
      SELECT "candidateEmail", COUNT(*) as check_count,
             array_agg("id" ORDER BY "createdAt" DESC) as check_ids,
             array_agg("status" ORDER BY "createdAt" DESC) as statuses
      FROM "background_checks" 
      GROUP BY "candidateEmail" 
      HAVING COUNT(*) > 1
      ORDER BY check_count DESC
    `;
  }

  if (duplicateEmails.length === 0) {
    console.log('✅ No duplicate background checks found');
    return;
  }

  console.log(`📧 Found ${duplicateEmails.length} email(s) with duplicate checks:\n`);

  for (const emailData of duplicateEmails) {
    console.log(`📧 ${emailData.candidateEmail} (${emailData.check_count} checks)`);
    console.log(`   IDs: ${emailData.check_ids.join(', ')}`);
    console.log(`   Statuses: ${emailData.statuses.join(', ')}`);

    // Keep the most recent completed check, or the most recent check if none completed
    const checks = await prisma.background_checks.findMany({
      where: { candidateEmail: emailData.candidateEmail },
      orderBy: { createdAt: 'desc' }
    });

    let keepCheck = checks.find(c => c.status === 'COMPLETED') || checks[0];
    let removeChecks = checks.filter(c => c.id !== keepCheck.id);

    console.log(`   ✅ Keeping: ${keepCheck.id} (${keepCheck.status})`);
    console.log(`   ❌ Removing: ${removeChecks.map(c => `${c.id}(${c.status})`).join(', ')}`);

    // Remove duplicate checks
    for (const check of removeChecks) {
      await prisma.background_checks.delete({
        where: { id: check.id }
      });
    }

    console.log(`   ✅ Cleaned up ${removeChecks.length} duplicate check(s)\n`);
  }
}

async function fixUserLinks(targetEmail) {
  console.log('🔗 FIXING USER LINKS IN BACKGROUND CHECKS');
  console.log('==========================================\n');

  let whereClause = {};
  if (targetEmail) {
    whereClause = { candidateEmail: targetEmail };
    console.log(`🎯 Targeting email: ${targetEmail}\n`);
  }

  // Find background checks with missing or incorrect user links
  const backgroundChecks = await prisma.background_checks.findMany({
    where: whereClause
  });

  let fixedCount = 0;

  for (const check of backgroundChecks) {
    // Find the user with this email
    const user = await prisma.user.findFirst({
      where: { email: check.candidateEmail },
      orderBy: { createdAt: 'desc' } // Get most recent user if multiple
    });

    if (!user) {
      console.log(`⚠️ No user found for email: ${check.candidateEmail}`);
      continue;
    }

    if (check.candidateUserId !== user.id) {
      console.log(`🔗 Fixing user link for check ${check.id}`);
      console.log(`   Email: ${check.candidateEmail}`);
      console.log(`   Old User ID: ${check.candidateUserId}`);
      console.log(`   New User ID: ${user.id}`);

      await prisma.background_checks.update({
        where: { id: check.id },
        data: { candidateUserId: user.id }
      });

      fixedCount++;
    }
  }

  console.log(`\n✅ Fixed ${fixedCount} user link(s)`);
}

async function fixVerificationStatus(targetEmail) {
  console.log('✅ FIXING USER VERIFICATION STATUS');
  console.log('==================================\n');

  let whereClause = {};
  if (targetEmail) {
    whereClause = { email: targetEmail };
    console.log(`🎯 Targeting email: ${targetEmail}\n`);
  }

  // Find users who should be verified based on completed background checks
  const usersToVerify = await prisma.user.findMany({
    where: {
      ...whereClause,
      isVerified: false,
      background_checks_background_checks_candidateUserIdToUser: {
        some: {
          status: 'COMPLETED'
        }
      }
    },
    include: {
      background_checks_background_checks_candidateUserIdToUser: {
        where: { status: 'COMPLETED' }
      }
    }
  });

  console.log(`📊 Found ${usersToVerify.length} user(s) with completed checks but not verified`);

  for (const user of usersToVerify) {
    console.log(`✅ Verifying user: ${user.email}`);
    console.log(`   Completed checks: ${user.background_checks_background_checks_candidateUserIdToUser.length}`);

    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true }
    });
  }

  console.log(`\n✅ Verified ${usersToVerify.length} user(s)`);
}

async function removeOrphanedChecks() {
  console.log('🧹 REMOVING ORPHANED BACKGROUND CHECKS');
  console.log('======================================\n');

  // Find background checks that reference non-existent users
  const orphanedChecks = await prisma.background_checks.findMany({
    where: {
      candidateUserId: {
        not: null
      }
    }
  });

  let removedCount = 0;

  for (const check of orphanedChecks) {
    const userExists = await prisma.user.findFirst({
      where: { id: check.candidateUserId }
    });

    if (!userExists) {
      console.log(`🗑️ Removing orphaned check: ${check.id} (user ${check.candidateUserId} not found)`);
      
      await prisma.background_checks.delete({
        where: { id: check.id }
      });
      
      removedCount++;
    }
  }

  console.log(`\n✅ Removed ${removedCount} orphaned check(s)`);
}

async function syncAllPendingChecks() {
  console.log('🔄 SYNCING ALL PENDING CHECKS WITH CHECKR');
  console.log('=========================================\n');

  const pendingChecks = await prisma.background_checks.findMany({
    where: {
      status: { in: ['PENDING', 'IN_PROGRESS'] },
      invitationId: { not: null }
    }
  });

  console.log(`📊 Found ${pendingChecks.length} pending check(s) to sync`);

  let syncedCount = 0;
  let errorCount = 0;

  for (const check of pendingChecks) {
    try {
      console.log(`📡 Checking invitation: ${check.invitationId}`);

      const response = await fetch(`${process.env.CHECKR_API_BASE_URL}/v1/invitations/${check.invitationId}`, {
        headers: {
          'Authorization': `Basic ${Buffer.from(process.env.CHECKR_API_KEY + ':').toString('base64')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.log(`   ❌ HTTP ${response.status}`);
        errorCount++;
        continue;
      }

      const invitation = await response.json();
      console.log(`   📊 Checkr status: ${invitation.status}`);

      if (invitation.status === 'completed') {
        const updateData = {
          status: 'COMPLETED',
          checkrStatus: 'clear',
          completedAt: new Date(),
          updatedAt: new Date()
        };

        if (invitation.report) {
          updateData.reportId = invitation.report.id;
          
          // Get report details
          try {
            const reportResponse = await fetch(`${process.env.CHECKR_API_BASE_URL}/v1/reports/${invitation.report.id}`, {
              headers: {
                'Authorization': `Basic ${Buffer.from(process.env.CHECKR_API_KEY + ':').toString('base64')}`,
                'Content-Type': 'application/json'
              }
            });

            if (reportResponse.ok) {
              const report = await reportResponse.json();
              updateData.checkrStatus = report.result || 'clear';
            }
          } catch (reportError) {
            console.log(`   ⚠️ Could not get report details`);
          }
        }

        await prisma.background_checks.update({
          where: { id: check.id },
          data: updateData
        });

        // Update user verification if needed
        if (check.candidateUserId) {
          await prisma.user.update({
            where: { id: check.candidateUserId },
            data: { isVerified: true }
          });
        }

        console.log(`   ✅ Synced to COMPLETED`);
        syncedCount++;

      } else if (invitation.status === 'cancelled' || invitation.status === 'expired') {
        await prisma.background_checks.update({
          where: { id: check.id },
          data: {
            status: invitation.status === 'cancelled' ? 'DECLINED' : 'EXPIRED',
            checkrStatus: invitation.status,
            updatedAt: new Date()
          }
        });

        console.log(`   ✅ Synced to ${invitation.status.toUpperCase()}`);
        syncedCount++;
      } else {
        console.log(`   ℹ️ Still ${invitation.status}`);
      }

    } catch (error) {
      console.log(`   ❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      errorCount++;
    }
  }

  console.log(`\n✅ Sync complete. Updated: ${syncedCount}, Errors: ${errorCount}`);
}

async function cleanupEmailRecords(email) {
  console.log(`🧹 COMPREHENSIVE CLEANUP FOR: ${email}`);
  console.log('=' .repeat(50));

  console.log('\n1️⃣ Fixing duplicate checks...');
  await fixDuplicateChecks(email);

  console.log('\n2️⃣ Fixing user links...');
  await fixUserLinks(email);

  console.log('\n3️⃣ Fixing verification status...');
  await fixVerificationStatus(email);

  console.log('\n4️⃣ Syncing with Checkr...');
  // Get checks for this email and sync them
  const emailChecks = await prisma.background_checks.findMany({
    where: { candidateEmail: email }
  });

  if (emailChecks.length > 0) {
    console.log(`📊 Found ${emailChecks.length} check(s) for this email`);
    
    for (const check of emailChecks) {
      if (check.invitationId && (check.status === 'PENDING' || check.status === 'IN_PROGRESS')) {
        try {
          const response = await fetch(`${process.env.CHECKR_API_BASE_URL}/v1/invitations/${check.invitationId}`, {
            headers: {
              'Authorization': `Basic ${Buffer.from(process.env.CHECKR_API_KEY + ':').toString('base64')}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const invitation = await response.json();
            console.log(`   📊 Check ${check.id}: DB=${check.status}, Checkr=${invitation.status}`);
            
            if (invitation.status === 'completed' && check.status !== 'COMPLETED') {
              await prisma.background_checks.update({
                where: { id: check.id },
                data: {
                  status: 'COMPLETED',
                  checkrStatus: 'clear',
                  completedAt: new Date(),
                  updatedAt: new Date()
                }
              });

              if (check.candidateUserId) {
                await prisma.user.update({
                  where: { id: check.candidateUserId },
                  data: { isVerified: true }
                });
              }

              console.log(`   ✅ Updated to COMPLETED`);
            }
          }
        } catch (error) {
          console.log(`   ❌ Error syncing check ${check.id}`);
        }
      }
    }
  }

  console.log('\n✅ Comprehensive cleanup completed!');
}

// Run the tool
main().catch(console.error); 