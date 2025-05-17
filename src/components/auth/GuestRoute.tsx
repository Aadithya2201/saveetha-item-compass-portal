
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ReactNode } from "react";

interface GuestRouteProps {
  children: ReactNode;
}

const GuestRoute = ({ children }: GuestRouteProps) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    // You could show a loading spinner here
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  // If user is authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // User is not authenticated
  return <>{children}</>;
};

export default GuestRoute;
