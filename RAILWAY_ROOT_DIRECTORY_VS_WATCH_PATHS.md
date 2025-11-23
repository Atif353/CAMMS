# Railway: Watch Paths vs Root Directory - CRITICAL DIFFERENCE

## ⚠️ IMPORTANT: These Are DIFFERENT Settings!

### Watch Paths (What You See)
- **Location**: Settings → Watch Paths
- **Purpose**: Tells Railway which files to **watch for changes** to trigger redeployments
- **What it does**: "Only redeploy if files in `backend/` change"
- **Does NOT**: Change the build directory

### Root Directory (What You NEED)
- **Location**: Settings → **Source** section
- **Purpose**: Tells Railway which folder to use as the **build context**
- **What it does**: "Use `backend/` folder as the root for building"
- **This is what fixes the error!**

## ✅ WHERE TO FIND ROOT DIRECTORY

1. **Railway Dashboard** → Your Service
2. **Settings** tab
3. **Scroll down to "Source" section** (NOT "Watch Paths")
4. Look for **"Root Directory"** field
5. Set it to: `backend`
6. Click **"Save"**

## 🔍 Visual Guide

**Settings Tab Should Have:**
- **Source** section:
  - Repository: [your repo]
  - Branch: main
  - **Root Directory**: `backend` ← **THIS IS WHAT YOU NEED!**
  
- **Watch Paths** section (different!):
  - Watch Paths: `backend` ← This is already set, but it's not enough

## ✅ The Fix

1. Go to **Settings** → **Source** section
2. Find **"Root Directory"** field (might be empty or show `/`)
3. Type: `backend`
4. Click **"Save"**
5. Railway will redeploy automatically

## 🎯 Why Both Matter

- **Watch Paths = `backend`**: Only redeploy when backend files change ✅ (You have this)
- **Root Directory = `backend`**: Build from backend folder ✅ (You need this!)

**You need BOTH, but Root Directory is the critical one for fixing the build error.**

---

**Go to Settings → Source → Root Directory and set it to `backend`!**

