# Vercel Deployment Guide

Step-by-step guide to deploy the Task Manager application to Vercel.

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- MongoDB Atlas account (or local MongoDB)

## Step 1: Push to GitHub

1. Initialize git repository (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Create a new repository on GitHub

3. Push your code:
   ```bash
   git remote add origin https://github.com/yourusername/task-manager.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy to Vercel

### Method 1: Via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings
5. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

6. Click "Deploy"

### Method 2: Via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (first time - will ask questions)
vercel

# Deploy to production
vercel --prod
```

## Step 3: Configure Environment Variables

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

### Required Variables

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/task-manager
NEXTAUTH_SECRET=your-generated-secret-key
NEXTAUTH_URL=https://your-app.vercel.app
```

### Optional Variables (for AI features)

```
GENAI_API_KEY=your-genai-api-key
GENAI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
GENAI_MODEL=gemini-pro
```

4. **Important**: Set variables for all environments:
   - Production
   - Preview
   - Development

5. **Generate NEXTAUTH_SECRET**:
   ```bash
   openssl rand -base64 32
   ```

## Step 4: Configure MongoDB Atlas

1. Go to MongoDB Atlas Dashboard
2. Navigate to **Network Access**
3. Add IP Address:
   - Click "Add IP Address"
   - For Vercel, you can use `0.0.0.0/0` (allows all IPs)
   - Or add specific Vercel IP ranges (check Vercel docs)

4. Update `MONGODB_URI` in Vercel environment variables with your Atlas connection string

## Step 5: Redeploy

After adding environment variables:

1. Go to **Deployments** tab
2. Click the three dots (⋯) on the latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger automatic deployment

## Step 6: Verify Deployment

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Test the application:
   - Sign up for a new account
   - Create a task
   - Test CRUD operations
   - Test AI suggestions (if configured)

## Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXTAUTH_URL` environment variable to your custom domain
5. Redeploy

## Vercel Features

### Automatic Deployments
- Every push to `main` branch → Production deployment
- Pull requests → Preview deployments
- Automatic HTTPS
- Global CDN

### Analytics (Optional)
1. Go to **Analytics** tab
2. Enable Vercel Analytics (may require upgrade for detailed analytics)
3. View performance metrics

### Environment Variables per Environment
- Set different values for Production, Preview, and Development
- Useful for testing with different MongoDB instances

## Troubleshooting

### Build Fails

1. Check build logs in Vercel Dashboard
2. Common issues:
   - Missing environment variables
   - TypeScript errors
   - Missing dependencies

### Application Not Working

1. Check function logs in Vercel Dashboard
2. Verify environment variables are set
3. Check MongoDB connection (verify IP whitelist)
4. Verify `NEXTAUTH_URL` matches your Vercel domain

### MongoDB Connection Issues

1. Verify MongoDB Atlas IP whitelist includes Vercel IPs
2. Check connection string format
3. Verify database user credentials

## Monitoring

- **Deployments**: View all deployments in Vercel Dashboard
- **Logs**: Real-time function logs
- **Analytics**: Performance metrics (if enabled)
- **Speed Insights**: Core Web Vitals (if enabled)

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Vercel Support](https://vercel.com/support)

