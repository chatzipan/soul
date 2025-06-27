# Menu Update Solution

## Problem

In a monorepo with Gatsby SSG and Firebase Functions, the serverless functions can't directly commit to the git repository because they only have access to the functions folder during deployment. This makes it impossible to update `menu.json` from the UI and have those changes reflected in the Gatsby build.

## Solution: Google Cloud Storage + Webhook Architecture

### Overview

This solution uses Google Cloud Storage (GCS) as the single source of truth for the menu data, with webhooks to trigger Gatsby rebuilds when the menu is updated.

### Architecture

```
UI Update → Firebase Function → GCS Upload → Webhook → Gatsby Rebuild
```

### Components

#### 1. Firebase Function Updates (`functions/src/utils/menu/index.ts`)

- **GCS Upload**: Uploads updated menu to Google Cloud Storage
- **GCS Comparison**: Compares with existing menu in GCS for changes
- **Webhook Trigger**: Calls a webhook to trigger Gatsby rebuild
- **No Local Storage**: Menu is only stored in GCS

#### 2. Gatsby Build Process

- **Menu Download**: Downloads menu from GCS during build
- **No Fallback**: Build fails if GCS is unavailable (ensures data integrity)
- **Data Source**: Sources menu from `static/menu.json`

#### 3. Webhook Endpoint (`functions/src/routes/menu.ts`)

- **Security**: Validates webhook secret
- **Menu Update**: Triggers menu update from external sources

### Environment Variables

Add these to your Firebase Functions environment:

```bash
# Google Cloud Storage
GCS_MENU_BUCKET_NAME=soulzuerich.ch

# Gatsby Rebuild Webhook
GATSBY_REBUILD_WEBHOOK=https://your-deployment-platform.com/webhook
GATSBY_WEBHOOK_SECRET=your-secret-key
```

### Deployment Platforms

#### Option 1: Vercel

1. Set up a Vercel project for your Gatsby site
2. Add build command: `npm run build`
3. Set webhook URL: `https://your-vercel-app.vercel.app/api/rebuild`
4. Create API route: `src/api/rebuild.js`

#### Option 2: Netlify

1. Set up Netlify for your Gatsby site
2. Add build command: `npm run build`
3. Set webhook URL: `https://api.netlify.com/build_hooks/your-hook-id`
4. Configure build hook in Netlify dashboard

#### Option 3: GitHub Actions

1. Create GitHub Action workflow
2. Trigger on webhook events
3. Build and deploy Gatsby site

### Alternative Solutions

#### Solution 2: Database + API

- Store menu in Firestore/Database
- Create API endpoints to fetch menu
- Use Gatsby's `gatsby-source-graphql` or custom data fetching

#### Solution 3: Headless CMS

- Use Contentful, Strapi, or similar
- Integrate with Gatsby via plugins
- Update menu through CMS interface

#### Solution 4: GitHub API

- Use GitHub API to create commits
- Trigger GitHub Actions for deployment
- More complex but maintains git history

### Benefits of GCS Solution

1. **Single Source of Truth**: GCS is the only source, eliminating sync issues
2. **Reliability**: GCS is highly available and scalable
3. **Performance**: Fast access to menu data
4. **Simplicity**: No local file management or git dependencies
5. **Data Integrity**: Build fails if menu is unavailable, preventing stale data
6. **Cost-effective**: GCS is very cheap for this use case

### Implementation Steps

1. **Deploy Updated Functions**

   ```bash
   cd functions
   npm install
   firebase deploy --only functions
   ```

2. **Update Gatsby Configuration**

   - Menu sources from `static/menu.json`
   - Build process downloads from GCS

3. **Set Up Webhook**

   - Configure deployment platform webhook
   - Set environment variables

4. **Test the Flow**
   - Update menu via admin UI
   - Verify GCS upload
   - Check webhook trigger
   - Confirm Gatsby rebuild

### File Structure

```
soul/
├── static/
│   └── menu.json          # Downloaded from GCS during build
├── functions/
│   └── src/
│       └── utils/
│           └── menu/
│               └── index.ts  # Uploads to GCS, no local storage
└── src/
    └── components/
        └── menu/
            ├── entry.tsx  # Imports from static/menu.json
            └── category.tsx
```

### Monitoring

- **GCS Logs**: Monitor upload success/failure
- **Function Logs**: Check Firebase Function execution
- **Webhook Logs**: Verify rebuild triggers
- **Build Logs**: Monitor Gatsby build process

### Troubleshooting

1. **GCS Upload Fails**: Check credentials and bucket permissions
2. **Webhook Not Triggering**: Verify URL and secret configuration
3. **Build Fails**: Check GCS availability and credentials
4. **Menu Not Updating**: Verify data source configuration

### Trade-offs

**Pros:**

- Single source of truth
- No sync issues
- Simpler architecture
- Always fresh data

**Cons:**

- Build fails if GCS is down
- Requires internet for builds
- No offline development capability

This solution provides a robust, scalable way to update your menu from the UI while maintaining data integrity and eliminating the complexity of managing local file copies.
