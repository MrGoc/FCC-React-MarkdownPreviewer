//import logo from './logo.svg';
import "./App.css";
import { useState } from "react";
import { marked } from "marked";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import "highlight.js/styles/github.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoffee,
  faMaximize,
  faDownLeftAndUpRightToCenter,
} from "@fortawesome/free-solid-svg-icons";

hljs.registerLanguage("javascript", javascript);

marked.use({
  breaks: true,
  langPrefix: "hljs language-javascript",
});

const defEditorText = `# Welcome to my React Markdown Previewer!

## This is a sub-heading...
### And here's some other cool stuff:

Heres some code, \`<div></div>\`, between 2 backticks.

\`\`\`
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`

You can also make text **bold**... whoa!
Or _italic_.
Or... wait for it... **_both!_**
And feel free to go crazy ~~crossing stuff out~~.

There's also [links](https://www.freecodecamp.org), and
> Block Quotes!

And if you want to get really crazy, even tables:

Wild Header | Crazy Header | Another Header?
------------ | ------------- | -------------
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.


1. And there are numbered lists too.
1. Use just 1s if you want!
1. And last but not least, let's not forget embedded images:

![freeCodeCamp Logo](https://cdn.freecodecamp.org/testable-projects-fcc/images/fcc_secondary.svg)
`;

const captionEditor = "Editor";
const captionPreview = "Preview";

function App() {
  const [text, setText] = useState(defEditorText);
  const [maximized, setMaximized] = useState("");

  function handleChange(newText) {
    setText(newText);
  }

  function handleMaximized(newMaximized) {
    setMaximized(newMaximized);
  }

  return (
    <div className="App">
      <div className="Separator"></div>
      <Editor
        text={text}
        onChange={handleChange}
        maximized={maximized}
        onChangeMaximized={handleMaximized}
      />
      <div className="Separator"></div>
      <Preview
        preview={marked.parse(text)}
        maximized={maximized}
        onChangeMaximized={handleMaximized}
      />
    </div>
  );
}

function Editor({ text, onChange, maximized, onChangeMaximized }) {
  function handleChange(e) {
    onChange(e.target.value);
  }
  if (maximized === captionPreview) return null;
  let style = {};
  if (maximized === captionEditor) style = { height: "900px" };

  return (
    <div className="Editor">
      <Toolbar
        caption={captionEditor}
        maximized={maximized}
        onChangeMaximized={onChangeMaximized}
      />
      <div className="EditorPanel">
        <textarea id="editor" onChange={handleChange} style={style}>
          {text}
        </textarea>
      </div>
    </div>
  );
}

function Preview(props) {
  if (props.maximized === captionEditor) return null;

  let parser = new DOMParser();
  const doc = parser.parseFromString(props.preview, "text/html");
  doc.querySelectorAll("code").forEach((el) => {
    // then highlight each
    hljs.highlightElement(el, { language: "javascript" });
  });

  const previewText = { __html: doc.documentElement.innerHTML };
  return (
    <div className="Preview">
      <Toolbar
        caption={captionPreview}
        maximized={props.maximized}
        onChangeMaximized={props.onChangeMaximized}
      />
      <div
        id="preview"
        className="PreviewText"
        dangerouslySetInnerHTML={previewText}
      />
    </div>
  );
}

function Toolbar(props) {
  function onClick() {
    if (props.maximized === "") props.onChangeMaximized(props.caption);
    else props.onChangeMaximized("");
  }

  let maximized = props.maximized !== "";

  return (
    <div className="Toolbar">
      <FontAwesomeIcon icon={faCoffee} />
      <p>{props.caption}</p>
      <FontAwesomeIcon
        className="IconResize"
        icon={maximized ? faDownLeftAndUpRightToCenter : faMaximize}
        onClick={onClick}
      />
    </div>
  );
}

export default App;
