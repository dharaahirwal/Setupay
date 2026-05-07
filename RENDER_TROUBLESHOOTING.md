# Render Deployment Troubleshooting

## ❌ Error: "Unknown command: installcd"

This error occurs when Render concatenates build commands incorrectly.

### ✅ Solution: Force Render to Use render.yaml

The `render.yaml` file in your repository has the correct configuration, but Render might be using cached settings.

### Option 1: Manual Redeploy (Recommended)

1. Go to your Render dashboard: https://dashboard.render.com
2. Find your `setupay-backend` service
3. Click **Manual Deploy** → **Clear build cache & deploy**
4. This will force Render to read the `render.yaml` file again

### Option 2: Delete and Recreate Service

If Option 1 doesn't work:

1. **Delete the existing service** in Render dashboard
2. Create a **New Web Service**
3. Connect to **dharaahirwal/Setupay** repository
4. Render will automatically detect `render.yaml` and use those settings
5. Add environment variables:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=<your-mongodb-atlas-connection-string>
   JWT_SECRET=setupay_secret_2024_production
   JWT_EXPIRES_IN=7d
   ```

### Option 3: Manual Configuration Override

If Render isn't reading `render.yaml`:

1. Go to your service settings
2. **Root Directory**: Set to `backend`
3. **Build Command**: Change to `npm install` (remove any `cd backend &&`)
4. **Start Command**: Change to `npm start` (remove any `cd backend &&`)
5. Save and redeploy

---

## 🔍 Verify render.yaml is Correct

Your `render.yaml` should look like this:

```yaml
services:
  - type: web
    name: setupay-backend
    runtime: node
    env: node
    region: oregon
    plan: free
    rootDir: backend          # ✅ This sets the working directory
    buildCommand: npm install  # ✅ No "cd backend &&" needed
    startCommand: npm start    # ✅ No "cd backend &&" needed
```

**Key Points:**
- ✅ Use `rootDir: backend` to set working directory
- ❌ Don't use `cd backend &&` in commands
- ✅ Commands run from the `rootDir` automatically

---

## 📝 Common Issues

### Issue: Build command shows "cd backend && npm installcd backend && npm start"

**Cause:** Render concatenated old cached commands

**Fix:** Clear build cache and redeploy (Option 1 above)

### Issue: "Cannot find module" errors

**Cause:** `rootDir` not set correctly

**Fix:** Ensure `rootDir: backend` is in render.yaml or set manually in dashboard

### Issue: Environment variables not working

**Cause:** Variables not set in Render dashboard

**Fix:** Add all required environment variables in Render dashboard → Environment tab

---

## ✅ Correct Configuration Checklist

- [ ] `render.yaml` exists in repository root
- [ ] `rootDir: backend` is set in render.yaml
- [ ] Build command is `npm install` (no cd commands)
- [ ] Start command is `npm start` (no cd commands)
- [ ] Latest commit is pushed to GitHub
- [ ] Render service is connected to correct repository
- [ ] Build cache is cleared
- [ ] Environment variables are set in Render dashboard

---

## 🆘 Still Having Issues?

1. Check Render build logs for exact error
2. Verify `render.yaml` syntax at https://render.com/docs/yaml-spec
3. Try deploying from Render CLI (see `RENDER_CLI_DEPLOYMENT.md`)
4. Contact Render support with your service ID

---

## 📚 Related Guides

- **Quick Setup:** `deploy-to-render.md`
- **Full Guide:** `RENDER_DEPLOYMENT.md`
- **CLI Deployment:** `RENDER_CLI_DEPLOYMENT.md`
