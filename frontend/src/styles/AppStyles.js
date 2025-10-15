import styled from 'styled-components';

export const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
  background: ${props => props.theme.background.primary};
  color: ${props => props.theme.text.primary};
  
  @media (max-width: 768px) {
    height: 100%;
    min-height: 100vh;
    overflow-x: hidden;
  }
`;
