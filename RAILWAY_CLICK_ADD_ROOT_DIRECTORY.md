# Railway: Click "Add Root Directory" - Step by Step

## ✅ THE FIX - Do This Now!

I can see in your screenshot that Railway shows:
- **Source Repo**: Atif353/CAMMS ✅
- **Branch**: main ✅
- **"Add Root Directory"** link ← **CLICK THIS!**

## 🎯 Steps to Fix:

1. **In Railway Dashboard** → Your Service → Settings → Source
2. **Click the "Add Root Directory" link** (it's right below the Source Repo section)
3. **A new field will appear**
4. **Type**: `backend` (exactly, no slashes, no quotes)
5. **Click "Save"** or the checkmark
6. **Railway will automatically redeploy**

## 📸 What You Should See:

After clicking "Add Root Directory":
- A new input field appears
- Type: `backend`
- Save it
- Railway will redeploy with the correct root directory

## ✅ After Setting Root Directory:

Railway will:
- Look in `backend/` folder for `package.json`
- Detect it as Node.js project
- Use `backend/nixpacks.toml`
- Install Node.js 20
- Build successfully!

---

**Click "Add Root Directory" and set it to `backend` - that's the fix!**

