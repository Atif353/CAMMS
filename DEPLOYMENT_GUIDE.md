# CAMMS Deployment Guide - Free Hosting Options (2025)

This guide provides step-by-step instructions for deploying CAMMS to free hosting platforms.

## 🎯 Recommended Free Hosting Stack (2025)

### Option 1: Recommended (Best for Full-Stack Apps)
- **Frontend**: Vercel or Netlify (Free tier)
- **Backend**: Render (Free tier) or Railway (Free tier)
- **Database**: Supabase PostgreSQL (Free tier) or Neon (Free tier)
- **Python Service**: Render (Free tier) or Railway (Free tier)

### Option 2: Alternative
- **Frontend**: GitHub Pages or Cloudflare Pages
- **Backend**: Fly.io (Free tier) or Cyclic (Free tier)
- **Database**: Supabase PostgreSQL (Free tier)
- **Python Service**: Same as backend

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
   - Format: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

3. **Run Prisma Migrations**
   ```bash
   # Update DATABASE_URL in your .env
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   
   # Run migrations
   cd backend
   npm run prisma:migrate deploy
   ```

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

## 🚀 Step 2: Backend Deployment (Render - Recommended)

### Why Render?
- ✅ Free tier with 750 hours/month
- ✅ Automatic SSL certificates
- ✅ Easy environment variable management
- ✅ Supports Node.js and Python
- ✅ Auto-deploy from GitHub

### Setup Instructions:

1. **Prepare Backend for Deployment**
   ```bash
   cd backend
   # Ensure package.json has start script
   # "start": "node src/index.js"
   ```

2. **Create render.yaml (Optional)**
   Create `render.yaml` in backend folder:
   ```yaml
   services:
     - type: web
       name: camms-backend
       env: node
       buildCommand: npm install && npm run prisma:generate
       startCommand: npm start
       envVars:
         - key: NODE_ENV
           value: production
         - key: DATABASE_URL
           fromDatabase:
             name: camms-db
             property: connectionString
         - key: JWT_SECRET
           generateValue: true
         - key: JWT_REFRESH_SECRET
           generateValue: true
         - key: PORT
           value: 5000
   ```

3. **Deploy on Render**
   - Go to: https://render.com
   - Sign up (free with GitHub)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `backend` folder
   - Configure:
     - **Name**: `camms-backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install && npm run prisma:generate`
     - **Start Command**: `npm start`
     - **Plan**: Free

4. **Set Environment Variables in Render**
   - Go to Environment tab
   - Add:
     ```
     NODE_ENV=production
     DATABASE_URL=postgresql://... (from Supabase)
     JWT_SECRET=your-secret-key-here
     JWT_REFRESH_SECRET=your-refresh-secret-here
     PORT=5000
     ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Your backend will be at: `https://camms-backend.onrender.com`

### Alternative: Railway
- Go to: https://railway.app
- Sign up with GitHub
- New Project → Deploy from GitHub
- Select backend folder
- Add environment variables
- Deploy

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
   - Import your GitHub repository
   - Configure:
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

## 🐍 Step 4: Python Reporting Service (Optional)

If you need the Python reporting service:

### Option A: Deploy on Render (Same as Backend)
- Create another Web Service on Render
- Environment: Python 3
- Build Command: `pip install -r requirements.txt`
- Start Command: `python reporting_service.py`
- Add environment variables

### Option B: Integrate into Backend
- You can also run Python scripts from Node.js backend
- Use `child_process` to execute Python scripts
- No separate deployment needed

---

## 🔧 Step 5: Post-Deployment Configuration

### 1. Update CORS Settings
In `backend/src/index.js`, update CORS:
```javascript
app.use(cors({
  origin: [
    'https://your-frontend.vercel.app',
    'https://your-frontend.netlify.app',
    // Add your production frontend URL
  ],
  credentials: true,
}));
```

### 2. Update Frontend API URL
Ensure frontend `.env.production` has:
```
VITE_API_URL=https://your-backend.onrender.com/api
```

### 3. Test Deployment
- Visit your frontend URL
- Try logging in
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
- **Solution**: Use a cron job (like cron-job.org) to ping your backend every 10 minutes

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
- [ ] Can login with admin credentials
- [ ] Can login with instructor credentials
- [ ] Dashboard displays data
- [ ] Activities can be created/edited
- [ ] Reports can be generated
- [ ] Notifications work
- [ ] Dark mode works
- [ ] All API endpoints respond correctly

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

1. **Database**: Create Supabase project → Get connection string
2. **Backend**: Deploy on Render → Add environment variables → Deploy
3. **Frontend**: Deploy on Vercel → Add VITE_API_URL → Deploy
4. **Update CORS**: Add frontend URL to backend CORS settings
5. **Test**: Visit frontend URL and test all features

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

1. **Keep Render Awake**: Use https://cron-job.org to ping your backend every 10 minutes
2. **Monitor Logs**: Check Render/Vercel logs for errors
3. **Database Backups**: Supabase provides automatic backups
4. **Environment Variables**: Keep a backup of all environment variables
5. **Test Locally First**: Always test with production-like environment locally

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
- Check Supabase connection string
- Verify IP allowlist (if enabled)
- Check SSL mode settings

---

## 📞 Support

If you encounter issues:
1. Check platform documentation
2. Review deployment logs
3. Test locally with production environment variables
4. Check platform status pages

---

**Good luck with your deployment! 🚀**

