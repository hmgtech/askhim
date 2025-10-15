import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import '../styles/CodeBlock.css';

const getLanguageFromFilename = (filename) => {
  if (!filename) return 'javascript';
  const ext = filename.split('.').pop();
  switch (ext) {
    case 'js': return 'javascript';
    case 'jsx': return 'jsx';
    case 'ts': return 'typescript';
    case 'tsx': return 'tsx';
    case 'py': return 'python';
    case 'java': return 'java';
    case 'css': return 'css';
    case 'html': return 'html';
    case 'json': return 'json';
    case 'md': return 'markdown';
    case 'sh': return 'bash';
    default: return 'javascript';
  }
};

const CodeBlock = ({ code, language, filename }) => (
  <SyntaxHighlighter
    language={language || getLanguageFromFilename(filename)}
    style={oneDark}
    customStyle={{
      fontSize: '0.85rem',
      borderRadius: '0.25rem',
      margin: 0,
      padding: '0.5rem',
      background: '#282c34',
      overflowX: 'auto',
      maxHeight: 200,
    }}
    className="code-block"
    showLineNumbers={false}
  >
    {code}
  </SyntaxHighlighter>
);

export default CodeBlock;
