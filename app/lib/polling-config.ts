/**
 * Polling Configuration
 * 
 * This configuration file controls automatic polling behavior for different features.
 * You can easily enable/disable polling for specific features here.
 */

export interface PollingConfig {
  backgroundChecks: {
    enabled: boolean;
    intervalMs: number;
  };
  messaging: {
    enabled: boolean;
    intervalMs: number;
  };
}

export const POLLING_CONFIG: PollingConfig = {
  // Background check polling - TEMPORARILY DISABLED
  backgroundChecks: {
    enabled: false, // Set to true to re-enable automatic polling
    intervalMs: 10000, // 10 seconds
  },
  
  // Messaging polling - KEEP ENABLED
  messaging: {
    enabled: true,
    intervalMs: 30000, // 30 seconds
  },
};

/**
 * Utility functions to check if polling is enabled for specific features
 */
export const isBackgroundCheckPollingEnabled = () => POLLING_CONFIG.backgroundChecks.enabled;
export const isMessagingPollingEnabled = () => POLLING_CONFIG.messaging.enabled;
export const getBackgroundCheckPollingInterval = () => POLLING_CONFIG.backgroundChecks.intervalMs;
export const getMessagingPollingInterval = () => POLLING_CONFIG.messaging.intervalMs; 