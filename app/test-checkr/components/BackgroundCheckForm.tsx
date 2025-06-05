'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock, CheckCircle, AlertCircle, RefreshCw, StopCircle, Loader2 } from 'lucide-react';

interface HostedCheckForm {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  zipcode: string;
  workLocation: {
    country: string;
    state: string;
    city: string;
  };
  package: string;
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
  currentStatus: any | null;
  lastCheck: string | null;
}

interface BackgroundCheckFormProps {
  initialData: HostedCheckForm;
}

export function BackgroundCheckForm({ initialData }: BackgroundCheckFormProps) {
  const [loading, setLoading] = useState(false);
  const [hostedCheckForm, setHostedCheckForm] = useState<HostedCheckForm>(initialData);
  const [pollingStatus, setPollingStatus] = useState<PollingStatus>({
    isPolling: false,
    data: null,
    currentStatus: null,
    lastCheck: null,
  });
  
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startPolling = (candidateId?: string, invitationId?: string, email?: string) => {
    console.log('[Polling] Starting background check status polling');
    
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

    // Start polling every 10 seconds
    pollingIntervalRef.current = setInterval(() => {
      checkStatusForPolling();
    }, 10000);

    // Check immediately
    checkStatusForPolling();
  };

  const stopPolling = () => {
    console.log('[Polling] Stopping background check status polling');
    
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    
    setPollingStatus(current => ({
      ...current,
      isPolling: false,
    }));
  };

  const checkStatusForPolling = async () => {
    try {
      setPollingStatus(prev => {
        if (!prev.data) return prev;
        
        const { candidateId, invitationId, email } = prev.data;
        
        // Make status check request
        fetch('/api/checkr/check-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            candidateId,
            invitationId,
            email,
          }),
        })
        .then(response => response.json())
        .then(result => {
          console.log('[Polling] Status check result:', result);
          
          // Update polling state
          setPollingStatus(current => ({
            ...current,
            data: current.data ? { ...current.data, checks: current.data.checks + 1 } : null,
            currentStatus: result,
            lastCheck: new Date().toISOString(),
          }));

          // Stop polling if status is no longer pending
          if (result.success && result.data?.summary && !result.data.summary.isPending) {
            console.log('[Polling] Background check completed, stopping polling');
            stopPolling();
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

  const createHostedCheck = async () => {
    if (!hostedCheckForm.firstName || !hostedCheckForm.lastName || !hostedCheckForm.email || !hostedCheckForm.workLocation.city) {
      alert('Please fill in all required fields: First Name, Last Name, Email, and City');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/checkr/create-hosted-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(hostedCheckForm),
      });

      const result = await response.json();
      
      if (result.success && result.data?.invitationUrl) {
        console.log('Background check invitation created:', result.data);
        
        // Start polling for status updates
        startPolling(result.data.candidateId, result.data.invitationId, hostedCheckForm.email);
        
        // Redirect user to Checkr hosted flow
        window.open(result.data.invitationUrl, '_blank');
      } else {
        console.error('Failed to create background check:', result);
        alert(`Error: ${result.error || 'Failed to create background check'}`);
      }
    } catch (error) {
      console.error('Error creating hosted check:', error);
      alert('Network error occurred. Please try again.');
    } finally {
      setLoading(false);
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
    <>
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
                    {pollingStatus.isPolling ? 'Checking Status' : 'Background Check Complete'}
                  </CardTitle>
                  <p className="text-blue-700 text-sm">
                    {pollingStatus.isPolling 
                      ? `We're monitoring your background check progress • ${pollingStatus.data?.checks || 0} status updates`
                      : 'Your background check has been processed'
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
                  Stop Monitoring
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
                    <span className="text-gray-600">Updates:</span>
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
                    <h4 className="font-semibold">Status:</h4>
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
                          ? "✅ Approved"
                          : "⚠️ Under Review"
                        : "⏳ In Progress"
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
                    {pollingStatus.currentStatus.error || 'An error occurred while checking status'}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Background Check Form */}
      <Card>
        <CardHeader>
          <CardTitle>Start Background Check</CardTitle>
          <CardDescription>
            Please provide your information to begin the background check process
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
              <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
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
                <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                <Input
                  id="phone"
                  value={hostedCheckForm.phone}
                  onChange={(e) => setHostedCheckForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1 (555) 123-4567"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="zipcode" className="text-sm font-medium">ZIP Code</Label>
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
            <h5 className="font-medium text-gray-900 border-b pb-2">Location Information</h5>
            <p className="text-sm text-gray-600">Where will you be working or residing?</p>
            
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
                  className="mt-1 bg-gray-100"
                  maxLength={2}
                  required
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">Fixed to US for this service</p>
              </div>
              <div>
                <Label htmlFor="state" className="text-sm font-medium">State</Label>
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
                />
                <p className="text-xs text-gray-500 mt-1">2-letter state code (for US)</p>
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
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">What happens next?</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• You'll be redirected to a secure Checkr portal to complete your background check</li>
              <li>• We'll monitor the progress and notify you when it's complete</li>
              <li>• The process typically takes 1-3 business days</li>
            </ul>
          </div>

          <Button 
            onClick={createHostedCheck}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Background Check...
              </>
            ) : (
              'Start Background Check'
            )}
          </Button>
        </CardContent>
      </Card>
    </>
  );
} 