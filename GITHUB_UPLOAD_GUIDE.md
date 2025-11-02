# GitHub Upload Guide

## Quick Upload Steps

### 1. Add all files to git
```bash
git add .
```

### 2. Commit the changes
```bash
git commit -m "feat: Complete Recipe Builder app with cooking session timers"
```

### 3. Create a new GitHub repository
- Go to https://github.com/new
- Repository name: `recipe-builder-app` (or your choice)
- Description: "Recipe Builder with Cooking Session - React + Redux Toolkit + TypeScript"
- Choose: Public or Private
- **DO NOT** initialize with README (we already have one)
- Click "Create repository"

### 4. Add GitHub remote and push
```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/recipe-builder-app.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Detailed Step-by-Step Instructions

### Step 1: Prepare the Repository Locally

```bash
# Check current status
git status

# Add all files
git add .

# Commit with a meaningful message
git commit -m "feat: Recipe Builder with Redux Toolkit, TypeScript, and MUI

- Implemented recipe CRUD with localStorage persistence
- Built cooking session with drift-safe timer
- Added auto-advance and pause/resume functionality
- Created global mini player component
- Implemented time-weighted progress tracking
- Full TypeScript support with strict mode
- Material-UI v5 for components
- Sample recipes included"
```

### Step 2: Create GitHub Repository

1. **Go to GitHub:**
   - Visit https://github.com/new
   - Or click the "+" icon in top-right → "New repository"

2. **Repository Settings:**
   - **Repository name:** `recipe-builder-app`
   - **Description:** "Recipe Builder with Cooking Session - React + Redux Toolkit + TypeScript + MUI"
   - **Visibility:** Choose Public or Private
   - **Important:** ❌ DO NOT check "Initialize this repository with a README"
   - ❌ DO NOT add .gitignore
   - ❌ DO NOT add license (we already have files)

3. **Click "Create repository"**

### Step 3: Connect and Push

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add the remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/recipe-builder-app.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

### Step 4: Verify Upload

1. Refresh your GitHub repository page
2. You should see all files uploaded
3. README.md should display automatically

---

## Authentication Options

### Option A: HTTPS with Personal Access Token

If prompted for credentials:

1. **Username:** Your GitHub username
2. **Password:** Use a Personal Access Token (NOT your GitHub password)

**Create a token:**
- Go to https://github.com/settings/tokens
- Click "Generate new token" → "Generate new token (classic)"
- Select scopes: ✅ `repo` (full control)
- Copy the token and use it as password

### Option B: SSH (Recommended for frequent use)

```bash
# If using SSH instead of HTTPS
git remote add origin git@github.com:YOUR_USERNAME/recipe-builder-app.git
git push -u origin main
```

---

## Troubleshooting

### Error: "remote origin already exists"
```bash
# Remove existing remote
git remote remove origin

# Add the correct one
git remote add origin https://github.com/YOUR_USERNAME/recipe-builder-app.git
```

### Error: "Updates were rejected"
```bash
# Force push (only if you're sure)
git push -u origin main --force
```

### Check remote URL
```bash
git remote -v
```

---

## What Gets Uploaded

✅ **Included:**
- All source code (`src/` folder)
- Configuration files (`package.json`, `tsconfig.json`, etc.)
- Documentation (`README.md`, `IMPLEMENTATION_NOTES.md`, etc.)
- Public assets

❌ **Excluded (via .gitignore):**
- `node_modules/` (too large, can be reinstalled)
- `build/` (generated folder)
- `.env` files (if any)
- Log files

---

## After Upload

### Add Repository Description and Topics

On your GitHub repository page:

1. Click "⚙️" next to "About"
2. **Description:** "Recipe Builder with Cooking Session - React + Redux Toolkit + TypeScript + MUI"
3. **Website:** (leave empty or add if deployed)
4. **Topics:** Add tags:
   - `react`
   - `typescript`
   - `redux-toolkit`
   - `material-ui`
   - `recipe-app`
   - `cooking-timer`
   - `localStorage`

### Make README Look Good

Your README.md will display automatically. You can add:
- Badges (build status, license, etc.)
- Screenshots
- Live demo link (if deployed)

---

## Optional: Deploy to GitHub Pages or Vercel

### Deploy to Vercel (Easiest)

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Import Project"
4. Select your repository
5. Deploy! ✨

### Deploy to GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json
"homepage": "https://YOUR_USERNAME.github.io/recipe-builder-app",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}

# Deploy
npm run deploy
```

---

## Summary Commands

```bash
# 1. Commit all changes
git add .
git commit -m "feat: Complete Recipe Builder app"

# 2. Add remote (create GitHub repo first!)
git remote add origin https://github.com/YOUR_USERNAME/recipe-builder-app.git

# 3. Push
git branch -M main
git push -u origin main
```

**That's it! Your project is now on GitHub! 🎉**

