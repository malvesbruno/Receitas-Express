import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { LogIn } from './database';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [logged, setLogged] = useState(false);
    const [uuid, setUuid] = useState('');

    useEffect(() => {
        const checkLogin = async () => {
            const email = Cookies.get('email');
            const password = Cookies.get('password');
            if (email && password) {
                const user = await LogIn(email, password);
                if (user) {
                    setLogged(true);
                    setUuid(user.uid);
                }
            }
        };

        checkLogin();
    }, []);

    const login = async (email, password) => {
        const user = await LogIn(email, password);
        if (user) {
            setLogged(true);
            setUuid(user.uid);
        }
    };

    const logout = () => {
        setLogged(false);
        setUuid('');
        Cookies.remove('email');
        Cookies.remove('password');
    };

    return (
        <AuthContext.Provider value={{ logged, uuid, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);