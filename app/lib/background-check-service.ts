import prisma from '@/app/lib/db';
import { BackgroundCheckStatus } from '@prisma/client';

// Type-safe access to the backgroundCheck model
const backgroundCheckModel = prisma.backgroundCheck;

export interface BackgroundCheckRecord {
  id: string;
  candidateId: string;
  invitationId?: string | null;
  reportId?: string | null;
  candidateUserId?: string | null;
  candidateEmail: string;
  candidateName: string;
  candidatePhone?: string | null;
  candidateZipcode?: string | null;
  status: BackgroundCheckStatus;
  checkrStatus?: string | null;
  invitationUrl?: string | null;
  invitationStatus?: string | null;
  completedAt?: Date | null;
  invitationSentAt?: Date | null;
  reportData?: any;
  packageName?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBackgroundCheckData {
  candidateId: string;
  invitationId?: string;
  candidateUserId: string;
  candidateEmail: string;
  candidateName: string;
  candidatePhone?: string;
  candidateZipcode?: string;
  invitationUrl?: string;
  packageName?: string;
}

export interface UpdateBackgroundCheckData {
  status?: BackgroundCheckStatus;
  checkrStatus?: string;
  reportId?: string;
  reportData?: any;
  invitationStatus?: string;
  completedAt?: Date;
}

export class BackgroundCheckService {
  async createBackgroundCheck(data: CreateBackgroundCheckData): Promise<BackgroundCheckRecord> {
    try {
      console.log('[BackgroundCheckService] Creating background check record');
      
      const result = await backgroundCheckModel.create({
        data: {
          candidateId: data.candidateId,
          invitationId: data.invitationId,
          candidateUserId: data.candidateUserId,
          candidateEmail: data.candidateEmail,
          candidateName: data.candidateName,
          candidatePhone: data.candidatePhone,
          candidateZipcode: data.candidateZipcode,
          invitationUrl: data.invitationUrl,
          packageName: data.packageName,
          status: 'PENDING',
          invitationSentAt: new Date(),
        },
      });

      console.log('[BackgroundCheckService] Background check created:', result.id);
      return result;
    } catch (error) {
      console.error('[BackgroundCheckService] Error creating background check:', error);
      throw new Error(`Failed to create background check: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findByEmail(email: string): Promise<BackgroundCheckRecord | null> {
    try {
      return await backgroundCheckModel.findFirst({
        where: { candidateEmail: email },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      console.error('[BackgroundCheckService] Error finding background check by email:', error);
      return null;
    }
  }

  async findByInvitationId(invitationId: string): Promise<BackgroundCheckRecord | null> {
    try {
      return await backgroundCheckModel.findFirst({
        where: { invitationId },
      });
    } catch (error) {
      console.error('[BackgroundCheckService] Error finding background check by invitation ID:', error);
      return null;
    }
  }

  async findByCandidateId(candidateId: string): Promise<BackgroundCheckRecord | null> {
    try {
      return await backgroundCheckModel.findFirst({
        where: { candidateId },
      });
    } catch (error) {
      console.error('[BackgroundCheckService] Error finding background check by candidate ID:', error);
      return null;
    }
  }

  async findByReportId(reportId: string): Promise<BackgroundCheckRecord | null> {
    try {
      return await backgroundCheckModel.findFirst({
        where: { reportId },
      });
    } catch (error) {
      console.error('[BackgroundCheckService] Error finding background check by report ID:', error);
      return null;
    }
  }

  async updateStatus(
    id: string, 
    status: BackgroundCheckStatus,
    additionalData?: UpdateBackgroundCheckData
  ): Promise<BackgroundCheckRecord> {
    try {
      console.log(`[BackgroundCheckService] Updating background check ${id} status to ${status}`);
      
      const result = await backgroundCheckModel.update({
        where: { id },
        data: {
          status,
          ...additionalData,
          updatedAt: new Date(),
        },
      });

      console.log(`[BackgroundCheckService] Background check updated successfully`);
      return result;
    } catch (error) {
      console.error('[BackgroundCheckService] Error updating background check:', error);
      throw new Error(`Failed to update background check: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async markUserAsVerified(userId: string): Promise<void> {
    try {
      console.log(`[BackgroundCheckService] Marking user ${userId} as verified`);
      
      await prisma.user.update({
        where: { id: userId },
        data: { isVerified: true },
      });

      console.log(`[BackgroundCheckService] User marked as verified successfully`);
    } catch (error) {
      console.error('[BackgroundCheckService] Error marking user as verified:', error);
      throw new Error(`Failed to verify user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getUserVerificationStatus(userId: string): Promise<{
    isVerified: boolean;
    latestBackgroundCheck?: BackgroundCheckRecord;
  }> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { isVerified: true, email: true },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const latestCheck = await this.findByEmail(user.email);

      return {
        isVerified: user.isVerified,
        latestBackgroundCheck: latestCheck || undefined,
      };
    } catch (error) {
      console.error('[BackgroundCheckService] Error getting user verification status:', error);
      throw new Error(`Failed to get verification status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getUserBackgroundChecks(userId: string): Promise<BackgroundCheckRecord[]> {
    try {
      return await backgroundCheckModel.findMany({
        where: { candidateUserId: userId },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      console.error('[BackgroundCheckService] Error getting user background checks:', error);
      return [];
    }
  }

  async deleteBackgroundCheck(id: string): Promise<void> {
    try {
      await backgroundCheckModel.delete({
        where: { id },
      });
      console.log(`[BackgroundCheckService] Background check ${id} deleted`);
    } catch (error) {
      console.error('[BackgroundCheckService] Error deleting background check:', error);
      throw new Error(`Failed to delete background check: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Check if user has required fields for background check
  async validateUserForBackgroundCheck(userId: string): Promise<{
    isValid: boolean;
    missingFields: string[];
    user?: any;
  }> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const missingFields: string[] = [];
      if (!user.firstName) missingFields.push('firstName');
      if (!user.lastName) missingFields.push('lastName');
      if (!user.email) missingFields.push('email');

      return {
        isValid: missingFields.length === 0,
        missingFields,
        user,
      };
    } catch (error) {
      console.error('[BackgroundCheckService] Error validating user:', error);
      return {
        isValid: false,
        missingFields: ['user_not_found'],
      };
    }
  }

  // New method to handle cancellation reasons for larger customers
  async updateWithCancellationReasons(
    id: string,
    status: BackgroundCheckStatus,
    cancellationReasons: string[],
    additionalData?: UpdateBackgroundCheckData
  ): Promise<BackgroundCheckRecord> {
    try {
      console.log(`[BackgroundCheckService] Updating background check ${id} with cancellation reasons`);
      
      const result = await backgroundCheckModel.update({
        where: { id },
        data: {
          status,
          ...additionalData,
          reportData: {
            ...additionalData?.reportData,
            cancellationReasons,
          },
          updatedAt: new Date(),
        },
      });

      console.log(`[BackgroundCheckService] Background check updated with cancellation reasons`);
      return result;
    } catch (error) {
      console.error('[BackgroundCheckService] Error updating background check with cancellation reasons:', error);
      throw new Error(`Failed to update background check: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Enhanced method to handle partially completed reports
  async handlePartiallyCompletedReport(
    id: string,
    reportData: any,
    includesCanceled: boolean
  ): Promise<BackgroundCheckRecord> {
    try {
      console.log(`[BackgroundCheckService] Handling partially completed report for ${id}`);
      
      // Determine status based on report result and includes_canceled flag
      let status: BackgroundCheckStatus = 'PARTIAL_COMPLETE';
      
      if (reportData.result === 'clear' && includesCanceled) {
        status = 'PARTIAL_COMPLETE'; // Clear but with canceled screenings
      } else if (reportData.result === 'consider' && includesCanceled) {
        status = 'CONSIDER'; // Consider result takes precedence
      } else if (reportData.result === 'clear') {
        status = 'CLEAR'; // Normal clear result
      } else if (reportData.result === 'consider') {
        status = 'CONSIDER'; // Normal consider result
      }

      const result = await backgroundCheckModel.update({
        where: { id },
        data: {
          status,
          checkrStatus: reportData.result,
          reportData: {
            ...reportData,
            includesCanceled,
          },
          completedAt: new Date(),
          updatedAt: new Date(),
        },
      });

      console.log(`[BackgroundCheckService] Partially completed report handled with status: ${status}`);
      return result;
    } catch (error) {
      console.error('[BackgroundCheckService] Error handling partially completed report:', error);
      throw new Error(`Failed to handle partially completed report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const backgroundCheckService = new BackgroundCheckService(); 