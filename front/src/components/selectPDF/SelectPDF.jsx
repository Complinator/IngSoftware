import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './selectPDF.css';

const SelectPDF = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    const pdfFiles = acceptedFiles.filter(file => file.type === 'application/pdf');
    if (pdfFiles.length === 0) {
      alert('Only PDF files are allowed.');
      return;
    }
    setSelectedFiles(pdfFiles);
  }, []);

  const uploadFiles = async () => {
    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('file', file);
    });

    try {
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      alert(result.info);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file.');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'application/pdf',
  });

  return (
    <div className="select-pdf-container">
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the PDF here...</p>
        ) : (
          <p>Drag 'n' drop some PDF files here, or click to select files</p>
        )}
        <button type="button" className="select-button" onClick={() => document.querySelector('input[type="file"]').click()}>
          Seleccionar un PDF
        </button>
        {selectedFiles.length > 0 && (
        <button onClick={uploadFiles} className="select-button">
          Upload
        </button>
      )}
      </div>
      
    </div>
  );
};

export default SelectPDF;