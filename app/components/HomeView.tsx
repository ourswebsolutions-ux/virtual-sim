"use client";

import React, { useState, useEffect } from "react";
import { ShowError, ShowSuccess } from "@/lib/toast";

const countries = [
  { name: "United States", flag: "🇺🇸", code: "0" },
  { name: "Canada", flag: "🇨🇦", code: "1" }
];

const services = [
  { name: "Facebook", code: "fb" },
  { name: "Twitter", code: "tw" },
  { name: "Rabbit", code: "ra" }
];

export default function HomeView({ setActiveTab = () => { } }: any) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [selectedService, setSelectedService] = useState(services[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [price, setPrice] = useState("");
  const [userData, setUserData] = useState(null);
  const [showTopUpPopup, setShowTopUpPopup] = useState(false);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        if (!user?.id) return;

        const res = await fetch(`/api/user-data?userId=${user.id}`);
        const data = await res.json();
        //  console.log(data,"dffs")
        if (data.success) {
          setUserData(data.user);
        }
      } catch (error) {
        console.error(error);
        ShowError("Failed to load user data");
      }
    };

    fetchUser();
  }, []);


  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch("/api/price");
        const data = await res.json();
        console.log(data)
        if (data.success) {
          setPrice(data.price);
        }
      } catch (error) {
        console.error("Failed to fetch price", error);
        ShowError("Failed to load price");
      }
    };

    fetchPrice();
  }, []);

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText("+923217906064");
      ShowSuccess("WhatsApp number copied");
    } catch {
      ShowError("Failed to copy number");
    }
  };

  const openWhatsApp = () => {
    window.open(
      "https://wa.me/923217906064",
      "_blank"
    );
  };

  const handleGetNumber = async () => {
    setLoading(true);
    setError("");

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");


      const userId = user?.id;

      const res = await fetch("/api/create-number", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          service: selectedService.code,
          country: selectedCountry.code,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to get number");
      ShowSuccess("Number generated successfully");
      setModalOpen(false);
    } catch (err: any) {
      const message = err.message || "Something went wrong";
      setError(message);
      ShowError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4 animate-fadeIn">
      {/* Existing UI - unchanged */}
      <div className="relative w-36 h-36 bg-gradient-to-b from-white to-slate-50 rounded-3xl border border-slate-100 shadow-[0_12px_24px_rgba(0,0,0,0.03)] flex items-center justify-center mb-8">
        <svg className="w-16 h-16 text-[#2563eb]" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.557-5.144-3.874-6.703-6.7l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
        </svg>
        <div className="absolute -top-4 -right-4 text-amber-400 animate-[bounce_2s_infinite]">
          <svg className="w-11 h-11 fill-current filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)]" viewBox="0 0 24 24">
            <path d="M9.812 14.906L12 21.75l2.188-6.844L21 12.75l-6.812-2.156L12 3.75 9.812 10.594 3 12.75l6.812 2.156z" />
          </svg>
        </div>
      </div>

      <h1 className="text-4xl sm:text-5xl font-black text-[#0F172A] tracking-tight mb-4">Get a US number</h1>
      <div className="flex items-center gap-2 text-[#2563eb] font-semibold text-base sm:text-lg mb-6">
        <span className="w-1.5 h-1.5 bg-[#2563eb] rounded-full"></span>
        <span>Instant SMS Verification</span>
        <span className="w-1.5 h-1.5 bg-[#2563eb] rounded-full"></span>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-slate-400 text-xs sm:text-sm font-medium border border-slate-100 rounded-full px-5 py-2 bg-white shadow-sm mb-10">
        <span>Instant activation</span>
        <span className="text-slate-300">•</span>
        <span>Private and secure</span>
        <span className="text-slate-300">•</span>
        <span>Valid for 3 minutes</span>
      </div>

      <button
        onClick={() => {
          const balance = Number(userData?.balance || 0);
          // const balance = Number(55);

          const currentPrice = Number(price || 0);

          if (balance < currentPrice) {

            ShowError("Insufficient balance");
            setShowTopUpPopup(true);
            return;
          }

          setModalOpen(true);
        }}
        className="relative flex items-center justify-center gap-3 px-8 py-4 w-full max-w-[280px] bg-gradient-to-r from-[#2563EB] to-[#2563EB] text-white font-bold rounded-2xl shadow-lg shadow-[#2563EB]/20 hover:opacity-95 active:scale-[0.98] transition-all group"
      >
        <svg className="w-5 h-5 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <span>Get Number</span>
        <span className="bg-white/15 px-2 py-0.5 rounded-md text-xs font-semibold backdrop-blur-sm">
          Rs. {price}
        </span>
      </button>

      {/* Modal - Updated with new color scheme */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md mx-4 shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-center text-[#0F172A]">Get Virtual Number</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-[#0F172A]">Country</label>
              <select
                value={selectedCountry.code}
                onChange={(e) => setSelectedCountry(countries.find(c => c.code === e.target.value)!)}
                className="w-full p-3 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#2563EB] text-[#0F172A]"
              >
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-[#0F172A]">Service</label>
              <select
                value={selectedService.code}
                onChange={(e) => setSelectedService(services.find(s => s.code === e.target.value)!)}
                className="w-full p-3 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#2563EB] text-[#0F172A]"
              >
                {services.map((s) => (
                  <option key={s.code} value={s.code}>{s.name}</option>
                ))}
              </select>
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <div className="flex gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 rounded-2xl font-medium text-[#0F172A]"
              >
                Cancel
              </button>
              <button
                onClick={handleGetNumber}
                disabled={loading}
                className="flex-1 py-3 bg-[#2563EB] hover:bg-[#1e53c0] text-white rounded-2xl font-bold disabled:opacity-70 transition-colors"
              >
                {loading ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showTopUpPopup && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[#06B6D4]/50"
          onClick={() => setShowTopUpPopup(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl">💬</span>
              </div>

              <h2 className="text-2xl text-[#06B6D4] font-semibold mb-1">
                Top Up Your Account
              </h2>

              <p className="text-slate-500 mb-8">
                Your balance is insufficient. Contact us on WhatsApp to add balance.
              </p>

              <div className="bg-slate-50 rounded-xl p-4 mb-8">
                <div className="text-xs text-slate-500 mb-1 text-left">
                  WhatsApp Number:
                </div>

                <div className="flex items-center justify-between bg-white rounded-lg px-4 py-3 border">
                  <span className="font-medium text-black">
                    +92 321 7906064
                  </span>

                  <button
                    onClick={copyNumber}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    📋
                  </button>
                </div>
              </div>

              <button
                onClick={openWhatsApp}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-2"
              >
                💬 Open WhatsApp
              </button>

              <p className="text-xs text-slate-500 mt-6">
                Send a message with your account details to top up
              </p>
            </div>

            <button
              onClick={() => setShowTopUpPopup(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}