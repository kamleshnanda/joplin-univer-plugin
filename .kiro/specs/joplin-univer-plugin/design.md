# Design Document: Joplin Univer Plugin

## Overview

The Joplin Univer Plugin integrates the Univer open-source spreadsheet SDK into Joplin notes, enabling users to embed and edit Excel-like spreadsheets with formula support directly within their notes. The plugin replaces the deprecated LuckySheets-based JSheets plugin with a modern, actively maintained solution.

The plugin architecture follows Joplin's multi-process plugin system, using content scripts to extend the Markdown renderer and editor. Spreadsheet data is stored as JSON within custom Markdown code blocks (fence blocks), ensuring compatibility with Joplin's sync mechanism across devices and cloud backup services. This text-based storage approach guarantees that spreadsheets persist correctly whether syncing via Dropbox, Joplin Cloud, or any other cloud service.

Spreadsheets are initialized inline within the Markdown note body, appearing exactly where the fence block is placed. This allows users to intersperse spreadsheets with regular text content, creating rich documents that combine narrative and structured data.

Key design goals:
- Seamless integration with Joplin's note editing experience
- Full formula calculation support (SUM, AVERAGE, COUNT, etc.)
- Data persistence compatible with all cloud sync services (Dropbox, Joplin Cloud, etc.)
- Inline spreadsheet rendering within Markdown content flow
- Minimal installation overhead for end users
- Open-source licensing for community distribution

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Joplin Application                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Plugin Host (Main Process)                 │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │         Joplin Univer Plugin                      │  │ │
│  │  │  - Plugin Registration                            │  │ │
│  │  │  - Command Registration                           │  │ │
│  │  │  - Menu/Toolbar Integration                       │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         Content Script (Renderer Process)              │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │    Markdown Renderer Extension                    │  │ │
│  │  │  - Custom fence block handler                     │  │ │
│  │  │  - Univer SDK initialization                      │  │ │
│  │  │  - Spreadsheet component rendering                │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │    CodeMirror Editor Extension                    │  │ │
│  │  │  - Spreadsheet insertion                          │  │ │
│  │  │  - Live preview rendering                         │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │   Univer SDK     │
                  │  - @univerjs/    │
                  │    core          │
                  │  - @univerjs/    │
                  │    engine-render │
                  │  - @univerjs/    │
                  │    sheets        │
                  │  - @univerjs/    │
                  │    sheets-formula│
                  └──────────────────┘
```

### Component Interaction Flow

1. **Plugin Initialization**: Plugin registers with Joplin, sets up commands, and injects content scripts
2. **Spreadsheet Creation**: User triggers command → Plugin inserts custom fence block at cursor position → Editor updates
3. **Inline Rendering**: Markdown renderer detects fence block → Content script initializes Univer at exact block position → Spreadsheet renders inline with surrounding text
4. **Editing**: User interacts with spreadsheet → Univer handles input → Data serialized back to fence block
5. **Persistence**: Note saved → Fence block content stored as text within Markdown → Syncs via any cloud service (Dropbox, Joplin Cloud, etc.)
6. **Cloud Backup**: All spreadsheet data stored in note content → Backed up with note to cloud → Restored on any device with plugin installed

## Components and Interfaces

### 1. Plugin Main Module (`index.ts`)

**Responsibilities:**
- Register plugin with Joplin
- Register commands for spreadsheet creation
- Add toolbar buttons and menu items
- Inject content scripts into renderer and editor

**Key Methods:**
```typescript
async function onStart(context: joplin.PluginContext): Promise<void>
async function registerCommands(context: joplin.PluginContext): Promise<void>
async function registerContentScripts(context: joplin.PluginContext): Promise<void>
```

### 2. Markdown Renderer Content Script (`renderer.ts`)

**Responsibilities:**
- Extend Markdown-it renderer to handle custom fence blocks
- Initialize Univer SDK instances for each spreadsheet
- Render spreadsheet components inline at the exact position of the fence block in the Markdown
- Handle spreadsheet interaction events
- Ensure proper positioning within the document flow

**Key Methods:**
```typescript
function registerMarkdownItPlugin(markdownIt: any): void
function renderSpreadsheet(container: HTMLElement, data: IWorkbookData): Univer
function serializeSpreadsheet(univer: Univer): string
function positionSpreadsheetInline(container: HTMLElement, blockPosition: number): void
```

**Fence Block Format:**
````markdown
```univer-sheet
{
  "id": "unique-id",
  "name": "Sheet1",
  "sheetOrder": ["sheet-1"],
  "sheets": {
    "sheet-1": {
      "id": "sheet-1",
      "name": "Sheet1",
      "cellData": {
        "0": {
          "0": { "v": "Hello" },
          "1": { "v": "World" }
        }
      }
    }
  }
}
```
````

**Inline Rendering Behavior:**
The renderer processes the Markdown document sequentially. When it encounters a `univer-sheet` fence block, it:
1. Parses the JSON data within the fence block
2. Creates a container element at that exact position in the rendered HTML
3. Initializes a Univer instance within the container
4. Continues rendering subsequent Markdown content below the spreadsheet

This ensures spreadsheets appear inline with text, allowing documents like:
```markdown
# Budget Report

Here's our Q1 budget breakdown:

```univer-sheet
{ ... spreadsheet data ... }
```

As you can see from the numbers above, we're on track.
```

### 3. CodeMirror Editor Extension (`editor.ts`)

**Responsibilities:**
- Provide live preview of spreadsheets in editor
- Handle spreadsheet insertion at cursor position
- Manage editor-side Univer instances

**Key Methods:**
```typescript
function registerCodeMirrorPlugin(codeMirror: any): void
function insertSpreadsheetAtCursor(editor: any): void
function updateSpreadsheetPreview(editor: any, position: number): void
```

### 4. Univer Manager (`univerManager.ts`)

**Responsibilities:**
- Centralize Univer SDK initialization and configuration
- Manage multiple Univer instances per note
- Handle Univer plugin loading (formulas, UI, etc.)
- Provide cleanup for destroyed instances

**Key Methods:**
```typescript
function createUniverInstance(container: HTMLElement, data?: IWorkbookData): Univer
function destroyUniverInstance(id: string): void
function getUniverInstance(id: string): Univer | undefined
function serializeWorkbook(univer: Univer): IWorkbookData
function deserializeWorkbook(json: string): IWorkbookData
```

### 5. Data Serializer (`serializer.ts`)

**Responsibilities:**
- Convert between Univer's IWorkbookData and JSON strings
- Validate spreadsheet data structure
- Handle migration from older data formats
- Compress/decompress data for storage efficiency

**Key Methods:**
```typescript
function serialize(workbook: IWorkbookData): string
function deserialize(json: string): IWorkbookData
function validate(data: any): boolean
function migrate(oldData: any, version: string): IWorkbookData
```

### 6. Command Handlers (`commands.ts`)

**Responsibilities:**
- Implement command logic for spreadsheet operations
- Generate unique IDs for new spreadsheets
- Provide default spreadsheet templates

**Key Methods:**
```typescript
async function insertSpreadsheetCommand(): Promise<void>
function generateSpreadsheetId(): string
function createDefaultWorkbook(): IWorkbookData
```

## Data Models

### Spreadsheet Storage Format

Spreadsheets are stored as JSON within custom Markdown fence blocks with the language identifier `univer-sheet`. This text-based storage format ensures:
- **Cloud Sync Compatibility**: Works with Dropbox, Joplin Cloud, OneDrive, and any text-based sync service
- **Backup Reliability**: Spreadsheet data is part of the note content, backed up with the note
- **Version Control**: Changes to spreadsheets are tracked as text changes in the note
- **Cross-Platform**: No external files or databases required, works on desktop and mobile

The JSON follows Univer's `IWorkbookData` interface:

```typescript
interface IWorkbookData {
  id: string;                    // Unique workbook identifier
  name: string;                  // Workbook name
  appVersion: string;            // Univer version
  locale: string;                // Locale (e.g., "en-US")
  styles: Record<string, any>;   // Cell styles
  sheets: Record<string, IWorksheetData>;
  sheetOrder: string[];          // Sheet display order
  resources?: IResourceData[];   // Images, etc.
}

interface IWorksheetData {
  id: string;                    // Sheet identifier
  name: string;                  // Sheet name
  cellData: ICellData;           // Cell contents
  rowCount: number;              // Number of rows
  columnCount: number;           // Number of columns
  defaultRowHeight: number;
  defaultColumnWidth: number;
  mergeData?: IMergeData[];      // Merged cells
  rowData?: Record<string, IRowData>;
  columnData?: Record<string, IColumnData>;
}

interface ICellData {
  [row: number]: {
    [col: number]: ICellValue;
  };
}

interface ICellValue {
  v?: string | number | boolean; // Value
  f?: string;                     // Formula
  s?: string;                     // Style ID
  t?: CellValueType;              // Type
}
```

### Plugin Configuration

```typescript
interface PluginSettings {
  defaultRows: number;            // Default: 10
  defaultColumns: number;         // Default: 10
  enableFormulas: boolean;        // Default: true
  enableFormatting: boolean;      // Default: true
  theme: 'light' | 'dark';        // Default: 'light'
}
```

### Univer Instance Registry

```typescript
interface UniverInstanceRegistry {
  instances: Map<string, {
    univer: Univer;
    container: HTMLElement;
    noteId: string;
    spreadsheetId: string;
  }>;
}
```

## Error Handling

### Error Categories

1. **Initialization Errors**
   - Univer SDK fails to load
   - Required Univer plugins missing
   - Container element not found

2. **Data Errors**
   - Invalid JSON in fence block
   - Corrupted spreadsheet data
   - Version mismatch

3. **Runtime Errors**
   - Formula evaluation failures
   - Memory exhaustion with large spreadsheets
   - Sync conflicts

### Error Handling Strategy

```typescript
class PluginError extends Error {
  constructor(
    public code: string,
    public message: string,
    public recoverable: boolean,
    public userMessage: string
  ) {
    super(message);
  }
}

// Error codes
const ErrorCodes = {
  UNIVER_INIT_FAILED: 'E001',
  INVALID_DATA: 'E002',
  FORMULA_ERROR: 'E003',
  SYNC_CONFLICT: 'E004',
  CONTAINER_NOT_FOUND: 'E005'
};

// Error handling
try {
  const univer = createUniverInstance(container, data);
} catch (error) {
  if (error instanceof PluginError) {
    if (error.recoverable) {
      // Log and show user-friendly message
      console.error(`[${error.code}] ${error.message}`);
      await joplin.views.dialogs.showMessageBox(error.userMessage);
    } else {
      // Critical error - disable plugin functionality
      console.error(`[CRITICAL] [${error.code}] ${error.message}`);
      await joplin.views.dialogs.showMessageBox(
        'The Univer plugin encountered a critical error and has been disabled.'
      );
    }
  }
}
```

### Graceful Degradation

- If Univer fails to initialize, display the raw JSON with an error message
- If formula evaluation fails, show error indicator in cell (e.g., `#ERROR!`)
- If data is corrupted, attempt recovery or offer to reset to empty spreadsheet
- If sync conflict detected, preserve both versions and notify user

## Cloud Sync and Backup Architecture

### Storage Strategy

The plugin uses a **content-embedded storage strategy** where all spreadsheet data resides within the note's Markdown content. This design choice ensures:

1. **Universal Cloud Compatibility**: Since data is text within the note, it syncs with any service Joplin supports:
   - Dropbox
   - Joplin Cloud
   - OneDrive
   - WebDAV
   - Nextcloud
   - Any future sync targets

2. **Backup Integrity**: When notes are backed up (manually or via cloud), spreadsheets are automatically included because they're part of the note content, not separate files or database entries.

3. **No External Dependencies**: The plugin doesn't require:
   - Separate file storage
   - Database connections
   - External APIs for data persistence
   - Plugin-specific sync mechanisms

### Sync Flow

```
User edits spreadsheet
    ↓
Univer instance updates
    ↓
Data serialized to JSON
    ↓
Fence block content updated in Markdown
    ↓
Joplin saves note (triggers sync)
    ↓
Note syncs to cloud service
    ↓
Other devices receive updated note
    ↓
Plugin deserializes fence block
    ↓
Spreadsheet renders with updated data
```

### Conflict Resolution

When sync conflicts occur (two devices edit the same note simultaneously):
- Joplin's conflict resolution applies to the entire note
- The plugin detects conflicting fence blocks
- User is presented with both versions
- User can choose which spreadsheet data to keep or manually merge

### Data Size Considerations

Since spreadsheets are stored as JSON text:
- **Small to medium spreadsheets** (< 1000 cells): Optimal, minimal impact on note size
- **Large spreadsheets** (1000-10000 cells): Acceptable, may increase note size but still syncs reliably
- **Very large spreadsheets** (> 10000 cells): May impact sync performance, consider splitting into multiple notes

The plugin will include a warning when spreadsheet data exceeds recommended size thresholds.

## Inline Rendering Architecture

### Markdown Processing Flow

The plugin integrates with Joplin's Markdown-it renderer to process fence blocks inline:

```
Markdown content parsed
    ↓
Markdown-it processes blocks sequentially
    ↓
Encounters ```univer-sheet fence block
    ↓
Plugin's fence rule triggered
    ↓
Container div created at current position
    ↓
JSON data extracted and validated
    ↓
Univer instance initialized in container
    ↓
Rendering continues with next Markdown block
```

### Position Preservation

The inline rendering ensures:
- Spreadsheets appear exactly where the fence block is placed
- Text before the fence block renders above the spreadsheet
- Text after the fence block renders below the spreadsheet
- Multiple spreadsheets maintain their relative positions

Example document structure:
```markdown
# Project Budget

## Overview
This document tracks our project expenses.

```univer-sheet
{ "id": "budget-2024", ... }
```

## Analysis
Based on the spreadsheet above, we can see...

```univer-sheet
{ "id": "forecast-2024", ... }
```

## Conclusion
The forecast shows...
```

Renders as:
```
[Heading: Project Budget]
[Heading: Overview]
[Text: This document tracks...]
[SPREADSHEET: budget-2024]
[Heading: Analysis]
[Text: Based on the spreadsheet...]
[SPREADSHEET: forecast-2024]
[Heading: Conclusion]
[Text: The forecast shows...]
```

### Editor Integration

In the editor view:
- Fence blocks are visible as code blocks with syntax highlighting
- Live preview shows rendered spreadsheets inline
- Cursor navigation works naturally around spreadsheet blocks
- Copy/paste operations preserve fence block structure



## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Serialization Round-Trip Preservation

*For any* valid Univer workbook data, serializing it to JSON and then deserializing it back should produce an equivalent workbook with all cell values, formulas, formatting, and structure preserved.

**Validates: Requirements 7.1, 7.2, 7.3, 7.4, 8.2**

### Property 2: Initialization Error Handling

*For any* Univer SDK initialization attempt, if initialization fails, the plugin should log an error message and degrade gracefully without crashing the Joplin application.

**Validates: Requirements 2.4, 2.5, 11.1, 11.4**

### Property 3: Spreadsheet Insertion at Cursor

*For any* cursor position in a note editor, invoking the spreadsheet creation command should insert a new spreadsheet fence block at that exact position.

**Validates: Requirements 3.1, 4.4**

### Property 4: Default Dimensions on Creation

*For any* newly created spreadsheet, it should be initialized with the configured default row and column dimensions from plugin settings.

**Validates: Requirements 4.5**

### Property 5: Multiple Spreadsheet Independence

*For any* note containing multiple spreadsheet fence blocks, each spreadsheet should render as an independent Univer instance without interfering with the others.

**Validates: Requirements 3.4**

### Property 6: Spreadsheet Content Identification

*For any* Markdown content containing a mix of regular text and univer-sheet fence blocks, the plugin should correctly identify and render only the fence blocks as spreadsheets, preserving the inline position of each spreadsheet within the document flow.

**Validates: Requirements 3.5, 3.6, 3.7**

### Property 7: Spreadsheet Rendering

*For any* valid spreadsheet data in a univer-sheet fence block, the renderer should create a visible Univer component in the note viewer at the exact inline position where the fence block appears in the Markdown.

**Validates: Requirements 3.2, 3.7**

### Property 8: Edit Mode Activation

*For any* rendered spreadsheet component, clicking on it should activate edit mode, allowing user interaction with cells.

**Validates: Requirements 5.1**

### Property 9: Edit Mode Deactivation

*For any* spreadsheet in edit mode, clicking outside the spreadsheet component should deactivate edit mode and return focus to the note.

**Validates: Requirements 5.5**

### Property 10: Data Serialization on Modification

*For any* modification made to a spreadsheet (cell edit, formula change, formatting), the plugin should serialize the updated data back to the fence block in the note content.

**Validates: Requirements 7.1**

### Property 11: Corrupted Data Recovery

*For any* spreadsheet fence block containing invalid or corrupted JSON, the plugin should either attempt to recover the data or display a warning message without crashing.

**Validates: Requirements 11.2**

### Property 12: Error Logging

*For any* error that occurs during plugin operation (initialization, rendering, serialization), the plugin should log diagnostic information to the console for debugging purposes.

**Validates: Requirements 11.3**

### Property 13: State Preservation on Note Switch

*For any* note switch operation, spreadsheet instances should be properly cleaned up or preserved such that returning to a note shows the correct spreadsheet state.

**Validates: Requirements 12.5**

### Property 14: Cloud Sync Data Preservation

*For any* note containing spreadsheet fence blocks, when the note is synced via any cloud service (Dropbox, Joplin Cloud, etc.) and retrieved on another device, the spreadsheet data should be completely preserved and render identically.

**Validates: Requirements 8.1, 8.2, 8.5, 8.6**

## Testing Strategy

The testing strategy employs a dual approach combining unit tests for specific scenarios and property-based tests for universal correctness guarantees.

### Testing Framework

- **Unit Testing**: Jest for TypeScript/JavaScript testing
- **Property-Based Testing**: fast-check library for JavaScript property-based testing
- **Integration Testing**: Manual testing with Joplin development mode

### Unit Testing Approach

Unit tests will focus on:

1. **Specific Examples**: Concrete test cases demonstrating correct behavior
   - Creating a spreadsheet with specific data
   - Serializing a known workbook structure
   - Handling a specific error condition

2. **Edge Cases**: Boundary conditions and special scenarios
   - Empty spreadsheets
   - Very large spreadsheets (stress testing)
   - Spreadsheets with only formulas
   - Spreadsheets with special characters

3. **Integration Points**: Component interactions
   - Plugin registration with Joplin
   - Content script injection
   - Command execution flow

Example unit test structure:
```typescript
describe('Serializer', () => {
  it('should serialize an empty workbook', () => {
    const workbook = createDefaultWorkbook();
    const json = serialize(workbook);
    expect(json).toBeDefined();
    expect(JSON.parse(json)).toHaveProperty('id');
  });

  it('should handle corrupted JSON gracefully', () => {
    const corrupted = '{ invalid json }';
    expect(() => deserialize(corrupted)).not.toThrow();
  });
});
```

### Property-Based Testing Approach

Property tests will verify universal properties across randomized inputs. Each property test will:
- Run a minimum of 100 iterations
- Generate random valid inputs using fast-check
- Verify the property holds for all generated inputs
- Reference the design document property in a comment tag

Example property test structure:
```typescript
import fc from 'fast-check';

describe('Property Tests', () => {
  /**
   * Feature: joplin-univer-plugin, Property 1: Serialization Round-Trip Preservation
   */
  it('should preserve data through serialize-deserialize round trip', () => {
    fc.assert(
      fc.property(
        workbookArbitrary(), // Generator for random workbook data
        (workbook) => {
          const serialized = serialize(workbook);
          const deserialized = deserialize(serialized);
          expect(deserialized).toEqual(workbook);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: joplin-univer-plugin, Property 5: Multiple Spreadsheet Independence
   */
  it('should render multiple spreadsheets independently', () => {
    fc.assert(
      fc.property(
        fc.array(workbookArbitrary(), { minLength: 2, maxLength: 5 }),
        (workbooks) => {
          const instances = workbooks.map(wb => 
            createUniverInstance(createContainer(), wb)
          );
          
          // Verify each instance has unique ID
          const ids = instances.map(inst => inst.getId());
          const uniqueIds = new Set(ids);
          expect(uniqueIds.size).toBe(instances.length);
          
          // Cleanup
          instances.forEach(inst => destroyUniverInstance(inst.getId()));
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Test Data Generators

Property-based tests require generators (arbitraries) for creating random valid inputs:

```typescript
// Generator for valid workbook data
function workbookArbitrary(): fc.Arbitrary<IWorkbookData> {
  return fc.record({
    id: fc.uuid(),
    name: fc.string({ minLength: 1, maxLength: 50 }),
    appVersion: fc.constant('0.1.0'),
    locale: fc.constantFrom('en-US', 'zh-CN'),
    sheets: fc.dictionary(
      fc.uuid(),
      worksheetArbitrary()
    ),
    sheetOrder: fc.array(fc.uuid(), { minLength: 1, maxLength: 5 }),
    styles: fc.constant({})
  });
}

// Generator for worksheet data
function worksheetArbitrary(): fc.Arbitrary<IWorksheetData> {
  return fc.record({
    id: fc.uuid(),
    name: fc.string({ minLength: 1, maxLength: 30 }),
    cellData: cellDataArbitrary(),
    rowCount: fc.integer({ min: 1, max: 100 }),
    columnCount: fc.integer({ min: 1, max: 26 })
  });
}

// Generator for cell data
function cellDataArbitrary(): fc.Arbitrary<ICellData> {
  return fc.dictionary(
    fc.integer({ min: 0, max: 99 }).map(String),
    fc.dictionary(
      fc.integer({ min: 0, max: 25 }).map(String),
      cellValueArbitrary()
    )
  );
}

// Generator for cell values
function cellValueArbitrary(): fc.Arbitrary<ICellValue> {
  return fc.oneof(
    fc.record({ v: fc.string() }),
    fc.record({ v: fc.integer() }),
    fc.record({ v: fc.boolean() }),
    fc.record({ 
      v: fc.integer(),
      f: fc.string({ minLength: 2 }).map(s => '=' + s)
    })
  );
}
```

### Test Coverage Goals

- **Unit Test Coverage**: Minimum 80% code coverage
- **Property Test Coverage**: All 14 correctness properties implemented as property tests
- **Integration Test Coverage**: Manual testing of all user-facing features

### Continuous Integration

Tests should run automatically on:
- Every commit to the repository
- Pull request creation
- Before release builds

### Manual Testing Checklist

Before release, manually verify:
1. Plugin installs successfully in Joplin
2. Toolbar button and menu items appear
3. Spreadsheet creation works in editor
4. Spreadsheets render correctly in viewer at inline positions
5. Formulas calculate correctly
6. Data persists after closing and reopening notes
7. Multiple spreadsheets in one note work independently and maintain positions
8. Sync to another device via Dropbox preserves spreadsheet data
9. Sync to another device via Joplin Cloud preserves spreadsheet data
10. Spreadsheets appear inline with surrounding text content
11. Error messages display appropriately for failures
12. Plugin can be uninstalled cleanly
