import React, { useRef } from "react";
import Editor, { loader, Monaco } from "@monaco-editor/react";
import { useTheme } from "next-themes";

const MonacoEditor = ({
  language,
  allowAutoComplete,
  onChange,
  defaultValue,
  isDisabled,
  onLoad,
}: {
  language: string;
  allowAutoComplete: boolean;
  onChange: any;
  defaultValue?: string;
  isDisabled?: boolean;
  onLoad: any;
}) => {
  const { theme } = useTheme();
  const editorRef = useRef(null);

  const handleEditorBeforeMount = (monaco: Monaco) => {
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
      noSuggestionDiagnostics: true,
    });
    monaco.editor.defineTheme("dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#000000",
      },
    });
  };
  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;
    onLoad();
  };

  return (
    <Editor
      options={{
        readOnly: isDisabled,
        fontSize: 22,
        quickSuggestions: allowAutoComplete,
        wordBasedSuggestions: allowAutoComplete ? "currentDocument" : "off",
        suggestOnTriggerCharacters: allowAutoComplete,
        parameterHints: {
          enabled: allowAutoComplete,
        },
        wordWrap: "on",
      }}
      onChange={onChange}
      theme={theme == "dark" ? "vs-dark" : "light"}
      defaultLanguage={language}
      loading="Loading editor..."
      defaultValue={defaultValue || (language == "python" ? "#" : "//") + " Write your code here\n"}
      beforeMount={handleEditorBeforeMount}
      onMount={handleEditorDidMount}
    />
  );
};

export default MonacoEditor;
