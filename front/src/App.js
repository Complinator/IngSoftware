import './App.css';
import SignIn from './components/auth/SignIn';
import React, { useEffect } from 'react';
import PDFDragDrop from './components/selectPDF/selectPDF2';
import { Route, Routes, Navigate } from 'react-router-dom';
import ChatLayoutComponent from './components/sidebar';
import ChatComponent from './components/chatbot/chat';
import AssistantList from './components/selectBOT';
import { AssistantProvider } from './context/AssistantContext';
import { useAuth } from './context/AuthContext';

function App() {
  const { isAuthenticated, loading } = useAuth();
  
  useEffect(() => {
    console.log(isAuthenticated)
  }, [isAuthenticated]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <AssistantProvider>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/sidebar" /> : <SignIn />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/sidebar" /> : <SignIn />} />
        <Route
          path="/sidebar"
          element={isAuthenticated ? <ChatLayoutComponent /> : <Navigate to="/login" />}
        >
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
