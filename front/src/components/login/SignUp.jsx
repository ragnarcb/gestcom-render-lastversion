import React from 'react';
import PropTypes from 'prop-types';
import './Login.css';

const SignUp = ({ textColor, inputColor, buttonColor, onToggleForm }) => {
  return (
    <div className="login-box" style={{ color: textColor }}>
      <p>Sign Up</p>
      <form>
        <div className="user-box">
          <input required="" name="" type="text" style={{ backgroundColor: inputColor }} />
          <label>Nome</label>
        </div>
        <div className="user-box">
          <input required="" name="" type="email" style={{ backgroundColor: inputColor }} />
          <label>Email</label>
        </div>
        <div className="user-box">
          <input required="" name="" type="password" style={{ backgroundColor: inputColor }} />
          <label>Senha</label>
        </div>
        <div className="user-box">
          <input required="" name="" type="password" style={{ backgroundColor: inputColor }} />
          <label>Confirmar Senha</label>
        </div>
        <a href="#" style={{ color: buttonColor }}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          Cadastrar
        </a>
      </form>
      <p>Já tem uma conta? 
        <a href="#" 
           onClick={(e) => {
             e.preventDefault();
             onToggleForm();
           }} 
           className="a2" 
           style={{ color: buttonColor }}>
          Fazer login!
        </a>
      </p>
    </div>
  );
};

SignUp.propTypes = {
  textColor: PropTypes.string,
  inputColor: PropTypes.string,
  buttonColor: PropTypes.string,
  onToggleForm: PropTypes.func.isRequired,
};

SignUp.defaultProps = {
  textColor: '#fff',
  inputColor: '#212121',
  buttonColor: '#212121',
};

export default SignUp;
