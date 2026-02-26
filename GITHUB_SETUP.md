# GitHub Repository Setup Instructions

## Step 1: Create the Repository on GitHub

1. Go to https://github.com/kamleshnanda
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Fill in the details:
   - **Repository name**: `joplin-univer-plugin`
   - **Description**: `Excel-like spreadsheet plugin for Joplin using Univer SDK`
   - **Visibility**: Public (for open-source)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

## Step 2: Push the Code to GitHub

After creating the repository, run these commands in your terminal:

```bash
# Add the GitHub remote
git remote add origin https://github.com/kamleshnanda/joplin-univer-plugin.git

# Push the code to GitHub
git push -u origin main
```

## Step 3: Configure Repository Settings (Optional but Recommended)

### Add Topics/Tags
1. Go to your repository page
2. Click the gear icon next to "About"
3. Add topics: `joplin`, `plugin`, `spreadsheet`, `excel`, `univer`, `markdown`, `typescript`

### Enable Issues and Discussions
1. Go to Settings > General
2. Under "Features", ensure:
   - ✅ Issues are enabled
   - ✅ Discussions are enabled (optional)

### Add Repository Description
The description should already be set, but verify it says:
"Excel-like spreadsheet plugin for Joplin using Univer SDK"

### Set Up Branch Protection (Optional)
1. Go to Settings > Branches
2. Add rule for `main` branch:
   - Require pull request reviews before merging
   - Require status checks to pass before merging

## Step 4: Verify the Setup

After pushing, verify:
- ✅ All files are visible on GitHub
- ✅ README.md displays correctly on the repository homepage
- ✅ License is recognized (should show "MIT License" badge)
- ✅ Topics/tags are visible

## Next Steps

Once the repository is set up:
1. Install dependencies: `npm install`
2. Run tests: `npm test`
3. Build the plugin: `npm run build`
4. Continue with Task 2: Plugin main module implementation

## Troubleshooting

### If you get authentication errors:
- Use a Personal Access Token (PAT) instead of password
- Or set up SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

### If the remote already exists:
```bash
git remote remove origin
git remote add origin https://github.com/kamleshnanda/joplin-univer-plugin.git
```

### To verify the remote:
```bash
git remote -v
```

Should show:
```
origin  https://github.com/kamleshnanda/joplin-univer-plugin.git (fetch)
origin  https://github.com/kamleshnanda/joplin-univer-plugin.git (push)
```
