import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FaUser, FaRobot, FaCopy, FaClock, FaCode } from 'react-icons/fa';
import ContextDialog from './ContextDialog';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const MessageContainer = styled.div`
  margin-bottom: 1.5rem;
  max-width: 90%;
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  display: flex;
  animation: ${fadeIn} 0.3s ease-out forwards;
  
  &:last-child {
    margin-bottom: 0.5rem;
  }
  
  @media (max-width: 480px) {
    max-width: 95%;
    margin-bottom: 1rem;
  }
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${props => props.isUser 
    ? props.theme.button.primary 
    : props.theme.background.tertiary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${props => props.isUser ? '0' : '0.75rem'};
  margin-left: ${props => props.isUser ? '0.75rem' : '0'};
  order: ${props => props.isUser ? '1' : '0'};
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  
  svg {
    color: ${props => props.isUser 
      ? props.theme.text.primary 
      : props.theme.text.accent};
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    width: 30px;
    height: 30px;
    margin-right: ${props => props.isUser ? '0' : '0.5rem'};
    margin-left: ${props => props.isUser ? '0.5rem' : '0'};
    
    svg {
      font-size: 0.8rem;
    }
  }
`;

const MessageContent = styled.div`
  display: flex;
  flex-direction: column;
  max-width: calc(100% - 50px);
  
  @media (max-width: 480px) {
    max-width: calc(100% - 40px);
  }
`;

const MessageBubble = styled.div`
  padding: 0.9rem 1.2rem;
  border-radius: ${props => props.isUser 
    ? '1rem 1rem 0.25rem 1rem' 
    : '1rem 1rem 1rem 0.25rem'};
  background: ${props => props.isUser 
    ? props.theme.message.user.background 
    : props.theme.message.bot.background};
  color: ${props => props.isUser 
    ? props.theme.message.user.text 
    : props.theme.message.bot.text};
  box-shadow: 0 2px 10px ${props => props.theme.shadow};
  line-height: 1.6;
  border: ${props => !props.isUser 
    ? props.theme.message.bot.border
    : 'none'};
  
  code {
    background: ${props => props.isUser 
      ? 'rgba(255, 255, 255, 0.2)' 
      : props.theme.code.background};
    padding: 0.2rem 0.4rem;
    border-radius: 0.25rem;
    font-family: 'Menlo', monospace;
    font-size: 0.85em;
  }

  pre {
    margin: 1rem 0;
    border-radius: 0.5rem;
    overflow: hidden;
    position: relative;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
    
    code {
      font-size: 0.8em;
    }
  }
`;

const MessageActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  margin-top: 0.5rem;
  gap: 0.75rem;
`;

const ActionButton = styled.button`
  background: transparent;
  color: ${props => props.theme.text.muted};
  border: none;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  
  &:hover {
    color: ${props => props.theme.text.accent};
  }
  
  svg {
    margin-right: 0.25rem;
    font-size: 0.875rem;
  }
`;

const ExecutionTime = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.theme.text.muted};
  font-size: 0.75rem;
  
  svg {
    margin-right: 0.25rem;
    color: ${props => props.theme.text.accent};
  }
  
  span {
    color: ${props => props.theme.text.accent};
    font-weight: 500;
  }
`;

const Message = ({ isUser, text, isLast, executionTime, context }) => {
  const [copied, setCopied] = useState(false);
  const [showContext, setShowContext] = useState(false);
  
  // Custom renderer for code blocks in markdown
  const renderers = {
    code: ({node, inline, className, children, ...props}) => {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    
    // Reset after 3 seconds
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <MessageContainer isUser={isUser}>
      <Avatar isUser={isUser}>
        {isUser ? <FaUser /> : <FaRobot />}
      </Avatar>
      
      <MessageContent>
        <MessageBubble isUser={isUser}>
          {isUser ? (
            text
          ) : (
            <ReactMarkdown
              children={text || 'Thinking...'}
              components={renderers}
            />
          )}
        </MessageBubble>
        
        {!isUser && (
          <MessageActions isUser={isUser}>
            {executionTime && (
              <ExecutionTime>
                <FaClock /> 
                <span>Generated in {executionTime.toFixed(2)}s</span>
              </ExecutionTime>
            )}
            
            {context && (
              <ActionButton onClick={() => setShowContext(true)} title="Show context used by LLM">
                <FaCode /> Show Context
              </ActionButton>
            )}
            
            <ActionButton onClick={copyToClipboard} title={copied ? "Copied!" : "Copy to clipboard"}>
              <FaCopy /> {copied ? "Copied!" : "Copy"}
            </ActionButton>
          </MessageActions>
        )}
        
        {/* Context dialog */}
        <ContextDialog 
          isOpen={showContext}
          onClose={() => setShowContext(false)}
          context={context}
        />
      </MessageContent>
    </MessageContainer>
  );
};

export default Message;
