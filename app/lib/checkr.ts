// Checkr API client for background checks

interface CandidateData {
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  zipcode?: string;
}

interface InvitationData {
  candidate_id: string;
  package: string;
  work_locations?: Array<{
    country: string;
    state?: string;
    city?: string;
  }>;
  // Legacy properties for backward compatibility
  candidate_email?: string;
  candidate_first_name?: string;
  candidate_last_name?: string;
  flow?: "hosted" | "embedded";
  redirect_url?: string;
}

class CheckrClient {
  private apiKey: string;
  private baseUrl: string;
  private isStaging: boolean;

  constructor() {
    this.apiKey = process.env.CHECKR_API_KEY!;
    this.baseUrl = process.env.CHECKR_BASE_URL || "https://api.checkr-staging.com/v1";
    this.isStaging = this.baseUrl.includes("checkr-staging") || this.baseUrl.includes("staging");
    
    console.log("[CheckrClient] Environment:", this.isStaging ? "Staging" : "Production");
    console.log("[CheckrClient] Base URL:", this.baseUrl);
    console.log("[CheckrClient] API Key (first 8 chars):", this.apiKey?.substring(0, 8) + "...");

    if (!this.apiKey) {
      console.error("[CheckrClient] CHECKR_API_KEY environment variable is MISSING");
      throw new Error("CHECKR_API_KEY environment variable is required");
    }
  }

  private async makeRequest(url: string, options: RequestInit = {}): Promise<any> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          // Use HTTP Basic authentication with API key as username and empty password
          'Authorization': `Basic ${Buffer.from(`${this.apiKey}:`).toString('base64')}`,
          ...options.headers,
        },
      });

      console.log(`[CheckrClient] ${options.method || 'GET'} ${url} - Status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[CheckrClient] Error Response:`, errorText);
        throw new Error(`Checkr API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`[CheckrClient] Request failed:`, error);
      throw error;
    }
  }

  // Create an invitation for background check (Hosted or Embed flow)
  async createInvitation(data: InvitationData): Promise<any> {
    try {
      console.log("[CheckrClient] Creating invitation with data:", JSON.stringify(data, null, 2));
      
      const url = `${this.baseUrl}/invitations`;
      const response = await this.makeRequest(url, {
        method: "POST",
        body: JSON.stringify(data),
      });

      console.log("[CheckrClient] Invitation created successfully:", response.id);
      return response;
    } catch (error) {
      console.error("[CheckrClient] Failed to create invitation:", error);
      throw new Error(`Failed to create Checkr invitation: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Get invitation details
  async getInvitation(invitationId: string) {
    try {
      console.log(`[CheckrClient] Getting invitation: ${invitationId}`);
      const url = `${this.baseUrl}/invitations/${invitationId}`;
      const response = await this.makeRequest(url);
      console.log(`[CheckrClient] Invitation status:`, response.status);
      return response;
    } catch (error) {
      console.error(`[CheckrClient] Failed to get invitation:`, error);
      throw new Error(`Failed to get Checkr invitation: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Cancel an invitation
  async cancelInvitation(invitationId: string) {
    return this.makeRequest(`/invitations/${invitationId}`, {
      method: "DELETE",
    });
  }

  // Resend an invitation
  async resendInvitation(invitationId: string) {
    return this.makeRequest(`/invitations/${invitationId}/resend`, {
      method: "POST",
    });
  }

  // Create a candidate 
  async createCandidate(candidateData: CandidateData): Promise<any> {
    try {
      console.log("[CheckrClient] Creating candidate with data:", JSON.stringify(candidateData, null, 2));
      
      const url = `${this.baseUrl}/candidates`;
      const response = await this.makeRequest(url, {
        method: "POST",
        body: JSON.stringify(candidateData),
      });

      console.log("[CheckrClient] Candidate created successfully:", response.id);
      return response;
    } catch (error) {
      console.error("[CheckrClient] Failed to create candidate:", error);
      throw new Error(`Failed to create Checkr candidate: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Create a background check report
  async createReport(candidateId: string, packageSlug: string = "tasker_standard") {
    return this.makeRequest("/reports", {
      method: "POST",
      body: JSON.stringify({
        candidate_id: candidateId,
        package: packageSlug,
      }),
    });
  }

  // Get candidate details
  async getCandidate(candidateId: string) {
    return this.makeRequest(`/candidates/${candidateId}`);
  }

  // Get report details
  async getReport(reportId: string) {
    return this.makeRequest(`${this.baseUrl}/reports/${reportId}`);
  }

  // List available packages
  async getPackages() {
    try {
      console.log("[CheckrClient] Fetching available packages...");
      const url = `${this.baseUrl}/packages`;
      const response = await this.makeRequest(url);
      console.log("[CheckrClient] Available packages:", response.data?.map((p: any) => p.slug) || response);
      return response;
    } catch (error) {
      console.error("[CheckrClient] Failed to fetch packages:", error);
      throw new Error(`Failed to fetch Checkr packages: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Cancel a report
  async cancelReport(reportId: string) {
    return this.makeRequest(`/reports/${reportId}`, {
      method: "DELETE",
    });
  }

  // Get staging/production status
  getEnvironment() {
    return {
      isStaging: this.isStaging,
      baseUrl: this.baseUrl,
      environment: this.isStaging ? "staging" : "production"
    };
  }

  // Search for candidates by email using Checkr's query parameters
  async searchCandidates(email: string): Promise<any[]> {
    try {
      console.log(`[CheckrClient] Searching candidates by email: ${email}`);
      
      // Use Checkr's query parameter to search by email directly
      const response = await fetch(`${this.baseUrl}/candidates?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.apiKey}:`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error(`[CheckrClient] Failed to search candidates: ${response.status} ${response.statusText}`);
        return [];
      }

      const data = await response.json();
      const candidates = data.data || [];
      console.log(`[CheckrClient] Found ${candidates.length} candidates for email ${email}`);
      
      return candidates;
    } catch (error) {
      console.error('[CheckrClient] Error searching candidates:', error);
      return [];
    }
  }

  // Search for reports by candidate ID using Checkr's query parameters  
  async getReportsForCandidate(candidateId: string): Promise<any[]> {
    try {
      console.log(`[CheckrClient] Getting reports for candidate: ${candidateId}`);
      
      const url = `${this.baseUrl}/reports?candidate_id=${candidateId}`;
      console.log(`[CheckrClient] Report search URL: ${url}`);
      
      // Use Checkr's query parameter to search by candidate_id directly
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.apiKey}:`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
      });

      console.log(`[CheckrClient] Report search response status: ${response.status}`);

      if (!response.ok) {
        if (response.status === 404) {
          // 404 means no reports found for this candidate, which is normal
          console.log(`[CheckrClient] No reports found for candidate: ${candidateId}`);
          return [];
        }
        const errorText = await response.text();
        console.error(`[CheckrClient] Failed to get reports for candidate: ${response.status} ${response.statusText}`);
        console.error(`[CheckrClient] Error response body:`, errorText);
        return [];
      }

      const data = await response.json();
      console.log(`[CheckrClient] Raw report search response:`, JSON.stringify(data, null, 2));
      
      const reports = data.data || [];
      console.log(`[CheckrClient] Found ${reports.length} reports for candidate ${candidateId}`);
      
      // Log each report's details
      reports.forEach((report: any, index: number) => {
        console.log(`[CheckrClient] Report ${index + 1}: ID=${report.id}, Status=${report.status}, Created=${report.created_at}`);
      });
      
      return reports;
    } catch (error) {
      console.error('[CheckrClient] Error getting reports for candidate:', error);
      return [];
    }
  }

  // Search for invitations by candidate ID using Checkr's query parameters
  async getInvitations(candidateId?: string): Promise<any[]> {
    try {
      let url = `${this.baseUrl}/invitations`;
      if (candidateId) {
        url += `?candidate_id=${candidateId}`;
        console.log(`[CheckrClient] Getting invitations for candidate: ${candidateId}`);
      } else {
        console.log(`[CheckrClient] Getting all invitations`);
      }
      
      console.log(`[CheckrClient] Invitation search URL: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.apiKey}:`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
      });

      console.log(`[CheckrClient] Invitation search response status: ${response.status}`);

      if (!response.ok) {
        console.error(`[CheckrClient] Failed to get invitations: ${response.status} ${response.statusText}`);
        return [];
      }

      const data = await response.json();
      console.log(`[CheckrClient] Raw invitation response:`, JSON.stringify(data, null, 2));
      
      const invitations = data.data || [];
      console.log(`[CheckrClient] Found ${invitations.length} invitations`);
      
      // Log detailed information about each invitation
      invitations.forEach((invitation: any, index: number) => {
        console.log(`[CheckrClient] Invitation ${index + 1}:`);
        console.log(`  - ID: ${invitation.id}`);
        console.log(`  - Status: ${invitation.status}`);
        console.log(`  - Candidate ID: ${invitation.candidate_id}`);
        console.log(`  - Report ID: ${invitation.report_id || 'None'}`);
        console.log(`  - Created: ${invitation.created_at}`);
        console.log(`  - Completed: ${invitation.completed_at || 'Not completed'}`);
        
        // Check if report data is embedded
        if (invitation.report) {
          console.log(`  - Embedded Report Status: ${invitation.report.status}`);
          console.log(`  - Embedded Report Result: ${invitation.report.result}`);
        }
        
        // Log the full invitation object to see all available fields
        console.log(`  - Full invitation object:`, JSON.stringify(invitation, null, 2));
      });
      
      return invitations;
    } catch (error) {
      console.error('[CheckrClient] Error getting invitations:', error);
      return [];
    }
  }

  // Search for invitations by email (search for candidate first, then get their invitations)
  async searchInvitationsByEmail(email: string): Promise<any[]> {
    try {
      console.log(`[CheckrClient] Searching invitations by email: ${email}`);
      
      // First find candidates with this email
      const candidates = await this.searchCandidates(email);
      
      if (candidates.length === 0) {
        console.log(`[CheckrClient] No candidates found for email ${email}`);
        return [];
      }
      
      // Get invitations for each candidate
      const allInvitations: any[] = [];
      for (const candidate of candidates) {
        const invitations = await this.getInvitations(candidate.id);
        allInvitations.push(...invitations);
      }
      
      console.log(`[CheckrClient] Found ${allInvitations.length} total invitations for email ${email}`);
      return allInvitations;
    } catch (error) {
      console.error('[CheckrClient] Error searching invitations by email:', error);
      return [];
    }
  }

  // Comprehensive search for all background check data by email
  async getAllBackgroundDataByEmail(email: string): Promise<{
    candidates: any[];
    reports: any[];
    invitations: any[];
    latest_status?: string;
  }> {
    try {
      console.log(`[CheckrClient] Comprehensive search for email: ${email}`);
      
      // 1. Search for candidates by email
      const candidates = await this.searchCandidates(email);
      console.log(`[CheckrClient] Found ${candidates.length} candidates`);
      
      // 2. Get all reports for those candidates
      const allReports: any[] = [];
      for (const candidate of candidates) {
        const reports = await this.getReportsForCandidate(candidate.id);
        allReports.push(...reports);
      }
      console.log(`[CheckrClient] Found ${allReports.length} total reports`);
      
      // 3. ALSO search for reports directly by email (in case candidate association is missing)
      console.log(`[CheckrClient] Also searching reports directly...`);
      const directReports = await this.searchReportsDirectly();
      console.log(`[CheckrClient] Found ${directReports.length} reports from direct search`);
      
      // 4. Get all invitations for those candidates
      const allInvitations: any[] = [];
      for (const candidate of candidates) {
        const invitations = await this.getInvitations(candidate.id);
        allInvitations.push(...invitations);
      }
      console.log(`[CheckrClient] Found ${allInvitations.length} total invitations`);
      
      // 5. Try to get reports by ID from invitations (since /reports endpoint returns 404)
      console.log(`[CheckrClient] Trying to get reports from invitation report_ids...`);
      const reportsFromInvitations: any[] = [];
      for (const invitation of allInvitations) {
        if (invitation.report_id) {
          console.log(`[CheckrClient] Found report_id in invitation: ${invitation.report_id}`);
          const report = await this.getReportById(invitation.report_id);
          if (report) {
            reportsFromInvitations.push(report);
          }
        }
        
        // Also check if report data is embedded directly in the invitation
        if (invitation.report) {
          console.log(`[CheckrClient] Found embedded report in invitation`);
          reportsFromInvitations.push(invitation.report);
        }
      }
      console.log(`[CheckrClient] Found ${reportsFromInvitations.length} reports from invitations`);
      
      // Combine all reports and deduplicate
      const allReportsMap = new Map();
      [...allReports, ...directReports, ...reportsFromInvitations].forEach(report => {
        allReportsMap.set(report.id, report);
      });
      const combinedReports = Array.from(allReportsMap.values());
      console.log(`[CheckrClient] Final combined total: ${combinedReports.length} unique reports`);
      
      // 6. Determine latest status from reports or invitations
      let latestStatus = 'none';
      if (combinedReports.length > 0) {
        // Sort reports by creation date to get the latest one
        const sortedReports = combinedReports.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        latestStatus = sortedReports[0].status || 'unknown';
      } else if (allInvitations.length > 0) {
        // No reports found, check invitation statuses
        console.log(`[CheckrClient] No reports found, checking invitation statuses...`);
        
        // Sort invitations by creation date to get the latest one
        const sortedInvitations = allInvitations.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        
        const latestInvitation = sortedInvitations[0];
        console.log(`[CheckrClient] Latest invitation status: ${latestInvitation.status}`);
        
        // Only map pending/started invitations - completed invitations don't mean clear background checks
        if (latestInvitation.status === 'pending' || latestInvitation.status === 'started') {
          latestStatus = 'pending';
        } else if (latestInvitation.status === 'completed') {
          latestStatus = 'in_progress'; // Form completed but report still processing
        } else {
          latestStatus = latestInvitation.status || 'unknown';
        }
      }
      
      console.log(`[CheckrClient] Final determined status: ${latestStatus}`);
      
      return {
        candidates,
        reports: combinedReports,
        invitations: allInvitations,
        latest_status: latestStatus
      };
    } catch (error) {
      console.error('[CheckrClient] Error in comprehensive search:', error);
      return {
        candidates: [],
        reports: [],
        invitations: [],
        latest_status: 'error'
      };
    }
  }

  // Search for reports directly (not by candidate ID)
  async searchReportsDirectly(): Promise<any[]> {
    try {
      console.log(`[CheckrClient] Searching all reports directly...`);
      
      const url = `${this.baseUrl}/reports`;
      console.log(`[CheckrClient] Direct report search URL: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.apiKey}:`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
      });

      console.log(`[CheckrClient] Direct report search response status: ${response.status}`);

      if (!response.ok) {
        console.error(`[CheckrClient] Failed direct report search: ${response.status} ${response.statusText}`);
        return [];
      }

      const data = await response.json();
      const reports = data.data || [];
      console.log(`[CheckrClient] Found ${reports.length} reports from direct search`);
      
      // Log details about recent reports
      const recentReports = reports.slice(0, 5); // Just the first 5 for logging
      recentReports.forEach((report: any, index: number) => {
        console.log(`[CheckrClient] Recent Report ${index + 1}: ID=${report.id}, Status=${report.status}, Candidate=${report.candidate_id}, Created=${report.created_at}`);
      });
      
      return reports;
    } catch (error) {
      console.error('[CheckrClient] Error in direct report search:', error);
      return [];
    }
  }

  // Get individual report by ID
  async getReportById(reportId: string): Promise<any | null> {
    try {
      console.log(`[CheckrClient] Getting individual report: ${reportId}`);
      
      const url = `${this.baseUrl}/reports/${reportId}`;
      console.log(`[CheckrClient] Individual report URL: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.apiKey}:`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
      });

      console.log(`[CheckrClient] Individual report response status: ${response.status}`);

      if (!response.ok) {
        console.error(`[CheckrClient] Failed to get individual report: ${response.status} ${response.statusText}`);
        return null;
      }

      const report = await response.json();
      console.log(`[CheckrClient] Individual report data:`, JSON.stringify(report, null, 2));
      
      return report;
    } catch (error) {
      console.error('[CheckrClient] Error getting individual report:', error);
      return null;
    }
  }
}

export const checkr = new CheckrClient();