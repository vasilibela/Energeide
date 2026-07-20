import React from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

/**
 * Editor di testo rich (WYSIWYG) basato su Quill.
 * - Salva il contenuto come HTML.
 * - Toolbar essenziale: grassetto, corsivo, sottolineato, elenchi, link, citazioni.
 */
const RichTextEditor = ({
  value,
  onChange,
  placeholder,
  testid,
  minHeight = 180,
}) => {
  const modules = React.useMemo(
    () => ({
      toolbar: [
        [{ header: [2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["blockquote", "link"],
        ["clean"],
      ],
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "blockquote",
    "link",
  ];

  return (
    <div
      data-testid={testid}
      className="rich-text-editor bg-white border border-gray-200 rounded-md focus-within:border-[#0FB36B] focus-within:ring-2 focus-within:ring-[#0FB36B]/10 transition"
      style={{ "--rte-min-height": `${minHeight}px` }}
    >
      <ReactQuill
        theme="snow"
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
      />
    </div>
  );
};

export default RichTextEditor;
