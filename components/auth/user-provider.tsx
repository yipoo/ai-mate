"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { AuthModal } from "./auth-modal";

export type User = {
  id: string;
  username: string;
  phone: string;
  avatar?: string;
  createdAt: string;
};

export type UserContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  showLoginModal: () => void;
  hideLoginModal: () => void;
  login: (userData: User) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  showLoginModal: () => {},
  hideLoginModal: () => {},
  login: () => {},
  logout: () => {},
});

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
            setIsLoading(false);
            return;
          } catch {
            localStorage.removeItem("user");
          }
        }
        
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        }
      } catch (error) {
        console.error("Failed to load user:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setShowModal(false);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const showLoginModal = () => setShowModal(true);
  const hideLoginModal = () => setShowModal(false);

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        showLoginModal,
        hideLoginModal,
        login,
        logout,
      }}
    >
      {children}
      <AuthModal 
        showTrigger={false} 
        defaultOpen={showModal}
        onOpenChange={(open) => setShowModal(open)}
      />
    </UserContext.Provider>
  );
}