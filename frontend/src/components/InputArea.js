import React from 'react';
import styled from 'styled-components';
import { FaPaperPlane, FaMagic } from 'react-icons/fa';

const InputContainer = styled.div`
  background: ${props => props.theme.background.secondary};
  padding: 1.25rem;
  border-top: 1px solid ${props => props.theme.border};
  display: flex;
  align-items: center;
  box-shadow: 0 -4px 10px rgba(0,0,0,0.1);
  
  @media (max-width: 768px) {
    padding: 0.75rem;
  }
`;

const InputForm = styled.form`
  display: flex;
  width: 100%;
  position: relative;
`;

const TextInput = styled.input`
  flex-grow: 1;
  border: 1px solid ${props => props.theme.border};
  border-radius: 1rem;
  padding: 1rem 1.5rem;
  outline: none;
  font-size: 1rem;
  font-family: inherit;
  background: ${props => props.theme.background.tertiary};
  color: ${props => props.theme.text.primary};
  transition: all 0.2s;
  
  &:focus {
    border-color: ${props => props.theme.button.primary};
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.2);
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }
`;

const SendButton = styled.button`
  background: ${props => props.theme.button.primary};
  color: white;
  border: none;
  border-radius: 1rem;
  padding: 0.75rem 1.25rem;
  margin-left: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: all 0.2s;
  box-shadow: 0 2px 5px rgba(14, 165, 233, 0.3);
  
  &:hover {
    background: ${props => props.theme.button.hover};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(14, 165, 233, 0.4);
  }
  
  &:disabled {
    background: ${props => props.theme.button.disabled};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  svg {
    margin-right: ${props => props.hasText ? '0.5rem' : '0'};
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem 1rem;
    margin-left: 0.5rem;
    
    svg {
      font-size: 0.9rem;
    }
  }
`;

const QuickActionsButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: ${props => props.theme.text.muted};
  cursor: pointer;
  padding: 0.5rem;
  
  &:hover {
    color: ${props => props.theme.text.accent};
  }
`;

const InputArea = ({ input, setInput, handleSubmit, isLoading }) => {
  return (
    <InputContainer>
      <InputForm onSubmit={handleSubmit}>
        <TextInput
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your code..."
          disabled={isLoading}
        />
        {!input && !isLoading && (
          <QuickActionsButton type="button" title="Quick prompts">
            <FaMagic size={16} />
          </QuickActionsButton>
        )}
        <SendButton 
          type="submit" 
          disabled={isLoading || input.trim() === ''} 
          hasText={input.trim() !== ''}
        >
          <FaPaperPlane size={16} />
          {input.trim() !== '' && "Send"}
        </SendButton>
      </InputForm>
    </InputContainer>
  );
};

export default InputArea;
