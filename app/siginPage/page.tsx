'use client';

import React from 'react';
import { LuUser, LuMail, LuLock, LuUserPlus, LuMoveRight } from 'react-icons/lu';

export default function SignupPage() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafd] relative overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      {/* Background Soft Gradients to match the screenshot aura */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-purple-200/40 to-blue-200/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-100/40 to-purple-200/30 blur-3xl pointer-events-none" />

      {/* Main Container Card */}
      <div className="relative w-full max-w-[480px] bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100/50 p-8 sm:p-10 md:p-12 transition-all duration-300 z-10">
        
        {/* Header / Logo Icon */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-[64px] h-[64px] flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#6366f1] via-[#7c3aed] to-[#a855f7] shadow-[0_10px_25px_rgba(124,58,237,0.3)] text-white mb-5">
            <LuUserPlus className="w-7 h-7" />
          </div>
          <h1 className="text-[28px] font-bold text-[#111827] tracking-tight mb-2">
            Create Account
          </h1>
          <p className="text-[14px] text-[#6b7280] font-medium max-w-[280px]">
            Join us to start verifying numbers instantly
          </p>
        </div>

        {/* Form Elements */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name Input */}
          <div className="space-y-2">
            <label className="block text-[13px] font-semibold text-[#374151] tracking-wide">
              Full Name
            </label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none transition-colors group-focus-within:text-[#7c3aed]">
                <LuUser className="w-5 h-5" />
              </span>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full text-[14px] text-[#111827] bg-white placeholder-gray-400 pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 transition-all focus:outline-none focus:border-[#7c3aed] focus:ring-4 focus:ring-purple-500/10"
                required
              />
            </div>
          </div>

          {/* Email Address Input */}
          <div className="space-y-2">
            <label className="block text-[13px] font-semibold text-[#374151] tracking-wide">
              Email Address
            </label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none transition-colors group-focus-within:text-[#7c3aed]">
                <LuMail className="w-5 h-5" />
              </span>
              <input
                type="email"
                placeholder="john@example.com"
                className="w-full text-[14px] text-[#111827] bg-white placeholder-gray-400 pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 transition-all focus:outline-none focus:border-[#7c3aed] focus:ring-4 focus:ring-purple-500/10"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="block text-[13px] font-semibold text-[#374151] tracking-wide">
              Password
            </label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none transition-colors group-focus-within:text-[#7c3aed]">
                <LuLock className="w-5 h-5" />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full text-[14px] text-[#111827] bg-white placeholder-gray-400 pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 transition-all focus:outline-none focus:border-[#7c3aed] focus:ring-4 focus:ring-purple-500/10 tracking-widest"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-[#4f46e5] via-[#7c3aed] to-[#9333ea] text-white font-semibold text-[15px] rounded-xl hover:opacity-95 shadow-[0_4px_20px_rgba(124,58,237,0.25)] transition-all transform active:scale-[0.98]"
          >
            Sign Up
            <LuMoveRight className="w-4 h-4 mt-0.5" />
          </button>
        </form>

        {/* Divider Line */}
        <div className="w-full h-[1px] bg-gray-100 my-6" />

        {/* Footer / Redirect Link */}
        <div className="text-center">
          <p className="text-[14px] text-[#4b5563] font-medium">
            Already have an account?{' '}
            <a
              href="#login"
              className="text-[#4f46e5] font-semibold hover:text-[#7c3aed] transition-colors ml-1"
            >
              Log in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}