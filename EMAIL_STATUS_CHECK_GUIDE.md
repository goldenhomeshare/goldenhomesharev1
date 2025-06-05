# Email-Based Background Check Status Guide

## Overview

Users can now check their background check status using just their email address, making it much more user-friendly than requiring invitation or candidate IDs.

## Implementation Details

### API Endpoint: `/api/checkr/check-status`

**Accepts any of:**
- `invitationId` (string) - Checkr invitation ID
- `candidateId` (string) - Checkr candidate ID  
- `email` (string) - Candidate's email address

### How Email Lookup Works

1. **Database Search**: First searches our database for records matching the email
2. **ID Extraction**: If found, extracts the `invitationId` and `candidateId` from our record
3. **Checkr API Calls**: Uses those IDs to fetch real-time status from Checkr
4. **Comprehensive Response**: Returns detailed status, timeline, and results

## Usage Examples

### 1. Web Interface Testing

Visit: [http://localhost:3000/test-checkr](http://localhost:3000/test-checkr)

1. Click "Show Status Check Form"
2. Enter email address in the "Email Address" field
3. Click "Check Status"
4. View comprehensive results with color-coded status

### 2. API Testing

```bash
# Check status by email
curl -X POST http://localhost:3000/api/checkr/check-status \
  -H "Content-Type: application/json" \
  -d '{"email":"candidate@example.com"}'

# Still works with IDs
curl -X POST http://localhost:3000/api/checkr/check-status \
  -H "Content-Type: application/json" \
  -d '{"invitationId":"301fa25e5210ddcd66134416"}'
```

## Response Format

```json
{
  "success": true,
  "data": {
    "status": {
      "invitation": "pending",
      "report": "not_started", 
      "overall": "pending"
    },
    "result": "pending",
    "summary": {
      "isComplete": false,
      "isClear": false,
      "isPending": true,
      "message": "Invitation sent - Waiting for candidate to complete"
    },
    "candidate": {
      "name": "John Doe",
      "email": "john.doe@gmail.com"
    },
    "invitation": {
      "status": "pending",
      "createdAt": "2025-06-05T17:40:37Z",
      "expiresAt": "2025-06-13T06:59:59Z",
      "invitationUrl": "https://apply.checkrhq-staging.net/..."
    }
  }
}
```

## Status Indicators

- ✅ **CLEAR**: Background check passed with no issues
- ⚠️ **CONSIDER**: Items found requiring review  
- ⏳ **PENDING**: Waiting for candidate or processing
- ❌ **EXPIRED**: Invitation expired (7 days)

## Error Handling

### Email Not Found
```json
{
  "success": true,
  "data": {
    "summary": {
      "message": "No background check found for email user@example.com. Please check the email address or contact support."
    }
  }
}
```

### Invalid Email Format
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "code": "invalid_string",
      "message": "Invalid email"
    }
  ]
}
```

## Integration Benefits

### For Users
- **No ID Required**: Just use email address
- **User-Friendly**: Much easier than remembering long invitation IDs
- **Self-Service**: Check status anytime without contacting support

### For Platform
- **Reduced Support**: Users can check status independently
- **Better UX**: More intuitive than ID-based lookup
- **Audit Trail**: All lookups tracked in database

## Production Considerations

### Database Performance
- Index on `candidateEmail` field for fast lookups
- Consider email normalization (lowercase, trim)

### Privacy & Security
- Rate limiting on email-based lookups
- Optional: Require additional verification for sensitive results
- Consider masking partial results for privacy

### Scalability
- Database queries are efficient with proper indexing
- Checkr API calls are only made when records exist
- Response caching possible for recent results

## Testing with Limited Staging Users

Since staging mode has limited test users:

1. **Use Existing Records**: Test with previously created invitation IDs
2. **Email Demo**: Interface shows how email lookup would work
3. **Mock Testing**: Create test scenarios without using Checkr API
4. **Documentation**: Comprehensive examples for integration

## Future Enhancements

- **Email Notifications**: Automatic status updates via email
- **Multiple Records**: Handle users with multiple background checks
- **SMS Integration**: Status checking via text message
- **Mobile App**: Dedicated mobile interface for status checking 