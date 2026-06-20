import React from 'react';

export default function Hero() {
  const scrollToCheckout = () => {
    document.getElementById('checkout')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <section className="relative pt-20 pb-16 sm:pt-28 sm:pb-20 overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl" />
        <div className="absolute top-60 -left-40 w-96 h-96 bg-slate-100/60 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Trust badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full mb-6 shadow-sm">
          <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-medium text-slate-700">Bank-level encryption</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-6">
          Pay in USD.
          <br />
          <span className="text-slate-600">Receive in your currency.</span>
        </h1>

        {/* Description */}
        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Send money internationally with transparent exchange rates and no hidden fees. 
          Your funds arrive in local currency, exactly when you expect them.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={scrollToCheckout}
            className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-slate-900/20 hover:scale-105"
          >
            Proceed to Checkout
          </button>
          <a
            href="/about"
            className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all duration-200 hover:shadow-lg"
          >
            How it works
          </a>
        </div>

        {/* Trust line */}
        <p className="mt-10 text-sm text-slate-500">
          Trusted by professionals in 180+ countries
        </p>
      </div>
    </section>
  );
}