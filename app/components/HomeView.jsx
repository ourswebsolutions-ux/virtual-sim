"use client";

import React from "react";

export default function HomeView( setActiveTab ) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4 animate-fadeIn">
      
      {/* 1. Top Decorative Phone Icon Card */}
      <div className="relative w-36 h-36 bg-gradient-to-b from-white to-slate-50 rounded-3xl border border-slate-100 shadow-[0_12px_24px_rgba(0,0,0,0.03)] flex items-center justify-center mb-8">
        
        {/* Main Blue Phone Icon */}
        <svg
          className="w-16 h-16 text-[#2563eb]"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.557-5.144-3.874-6.703-6.7l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
          />
        </svg>

        {/* Big Yellow Star with Smooth Infinite Bouncing Effect */}
        <div className="absolute -top-4 -right-4 text-amber-400 animate-[bounce_2s_infinite]">
          <svg 
            className="w-11 h-11 fill-current filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)]" 
            viewBox="0 0 24 24"
          >
            <path d="M9.812 14.906L12 21.75l2.188-6.844L21 12.75l-6.812-2.156L12 3.75 9.812 10.594 3 12.75l6.812 2.156z" />
          </svg>
        </div>

      </div>

      {/* 2. Main Bold Headline */}
      <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
        Get a US number
      </h1>

      {/* 3. Subtitle with Blue Dots */}
      <div className="flex items-center gap-2 text-[#2563eb] font-semibold text-base sm:text-lg mb-6">
        <span className="w-1.5 h-1.5 bg-[#2563eb] rounded-full"></span>
        <span>Instant SMS Verification</span>
        <span className="w-1.5 h-1.5 bg-[#2563eb] rounded-full"></span>
      </div>

      {/* 4. Small Feature Pill Tokens */}
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-slate-400 text-xs sm:text-sm font-medium border border-slate-100 rounded-full px-5 py-2 bg-white shadow-sm mb-10">
        <span>Instant activation</span>
        <span className="text-slate-300">•</span>
        <span>Private and secure</span>
        <span className="text-slate-300">•</span>
        <span>Valid for 20 minutes</span>
      </div>

      {/* 5. Main Action Button with Price Tag Badge */}
      <button className="relative flex items-center justify-center gap-3 px-8 py-4 w-full max-w-[280px] bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 hover:opacity-95 active:scale-[0.98] transition-all group">
        {/* Plus Icon */}
        <svg
          className="w-5 h-5 stroke-[3]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        
        <span>Get Number</span>

        {/* Currency Price Badge Component */}
        <span className="bg-white/15 px-2 py-0.5 rounded-md text-xs font-semibold backdrop-blur-sm">
          Rs. 55
        </span>
      </button>

    </div>
  );
}