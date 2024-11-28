import React, { useState } from 'react';
import Login from './Login';
import SignUp from './SignUp';

const AuthContainer = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <>
      {isLogin ? (
        <Login onToggleForm={toggleForm} />
      ) : (
        <SignUp onToggleForm={toggleForm} />
      )}
    </>
  );
};

export default AuthContainer;