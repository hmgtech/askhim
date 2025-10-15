import React from 'react';
import ReactDOM from 'react-dom';
import { FaTimes, FaCodeBranch, FaDownload } from 'react-icons/fa';
import CodeBlock from './CodeBlock';
import '../styles/ContextDialog.css';
import '../styles/theme.css';

const ContextDialog = ({ isOpen, onClose, context }) => {
  // Move the useEffect outside the conditional
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  // Return null early if dialog is not open
  if (!isOpen) return null;
  
  const handleDownload = () => {
    const blob = new Blob([context], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'context.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Debug logs to see what context we're receiving
  console.log("Context dialog opened with context:", context ? context.substring(0, 100) + "..." : "none");

  // Split context into sections by file
  const contextSections = [];
  if (context) {
    // Log the full context for debugging
    console.log("Full context:", context);
    
    try {
      // First try the regex pattern approach
      const filePattern = /\*\*File:\s*([^:]+):(\d+)\*\*\n/;
      const sections = context.split("\n\n");
      for (const section of sections) {
        if (filePattern.test(section)) {
          const fileMatch = section.match(filePattern);
          const fileName = fileMatch ? fileMatch[1] : "Unknown file";
          
          // Get content after the file header line
          let content = section.substring(section.indexOf('\n') + 1);
          
          // Remove markdown code block formatting if present
          content = content.replace(/```[\w]*\n/g, '').replace(/```$/g, '');
          
          contextSections.push({
            file: fileName,
            content: content
          });
        }
      }
    } catch (error) {
      console.error("Error parsing context:", error);
    }
  }

  const dialog = (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={e => e.stopPropagation()}>
        <div className="dialog-header">
          <h3 className="dialog-title">
            <FaCodeBranch />
            LLM Context
          </h3>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="dialog-body">
          {contextSections.length > 0 ? (
            contextSections.map((section, index) => (
              <div className="context-section" key={index}>
                <div className="file-name">{section.file}</div>
                <CodeBlock code={section.content} filename={section.file} />
              </div>
            ))
          ) : (
            <div>No context information available</div>
          )}
        </div>
        
        <div className="dialog-footer">
          <button 
            className="footer-button secondary" 
            onClick={handleDownload} 
            title="Download context as text file"
          >
            <FaDownload />
            Download
          </button>
          <button 
            className="footer-button primary" 
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  // Render dialog in portal to body for true screen centering
  return ReactDOM.createPortal(dialog, document.body);
};

export default ContextDialog;
