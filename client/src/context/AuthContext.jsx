import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!user;

    // Get currently logged-in user
    const getMe = async () => {
        try {
            const response = await api.get("/auth/me");

            setUser(response.data.data);

            return response.data.data;
        } catch (error) {
            setUser(null);
            throw error;
        }
    };

    // Login
    const login = async (email, password) => {
      const res = await api.post("/auth/login", {
            email,
            password,
        });

      

        const user = await getMe();

         console.log("Logged in user:", user);
    console.log("User role:", user.role);

        return user;
    };

    // Register
    const register = async (name, email, password) => {
        const response = await api.post("/auth/register", {
            name,
            email,
            password,
        });

        return response.data;
    };

    // Logout
    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } finally {
            setUser(null);
        }
    };

    // Check authentication when application starts
    useEffect(() => {
        const checkAuth = async () => {
            try {
                await getMe();
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated,
                login,
                register,
                logout,
                getMe,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};