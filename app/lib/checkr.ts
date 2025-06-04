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
    return this.makeRequest(`/invitations/${invitationId}`);
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
    return this.makeRequest(`/reports/${reportId}`);
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
}

export const checkr = new CheckrClient(); 