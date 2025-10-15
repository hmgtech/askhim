import React, { useState, useEffect } from 'react';
import ChatWindow from './components/ChatWindow';
import Header from './components/Header';
import InputArea from './components/InputArea';
import OptionsBar from './components/OptionsBar';
import { AppContainer } from './styles/AppStyles';
import useChatService from './hooks/useChatService';

function App() {
  const [input, setInput] = useState('');
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [repositories, setRepositories] = useState([]);
  
  const { 
    messages, 
    isLoading, 
    executionTime,
    lastContext, // This comes from the context delimiter in useChatService
    sendMessage 
  } = useChatService();

  // Fetch repositories on component mount
  useEffect(() => {
    fetchRepositories();
  }, []);
  
  const fetchRepositories = async () => {
    try {
      const response = await fetch('/api/repositories');
      const data = await response.json();
      const repoOptions = data.repositories.map(repo => ({
        value: repo,
        label: repo
      }));
      setRepositories(repoOptions);
    } catch (error) {
      console.error('Error fetching repositories:', error);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === '' || isLoading) return;
    
    const userMessage = input.trim();
    setInput('');
    
    await sendMessage(userMessage, selectedRepo?.value || null);
  };

  return (
    <AppContainer>
      <Header />
      
      <ChatWindow 
        messages={messages} 
        isLoading={isLoading}
        executionTime={executionTime}
        context={lastContext} // Pass context to ChatWindow
        key="chatWindow" // Add key to force re-render
      />
      
      <OptionsBar 
        repositories={repositories}
        selectedRepo={selectedRepo}
        setSelectedRepo={setSelectedRepo}
        isLoading={isLoading}
        executionTime={executionTime}
      />
      
      <InputArea 
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </AppContainer>
  );
}

export default App;
