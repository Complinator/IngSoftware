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
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useAssistant } from '../context/AssistantContext';
const AssistantList = () => {
  const [assistants, setAssistants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const assistantInfo = useAssistant();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [toBeDeleted, setToBeDeleted] = useState({});
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
      const response = await fetch(`http://localhost:8000/api/delete-assistant`, {
        method: 'POST',
        body: JSON.stringify({assistantid: id})
      });
      if (!response.ok) {
        throw new Error('Failed to delete assistant');
      }
      setAssistants(assistants.filter(assistant => assistant.id !== id));
      handleClose()
      fetchAssistants()
      if (id === assistantInfo.assistantInfo.id) {
        assistantInfo.setAssistantInfo({name: '', id: ''});
      }
    } catch (err) {
      setError(err.message);
    }
  };
  const handleOpen = (id, name) => {
    setToBeDeleted({id: id, name: name});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setName('');
    setToBeDeleted({});
  };
  const handleSubmit = async () => {
    if (name.trim() === '') {
      alert('Name field cannot be empty');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/create-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        throw new Error('Failed to create assistant');
      }
      const newAssistant = await response.json();
      setAssistants([...assistants, newAssistant]);
      handleClose();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChoose = async (id) => {
    try {
      const response = await fetch('http://localhost:8000/api/load-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assistant_id: id }),
      });
      if (!response.ok) {
        throw new Error('Failed to choose assistant');
      }
      const data = await response.json();
      //console.log(data);
      assistantInfo.setAssistantInfo({ name: data.assistant_name, id: data.assistant_id });
      // You might want to update the UI to reflect the chosen assistant
      //console.log(assistantInfo.assistantInfo);
      //alert(`Assistant ${data.name} chosen successfully`);
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
              <Box>
                <IconButton edge="end" aria-label="delete" onClick={() => handleOpen(assistant.id, assistant.name)} >{/*onClick={() => handleDelete(assistant.id)}*/}
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="select"
                  onClick={() => handleChoose(assistant.id)}
                >
                  <CheckCircleIcon
                    color={assistantInfo.assistantInfo.id === assistant.id ? 'success' : 'disabled'}
                  />
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
          onClick={() => {navigate("/sidebar/select-pdf")}}
          sx={{ mt: 2 }}
        >
          Add New Assistant
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Are you sure you want to delete {toBeDeleted.name}?</DialogTitle>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={() => {handleDelete(toBeDeleted.id)}}>Delete</Button>
          </DialogActions>
        </Dialog>
    </Box>
  );
};

export default AssistantList;