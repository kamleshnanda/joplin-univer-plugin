/**
 * Type declarations for Joplin Plugin API
 * The actual API is provided by the Joplin host application
 */

declare module 'api' {
  const joplin: any;
  export default joplin;
}

declare module 'api/types' {
  export enum MenuItemLocation {
    File = 'file',
    Edit = 'edit',
    View = 'view',
    Note = 'note',
    Tools = 'tools',
    Help = 'help',
    Context = 'context',
    EditorContextMenu = 'editorContextMenu'
  }

  export enum ToolbarButtonLocation {
    EditorToolbar = 'editorToolbar',
    NoteToolbar = 'noteToolbar'
  }

  export enum ContentScriptType {
    MarkdownItPlugin = 'markdownItPlugin',
    CodeMirrorPlugin = 'codeMirrorPlugin'
  }
}
