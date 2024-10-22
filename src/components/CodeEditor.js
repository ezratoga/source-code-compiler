// src/components/CodeEditor.js
import React, { useState } from "react";
import { Editor } from "@monaco-editor/react";

const CodeEditor = ({ language, onCodeChange, initial }) => {
  const [code, setCode] = useState("// Write your code here");

  const handleEditorChange = (value) => {
    setCode(value);
    onCodeChange(value);
  };

  return (
    <div>
      <Editor
        height="400px"
        language={language}
        value={initial ?? code}
        theme="vs-dark"
        onChange={handleEditorChange}
      />
    </div>
  );
};

export default CodeEditor;
