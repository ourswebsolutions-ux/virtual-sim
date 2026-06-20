'use client'

import React from 'react';

export default function About() {
  const steps = [
    {
      number: '01',
      title: 'Enter payment amount',
      description: 'Choose how much you want to send in USD. We ll show you the exact amount your recipient will receive in their local currency using the real-time mid-market exchange rate.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      number: '02',
      title: 'Complete secure checkout',
      description: 'Enter your card details in our encrypted payment form. All data is protected with bank-level 256-bit SSL encryption and never stored on our servers.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    },
    {
      number: '03',
      title: 'Funds are converted',
      description: 'We instantly convert your USD to the recipient s local currency at the current mid-market rate with zero markup. What you see is what they get.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      )
    },
    {
      number: '04',
      title: 'Receive local currency',
      description: 'Money arrives in the recipient s account in their local currency, usually within minutes. Track every step of your transfer in real-time.',
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
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            How AWPay works
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Simple, transparent international payments in four straightforward steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300"
            >
              {/* Step number badge */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">
                {step.number}
              </div>

              {/* Icon */}
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700 mb-4 ml-8">
                {step.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                {step.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional info */}
        <div className="mt-16 bg-white rounded-2xl border border-slate-200/60 p-8 sm:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Why choose AWPay?
            </h3>
            <p className="text-slate-600 leading-relaxed mb-8">
              Traditional banks charge hidden fees and give you poor exchange rates. We believe in radical transparency—you always see the real cost upfront, with no surprises. Our technology routes your money through the most efficient path, typically completing transfers in minutes rather than days. Join hundreds of thousands of people who've switched to a fairer way to send money internationally.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#checkout"
                className="px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors"
              >
                Try it now
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