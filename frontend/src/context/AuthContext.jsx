import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // On app load — check if user is already logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            const response = await authService.login(credentials);
            const { token, name, id, role } = response.data;

            const userData = { id, name, role };
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            toast.success('Login successful!');
            return true;
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            toast.error(message);
            return false;
        }
    };

    const register = async (data) => {
        try {
            const response = await authService.register(data);
            toast.success(response.data.message || 'Registration successful!');
            return true;
        } catch (error) {
            const errors = error.response?.data?.errors;
            if (errors) {
                Object.values(errors).flat().forEach(msg => toast.error(msg));
            } else {
                toast.error('Registration failed');
            }
            return false;
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            // Token might already be invalid
        }
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        toast.success('Logged out successfully');
    };

    const updateUser = (updatedData) => {
        const newUser = { ...user, ...updatedData };
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
    };

    const isAuthenticated = !!user;
    const isAdmin = user?.role === 'admin';
    const isInstructor = user?.role === 'instructor';
    const isStudent = user?.role === 'student';

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isAuthenticated,
            isAdmin,
            isInstructor,
            isStudent,
            login,
            register,
            logout,
            updateUser,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};