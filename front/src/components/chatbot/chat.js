import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  TextField, 
  IconButton, 
  Paper, 
  Typography, 
  Container,
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import { useAssistant } from '../../context/AssistantContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const ChatComponent = () => {
  const assistantInfo = useAssistant();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [threadid, setThreadid] = useState(sessionStorage.getItem("thread_id"));
  const [assistantId, setAssistantId] = useState(localStorage.getItem("assistantid"));
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const getResponse = async (message) => {
    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({threadid: threadid, message: message, assistantid: assistantInfo.assistantInfo.id}),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("Error initializing chat:", error);
      return "error";
    }
  }

  const sendMessage = async () => {
    if (inputMessage.trim() !== '') {
      const newMessage = { text: inputMessage, sender: 'user' };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setInputMessage('');
      setIsTyping(true);

      setThreadid(sessionStorage.getItem("thread_id"));
      setAssistantId(localStorage.getItem("assistantid"));
      
      const backendResponse = await getResponse(newMessage.text);
      
      setIsTyping(false);
      const backendMessage = { text: backendResponse, sender: "backend" };
      setMessages(prevMessages => [...prevMessages, backendMessage]);
    }
  };

  const TypingIndicator = () => (
    <ListItem sx={{ justifyContent: 'flex-start' }}>
      <Paper elevation={1} sx={{ p: 1, backgroundColor: 'grey.300' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CircularProgress size={20} sx={{ mr: 1 }} />
          <Typography variant="body2">Typing...</Typography>
        </Box>
      </Paper>
    </ListItem>
  );

  if (!assistantInfo.assistantInfo.id) {
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="sm">
          <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              There is no assistant loaded yet
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ mr: 2, mb: 2 }}
                onClick={() => navigate('/sidebar/bot-selection')}
              >
                Load an existing assistant
              </Button>
              <Button 
                variant="outlined" 
                color="secondary"
                onClick={() => navigate('/sidebar/select-pdf')}
              >
                Create a new assistant
              </Button>
            </Box>
          </Paper>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ height: '80vh', display: 'flex', flexDirection: 'column', mt: 2 }}>
          <Box sx={{ p: 2, backgroundColor: 'background.default', borderBottom: '2px solid rgba(0, 0, 0, 0.12)', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <Typography variant="h6" sx={{ ml: 5 }}>{assistantInfo.assistantInfo.name}</Typography>
          </Box>
          <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
            <List>
              {messages.map((message, index) => (
                <ListItem 
                  key={index}
                  sx={{ 
                    justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <Paper 
                    elevation={1}
                    sx={{
                      p: 1,
                      backgroundColor: message.sender === 'user' ? 'primary.main' : 'grey.300',
                      color: message.sender === 'user' ? 'white' : 'black',
                    }}
                  >
                    <Typography variant="body1">{message.text}</Typography>
                  </Paper>
                </ListItem>
              ))}
              {isTyping && <TypingIndicator />}
            </List>
            <div ref={messagesEndRef} />
          </Box>
          <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
            <TextField
              fullWidth
              size="small"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <IconButton color="primary" onClick={sendMessage}>
                    <SendIcon />
                  </IconButton>
                ),
              }}
            />
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default ChatComponent;