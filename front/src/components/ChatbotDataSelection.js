import React, { useState, useEffect } from 'react';


const ChatbotDataSelection = () => {
    const [pdfFiles, setPdfFiles] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);

    useEffect(() => {
        // Fetch the list of PDF files from the backend API
        fetch('http://localhost:8000/api/files')
            .then(response => response.json())
            .then(data => {
                //console.log('PDF files:', data.files);
                setPdfFiles(data.files); // Access the 'files' property from the response
            })
            .catch(error => {
                console.error('Error fetching PDF files:', error);
            });
    }, []);

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedFiles([...selectedFiles, value]);
        } else {
            setSelectedFiles(selectedFiles.filter(file => file !== value));
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Call another API with the selected files
        fetch('http://localhost:8000/api/submit-files', { 
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ files: selectedFiles }),
        })
            .then(response => response.json())
            .then(data => {
            console.log('Files submitted successfully:', data);
            })
            .catch(error => {
            console.error('Error submitting files:', error);
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Select PDF Files</h3>
            {pdfFiles.map((file, index) => (
                <div key={index}>
                    <label>
                        <input
                            type="checkbox"
                            value={file}
                            onChange={handleCheckboxChange}
                        />
                        {file}
                    </label>
                </div>
            ))}
            <button type="submit">Submit</button>
        </form>
    );
};

export default ChatbotDataSelection;