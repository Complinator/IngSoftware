import React, { useState, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  IconButton,
  Button,
  CircularProgress
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  PictureAsPdf as PdfIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';

const PDFDragDrop = () => {
  const [files, setFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    const pdfFiles = acceptedFiles.filter(
      file => file.type === 'application/pdf'
    ).map(file => ({
      file,
      isUploading: false,
      isUploaded: false
    }));
    setFiles(prevFiles => [...prevFiles, ...pdfFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {'application/pdf': ['.pdf']},
    multiple: true
  });

  const removeFile = (fileToRemove) => {
    setFiles(files.filter(fileObj => fileObj.file !== fileToRemove));
  };

  const uploadFiles = async () => {
    const formData = new FormData();
    const filesToUpload = files.filter(fileObj => !fileObj.isUploaded && fileObj.file);

    filesToUpload.forEach(fileObj => {
      formData.append('file', fileObj.file);
      fileObj.isUploading = true;
    });

    setFiles([...files]);

    try {
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      setFiles(files.map(fileObj => {
        if (filesToUpload.some(f => f.file === fileObj.file)) {
          return { ...fileObj, isUploading: false, isUploaded: true };
        }
        return fileObj;
      }));

      alert(result.info);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file.');
      setFiles(files.map(fileObj => ({ ...fileObj, isUploading: false })));
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 500, margin: 'auto' }}>
      <Paper
        {...getRootProps()}
        sx={{
          p: 2,
          mb: 2,
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
          cursor: 'pointer',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <input {...getInputProps()} />
        <Box sx={{ textAlign: 'center' }}>
          <PdfIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography variant="h6">
            {isDragActive ? 'Drop PDF files here' : 'Drag & drop PDF files here, or click to select files'}
          </Typography>
        </Box>
      </Paper>

      {files.length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Files:
          </Typography>
          <List>
            {files.map((fileObj, index) => (
              <ListItem key={index}>
                <ListItemText 
                  primary={fileObj.file ? fileObj.file.name : 'Unknown file'}
                  secondary={fileObj.file ? `${(fileObj.file.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown size'} 
                />
                <ListItemSecondaryAction>
                  {fileObj.isUploaded ? (
                    <CheckCircleIcon sx={{ color: 'success.main' }} />
                  ) : fileObj.isUploading ? (
                    <CircularProgress size={24} />
                  ) : (
                    <IconButton edge="end" aria-label="delete" onClick={() => removeFile(fileObj.file)}>
                      <DeleteIcon />
                    </IconButton>
                  )}
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          {files.some(fileObj => !fileObj.isUploaded && fileObj.file) && (
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              sx={{ mt: 2 }}
              onClick={uploadFiles}
              disabled={files.some(fileObj => fileObj.isUploading)}
            >
              Upload Files
            </Button>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default PDFDragDrop;