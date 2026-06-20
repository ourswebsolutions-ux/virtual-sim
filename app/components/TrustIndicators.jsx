import React from 'react';

export default function TrustIndicators() {
  const indicators = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: 'Bank-Level Security',
      description: '256-bit SSL encryption protects every transaction'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'PCI DSS Compliant',
      description: 'Certified to the highest payment security standards'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Real Exchange Rates',
      description: 'Always get the mid-market rate with no markup'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Instant Processing',
      description: 'Most transfers complete within minutes, not days'
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            Built on trust and transparency
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Your security and peace of mind are our highest priorities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {indicators.map((indicator, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-xl bg-slate-50 border border-slate-200/60 hover:border-slate-300 hover:shadow-lg transition-all duration-200"
            >
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white mb-4">
                {indicator.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {indicator.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {indicator.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional trust signals */}
        <div className="mt-16 pt-12 border-t border-slate-200">
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 opacity-60">
            <div className="text-center">
              <p className="text-3xl font-bold text-slate-900">$2.5B+</p>
              <p className="text-sm text-slate-600 mt-1">Transferred annually</p>
            </div>
            <div className="hidden sm:block w-px h-12 bg-slate-300" />
            <div className="text-center">
              <p className="text-3xl font-bold text-slate-900">180+</p>
              <p className="text-sm text-slate-600 mt-1">Countries supported</p>
            </div>
            <div className="hidden sm:block w-px h-12 bg-slate-300" />
            <div className="text-center">
              <p className="text-3xl font-bold text-slate-900">500K+</p>
              <p className="text-sm text-slate-600 mt-1">Active users</p>
            </div>
            <div className="hidden sm:block w-px h-12 bg-slate-300" />
            <div className="text-center">
              <p className="text-3xl font-bold text-slate-900">99.9%</p>
              <p className="text-sm text-slate-600 mt-1">Uptime guarantee</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}