import React, { createContext, useContext, useState } from 'react';

// Define the context
const AssistantContext = createContext();

// Define a provider component
export const AssistantProvider = ({ children }) => {
    const [assistantInfo, setAssistantInfo] = useState({
        name: '',
        id: ''
    });

    return (
        <AssistantContext.Provider value={{ assistantInfo, setAssistantInfo }}>
            {children}
        </AssistantContext.Provider>
    );
};

// Custom hook to use the AssistantContext
export const useAssistant = () => {
    return useContext(AssistantContext);
};
