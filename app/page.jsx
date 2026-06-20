'use client'
import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import CheckoutForm from './components/CheckoutForm';
import TrustIndicators from './components/TrustIndicators';
import About from './components/About';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      <main>
        <Hero />
        <CheckoutForm />
        <TrustIndicators />
        
      </main>
    </div>
  );
}

export default App;