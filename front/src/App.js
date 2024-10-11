import './App.css';
import SignIn from './components/auth/SignIn';
import React, { useEffect, useState } from 'react';
import Chat from './components/chatbot/chat';
import SelectPDF from './components/selectPDF/SelectPDF';
import ChatbotDataSelection from './components/ChatbotDataSelection';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ChatLayoutComponent from './components/sidebar';

function App() {
  const { isAuthenticated } = useAuth();
  console.log(isAuthenticated);
  return (
      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/chat" element={isAuthenticated ? <ChatLayoutComponent /> : <Navigate to="/login" />} />
          <Route path="/select-pdf" element={isAuthenticated ? <SelectPDF /> : <Navigate to="/login" />} />
          <Route path="/bot-selection" element={isAuthenticated ? <ChatbotDataSelection /> : <Navigate to="/login" />} />
        </Routes>
      </Router>
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
