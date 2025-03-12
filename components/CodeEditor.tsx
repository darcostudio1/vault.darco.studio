import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  height?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language,
  height = '200px'
}) => {
  return (
    <div className="relative border rounded-md overflow-hidden" style={{ height }}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 w-full h-full font-mono p-4 bg-transparent text-transparent caret-white resize-none z-10"
        style={{ 
          caretColor: 'white',
          tabSize: 2
        }}
      />
      <div className="absolute inset-0 w-full h-full overflow-auto">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1rem',
            height: '100%',
            background: 'transparent'
          }}
        >
          {value || ' '}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeEditor;
