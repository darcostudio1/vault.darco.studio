import { useEffect, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/plugins/line-numbers/prism-line-numbers.js';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/plugins/toolbar/prism-toolbar.js';
import 'prismjs/plugins/toolbar/prism-toolbar.css';
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.js';
import { Check, Clipboard, Code, TerminalSquare, File } from 'lucide-react';
import { cn } from '../lib/utils';

interface CodeBlockProps {
  code: string;
  language: 'html' | 'css' | 'javascript' | 'jsx' | 'typescript' | 'tsx' | 'json' | 'bash';
  showLineNumbers?: boolean;
  maxHeight?: string;
  title?: string;
}

export default function CodeBlock({ 
  code, 
  language, 
  showLineNumbers = true,
  maxHeight = '500px',
  title
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      Prism.highlightAll();
    }
  }, [code, language]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine the language class
  const getLanguageClass = () => {
    const languageMap: Record<string, string> = {
      'html': 'language-markup',
      'css': 'language-css',
      'javascript': 'language-javascript',
      'jsx': 'language-jsx',
      'typescript': 'language-typescript',
      'tsx': 'language-tsx',
      'json': 'language-json',
      'bash': 'language-bash'
    };
    
    return languageMap[language] || 'language-markup';
  };

  // Get a readable language name for display
  const getLanguageDisplay = () => {
    const displayMap: Record<string, string> = {
      'html': 'HTML',
      'css': 'CSS',
      'javascript': 'JavaScript',
      'jsx': 'JSX',
      'typescript': 'TypeScript',
      'tsx': 'TSX',
      'json': 'JSON',
      'bash': 'Bash'
    };
    
    return displayMap[language] || language.toUpperCase();
  };

  // Get the appropriate icon based on language
  const getLanguageIcon = () => {
    if (language === 'bash') {
      return <TerminalSquare className="h-4 w-4" />;
    }
    return <File className="h-4 w-4" />;
  };

  return (
    <div className="relative my-4 rounded-md overflow-hidden border border-border bg-card text-card-foreground shadow-sm">
      {/* Code header with language badge and copy button */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {getLanguageIcon()}
          <span className="font-medium">{title || getLanguageDisplay()}</span>
        </div>
        <button
          onClick={handleCopy}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8"
          title="Copy to clipboard"
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Clipboard className="h-4 w-4" />
          )}
          <span className="sr-only">{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      
      {/* Code content */}
      <div 
        className={cn(
          "relative font-mono text-sm overflow-auto p-4",
          showLineNumbers && "line-numbers"
        )}
        style={{ maxHeight }}
      >
        <pre className="m-0 p-0" style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          <code className={getLanguageClass()}>{code}</code>
        </pre>
      </div>
    </div>
  );
}