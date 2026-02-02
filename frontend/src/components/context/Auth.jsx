import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  
    const userInfo = localStorage.getItem("userInfolms");
    const [user, setUser] = useState(userInfo ? JSON.parse(userInfo) : null);
    const login = (user) => {
        setUser(user);
    }
    const logout = () => {
        setUser(null);
        localStorage.removeItem("userInfolms");
    }
    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
    