import './App.css';
import SignIn from './components/auth/SignIn';
import React, { useState } from 'react';
import Chat from './components/chatbot/chat';
import SelectPDF from './components/selectPDF/SelectPDF';


function App() {
  return (
    <>
      <div>
        {/*<Chat/>*/}
        <SelectPDF/>
      </div>
    </>
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
