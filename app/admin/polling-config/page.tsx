'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, RefreshCw, MessageCircle, Shield, AlertTriangle } from "lucide-react";
import { POLLING_CONFIG } from '@/app/lib/polling-config';

export default function PollingConfigPage() {
  const [config, setConfig] = useState(POLLING_CONFIG);

  const toggleBackgroundCheckPolling = () => {
    console.log('Background check polling toggle clicked');
    // In a real implementation, this would make an API call to update the config
    // For now, it just shows what the functionality would look like
  };

  const toggleMessagingPolling = () => {
    console.log('Messaging polling toggle clicked');
    // In a real implementation, this would make an API call to update the config
    // For now, it just shows what the functionality would look like
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Polling Configuration</h1>
        <p className="text-gray-600">
          Manage automatic polling settings for different features. Changes require updating the configuration file.
        </p>
      </div>

      {/* Warning Notice */}
      <Card className="mb-6 border-yellow-200 bg-yellow-50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <div>
              <CardTitle className="text-lg text-yellow-900">Configuration Notice</CardTitle>
              <p className="text-yellow-700 text-sm">
                To change these settings, edit the <code className="bg-yellow-200 px-1 rounded">POLLING_CONFIG</code> object in <code className="bg-yellow-200 px-1 rounded">app/lib/polling-config.ts</code>
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Current Configuration */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-blue-600" />
            <div>
              <CardTitle className="text-xl">Current Configuration</CardTitle>
              <p className="text-gray-600">
                View and understand the current polling settings for all features.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Background Check Polling */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Background Check Polling</h3>
                  <p className="text-sm text-gray-600">Automatic status updates for background checks</p>
                </div>
              </div>
              <Badge variant={config.backgroundChecks.enabled ? "default" : "secondary"}>
                {config.backgroundChecks.enabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Status:</span>
                <span className="ml-2 font-medium">
                  {config.backgroundChecks.enabled ? "Automatically polling" : "Manual refresh only"}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Interval:</span>
                <span className="ml-2 font-medium">
                  {config.backgroundChecks.intervalMs / 1000} seconds
                </span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Current behavior:</strong> {config.backgroundChecks.enabled 
                  ? "Background checks are automatically polled for status updates. Users don't need to manually refresh."
                  : "Users must click 'Refresh Status' to check for background check updates. Automatic polling is disabled."
                }
              </p>
            </div>
          </div>

          {/* Messaging Polling */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-green-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Message Polling</h3>
                  <p className="text-sm text-gray-600">Automatic updates for unread message counts</p>
                </div>
              </div>
              <Badge variant={config.messaging.enabled ? "default" : "secondary"}>
                {config.messaging.enabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Status:</span>
                <span className="ml-2 font-medium">
                  {config.messaging.enabled ? "Automatically polling" : "Manual refresh only"}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Interval:</span>
                <span className="ml-2 font-medium">
                  {config.messaging.intervalMs / 1000} seconds
                </span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Current behavior:</strong> {config.messaging.enabled 
                  ? "Message counts are automatically updated. Unread message badges refresh periodically."
                  : "Message counts only update when pages are refreshed or when users return to the app."
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How to Change Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">How to Change These Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold mt-0.5">
                1
              </div>
              <div>
                <h4 className="font-semibold">Edit Configuration File</h4>
                <p className="text-sm text-gray-600">
                  Navigate to <code className="bg-gray-100 px-1 rounded">app/lib/polling-config.ts</code>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold mt-0.5">
                2
              </div>
              <div>
                <h4 className="font-semibold">Update POLLING_CONFIG</h4>
                <p className="text-sm text-gray-600">
                  Change <code className="bg-gray-100 px-1 rounded">enabled: false</code> to <code className="bg-gray-100 px-1 rounded">enabled: true</code> for the feature you want to enable
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibled mt-0.5">
                3
              </div>
              <div>
                <h4 className="font-semibold">Restart Application</h4>
                <p className="text-sm text-gray-600">
                  Restart your development server or redeploy to apply changes
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 