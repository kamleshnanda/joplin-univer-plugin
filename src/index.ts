import joplin from 'api';
import { MenuItemLocation, ToolbarButtonLocation } from 'api/types';

/**
 * Joplin Univer Plugin Entry Point
 * 
 * This plugin integrates the Univer spreadsheet SDK into Joplin,
 * allowing users to embed Excel-like spreadsheets within their notes.
 */

/**
 * Plugin initialization function
 * Called when the plugin is loaded by Joplin
 */
module.exports = async function() {
  console.log('Univer Plugin: Starting initialization...');

  try {
    // Register plugin commands
    await registerCommands();
    
    // Add UI elements (toolbar button, menu items)
    await registerUI();
    
    // Register content scripts for rendering
    await registerContentScripts();
    
    console.log('Univer Plugin: Initialization complete');
  } catch (error) {
    console.error('Univer Plugin: Initialization failed', error);
    throw error;
  }
}

/**
 * Register plugin commands
 */
async function registerCommands() {
  // Register the insert spreadsheet command
  await joplin.commands.register({
    name: 'insertSpreadsheet',
    label: 'Insert Spreadsheet',
    iconName: 'fas fa-table',
    execute: async () => {
      console.log('Univer Plugin: Insert spreadsheet command executed');
      
      // Get the selected note
      const note = await joplin.workspace.selectedNote();
      
      if (!note) {
        await joplin.views.dialogs.showMessageBox('Please select a note first');
        return;
      }
      
      // Generate a unique ID for the spreadsheet
      const spreadsheetId = generateSpreadsheetId();
      
      // Create default spreadsheet data
      const defaultSpreadsheet = createDefaultSpreadsheet(spreadsheetId);
      
      // Insert the fence block at cursor position
      await joplin.commands.execute('insertText', 
        `\n\`\`\`univer-sheet\n${JSON.stringify(defaultSpreadsheet, null, 2)}\n\`\`\`\n`
      );
      
      console.log('Univer Plugin: Spreadsheet inserted with ID:', spreadsheetId);
    }
  });
}

/**
 * Register UI elements (toolbar button, menu items)
 */
async function registerUI() {
  // Add toolbar button
  await joplin.views.toolbarButtons.create(
    'insertSpreadsheetButton',
    'insertSpreadsheet',
    ToolbarButtonLocation.EditorToolbar
  );
  
  // Add menu item
  await joplin.views.menuItems.create(
    'insertSpreadsheetMenu',
    'insertSpreadsheet',
    MenuItemLocation.Tools
  );
  
  console.log('Univer Plugin: UI elements registered');
}

/**
 * Register content scripts for rendering spreadsheets
 */
async function registerContentScripts() {
  // TODO: Register markdown renderer content script
  // TODO: Register CodeMirror editor content script
  console.log('Univer Plugin: Content scripts registration (placeholder)');
}

/**
 * Generate a unique ID for a spreadsheet
 */
function generateSpreadsheetId(): string {
  return `univer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create default spreadsheet structure
 */
function createDefaultSpreadsheet(id: string) {
  return {
    id: id,
    name: 'Spreadsheet',
    appVersion: '0.1.0',
    locale: 'en-US',
    styles: {},
    sheets: {
      'sheet-1': {
        id: 'sheet-1',
        name: 'Sheet1',
        cellData: {
          '0': {
            '0': { v: 'A1' },
            '1': { v: 'B1' }
          },
          '1': {
            '0': { v: 'A2' },
            '1': { v: 'B2' }
          }
        },
        rowCount: 10,
        columnCount: 10,
        defaultRowHeight: 25,
        defaultColumnWidth: 100
      }
    },
    sheetOrder: ['sheet-1']
  };
}
