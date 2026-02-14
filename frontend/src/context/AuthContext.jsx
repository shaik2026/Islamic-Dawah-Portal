import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored user on mount
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            // Restore auth header if token exists
            const token = localStorage.getItem('token');
            if (token) {
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            // Direct call to auth endpoint
            const response = await api.post('/auth/login', { username, password });

            const { token, user: userData } = response.data;

            // Store token and user data
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));

            // Update axios default header
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setUser(userData);
            return { success: true };
        } catch (error) {
            console.error('Login failed:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed. Please try again.'
            };
        }
    };

    const register = async (name, username, password) => {
        try {
            await api.post('/auth/register', { name, username, password });
            return { success: true };
        } catch (error) {
            console.error('Registration failed:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed. Please try again.'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
