/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import  { createContext, useContext, useState, useEffect, useRef } from "react";
import apiClient from "../services/apiClient";

const AppContext = createContext(undefined);

export function AppProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [recommendedStates, setRecommendedStates] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [signupActive, setSignupActive] = useState(false);
  const [loginActive, setLoginActive] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCreator, setSelectedCreator] = useState(null);
  
  // Filter states
  const [activeFilters, setActiveFilters] = useState({
    creative_fields: [],
    availability: [],
    location: [],
    tools: [],
    color: []
  });

  // Initialize user on app mount - check if already logged in with httpOnly cookie
  const didInitAuth = useRef(false);

  useEffect(() => {
    if (didInitAuth.current) return;
    didInitAuth.current = true;

    const initializeAuth = async () => {
      try {
        const response = await apiClient.getProfile();
        if (response.success && response.data) {
          setUser(response.data.data || response.data.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        setSidebarOpen,
        recommendedStates,
        setRecommendedStates,
        searchQuery,
        setSearchQuery,
        openModal,
        setOpenModal,
        signupActive,
        setSignupActive,
        loginActive,
        setLoginActive,
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        isLoading,
        activeFilters,
        setActiveFilters,
        currentPage,
        setCurrentPage,
        selectedCreator,
        setSelectedCreator,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppProvider");
  }
  return context;
}