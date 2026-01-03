"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "@/utils/config"; // Adjust the path as necessary

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data on component mount (e.g., check if user is logged in)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/auth/protected`, {
          withCredentials: true, // Ensures cookies are sent for authentication
        });
        setUser(response.data.user); // Set user data if available
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setUser(null); // Clear user state if no data
      } finally {
        setLoading(false); // Set loading state to false after fetching
      }
    };

    fetchUserData();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true } // Ensures cookies are sent
      );
      setUser(response.data.user); // Set user data on successful login
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Invalid email or password"); // Handle login failure
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
      setUser(null); // Clear user state on logout
    } catch (error) {
      console.error("Logout failed:", error);
      throw new Error("Unable to log out");
    }
  };

  const isAuthenticated = !!user; // Check if the user is authenticated based on user state

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated }}>
      {loading ? (
        <div>Loading...</div> // Optional: Replace with a loading spinner/UI component
      ) : (
        children // Only render children when loading is complete
      )}
    </AuthContext.Provider>
  );
};

// Hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider"); // Ensure that context is provided
  }
  return context;
};
