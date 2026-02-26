# Joplin Univer Plugin

Excel-like spreadsheet plugin for Joplin using the Univer SDK.

## Features

- 📊 Embed Excel-like spreadsheets directly in your Joplin notes
- 🧮 Full formula support (SUM, AVERAGE, COUNT, MIN, MAX, and more)
- 📝 Inline rendering within Markdown content
- ☁️ Cloud sync compatible (Dropbox, Joplin Cloud, etc.)
- 🔄 Data stored as text within notes for reliable backup
- 🎨 Seamless integration with Joplin's interface

## Installation

### From File (Development)

1. Download the latest `.jpl` file from the releases page
2. Open Joplin
3. Go to `Tools > Options > Plugins`
4. Click `Install plugin` and select the `.jpl` file
5. Restart Joplin

### From Joplin Plugin Repository (Coming Soon)

Search for "Univer" in Joplin's plugin settings.

## Usage

### Creating a Spreadsheet

1. Click the spreadsheet icon in the toolbar, or
2. Use the keyboard shortcut `Ctrl+Shift+S` (Cmd+Shift+S on Mac), or
3. Go to `Tools > Insert Spreadsheet`

The spreadsheet will be inserted at your cursor position.

### Editing a Spreadsheet

- Click on any spreadsheet to enter edit mode
- Enter data, formulas, and format cells
- Click outside the spreadsheet to exit edit mode
- Changes are automatically saved

### Using Formulas

Start any cell with `=` to create a formula:

```
=SUM(A1:A10)
=AVERAGE(B1:B5)
=COUNT(C1:C20)
=A1 + B1 * 2
```

### Inline Positioning

Spreadsheets appear exactly where you place them in your notes:

```markdown
# Budget Report

Here's our Q1 budget:

[Spreadsheet renders here]

As you can see from the numbers above...
```

## Development

### Prerequisites

- Node.js 16 or higher
- npm or yarn
- Joplin desktop application

### Setup

```bash
# Clone the repository
git clone https://github.com/kamleshnanda/joplin-univer-plugin.git
cd joplin-univer-plugin

# Install dependencies
npm install

# Build the plugin
npm run build

# Or run in development mode with auto-reload
npm run dev
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

### Building for Distribution

```bash
# Create production build
npm run dist

# The .jpl file will be in the dist/ directory
```

## Technical Details

### Architecture

The plugin uses:
- **Univer SDK** for spreadsheet functionality
- **Joplin Plugin API** for integration
- **Markdown fence blocks** for data storage
- **Content scripts** for rendering

### Data Storage

Spreadsheets are stored as JSON within custom Markdown fence blocks:

````markdown
```univer-sheet
{
  "id": "unique-id",
  "sheets": { ... }
}
```
````

This ensures:
- Cloud sync compatibility
- Version control friendly
- No external dependencies
- Reliable backups

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Credits

- Built with [Univer](https://univer.ai/) - Open-source office suite
- Designed for [Joplin](https://joplinapp.org/) - Open-source note-taking app

## Support

- Report issues: [GitHub Issues](https://github.com/kamleshnanda/joplin-univer-plugin/issues)
- Discussions: [GitHub Discussions](https://github.com/kamleshnanda/joplin-univer-plugin/discussions)

## Keywords

Excel, Spreadsheet, Univer, Kamlesh, Joplin, Plugin, Markdown, Formulas
