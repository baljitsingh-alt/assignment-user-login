import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        const token = localStorage.getItem("token");
        
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUser(res.data.userProfile);
        } catch (error) {
            console.error("Auth check failed:", error);
            logout(); 
        } finally {
            setLoading(false); 
        }
    };

    const login = (userData, token) => {
        setUser(userData);

        localStorage.setItem('user', JSON.stringify(userData));
        if (token) localStorage.setItem('token', token);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
            setLoading(false);
        } else {
            checkAuth();
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
