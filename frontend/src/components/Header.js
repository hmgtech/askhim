import React from 'react';
import styled from 'styled-components';
import { FaCode, FaGithub, FaQuestion } from 'react-icons/fa';

const HeaderContainer = styled.header`
  background: ${props => props.theme.background.gradient};
  color: ${props => props.theme.text.primary};
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.25);
  
  @media (max-width: 480px) {
    padding: 0.75rem;
  }
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.75rem;
    color: ${props => props.theme.text.accent};
    filter: drop-shadow(0 0 2px rgba(56, 189, 248, 0.3));
  }
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    
    svg {
      margin-right: 0.5rem;
      font-size: 1rem;
    }
  }
`;

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

const IconButton = styled.button`
  background: ${props => props.theme.background.tertiary};
  color: ${props => props.theme.text.accent};
  border: none;
  border-radius: 0.5rem;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.theme.button.hover};
    transform: translateY(-2px);
  }
  
  svg {
    font-size: 1.25rem;
  }
  
  @media (max-width: 480px) {
    width: 2rem;
    height: 2rem;
    
    svg {
      font-size: 1rem;
    }
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Logo>
        <FaCode size={28} />
        Askhim
      </Logo>
      
      <HeaderControls>
        <IconButton title="View source on GitHub">
          <FaGithub />
        </IconButton>
        <IconButton title="Help">
          <FaQuestion />
        </IconButton>
      </HeaderControls>
    </HeaderContainer>
  );
};

export default Header;
