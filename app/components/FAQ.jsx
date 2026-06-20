'use client'
import React, { useState } from 'react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'How long does a transfer take?',
      answer: 'Most transfers are completed within minutes. In some cases, depending on the destination country and payment method, it may take up to 24 hours. You ll be able to track your transfer status in real-time.'
    },
    {
      question: 'What fees do you charge?',
      answer: 'We charge a small, transparent fee that varies by transfer amount and destination. The exact fee is always shown upfront before you confirm your payment. Unlike traditional banks, we never mark up the exchange rate—we always use the real mid-market rate.'
    },
    {
      question: 'Is my payment information secure?',
      answer: 'Absolutely. We use bank-level 256-bit SSL encryption to protect all transactions. We re PCI DSS Level 1 certified, the highest security standard in the payments industry. Your card details are never stored on our servers.'
    },
    {
      question: 'Which countries can I send money to?',
      answer: 'We support transfers to over 180 countries and territories worldwide. You can send to major currencies including EUR, GBP, CAD, AUD, JPY, and many more. Check our full list of supported countries during checkout.'
    },
    {
      question: 'What if there s a problem with my transfer?',
      answer: 'Our support team is available 24/7 to help you. If there s any issue with your transfer, we  ll notify you immediately and work to resolve it. You can always contact us through email, phone, or live chat.'
    },
    {
      question: 'Can I cancel or modify a transfer?',
      answer: 'Once a transfer is submitted, it s usually processed immediately. However, if it hasn t been completed yet, you may be able to cancel or modify it. Contact our support team as soon as possible if you need to make changes.'
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
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-slate-600">
            Find answers to common questions about our service
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4 mb-16">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-slate-50 border border-slate-200/60 rounded-xl overflow-hidden transition-all duration-200 hover:border-slate-300"
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
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 sm:p-12 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Still have questions?
          </h3>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Our support team is available 24/7 to help you with any questions or concerns
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@AWPay.com"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Support
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              WhatsApp
            </a>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-700">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left sm:text-center">
              <div>
                <p className="text-slate-400 text-sm mb-1">Email</p>
                <p className="text-white font-medium">support@AWPay.com</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Phone</p>
                <p className="text-white font-medium">+1 (800) 123-4567</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Hours</p>
                <p className="text-white font-medium">24/7 Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}