'use client'
import React, { useState } from 'react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'How long does it take to activate a virtual SIM?',
      answer: 'Most virtual numbers are activated instantly after payment. In rare cases, it may take a few minutes depending on server load or country availability.'
    },
    {
      question: 'What can I use a virtual number for?',
      answer: 'You can use virtual numbers for SMS verification, OTP receiving, WhatsApp verification, Telegram, social media accounts, and online registrations.'
    },
    {
      question: 'Is my virtual number secure and private?',
      answer: 'Yes. All virtual numbers are secured with encrypted systems. Only you can access SMS and OTP messages from your dashboard.'
    },
    {
      question: 'Which countries are supported?',
      answer: 'We provide virtual numbers from multiple countries including USA, UK, Canada, Germany, France, and many more depending on availability.'
    },
    {
      question: 'What happens if SMS does not arrive?',
      answer: 'If an SMS or OTP does not arrive, you can refresh your inbox or contact support. In some cases, the service you are verifying may block virtual numbers.'
    },
    {
      question: 'Can I reuse or extend my virtual number?',
      answer: 'Yes, you can renew or extend your virtual number subscription depending on the plan. Some numbers also support long-term usage.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="help" className="py-16 sm:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#06B6D4] mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-slate-600">
            Everything you need to know about VNumHub virtual SIM services
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4 mb-16">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-slate-50 border border-slate-200/60 rounded-xl overflow-hidden transition-all duration-200 hover:border-[#2563EB]"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none"
              >
                <span className="text-lg font-semibold text-slate-900 pr-8">
                  {faq.question}
                </span>
                <svg
                  className={`w-5 h-5 text-slate-500 flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-5 text-slate-600 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="bg-[#06B6D4] rounded-2xl p-8 sm:p-12 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Still need help?
          </h3>
          <p className=" mb-8 max-w-2xl mx-auto">
            Our support team is available 24/7 to help you with virtual SIM activation, OTP issues, or account questions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
  href="https://wa.me/923242537429"
  target="_blank"
  className="inline-flex items-center justify-center px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
>
  WhatsApp Support
</a>
          </div>

          <div className="mt-8 pt-8 border-t border-[#2563EB]">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left sm:text-center">
              <div>
                <p className="text-sl text-sm mb-1">Email</p>
                <p className="text-white font-medium">support@vnumhub.com</p>
              </div>
                              <div>
                <p className="text-slat400 text-sm mb-1">Service</p>
                <p className="text-white font-medium">Virtual SIM & OTP</p>
              </div>
              <div>
                <p className="text-slae-400 text-sm mb-1">Availability</p>
                <p className="text-white font-medium">24/7 Support</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}