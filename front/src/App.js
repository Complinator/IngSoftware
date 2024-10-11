import './App.css';
import SignIn from './components/auth/SignIn';
import React, { useEffect, useState } from 'react';
import Chat from './components/chatbot/chat';
import PDFDragDrop from './components/selectPDF/selectPDF2';
import ChatbotDataSelection from './components/ChatbotDataSelection';
import { Router, Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom';

import { useAuth } from './context/AuthContext';
import ChatLayoutComponent from './components/sidebar';
import ChatComponent from './components/chatbot/chat';
import AssistantList from './components/selectBOT';
import { AssistantProvider } from './context/AssistantContext';
function App() {
  const { isAuthenticated } = useAuth();
  console.log(isAuthenticated);
  return (
    <AssistantProvider>
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/login" element={<SignIn />} />
      <Route path="/login" element={<SignIn />} />
      <Route path="/sidebar" element={isAuthenticated ? <ChatLayoutComponent /> : <Navigate to="/login" />} >
      <Route path="chat" element={isAuthenticated ? <ChatComponent /> : <Navigate to="/login" />} />
      <Route path="select-pdf" element={isAuthenticated ? <PDFDragDrop /> : <Navigate to="/login" />} />
      <Route path="bot-selection" element={isAuthenticated ? <AssistantList /> : <Navigate to="/login" />} />
      </Route>
    </Routes>
    </AssistantProvider>
  );
}

/* 
function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Función para manejar el inicio de sesión
  const handleSignIn = (credentials) => {
      setIsAuthenticated(true);
  };

  return (
    <>
      {isAuthenticated ? (
        // Si está autenticado, muestra el componente Home
        <div>
          hola mundo
        </div>
      ) : (
        // Si no está autenticado, muestra el componente SignIn
        <SignIn onSignIn={handleSignIn} />
      )}
    </>
  );
}
*/
export default App;
