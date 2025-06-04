This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# goldenhomesharev1
# goldenhomesharecolab

## ✅ **Background Check Integration Fixed!**

### **What Was Fixed:**
1. ✅ **Database Operations:** Re-enabled saving background check records  
2. ✅ **Webhook Endpoint:** Created `/api/checkr/webhook` to handle completion updates
3. ✅ **User Verification:** Automatically updates `isVerified` when background check completes

### **Required Setup:**

#### **1. Configure Checkr Webhook (IMPORTANT)**
In your [Checkr Dashboard](https://dashboard.checkr.com), set up a webhook:

**Webhook URL:** `https://your-domain.com/api/checkr/webhook`
**Events to Subscribe:**
- `invitation.completed`
- `report.completed` 
- `invitation.canceled`
- `invitation.expired`

#### **2. Add Webhook Secret (Optional but Recommended)**
Add to your `.env` file:
```bash
CHECKR_WEBHOOK_SECRET=your_webhook_secret_from_checkr
```

### **How it Works Now:**
1. **User initiates background check** → Creates invitation & saves to database
2. **User completes Checkr form** → Checkr sends webhook to your app  
3. **Webhook processes completion** → Updates user's `isVerified` status
4. **User is verified** → No more prompts to redo background check

### **Testing:**
1. **Complete a background check** through your app
2. **Check the logs** for webhook events 
3. **Verify user status** - should be `isVerified: true`

The "keeps asking to redo" issue should now be resolved! 🎉
