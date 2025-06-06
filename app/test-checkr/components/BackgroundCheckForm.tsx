'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock, CheckCircle, AlertCircle, RefreshCw, StopCircle, Loader2, Shield, ExternalLink, User } from 'lucide-react';
import { isBackgroundCheckPollingEnabled, getBackgroundCheckPollingInterval } from '@/app/lib/polling-config';

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

interface ExistingBackgroundCheck {
  status: {
    overall: string;
    report: string;
    invitation: string;
  };
  result: string;
  adjudication: string | null;
  reportId?: string;
  candidateId?: string;
  invitationId?: string;
  report?: {
    status: string;
    result: string;
    completedAt?: string;
    package: string;
  };
  candidate?: {
    name: string;
    email: string;
  };
}

interface BackgroundCheckFormProps {
  initialData: HostedCheckForm;
}

export function BackgroundCheckForm({ initialData }: BackgroundCheckFormProps) {
  const [loading, setLoading] = useState(false);
  const [hostedCheckForm, setHostedCheckForm] = useState<HostedCheckForm>(initialData);
  const [checkingExisting, setCheckingExisting] = useState(true);
  const [existingCheck, setExistingCheck] = useState<ExistingBackgroundCheck | null>(null);
  const [pollingStatus, setPollingStatus] = useState<PollingStatus>({
    isPolling: false,
    data: null,
    currentStatus: null,
    lastCheck: null,
  });
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-check for existing background checks on component mount
  useEffect(() => {
    checkForExistingBackgroundCheck();
  }, []);

  const checkForExistingBackgroundCheck = async () => {
    try {
      setCheckingExisting(true);
      console.log('[AutoCheck] Checking for existing background checks...');
      
      const response = await fetch('/api/checkr/my-status');
      const result = await response.json();
      
      if (result.success && result.data) {
        console.log('[AutoCheck] Existing background check found:', result.data);
        
        // Check if there's a completed background check
        if (result.data.status?.overall === 'complete' && result.data.result) {
          setExistingCheck(result.data);
          console.log('[AutoCheck] Found completed background check with result:', result.data.result);
        } else if (result.data.status?.overall === 'processing' || result.data.status?.overall === 'pending') {
          // There's an in-progress check - conditionally start polling based on config
          console.log('[AutoCheck] Found in-progress background check');
          setExistingCheck(result.data);
          
          if (isBackgroundCheckPollingEnabled() && (result.data.candidateId || result.data.invitationId)) {
            console.log('[AutoCheck] Starting automatic polling');
            startPolling(
              result.data.candidateId,
              result.data.invitationId,
              result.data.user?.email || hostedCheckForm.email
            );
          } else {
            console.log('[AutoCheck] Automatic polling disabled - users can refresh manually');
          }
        }
      } else {
        console.log('[AutoCheck] No existing background check found');
      }
    } catch (error) {
      console.error('[AutoCheck] Error checking for existing background check:', error);
    } finally {
      setCheckingExisting(false);
    }
  };

  // Function to get human-readable status
  const getStatusDisplay = (check: ExistingBackgroundCheck) => {
    if (check.status.overall === 'complete') {
      switch (check.result) {
        case 'clear':
          return {
            label: 'Background Check Passed',
            color: 'text-green-700',
            bgColor: 'bg-green-100',
            borderColor: 'border-green-300',
            icon: CheckCircle,
            description: 'Your background check has been completed successfully with no issues found.'
          };
        case 'consider':
          return {
            label: 'Background Check Requires Review',
            color: 'text-yellow-700',
            bgColor: 'bg-yellow-100',
            borderColor: 'border-yellow-300',
            icon: AlertCircle,
            description: 'Your background check has been completed but requires manual review by the employer.'
          };
        default:
          return {
            label: 'Background Check Complete',
            color: 'text-blue-700',
            bgColor: 'bg-blue-100',
            borderColor: 'border-blue-300',
            icon: CheckCircle,
            description: 'Your background check has been completed.'
          };
      }
    } else if (check.status.overall === 'processing' || check.status.overall === 'pending') {
      return {
        label: 'Background Check In Progress',
        color: 'text-blue-700',
        bgColor: 'bg-blue-100',
        borderColor: 'border-blue-300',
        icon: Clock,
        description: 'Your background check is currently being processed. We\'ll update you when it\'s complete.'
      };
    } else {
      return {
        label: 'Background Check Status Unknown',
        color: 'text-gray-700',
        bgColor: 'bg-gray-100',
        borderColor: 'border-gray-300',
        icon: AlertCircle,
        description: 'Unable to determine the current status of your background check.'
      };
    }
  };

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

    // Start polling at configured interval
    const pollingInterval = getBackgroundCheckPollingInterval();
    pollingIntervalRef.current = setInterval(() => {
      checkStatusForPolling();
    }, pollingInterval);

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

  const manualRefresh = async () => {
    console.log('[Manual Refresh] Checking background check status...');
    setIsManualRefreshing(true);
    
    try {
      const response = await fetch('/api/checkr/my-status');
      const result = await response.json();
      
      if (result.success && result.data) {
        console.log('[Manual Refresh] Status updated:', result.data);
        setExistingCheck(result.data);
        
        // Update polling status if we had polling data
        setPollingStatus(prev => ({
          ...prev,
          currentStatus: result,
          lastCheck: new Date().toISOString(),
        }));
      } else {
        console.log('[Manual Refresh] No background check data found');
      }
    } catch (error) {
      console.error('[Manual Refresh] Error checking status:', error);
    } finally {
      setIsManualRefreshing(false);
    }
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
      console.log('[CreateHostedCheck] Sending request with data:', hostedCheckForm);
      
      const response = await fetch('/api/checkr/create-hosted-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(hostedCheckForm),
      });

      console.log('[CreateHostedCheck] Response status:', response.status);
      console.log('[CreateHostedCheck] Response headers:', Object.fromEntries(response.headers.entries()));

      // Check if response is ok
      if (!response.ok) {
        console.error('[CreateHostedCheck] HTTP error:', response.status, response.statusText);
        alert(`HTTP Error: ${response.status} ${response.statusText}`);
        return;
      }

      // Check if response has content
      const responseText = await response.text();
      console.log('[CreateHostedCheck] Raw response:', responseText);

      if (!responseText) {
        console.error('[CreateHostedCheck] Empty response received');
        alert('Error: Server returned empty response');
        return;
      }

      let result;
      try {
        result = JSON.parse(responseText);
        console.log('[CreateHostedCheck] Parsed response:', result);
      } catch (parseError) {
        console.error('[CreateHostedCheck] Failed to parse response as JSON:', parseError);
        console.error('[CreateHostedCheck] Response text was:', responseText);
        alert('Error: Invalid response from server');
        return;
      }
      
      if (result.success && result.data?.invitationUrl) {
        console.log('[CreateHostedCheck] Background check invitation created successfully:', result.data);
        
        // Conditionally start polling for status updates based on config
        if (isBackgroundCheckPollingEnabled()) {
          console.log('[CreateHostedCheck] Starting automatic polling for new background check');
          startPolling(result.data.candidateId, result.data.invitationId, hostedCheckForm.email);
        } else {
          console.log('[CreateHostedCheck] Automatic polling disabled - users can refresh manually');
        }
        
        // Redirect user to Checkr hosted flow
        window.open(result.data.invitationUrl, '_blank');
      } else {
        console.error('[CreateHostedCheck] Failed to create background check:', {
          success: result.success,
          error: result.error,
          data: result.data,
          fullResult: result
        });
        
        const errorMessage = result.error || 'Failed to create background check - no error message provided';
        alert(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error('[CreateHostedCheck] Network or unexpected error:', error);
      console.error('[CreateHostedCheck] Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      alert(`Network error occurred: ${error.message}. Please try again.`);
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

  // If we're still checking for existing background checks
  if (checkingExisting) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-gray-600">Checking for existing background checks...</span>
        </div>
      </div>
    );
  }

  // If there's an existing completed background check
  if (existingCheck && existingCheck.status?.overall === 'complete') {
    const statusDisplay = getStatusDisplay(existingCheck);
    const StatusIcon = statusDisplay.icon;
    
    return (
      <div className="space-y-6">
        <Card className={`${statusDisplay.borderColor} ${statusDisplay.bgColor}`}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <StatusIcon className={`w-6 h-6 ${statusDisplay.color}`} />
              <div>
                <CardTitle className={`text-xl ${statusDisplay.color}`}>
                  {statusDisplay.label}
                </CardTitle>
                <CardDescription className={statusDisplay.color}>
                  {statusDisplay.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-3">
                {existingCheck.candidate && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>Background check for: {existingCheck.candidate.name}</span>
                  </div>
                )}
                
                {existingCheck.report?.completedAt && (
                  <div className="text-sm text-gray-600">
                    <strong>Completed:</strong> {new Date(existingCheck.report.completedAt).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                )}
                
                {existingCheck.report?.package && (
                  <div className="text-sm text-gray-600">
                    <strong>Package:</strong> {existingCheck.report.package}
                  </div>
                )}
              </div>

              {/* Status Details */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Status Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Overall Status:</span>
                    <span className="ml-2 font-medium capitalize">
                      {existingCheck.status.overall}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Report Status:</span>
                    <span className="ml-2 font-medium capitalize">
                      {existingCheck.status.report}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Invitation Status:</span>
                    <span className="ml-2 font-medium capitalize">
                      {existingCheck.status.invitation}
                    </span>
                  </div>
                </div>
                
                {/* Result and Adjudication */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Result:</span>
                      <Badge 
                        variant={existingCheck.result === 'clear' ? 'default' : existingCheck.result === 'consider' ? 'secondary' : 'outline'}
                        className="ml-2"
                      >
                        {existingCheck.result === 'clear' ? '✅ Clear' : 
                         existingCheck.result === 'consider' ? '⚠️ Consider' : 
                         existingCheck.result || 'Unknown'}
                      </Badge>
                    </div>
                    {existingCheck.adjudication && (
                      <div>
                        <span className="text-gray-600">Adjudication:</span>
                        <span className="ml-2 font-medium capitalize">
                          {existingCheck.adjudication}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button
                  onClick={() => setExistingCheck(null)}
                  variant="outline"
                  size="sm"
                >
                  Start New Background Check
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      {/* Show existing in-progress check if any */}
      {existingCheck && (existingCheck.status?.overall === 'processing' || existingCheck.status?.overall === 'pending') && (
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <CardTitle className="text-lg text-blue-900">
                    Background Check In Progress
                  </CardTitle>
                  <CardDescription className="text-blue-700">
                    {isBackgroundCheckPollingEnabled() 
                      ? "You already have a background check being processed. We're monitoring its progress below."
                      : "You already have a background check being processed. Click 'Refresh Status' to check for updates."
                    }
                  </CardDescription>
                </div>
              </div>
              {!isBackgroundCheckPollingEnabled() && (
                <Button
                  onClick={manualRefresh}
                  variant="outline"
                  size="sm"
                  disabled={isManualRefreshing}
                  className="border-blue-300 text-blue-700 hover:bg-blue-100 disabled:opacity-60"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isManualRefreshing ? 'animate-spin' : ''}`} />
                  {isManualRefreshing ? 'Checking...' : 'Refresh Status'}
                </Button>
              )}
            </div>
          </CardHeader>
        </Card>
      )}

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
              <div className="flex gap-2">
                {!isBackgroundCheckPollingEnabled() && (
                  <Button
                    onClick={manualRefresh}
                    variant="outline"
                    size="sm"
                    disabled={isManualRefreshing}
                    className="border-blue-300 text-blue-700 hover:bg-blue-100 disabled:opacity-60"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isManualRefreshing ? 'animate-spin' : ''}`} />
                    {isManualRefreshing ? 'Checking...' : 'Refresh Status'}
                  </Button>
                )}
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
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-600" />
            <div>
              <CardTitle className="text-xl">Background Check</CardTitle>
              <CardDescription>
                Complete your background check through our secure partner, Checkr.
                {hostedCheckForm.firstName && hostedCheckForm.email && (
                  <span className="block mt-1 text-green-600 font-medium">
                    ✓ Form auto-populated with your account information
                  </span>
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-sm font-medium">First Name *</Label>
                  <Input
                    id="firstName"
                    value={hostedCheckForm.firstName}
                    onChange={(e) => setHostedCheckForm(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="John"
                    className="mt-1"
                    maxLength={35}
                  />
                </div>
                <div>
                  <Label htmlFor="middleName" className="text-sm font-medium">Middle Name</Label>
                  <Input
                    id="middleName"
                    value={hostedCheckForm.middleName}
                    onChange={(e) => setHostedCheckForm(prev => ({ ...prev, middleName: e.target.value }))}
                    placeholder="M"
                    className="mt-1"
                    maxLength={35}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lastName" className="text-sm font-medium">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={hostedCheckForm.lastName}
                    onChange={(e) => setHostedCheckForm(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Smith"
                    className="mt-1"
                    maxLength={35}
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={hostedCheckForm.email}
                    onChange={(e) => setHostedCheckForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="john.smith@example.com"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
                  <Input
                    id="phone"
                    value={hostedCheckForm.phone}
                    onChange={(e) => setHostedCheckForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(555) 123-4567"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="zipcode" className="text-sm font-medium">Zip Code</Label>
                  <Input
                    id="zipcode"
                    value={hostedCheckForm.zipcode}
                    onChange={(e) => setHostedCheckForm(prev => ({ ...prev, zipcode: e.target.value }))}
                    placeholder="65201"
                    className="mt-1"
                    maxLength={10}
                  />
                </div>
              </div>
            </div>

            {/* Work Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Work Location</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="country" className="text-sm font-medium">Country</Label>
                  <Input
                    id="country"
                    value={hostedCheckForm.workLocation.country}
                    disabled
                    className="mt-1 bg-gray-100 text-gray-600"
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
                    placeholder="MO"
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
                    placeholder="Columbia"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t">
              <Button
                onClick={createHostedCheck}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Background Check...
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Start Background Check
                  </>
                )}
              </Button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                You'll be redirected to our secure partner, Checkr, to complete the process
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
} 