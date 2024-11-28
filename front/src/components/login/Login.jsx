import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/AuthService';
import { toast } from 'react-toastify';
import './Login.css';

const Login = ({ textColor, inputColor, buttonColor }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    usuario: '',
    senha: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    try {
      setIsLoading(true);
      const result = await authService.login(formData);
      if (result) {
        navigate('/home', { replace: true });
        toast.success('Login realizado com sucesso!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });
      }
    } catch (error) {
      toast.error(error.message || 'Erro ao fazer login', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-box" style={{ color: textColor }}>
      <p>Login</p>
      <form onSubmit={handleSubmit}>
        <div className="user-box">
          <input
            required
            name="usuario"
            type="text"
            value={formData.usuario}
            onChange={handleChange}
            style={{ backgroundColor: inputColor }}
            disabled={isLoading}
            autoComplete="username"
          />
          <label>Usuário</label>
        </div>
        <div className="user-box">
          <input
            required
            name="senha"
            type="password"
            value={formData.senha}
            onChange={handleChange}
            style={{ backgroundColor: inputColor }}
            disabled={isLoading}
            autoComplete="current-password"
          />
          <label>Senha</label>
        </div>
        <button 
          type="submit" 
          disabled={isLoading}
          style={{ 
            backgroundColor: buttonColor,
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            color: '#fff',
            cursor: isLoading ? 'wait' : 'pointer',
            opacity: isLoading ? 0.7 : 1
          }}
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
};

export default Login;
