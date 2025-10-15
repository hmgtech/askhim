import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import Message from './Message';
import { FaCode, FaSearch, FaLightbulb, FaCube } from 'react-icons/fa';

const ChatWindowContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  scroll-behavior: smooth;
  background: ${props => props.theme.background.primary};
  background-image: radial-gradient(
    circle at 25px 25px,
    rgba(255, 255, 255, 0.02) 2%,
    transparent 0%
  ),
  radial-gradient(
    circle at 75px 75px,
    rgba(255, 255, 255, 0.02) 2%,
    transparent 0%
  );
  background-size: 100px 100px;
  
  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
  }
`;

const WelcomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100%;
  width: 100%;
  text-align: center;
  padding: 1rem;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    padding: 0.5rem;
    height: auto;
  }
`;

const WelcomeHeader = styled.h2`
  color: ${props => props.theme.text.primary};
  margin-bottom: 0.5rem;
  font-weight: 700;
  font-size: 1.75rem;
  width: 100%;
  padding: 0 1rem;
  word-wrap: break-word;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    padding: 0 0.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.25rem;
    margin-top: 2rem;
  }
`;

const WelcomeSubtitle = styled.p`
  color: ${props => props.theme.text.secondary};
  margin-bottom: 2rem;
  max-width: 600px;
  line-height: 1.5;
  padding: 0 1rem;
  word-wrap: break-word;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
    max-width: 100%;
    width: 100%;
  }
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
    margin-bottom: 1rem;
    padding: 0 0.5rem;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  width: 100%;
  max-width: 800px;
  margin-top: 1.5rem;
  padding: 0 1rem;
  
  @media (max-width: 768px) {
    gap: 1rem;
    margin-top: 1rem;
    padding: 0 0.5rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    margin-bottom: 2rem;
  }
`;

const FeatureCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${props => props.theme.background.secondary};
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
  
  svg {
    color: ${props => props.theme.text.accent};
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  h3 {
    color: ${props => props.theme.text.primary};
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
  
  p {
    color: ${props => props.theme.text.muted};
    font-size: 0.9rem;
    text-align: center;
    line-height: 1.4;
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
    
    svg {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }
    
    h3 {
      font-size: 0.95rem;
      margin-bottom: 0.25rem;
    }
    
    p {
      font-size: 0.8rem;
      line-height: 1.3;
    }
  }
`;

const LogoIcon = styled.div`
  position: relative;
  background: ${props => props.theme.background.tertiary};
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  box-shadow: 0 0 25px rgba(14, 165, 233, 0.2);
  
  svg {
    color: ${props => props.theme.text.accent};
    font-size: 2.5rem;
    filter: drop-shadow(0 0 5px rgba(56, 189, 248, 0.5));
  }
  
  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
    margin-bottom: 0.75rem;
    margin-top: 1.5rem;
  }
  
  @media (max-width: 480px) {
    width: 50px;
    height: 50px;
    
    svg {
      font-size: 1.75rem;
    }
  }
`;

const ChatWindow = ({ messages, isLoading, executionTime, context }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <ChatWindowContainer>
      {messages.length === 0 ? (
        <WelcomeContainer>
          <LogoIcon>
            <FaCode size={48} />
          </LogoIcon>
          <WelcomeHeader>Welcome to Askhim</WelcomeHeader>
          <WelcomeSubtitle>
            Ask any question about your codebase and get instant insights 
            powered by semantic search and large language models.
          </WelcomeSubtitle>
          
          <FeatureGrid>
            <FeatureCard>
              <FaSearch />
              <h3>Semantic Search</h3>
              <p>Find relevant code snippets using natural language queries</p>
            </FeatureCard>
            <FeatureCard>
              <FaCube />
              <h3>Multi-Repo Support</h3>
              <p>Analyze and query across multiple codebases</p>
            </FeatureCard>
            <FeatureCard>
              <FaCode />
              <h3>Code Understanding</h3>
              <p>Get detailed explanations about code structure and functionality</p>
            </FeatureCard>
            <FeatureCard>
              <FaLightbulb />
              <h3>Smart Suggestions</h3>
              <p>Receive recommendations and best practices for your code</p>
            </FeatureCard>
          </FeatureGrid>
        </WelcomeContainer>
      ) : (
        messages.map((msg, index) => (
          <Message 
            key={index} 
            isUser={msg.isUser} 
            text={msg.text} 
            isLast={index === messages.length - 1}
            executionTime={index === messages.length - 1 && !msg.isUser ? executionTime : null}
            context={index === messages.length - 1 && !msg.isUser ? context : null}
          />
        ))
      )}
      <div ref={messagesEndRef} />
    </ChatWindowContainer>
  );
};

export default ChatWindow;
