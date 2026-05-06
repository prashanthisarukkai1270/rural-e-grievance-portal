import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Landmark, Menu, X, User, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <nav className="bg-primary text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Landmark className="h-8 w-8 text-accent" />
            <span className="font-bold text-xl tracking-wide">Rural E-Grievance</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-accent font-medium text-sm lg:text-base transition-colors">{t('Home')}</Link>
            <Link to="/track" className="hover:text-accent font-medium text-sm lg:text-base transition-colors">{t('Track')}</Link>
            <Link to="/community" className="hover:text-accent font-medium text-sm lg:text-base transition-colors">{t('Community')}</Link>
            
            {user ? (
              <>
                {user.role === 'admin' ? (
                  <Link to="/admin" className="hover:text-accent font-medium text-sm lg:text-base transition-colors">{t('Admin Panel')}</Link>
                ) : (
                  <>
                    <Link to="/submit" className="hover:text-accent font-medium text-sm lg:text-base transition-colors">{t('Lodge New Grievance')}</Link>
                    <Link to="/dashboard" className="hover:text-accent font-medium text-sm lg:text-base transition-colors">{t('Dashboard')}</Link>
                  </>
                )}
                <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-blue-800">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">{user.name}</span>
                  </div>
                  <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded text-sm font-medium shadow-sm transition-colors">
                    {t('Logout')}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-blue-800">
                <Link to="/login" className="hover:text-accent font-medium text-sm lg:text-base transition-colors">{t('Login')}</Link>
                <Link to="/register" className="bg-white text-primary hover:bg-gray-100 px-4 py-2 rounded font-medium shadow-sm text-sm lg:text-base transition-colors">
                  {t('Register')}
                </Link>
              </div>
            )}
            
            {/* Language Selector */}
            <div className="flex items-center ml-2 border-l border-blue-800 pl-4">
              <Globe className="w-4 h-4 mr-1 text-gray-300" />
              <select 
                value={i18n.language} 
                onChange={changeLanguage}
                className="bg-primary text-white text-sm outline-none cursor-pointer border border-blue-800 rounded px-1 py-0.5"
              >
                <option value="en">English</option>
                <option value="ta">தமிழ்</option>
                <option value="hi">हिंदी</option>
              </select>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none p-2">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-primary pb-4 px-4 space-y-2 border-t border-blue-800">
          <Link to="/" onClick={() => setIsOpen(false)} className="block py-2 hover:text-accent">{t('Home')}</Link>
          <Link to="/track" onClick={() => setIsOpen(false)} className="block py-2 hover:text-accent">{t('Track')}</Link>
          <Link to="/community" onClick={() => setIsOpen(false)} className="block py-2 hover:text-accent">{t('Community')}</Link>
          
          {user ? (
            <>
              {user.role === 'admin' ? (
                <Link to="/admin" onClick={() => setIsOpen(false)} className="block py-2 hover:text-accent">{t('Admin Panel')}</Link>
              ) : (
                <>
                  <Link to="/submit" onClick={() => setIsOpen(false)} className="block py-2 hover:text-accent">{t('Lodge New Grievance')}</Link>
                  <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block py-2 hover:text-accent">{t('Dashboard')}</Link>
                </>
              )}
              <div className="pt-2 border-t border-blue-800 mt-2">
                <div className="py-2 text-gray-300">Signed in as <span className="text-white font-medium">{user.name}</span></div>
                <button onClick={handleLogout} className="w-full text-left py-2 text-red-400 font-medium hover:text-red-300">{t('Logout')}</button>
              </div>
            </>
          ) : (
            <div className="pt-2 border-t border-blue-800 flex flex-col space-y-2">
              <Link to="/login" onClick={() => setIsOpen(false)} className="block py-2 font-medium">{t('Login')}</Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="block py-2 text-accent font-medium">{t('Register')}</Link>
            </div>
          )}
          
          <div className="pt-2 border-t border-blue-800 flex items-center mt-2">
             <Globe className="w-4 h-4 mr-2 text-gray-300" />
             <select 
                value={i18n.language} 
                onChange={changeLanguage}
                className="bg-primary text-white text-sm outline-none cursor-pointer"
              >
                <option value="en">English</option>
                <option value="ta">தமிழ்</option>
                <option value="hi">हिंदी</option>
              </select>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
