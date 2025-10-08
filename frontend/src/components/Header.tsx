import { useState, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, BookOpen, LogOut, User, PlusCircle } from 'lucide-react';
import { StoreContext } from '../store';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const storeContext = useContext(StoreContext);
  const token = storeContext?.token;

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative font-medium text-gray-600 transition-colors duration-300 hover:text-blue-500 ${
      isActive ? 'text-blue-600' : ''
    } after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-full after:scale-x-0 after:bg-blue-500 after:transition-transform after:duration-300 after:origin-left hover:after:scale-x-100 ${
      isActive ? 'after:scale-x-100' : ''
    }`;

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-800">
            <Link to="/" onClick={handleLinkClick} className="flex items-center space-x-2">
              <svg
                className="h-8 w-8 text-blue-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <span className="text-2xl font-semibold text-gray-800 tracking-tight">BlogVerse</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className={navLinkClass}>
              Blogs
            </NavLink>
            {token && (
              <NavLink to="/myblogs" className={navLinkClass}>
                My Blogs
              </NavLink>
            )}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {!token ? (
              <>
                <Link to="/login" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300 shadow-sm hover:shadow-md"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/create"
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                >
                  <PlusCircle className="h-5 w-5" />
                  <span>New Post</span>
                </Link>
                <button
                  onClick={() => {
                    storeContext?.setToken(null);
                    storeContext?.setUser(null);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                  }}
                  className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors duration-300"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden mt-6">
            <nav className="flex flex-col space-y-4">
              <NavLink to="/" className={navLinkClass} onClick={handleLinkClick}>
                Blogs
              </NavLink>
              {token && (
                <NavLink to="/myblogs" className={navLinkClass} onClick={handleLinkClick}>
                  My Blogs
                </NavLink>
              )}
              <hr className="my-2 border-gray-200" />
              {!token ? (
                <>
                  <Link to="/login" className="text-gray-600 hover:text-blue-600 py-2" onClick={handleLinkClick}>
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-blue-600 text-white text-center px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
                    onClick={handleLinkClick}
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <div className="flex flex-col space-y-4">
                  <Link
                    to="/create"
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                    onClick={handleLinkClick}
                  >
                    <PlusCircle className="h-5 w-5" />
                    <span>New Post</span>
                  </Link>
                  <button
                    onClick={() => {
                      storeContext?.setToken(null);
                      storeContext?.setUser(null);
                      localStorage.removeItem('token');
                      localStorage.removeItem('user');
                      handleLinkClick();
                    }}
                    className="flex items-center space-x-2 text-red-600"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;