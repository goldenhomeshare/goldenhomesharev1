'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, CheckCircle, AlertCircle, RefreshCw, StopCircle, Loader2 } from 'lucide-react';

interface TestResult {
  endpoint: string;
  status: number;
  data: any;
  timestamp: string;
  success: boolean;
}

interface HostedCheckForm {
  firstName: string;           // REQUIRED*
  middleName: string;          // Optional (if captured)
  lastName: string;            // REQUIRED*
  email: string;              // REQUIRED*
  phone: string;              // Optional but recommended
  zipcode: string;            // Optional but recommended
  workLocation: {             // REQUIRED*
    country: string;          // REQUIRED* (two-character ISO country abbreviation)
    state: string;            // REQUIRED* (two-character ISO state abbreviation for US checks)
    city: string;             // REQUIRED* (required for background checks)
  };
  package: string;
}

interface StatusCheckForm {
  invitationId: string;
  candidateId: string;
  email: string;
}

interface StatusResult {
  success: boolean;
  data?: {
    status: {
      invitation: string;
      report: string;
      overall: string;
    };
    result: string;
    summary: {
      isComplete: boolean;
      isClear: boolean;
      isConsider: boolean;
      isPending: boolean;
      isExpired: boolean;
      message: string;
    };
    candidate?: {
      name: string;
      email: string;
    };
    invitation?: {
      status: string;
      createdAt: string;
      completedAt?: string;
      expiresAt: string;
      package: string;
    };
    report?: {
      status: string;
      result: string;
      createdAt: string;
      completedAt?: string;
      screenings: any[];
    };
  };
  error?: string;
}

interface PollingData {
  candidateId?: string;
  invitationId?: string;
  email?: string;
  startTime: string;
  checks: number;
}

interface PollingStatus {
  isPolling: boolean;
  data: PollingData | null;
  currentStatus: StatusResult | null;
  lastCheck: string | null;
}

export default function TestCheckrPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<string>('checking...');
  const [hostedCheckForm, setHostedCheckForm] = useState<HostedCheckForm>({
    firstName: 'John',                    // REQUIRED*
    middleName: '',                       // Optional (leave empty for this test)
    lastName: 'Doe',                      // REQUIRED*
    email: 'john.doe.test@gmail.com',     // REQUIRED*
    phone: '+1234567890',                 // Optional but recommended
    zipcode: '12345',                     // Optional but recommended
    workLocation: {                       // REQUIRED*
      country: 'US',                      // REQUIRED* (two-character ISO country code)
      state: 'CA',                        // REQUIRED* (two-character ISO state code for US)
      city: 'San Francisco',              // RECOMMENDED (highly recommended for US)
    },
    package: 'basic_for_golden_homeshare',
  });
  const [showHostedForm, setShowHostedForm] = useState(false);
  const [statusCheckForm, setStatusCheckForm] = useState<StatusCheckForm>({
    invitationId: '',
    candidateId: '',
    email: '',
  });
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [statusResult, setStatusResult] = useState<StatusResult | null>(null);
  const [pollingStatus, setPollingStatus] = useState<PollingStatus>({
    isPolling: false,
    data: null,
    currentStatus: null,
    lastCheck: null,
  });
  
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check authentication status on page load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/user');
        if (response.ok) {
          const user = await response.json();
          setAuthStatus(user?.email ? `✅ Authenticated as: ${user.email}` : '❌ Not authenticated');
        } else {
          setAuthStatus('🔓 Not authenticated (testing mode)');
        }
      } catch (error) {
        setAuthStatus('⚠️ Authentication check failed - server may be starting');
        console.error('Auth check error:', error);
      }
    };
    
    // Add a small delay to let the page render first
    const timer = setTimeout(checkAuth, 500);
    return () => clearTimeout(timer);
  }, []);

  const addResult = (endpoint: string, status: number, data: any, success: boolean) => {
    const result: TestResult = {
      endpoint,
      status,
      data,
      timestamp: new Date().toLocaleTimeString(),
      success
    };
    setResults(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results
  };

  const testEndpoint = async (endpoint: string, method: 'GET' | 'POST', body?: any) => {
    setLoading(endpoint);
    try {
      const response = await fetch(`/api/checkr/${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json();
      addResult(endpoint, response.status, data, response.ok);
    } catch (error) {
      addResult(endpoint, 0, { error: error instanceof Error ? error.message : 'Network error' }, false);
    } finally {
      setLoading(null);
    }
  };

  const testInitiate = () => testEndpoint('initiate', 'POST', {
    package: 'basic_plus_criminal',
    includeDocuments: false
  });

  const testStatus = () => testEndpoint('status', 'GET');
  const testVerifyStatus = () => testEndpoint('verify-status', 'GET');
  
  const testWebhook = () => testEndpoint('webhook', 'POST', {
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
  });

  const testNodes = () => testEndpoint('nodes', 'GET');
  const testETA = () => testEndpoint('eta', 'GET');
  const testAccountInfo = () => testEndpoint('account-info', 'GET');
  
  const testCanceledWebhook = () => testEndpoint('webhook', 'POST', {
    id: 'test-event-canceled-' + Date.now(),
    type: 'report.canceled',
    created_at: new Date().toISOString(),
    data: {
      object: {
        id: 'report_test_canceled_123',
        status: 'canceled',
        candidate_id: 'cand_test_123',
        package: 'basic_plus_criminal',
        created_at: new Date().toISOString(),
      }
    }
  });

  const testPartialCompleteWebhook = () => testEndpoint('webhook', 'POST', {
    id: 'test-event-partial-' + Date.now(),
    type: 'report.completed',
    created_at: new Date().toISOString(),
    data: {
      object: {
        id: 'report_test_partial_123',
        status: 'complete',
        result: 'clear',
        includes_canceled: true,
        candidate_id: 'cand_test_123',
        package: 'basic_plus_criminal',
        screenings: [
          { id: 'screening_1', status: 'complete', type: 'ssn_trace' },
          { id: 'screening_2', status: 'canceled', type: 'county_criminal' }
        ],
        created_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
      }
    }
  });

  const testETAWebhook = () => testEndpoint('webhook', 'POST', {
    id: 'test-event-eta-' + Date.now(),
    type: 'report.updated',
    created_at: new Date().toISOString(),
    data: {
      object: {
        id: 'report_test_eta_123',
        status: 'pending',
        estimated_completion_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
        candidate_id: 'cand_test_123',
        package: 'basic_plus_criminal',
        created_at: new Date().toISOString(),
      }
    }
  });

  const testHostedCheck = async () => {
    // Basic validation
    if (!hostedCheckForm.firstName || !hostedCheckForm.lastName || !hostedCheckForm.email || !hostedCheckForm.workLocation.city || !hostedCheckForm.workLocation.country || !hostedCheckForm.workLocation.state) {
      window.alert('Please fill in all required fields (First Name, Last Name, Email, Country, State, and City)');
      return;
    }

    setLoading('create-hosted-check');
    try {
      const response = await fetch('/api/checkr/create-hosted-check-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(hostedCheckForm),
      });

      const data = await response.json();
      addResult('create-hosted-check', response.status, data, response.ok);

      // If successful, handle the response
      if (response.ok && data.data) {
        const { candidateId, invitationId, isExisting } = data.data;
        
        if (isExisting) {
          // Existing completed background check found
          window.alert(
            '✅ Existing Background Check Found!\n\n' +
            `Status: ${data.data.status}\n` +
            `Result: ${data.data.result || 'Completed'}\n` +
            `Completed: ${data.data.completedAt ? new Date(data.data.completedAt).toLocaleDateString() : 'N/A'}\n\n` +
            'No new background check needed - this email already has a completed and clear background check.'
          );
        } else {
          // New background check created
          // Start automatic polling every 10 seconds
          startPolling(candidateId, invitationId, hostedCheckForm.email);
          
          // Show option to open the hosted flow
          if (data.data.invitationUrl) {
            const shouldOpen = window.confirm(
              'Background check invitation created successfully!\n\n' +
              'Automatic status polling has started (every 10 seconds).\n\n' +
              'Would you like to open the Checkr hosted flow in a new tab?\n\n' +
              'This will take you to Checkr\'s secure site where the candidate would complete their background check.'
            );
            
            if (shouldOpen) {
              window.open(data.data.invitationUrl, '_blank');
            }
          }
        }
      }
    } catch (error) {
      addResult('create-hosted-check', 0, { error: error instanceof Error ? error.message : 'Network error' }, false);
    } finally {
      setLoading(null);
    }
  };

  const testAuthenticatedHostedCheck = async () => {
    setLoading('create-authenticated-check');
    try {
      const response = await fetch('/api/checkr/create-hosted-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}), // Empty body - uses authenticated user's data
      });

      const data = await response.json();
      addResult('create-authenticated-check', response.status, data, response.ok);

      // If successful, handle the response
      if (response.ok && data.data) {
        const { candidateId, invitationId, isExisting } = data.data;
        
        if (isExisting) {
          // Existing completed background check found
          window.alert(
            '✅ Existing Background Check Found!\n\n' +
            `Status: ${data.data.status}\n` +
            `Result: ${data.data.result || 'Completed'}\n` +
            `Completed: ${data.data.completedAt ? new Date(data.data.completedAt).toLocaleDateString() : 'N/A'}\n\n` +
            'No new background check needed - your email already has a completed and clear background check.'
          );
        } else {
          // New background check created
          window.alert(
            '✅ Background Check Created!\n\n' +
            'A background check invitation has been created using your profile information.\n\n' +
            'The invitation URL has been generated and is ready for completion.'
          );
          
          // Show option to open the hosted flow
          if (data.data.invitationUrl) {
            const shouldOpen = window.confirm(
              'Would you like to open the Checkr hosted flow to complete your background check?\n\n' +
              'This will take you to Checkr\'s secure site where you can complete your background check.'
            );
            
            if (shouldOpen) {
              window.open(data.data.invitationUrl, '_blank');
            }
          }
        }
      }

    } catch (error) {
      console.error('Error creating authenticated hosted check:', error);
      addResult('create-authenticated-check', 0, { error: error instanceof Error ? error.message : 'Network error' }, false);
    } finally {
      setLoading(null);
    }
  };

  const checkStatus = async () => {
    setLoading('check-status');
    try {
      const requestData: any = {};
      if (statusCheckForm.invitationId.trim()) {
        requestData.invitationId = statusCheckForm.invitationId.trim();
      }
      if (statusCheckForm.candidateId.trim()) {
        requestData.candidateId = statusCheckForm.candidateId.trim();
      }
      if (statusCheckForm.email.trim()) {
        requestData.email = statusCheckForm.email.trim();
      }

      if (!requestData.invitationId && !requestData.candidateId && !requestData.email) {
        throw new Error('Please provide either an Invitation ID, Candidate ID, or Email Address');
      }

      const response = await fetch('/api/checkr/check-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      setStatusResult(data);
      addResult('check-status', response.status, data, response.ok);
    } catch (error) {
      const errorResult = { 
        success: false, 
        error: error instanceof Error ? error.message : 'Network error' 
      };
      setStatusResult(errorResult);
      addResult('check-status', 0, errorResult, false);
    } finally {
      setLoading(null);
    }
  };

  const clearResults = () => {
    setResults([]);
    setStatusResult(null);
  };

  // Polling functions
  const startPolling = (candidateId?: string, invitationId?: string, email?: string) => {
    console.log('[Polling] Starting status polling for:', { candidateId, invitationId, email });
    
    // Stop any existing polling
    stopPolling();
    
    const pollingData: PollingData = {
      candidateId,
      invitationId,
      email,
      startTime: new Date().toISOString(),
      checks: 0,
    };
    
    setPollingStatus({
      isPolling: true,
      data: pollingData,
      currentStatus: null,
      lastCheck: null,
    });
    
    // Start polling immediately
    checkStatusForPolling();
    
    // Set up interval for every 10 seconds
    pollingIntervalRef.current = setInterval(() => {
      checkStatusForPolling();
    }, 10000);
  };

  const stopPolling = () => {
    console.log('[Polling] Stopping status polling');
    
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    
    setPollingStatus(prev => ({
      ...prev,
      isPolling: false,
    }));
  };

  const checkStatusForPolling = async () => {
    try {
      // Get current polling status
      setPollingStatus(prev => {
        if (!prev.data) return prev;
        
        const requestData: any = {};
        if (prev.data.invitationId) requestData.invitationId = prev.data.invitationId;
        if (prev.data.candidateId) requestData.candidateId = prev.data.candidateId;
        if (prev.data.email) requestData.email = prev.data.email;

        console.log('[Polling] Checking status, attempt:', prev.data.checks + 1);
        
        // Perform the API call
        fetch('/api/checkr/check-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        })
        .then(response => response.json())
        .then((result: StatusResult) => {
          console.log('[Polling] Status check result:', result.data?.summary);
          
          // Update state with result
          setPollingStatus(current => ({
            ...current,
            data: current.data ? { ...current.data, checks: current.data.checks + 1 } : null,
            currentStatus: result,
            lastCheck: new Date().toISOString(),
          }));

          // Stop polling if status is no longer pending
          if (result.success && result.data?.summary && !result.data.summary.isPending) {
            console.log('[Polling] Non-pending status received, stopping polling');
            stopPolling();
            
            // Add final result to the results list
            addResult('auto-poll-final', 200, result, true);
          }
        })
        .catch(error => {
          console.error('[Polling] Error checking status:', error);
          
          // Update state even on error
          setPollingStatus(current => ({
            ...current,
            data: current.data ? { ...current.data, checks: current.data.checks + 1 } : null,
            lastCheck: new Date().toISOString(),
          }));
        });
        
        return prev;
      });
      
    } catch (error) {
      console.error('[Polling] Outer error checking status:', error);
    }
  };

  // Clean up polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Checkr Implementation Test</h1>
        <p className="text-muted-foreground">
          Test the Checkr background check integration endpoints
        </p>
        <div className="mt-2 text-sm text-gray-600">
          Auth Status: {authStatus}
        </div>
      </div>

      {/* Real-time Polling Status */}
      {(pollingStatus.isPolling || pollingStatus.currentStatus) && (
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {pollingStatus.isPolling ? (
                  <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
                ) : pollingStatus.currentStatus?.data?.summary?.isComplete ? (
                  pollingStatus.currentStatus.data.summary.isClear ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                  )
                ) : (
                  <Clock className="w-5 h-5 text-gray-600" />
                )}
                <div>
                  <CardTitle className="text-lg text-blue-900">
                    {pollingStatus.isPolling ? 'Auto-Polling Status' : 'Final Status Result'}
                  </CardTitle>
                  <p className="text-blue-700 text-sm">
                    {pollingStatus.isPolling 
                      ? `Checking every 10 seconds • ${pollingStatus.data?.checks || 0} checks completed`
                      : 'Polling completed - final status received'
                    }
                  </p>
                </div>
              </div>
              {pollingStatus.isPolling && (
                <Button
                  onClick={stopPolling}
                  variant="outline"
                  size="sm"
                  className="border-red-300 text-red-700 hover:bg-red-100"
                >
                  <StopCircle className="w-4 h-4 mr-2" />
                  Stop Polling
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Polling Details */}
              {pollingStatus.data && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Started:</span>
                    <span className="ml-2 font-medium">
                      {new Date(pollingStatus.data.startTime).toLocaleTimeString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Checks:</span>
                    <span className="ml-2 font-medium">{pollingStatus.data.checks}</span>
                  </div>
                  {pollingStatus.lastCheck && (
                    <div>
                      <span className="text-gray-600">Last Check:</span>
                      <span className="ml-2 font-medium">
                        {new Date(pollingStatus.lastCheck).toLocaleTimeString()}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Current Status */}
              {pollingStatus.currentStatus?.data && (
                <div className="border rounded-lg p-4 bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <h4 className="font-semibold">Current Status:</h4>
                    <Badge 
                      variant={
                        pollingStatus.currentStatus.data.summary.isComplete
                          ? pollingStatus.currentStatus.data.summary.isClear
                            ? "default"
                            : "secondary"
                          : "outline"
                      }
                    >
                      {pollingStatus.currentStatus.data.summary.isComplete
                        ? pollingStatus.currentStatus.data.summary.isClear
                          ? "✅ Clear"
                          : "⚠️ Consider"
                        : "⏳ Pending"
                      }
                    </Badge>
                  </div>
                  <p className="text-gray-700 mb-3">
                    {pollingStatus.currentStatus.data.summary.message}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Overall:</span>
                      <span className="ml-2 font-medium capitalize">
                        {pollingStatus.currentStatus.data.status.overall}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Invitation:</span>
                      <span className="ml-2 font-medium capitalize">
                        {pollingStatus.currentStatus.data.status.invitation}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Report:</span>
                      <span className="ml-2 font-medium capitalize">
                        {pollingStatus.currentStatus.data.status.report}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Error State */}
              {pollingStatus.currentStatus && !pollingStatus.currentStatus.success && (
                <div className="border rounded-lg p-4 bg-red-50 border-red-200">
                  <h4 className="font-semibold text-red-900 mb-2">Error</h4>
                  <p className="text-red-700">
                    {pollingStatus.currentStatus.error || 'Unknown error occurred'}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Test Controls */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Endpoint Tests</CardTitle>
              <CardDescription>
                Test each Checkr API endpoint to verify functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={testStatus}
                disabled={loading === 'status'}
                className="w-full"
                variant="outline"
              >
                {loading === 'status' ? 'Testing...' : 'Test Status Endpoint'}
              </Button>

              <Button 
                onClick={testVerifyStatus}
                disabled={loading === 'verify-status'}
                className="w-full"
                variant="outline"
              >
                {loading === 'verify-status' ? 'Testing...' : 'Test Verify Status'}
              </Button>

              <Button 
                onClick={testInitiate}
                disabled={loading === 'initiate'}
                className="w-full"
                variant="default"
              >
                {loading === 'initiate' ? 'Testing...' : 'Test Initiate Background Check'}
              </Button>

              <Button 
                onClick={() => testEndpoint('webhook', 'POST', {
                  id: 'test-webhook-' + Date.now(),
                  type: 'report.completed',
                  created_at: new Date().toISOString(),
                  data: {
                    object: {
                      id: 'report_test123',
                      status: 'complete',
                      result: 'clear',
                      assessment: 'eligible',
                      includes_canceled: false,
                      candidate_id: 'candidate_test123',
                      screenings: []
                    }
                  }
                })}
                disabled={loading === 'webhook'}
                className="w-full"
              >
                {loading === 'webhook' ? 'Testing...' : 'Test Webhook Handler'}
              </Button>

              <Button 
                onClick={() => testEndpoint('webhook', 'POST', {
                  id: 'test-invitation-created-' + Date.now(),
                  type: 'invitation.created',
                  created_at: new Date().toISOString(),
                  data: {
                    object: {
                      id: 'invitation_test123',
                      status: 'pending',
                      candidate_id: 'candidate_test123'
                    }
                  }
                })}
                disabled={loading === 'webhook'}
                className="w-full"
              >
                {loading === 'webhook' ? 'Testing...' : 'Test Invitation Created'}
              </Button>

              <Button 
                onClick={() => testEndpoint('webhook', 'POST', {
                  id: 'test-invitation-expired-' + Date.now(),
                  type: 'invitation.expired',
                  created_at: new Date().toISOString(),
                  data: {
                    object: {
                      id: 'invitation_test123',
                      status: 'expired',
                      candidate_id: 'candidate_test123'
                    }
                  }
                })}
                disabled={loading === 'webhook'}
                className="w-full"
              >
                {loading === 'webhook' ? 'Testing...' : 'Test Invitation Expired'}
              </Button>

              <Button 
                onClick={() => testEndpoint('webhook', 'POST', {
                  id: 'test-pre-adverse-' + Date.now(),
                  type: 'report.pre_adverse_action',
                  created_at: new Date().toISOString(),
                  data: {
                    object: {
                      id: 'report_test123',
                      status: 'complete',
                      result: 'consider',
                      assessment: 'review',
                      adjudication: 'pre_adverse_action',
                      candidate_id: 'candidate_test123'
                    }
                  }
                })}
                disabled={loading === 'webhook'}
                className="w-full"
              >
                {loading === 'webhook' ? 'Testing...' : 'Test Pre-Adverse Action'}
              </Button>

              <Button 
                onClick={() => testEndpoint('webhook', 'POST', {
                  id: 'test-suspended-' + Date.now(),
                  type: 'report.suspended',
                  created_at: new Date().toISOString(),
                  data: {
                    object: {
                      id: 'report_test123',
                      status: 'suspended',
                      candidate_id: 'candidate_test123'
                    }
                  }
                })}
                disabled={loading === 'webhook'}
                className="w-full"
              >
                {loading === 'webhook' ? 'Testing...' : 'Test Report Suspended'}
              </Button>

              <Button 
                onClick={() => testEndpoint('webhook', 'POST', {
                  id: 'test-engaged-' + Date.now(),
                  type: 'report.engaged',
                  created_at: new Date().toISOString(),
                  data: {
                    object: {
                      id: 'report_test123',
                      status: 'complete',
                      result: 'consider',
                      assessment: 'review',
                      adjudication: 'engaged',
                      candidate_id: 'candidate_test123'
                    }
                  }
                })}
                disabled={loading === 'webhook'}
                className="w-full"
              >
                {loading === 'webhook' ? 'Testing...' : 'Test Report Engaged'}
              </Button>

              <Button 
                onClick={() => testEndpoint('webhook', 'POST', {
                  id: 'test-assess-eligible-' + Date.now(),
                  type: 'report.completed',
                  created_at: new Date().toISOString(),
                  data: {
                    object: {
                      id: 'report_test123',
                      status: 'complete',
                      result: 'consider',
                      assessment: 'eligible', // Assess marked as eligible despite consider result
                      includes_canceled: false,
                      candidate_id: 'candidate_test123',
                      screenings: []
                    }
                  }
                })}
                disabled={loading === 'webhook'}
                className="w-full"
              >
                {loading === 'webhook' ? 'Testing...' : 'Test Assess Override (Eligible)'}
              </Button>

              <Separator />

              <Button 
                onClick={clearResults}
                variant="ghost"
                size="sm"
                className="w-full"
              >
                Clear Results
              </Button>
            </CardContent>
          </Card>

          {/* Authenticated Background Check Card */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800">✨ Authenticated Background Check</CardTitle>
              <CardDescription className="text-green-700">
                Create a background check using your logged-in user profile (automatic email detection)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <p className="text-sm text-green-700 mb-3">
                  This uses your Kinde authentication session to automatically populate your email and profile information.
                  No manual input required!
                </p>
                <Button 
                  onClick={testAuthenticatedHostedCheck}
                  disabled={loading === 'create-authenticated-check'}
                  className="bg-green-600 hover:bg-green-700 w-full"
                >
                  {loading === 'create-authenticated-check' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create My Background Check'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hosted Background Check (Manual Testing)</CardTitle>
              <CardDescription>
                Create a background check invitation with manual input for testing purposes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => setShowHostedForm(!showHostedForm)}
                variant="outline"
                className="w-full"
              >
                {showHostedForm ? 'Hide' : 'Show'} Hosted Check Form
              </Button>
              
                            {showHostedForm && (
                <div className="space-y-6 border rounded-lg p-6 bg-white shadow-sm">
                  {/* Header */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Background Check Form</h4>
                    <p className="text-sm text-blue-700">All fields marked with * are required by Checkr API</p>
                  </div>

                  {/* Personal Information Section */}
                  <div className="space-y-4">
                    <h5 className="font-medium text-gray-900 border-b pb-2">Personal Information</h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="text-sm font-medium">First Name *</Label>
                        <Input
                          id="firstName"
                          value={hostedCheckForm.firstName}
                          onChange={(e) => setHostedCheckForm(prev => ({ ...prev, firstName: e.target.value }))}
                          placeholder="John"
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="middleName" className="text-sm font-medium">Middle Name</Label>
                        <Input
                          id="middleName"
                          value={hostedCheckForm.middleName}
                          onChange={(e) => setHostedCheckForm(prev => ({ ...prev, middleName: e.target.value }))}
                          placeholder="Optional"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-sm font-medium">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={hostedCheckForm.lastName}
                          onChange={(e) => setHostedCheckForm(prev => ({ ...prev, lastName: e.target.value }))}
                          placeholder="Doe"
                          className="mt-1"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={hostedCheckForm.email}
                        onChange={(e) => setHostedCheckForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="john.doe@gmail.com"
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>

                  {/* Contact Information Section */}
                  <div className="space-y-4">
                    <h5 className="font-medium text-gray-900 border-b pb-2">Contact Information</h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
                        <Input
                          id="phone"
                          value={hostedCheckForm.phone}
                          onChange={(e) => setHostedCheckForm(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+1234567890"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipcode" className="text-sm font-medium">Zipcode</Label>
                        <Input
                          id="zipcode"
                          value={hostedCheckForm.zipcode}
                          onChange={(e) => setHostedCheckForm(prev => ({ ...prev, zipcode: e.target.value }))}
                          placeholder="12345"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Work Location Section */}
                  <div className="space-y-4">
                    <h5 className="font-medium text-gray-900 border-b pb-2">Work Location *</h5>
                    <p className="text-sm text-gray-600">Required by Checkr for background check processing</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="country" className="text-sm font-medium">Country *</Label>
                        <Input
                          id="country"
                          value={hostedCheckForm.workLocation.country}
                          onChange={(e) => setHostedCheckForm(prev => ({ 
                            ...prev, 
                            workLocation: { ...prev.workLocation, country: e.target.value }
                          }))}
                          placeholder="US"
                          className="mt-1"
                          maxLength={2}
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">2-character ISO code</p>
                      </div>
                      <div>
                        <Label htmlFor="state" className="text-sm font-medium">State *</Label>
                        <Input
                          id="state"
                          value={hostedCheckForm.workLocation.state}
                          onChange={(e) => setHostedCheckForm(prev => ({ 
                            ...prev, 
                            workLocation: { ...prev.workLocation, state: e.target.value }
                          }))}
                          placeholder="CA"
                          className="mt-1"
                          maxLength={2}
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">2-character ISO code</p>
                      </div>
                      <div>
                        <Label htmlFor="city" className="text-sm font-medium">City *</Label>
                        <Input
                          id="city"
                          value={hostedCheckForm.workLocation.city}
                          onChange={(e) => setHostedCheckForm(prev => ({ 
                            ...prev, 
                            workLocation: { ...prev.workLocation, city: e.target.value }
                          }))}
                          placeholder="San Francisco"
                          className="mt-1"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">Required for background checks</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Package Selection */}
                  <div className="space-y-4">
                    <h5 className="font-medium text-gray-900 border-b pb-2">Package Selection</h5>
                    
                    <div>
                      <Label htmlFor="package" className="text-sm font-medium">Background Check Package</Label>
                      <Select value={hostedCheckForm.package} onValueChange={(value) => setHostedCheckForm(prev => ({ ...prev, package: value }))}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select a package" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic_for_golden_homeshare">Basic for Golden HomeShare</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* API Payload Preview */}
                  <div className="space-y-4">
                    <h5 className="font-medium text-gray-900 border-b pb-2">API Payload Preview</h5>
                    
                    <div className="bg-gray-50 border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">📋</span>
                        <h6 className="font-medium text-gray-800">Checkr API Request Data</h6>
                      </div>
                      <pre className="text-xs bg-white p-4 rounded border overflow-x-auto text-gray-700">
{JSON.stringify({
  email: hostedCheckForm.email,
  first_name: hostedCheckForm.firstName,
  last_name: hostedCheckForm.lastName,
  ...(hostedCheckForm.middleName && { middle_name: hostedCheckForm.middleName }),
  phone: hostedCheckForm.phone,
  zipcode: hostedCheckForm.zipcode,
  copy_requested: true,
  work_locations: [hostedCheckForm.workLocation]
}, null, 2)}
                      </pre>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-4 border-t">
                    <Button 
                      onClick={testHostedCheck}
                      disabled={loading === 'create-hosted-check'}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      size="lg"
                    >
                      {loading === 'create-hosted-check' ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating Invitation...
                        </>
                      ) : (
                        'Create Hosted Background Check'
                      )}
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground space-y-1">
                    <p><strong>What this does:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Creates a candidate in Checkr with the provided details</li>
                      <li>Generates an invitation for the hosted flow</li>
                      <li>Returns a secure URL that opens Checkr's interface</li>
                      <li>Candidate completes background check on Checkr's site</li>
                      <li>Results are sent back via webhook when complete</li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Check Background Check Status</CardTitle>
              <CardDescription>
                Check the status and results of existing background checks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">✨ New: Automatic Status Check</h4>
                <p className="text-blue-700 text-sm mb-3">
                  Check your background check status automatically using your login session - no manual input required!
                </p>
                <Button 
                  onClick={() => window.open('/my-background-check', '_blank')}
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                >
                  View My Status (Automatic)
                </Button>
              </div>
              <Button 
                onClick={() => setShowStatusForm(!showStatusForm)}
                variant="outline"
                className="w-full"
              >
                {showStatusForm ? 'Hide' : 'Show'} Status Check Form
              </Button>
              
              {showStatusForm && (
                <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
                  <div>
                    <Label htmlFor="invitationId">Invitation ID</Label>
                    <Input
                      id="invitationId"
                      value={statusCheckForm.invitationId}
                      onChange={(e) => setStatusCheckForm(prev => ({ ...prev, invitationId: e.target.value }))}
                      placeholder="e.g., 301fa25e5210ddcd66134416"
                    />
                  </div>
                  
                  <div className="text-center text-muted-foreground text-sm">OR</div>
                  
                  <div>
                    <Label htmlFor="candidateId">Candidate ID</Label>
                    <Input
                      id="candidateId"
                      value={statusCheckForm.candidateId}
                      onChange={(e) => setStatusCheckForm(prev => ({ ...prev, candidateId: e.target.value }))}
                      placeholder="e.g., ec82b0178e71e07314ac439a"
                    />
                  </div>
                  
                  <div className="text-center text-muted-foreground text-sm">OR</div>
                  
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={statusCheckForm.email}
                      onChange={(e) => setStatusCheckForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="e.g., john.doe@gmail.com"
                    />
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <h4 className="font-medium text-blue-800 mb-2">Test with Completed Reports:</h4>
                    <p className="text-xs text-blue-700 mb-2">
                      Try these candidate IDs that have completed background checks:
                    </p>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <code className="bg-white px-2 py-1 rounded font-mono">d9c2415a8f0c8ff5fefbca96</code>
                        <span className="text-green-600">Homer Simpson (Clear)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="bg-white px-2 py-1 rounded font-mono">a57ed06ce129354149926d37</code>
                        <span className="text-green-600">George Grey (Clear)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="bg-white px-2 py-1 rounded font-mono">fdf7c597c4ce305dc76bde2a</code>
                        <span className="text-yellow-600">Jennifer Aniston (Consider)</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={checkStatus}
                    disabled={loading === 'check-status'}
                    className="w-full"
                    size="lg"
                  >
                    {loading === 'check-status' ? 'Checking Status...' : 'Check Status'}
                  </Button>

                  <div className="text-xs text-muted-foreground space-y-1">
                    <p><strong>What this shows:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Current status of the background check</li>
                      <li>Whether the check is clear or needs review</li>
                      <li>Detailed results and screening information</li>
                      <li>Timeline of the background check process</li>
                    </ul>
                    <p className="mt-2"><strong>Tip:</strong> You can use any of the three fields above. Email is the most user-friendly option!</p>
                  </div>
                </div>
              )}

              {statusResult && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-semibold">Status Check Results</h3>
                  
                  {statusResult.success && statusResult.data ? (
                    <div className="space-y-4">
                      {/* Summary Card */}
                      <div className={`p-4 rounded-lg border-2 ${
                        statusResult.data.summary.isClear ? 'bg-green-50 border-green-200' :
                        statusResult.data.summary.isConsider ? 'bg-yellow-50 border-yellow-200' :
                        statusResult.data.summary.isExpired ? 'bg-red-50 border-red-200' :
                        'bg-blue-50 border-blue-200'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={
                            statusResult.data.summary.isClear ? 'default' :
                            statusResult.data.summary.isConsider ? 'secondary' :
                            statusResult.data.summary.isExpired ? 'destructive' :
                            'outline'
                          }>
                            {statusResult.data.summary.isClear ? '✅ CLEAR' :
                             statusResult.data.summary.isConsider ? '⚠️ CONSIDER' :
                             statusResult.data.summary.isExpired ? '❌ EXPIRED' :
                             '⏳ PENDING'}
                          </Badge>
                          <span className="text-sm font-medium">
                            Overall Status: {statusResult.data.status.overall.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm">{statusResult.data.summary.message}</p>
                      </div>

                      {/* Candidate Info */}
                      {statusResult.data.candidate && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <h4 className="font-medium mb-2">Candidate Information</h4>
                          <p className="text-sm"><strong>Name:</strong> {statusResult.data.candidate.name}</p>
                          <p className="text-sm"><strong>Email:</strong> {statusResult.data.candidate.email}</p>
                        </div>
                      )}

                      {/* Invitation Info */}
                      {statusResult.data.invitation && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <h4 className="font-medium mb-2">Invitation Details</h4>
                          <p className="text-sm"><strong>Status:</strong> {statusResult.data.invitation.status}</p>
                          <p className="text-sm"><strong>Package:</strong> {statusResult.data.invitation.package}</p>
                          <p className="text-sm"><strong>Created:</strong> {new Date(statusResult.data.invitation.createdAt).toLocaleString()}</p>
                          {statusResult.data.invitation.completedAt && (
                            <p className="text-sm"><strong>Completed:</strong> {new Date(statusResult.data.invitation.completedAt).toLocaleString()}</p>
                          )}
                          <p className="text-sm"><strong>Expires:</strong> {new Date(statusResult.data.invitation.expiresAt).toLocaleString()}</p>
                        </div>
                      )}

                      {/* Report Info */}
                      {statusResult.data.report && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <h4 className="font-medium mb-2">Background Check Report</h4>
                          <p className="text-sm"><strong>Status:</strong> {statusResult.data.report.status}</p>
                          <p className="text-sm"><strong>Result:</strong> {statusResult.data.report.result}</p>
                          <p className="text-sm"><strong>Created:</strong> {new Date(statusResult.data.report.createdAt).toLocaleString()}</p>
                          {statusResult.data.report.completedAt && (
                            <p className="text-sm"><strong>Completed:</strong> {new Date(statusResult.data.report.completedAt).toLocaleString()}</p>
                          )}
                          
                          {statusResult.data.report.screenings && statusResult.data.report.screenings.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm font-medium">Screenings Performed:</p>
                              <ul className="list-disc list-inside text-xs mt-1 space-y-1">
                                {statusResult.data.report.screenings.map((screening, index) => (
                                  <li key={index}>
                                    {screening.type?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())} 
                                    {screening.status && ` - ${screening.status}`}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800">
                        <strong>Error:</strong> {statusResult.error || 'Failed to check status'}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Test Results */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>
                Latest test results (showing last 10)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No tests run yet. Click a test button to start.
                </p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {results.map((result, index) => (
                    <div key={index} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant={result.success ? "default" : "destructive"}>
                            {result.status}
                          </Badge>
                          <span className="font-mono text-sm">/{result.endpoint}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {result.timestamp}
                        </span>
                      </div>
                      
                      <div className="text-xs">
                        <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Expected Behavior:</strong></p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Status/Verify Status: Should return 401 (Unauthorized) - normal for unauthenticated requests</li>
                  <li>Initiate: Should return 401 (Unauthorized) - requires authentication</li>
                  <li>Webhook: Should return 200 (Success) - processes test webhook event</li>
                  <li>Nodes: Returns 403 if account hierarchy not configured (expected behavior)</li>
                  <li>Account Info: Shows detailed configuration analysis</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Environment Info */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Environment Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Checkr API:</strong> Staging Environment</p>
              <p><strong>Base URL:</strong> https://api.checkr-staging.com/v1</p>
              <p><strong>Authentication:</strong> HTTP Basic Auth</p>
            </div>
            <div>
              <p><strong>Database:</strong> PostgreSQL</p>
              <p><strong>API Framework:</strong> Next.js 14 App Router</p>
              <p><strong>Validation:</strong> Zod Schemas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-blue-800">
          <strong>Testing Tips:</strong>
          <br />
          • Start with "Test Account Info" to verify your account configuration
          <br />
          • The 403 error for nodes is expected for accounts without account hierarchy
          <br />
          • Webhook tests simulate Checkr sending status updates
          <br />
          • Check the browser's network tab for detailed request/response information
        </div>
      </div>

    </div>
  );
}