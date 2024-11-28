import React, { useState } from 'react';
import AuthContainer from '../../components/login/AuthContainer'; // Ajuste o caminho conforme necessário
import './LoginScreen.css'; // Importa o CSS para o LoginScreen

const LoginScreen = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <main>
        <AuthContainer />
    </main>
  );
};

export default LoginScreen;
