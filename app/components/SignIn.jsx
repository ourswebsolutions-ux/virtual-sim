import React, { useState } from 'react';
import { login } from "../../lib/api"; // adjust path
import { ShowError, ShowSuccess } from "@/lib/toast";
export default function SignIn({ onClose, onSwitchToSignUp }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [focused, setFocused] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
const [forgotEmail, setForgotEmail] = useState('');
const [forgotLoading, setForgotLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

    const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || 'Login failed');
            ShowError(data.message || "Login failed");

      return;
    }

    // ✅ save user
    localStorage.setItem('user', JSON.stringify(data.user));

    // (optional) fake token if you are not using JWT yet
    ShowSuccess("Login successful!");

    localStorage.setItem('token', 'logged-in');

    // close modal
    onClose();

    // reload UI
    window.location.reload();

  } catch (err) {
        ShowSuccess("Login successful!");

    console.error(err);
    setError('Something went wrong');
  } finally {
    setLoading(false);
  }
};

const handleForgotPassword = async () => {
  if (!formData.email) {
    ShowError("Please enter your email first");
    return;
  }

  try {
    const res = await fetch("/api/forgot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      ShowError(data.message || "Failed to send email");
      return;
    }

    ShowSuccess("Password sending in your email");
  } catch (err) {
    ShowError("Server error");
  }
};
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#06B6D4]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl transform transition-all">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="px-8 pt-8 pb-6 border-b border-slate-100">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-semibold">FX</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
            </div>
            <p className="text-slate-600">Sign in to your VNumHub account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  placeholder="you@example.com"
                  className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 rounded-xl transition-all duration-200 placeholder:text-slate-300 focus:outline-none ${
                    focused === 'email' 
                      ? 'border-slate-900 bg-white shadow-lg shadow-slate-900/5' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <button
  type="button"
  onClick={handleForgotPassword}
  className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
>
  Forgot?
</button>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  placeholder="Enter your password"
                  className={`w-full pl-12 pr-12 py-3.5 bg-slate-50 border-2 rounded-xl transition-all duration-200 placeholder:text-slate-300 focus:outline-none ${
                    focused === 'password' 
                      ? 'border-slate-900 bg-white shadow-lg shadow-slate-900/5' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
          
            {/* Submit button */}
            <button
              type="submit"
              className="w-full py-3.5 px-6 bg-[#06B6D4] hover:bg-slate-800 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-slate-900/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              Sign in
            </button>

            {/* Divider */}
            
            {/* Social login */}
            <div className="grid grid-cols-2 gap-3">
              
            </div>
          </form>

          {/* Footer */}
          <div className="px-8 pb-8 text-center">
            <p className="text-sm text-slate-600">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToSignUp}
                className="font-semibold text-slate-900 hover:text-slate-700 transition-colors"
              >
                Sign up for free
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}