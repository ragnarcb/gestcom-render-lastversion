import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from './context/ThemeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './components/routes/ProtectedRoute';

import LoginScreen from './pages/login-screen/LoginScreen';
import Products from './pages/products/Products';
import Home from './pages/home/home';
import Inventory from './pages/inventory/Inventory';
import Settings from './pages/config/Settings';
import Customers from './pages/customers/Customers';
import SettingsPreference from './pages/config/SettingsPreference';
import SalesHistory from './pages/salesHistory/SalesHistory';
import Sales from './pages/sales/Sales';
import UsersManagement from './pages/usersPage/UsersManagement';


const routerOptions = {
  future: {
    v7_startTransition: true,
    v7_fetcherPersist: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
    v7_relativeSplatPath: true,
    v7_normalizeFormMethod: true
  }
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginScreen />,
  },
  {
    path: "/home",
    element: <ProtectedRoute><Home /></ProtectedRoute>,
  },
  {
    path: "/products",
    element: <ProtectedRoute><Products /></ProtectedRoute>,
  },
  {
    path: "/inventory",
    element: <ProtectedRoute><Inventory /></ProtectedRoute>,
  },
  {
    path: "/settings",
    element: <ProtectedRoute><Settings /></ProtectedRoute>,
  },
  {
    path: "/customers",
    element: <ProtectedRoute><Customers /></ProtectedRoute>,
  },
  {
    path: "/sales",
    element: <ProtectedRoute><Sales /></ProtectedRoute>,
  },
  {
    path: "/settings/preferences",
    element: <ProtectedRoute><SettingsPreference /></ProtectedRoute>,
  },
  {
    path: "/sales-history",
    element: <ProtectedRoute><SalesHistory /></ProtectedRoute>,
  },
  {
    path: "/users-management",
    element: <ProtectedRoute><UsersManagement /></ProtectedRoute>,
  }
], routerOptions);

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </ThemeProvider>
  );
}

export default App;