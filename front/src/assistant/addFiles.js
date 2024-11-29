import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardHeader, 
  CardContent, 
  Typography, 
  TextField, 
  Button,
  Divider,
  CircularProgress
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const FileUploadPage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {storage} = useParams();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('storage_id', storage);

    try {
      const response = await fetch('http://localhost:8000/api/upload/botfile', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      alert(result.info);
      navigate('/sidebar/bot-selection');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '80vh' 
    }}>
      <Card sx={{ 
        width: '100%', 
        maxWidth: 400, 
        padding: 4 
      }}>
        <CardHeader
          title="Upload Text File"
          sx={{ textAlign: 'center' }}
        />
        <Divider />
        <CardContent>
          <TextField
            type="file"
            label="Select File"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={handleFileChange}
            InputLabelProps={{
                shrink: true, // Keeps the label on top
              }}
            inputProps={{
                accept: '.txt', // Restrict to .txt files
              }}
          />
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            {loading ? (
              <CircularProgress />
            ) : (
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleUpload}
                disabled={!file}
              >
                Upload
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FileUploadPage;