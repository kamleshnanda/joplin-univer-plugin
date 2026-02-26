# Testing the Plugin in Joplin

## Method 1: Development Mode (Recommended for Testing)

This method allows you to test the plugin without packaging it as a .jpl file.

### Step 1: Enable Development Mode in Joplin

1. Open Joplin
2. Go to `Tools > Options` (or `Joplin > Preferences` on Mac)
3. Click on `Plugins` in the left sidebar
4. Scroll down and check the box: **"Enable plugin development mode"**
5. Note the plugin development directory path shown (usually `~/.config/joplin-desktop/plugins`)
6. Click `OK` and restart Joplin

### Step 2: Link Your Plugin to the Development Directory

Run these commands in your terminal:

```bash
# Build the plugin first
npm run build

# Create a symlink to the development directory
# On macOS/Linux:
ln -s "$(pwd)/dist" ~/.config/joplin-desktop/plugins/joplin-plugin-univer

# On Windows (run as Administrator):
# mklink /D "%APPDATA%\joplin-desktop\plugins\joplin-plugin-univer" "%CD%\dist"
```

### Step 3: Restart Joplin and Verify

1. Restart Joplin completely (quit and reopen)
2. Go to `Tools > Options > Plugins`
3. You should see "Univer Spreadsheet" in the installed plugins list
4. If you see any errors, check the developer console (see below)

### Step 4: Test the Plugin

1. Create a new note or open an existing one
2. Look for the spreadsheet icon in the toolbar (table icon)
3. Click it - you should see a fence block inserted:
   ````markdown
   ```univer-sheet
   {
     "id": "univer-...",
     ...
   }
   ```
   ````
4. The spreadsheet won't render yet (we haven't implemented the renderer), but the fence block should appear

### Step 5: View Developer Console (for debugging)

To see console logs and errors:
- **macOS**: `Help > Toggle Development Tools`
- **Windows/Linux**: `Help > Toggle Development Tools`

Look for messages starting with "Univer Plugin:" in the console.

## Method 2: Install as .jpl Package

This method tests the plugin as end users would install it.

### Step 1: Build the Plugin Package

```bash
# Create a production build
npm run dist

# Package it as a .jpl file
cd dist
zip -r ../joplin-plugin-univer.jpl .
cd ..
```

### Step 2: Install in Joplin

1. Open Joplin
2. Go to `Tools > Options > Plugins`
3. Click `Install plugin` button
4. Select the `joplin-plugin-univer.jpl` file
5. Restart Joplin

### Step 3: Verify Installation

1. Go to `Tools > Options > Plugins`
2. You should see "Univer Spreadsheet" in the list
3. Test by clicking the toolbar button in a note

## What to Expect at This Stage

Since we've only completed Task 1 (basic setup), here's what works:

✅ **Works:**
- Plugin loads without errors
- Toolbar button appears
- Menu item appears under Tools
- Clicking button inserts fence block with JSON data
- Fence block is saved with the note

❌ **Doesn't Work Yet:**
- Spreadsheet rendering (shows as code block)
- Editing spreadsheets
- Formula calculations
- Live preview in editor

These features will be implemented in the next tasks.

## Troubleshooting

### Plugin doesn't appear in the list

1. Check the developer console for errors
2. Verify the manifest.json is in the dist/ folder
3. Make sure you restarted Joplin after enabling dev mode
4. Check the plugin directory path is correct

### "Cannot find module 'api'" error

This is expected during development. The 'api' module is provided by Joplin at runtime, not during build.

### Toolbar button doesn't appear

1. Check if the plugin is enabled in `Tools > Options > Plugins`
2. Look for errors in the developer console
3. Try disabling and re-enabling the plugin

### Changes not reflected

If you make changes to the code:
1. Run `npm run build` again
2. Restart Joplin completely
3. Or use `npm run dev` for auto-rebuild (still need to restart Joplin)

## Development Workflow

For faster iteration:

```bash
# Terminal 1: Watch for changes and rebuild
npm run dev

# Terminal 2: Monitor Joplin logs
# Open Joplin > Help > Toggle Development Tools > Console tab
```

When you make changes:
1. Save your files
2. Wait for webpack to rebuild (watch terminal 1)
3. Restart Joplin
4. Test the changes

## Next Steps

Once you've verified the basic plugin works:
1. Create a test notebook in Joplin
2. Create a test note
3. Try inserting a spreadsheet
4. Verify the fence block appears
5. We can then continue with Task 2 to implement rendering

## Useful Commands

```bash
# Build for development (with source maps)
npm run build

# Build and watch for changes
npm run dev

# Build for production (optimized)
npm run dist

# Run tests
npm test

# Package as .jpl
cd dist && zip -r ../joplin-plugin-univer.jpl . && cd ..
```
