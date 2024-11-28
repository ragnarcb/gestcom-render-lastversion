import api from './Api';
import Cookies from 'js-cookie';

export const authService = {
    async login(credentials) {
        try {
            const response = await api.post('/usuario/login', credentials);
            
            if (response.data.token) {
                Cookies.set('auth_token', response.data.token, {
                    expires: 1,
                    secure: true,
                    sameSite: 'strict'
                });
                return response.data;
            }
            throw new Error('Token não encontrado na resposta');
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Erro ao fazer login');
        }
    },

    async logout() {
        try {
            Cookies.remove('auth_token', { path: '/' });
            return true;
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            throw error;
        }
    },

    getToken() {
        return Cookies.get('auth_token');
    },

    isAuthenticated() {
        const token = this.getToken();
        if (!token) return Promise.resolve(false);
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.exp * 1000 < Date.now()) {
                this.logout();
                return Promise.resolve(false);
            }
            return Promise.resolve(true);
        } catch {
            return Promise.resolve(false);
        }
    },

    getUserRole() {
        const token = this.getToken();
        if (!token) return null;
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.role;
        } catch {
            return null;
        }
    },

    isAdmin() {
        try {
            const role = this.getUserRole();
            if (!role) return false;
            
            // Verifica se o token ainda é válido
            const token = this.getToken();
            if (!token) return false;
            
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.exp * 1000 < Date.now()) {
                this.logout();
                return false;
            }
            
            // Verifica se o role do token corresponde ao role obtido
            return role === payload.role && role === 'ADMIN';
        } catch (error) {
            console.error('Erro ao verificar permissão de admin:', error);
            return false;
        }
    }
};

export default authService;