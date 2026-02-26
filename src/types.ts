/**
 * Type definitions for the Joplin Univer Plugin
 */

/**
 * Univer workbook data structure
 */
export interface IWorkbookData {
  id: string;
  name: string;
  appVersion: string;
  locale: string;
  styles: Record<string, any>;
  sheets: Record<string, IWorksheetData>;
  sheetOrder: string[];
  resources?: IResourceData[];
}

/**
 * Univer worksheet data structure
 */
export interface IWorksheetData {
  id: string;
  name: string;
  cellData: ICellData;
  rowCount: number;
  columnCount: number;
  defaultRowHeight: number;
  defaultColumnWidth: number;
  mergeData?: IMergeData[];
  rowData?: Record<string, IRowData>;
  columnData?: Record<string, IColumnData>;
}

/**
 * Cell data structure (row -> column -> cell value)
 */
export interface ICellData {
  [row: number]: {
    [col: number]: ICellValue;
  };
}

/**
 * Individual cell value
 */
export interface ICellValue {
  v?: string | number | boolean;  // Value
  f?: string;                      // Formula
  s?: string;                      // Style ID
  t?: CellValueType;               // Type
}

/**
 * Cell value types
 */
export enum CellValueType {
  STRING = 1,
  NUMBER = 2,
  BOOLEAN = 3,
  FORMULA = 4
}

/**
 * Merged cell data
 */
export interface IMergeData {
  startRow: number;
  endRow: number;
  startColumn: number;
  endColumn: number;
}

/**
 * Row data (height, hidden, etc.)
 */
export interface IRowData {
  h?: number;  // Height
  hd?: boolean; // Hidden
}

/**
 * Column data (width, hidden, etc.)
 */
export interface IColumnData {
  w?: number;   // Width
  hd?: boolean; // Hidden
}

/**
 * Resource data (images, etc.)
 */
export interface IResourceData {
  id: string;
  name: string;
  type: string;
  data: string;
}

/**
 * Plugin settings
 */
export interface PluginSettings {
  defaultRows: number;
  defaultColumns: number;
  enableFormulas: boolean;
  enableFormatting: boolean;
  theme: 'light' | 'dark';
}

/**
 * Plugin error codes
 */
export enum ErrorCode {
  UNIVER_INIT_FAILED = 'E001',
  INVALID_DATA = 'E002',
  FORMULA_ERROR = 'E003',
  SYNC_CONFLICT = 'E004',
  CONTAINER_NOT_FOUND = 'E005'
}

/**
 * Plugin error class
 */
export class PluginError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public recoverable: boolean,
    public userMessage: string
  ) {
    super(message);
    this.name = 'PluginError';
  }
}
