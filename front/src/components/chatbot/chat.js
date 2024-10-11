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
  ListItemText
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

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
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const [threadid, setThreadid] = useState(sessionStorage.getItem("thread_id"));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const getResponse = async (message) => {
    try {
        const response = await fetch("http://localhost:8000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({threadid: threadid, message: message})
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

      setThreadid(sessionStorage.getItem("thread_id"));
      
      // Send the current inputMessage, not the state variable
      const backendResponse = await getResponse(inputMessage);
      
      setInputMessage('');
      
      // Add the backend response to messages
      const backendMessage = { text: backendResponse, sender: "backend" };
      setMessages(prevMessages => [...prevMessages, backendMessage]);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ height: '80vh', display: 'flex', flexDirection: 'column', mt: 2 }}>
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