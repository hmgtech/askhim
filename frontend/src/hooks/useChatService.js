import { useState, useCallback } from 'react';
import axios from 'axios';

// Context delimiter for separating answer from context
const CONTEXT_DELIMITER = "--- CONTEXT_DELIMITER ---";

const useChatService = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);
  const [lastContext, setLastContext] = useState(null);
  
  // Track the accumulated response
  const [responseAccumulator, setResponseAccumulator] = useState('');
  
  const sendMessage = useCallback(async (text, repository = null) => {
    if (!text.trim()) return;
    
    // Add user message to the chat
    setMessages(prev => [...prev, { isUser: true, text }]);
    setIsLoading(true);
    setLastContext(null); // Clear previous context
    setResponseAccumulator(''); // Reset accumulator
    
    try {
      // Add a placeholder for the bot's message
      setMessages(prev => [...prev, { isUser: false, text: '' }]);
      
      // Set up the response handling
      let botResponse = '';
      
      // Use fetch instead of axios for better streaming support in browser
      const response = await fetch('/api/query/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: text,
          repository,
          template_name: 'code_qa_template',
          include_context: true
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Get a reader from the response body
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      // Process the stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        // Convert the chunk to text
        const chunk = decoder.decode(value, { stream: true });
        
        // Process each line in the chunk
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (!line.trim()) continue;
          
          try {
            const data = JSON.parse(line);
            
            if (data.type === 'content') {
              botResponse += data.content;
              
              // Check for context delimiter in accumulated response
              if (botResponse.includes(CONTEXT_DELIMITER)) {
                const parts = botResponse.split(CONTEXT_DELIMITER);
                const answer = parts[0].trim();
                const context = parts[1].trim();
                
                console.log("Context delimiter found, extracted context length:", context.length);
                
                // Update the bot's message with just the answer
                setMessages(prev => [
                  ...prev.slice(0, -1),
                  { isUser: false, text: answer }
                ]);
                
                // Store context separately
                setLastContext(context);
              } else {
                // Update the bot's message with the content so far
                setMessages(prev => [
                  ...prev.slice(0, -1),
                  { isUser: false, text: botResponse }
                ]);
              }
            } else if (data.type === 'end') {
              setExecutionTime(data.execution_time);
            }
          } catch (e) {
            console.error('Error parsing streaming response line:', e, line);
          }
        }
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Update the bot message with an error
      setMessages(prev => [
        ...prev.slice(0, -1),
        { isUser: false, text: `Error: ${error.message || 'An unknown error occurred'}` }
      ]);
      
      setIsLoading(false);
    }
  }, []);
  
  return {
    messages,
    isLoading,
    executionTime,
    lastContext,
    sendMessage
  };
};

export default useChatService;
