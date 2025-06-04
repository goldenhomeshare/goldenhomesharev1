# Checkr Background Check Integration Setup (Embed Approach)

## Overview
This integration uses Checkr's invitation/embed system where Checkr handles the entire background check flow. Users receive secure invitations that can be completed directly within your app via iframe or in a separate tab.

## Environment Variables Required

Add these to your `.env` file:

```bash
# Checkr API Configuration
CHECKR_API_KEY=your_checkr_staging_api_key_here
CHECKR_WEBHOOK_SECRET=your_checkr_webhook_secret_here
CHECKR_BASE_URL=https://api.checkr.com/v1
```

## Webhook Configuration

### 1. ngrok Setup (Development)
Your ngrok tunnel should be running and pointing to your local development server:

```bash
# Start your development server
npm run dev

# In another terminal, start ngrok
ngrok http 3000
```

### 2. Checkr Dashboard Webhook Configuration
In your Checkr dashboard:

1. Go to Settings → Webhooks
2. Add webhook endpoint: `https://your-ngrok-url.ngrok.io/api/checkr/webhook`
3. Select events to subscribe to:
   - `invitation.completed` - When user completes the embedded form
   - `report.completed` - When background check is finished
   - `report.disputed` - When a report is disputed
4. Copy the webhook secret and add it to your `CHECKR_WEBHOOK_SECRET` environment variable

## API Endpoints

### 1. Create Background Check Invitation
`POST /api/checkr/initiate`

Creates a Checkr invitation for embedded background check flow.

**Request Body:**
```json
{
  "package": "tasker_standard"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Background check invitation created successfully",
  "invitationId": "invitation_123",
  "invitationUrl": "https://dashboard.checkr.com/invitations/...",
  "embedUrl": "https://dashboard.checkr.com/invitations/...",
  "status": "pending"
}
```

### 2. Webhook Endpoint
`POST /api/checkr/webhook`

Receives webhook notifications from Checkr when background check events occur.

## Database Schema

The integration uses the existing `background_checks` table:

```prisma
model background_checks {
  id                String                @id
  candidateId       String                @unique
  invitationId      String?
  reportId          String?
  requestedById     String?
  candidateUserId   String?
  candidateEmail    String
  candidateName     String
  candidatePhone    String?
  status            BackgroundCheckStatus @default(PENDING)
  checkrStatus      String?
  invitationUrl     String?
  invitationStatus  String?
  completedAt       DateTime?
  invitationSentAt  DateTime?
  createdAt         DateTime              @default(now())
  updatedAt         DateTime
}
```

## Integration Flow (Embed Approach)

1. **User Initiates**: User clicks "Start Background Check" from dashboard
2. **Create Invitation**: Your app calls Checkr API to create invitation
3. **Display Embed**: App shows Checkr form in iframe or opens in new tab
4. **User Completes**: User fills out background check form directly with Checkr
5. **Checkr Processes**: Checkr processes the background check
6. **Webhook Updates**: Checkr sends webhooks when completed
7. **Status Updates**: Your app updates user verification status

## Checkr Embed Implementation

### Option 1: Iframe Embed (Recommended)
```jsx
<iframe
  src={invitationUrl}
  className="w-full h-[600px] border-0"
  title="Checkr Background Check"
/>
```

### Option 2: New Tab/Window
```jsx
<Button onClick={() => window.open(invitationUrl, '_blank')}>
  Complete Background Check
</Button>
```

## Benefits of Embed Approach

### Security
- ✅ Checkr handles all sensitive data collection
- ✅ No PII stored on your servers
- ✅ SOC 2 and FCRA compliant by default
- ✅ Secure token-based authentication

### User Experience
- ✅ Seamless integration within your app
- ✅ Professional Checkr-designed UI
- ✅ Mobile-responsive forms
- ✅ Real-time validation and error handling

### Development
- ✅ Much simpler implementation
- ✅ No need to handle sensitive form data
- ✅ Automatic compliance with regulations
- ✅ Reduced development and maintenance effort

## Testing the Integration

### 1. Test Invitation Creation
```bash
curl -X POST https://your-ngrok-url.ngrok.io/api/checkr/initiate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_auth_token" \
  -d '{"package": "tasker_standard"}'
```

### 2. Test Webhook Endpoint
```bash
curl -X POST https://your-ngrok-url.ngrok.io/api/checkr/webhook \
  -H "Content-Type: application/json" \
  -H "x-checkr-signature: your_test_signature" \
  -d '{
    "type": "invitation.completed",
    "id": "evt_test_123",
    "data": {
      "object": {
        "id": "invitation_123",
        "status": "completed",
        "candidate_id": "candidate_123"
      }
    }
  }'
```

### 3. Monitor Logs
```bash
# In your application logs, you should see:
Checkr webhook event received: invitation.completed evt_test_123
Background check invitation completed for candidate_123
```

## Checkr Packages

Common background check packages:
- `tasker_standard` - Basic criminal and identity check
- `premium` - Comprehensive background check
- `basic` - Minimal verification
- `custom_package` - Your custom-configured package

## Security Considerations

- ✅ Webhook signature verification implemented
- ✅ All sensitive data handled by Checkr
- ✅ Secure iframe embedding with proper CSP headers
- ✅ Rate limiting on API endpoints
- ✅ Proper error handling and logging

## Troubleshooting

### Common Issues:

1. **Invitation not loading in iframe**: Check CSP headers and Checkr domain whitelist
2. **Webhook not receiving events**: Verify ngrok URL and webhook configuration
3. **Invitation expired**: Invitations have limited lifetime, recreate if needed
4. **CORS issues**: Ensure proper domain configuration in Checkr dashboard

### Debug Steps:

1. Check Checkr dashboard for invitation status
2. Verify webhook delivery logs in Checkr dashboard
3. Test invitation URLs directly in browser
4. Check iframe console for JavaScript errors
5. Monitor network requests for failed API calls

## Production Considerations

- Use HTTPS for all webhook endpoints
- Implement proper CSP headers for iframe security
- Set up monitoring for webhook delivery failures
- Configure backup notification methods (email)
- Test invitation flow end-to-end regularly 