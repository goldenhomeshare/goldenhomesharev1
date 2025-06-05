# Checkr Implementation Testing Guide

This guide provides multiple ways to test the newly implemented Checkr background check system.

## 🚀 Quick Start Testing

### 1. **Web Interface Testing** (Recommended)

Visit the interactive test page:
```
http://localhost:3000/test-checkr
```

This provides a visual interface to:
- Test all API endpoints
- View real-time responses
- See detailed error messages
- Understand expected behavior

### 2. **Command Line Testing**

Run the automated test suite:
```bash
node scripts/test-checkr.js
```

This will:
- Check server connectivity
- Test all endpoints
- Validate expected responses
- Provide a summary report

## 🧪 Testing Scenarios

### Basic Connectivity Tests

**Expected Results:**
- ✅ Status endpoints return `401 Unauthorized` (correct - requires auth)
- ✅ Webhook endpoint returns `200 Success` (processes events)
- ✅ All endpoints respond without server errors

### Authentication Flow Tests

Since the endpoints require authentication, you'll see:

```json
{
  "error": "Unauthorized"
}
```

This is **correct behavior** - it means:
- ✅ Authentication is properly enforced
- ✅ Endpoints are protected as designed
- ✅ No data leaks for unauthenticated requests

### Webhook Processing Tests

The webhook endpoint should process test events:

```json
{
  "success": true,
  "processed": "invitation.completed"
}
```

This confirms:
- ✅ Webhook signature validation works
- ✅ Event processing logic is functional
- ✅ Database updates are triggered

## 🔧 Advanced Testing

### Testing with Real Checkr API

To test actual Checkr integration:

1. **Check Environment Variables**
   ```bash
   grep -i checkr .env
   ```
   
   Should show:
   ```
   CHECKR_API_KEY=948a0bc0d9eb5ad48821630bfc0846fad7470457
   CHECKR_BASE_URL=https://api.checkr-staging.com/v1
   ```

2. **Test Checkr Connection**
   
   Create a test file:
   ```javascript
   // test-checkr-direct.js
   import { checkr } from './app/lib/checkr.js';
   
   async function testCheckr() {
     try {
       const environment = checkr.getEnvironment();
       console.log('Environment:', environment);
       
       const packages = await checkr.getPackages();
       console.log('Available packages:', packages.data?.length || 0);
     } catch (error) {
       console.error('Error:', error.message);
     }
   }
   
   testCheckr();
   ```

### Database Testing

Test database operations:

1. **Check Prisma Connection**
   ```bash
   npx prisma db push --preview-feature
   ```

2. **Verify Schema**
   ```bash
   npx prisma studio
   ```
   
   Look for:
   - `User` table with new fields (phone, zipcode, etc.)
   - `background_checks` table
   - Proper relations

### End-to-End Testing with Authentication

To test the full flow with authentication:

1. **Login to the application**
2. **Navigate to a background check page**
3. **Monitor browser console for API calls**
4. **Check network tab for request/response details**

## 📊 Expected Test Results

### ✅ Successful Test Output

When running `node scripts/test-checkr.js`:

```
🧪 Checkr Implementation Test Suite
=====================================

📋 Test: Status Endpoint
📝 Should require authentication
🌐 Testing GET /api/checkr/status
📊 Status: 401 Unauthorized
✅ Expected: 401, Got: 401

📋 Test: Verify Status Endpoint  
📝 Should require authentication
🌐 Testing GET /api/checkr/verify-status
📊 Status: 401 Unauthorized
✅ Expected: 401, Got: 401

📋 Test: Initiate Background Check
📝 Should require authentication
🌐 Testing POST /api/checkr/initiate
📊 Status: 401 Unauthorized
✅ Expected: 401, Got: 401

📋 Test: Webhook Handler
📝 Should process webhook events
🌐 Testing POST /api/checkr/webhook
📊 Status: 200 OK
✅ Expected: 200, Got: 200

📊 Test Summary
===============
✅ Passed: 4/4
❌ Failed: 0/4

🎉 All tests passed! Checkr implementation is working correctly.
```

### ❌ Troubleshooting Failed Tests

**Server Not Running:**
```
❌ Server is not running. Please start the development server with:
   npm run dev
```

**Database Connection Issues:**
```
❌ Database operations test failed: Database connection error
```

**Checkr API Issues:**
```
❌ Checkr connection test failed: CHECKR_API_KEY environment variable is required
```

## 🔍 Testing Checklist

### Basic Functionality ✅
- [ ] Server starts without errors
- [ ] All API endpoints respond
- [ ] Authentication is enforced
- [ ] Webhook processing works

### Database Integration ✅
- [ ] Prisma schema is up to date
- [ ] Database migrations applied
- [ ] Background check model works
- [ ] User validation functions

### Checkr API Integration ✅
- [ ] Environment variables configured
- [ ] API key authentication works
- [ ] Can fetch available packages
- [ ] Error handling is robust

### Error Handling ✅
- [ ] Proper error responses
- [ ] Validation errors handled
- [ ] Network errors graceful
- [ ] Authentication errors clear

## 🚀 Next Steps After Testing

Once all tests pass:

1. **Frontend Integration**
   - Create background check UI components
   - Implement status polling
   - Add user profile completion

2. **Production Preparation**
   - Switch to production Checkr environment
   - Configure webhook endpoints
   - Set up monitoring

3. **User Testing**
   - Test with real user accounts
   - Verify complete background check flow
   - Test edge cases and error scenarios

## 📞 Support

If you encounter issues:

1. **Check the logs** in browser console and terminal
2. **Verify environment variables** are set correctly
3. **Ensure database is running** and accessible
4. **Check Checkr API status** at https://status.checkr.com
5. **Review the implementation docs** in `CHECKR_IMPLEMENTATION_COMPLETE.md`

---

**Status**: Ready for testing! 🧪✨ 