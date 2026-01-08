import { createContext, useState } from "react";
import type { ReactNode } from "react";

export type Role = "USER" | "ADMIN";

export interface User {
  id: string;
  username: string;
  email: string;
  roles: Role[];
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
}

export interface AuthContextType {
  auth: AuthState;
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    accessToken: null,
  });

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;