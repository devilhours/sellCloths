import { Link, NavLink } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { FcExternal, FcPortraitMode, FcSettings, FcSms } from "react-icons/fc";
import { GiClothes } from "react-icons/gi";
import { useState, useEffect, useRef } from 'react';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa'; // Cart, Profile
import { IoSettingsSharp, IoLogOut } from 'react-icons/io5'; // Settings, Logout
import { CgMenuRight, CgClose } from 'react-icons/cg'; // Hamburger Menu Icons

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeLinkClass = 'text-emerald-400 font-semibold border-b-2 border-emerald-400';
  const inactiveLinkClass = 'text-gray-300 hover:text-white transition-colors';

  const navLinkStyle = ({ isActive }) => (isActive ? activeLinkClass : inactiveLinkClass);

  return (
    <header className="fixed w-full top-0 z-50 bg-gray-800/80 backdrop-blur-lg shadow-md">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo and Branding */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2 text-white">
              <div className="bg-emerald-500/20 p-2 rounded-full">
                <GiClothes className="h-6 w-6 text-emerald-400" />
              </div>
              <span className="text-xl font-bold">SellCloths</span>
            </Link>
          </div>

          {/* Desktop - Main Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <NavLink to="/" className={navLinkStyle}>All Products</NavLink>
            {authUser && (
              <>
                <NavLink to="/addproduct" className={navLinkStyle}>Add Product</NavLink>
                <NavLink to="/favorites" className={navLinkStyle}>Favorites</NavLink>
              </>
            )}
          </div>

          {/* Desktop - Right Side Actions */}
          <div className="hidden md:flex items-center gap-4">
            {authUser ? (
              <>
                <Link to="/cart" className="text-gray-300 hover:text-white p-2 rounded-full">
                  <FaShoppingCart className="w-5 h-5" />
                </Link>
                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="focus:outline-none">
                    {authUser.avatar ? (
                      <img src={authUser.avatar} alt="Profile" className="w-9 h-9 rounded-full object-cover" />
                    ) : (
                      <FaUserCircle className="w-8 h-8 text-gray-400" />
                    )}
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                      <Link to="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <FaUserCircle className="w-5 h-5"/> Profile
                      </Link>
                      <Link to="/settings" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <IoSettingsSharp className="w-5 h-5"/> Settings
                      </Link>
                      <button onClick={logout} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <IoLogOut className="w-5 h-5"/> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                <Link to="/signup" className="bg-emerald-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-600">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile - Hamburger Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-300 hover:text-white">
              {isMobileMenuOpen ? <CgClose size={28} /> : <CgMenuRight size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-800 pb-4">
            <div className="flex flex-col space-y-4 px-2 pt-2 pb-3">
              <NavLink to="/" className={navLinkStyle} onClick={() => setIsMobileMenuOpen(false)}>All Products</NavLink>
              {authUser ? (
                <>
                  <NavLink to="/addproduct" className={navLinkStyle} onClick={() => setIsMobileMenuOpen(false)}>Add Product</NavLink>
                  <NavLink to="/favorites" className={navLinkStyle} onClick={() => setIsMobileMenuOpen(false)}>Favorites</NavLink>
                  <NavLink to="/cart" className={navLinkStyle} onClick={() => setIsMobileMenuOpen(false)}>Cart</NavLink>
                  <div className="border-t border-gray-700 my-4" />
                  <Link to="/profile" className="text-gray-300 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link>
                  <Link to="/settings" className="text-gray-300 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>Settings</Link>
                  <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="text-left text-gray-300 hover:text-white">Logout</button>
                </>
              ) : (
                <>
                  <div className="border-t border-gray-700 my-4" />
                  <Link to="/login" className="bg-emerald-500 text-white block px-3 py-2 rounded-md text-base font-medium text-center" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                  <Link to="/signup" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;