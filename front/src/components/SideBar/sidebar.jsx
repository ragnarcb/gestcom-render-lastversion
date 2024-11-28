// src/components/SideBar/sidebar.jsx
import { faBox, faChartLine, faCog, faHistory, faShoppingCart, faSignOutAlt, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { NavLink } from 'react-router-dom';
import './sidebar.css';
import { authService } from '../../services/AuthService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Sidebar = () => {

  const navigate = useNavigate();

  const handleLogout = async (e, page) => {
    if (page.name === 'Logout') {
      e.preventDefault();
      try {
        await authService.logout();
        navigate('/', { replace: true });
      } catch (error) {
        toast.error('Erro ao fazer logout');
      }
    }
  };

  const pages = [
    {
      name: 'Produtos',
      icon: faBox,
      link: '/products'
    },
    {
      name: 'Vendas',
      icon: faShoppingCart,
      link: '/sales'
    },
    {
      name: 'Clientes',
      icon: faUsers,
      link: '/customers'
    },
    {
      name: 'Histórico de Vendas',
      icon: faHistory,
      link: '/sales-history'
    },
    // {
    //   name: 'Relatórios',
    //   icon: faChartLine,
    //   link: '/reports'
    // },
    {
      name: 'Configurações',
      icon: faCog,
      link: '/settings'
    },
    {
      name: 'Logout',
      icon: faSignOutAlt,
      link: '/'
    }
  ]

  return (
    <div className="sidebar">
      <h2>GESTCOM</h2>
      <ul>
        {pages.map((page, index) => (
          <li key={index}>
            <NavLink to={page.link} className={({ isActive }) => isActive ? "active" : ""} onClick={(e) => handleLogout(e, page)}>
              <FontAwesomeIcon icon={page.icon} />
              <span>{page.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;