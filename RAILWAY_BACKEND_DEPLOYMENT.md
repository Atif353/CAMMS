# Railway Backend Deployment Guide - Step by Step

This guide will walk you through deploying your CAMMS backend on Railway.

## ✅ Why Railway?

- ✅ **Supports private GitHub repositories** (no need to make repo public!)
- ✅ $5 free credit/month (generous for small projects)
- ✅ Automatic SSL certificates
- ✅ Simple setup process
- ✅ Auto-deploy from GitHub
- ✅ Easy environment variable management

## 🚀 Step-by-Step Deployment

### Step 1: Sign Up for Railway

1. Go to: **https://railway.app**
2. Click **"Start a New Project"** or **"Login"**
3. Sign up with **GitHub** (recommended - easiest way)
4. Authorize Railway to access your repositories
5. You'll be redirected to the Railway dashboard

### Step 2: Create New Project

1. In Railway dashboard, click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. **Search for your repository** (your private repo will appear!)
4. **Select your CAMMS repository**
5. Click **"Deploy Now"**

Railway will automatically:
- Detect it's a Node.js project
- Start the deployment process

### Step 3: Configure the Service

1. **Railway will create a service automatically**
2. Click on the service to open settings
3. Go to **Settings** tab
4. **Set Root Directory**:
   - Scroll to **"Source"** section
   - Set **Root Directory**: `backend`
   - This tells Railway to deploy from the `backend` folder
   - Click **"Save"**

### Step 4: Configure Build Settings

**CRITICAL FIX FOR "npm: not found" ERROR:**

1. **In Railway Dashboard** (Do this FIRST - MOST IMPORTANT!):
   - Go to your service → **Settings** → **Build**
   - **CLEAR/DELETE the Build Command field** (leave it empty!)
   - **CLEAR/DELETE the Start Command field** (leave it empty!)
   - Set **"Nixpacks Provider"** to **"NIXPACKS"** (not Railpack Frontend)
   - Click **"Save"**
   - **Why**: Manual build commands override `nixpacks.toml`. Clearing them forces Railway to use the config file.

2. **Configuration Files** (Already created - commit these):
   - `backend/nixpacks.toml` - Handles Node.js installation and build
   - `backend/.nvmrc` - Specifies Node.js 20
   - `backend/railway.json` - Specifies NIXPACKS builder (no buildCommand)
   - `backend/Procfile` - Process file
   - `backend/package.json` - Includes engines specification
   
   **Commit and push**:
     ```bash
     git add backend/nixpacks.toml backend/.nvmrc backend/railway.json backend/Procfile backend/package.json
     git commit -m "Fix Railway: Use nixpacks.toml for build (clear manual commands)"
     git push
     ```

3. **Verify**:
   - After pushing, Railway will auto-redeploy
   - Check build logs - you should see Node.js being installed
   - npm commands should work now

**KEY POINT**: Railway will use `nixpacks.toml` ONLY if you don't set manual build commands. That's why clearing them is critical!

### Step 5: Add Environment Variables

1. Go to your service → **Variables** tab
2. Click **"New Variable"** for each variable below:

#### Required Environment Variables:

```
NODE_ENV=production
```

```
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require
```
**Note**: Get this from your Supabase project settings → Database → Connection string

```
JWT_SECRET=your-strong-secret-key-here
```
**Generate a strong secret** (at least 32 characters):
- Use: `openssl rand -base64 32`
- Or use an online generator: https://randomkeygen.com/

```
JWT_REFRESH_SECRET=your-strong-refresh-secret-here
```
**Generate another strong secret** (different from JWT_SECRET)

```
PORT=5000
```

```
FRONTEND_URL=https://your-frontend.vercel.app
```
**Note**: Add this after you deploy the frontend. Update it with your actual Vercel URL.

3. **After adding each variable**, Railway will automatically redeploy
4. Wait for the deployment to complete

### Step 6: Get Your Backend URL

1. Go to your service → **Settings** → **Networking**
2. Your backend URL will be displayed, something like:
   ```
   https://your-project-name.up.railway.app
   ```
3. **Copy this URL** - you'll need it for:
   - Frontend `VITE_API_URL` environment variable
   - Testing the deployment

### Step 7: Test Your Deployment

1. **Test Health Endpoint**:
   Visit: `https://your-project-name.up.railway.app/health`
   
   Should return:
   ```json
   {
     "success": true,
     "message": "CAMMS API is running",
     "timestamp": "2025-11-23T..."
   }
   ```

2. **Test API Docs**:
   Visit: `https://your-project-name.up.railway.app/api-docs`
   
   Should show Swagger API documentation

3. **Check Logs**:
   - Go to your service → **Deployments** tab
   - Click on the latest deployment
   - Check **Logs** for any errors

## 🔧 Troubleshooting

### "npm: not found" Error

**This means Railway is using the wrong builder (frontend instead of Node.js)**

**Solution**:
1. **Ensure Nixpacks is selected** (You should see "Using Nixpacks" in logs):
   - Go to **Settings** → **Build**
   - Ensure **Nixpacks Provider** is set to `NIXPACKS` (not Railpack Frontend)
   - If you see "Railpack Frontend", change it to `NIXPACKS`

2. **Check configuration files exist**:
   - `backend/nixpacks.toml` - Should specify Node.js 20 (latest LTS)
   - `backend/.nvmrc` - Specifies Node.js version
   - `backend/railway.json` - Railway configuration
   - `backend/Procfile` - Process file
   - All should be in your repository

3. **If still getting "npm: not found"**:
   - The nixpacks.toml might not be loading correctly
   - Try adding `.nvmrc` file with `18` in it
   - Commit and push:
     ```bash
     git add backend/nixpacks.toml backend/.nvmrc backend/Procfile
     git commit -m "Fix Railway Nixpacks configuration for Node.js"
     git push
     ```

4. **Redeploy**:
   - Railway will automatically redeploy after you push
   - Or manually trigger: **Deployments** → **Redeploy**
   - Check logs to see if Node.js is being installed

### Service Won't Start

**Check Logs**:
1. Go to **Deployments** tab
2. Click on the latest deployment
3. Check **Build Logs** and **Deploy Logs**
4. Look for error messages

**Common Issues**:
- **"Cannot find module"**: Check if all dependencies are in `package.json`
- **"Prisma client not generated"**: Ensure build command includes `npm run prisma:generate`
- **"Port already in use"**: Railway sets PORT automatically, don't hardcode it
- **"npm: not found"**: Railway is using wrong builder - use configuration files above

### Database Connection Fails

**Check**:
1. Verify `DATABASE_URL` includes `?sslmode=require`
2. Ensure Supabase database is active (not paused)
3. Test connection string locally first
4. Check Railway logs for specific database errors

### Build Fails

**Check**:
1. Verify Root Directory is set to `backend`
2. Check if `package.json` exists in backend folder
3. Ensure Node.js version is compatible (Railway auto-detects)
4. Check build logs for specific errors

### Python Dependencies Not Installing

**Not Critical**:
- Reports will fall back to JSON format automatically
- System remains fully functional
- Check build logs if you want to debug

## 📊 Railway Free Tier Limits

- ✅ **$5 free credit/month** (very generous)
- ✅ **512 MB RAM** per service
- ✅ **1 GB storage**
- ✅ **100 GB bandwidth/month**
- ✅ **Private repository support**
- ✅ **Automatic SSL**
- ✅ **Auto-deploy from GitHub**

**Note**: $5 credit is usually enough for a small backend running 24/7. Railway will notify you if you're approaching limits.

## 💡 Pro Tips

1. **Monitor Usage**: 
   - Check Railway dashboard → **Usage** tab
   - See how much credit you're using

2. **Auto-Deploy**: 
   - Railway automatically deploys on every git push
   - Very convenient for updates

3. **Logs**: 
   - Check **Logs** tab for real-time application logs
   - Useful for debugging

4. **Custom Domain**: 
   - You can add a custom domain in **Settings** → **Networking**
   - Free SSL included

5. **Environment Variables**: 
   - Keep a secure backup of all environment variables
   - Use a password manager

6. **Database Migrations**: 
   - Run migrations manually after deployment:
   ```bash
   # Connect to Railway service via CLI or use Railway's web terminal
   npm run prisma:migrate:deploy
   ```

## 🎯 Quick Checklist

- [ ] Signed up on Railway with GitHub
- [ ] Created new project from GitHub repo
- [ ] Set Root Directory to `backend`
- [ ] Added all environment variables:
  - [ ] `NODE_ENV=production`
  - [ ] `DATABASE_URL` (with `?sslmode=require`)
  - [ ] `JWT_SECRET` (strong secret)
  - [ ] `JWT_REFRESH_SECRET` (strong secret)
  - [ ] `PORT=5000`
  - [ ] `FRONTEND_URL` (add after frontend deployment)
- [ ] Service is running (check status)
- [ ] Health endpoint works: `/health`
- [ ] Backend URL copied for frontend configuration

## 🔗 Next Steps

After Railway deployment:

1. **Deploy Frontend on Vercel**:
   - Use the same GitHub repository
   - Set Root Directory to `frontend`
   - Add `VITE_API_URL=https://your-railway-url.up.railway.app/api`

2. **Update Backend CORS**:
   - Go back to Railway → Variables
   - Update `FRONTEND_URL` with your Vercel URL
   - Railway will auto-redeploy

3. **Test Complete System**:
   - Visit frontend URL
   - Try logging in
   - Test all features

## 📝 Environment Variables Summary

Copy-paste ready list (replace values):

```
NODE_ENV=production
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres?sslmode=require
JWT_SECRET=generate-with-openssl-rand-base64-32
JWT_REFRESH_SECRET=generate-another-secret-here
PORT=5000
FRONTEND_URL=https://your-frontend.vercel.app
```

## 🆘 Still Having Issues?

1. **Check Railway Status**: https://status.railway.app
2. **Review Logs**: Check deployment and runtime logs
3. **Test Locally**: Ensure everything works locally first
4. **Railway Discord**: Join Railway's Discord for community support

---

**Railway makes deployment easy! Your backend should be live in minutes.** 🚀

