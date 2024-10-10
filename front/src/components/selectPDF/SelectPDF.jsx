import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './selectPDF.css';

const SelectPDF = () => {
  const onDrop = useCallback((acceptedFiles) => {
    const pdfFiles = acceptedFiles.filter(file => file.type === 'application/pdf');
    if (pdfFiles.length === 0) {
      alert('Only PDF files are allowed.');
      return;
    }
    // Handle the PDF files here
    console.log(pdfFiles);
  }, []);

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
          <p>Arrastra tu PDF aquí, o apreta el botón!</p>
        )}
        <button type="button" className="select-button" onClick={() => document.querySelector('input[type="file"]').click()}>
          Seleccionar un PDF
        </button>
      </div>
    </div>
  );
};

export default SelectPDF;