import React from 'react';
import MainLayout from '../../components/layouts/MainLayout';
import './home.css';

const Home = () => {
  return (
    <MainLayout>
      <div className="home">
        <div className="welcome-section">
          <h1>Bem-vindo ao GestCom</h1>
          <p>Seu sistema completo de gestão comercial</p>
          
          <div className="features-grid">
            <div className="feature-card">
              <i className="fas fa-chart-line"></i>
              <h3>Análise de Vendas</h3>
              <p>Acompanhe o desempenho do seu negócio</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-box"></i>
              <h3>Controle de Estoque</h3>
              <p>Gerencie seus produtos facilmente</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-users"></i>
              <h3>Gestão de Clientes</h3>
              <p>Mantenha seus clientes organizados</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;