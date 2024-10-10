import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';


const Chat = () => {
    const [threadId, setThreadId] = useState(0);
    // Esta función hará la solicitud GET al backend para obtener el threadId

    const initializeChat = async () => {
        if (!sessionStorage.getItem("thread_id")) {
        try {
            const response = await fetch("http://localhost:8000/chat", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setThreadId(data.threadid);
            sessionStorage.setItem("thread_id", data.threadid)
        } catch (error) {
            console.error("Error initializing chat:", error);
        }} 
    };

    // Usamos useEffect para llamar a initializeChat cuando el usuario abre el chat
//    useEffect(() => {
//        initializeChat();
//    }, []);  // Solo se ejecuta una vez, cuando el componente se monta

    return (
      <div>
        <Button
        type="submit"
        fullWidth
        variant="contained"
        onClick={initializeChat}
        >
        chatbot
        </Button>
        {threadId ? (
            <div>
            Chat initialized. Thread ID: {threadId}
            </div>
        ) : (
            <div>Loading chat...</div>
        )}
      </div>
  );
};

export default Chat;
