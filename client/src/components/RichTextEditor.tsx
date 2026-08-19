import { Bold, Code2, Italic, Link2, List, ListOrdered, Quote, Underline } from "lucide-react";
import { useEffect, useRef } from "react";

type RichTextEditorProps = { value: string; onChange: (value: string) => void; label: string };
const tools = [{ command: "bold", icon: Bold, label: "Gras" }, { command: "italic", icon: Italic, label: "Italique" }, { command: "underline", icon: Underline, label: "Souligné" }, { command: "insertUnorderedList", icon: List, label: "Liste" }, { command: "insertOrderedList", icon: ListOrdered, label: "Liste numérotée" }, { command: "formatBlock", value: "blockquote", icon: Quote, label: "Citation" }, { command: "formatBlock", value: "pre", icon: Code2, label: "Code" }];

export default function RichTextEditor({ value, onChange, label }: RichTextEditorProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { if (ref.current && document.activeElement !== ref.current && ref.current.innerHTML !== value) ref.current.innerHTML = value; }, [value]);
  const run = (command: string, commandValue?: string) => { document.execCommand(command, false, commandValue); ref.current?.focus(); onChange(ref.current?.innerHTML ?? ""); };
  return <div className="rich-editor"><div className="rich-editor__label">{label}</div><div className="rich-editor__toolbar">{tools.map(tool => <button type="button" key={tool.label} title={tool.label} onMouseDown={event => event.preventDefault()} onClick={() => run(tool.command, tool.value)}><tool.icon size={15} /></button>)}<button type="button" title="Ajouter un lien" onMouseDown={event => event.preventDefault()} onClick={() => { const url = window.prompt("Adresse du lien (https://…)"); if (url) run("createLink", url); }}><Link2 size={15} /></button></div><div ref={ref} className="rich-editor__area" contentEditable suppressContentEditableWarning role="textbox" aria-multiline="true" onInput={event => onChange(event.currentTarget.innerHTML)} /></div>;
}
