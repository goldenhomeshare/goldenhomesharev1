import crypto from 'crypto';

// Types based on Checkr API documentation
interface CheckrEnvironment {
  apiKey: string;
  baseUrl: string;
  webhookSecret?: string;
  isStaging: boolean;
}

interface CandidateData {
  email: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  no_middle_name?: boolean;
  phone?: string;
  zipcode?: string;
  dob?: string; // YYYY-MM-DD format
  ssn?: string; // For self-hosted flows
  driver_license_number?: string;
  driver_license_state?: string;
  copy_requested?: boolean;
  custom_id?: string; // Unique ID for cross-reference
  work_locations: Array<{
    country: string;
    state?: string;
    city?: string;
  }>; // REQUIRED by Checkr API
}

interface InvitationData {
  candidate_id: string;
  package: string;
  work_locations: Array<{
    country: string;
    state?: string;
    city?: string;
  }>;
  node?: string; // Optional node for account hierarchy
}

interface ReportData {
  candidate_id: string;
  package: string;
}

interface CheckrApiResponse<T = any> {
  id: string;
  object: string;
  created_at: string;
  data?: T;
  // Additional fields specific to different endpoints
  [key: string]: any;
}

interface CheckrError {
  type: string;
  message: string;
  param?: string;
  code?: string;
}

class CheckrClient {
  private config: CheckrEnvironment;

  constructor() {
    this.config = this.validateEnvironment();
  }

  private validateEnvironment(): CheckrEnvironment {
    const apiKey = process.env.CHECKR_API_KEY;
    const baseUrl = process.env.CHECKR_BASE_URL || "https://api.checkr-staging.com/v1";
    const webhookSecret = process.env.CHECKR_WEBHOOK_SECRET;

    if (!apiKey) {
      throw new Error("CHECKR_API_KEY environment variable is required");
    }

    const isStaging = baseUrl.includes("staging") || baseUrl.includes("checkr-staging");

    return {
      apiKey,
      baseUrl,
      webhookSecret,
      isStaging
    };
  }

  private async makeRequest<T = any>(
    endpoint: string, 
    options: RequestInit = {},
    useFormData = false
  ): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    // HTTP Basic authentication as specified in Checkr docs
    const auth = Buffer.from(`${this.config.apiKey}:`).toString('base64');
    
    const defaultHeaders = {
      'Content-Type': useFormData ? 'application/x-www-form-urlencoded' : 'application/json',
      'Authorization': `Basic ${auth}`,
    };

    try {
      console.log(`[CheckrClient] ${options.method || 'GET'} ${endpoint}`);
      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      const responseData = await response.json();

      if (!response.ok) {
        const error = responseData.error || responseData;
        console.error(`[CheckrClient] API Error:`, error);
        throw new CheckrAPIError(
          error.message || `HTTP ${response.status}`,
          response.status,
          error.type,
          error.param
        );
      }

      console.log(`[CheckrClient] Success: ${response.status}`);
      return responseData;
    } catch (error) {
      if (error instanceof CheckrAPIError) {
        throw error;
      }
      
      console.error(`[CheckrClient] Request failed for ${endpoint}:`, error);
      throw new CheckrAPIError(
        `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        0,
        'network_error'
      );
    }
  }

  // Candidate Management based on Checkr API docs
  async createCandidate(data: CandidateData, headers?: Record<string, string>): Promise<CheckrApiResponse> {
    try {
      // Validate work_locations is provided (required by Checkr API)
      if (!data.work_locations || data.work_locations.length === 0) {
        throw new CheckrAPIError("work_locations is required for candidate creation", 400, "validation_error", "work_locations");
      }

      // Validate work_locations structure
      for (const location of data.work_locations) {
        if (!location.country) {
          throw new CheckrAPIError("work_locations.country is required", 400, "validation_error", "work_locations.country");
        }
      }

      console.log("[CheckrClient] Creating candidate with data:", {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone ? '***' : undefined,
        zipcode: data.zipcode,
        custom_id: data.custom_id,
        work_locations: data.work_locations,
      });
      
      // Convert to form data format as required by Checkr API
      const formData = objectToFormData(data);
      console.log("[CheckrClient] Form data:", formData);
      
      return this.makeRequest('/candidates', {
        method: 'POST',
        body: formData,
        headers: headers ? { ...headers } : undefined,
      }, true); // Use form data encoding
    } catch (error) {
      console.error("[CheckrClient] Failed to create candidate:", error);
      throw error;
    }
  }

  async getCandidate(candidateId: string): Promise<CheckrApiResponse> {
    return this.makeRequest(`/candidates/${candidateId}`);
  }

  async getCandidates(params?: { per_page?: number; page?: number }): Promise<CheckrApiResponse> {
    const queryParams = new URLSearchParams();
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.page) queryParams.append('page', params.page.toString());
    
    const endpoint = `/candidates${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.makeRequest(endpoint);
  }

  async updateCandidate(candidateId: string, updates: Partial<CandidateData>): Promise<CheckrApiResponse> {
    return this.makeRequest(`/candidates/${candidateId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  // Invitation Management based on Checkr API docs
  async createInvitation(data: InvitationData): Promise<CheckrApiResponse> {
    try {
      // Validate work_locations is provided (required by Checkr API)
      if (!data.work_locations || data.work_locations.length === 0) {
        throw new CheckrAPIError("work_locations is required for invitation creation", 400, "validation_error", "work_locations");
      }

      // Validate work_locations structure
      for (const location of data.work_locations) {
        if (!location.country) {
          throw new CheckrAPIError("work_locations.country is required", 400, "validation_error", "work_locations.country");
        }
      }

      console.log("[CheckrClient] Creating invitation with data:", {
        candidate_id: data.candidate_id,
        package: data.package,
        work_locations: data.work_locations,
      });
      
      // Convert to form data format as required by Checkr API
      const formData = objectToFormData(data);
      console.log("[CheckrClient] Form data:", formData);
      
      return this.makeRequest('/invitations', {
        method: 'POST',
        body: formData,
      }, true); // Use form data encoding
    } catch (error) {
      console.error("[CheckrClient] Failed to create invitation:", error);
      throw error;
    }
  }

  async getInvitation(invitationId: string): Promise<CheckrApiResponse> {
    return this.makeRequest(`/invitations/${invitationId}`);
  }

  async cancelInvitation(invitationId: string): Promise<CheckrApiResponse> {
    return this.makeRequest(`/invitations/${invitationId}`, {
      method: 'DELETE',
    });
  }

  async resendInvitation(invitationId: string): Promise<CheckrApiResponse> {
    return this.makeRequest(`/invitations/${invitationId}/resend`, {
      method: 'POST',
    });
  }

  // Report Management based on Checkr API docs
  async createReport(data: ReportData): Promise<CheckrApiResponse> {
    return this.makeRequest('/reports', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getReport(reportId: string): Promise<CheckrApiResponse> {
    return this.makeRequest(`/reports/${reportId}`);
  }

  async upgradeReport(reportId: string, packageSlug: string): Promise<CheckrApiResponse> {
    return this.makeRequest(`/reports/${reportId}/upgrade`, {
      method: 'POST',
      body: JSON.stringify({ package: packageSlug }),
    });
  }

  // Package Management
  async getPackages(): Promise<CheckrApiResponse> {
    try {
      console.log("[CheckrClient] Fetching available packages...");
      const response = await this.makeRequest('/packages');
      console.log("[CheckrClient] Available packages:", response.data?.map((p: any) => p.slug) || []);
      return response;
    } catch (error) {
      console.error("[CheckrClient] Failed to fetch packages:", error);
      throw error;
    }
  }

  // Nodes Management for Account Hierarchy
  async getNodes(): Promise<CheckrApiResponse> {
    try {
      console.log("[CheckrClient] Fetching account hierarchy nodes...");
      const response = await this.makeRequest('/nodes?include=packages');
      console.log("[CheckrClient] Available nodes:", response.data?.length || 0);
      return response;
    } catch (error) {
      console.error("[CheckrClient] Failed to fetch nodes:", error);
      throw error;
    }
  }

  // Screening Management
  async getScreening(screeningId: string): Promise<CheckrApiResponse> {
    try {
      console.log(`[CheckrClient] Fetching screening: ${screeningId}`);
      return this.makeRequest(`/screenings/${screeningId}`);
    } catch (error) {
      console.error(`[CheckrClient] Failed to fetch screening ${screeningId}:`, error);
      throw error;
    }
  }

  // Webhook Utilities
  verifyWebhookSignature(body: string, signature: string): boolean {
    if (!this.config.webhookSecret) {
      console.warn('[CheckrClient] No webhook secret configured, skipping verification');
      return true; // Allow in development
    }

    try {
      const expectedSignature = crypto
        .createHmac('sha256', this.config.webhookSecret)
        .update(body)
        .digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(signature, 'hex'),
        Buffer.from(expectedSignature, 'hex')
      );
    } catch (error) {
      console.error('[CheckrClient] Signature verification failed:', error);
      return false;
    }
  }

  // Environment Info
  getEnvironment() {
    return {
      isStaging: this.config.isStaging,
      baseUrl: this.config.baseUrl,
      hasWebhookSecret: !!this.config.webhookSecret,
    };
  }
}

class CheckrAPIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public type?: string,
    public param?: string
  ) {
    super(message);
    this.name = 'CheckrAPIError';
  }

  isAuthenticationError(): boolean {
    return this.statusCode === 401 || this.type === 'authentication_error';
  }

  isValidationError(): boolean {
    return this.statusCode === 400 || this.type === 'invalid_request_error';
  }

  isRateLimitError(): boolean {
    return this.statusCode === 429 || this.type === 'rate_limit_error';
  }

  isNotFoundError(): boolean {
    return this.statusCode === 404;
  }
}

export const checkr = new CheckrClient();

// Utility function to create default work locations
export function createDefaultWorkLocations(userLocation?: { state?: string; city?: string }): Array<{ country: string; state?: string; city?: string }> {
  return [{
    country: "US",
    state: userLocation?.state || "CA", // Default to California if no state provided
    city: userLocation?.city || "San Francisco", // Default city for better Checkr processing
  }];
}

// Utility function to validate work locations format
export function validateWorkLocations(workLocations: any[]): boolean {
  if (!Array.isArray(workLocations) || workLocations.length === 0) {
    return false;
  }
  
  return workLocations.every(location => 
    location && 
    typeof location.country === 'string' && 
    location.country.length > 0
  );
}

// Utility function to convert object data to form-encoded format for Checkr API
function objectToFormData(obj: any): string {
  const params = new URLSearchParams();
  
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null) continue;
    
    if (key === 'work_locations' && Array.isArray(value)) {
      // Handle work_locations array format: work_locations[][country]=US
      value.forEach((location: any, index: number) => {
        if (location.country) {
          params.append(`work_locations[][country]`, location.country);
        }
        if (location.state) {
          params.append(`work_locations[][state]`, location.state);
        }
        if (location.city) {
          params.append(`work_locations[][city]`, location.city);
        }
      });
    } else if (typeof value === 'boolean') {
      params.append(key, value.toString());
    } else if (typeof value === 'string' || typeof value === 'number') {
      params.append(key, value.toString());
    }
  }
  
  return params.toString();
}

export { CheckrAPIError, type CandidateData, type InvitationData, type CheckrApiResponse }; 