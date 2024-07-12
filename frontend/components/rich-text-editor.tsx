"use client";

import { useTheme } from "next-themes";
import React from "react";

import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/js/plugins.pkgd.min.js";
import "froala-editor/css/themes/dark.min.css";

import FroalaEditor from "react-froala-wysiwyg";

const RichTextEditor = ({
  field,
  placeholder = "",
  isDisabled = false,
}: {
  field: any;
  placeholder: string;
  isDisabled?: boolean;
}) => {
  const { theme } = useTheme();
  const config = {
    events: {
      initialized() {
        setTimeout(() => {
          isDisabled ? (this as any).edit.off() : (this as any).edit.on();
        }, 0);
      },
    },
    theme,
    toolbarButtons: [
      "fullscreen",
      "bold",
      "italic",
      "underline",
      "strikeThrough",
      "subscript",
      "superscript",
      "|",
      "fontSize",
      "color",
      "inlineStyle",
      "paragraphStyle",
      "|",
      "align",
      "formatOL",
      "formatUL",
      "outdent",
      "indent",
      "quote",
      "insertTable",
      "|",
      "specialCharacters",
      "insertHR",
      "selectAll",
      "clearFormatting",
      "|",
      "print",
      "help",
      "html",
      "|",
      "undo",
      "redo",
      "trackChanges",
      "markdown",
    ],
    pluginsEnabled: [
      "align",
      "charCounter",
      "codeBeautifier",
      "codeView",
      "colors",
      "draggable",
      "embedly",
      "emoticons",
      "entities",
      "file",
      "fontFamily",
      "fontSize",
      "fullscreen",
      "image",
      "imageManager",
      "inlineStyle",
      "lineBreaker",
      "link",
      "lists",
      "paragraphFormat",
      "paragraphStyle",
      "quote",
      "save",
      "table",
      "url",
      "wordPaste",
      "wordCounter",
    ],
    placeholderText: placeholder,
  };
  return (
    <FroalaEditor
      key={`${theme}-${isDisabled}`}
      tag="textarea"
      model={field.value}
      onModelChange={field.onChange}
      config={config}
    />
  );
};

export default RichTextEditor;
