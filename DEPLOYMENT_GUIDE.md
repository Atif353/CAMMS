# CAMMS Deployment Guide - Free Hosting Options (2025)

This guide provides step-by-step instructions for deploying CAMMS to free hosting platforms.

## 🎯 Recommended Free Hosting Stack (2025)

### Option 1: Recommended for Private Repos (Best for Full-Stack Apps)
- **Frontend**: Vercel (Free tier - supports private repos) ✅
- **Backend**: Railway (Free tier - supports private repos) ✅ or Fly.io (Free tier)
- **Database**: Supabase PostgreSQL (Free tier) or Neon (Free tier)
- **Python Service**: Runs internally with backend (no separate deployment needed)

### Option 1B: Alternative (Public Repo Required)
- **Frontend**: Vercel or Netlify (Free tier)
- **Backend**: Render (Free tier - **requires public repo** ⚠️)
- **Database**: Supabase PostgreSQL (Free tier) or Neon (Free tier)
- **Python Service**: Runs internally with backend

### Option 2: Alternative
- **Frontend**: GitHub Pages or Cloudflare Pages
- **Backend**: Fly.io (Free tier) or Cyclic (Free tier)
- **Database**: Supabase PostgreSQL (Free tier)
- **Python Service**: Runs internally with backend

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All environment variables are documented
- [ ] Database migrations are ready
- [ ] Frontend build works locally (`npm run build`)
- [ ] Backend runs without errors
- [ ] All secrets are stored securely (not in code)
- [ ] `.gitignore` is properly configured

---

## 🗄️ Step 1: Database Setup (Supabase - Recommended)

### Why Supabase?
- ✅ Free PostgreSQL database (500 MB storage)
- ✅ Built-in connection pooling
- ✅ Web dashboard for database management
- ✅ Automatic backups
- ✅ Free tier is generous for development

### Setup Instructions:

1. **Create Supabase Account**
   - Go to: https://supabase.com
   - Sign up for free account
   - Create a new project

2. **Get Database Connection String**
   - Go to Project Settings → Database
   - Copy the "Connection string" (URI format)
   - **Important**: Add `?sslmode=require` at the end
   - Format: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require`
   - **Note**: Supabase requires SSL connections, so the `?sslmode=require` parameter is mandatory

3. **Run Prisma Migrations**
   ```bash
   # Update DATABASE_URL in your .env (include ?sslmode=require)
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require
   
   # Run migrations (for production/deployment)
   cd backend
   npm run prisma:migrate:deploy
   
   # Or for development
   npm run prisma:migrate
   ```
   
   **Troubleshooting**: If you get "Can't reach database server" error:
   - Check if your Supabase database is paused (free tier pauses after 1 week of inactivity)
   - Go to Supabase dashboard → Resume/Restore your database
   - Ensure `?sslmode=require` is in your connection string
   - See `SUPABASE_CONNECTION_TROUBLESHOOTING.md` for detailed help

4. **Seed Database (Optional)**
   ```bash
   npm run seed
   ```

### Alternative: Neon (Free PostgreSQL)
- Go to: https://neon.tech
- Create free account
- Create new project
- Copy connection string
- Same process as Supabase

---

## 🚀 Step 2: Backend Deployment

### Option A: Railway (Recommended for Private Repos) ✅

**Why Railway?**
- ✅ Free tier with $5 credit/month (generous for small projects)
- ✅ **Supports private GitHub repositories** (no need to make repo public!)
- ✅ Automatic SSL certificates
- ✅ Easy environment variable management
- ✅ Auto-deploy from GitHub
- ✅ Simple setup process

### Option B: Render (Requires Public Repo) ⚠️

**Why Render?**
- ✅ Free tier with 750 hours/month
- ✅ Automatic SSL certificates
- ✅ Easy environment variable management
- ⚠️ **Free tier only supports public repositories**
- ✅ Auto-deploy from GitHub

### Setup Instructions - Railway (Private Repo Friendly):

1. **Prepare Backend for Deployment**
   ```bash
   cd backend
   # Ensure package.json has start script
   # "start": "node src/index.js"
   ```

2. **Deploy on Railway**
   - Go to: https://railway.app
   - Sign up with GitHub (free)
   - Click **"New Project"**
   - Select **"Deploy from GitHub repo"**
   - **Select your private repository** (Railway supports private repos!)
   - Railway will auto-detect it's a Node.js project
   - Click **"Add Service"** → **"GitHub Repo"**
   - Select your repository
   - **Set Root Directory**: `backend` (important!)
   - Railway will automatically:
     - Detect Node.js
     - Run `npm install`
     - Start with `npm start`

3. **Configure Build Settings** (if needed)
   - Go to your service → Settings → Build
   - **Build Command**: `npm install && npm run prisma:generate && (python3 -m pip install --user pandas matplotlib openpyxl || echo "Python deps skipped")`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`

4. **Set Environment Variables in Railway**
   - Go to your service → Variables tab
   - Add the following:
     ```
     NODE_ENV=production
     DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require
     JWT_SECRET=your-strong-secret-key-here
     JWT_REFRESH_SECRET=your-strong-refresh-secret-here
     PORT=5000
     FRONTEND_URL=https://your-frontend.vercel.app (add after frontend deployment)
     ```
   - Railway will auto-deploy when you add variables

5. **Deploy**
   - Railway automatically deploys when you connect the repo
   - Wait for deployment (3-5 minutes)
   - Your backend will be at: `https://your-project.up.railway.app`
   - You can set a custom domain in Railway settings

### Alternative: Render (Requires Public Repo)

3. **Deploy on Render**
   - Go to: https://render.com
   - Sign up (free with GitHub)
   - Click "New +" → "Web Service"
   - **Connect GitHub Account**:
     - Click "Connect GitHub" button
     - Authorize Render to access your repositories
     - **Important**: For free tier, your repository must be **public**
     - If repo doesn't appear, refresh page or reconnect GitHub
   - **Select Your Repository**:
     - Search for your repository name
     - Select the repository (frontend + backend in one repo is fine!)
   - **Configure**:
     - **Repository**: Your connected repo
     - **Branch**: `main` or `master`
     - **Root Directory**: `backend` (this tells Render to deploy from backend folder)
     - **Name**: `camms-backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install && npm run prisma:generate && (python3 -m pip install --user pandas matplotlib openpyxl || echo "Python deps skipped")`
     - **Start Command**: `npm start`
     - **Plan**: Free
   
   **Note**: You can deploy both frontend and backend from the same GitHub repository! Just set different Root Directories.
     - **Name**: `camms-backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install && npm run prisma:generate && (python3 -m pip install --user pandas matplotlib openpyxl || echo "Python deps skipped")`
     - **Start Command**: `npm start`
     - **Plan**: Free
     - **Note**: Python dependencies are installed for PDF/Excel report generation. If Python isn't available, reports will fall back to JSON format.

4. **Set Environment Variables in Render**
   - Go to Environment tab
   - Add the following (click "Add Environment Variable" for each):
     ```
     NODE_ENV=production
     DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
     JWT_SECRET=your-strong-secret-key-here (use a long random string)
     JWT_REFRESH_SECRET=your-strong-refresh-secret-here (use a long random string)
     PORT=5000
     FRONTEND_URL=https://your-frontend.vercel.app (add after frontend deployment)
     ```
   - **Important**: Generate strong secrets for JWT_SECRET and JWT_REFRESH_SECRET (at least 32 characters)
   - You can use: `openssl rand -base64 32` or an online generator

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Your backend will be at: `https://camms-backend.onrender.com`

### Alternative: Fly.io (Also Supports Private Repos)
- Go to: https://fly.io
- Sign up with GitHub (free tier available)
- Install Fly CLI: `npm install -g @fly/cli`
- Run: `fly launch` in your backend folder
- Follow prompts to deploy
- Supports private repositories

---

## 🎨 Step 3: Frontend Deployment (Vercel - Recommended)

### Why Vercel?
- ✅ Free tier with unlimited deployments
- ✅ Automatic SSL
- ✅ Global CDN
- ✅ Automatic deployments from GitHub
- ✅ Perfect for React/Vite apps

### Setup Instructions:

1. **Prepare Frontend for Deployment**
   ```bash
   cd frontend
   # Create .env.production file
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

2. **Update vite.config.js** (if needed)
   ```javascript
   export default defineConfig({
     plugins: [react()],
     server: {
       port: 3000,
       proxy: {
         '/api': {
           target: process.env.VITE_API_URL || 'http://localhost:5000',
           changeOrigin: true,
         },
       },
     },
   });
   ```

3. **Deploy on Vercel**
   - Go to: https://vercel.com
   - Sign up with GitHub
   - Click "Add New Project"
   - **Import your GitHub repository** (same repo as backend - monorepo is fine!)
   - **Configure**:
     - **Repository**: Your GitHub repository (same one used for backend)
     - **Framework Preset**: `Vite`
     - **Root Directory**: `frontend` (this tells Vercel to deploy from frontend folder)
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`
   
   **Note**: Vercel and Render can both use the same GitHub repository! Just set different Root Directories.
     - **Framework Preset**: Vite
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`

4. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com/api
     ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build (2-5 minutes)
   - Your frontend will be at: `https://your-project.vercel.app`

### Alternative: Netlify
- Go to: https://netlify.com
- Sign up with GitHub
- New site from Git → Select repository
- Build settings:
  - Base directory: `frontend`
  - Build command: `npm run build`
  - Publish directory: `frontend/dist`
- Add environment variable: `VITE_API_URL`
- Deploy

---

## 🐍 Step 4: Python Reporting Service (Runs Internally)

**Good News**: The Python reporting service runs **internally** as part of your Node.js backend. You do **NOT** need to deploy it separately!

### How It Works:
- The Python script (`backend/services/reporting_service.py`) is executed as a child process from Node.js
- When a user requests a PDF/Excel report, the backend spawns a Python process
- The Python script generates the report and returns it to the backend
- No separate service or deployment needed

### Ensuring Python is Available on Render:

Render's Node.js environment **does include Python 3**, but you may need to ensure dependencies are installed:

1. **Update Render Build Command** (in backend settings):
   ```bash
   npm install && npm run prisma:generate && pip3 install -r services/requirements.txt
   ```
   Or if pip3 isn't available:
   ```bash
   npm install && npm run prisma:generate && python3 -m pip install -r services/requirements.txt
   ```

2. **Alternative: Use a Build Script**
   Create `backend/scripts/install-python-deps.sh`:
   ```bash
   #!/bin/bash
   python3 -m pip install --user pandas matplotlib openpyxl
   ```
   Make it executable and run it in build command.

3. **If Python is Not Available** (Fallback):
   - The backend will automatically fall back to JSON data if Python fails
   - Reports will still work, but without PDF/Excel formatting
   - Check `ReportService.js` - it has error handling for this case

### Testing Python Service:
After deployment, test report generation:
- If Python works: You'll get formatted PDF/Excel reports
- If Python fails: You'll get JSON data (still functional)

### Note:
- Python dependencies: `pandas`, `matplotlib`, `openpyxl` (see `backend/services/requirements.txt`)
- The Python script is located at: `backend/services/reporting_service.py`
- It's automatically included when you deploy the backend

---

## 🔧 Step 5: Post-Deployment Configuration

### 1. Update CORS Settings (Automatic)
The backend CORS is already configured to use the `FRONTEND_URL` environment variable. After deploying the frontend:
- Go to Render → Your backend service → Environment
- Add/Update: `FRONTEND_URL=https://your-frontend.vercel.app`
- The backend will automatically allow requests from this URL
- **No code changes needed** - it's already implemented!

### 2. Update Frontend API URL
The frontend should already have `VITE_API_URL` set in Vercel environment variables. Verify:
- Go to Vercel → Your project → Settings → Environment Variables
- Ensure `VITE_API_URL=https://your-backend.onrender.com/api` is set
- If not, add it and redeploy

### 3. Test Deployment
- Visit your frontend URL
- Try logging in with admin credentials:
  - Email: `atif.mubashar@vu.edu.pk`
  - Password: `Admin@2024#Secure`
- Test instructor login:
  - Email: Any instructor email from seed data
  - Password: `Instructor@2024#Secure`
- Test all features
- Check browser console for errors

---

## 📊 Free Tier Limits Comparison (2025)

### Render
- ✅ 750 hours/month free
- ✅ 512 MB RAM
- ⚠️ Spins down after 15 minutes of inactivity (first request may be slow)
- ✅ Unlimited bandwidth

### Vercel
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Automatic SSL
- ✅ Global CDN

### Supabase
- ✅ 500 MB database storage
- ✅ 2 GB bandwidth/month
- ✅ Unlimited API requests
- ✅ 50,000 monthly active users

### Railway
- ✅ $5 free credit/month
- ✅ 512 MB RAM
- ✅ Auto-deploy from GitHub

---

## 🚨 Important Notes

### Render Free Tier Limitations:
- **Sleep Mode**: Free services sleep after 15 minutes of inactivity
- **Cold Start**: First request after sleep takes 30-60 seconds
- **Solution**: Use a cron job to ping your backend every 10 minutes
  - Go to https://cron-job.org (free)
  - Create account and new cron job
  - URL: `https://your-backend.onrender.com/health`
  - Schedule: Every 10 minutes
  - This keeps your backend awake and responsive

### Database Connection:
- Use connection pooling for better performance
- Supabase provides built-in pooling
- For Neon, use their connection pooler

### Environment Variables:
- **Never commit** `.env` files to Git
- Use hosting platform's environment variable settings
- Keep secrets secure

---

## 🔄 Step 6: Setting Up Auto-Deploy

### GitHub Actions (Optional)
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      # Add deployment steps here
```

Most platforms (Vercel, Render, Netlify) auto-deploy from GitHub pushes.

---

## 🧪 Step 7: Testing Your Deployment

### Checklist:
- [ ] Frontend loads correctly
- [ ] Can login with admin credentials (`atif.mubashar@vu.edu.pk` / `Admin@2024#Secure`)
- [ ] Can login with instructor credentials (any instructor email / `Instructor@2024#Secure`)
- [ ] Dashboard displays data and charts
- [ ] Activities can be created/edited
- [ ] Reports can be generated (test both PDF and Excel)
  - [ ] If Python works: Reports download as formatted PDF/Excel
  - [ ] If Python unavailable: Reports return as JSON (still functional)
- [ ] Notifications work
- [ ] Dark mode toggle works
- [ ] All API endpoints respond correctly
- [ ] Profile page loads and can be edited
- [ ] Settings page works (admin only)

### Common Issues:

**Issue**: CORS errors
- **Fix**: Update CORS origin in backend to include your frontend URL

**Issue**: Database connection fails
- **Fix**: Check DATABASE_URL format and SSL requirements
- **Supabase**: May need `?sslmode=require` in connection string

**Issue**: Frontend can't connect to backend
- **Fix**: Check VITE_API_URL environment variable
- **Fix**: Ensure backend URL is correct (no trailing slash)

**Issue**: Build fails
- **Fix**: Check Node.js version (should be 18+)
- **Fix**: Ensure all dependencies are in package.json
- **Fix**: Check Render logs for specific error messages

**Issue**: Python service not working
- **Fix**: Check if Python dependencies installed (check build logs)
- **Fix**: Reports will fall back to JSON format automatically
- **Fix**: This is not critical - system works without Python

**Issue**: Render service keeps sleeping
- **Fix**: Set up cron job to ping `/health` endpoint every 10 minutes
- **Fix**: Or upgrade to paid plan (not necessary for testing)

---

## 📝 Step 8: Domain Setup (Optional)

### Free Domain Options:
- **Freenom**: Free .tk, .ml, .ga domains (limited)
- **GitHub Pages**: Free subdomain (github.io)
- **Cloudflare Pages**: Free subdomain

### Custom Domain on Vercel:
1. Go to Project Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions

---

## 🎯 Quick Start Summary

### For Private Repositories (Recommended):
1. **Database**: Create Supabase project → Get connection string → Run migrations
2. **Backend**: Deploy on **Railway** → Add environment variables → Deploy
   - Railway supports private repos (no need to make public!)
   - Build command includes Python dependencies installation
   - Add DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET, FRONTEND_URL
3. **Frontend**: Deploy on **Vercel** → Add `VITE_API_URL` → Deploy
   - Vercel also supports private repos!
4. **Update CORS**: Add FRONTEND_URL to backend environment variables (automatic CORS)
5. **Test**: Visit frontend URL and test all features

### For Public Repositories:
1. **Database**: Create Supabase project → Get connection string → Run migrations
2. **Backend**: Deploy on **Render** → Add environment variables → Deploy
3. **Frontend**: Deploy on **Vercel** → Add `VITE_API_URL` → Deploy
4. **Update CORS**: Add FRONTEND_URL to backend environment variables
5. **Keep Awake**: Set up cron job to ping backend every 10 minutes (Render free tier sleeps)
6. **Test**: Visit frontend URL and test all features

**Total Time**: ~30-45 minutes for complete deployment

**See `RAILWAY_DEPLOYMENT_GUIDE.md` for detailed Railway instructions (private repo support).**

---

## 🔗 Useful Links

- **Supabase**: https://supabase.com
- **Render**: https://render.com
- **Vercel**: https://vercel.com
- **Netlify**: https://netlify.com
- **Railway**: https://railway.app
- **Neon**: https://neon.tech

---

## 💡 Pro Tips

1. **Keep Render Awake**: Use https://cron-job.org to ping your backend `/health` endpoint every 10 minutes
2. **Monitor Logs**: Check Render/Vercel logs regularly for errors
3. **Database Backups**: Supabase provides automatic backups (no action needed)
4. **Environment Variables**: Keep a secure backup of all environment variables (password manager)
5. **Test Locally First**: Always test with production-like environment variables locally
6. **Python Service**: If Python fails, reports still work (JSON format) - not critical
7. **GitHub Integration**: Both Render and Vercel auto-deploy on git push (very convenient)
8. **SSL Certificates**: Automatically provided by both platforms (no configuration needed)

---

## 🆘 Troubleshooting

### Backend won't start
- Check logs in Render dashboard
- Verify all environment variables are set
- Ensure DATABASE_URL is correct

### Frontend shows blank page
- Check browser console for errors
- Verify VITE_API_URL is set correctly
- Check if backend is accessible

### Database connection timeout
- Check Supabase connection string format
- Verify IP allowlist (if enabled) - usually not needed for Supabase
- Check SSL mode settings - Supabase requires SSL
- Try adding `?sslmode=require` to connection string if issues persist

### Python service errors
- Check Render build logs for Python installation
- Verify Python dependencies are installed
- Reports will automatically fall back to JSON if Python fails
- This is not a critical error - system remains functional

---

## 📞 Support

If you encounter issues:
1. Check platform documentation
2. Review deployment logs
3. Test locally with production environment variables
4. Check platform status pages

---

**Good luck with your deployment! 🚀**

