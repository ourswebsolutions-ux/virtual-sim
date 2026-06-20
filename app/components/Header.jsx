'use client';
import React, { useState, useEffect } from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/');
  };

  const handleSwitchToSignUp = () => {
    setShowSignIn(false);
    setShowSignUp(true);
  };

  const handleSwitchToSignIn = () => {
    setShowSignUp(false);
    setShowSignIn(true);
  };

  return (
    <>
      {/* TOP WHATSAPP BAR */}
      <div className="w-full bg-slate-900 text-white text-center py-2 text-sm sm:text-base font-medium">
        ✨ Need help? WhatsApp us at 03274236634
      </div>

      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-slate-200/60">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* NAVBAR (taller now) */}
          <div className="flex justify-between items-center h-24">

            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="/" className="flex items-center space-x-2">
                <div className="w-56 h-28 flex items-center justify-center">
                  <img
                    src="./logo.png"
                    alt="Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              </a>
            </div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {!isLoggedIn ? (
                <>
                  <button
                    onClick={() => setShowSignIn(true)}
                    className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    Sign In
                  </button>

                  <button
                    onClick={() => setShowSignUp(true)}
                    className="px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-slate-900/20"
                  >
                    Get Started
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-200"
                >
                  Logout
                </button>
              )}
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <svg
                  className="h-6 w-6 text-slate-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {mobileMenuOpen ? (
                    <path d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-2 space-y-2 bg-slate-50 rounded-lg p-4 shadow-lg">
              <a href="/" className="block text-sm font-medium text-slate-700">
                Check Out
              </a>
              <a href="/about" className="block text-sm font-medium text-slate-700">
                About
              </a>

              {!isLoggedIn ? (
                <>
                  <button
                    onClick={() => setShowSignIn(true)}
                    className="w-full text-left text-sm font-medium text-slate-600"
                  >
                    Sign In
                  </button>

                  <button
                    onClick={() => setShowSignUp(true)}
                    className="w-full mt-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg"
                  >
                    Get Started
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="w-full mt-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg"
                >
                  Logout
                </button>
              )}
            </div>
          )}

        </nav>
      </header>

      {/* Modals */}
      {showSignIn && (
        <SignIn
          onClose={() => setShowSignIn(false)}
          onSwitchToSignUp={handleSwitchToSignUp}
        />
      )}

      {showSignUp && (
        <SignUp
          onClose={() => setShowSignUp(false)}
          setShowSignIn={setShowSignIn}
          onSwitchToSignIn={handleSwitchToSignIn}
        />
      )}
    </>
  );
}