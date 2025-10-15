import styled from 'styled-components';

export const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s ease-out;
  overflow: hidden; /* Prevent scrolling of the page behind the dialog */
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

export const DialogContent = styled.div`
  background: ${props => props.theme.background.secondary};
  border-radius: 0.75rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 650px; /* Reduced from 700px */
  max-height: 70vh; /* Reduced from 80vh */
  height: auto;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease-out;
  position: fixed; /* Fix position in viewport */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* Center precisely */
  
  @keyframes slideIn {
    from { transform: translate(-50%, -45%); opacity: 0; }
    to { transform: translate(-50%, -50%); opacity: 1; }
  }
  
  @media (max-height: 700px) {
    max-height: 80vh; /* Allow more height on smaller screens */
  }
  
  @media (max-width: 600px) {
    width: 95%; /* Wider on small screens */
    max-height: 65vh; /* Shorter on mobile */
  }
`;

export const DialogHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem; /* Reduced padding */
  border-bottom: 1px solid ${props => props.theme.border};
  flex-shrink: 0; /* Prevent header from shrinking */
`;

export const DialogTitle = styled.h3`
  margin: 0;
  color: ${props => props.theme.text.primary};
  font-size: 1.1rem; /* Slightly smaller */
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.75rem;
    color: ${props => props.theme.text.accent};
  }
`;

export const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.text.muted};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
  
  &:hover {
    color: ${props => props.theme.text.primary};
    background: ${props => props.theme.background.tertiary};
  }
`;

export const DialogBody = styled.div`
  padding: 0.75rem; /* Reduced padding */
  overflow-y: auto; /* Allow scrolling within the dialog body */
  flex-grow: 1;
  color: ${props => props.theme.text.secondary};
  font-family: 'Menlo', monospace;
  font-size: 0.8rem; /* Smaller font */
  line-height: 1.5; /* Reduced line height */
  white-space: pre-wrap;
  background: ${props => props.theme.background.primary};
  border-radius: 0.5rem;
  margin: 0 0.75rem; /* Reduced margin */
  
  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  /* Track */
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.background.primary};
  }
  
  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.background.tertiary};
    border-radius: 3px;
  }
  
  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.border};
  }
`;

export const ContextSection = styled.div`
  margin-bottom: 0.75rem; /* Reduced margin */
  padding-bottom: 0.75rem; /* Reduced padding */
  border-bottom: 1px solid ${props => props.theme.border};
  
  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

export const FileName = styled.div`
  font-weight: bold;
  color: ${props => props.theme.text.accent};
  margin-bottom: 0.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background: ${props => props.theme.background.tertiary};
  display: inline-block;
`;

export const CodeContent = styled.div`
  padding: 0.5rem;
  background: ${props => props.theme.code.background};
  border-radius: 0.25rem;
  color: ${props => props.theme.text.primary};
  overflow-x: auto;
  max-height: 200px; /* Reduced from 300px */
  overflow-y: auto; /* Make individual code blocks scrollable */
`;

export const DialogFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0.75rem 1rem; /* Reduced padding */
  border-top: 1px solid ${props => props.theme.border};
  gap: 0.75rem;
  flex-shrink: 0; /* Prevent footer from shrinking */
`;

export const FooterButton = styled.button`
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem; /* Slightly smaller buttons */
  border-radius: 0.5rem;
  font-size: 0.85rem; /* Smaller font */
  cursor: pointer;
  transition: all 0.2s;
  
  svg {
    margin-right: 0.5rem;
  }
  
  &.primary {
    background: ${props => props.theme.button.primary};
    color: white;
    border: none;
    
    &:hover {
      background: ${props => props.theme.button.hover};
    }
  }
  
  &.secondary {
    background: transparent;
    color: ${props => props.theme.text.secondary};
    border: 1px solid ${props => props.theme.border};
    
    &:hover {
      background: ${props => props.theme.background.tertiary};
      color: ${props => props.theme.text.primary};
    }
  }
`;
