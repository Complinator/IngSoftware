import './App.css';
import SignIn from './components/auth/SignIn';
import React, { useEffect, useState } from 'react';
import Chat from './components/chatbot/chat';
import PDFDragDrop from './components/selectPDF/selectPDF2';
import ChatbotDataSelection from './components/ChatbotDataSelection';
import { Router, Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom';

import { useAuth } from './context/AuthContext';
import { AuthProvider } from './context/AuthContext';
import ChatLayoutComponent from './components/sidebar';
import ChatComponent from './components/chatbot/chat';
import AssistantList from './components/selectBOT';
import { AssistantProvider } from './context/AssistantContext';
function App() {
  const { isAuthenticated} = useAuth(); // Fetch authentication state
  
  console.log(isAuthenticated);
  // Show a loading screen while checking authentication status
  
  

  return (
    <AuthProvider>
    <AssistantProvider>
            {isAuthenticated ? (
              <>
              <Routes>
                <Route path="/sidebar" element={<ChatLayoutComponent />}>
                  <Route path="chat" element={<ChatComponent />} />
                  <Route path="select-pdf" element={<PDFDragDrop />} />
                  <Route path="bot-selection" element={<AssistantList />} />
                </Route>
                <Route path="*" element={<Navigate to="/sidebar/chat" />} />
              </Routes>
              </>
            ) : (
              <>
              <Routes>
                <Route path="/" element={<SignIn />} />
                <Route path="/login" element={<SignIn />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </Routes>
              </>
            )}
        
    </AssistantProvider>
    </AuthProvider>
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
