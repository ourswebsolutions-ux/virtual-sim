"use client";

import React, { useState, useEffect } from "react";

type TabType = "home" | "active" | "history" | "profile";

interface MobileDockProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function MobileDock({ activeTab, setActiveTab }: MobileDockProps) {
  const [showAccountPopup, setShowAccountPopup] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeTabPopup, setActiveTabPopup] = useState('Details');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setShowAccountPopup(false);
    window.location.href = '/';
  };

  const handlePasswordReset = async () => {
    if (!newPassword || !confirmPassword) return alert("Please fill all fields");
    if (newPassword !== confirmPassword) return alert("Passwords do not match!");
    // add fetch logic here if needed
    alert("Password reset successful!");
    setNewPassword(""); setConfirmPassword("");
  };

  return (
    <>
      <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
        <div className="bg-[#f1f5f9]/95 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-[0_10px_25px_rgba(0,0,0,0.08)] h-16 px-2 relative">
          <div className="grid grid-cols-5 h-full items-center justify-items-center">
            <button onClick={() => setActiveTab("home")} className={`flex items-center justify-center w-full h-full ${activeTab === "home" ? "text-[#1a56db]" : "text-[#475569]"}`}>
              <HomeIcon className="w-6 h-6" />
            </button>
            <button onClick={() => setActiveTab("active")} className={`flex items-center justify-center w-full h-full ${activeTab === "active" ? "text-[#1a56db]" : "text-[#475569]"}`}>
              <PhoneIcon className="w-6 h-6" />
            </button>
            <div />
            <button onClick={() => setActiveTab("history")} className={`flex items-center justify-center w-full h-full ${activeTab === "history" ? "text-[#1a56db]" : "text-[#475569]"}`}>
              <HistoryIcon className="w-6 h-6" />
            </button>
            <button onClick={() => setShowAccountPopup(true)} className={`flex items-center justify-center w-full h-full ${activeTab === "profile" ? "text-[#1a56db]" : "text-[#475569]"}`}>
              <ProfileIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 top-0 -translate-y-1/2 w-36 h-36 pointer-events-none">
            <img src="./logo.png" className="w-full h-full object-contain drop-shadow-lg" />
          </div>
        </div>
      </div>

      {/* Profile Popup */}
      {showAccountPopup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#06B6D4]/50" onClick={() => setShowAccountPopup(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Account Settings</h2>
                  <p className="text-sm text-slate-500">Manage your profile</p>
                </div>
                <button onClick={() => setShowAccountPopup(false)}>✕</button>
              </div>

              <div className="flex border-b mb-6">
                <button onClick={() => setActiveTabPopup('Details')} className={`px-4 py-2 ${activeTabPopup === 'Details' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500'}`}>Details</button>
                <button onClick={() => setActiveTabPopup('Security')} className={`px-4 py-2 ${activeTabPopup === 'Security' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500'}`}>Security</button>
              </div>

              {activeTabPopup === 'Details' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl">
                    <div className="w-12 h-12 rounded-full bg-[#06B6D4] text-white flex items-center justify-center text-2xl font-semibold">
                      {user?.fullName?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-medium">{user?.fullName}</p>
                      <p className="text-sm text-slate-500">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex justify-between"><span className="text-slate-500">Balance</span><span className="font-semibold text-green-600">Rs. 0.00</span></div>
                </div>
              )}

              {activeTabPopup === 'Security' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-500 mb-1">New Password</label>
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full px-4 py-3 border rounded-xl" placeholder="New password" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-500 mb-1">Confirm Password</label>
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 border rounded-xl" placeholder="Confirm password" />
                  </div>
                  <button onClick={handlePasswordReset} className="w-full bg-blue-600 text-white py-3 rounded-xl">Reset Password</button>
                </div>
              )}
            </div>

            <div className="border-t p-4">
              <button onClick={handleLogout} className="w-full bg-red-600 text-white py-3 rounded-xl">Sign Out</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Icons (add these)
const HomeIcon = (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>;
const PhoneIcon = (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.557-5.144-3.874-6.703-6.7l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>;
const HistoryIcon = (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
const ProfileIcon = (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>;