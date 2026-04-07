"use client";

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-php";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

interface CodeEditorProps {
  value: string;
  onChange: (val: string) => void;
}

export function CodeEditor({ value, onChange }: CodeEditorProps) {
  return (
    <AceEditor
      style={{ width: "100%", height: "55vh" }}
      mode="php"
      theme="monokai"
      highlightActiveLine={false}
      value={value}
      onChange={onChange}
      editorProps={{ $blockScrolling: true }}
      setOptions={{
        printMarginColumn: -1,
        enableBasicAutocompletion: false,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        showLineNumbers: true,
        tabSize: 2,
      }}
    />
  );
}
