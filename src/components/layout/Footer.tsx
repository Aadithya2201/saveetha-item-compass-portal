
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="text-xl font-bold text-college">Saveetha Item Compass</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Lost and Found Portal for Saveetha Engineering College
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                Navigation
              </h3>
              <div className="mt-4 space-y-2">
                <Link to="/dashboard" className="text-sm text-gray-600 dark:text-gray-400 hover:text-college block">
                  Dashboard
                </Link>
                <Link to="/items" className="text-sm text-gray-600 dark:text-gray-400 hover:text-college block">
                  All Items
                </Link>
                <Link to="/items/normal" className="text-sm text-gray-600 dark:text-gray-400 hover:text-college block">
                  Normal Items
                </Link>
                <Link to="/items/emergency" className="text-sm text-gray-600 dark:text-gray-400 hover:text-college block">
                  Emergency Items
                </Link>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                Account
              </h3>
              <div className="mt-4 space-y-2">
                <Link to="/login" className="text-sm text-gray-600 dark:text-gray-400 hover:text-college block">
                  Login
                </Link>
                <Link to="/register" className="text-sm text-gray-600 dark:text-gray-400 hover:text-college block">
                  Register
                </Link>
                <Link to="/my-items" className="text-sm text-gray-600 dark:text-gray-400 hover:text-college block">
                  My Items
                </Link>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                Help
              </h3>
              <div className="mt-4 space-y-2">
                <Link to="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-college block">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-8 md:flex md:items-center md:justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            &copy; {currentYear} Saveetha Item Compass. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Saveetha Engineering College
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
