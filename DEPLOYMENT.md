# Deployment Guide

This guide covers deploying the Task Manager application to production.

## Prerequisites

- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)
- GitHub account (for CI/CD)
- Vercel account (recommended) or Netlify

## Environment Variables

Create a `.env.local` file (or set in your hosting platform) with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=generate_a_secure_random_string
NEXTAUTH_URL=https://your-domain.com
OPENAI_API_KEY=your_openai_key (optional)
```

### Generating NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

## Deployment Options

### Option 1: Vercel (Recommended - Best for Next.js)

**Vercel is the recommended and easiest option** for Next.js applications. Since this app uses Next.js API routes (no separate backend), Vercel handles both frontend and backend automatically.

#### Quick Deploy

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Add environment variables (see below)
   - Click "Deploy"

3. **Environment Variables in Vercel**
   - Go to Project Settings → Environment Variables
   - Add the following:
     - `MONGODB_URI`
     - `NEXTAUTH_SECRET`
     - `NEXTAUTH_URL` (your Vercel URL: `https://your-app.vercel.app`)
     - `GENAI_API_KEY` (optional)
     - `GENAI_API_URL` (optional)
     - `GENAI_MODEL` (optional)

4. **Configure MongoDB Atlas**
   - Add Vercel deployment IP to MongoDB Atlas IP whitelist
   - Or set IP whitelist to `0.0.0.0/0` (less secure but easier)

#### Vercel CLI Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Option 2: Render (Alternative)

Render is an alternative platform that also supports Next.js applications.

**Note**: Vercel is recommended because it's built by the Next.js team and provides the best Next.js experience. However, Render works fine if you prefer it.

#### Deploy to Render

1. **Push to GitHub** (same as Vercel)

2. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

3. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

4. **Configure Settings**
   - **Name**: task-manager
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or choose a paid plan)

5. **Add Environment Variables** (same as Vercel)

6. **Deploy**

**Note**: Free tier on Render may have cold starts (first request after inactivity can be slow).

### Option 3: Netlify

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables
   - Click "Deploy"

3. **Configure MongoDB Atlas** (if using)
   - Add your Vercel deployment IP to MongoDB Atlas IP whitelist
   - Or set IP whitelist to `0.0.0.0/0` (less secure)

### Option 2: Netlify

1. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

2. **Environment Variables**
   - Add all required environment variables in Netlify dashboard

3. **Deploy**
   - Connect your GitHub repository
   - Configure build settings
   - Deploy

### Option 3: Self-Hosted

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

3. **Use a process manager** (PM2 recommended)
   ```bash
   npm install -g pm2
   pm2 start npm --name "task-manager" -- start
   pm2 save
   pm2 startup
   ```

## MongoDB Setup

### Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/task-manager`

### MongoDB Atlas (Cloud)

1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist IP addresses (or use `0.0.0.0/0` for development)
5. Get connection string and update `MONGODB_URI`

## CI/CD Configuration

The project includes GitHub Actions workflow (`.github/workflows/ci.yml`).

### Setup GitHub Secrets

1. Go to repository Settings > Secrets
2. Add the following secrets:
   - `MONGODB_URI`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`

### Workflow Features

- Runs on push to main/develop branches
- Runs on pull requests
- Lints code
- Runs tests
- Builds application
- Runs E2E tests

## Post-Deployment Checklist

- [ ] Environment variables configured
- [ ] MongoDB connection verified (whitelist deployment IPs or use `0.0.0.0/0`)
- [ ] Authentication working
- [ ] CRUD operations tested
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Custom domain configured (optional)
- [ ] Test AI suggestions feature (if configured)
- [ ] Vercel Analytics enabled (optional)
- [ ] Preview deployments working (Vercel)
- [ ] Environment variables set for all environments (Production, Preview, Development on Vercel)

## Performance Optimization

### Vercel Optimizations

- Automatic code splitting
- Edge caching
- Image optimization
- Automatic HTTPS

### Additional Optimizations

1. **Database Indexing**: Already configured in models
2. **Caching**: Implement Redis for rate limiting
3. **CDN**: Use Vercel Edge Network or Cloudflare
4. **Monitoring**: Set up Vercel Analytics or similar

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check connection string
   - Verify IP whitelist
   - Check database credentials

2. **Authentication Not Working**
   - Verify `NEXTAUTH_SECRET` is set
   - Check `NEXTAUTH_URL` matches your domain
   - Clear browser cookies

3. **Build Failures**
   - Check Node.js version (18+)
   - Verify all dependencies installed
   - Check for TypeScript errors

4. **Environment Variables Not Loading**
   - Restart deployment after adding variables
   - Verify variable names match exactly
   - Check for typos

## Monitoring

### Recommended Tools

- **Vercel Analytics**: Built-in with Vercel
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **MongoDB Atlas Monitoring**: Database metrics

## Backup Strategy

1. **Database Backups**
   - MongoDB Atlas: Automatic backups
   - Local MongoDB: Use `mongodump`

2. **Code Backups**
   - GitHub repository serves as backup
   - Tag releases for version control

## Scaling Considerations

1. **Database**: Use MongoDB Atlas with auto-scaling
2. **Application**: Vercel handles horizontal scaling
3. **Caching**: Implement Redis for session storage
4. **CDN**: Use Vercel Edge Network

## Support

For deployment issues, check:
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)

