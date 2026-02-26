# Implementation Plan: Joplin Univer Plugin

## Overview

This implementation plan breaks down the development of the Joplin Univer Plugin into discrete, manageable tasks. The plugin will be implemented in TypeScript, following Joplin's plugin architecture patterns. Each task builds incrementally, with testing integrated throughout to catch errors early. The plan prioritizes core functionality first, then adds testing, and finally handles packaging and documentation.

## Tasks

- [x] 1. Project setup and structure
  - Initialize Joplin plugin project with TypeScript configuration
  - Set up package.json with required dependencies (@univerjs packages, Joplin API types)
  - Configure TypeScript compiler options for Joplin plugin development
  - Create directory structure (src/, dist/, tests/)
  - Set up Jest testing framework with fast-check for property-based testing
  - Configure build scripts for development and production
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 2. Plugin main module implementation
  - [ ] 2.1 Create plugin entry point (src/index.ts)
    - Implement onStart() function to register plugin with Joplin
    - Set up plugin context and configuration
    - Initialize plugin settings with defaults (defaultRows: 10, defaultColumns: 10)
    - _Requirements: 1.1, 2.1_
  
  - [ ] 2.2 Implement command registration
    - Create insertSpreadsheet command
    - Register command with Joplin API
    - Add keyboard shortcut binding (e.g., Ctrl+Shift+S)
    - _Requirements: 4.1, 4.2, 4.3_
  
  - [ ] 2.3 Add UI integration
    - Create toolbar button for spreadsheet insertion
    - Add menu item under Tools menu
    - Configure icons and labels
    - _Requirements: 4.1, 4.3, 10.4_
  
  - [ ] 2.4 Register content scripts
    - Register markdown renderer content script
    - Register CodeMirror editor content script
    - Configure script injection points
    - _Requirements: 3.2, 3.3_

- [ ] 3. Data serializer implementation
  - [ ] 3.1 Create serializer module (src/serializer.ts)
    - Implement serialize() function to convert IWorkbookData to JSON string
    - Implement deserialize() function to parse JSON string to IWorkbookData
    - Add data validation logic
    - Handle edge cases (empty workbooks, missing fields)
    - _Requirements: 7.1, 7.2, 7.5_
  
  - [ ] 3.2 Write property test for serialization round-trip
    - **Property 1: Serialization Round-Trip Preservation**
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 8.2**
  
  - [ ] 3.3 Write unit tests for serializer
    - Test serialization of empty workbook
    - Test serialization with formulas
    - Test deserialization of corrupted JSON
    - Test handling of special characters
    - _Requirements: 7.4, 11.2_

- [ ] 4. Univer manager implementation
  - [ ] 4.1 Create Univer manager module (src/univerManager.ts)
    - Implement createUniverInstance() to initialize Univer SDK
    - Configure Univer with spreadsheet, formula, and UI plugins
    - Implement instance registry to track multiple Univer instances
    - Implement destroyUniverInstance() for cleanup
    - Implement getUniverInstance() for instance retrieval
    - _Requirements: 2.1, 2.2, 2.3, 3.4_
  
  - [ ] 4.2 Add workbook serialization helpers
    - Implement serializeWorkbook() to extract data from Univer instance
    - Implement deserializeWorkbook() to load data into Univer instance
    - _Requirements: 7.1, 7.3_
  
  - [ ] 4.3 Write property test for initialization error handling
    - **Property 2: Initialization Error Handling**
    - **Validates: Requirements 2.4, 2.5, 11.1, 11.4**
  
  - [ ] 4.4 Write property test for multiple spreadsheet independence
    - **Property 5: Multiple Spreadsheet Independence**
    - **Validates: Requirements 3.4**
  
  - [ ] 4.5 Write unit tests for Univer manager
    - Test instance creation with valid data
    - Test instance cleanup
    - Test instance registry operations
    - _Requirements: 2.4, 3.4_

- [ ] 5. Command handlers implementation
  - [ ] 5.1 Create command handlers module (src/commands.ts)
    - Implement insertSpreadsheetCommand() to insert fence block at cursor
    - Implement generateSpreadsheetId() for unique ID generation
    - Implement createDefaultWorkbook() to generate default spreadsheet structure
    - _Requirements: 3.1, 4.4, 4.5_
  
  - [ ] 5.2 Write property test for spreadsheet insertion at cursor
    - **Property 3: Spreadsheet Insertion at Cursor**
    - **Validates: Requirements 3.1, 4.4**
  
  - [ ] 5.3 Write property test for default dimensions
    - **Property 4: Default Dimensions on Creation**
    - **Validates: Requirements 4.5**
  
  - [ ] 5.4 Write unit tests for command handlers
    - Test fence block generation format
    - Test unique ID generation
    - Test default workbook structure
    - _Requirements: 3.1, 4.5_

- [ ] 6. Checkpoint - Ensure core modules build and pass tests
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Markdown renderer content script
  - [ ] 7.1 Create renderer content script (src/renderer.ts)
    - Implement markdown-it plugin registration
    - Create custom fence block handler for "univer-sheet" language
    - Parse JSON data from fence block content
    - Create container elements for spreadsheet rendering
    - Ensure inline positioning within document flow
    - _Requirements: 3.2, 3.5, 3.6, 3.7_
  
  - [ ] 7.2 Implement spreadsheet rendering
    - Call univerManager.createUniverInstance() with parsed data
    - Handle rendering errors gracefully
    - Implement cleanup on note close
    - _Requirements: 3.2, 3.3, 3.4_
  
  - [ ] 7.3 Add data persistence on edit
    - Listen for Univer data change events
    - Serialize updated data back to fence block
    - Update note content through Joplin API
    - _Requirements: 7.1, 7.2_
  
  - [ ] 7.4 Write property test for spreadsheet content identification
    - **Property 6: Spreadsheet Content Identification**
    - **Validates: Requirements 3.5, 3.6, 3.7**
  
  - [ ] 7.5 Write property test for spreadsheet rendering
    - **Property 7: Spreadsheet Rendering**
    - **Validates: Requirements 3.2, 3.7**
  
  - [ ] 7.6 Write property test for data serialization on modification
    - **Property 10: Data Serialization on Modification**
    - **Validates: Requirements 7.1**
  
  - [ ] 7.7 Write unit tests for renderer
    - Test fence block detection
    - Test JSON parsing with valid data
    - Test JSON parsing with invalid data
    - Test multiple spreadsheets in one note
    - _Requirements: 3.4, 3.5, 11.2_

- [ ] 8. CodeMirror editor extension
  - [ ] 8.1 Create editor extension (src/editor.ts)
    - Implement CodeMirror plugin registration
    - Add live preview rendering for univer-sheet fence blocks
    - Implement insertSpreadsheetAtCursor() helper
    - Handle cursor position detection
    - _Requirements: 4.4, 5.1_
  
  - [ ] 8.2 Add edit mode handling
    - Implement click detection on spreadsheet components
    - Activate edit mode on click
    - Deactivate edit mode on outside click
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [ ] 8.3 Write property test for edit mode activation
    - **Property 8: Edit Mode Activation**
    - **Validates: Requirements 5.1**
  
  - [ ] 8.4 Write property test for edit mode deactivation
    - **Property 9: Edit Mode Deactivation**
    - **Validates: Requirements 5.5**
  
  - [ ] 8.5 Write unit tests for editor extension
    - Test cursor position detection
    - Test fence block insertion
    - Test edit mode transitions
    - _Requirements: 5.1, 5.5_

- [ ] 9. Error handling implementation
  - [ ] 9.1 Create error handling module (src/errors.ts)
    - Define PluginError class with error codes
    - Implement error logging utility
    - Create user-friendly error messages
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_
  
  - [ ] 9.2 Add error handling to all modules
    - Wrap Univer initialization in try-catch
    - Handle JSON parsing errors in serializer
    - Handle formula evaluation errors
    - Display error dialogs to users when appropriate
    - _Requirements: 11.1, 11.2, 11.4, 11.5_
  
  - [ ] 9.3 Write property test for corrupted data recovery
    - **Property 11: Corrupted Data Recovery**
    - **Validates: Requirements 11.2**
  
  - [ ] 9.4 Write property test for error logging
    - **Property 12: Error Logging**
    - **Validates: Requirements 11.3**
  
  - [ ] 9.5 Write unit tests for error handling
    - Test error code generation
    - Test error message formatting
    - Test graceful degradation scenarios
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

- [ ] 10. State management and cleanup
  - [ ] 10.1 Implement state preservation logic
    - Track active note ID
    - Clean up Univer instances on note switch
    - Restore instances when returning to notes
    - _Requirements: 12.5_
  
  - [ ] 10.2 Write property test for state preservation
    - **Property 13: State Preservation on Note Switch**
    - **Validates: Requirements 12.5**
  
  - [ ] 10.3 Write unit tests for state management
    - Test instance cleanup on note close
    - Test instance restoration on note open
    - Test memory leak prevention
    - _Requirements: 12.5_

- [ ] 11. Checkpoint - Ensure all core functionality works
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 12. Formula support verification
  - [ ] 12.1 Verify Univer formula plugin integration
    - Ensure @univerjs/sheets-formula is loaded
    - Test basic arithmetic operations (+, -, *, /)
    - Test common functions (SUM, AVERAGE, COUNT, MIN, MAX)
    - _Requirements: 6.1, 6.2, 6.3_
  
  - [ ] 12.2 Add formula error handling
    - Display error indicators for invalid formulas
    - Handle circular reference errors
    - _Requirements: 6.5, 11.5_
  
  - [ ] 12.3 Write unit tests for formula support
    - Test formula evaluation with valid formulas
    - Test formula evaluation with invalid formulas
    - Test cell reference updates
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 13. Cloud sync compatibility testing
  - [ ] 13.1 Write property test for cloud sync data preservation
    - **Property 14: Cloud Sync Data Preservation**
    - **Validates: Requirements 8.1, 8.2, 8.5, 8.6**
  
  - [ ] 13.2 Write integration tests for sync scenarios
    - Test data preservation after simulated sync
    - Test fence block format stability
    - Test data integrity with large spreadsheets
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [ ] 14. Build and packaging
  - [ ] 14.1 Configure webpack for plugin bundling
    - Set up webpack configuration for Joplin plugin
    - Configure TypeScript loader
    - Bundle Univer SDK dependencies
    - Optimize bundle size
    - _Requirements: 9.1, 9.2_
  
  - [ ] 14.2 Create plugin manifest
    - Define manifest.json with plugin metadata
    - Set version, author, description
    - Configure permissions and capabilities
    - Add keywords: "Excel", "Spreadsheet", "Univer", "Kamlesh"
    - _Requirements: 1.1, 9.4, 12.5_
  
  - [ ] 14.3 Set up build scripts
    - Create npm scripts for development build
    - Create npm scripts for production build
    - Generate .jpl file for distribution
    - _Requirements: 9.1, 9.3, 9.5_
  
  - [ ] 14.4 Write unit tests for build process
    - Test manifest generation
    - Test bundle integrity
    - _Requirements: 9.3, 9.4_

- [ ] 15. Local installation and testing
  - [ ] 15.1 Test plugin installation
    - Build plugin package
    - Install in local Joplin instance
    - Verify plugin appears in plugin list
    - Verify plugin activates without errors
    - _Requirements: 10.1, 10.2, 10.3_
  
  - [ ] 15.2 Manual testing checklist
    - Test toolbar button and menu items appear
    - Test spreadsheet creation via command
    - Test spreadsheet rendering in viewer at inline positions
    - Test spreadsheet editing functionality
    - Test formula calculations
    - Test data persistence after note close/reopen
    - Test multiple spreadsheets in one note maintain independence and positions
    - Test inline positioning with surrounding text
    - _Requirements: 10.4, 10.5, 12.1, 12.2, 12.3, 12.4, 12.5_

- [ ] 16. Documentation
  - [ ] 16.1 Create README.md
    - Add project description and features
    - Add installation instructions
    - Add usage guide with screenshots
    - Add development setup instructions
    - Add contribution guidelines
    - Add license information (open-source compatible)
    - _Requirements: 12.3_
  
  - [ ] 16.2 Create CHANGELOG.md
    - Document initial release features
    - Set up version tracking format
    - _Requirements: 9.4_
  
  - [ ] 16.3 Add inline code documentation
    - Add JSDoc comments to all public functions
    - Document complex algorithms
    - Add usage examples in comments
    - _Requirements: 12.3_

- [ ] 17. Final checkpoint - Complete testing and verification
  - Run full test suite (unit tests and property tests)
  - Verify all 14 correctness properties pass
  - Perform manual testing of all user-facing features
  - Test cloud sync scenarios (Dropbox, Joplin Cloud)
  - Verify inline rendering with various Markdown structures
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- All tasks are required for comprehensive testing and quality assurance
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties (14 total)
- Unit tests validate specific examples and edge cases
- All property tests should run minimum 100 iterations
- TypeScript is used throughout for type safety
- The plugin follows Joplin's plugin architecture patterns
- Spreadsheet data is stored as JSON in fence blocks for cloud sync compatibility
- Spreadsheets render inline at the exact position of fence blocks in Markdown
