/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import authService from "../services/authService";
import {
  saveAuthData,
  logout as clearStorage,
  getRole,
  isLoggedIn,
} from "../utils/token";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [authenticated, setAuthenticated] = useState(isLoggedIn());

  const [role, setRole] = useState(getRole());

  const login = async (email, password) => {

    const response = await authService.login(email, password);

    saveAuthData(response);

    setAuthenticated(true);

    setRole(response.role);

    return response;

  };

  const logout = () => {

    clearStorage();

    setAuthenticated(false);

    setRole(null);

  };

  return (

    <AuthContext.Provider
      value={{
        authenticated,
        role,
        login,
        logout,
      }}
    >

      {children}

    </AuthContext.Provider>

  );

}

export default AuthContext;

export const useAuth = () => useContext(AuthContext);