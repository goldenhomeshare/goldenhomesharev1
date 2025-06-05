// Testing utilities for Checkr implementation

import { checkr } from '@/app/lib/checkr';
import { backgroundCheckService } from '@/app/lib/background-check-service';

export const mockCandidateData = {
  email: 'test@example.com',
  first_name: 'John',
  last_name: 'Doe',
  copy_requested: true,
  custom_id: 'test-user-123', // REQUIRED: Unique ID for cross-reference
  work_locations: [{ // REQUIRED: Work location for candidate
    country: 'US',
    state: 'CA',
    city: 'San Francisco', // RECOMMENDED: City for US checks
  }],
};

export const mockInvitationData = {
  candidate_id: 'cand_test_123',
  package: 'basic_plus_criminal',
  work_locations: [{
    country: 'US',
    state: 'CA',
  }],
};

export const mockWebhookEvents = {
  invitationCompleted: {
    id: 'evt_test_invitation_completed',
    type: 'invitation.completed',
    created_at: new Date().toISOString(),
    data: {
      object: {
        id: 'inv_test_123',
        status: 'completed',
        candidate_id: 'cand_test_123',
        report_id: 'report_test_123',
      }
    }
  },

  reportCompleted: {
    id: 'evt_test_report_completed',
    type: 'report.completed',
    created_at: new Date().toISOString(),
    data: {
      object: {
        id: 'report_test_123',
        status: 'complete',
        result: 'clear',
        candidate_id: 'cand_test_123',
        package: 'basic_plus_criminal',
        created_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
      }
    }
  },

  invitationExpired: {
    id: 'evt_test_invitation_expired',
    type: 'invitation.expired',
    created_at: new Date().toISOString(),
    data: {
      object: {
        id: 'inv_test_123',
        status: 'expired',
        candidate_id: 'cand_test_123',
      }
    }
  }
};

export const mockUser = {
  id: 'user_test_123',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  isVerified: false,
};

export class CheckrTestUtils {
  static async testCheckrConnection() {
    try {
      console.log('🔍 Testing Checkr API connection...');
      
      const environment = checkr.getEnvironment();
      console.log('📊 Environment:', environment);
      
      // Test getting packages (doesn't require candidate creation)
      const packages = await checkr.getPackages();
      console.log('📦 Available packages:', packages.data?.length || 0);
      
      return {
        success: true,
        environment,
        packagesAvailable: packages.data?.length || 0,
      };
    } catch (error) {
      console.error('❌ Checkr connection test failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  static async testCandidateCreation() {
    try {
      console.log('👤 Testing candidate creation...');
      
      const candidate = await checkr.createCandidate(mockCandidateData);
      console.log('✅ Candidate created:', candidate.id);
      
      return {
        success: true,
        candidateId: candidate.id,
        candidate,
      };
    } catch (error) {
      console.error('❌ Candidate creation test failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  static async testInvitationCreation(candidateId: string) {
    try {
      console.log('📨 Testing invitation creation...');
      
      const invitation = await checkr.createInvitation({
        ...mockInvitationData,
        candidate_id: candidateId,
      });
      
      console.log('✅ Invitation created:', invitation.id);
      console.log('🔗 Invitation URL:', invitation.invitation_url);
      
      return {
        success: true,
        invitationId: invitation.id,
        invitationUrl: invitation.invitation_url,
        invitation,
      };
    } catch (error) {
      console.error('❌ Invitation creation test failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  static async testDatabaseOperations() {
    try {
      console.log('🗄️ Testing database operations...');
      
      // Test user validation
      const validation = await backgroundCheckService.validateUserForBackgroundCheck('nonexistent-user');
      console.log('📋 User validation (should fail):', validation);
      
      return {
        success: true,
        validation,
      };
    } catch (error) {
      console.error('❌ Database operations test failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  static async runFullTest() {
    console.log('🧪 Starting comprehensive Checkr test...\n');
    
    const results = {
      connection: await this.testCheckrConnection(),
      database: await this.testDatabaseOperations(),
      candidate: null as any,
      invitation: null as any,
    };

    // Only test candidate/invitation creation if connection works
    if (results.connection.success) {
      results.candidate = await this.testCandidateCreation();
      
      if (results.candidate.success) {
        results.invitation = await this.testInvitationCreation(results.candidate.candidateId);
      }
    }

    console.log('\n📊 Test Summary:');
    console.log('Connection:', results.connection.success ? '✅' : '❌');
    console.log('Database:', results.database.success ? '✅' : '❌');
    console.log('Candidate:', results.candidate?.success ? '✅' : '❌');
    console.log('Invitation:', results.invitation?.success ? '✅' : '❌');

    return results;
  }

  static simulateWebhookEvent(eventType: keyof typeof mockWebhookEvents) {
    const event = mockWebhookEvents[eventType];
    console.log(`🔔 Simulating webhook event: ${eventType}`);
    console.log('Event data:', JSON.stringify(event, null, 2));
    return event;
  }

  static async testEndpoint(endpoint: string, method: 'GET' | 'POST' = 'GET', body?: any) {
    try {
      const url = `http://localhost:3000/api/checkr/${endpoint}`;
      console.log(`🌐 Testing ${method} ${url}`);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json();
      
      console.log(`📊 Response: ${response.status} ${response.statusText}`);
      console.log('Data:', JSON.stringify(data, null, 2));
      
      return {
        success: response.ok,
        status: response.status,
        data,
      };
    } catch (error) {
      console.error(`❌ Endpoint test failed:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// Export for use in test scripts
export default CheckrTestUtils; 