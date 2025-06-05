"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface AutoStatusCheckerProps {
  hasExistingCheck: boolean;
  isVerified: boolean;
}

export default function AutoStatusChecker({ hasExistingCheck, isVerified }: AutoStatusCheckerProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(false);
  const [shouldPoll, setShouldPoll] = useState(false);
  const [checkCount, setCheckCount] = useState(0);

  const checkStatusNow = useCallback(async () => {
    if (isChecking) return;
    
    setIsChecking(true);
    setCheckCount(prev => prev + 1);
    
    try {
      console.log(`🔄 AutoStatusChecker: Check #${checkCount + 1} - Syncing with Checkr...`);

      const response = await fetch("/api/checkr/status-sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log("📊 AutoStatusChecker result:", data);

      if (data.isVerified && data.updated) {
        console.log("✅ AutoStatusChecker: Background check completed! Refreshing page...");
        setShouldPoll(false); // Stop polling
        router.refresh(); // Refresh to show updated status
        return;
      } 

      if (data.isVerified && !data.updated) {
        console.log("✅ AutoStatusChecker: User already verified, stopping polling");
        setShouldPoll(false);
        router.refresh();
        return;
      }

      // Stop polling after 10 checks (10 minutes) to avoid indefinite polling
      if (checkCount >= 10) {
        console.log("🔄 AutoStatusChecker: Max checks reached, stopping automatic polling");
        setShouldPoll(false);
        return;
      }

    } catch (error) {
      console.error("❌ AutoStatusChecker: Status sync failed:", error);
      // Stop polling on repeated errors
      if (checkCount >= 3) {
        console.log("❌ AutoStatusChecker: Too many errors, stopping automatic polling");
        setShouldPoll(false);
      }
    } finally {
      setIsChecking(false);
    }
  }, [isChecking, router, checkCount]);

  useEffect(() => {
    // Only auto-check if user has a pending background check but isn't verified
    if (hasExistingCheck && !isVerified) {
      console.log("🔄 AutoStatusChecker: Starting automatic status monitoring...");
      setShouldPoll(true);
      
      // Check immediately on page load, but only once
      if (checkCount === 0) {
        setTimeout(() => checkStatusNow(), 2000); // Delay initial check by 2 seconds
      }
    } else {
      console.log("🔄 AutoStatusChecker: No monitoring needed", { hasExistingCheck, isVerified });
      setShouldPoll(false);
    }
  }, [hasExistingCheck, isVerified, checkStatusNow, checkCount]);

  useEffect(() => {
    if (!shouldPoll) return;

    console.log("🔄 AutoStatusChecker: Setting up 60-second polling interval...");
    
    // Poll every 60 seconds (reduced from 30 for better performance)
    const interval = setInterval(() => {
      if (!isChecking && checkCount < 10) {
        checkStatusNow();
      }
    }, 60000);

    return () => {
      console.log("🔄 AutoStatusChecker: Cleaning up polling interval");
      clearInterval(interval);
    };
  }, [shouldPoll, isChecking, checkStatusNow, checkCount]);

  // Don't render anything visible - this is a background service component
  return null;
} 