"use client";

import React, { useState,useEffect } from "react";
import  { useRouter,router } from "next/navigation";
import HomeView from "../components/HomeView";
import ActiveNumbersView from "../components/ActiveNumbersView";
import HistoryView from "../components/HistoryView";
import MobileDock from "../components/MobileDock";
// Inline Custom SVGs (No NPM installations required)
const HomeIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
);
const PhoneIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.557-5.144-3.874-6.703-6.7l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
);
const HistoryIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
);
const ProfileIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
);

export default function Dashboard() {
  
  const [activeTab, setActiveTab] = useState("home");
useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location="/";
    }
  }, [router]);
  return (
    <div className="min-h-screen bg-[#f8fafc] w-full pb-28 md:pb-0">
      
      {/* 1. DESKTOP HEADER */}
      <div className="hidden md:block w-full bg-white border-b border-[#e2e8f0] shadow-sm">
        <div className="max-w-6xl mx-auto px- sm:px-6 lg:px-8">
          <div className="flex h-[72px] items-center justify-start gap-4">
            
            <button
              onClick={() => setActiveTab("home")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[14px] font-bold transition-all duration-200 ${
                activeTab === "home" ? "bg-[#edf4ff] text-[#1a56db] border border-[#cbdffb]" : "text-[#475569] hover:bg-[#f1f5f9] border border-transparent"
              }`}
            >
              <HomeIcon className="w-[18px] h-[18px]" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setActiveTab("active")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[14px] font-bold transition-all duration-200 ${
                activeTab === "active" ? "bg-[#edf4ff] text-[#1a56db] border border-[#cbdffb]" : "text-[#475569] hover:bg-[#f1f5f9] border border-transparent"
              }`}
            >
              <PhoneIcon className="w-[18px] h-[18px]" />
              <span>Active Numbers</span>
            </button>

            <button
              onClick={() => setActiveTab("history")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[14px] font-bold transition-all duration-200 ${
                activeTab === "history" ? "bg-[#edf4ff] text-[#1a56db] border border-[#cbdffb]" : "text-[#475569] hover:bg-[#f1f5f9] border border-transparent"
              }`}
            >
              <HistoryIcon className="w-[18px] h-[18px]" />
              <span>History</span>
            </button>

            
          </div>
        </div>
      </div>

      {/* 2. MOBILE DOCK */}
     <MobileDock activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Active View Switching */}
        {activeTab === "home" && <HomeView setActiveTab={setActiveTab} />}
        
        {/* Prop bilkul properly passed hai takay error na aye */}
        {activeTab === "active" && <ActiveNumbersView onBackToHome={() => setActiveTab("home")} setActiveTab={setActiveTab} />}

        {/* History view link kar diya hai */}
        {activeTab === "history" && <HistoryView />}
        
        {activeTab === "profile" && (
          <div className="rounded-2xl border border-dashed border-[#cbd5e1] bg-white p-8 text-center text-[#64748b]">
            <h1 className="text-xl font-bold text-[#1e293b]">Profile View Content</h1>
          </div>
        )}
      </main>

    </div>
  );
}