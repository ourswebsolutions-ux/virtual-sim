'use client'

import React from 'react';

export default function About() {
  const steps = [
    {
      number: '01',
      title: 'Choose virtual number',
      description: 'Select a virtual SIM or phone number from your preferred country. We show you available numbers in real-time for SMS, OTP, and verification use.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      number: '02',
      title: 'Complete secure activation',
      description: 'Activate your virtual SIM instantly with secure checkout. All transactions are protected with encryption and your number is assigned immediately after payment.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    },
    {
      number: '03',
      title: 'Number gets activated',
      description: 'Your virtual number is instantly activated on our cloud system. You can now receive OTPs, SMS messages, and verification codes securely online.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      )
    },
    {
      number: '04',
      title: 'Receive SMS & OTP',
      description: 'Start receiving SMS, OTP codes, and verification messages instantly on your dashboard. Track all messages in real-time from anywhere in the world.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <section id="about" className="py-16 sm:py-24 bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2563EB] mb-4">
            How  VNumHub works
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Get instant virtual SIM numbers for OTP verification and global SMS receiving in four simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300"
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#06B6D4] text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">
                {step.number}
              </div>

              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700 mb-4 ml-8">
                {step.icon}
              </div>

              <h3 className="text-xl font-semibold text-[#2563EB] mb-3">
                {step.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-2xl border border-slate-200/60 p-8 sm:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-[#2563EB] mb-4" href="https://wa.me/923217906064">
              Why choose  VNumHub?
            </h3>
            <p className="text-slate-600 leading-relaxed mb-8">
              Traditional SIM cards and phone verification systems are slow and limited.  VNumHub provides instant virtual numbers for SMS, OTP verification, and online registrations. No physical SIM required, no waiting time—just instant access from anywhere in the world with full privacy and security.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/923217906064"
                className="px-6 py-3 bg-[#06B6D4] text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors"
              >
                Get Number Now
              </a>
              <a
                href="#help"
                className="px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
              >
                Learn more
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}