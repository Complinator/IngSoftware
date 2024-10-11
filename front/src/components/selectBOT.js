import React, { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Typography,
  CircularProgress
} from '@mui/material';
import {
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AssistantList = () => {
  const [assistants, setAssistants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAssistantId, setSelectedAssistantId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setSelectedAssistantId(localStorage.getItem('assistantid'));
  })

  useEffect(() => {
    fetchAssistants();
    const storedAssistantId = localStorage.getItem('assistantid');
    if (storedAssistantId) {
      setSelectedAssistantId(storedAssistantId);
    }
  }, []);

  const fetchAssistants = async () => {
    try {
      const response = await fetch('http://localhost:8000/assistants');
      if (!response.ok) {
        throw new Error('Failed to fetch assistants');
      }
      const data = await response.json();
      setAssistants(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/assistants/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete assistant');
      }
      setAssistants(assistants.filter(assistant => assistant.id !== id));
      if (id === selectedAssistantId) {
        localStorage.removeItem('assistantid');
        setSelectedAssistantId(null);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChoose = async (id) => {
    localStorage.setItem('assistantid', id);
    setSelectedAssistantId(id);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (assistants.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          There is nothing to show
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/sidebar/select-pdf')}
        >
          Add a new bot
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <List>
        {assistants.map((assistant) => (
          <ListItem
            key={assistant.id}
            secondaryAction={
              <>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  
                >{/* onClick={() => handleDelete(assistant.id)} */}
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="select"
                  onClick={() => handleChoose(assistant.id)}
                >
                  <CheckCircleIcon
                    color={selectedAssistantId === assistant.id ? 'success' : 'disabled'}
                  />
                </IconButton>
              </>
            }
          >
            <ListItemText primary={assistant.name} />
          </ListItem>
        ))}
      </List>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => navigate('/sidebar/select-pdf')}
        sx={{ mt: 2 }}
      >
        Add New Assistant
      </Button>
    </Box>
  );
};

export default AssistantList;