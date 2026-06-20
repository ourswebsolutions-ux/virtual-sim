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
  const [user, setUser] = useState(null);
  const [showAccountPopup, setShowAccountPopup] = useState(false);
  const [activeTab, setActiveTab] = useState('Details');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showTopUpPopup, setShowTopUpPopup] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    setIsLoggedIn(!!token);

    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setShowAccountPopup(false);
    router.push('/');
  };

  const handlePasswordReset = () => {
    if (newPassword && newPassword === confirmPassword) {
      alert('Password reset successful!');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      alert('Passwords do not match!');
    }
  };

  const copyNumber = () => {
    navigator.clipboard.writeText('+92 321 7906064');
    alert('Number copied!');
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/923274236634', '_blank');
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
      <div className="w-full bg-[#06B6D4] text-white text-center py-2 text-sm sm:text-base font-medium">
        ✨ Need help? WhatsApp us at +92 321 7906064
      </div>

      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-slate-200/60">
        <nav className="max-w-7xl mx-auto px- sm:px-6 lg:px-8">
          <div className="flex justify-between  items-center h-24">
            <div className="flex-shrink-0 ">
              <a href="/" className="flex items-center space-x-2">
                <div className="w-40 h-28 flex items-sta justify-center">
                  <img src="./logo.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
              </a>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {!isLoggedIn ? (
                <>
                  <button onClick={() => setShowSignIn(true)} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Sign In</button>
                  <button onClick={() => setShowSignUp(true)} className="px-4 py-2 text-sm font-medium text-white bg-[#06B6D4] hover:bg-slate-800 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-slate-900/20">Get Started</button>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <div onClick={() => setShowTopUpPopup(true)} className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-white cursor-pointer hover:bg-slate-50">
                    <div>
                      <p className="text-[10px] text-slate-500 leading-none">Balance</p>
                      <p className="text-sm font-semibold text-slate-900">Rs. 0.00</p>
                    </div>
                    <button className="w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center text-lg font-bold hover:bg-green-700 transition">+</button>
                  </div>

                  <div onClick={() => setShowAccountPopup(!showAccountPopup)} className="w-10 h-10 rounded-full bg-[#06B6D4] text-white flex items-center justify-center font-semibold cursor-pointer relative" title={user?.fullName || 'Profile'}>
                    {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                </div>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900">
                <svg className="h-6 w-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden mt-2 space-y-2 bg-slate-50 rounded-lg p-4 shadow-lg">
              <a href="/" className="block text-sm font-medium text-slate-700">Check Out</a>
              <a href="/about" className="block text-sm font-medium text-slate-700">About</a>
              {!isLoggedIn ? (
                <>
                  <button onClick={() => setShowSignIn(true)} className="w-full text-left text-sm font-medium text-slate-600">Sign In</button>
                  <button onClick={() => setShowSignUp(true)} className="w-full mt-2 px-4 py-2 text-sm font-medium text-white bg-[#06B6D4] rounded-lg">Get Started</button>
                </>
              ) : (
                <>
                  <div onClick={() => {setMobileMenuOpen(false); setShowTopUpPopup(true);}} className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-3 py-2 cursor-pointer">
                    <div>
                      <p className="text-[10px] text-slate-500">Balance</p>
                      <p className="font-semibold">Rs. 0.00</p>
                    </div>
                    <button className="w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center">+</button>
                  </div>
                  <button onClick={handleLogout} className="w-full mt-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg">Logout</button>
                </>
              )}
            </div>
          )}
        </nav>
      </header>

      {/* Account Popup */}
      {showAccountPopup && isLoggedIn && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#06B6D4]/50" onClick={() => setShowAccountPopup(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-black">Account Settings</h2>
                  <p className="text-sm text-slate-500">Manage your profile and security preferences.</p>
                </div>
                <button onClick={() => setShowAccountPopup(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>

              <div className="flex border-b mb-6">
                <button onClick={() => setActiveTab('Details')} className={`px-4 py-2 font-medium ${activeTab === 'Details' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500'}`}>Details</button>
                <button onClick={() => setActiveTab('Security')} className={`px-4 py-2 font-medium ${activeTab === 'Security' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500'}`}>Security</button>
              </div>

              {activeTab === 'Details' && (
                <>
                  <div className="flex items-center gap-3 mb-6 bg-slate-50 p-4 rounded-xl">
                    <div className="w-12 h-12 rounded-full bg-[#06B6D4] text-white flex items-center justify-center text-2xl font-semibold">
                      {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-medium text-black">{user?.fullName || 'User'}</p>
                      <p className="text-sm text-slate-500">{user?.email}</p>
                    </div>
                  </div>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between"><span className="text-slate-500">Balance</span><span className="font-semibold text-green-600">Rs. 0.00</span></div>
                  </div>
                </>
              )}

              {activeTab === 'Security' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-500 mb-1">New Password</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600" placeholder="Enter new password" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-500 mb-1">Confirm New Password</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600" placeholder="Confirm new password" />
                  </div>
                  <button onClick={handlePasswordReset} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition">Reset Password</button>
                </div>
              )}
            </div>

            <div className="border-t p-4">
              <button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-medium transition">Sign Out</button>
            </div>
          </div>
        </div>
      )}

      {/* Top Up Popup */}
      {showTopUpPopup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#06B6D4]/50" onClick={() => setShowTopUpPopup(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl">💬</span>
              </div>
              <h2 className="text-2xl text-[#06B6D4] font-semibold mb-1">Top Up Your Account</h2>
              <p className="text-slate-500 mb-8">Contact us on WhatsApp to add balance</p>

              <div className="bg-slate-50 rounded-xl p-4 mb-8">
                <div className="text-xs text-slate-500 mb-1 text-left">WhatsApp Number:</div>
                <div className="flex items-center justify-between bg-white rounded-lg px-4 py-3 border">
                  <span className="font-medium text-black">+92 321 7906064</span>
                  <button onClick={copyNumber} className="text-slate-400 hover:text-slate-600">📋</button>
                </div>
              </div>

              <button onClick={openWhatsApp} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-2 hover:brightness-105 transition">
                💬 Open WhatsApp
              </button>

              <p className="text-xs text-slate-500 mt-6">Send a message with your account details to top up</p>
            </div>
            <button onClick={() => setShowTopUpPopup(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">✕</button>
          </div>
        </div>
      )}

      {showSignIn && <SignIn onClose={() => setShowSignIn(false)} onSwitchToSignUp={handleSwitchToSignUp} />}
      {showSignUp && <SignUp onClose={() => setShowSignUp(false)} setShowSignIn={setShowSignIn} onSwitchToSignIn={handleSwitchToSignIn} />}
    </>
  );
}