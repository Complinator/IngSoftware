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
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssistants();
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
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChoose = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/assistants/${id}/choose`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to choose assistant');
      }
      // You might want to update the UI to reflect the chosen assistant
      alert(`Assistant ${id} chosen successfully`);
    } catch (err) {
      setError(err.message);
    }
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
        <Typography variant="h6" gutterBottom>There is nothing to show</Typography>
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
    <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <List>
        {assistants.map((assistant) => (
          <ListItem
            key={assistant.id}
            secondaryAction={
              <Box>
                <IconButton edge="end" aria-label="delete" onClick={console.log("delete")} >{/*onClick={() => handleDelete(assistant.id)}*/}
                  <DeleteIcon />
                </IconButton>
                <IconButton edge="end" aria-label="choose" onClick={console.log("choose")} >{/* onClick={() => handleChoose(assistant.id)} */}
                  <CheckCircleIcon />
                </IconButton>
              </Box>
            }
          >
            <ListItemText primary={assistant.name} secondary={`ID: ${assistant.id}`} />
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