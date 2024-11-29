import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Paper 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { useParams } from 'react-router-dom';

// Styled components for enhanced aesthetics
const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 600,
  margin: '20px auto',
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[4],
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
  }
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[100],
  borderBottom: `1px solid ${theme.palette.divider}`
}));

const TextContentPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(2),
  maxHeight: '400px',
  overflowY: 'auto',
  fontFamily: 'monospace',
  fontSize: '0.9rem',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word'
}));

// TextFileViewer Component
const TextFileViewer = () => {
    const { file } = useParams();
    const [fileContent, setFileContent] = useState({});
    const [loading, setLoading] = useState(true);
    const handleGetContent = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/get/botfile', {
                method: 'POST',
                body: JSON.stringify({file_id: `${file}`}),
            });

            // const result = await response.json();
        } catch (err) {
            console.log(err);
            setFileContent({ 
                title: 'Untitled Document', 
                id: 'N/A', 
                content: 'No content available.' 
              });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        handleGetContent();
    }, [])
    if (loading) return (<h1>Loading...</h1>)
    return (
        <StyledCard>
        <HeaderBox>
            <DescriptionOutlinedIcon 
            color="primary" 
            sx={{ marginRight: 2 }} 
            />
            <Box>
            <Typography variant="h6" color="primary">
                {fileContent.title}
            </Typography>
            <Typography variant="caption" color="textSecondary">
                Document ID: {fileContent.id}
            </Typography>
            </Box>
        </HeaderBox>
        <CardContent>
            <TextContentPaper elevation={0}>
            <Typography 
                variant="body2" 
                color="textPrimary" 
                component="pre"
            >
                {fileContent.content}
            </Typography>
            </TextContentPaper>
        </CardContent>
        </StyledCard>
    );
    };

export default TextFileViewer;