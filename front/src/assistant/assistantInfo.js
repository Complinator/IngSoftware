import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Card, 
  CardHeader, 
  CardContent, 
  Typography, 
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button
} from '@mui/material';
import { Delete as DeleteIcon, OpenInNew as OpenIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';

const AssistantDetails = () => {
    const { assistant } = useParams();
    const [assistantData, setAssistantData] = useState({});
    const [fileData, setFileData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const handleGetAssistant = async () => {
        try {
          const response = await fetch(`http://localhost:8000/api/get-assistant`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({assistant_id: assistant})
          });
          if (!response.ok) {
            throw new Error('Failed to fetch assistant');
          }
          const data = await response.json();
          setAssistantData(data);
          return data.storage
        } catch (err) {
          console.log(err.message);
        }
    };

    const handleGetFiles = async (storage) => {
      try {
        const response = await fetch(`http://localhost:8000/api/get-files`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({storage_id: `${storage}`})
        });
        if (!response.ok) {
          throw new Error('Failed to fetch files');
        }
        const data = await response.json();
        setFileData(data);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };

    const handleDelete = async (storage_id, file_id, file_name) => {
      try {
        const response = await fetch('http://localhost:8000/api/delete/botfile', {
          method: 'POST',
          body: JSON.stringify({storage_id: `${storage_id}`, file_id: `${file_id}`, file_name: `${file_name}`}),
        });
  
        const result = await response.json();
        alert(result.info);
        handleGetFiles(storage_id);
      } catch (error) {
        console.error('Error Removing file:', error);
        alert('Failed to remove file.');
      }
    };

    const handleGetData = async () => {
      const storage = await handleGetAssistant();
      handleGetFiles(storage);
    }

    const handleUploadfiles = () => {
      navigate(`/sidebar/bot/${assistantData.storage}/upload`)
    }

    const handleOpenfile = (file) => {
      navigate(`/sidebar/bot/${file}/view`)
    }

    useEffect(() => {
        handleGetData();
    }, [])

    if (loading) {
      return <h1>Loading...</h1>;
    }

    return (
        <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', mt: 4 }}>
        <Card>
            <CardHeader
            title={assistantData.name}
            subheader={assistantData.id}
            />
            <Divider />
            <CardContent>
            <Typography variant="body1" gutterBottom>
                Model: {assistantData.model}
            </Typography>
            <Typography variant="body1" gutterBottom>
                Created: {assistantData.date_created}
            </Typography>
            <Typography variant="body1" gutterBottom>
                Status: {assistantData.status}
            </Typography>
            </CardContent>
        </Card>

        <Card sx={{ mt: 4 }}>
            <CardHeader title={`Storage:`} subheader={assistantData.storage}/>
            <Divider />
            <CardContent>
            <List>
                {fileData.map((file) => (
                <ListItem
                    key={file.id}
                    secondaryAction={
                    <>
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(assistantData.storage, file.id, file.name)}>
                        <DeleteIcon />
                        </IconButton>
                        <IconButton edge="end" aria-label="open" onClick={() => handleOpenfile(file.id)}>
                        <OpenIcon />
                        </IconButton>
                    </>
                    }
                >
                    <ListItemText primary={file.name} secondary={`ID: ${file.id}`} />
                </ListItem>
                ))}
            </List>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button variant="contained" color="primary" onClick={() => handleUploadfiles()}>
                Upload New File
                </Button>
            </Box>
            </CardContent>
        </Card>
        </Box>
    );
};

export default AssistantDetails;