'use client'
import React, { useState } from 'react';

export default function CheckoutForm() {
  const [formData, setFormData] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    amount: ''
  });

  const [focused, setFocused] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) return;
    }

    // Format expiry date
    if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
      }
      if (formattedValue.length > 5) return;
    }

    // Format CVV (3-4 digits)
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 4) return;
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Payment submitted:', formData);
    alert('Payment processing... (Demo mode)');
  };

  // Calculate approximate local currency amount (demo)
  const calculateLocalAmount = () => {
    if (!formData.amount) return null;
    const rate = 1.12; // Example EUR rate
    return (parseFloat(formData.amount) * rate).toFixed(2);
  };

  return (
    <section id="checkout" className="py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            Complete your payment
          </h2>
          <p className="text-slate-600">
            All transactions are secure and encrypted
          </p>
        </div>

        {/* Checkout card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/60 overflow-hidden">
          {/* Card header */}
          <div className="px-6 sm:px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#06B6D4] rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Payment Details</h3>
                  <p className="text-sm text-slate-500">Enter your card information</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-6" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Amount field (first) */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Amount (USD)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg font-medium">$</span>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  onFocus={() => setFocused('amount')}
                  onBlur={() => setFocused(null)}
                  placeholder="0.00"
                  step="0.01"
                  className={`w-full pl-10 pr-4 py-4 text-lg font-medium bg-slate-50 border-2 rounded-xl transition-all duration-200 placeholder:text-slate-300 focus:outline-none ${
                    focused === 'amount' 
                      ? 'border-slate-900 bg-white shadow-lg shadow-slate-900/5' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  required
                />
              </div>
              {formData.amount && calculateLocalAmount() && (
                <p className="mt-2 text-sm text-slate-500 flex items-center">
                  <svg className="w-4 h-4 mr-1.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  You'll receive approximately €{calculateLocalAmount()} in your local currency
                </p>
              )}
            </div>

            {/* Cardholder Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                name="cardholderName"
                value={formData.cardholderName}
                onChange={handleChange}
                onFocus={() => setFocused('cardholderName')}
                onBlur={() => setFocused(null)}
                placeholder="John Doe"
                className={`w-full px-4 py-4 bg-slate-50 border-2 rounded-xl transition-all duration-200 placeholder:text-slate-300 focus:outline-none ${
                  focused === 'cardholderName' 
                    ? 'border-slate-900 bg-white shadow-lg shadow-slate-900/5' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                required
              />
            </div>

            {/* Card Number */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Card Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  onFocus={() => setFocused('cardNumber')}
                  onBlur={() => setFocused(null)}
                  placeholder="1234 5678 9012 3456"
                  className={`w-full px-4 py-4 bg-slate-50 border-2 rounded-xl transition-all duration-200 placeholder:text-slate-300 focus:outline-none font-mono tracking-wider ${
                    focused === 'cardNumber' 
                      ? 'border-slate-900 bg-white shadow-lg shadow-slate-900/5' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  required
                />
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
            </div>

            {/* Expiry & CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  onFocus={() => setFocused('expiryDate')}
                  onBlur={() => setFocused(null)}
                  placeholder="MM/YY"
                  className={`w-full px-4 py-4 bg-slate-50 border-2 rounded-xl transition-all duration-200 placeholder:text-slate-300 focus:outline-none font-mono ${
                    focused === 'expiryDate' 
                      ? 'border-slate-900 bg-white shadow-lg shadow-slate-900/5' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                  CVV
                  <span className="ml-1.5 text-slate-400" title="3 or 4 digit security code">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </span>
                </label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  onFocus={() => setFocused('cvv')}
                  onBlur={() => setFocused(null)}
                  placeholder="123"
                  className={`w-full px-4 py-4 bg-slate-50 border-2 rounded-xl transition-all duration-200 placeholder:text-slate-300 focus:outline-none font-mono ${
                    focused === 'cvv' 
                      ? 'border-slate-900 bg-white shadow-lg shadow-slate-900/5' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  required
                />
              </div>
            </div>

            {/* Security notice */}
            <div className="flex items-start space-x-3 p-4 bg-emerald-50 border border-emerald-200/60 rounded-xl">
              <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-medium text-emerald-900">Secure Payment</p>
                <p className="text-sm text-emerald-700 mt-0.5">
                  Your card details are encrypted and never stored on our servers
                </p>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full py-4 px-6 bg-[#06B6D4] hover:bg-slate-800 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-slate-900/20 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Complete Payment</span>
            </button>
          </form>
        </div>

        {/* Footer trust text */}
        <p className="text-center text-sm text-slate-500 mt-6">
          By confirming your payment, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </section>
  );
}