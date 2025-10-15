import React from 'react';
import styled from 'styled-components';
import Select from 'react-select';
import { FaSync, FaDatabase, FaClock } from 'react-icons/fa';

const OptionsContainer = styled.div`
  background: ${props => props.theme.background.secondary};
  padding: 0.75rem 1rem;
  border-top: 1px solid ${props => props.theme.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
    padding: 0.75rem 0.5rem;
  }
`;

const OptionsLabel = styled.label`
  margin-right: 0.5rem;
  font-size: 0.875rem;
  color: ${props => props.theme.text.muted};
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

const SelectWrapper = styled.div`
  width: 200px;
  margin-right: 1rem;
  
  @media (max-width: 768px) {
    width: 100%;
    margin-right: 0;
  }
`;

const StatusIndicator = styled.div`
  font-size: 0.875rem;
  color: ${props => props.isLoading 
    ? props.theme.text.accent 
    : '#10b981'};
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.25rem;
    animation: ${props => props.isLoading ? 'spin 1s linear infinite' : 'none'};
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const StatusGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 480px) {
    gap: 0.5rem;
    width: 100%;
    justify-content: center;
  }
`;

const ExecutionTime = styled.div`
  display: flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  background: ${props => props.theme.execution.background};
  color: ${props => props.theme.execution.text};
  font-size: 0.75rem;
  
  svg {
    margin-right: 0.25rem;
    color: ${props => props.theme.execution.accent};
  }
  
  span {
    font-weight: 600;
    color: ${props => props.theme.execution.accent};
    margin-left: 0.25rem;
  }
`;

const OptionsBar = ({ repositories, selectedRepo, setSelectedRepo, isLoading, executionTime }) => {
  // Custom styles for react-select in dark mode
  const selectStyles = {
    control: (styles) => ({ 
      ...styles, 
      backgroundColor: '#334155',
      borderColor: '#475569',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#0ea5e9'
      }
    }),
    menu: (styles) => ({
      ...styles,
      backgroundColor: '#1e293b'
    }),
    option: (styles, { isFocused, isSelected }) => ({
      ...styles,
      backgroundColor: isSelected 
        ? '#0ea5e9' 
        : isFocused 
          ? '#334155' 
          : undefined,
      color: '#f8fafc'
    }),
    singleValue: (styles) => ({
      ...styles,
      color: '#f8fafc'
    }),
    input: (styles) => ({
      ...styles,
      color: '#f8fafc'
    }),
    placeholder: (styles) => ({
      ...styles,
      color: '#94a3b8'
    }),
    multiValue: (styles) => ({
      ...styles,
      backgroundColor: '#334155'
    }),
    multiValueLabel: (styles) => ({
      ...styles,
      color: '#f8fafc'
    }),
    multiValueRemove: (styles) => ({
      ...styles,
      color: '#94a3b8',
      ':hover': {
        backgroundColor: '#475569',
        color: '#f8fafc'
      }
    })
  };

  return (
    <OptionsContainer>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        width: window.innerWidth <= 768 ? '100%' : 'auto'
      }}>
        <OptionsLabel>Repository:</OptionsLabel>
        <SelectWrapper>
          <Select
            options={repositories}
            value={selectedRepo}
            onChange={setSelectedRepo}
            placeholder="Select a Repository"
            isClearable
            styles={selectStyles}
          />
        </SelectWrapper>
      </div>
      
      <StatusGroup>
        {executionTime && (
          <ExecutionTime>
            <FaClock size={12} />
            Time: <span>{executionTime.toFixed(2)}s</span>
          </ExecutionTime>
        )}
        
        <StatusIndicator isLoading={isLoading}>
          {isLoading ? (
            <>
              <FaSync size={14} />
              Generating response...
            </>
          ) : (
            <>
              <FaDatabase size={14} />
              Ready
            </>
          )}
        </StatusIndicator>
      </StatusGroup>
    </OptionsContainer>
  );
};

export default OptionsBar;
