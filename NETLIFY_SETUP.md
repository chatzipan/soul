# Netlify Setup for Menu Update Solution

## Overview

This guide shows how to configure Netlify to work with the Google Cloud Storage + Webhook architecture for menu updates.

## Netlify Configuration

### 1. Build Settings

In your Netlify dashboard, configure these build settings:

```bash
# Build command
npm run build

# Publish directory
public

# Node version
18 (or your preferred version)
```

### 2. Environment Variables

Add these environment variables in your Netlify dashboard:

```bash
# Google Cloud Storage
GCS_MENU_BUCKET_NAME=menu_bucket

# Gatsby rebuild webhook (Netlify build hook)
GATSBY_REBUILD_WEBHOOK=https://api.netlify.com/build_hooks/YOUR_BUILD_HOOK_ID
```

### 3. Create Netlify Build Hook

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Build & deploy** → **Build hooks**
3. Click **Add build hook**
4. Give it a name like "Menu Update Hook"
5. Copy the generated webhook URL
6. Use this URL as your `GATSBY_REBUILD_WEBHOOK` environment variable

### 4. Upload Google Cloud Credentials

If you need Google Cloud credentials for the build process:

1. Create a service account key file (`google_cloud_keys.json`)
2. In Netlify dashboard, go to **Site settings** → **Build & deploy** → **Environment**
3. Add the file content as an environment variable or upload it

## Firebase Functions Configuration

### Environment Variables

Set these in your Firebase Functions:

```bash
# Google Cloud Storage
GCS_MENU_BUCKET_NAME=menu_bucket

# Netlify build hook
GATSBY_REBUILD_WEBHOOK=https://api.netlify.com/build_hooks/YOUR_BUILD_HOOK_ID
GATSBY_WEBHOOK_SECRET=your-secret-key
```

### Deploy Functions

```bash
cd functions
npm install
firebase deploy --only functions
```

## Testing the Flow

### 1. Test Menu Update

1. Go to your admin interface
2. Update the menu
3. Check Firebase Function logs for GCS upload success
4. Verify the webhook was called

### 2. Check Netlify Build

1. Go to your Netlify dashboard
2. Check **Deploys** tab
3. Look for a new build triggered by the webhook
4. Verify the build completed successfully

### 3. Verify Menu Update

1. Check your live site
2. Navigate to the menu page
3. Verify the changes are visible

## Troubleshooting

### Build Hook Not Working

- Verify the webhook URL is correct
- Check that the secret matches in both Netlify and Firebase
- Look at Firebase Function logs for webhook call errors

### GCS Access Issues

- Ensure your service account has proper permissions
- Check that the bucket name is correct
- Verify credentials are properly configured

### Build Failures

- Check Netlify build logs for errors
- Verify the `download-menu.js` script runs successfully
- Ensure the static directory is created properly

## Monitoring

### Netlify Dashboard

- **Deploys**: Monitor build success/failure
- **Functions**: Check function execution (if using Netlify Functions)
- **Analytics**: Track site performance

### Firebase Console

- **Functions**: Monitor function execution and logs
- **Storage**: Check GCS uploads

## Alternative: Netlify Functions

If you prefer to keep everything on Netlify, you could also:

1. **Use Netlify Functions** instead of Firebase Functions
2. **Store menu in Netlify's KV store** instead of GCS
3. **Use Netlify's build hooks** for triggering rebuilds

This would eliminate the need for Firebase entirely, but the current solution with Firebase Functions + GCS is more scalable and cost-effective.

## Security Considerations

1. **Webhook Secret**: Use a strong, unique secret for webhook authentication
2. **GCS Permissions**: Limit service account permissions to only what's needed
3. **Environment Variables**: Keep sensitive data in environment variables, not in code
4. **HTTPS**: Ensure all webhook calls use HTTPS

## Cost Optimization

- **GCS**: Very cheap for this use case (~$0.02/GB/month)
- **Netlify**: Free tier includes 100GB bandwidth and 300 build minutes
- **Firebase Functions**: Free tier includes 125K invocations/month

The total cost for this solution should be minimal, likely under $5/month even with moderate usage.
