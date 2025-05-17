
import { Bell, LogOut, Menu, Moon, Search, Sun, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  
  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  const getUserInitials = () => {
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return 'U';
  };
  
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <h1 className="text-xl font-bold text-college ml-2">
                Saveetha Item Compass
              </h1>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <nav className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-college">
                Dashboard
              </Link>
              <Link to="/items" className="text-gray-600 dark:text-gray-300 hover:text-college">
                All Items
              </Link>
              <Link to="/items/normal" className="text-gray-600 dark:text-gray-300 hover:text-college">
                Normal
              </Link>
              <Link to="/items/emergency" className="text-gray-600 dark:text-gray-300 hover:text-college">
                Emergency
              </Link>
              <Link to="/contact" className="text-gray-600 dark:text-gray-300 hover:text-college">
                Contact
              </Link>
            </nav>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            
            {!isAuthenticated ? (
              <div className="flex space-x-2">
                <Button variant="outline" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative p-0 h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-college text-white">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="p-2">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                    {isAdmin && (
                      <div className="mt-1">
                        <span className="text-xs bg-college text-white px-2 py-0.5 rounded-full">
                          Admin
                        </span>
                      </div>
                    )}
                  </div>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="w-full cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/my-items" className="w-full cursor-pointer">
                      <Search className="mr-2 h-4 w-4" />
                      My Items
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
        
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2">
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/dashboard" 
                className="text-gray-600 dark:text-gray-300 hover:text-college"
                onClick={toggleMenu}
              >
                Dashboard
              </Link>
              <Link 
                to="/items" 
                className="text-gray-600 dark:text-gray-300 hover:text-college"
                onClick={toggleMenu}
              >
                All Items
              </Link>
              <Link 
                to="/items/normal" 
                className="text-gray-600 dark:text-gray-300 hover:text-college"
                onClick={toggleMenu}
              >
                Normal
              </Link>
              <Link 
                to="/items/emergency" 
                className="text-gray-600 dark:text-gray-300 hover:text-college"
                onClick={toggleMenu}
              >
                Emergency
              </Link>
              <Link 
                to="/contact" 
                className="text-gray-600 dark:text-gray-300 hover:text-college"
                onClick={toggleMenu}
              >
                Contact
              </Link>
              {!isAuthenticated ? (
                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" asChild onClick={toggleMenu}>
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button asChild onClick={toggleMenu}>
                    <Link to="/register">Register</Link>
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="destructive" 
                  className="mt-2 w-full" 
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              )}
              <div className="pt-2 flex justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
