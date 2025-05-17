
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, securityCode?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Mock user data for development
  const mockUsers = [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@saveetha.com',
      password: 'password123',
      role: 'admin' as const
    },
    {
      id: '2',
      name: 'Regular User',
      email: 'user@example.com',
      password: 'password123',
      role: 'user' as const
    }
  ];

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  
  const login = async (email: string, password: string) => {
    setLoading(true);
    
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user with matching credentials
    const matchedUser = mockUsers.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    
    if (matchedUser) {
      // Create user object without password
      const { password, ...userWithoutPassword } = matchedUser;
      
      // Store in state and localStorage
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      toast.success("Login successful!");
    } else {
      toast.error("Invalid email or password");
      throw new Error("Invalid email or password");
    }
    
    setLoading(false);
  };
  
  const register = async (name: string, email: string, password: string, securityCode?: string) => {
    setLoading(true);
    
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    if (mockUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      toast.error("Email already in use");
      setLoading(false);
      throw new Error("Email already in use");
    }
    
    // Check security code for admin registration
    const role = securityCode === '79041167197200060295' ? 'admin' : 'user';
    
    if (securityCode && securityCode !== '79041167197200060295') {
      toast.error("Invalid security code");
      setLoading(false);
      throw new Error("Invalid security code");
    }
    
    // Create new user
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 11),
      name,
      email,
      role
    };
    
    // In a real app, we would send this to an API
    // For now, just update our local state
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    toast.success(`Registration successful! Logged in as ${role}.`);
    setLoading(false);
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  
  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isAdmin,
      login,
      register,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
