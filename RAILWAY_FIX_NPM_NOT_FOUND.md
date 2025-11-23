# Railway "npm: not found" Error - COMPLETE FIX

## 🔴 The Problem

Railway is using Nixpacks, but Node.js is not being installed before the build commands run. This happens because:

1. Railway might be using a custom build command from settings instead of `nixpacks.toml`
2. The setup phase might not be running before install phase
3. Node.js might not be in the PATH

## ✅ COMPLETE FIX (Do ALL Steps)

### Step 1: Clear Build Command in Railway Dashboard

**CRITICAL - Do this FIRST:**

1. Go to Railway Dashboard → Your Service → **Settings** → **Build**
2. **DELETE/CLEAR the Build Command field** (leave it empty)
3. **DELETE/CLEAR the Start Command field** (leave it empty)
4. Click **"Save"**
5. This forces Railway to use `nixpacks.toml` instead of manual commands

### Step 2: Verify Configuration Files

Make sure these files exist and are committed:

- ✅ `backend/nixpacks.toml` - Should have Node.js 20 setup
- ✅ `backend/.nvmrc` - Should contain `20`
- ✅ `backend/package.json` - Should have engines specified
- ✅ `backend/railway.json` - Should specify NIXPACKS builder (no buildCommand)

### Step 3: Commit and Push

```bash
git add backend/nixpacks.toml backend/.nvmrc backend/railway.json backend/package.json
git commit -m "Fix Railway Nixpacks configuration - use nixpacks.toml for build"
git push
```

### Step 4: Verify in Railway

After pushing:
1. Railway will auto-redeploy
2. Check **Deployments** → **Latest** → **Build Logs**
3. You should see:
   - "Using Nixpacks" ✅
   - Node.js being installed ✅
   - npm commands running successfully ✅

## 🔍 Why This Happens

Railway has two ways to build:
1. **Manual Build Command** (in Settings) - Overrides nixpacks.toml
2. **nixpacks.toml file** - Auto-detected configuration

When you set a manual build command, Railway ignores `nixpacks.toml` and tries to run commands without installing Node.js first.

## ✅ Solution Summary

**The fix is simple:**
1. **Clear the Build Command in Railway Settings** (most important!)
2. Let `nixpacks.toml` handle everything
3. Push the updated configuration files

## 🎯 Expected Result

After fixing, you should see in build logs:
```
Using Nixpacks
Installing nodejs-20_x...
Installing python3...
npm install...
npm run prisma:generate...
```

Instead of:
```
npm: command not found ❌
```

---

**This WILL fix it! The key is clearing the manual build command in Railway settings.**

