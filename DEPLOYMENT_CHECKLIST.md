# 🚀 CAMMS Deployment Checklist

Use this checklist to ensure a smooth deployment process.

## Pre-Deployment

- [ ] Code is pushed to GitHub repository
- [ ] All tests pass locally
- [ ] `.gitignore` is properly configured
- [ ] No sensitive data in code (passwords, API keys)
- [ ] Frontend builds successfully: `cd frontend && npm run build`
- [ ] Backend runs successfully: `cd backend && npm start`

## Step 1: Database Setup

- [ ] Create Supabase account at https://supabase.com
- [ ] Create new project
- [ ] Copy database connection string
- [ ] Test connection locally with new DATABASE_URL
- [ ] Run migrations: `npm run prisma:migrate deploy`
- [ ] (Optional) Seed database: `npm run seed`

**Database URL Format:**
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

## Step 2: Backend Deployment (Render)

- [ ] Create Render account at https://render.com
- [ ] Connect GitHub repository
- [ ] Create new Web Service
- [ ] Configure:
  - [ ] Name: `camms-backend`
  - [ ] Environment: `Node`
  - [ ] Root Directory: `backend`
  - [ ] Build Command: `npm install && npm run prisma:generate`
  - [ ] Start Command: `npm start`
  - [ ] Plan: Free
- [ ] Add Environment Variables:
  - [ ] `NODE_ENV=production`
  - [ ] `DATABASE_URL` (from Supabase)
  - [ ] `JWT_SECRET` (generate strong secret)
  - [ ] `JWT_REFRESH_SECRET` (generate strong secret)
  - [ ] `PORT=5000`
  - [ ] `FRONTEND_URL` (will add after frontend deployment)
- [ ] Deploy and wait for success
- [ ] Test health endpoint: `https://your-backend.onrender.com/health`
- [ ] Copy backend URL

**Backend URL:** `https://____________________.onrender.com`

## Step 3: Frontend Deployment (Vercel)

- [ ] Create Vercel account at https://vercel.com
- [ ] Import GitHub repository
- [ ] Configure:
  - [ ] Framework Preset: `Vite`
  - [ ] Root Directory: `frontend`
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `dist`
- [ ] Add Environment Variable:
  - [ ] `VITE_API_URL=https://your-backend.onrender.com/api`
- [ ] Deploy and wait for success
- [ ] Copy frontend URL

**Frontend URL:** `https://____________________.vercel.app`

## Step 4: Update CORS

- [ ] Go back to Render backend settings
- [ ] Add/Update Environment Variable:
  - [ ] `FRONTEND_URL=https://your-frontend.vercel.app`
- [ ] Redeploy backend (or it will auto-redeploy)

## Step 5: Testing

- [ ] Visit frontend URL
- [ ] Test login with admin credentials
- [ ] Test login with instructor credentials
- [ ] Verify dashboard loads
- [ ] Test creating an activity
- [ ] Test editing an activity
- [ ] Test generating a report
- [ ] Test notifications
- [ ] Test dark mode toggle
- [ ] Check browser console for errors
- [ ] Test on mobile device (responsive design)

## Step 6: Keep Render Awake (Optional)

Render free tier sleeps after 15 minutes. To keep it awake:

- [ ] Sign up at https://cron-job.org (free)
- [ ] Create new cron job
- [ ] URL: `https://your-backend.onrender.com/health`
- [ ] Schedule: Every 10 minutes
- [ ] Save and activate

## Post-Deployment

- [ ] Document your deployment URLs
- [ ] Share frontend URL with users
- [ ] Monitor logs for errors
- [ ] Set up database backups (Supabase does this automatically)
- [ ] Test all features in production
- [ ] Update documentation with production URLs

## Troubleshooting

### Backend won't start
- [ ] Check Render logs
- [ ] Verify all environment variables are set
- [ ] Check DATABASE_URL format
- [ ] Ensure Prisma Client is generated

### Frontend shows blank page
- [ ] Check browser console
- [ ] Verify VITE_API_URL is correct
- [ ] Check if backend is accessible
- [ ] Verify CORS settings

### CORS errors
- [ ] Update FRONTEND_URL in backend environment variables
- [ ] Redeploy backend
- [ ] Clear browser cache

### Database connection fails
- [ ] Verify DATABASE_URL is correct
- [ ] Check Supabase project is active
- [ ] Verify database password
- [ ] Check SSL requirements

## Deployment URLs

**Frontend:** _________________________________

**Backend:** _________________________________

**API Docs:** _________________________________/api-docs

**Database:** Supabase Dashboard

---

**Deployment Date:** _________________

**Status:** ☐ Success  ☐ Issues (see notes below)

**Notes:**
_________________________________________________
_________________________________________________
_________________________________________________

