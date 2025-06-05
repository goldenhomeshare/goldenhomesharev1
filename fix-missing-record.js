#!/usr/bin/env node

/**
 * Fix Missing Background Check Records
 * 
 * This script finds completed background checks in Checkr that are missing from our database
 * and creates the appropriate records.
 */

const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function main() {
  const targetEmail = process.argv[2];
  
  if (!targetEmail) {
    console.log('Usage: node fix-missing-record.js <email>');
    return;
  }

  console.log(`🔍 Fixing missing record for: ${targetEmail}`);

  try {
    // Check if user exists
    const user = await prisma.user.findFirst({
      where: { email: targetEmail }
    });

    if (!user) {
      console.log('❌ User not found in database');
      return;
    }

    console.log(`✅ User found: ${user.id}`);

    // Check if background check record already exists
    const existingCheck = await prisma.background_checks.findFirst({
      where: { candidateEmail: targetEmail }
    });

    if (existingCheck) {
      console.log('✅ Background check record already exists:', existingCheck.id);
      return;
    }

    console.log('🔄 No background check record found, will search Checkr...');

    // Search Checkr for candidates with this email
    const checkrResponse = await fetch(`${process.env.CHECKR_API_BASE_URL}/v1/candidates`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(process.env.CHECKR_API_KEY + ':').toString('base64')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!checkrResponse.ok) {
      console.log('❌ Failed to fetch from Checkr:', checkrResponse.status);
      return;
    }

    const candidatesData = await checkrResponse.json();
    const candidates = candidatesData.data || candidatesData;

    console.log(`📊 Found ${candidates.length} total candidates in Checkr`);

    // Find candidate with matching email
    const matchingCandidate = candidates.find(c => c.email === targetEmail);

    if (!matchingCandidate) {
      console.log('❌ No matching candidate found in Checkr');
      return;
    }

    console.log(`✅ Found matching candidate: ${matchingCandidate.id}`);

    // Get invitations for this candidate
    const invitationsResponse = await fetch(`${process.env.CHECKR_API_BASE_URL}/v1/invitations?candidate_id=${matchingCandidate.id}`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(process.env.CHECKR_API_KEY + ':').toString('base64')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!invitationsResponse.ok) {
      console.log('❌ Failed to fetch invitations from Checkr:', invitationsResponse.status);
      return;
    }

    const invitationsData = await invitationsResponse.json();
    const invitations = invitationsData.data || invitationsData;

    console.log(`📊 Found ${invitations.length} invitation(s) for candidate`);

    if (invitations.length === 0) {
      console.log('❌ No invitations found');
      return;
    }

    // Get the most recent invitation
    const invitation = invitations[invitations.length - 1];
    console.log(`📧 Using invitation: ${invitation.id}, status: ${invitation.status}`);

    // Determine our database status based on Checkr status
    let dbStatus = 'PENDING';
    let checkrStatus = null;
    let completedAt = null;

    if (invitation.status === 'completed') {
      dbStatus = 'COMPLETED';
      checkrStatus = 'clear'; // Default, we'll try to get actual result
      completedAt = new Date();

      // Try to get the report for more details
      if (invitation.report) {
        try {
          const reportResponse = await fetch(`${process.env.CHECKR_API_BASE_URL}/v1/reports/${invitation.report.id}`, {
            headers: {
              'Authorization': `Basic ${Buffer.from(process.env.CHECKR_API_KEY + ':').toString('base64')}`,
              'Content-Type': 'application/json'
            }
          });

          if (reportResponse.ok) {
            const report = await reportResponse.json();
            checkrStatus = report.result || 'clear';
            console.log(`📋 Report result: ${checkrStatus}`);
          }
        } catch (reportError) {
          console.log('⚠️ Could not fetch report details');
        }
      }
    } else if (invitation.status === 'cancelled') {
      dbStatus = 'DECLINED';
      checkrStatus = 'cancelled';
    } else if (invitation.status === 'expired') {
      dbStatus = 'EXPIRED';
      checkrStatus = 'expired';
    }

    // Create the missing database record
    const backgroundCheckData = {
      id: crypto.randomUUID(),
      candidateId: matchingCandidate.id,
      invitationId: invitation.id,
      candidateEmail: targetEmail,
      candidateName: `${user.firstName || ''} ${user.lastName || ''}`,
      candidateUserId: user.id,
      invitationUrl: invitation.invitation_url,
      invitationStatus: invitation.status,
      status: dbStatus,
      checkrStatus: checkrStatus,
      completedAt: completedAt,
      invitationSentAt: invitation.created_at ? new Date(invitation.created_at) : new Date(),
      createdAt: invitation.created_at ? new Date(invitation.created_at) : new Date(),
      updatedAt: new Date(),
    };

    console.log('💾 Creating database record...');
    
    const savedRecord = await prisma.background_checks.create({
      data: backgroundCheckData
    });

    console.log(`✅ Created background check record: ${savedRecord.id}`);

    // Update user verification if completed
    if (dbStatus === 'COMPLETED') {
      await prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true }
      });
      console.log('✅ Updated user verification status');
    }

    console.log('🎉 Fix completed successfully!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error); 