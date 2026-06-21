"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPriceManager() {
  const router = useRouter();

  // Route protection authentication logic
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location = "/";
    }
  }, [router]);

  // --- STATE 1: PRICING CARD MANAGEMENT (STRICT EDIT TOGGLE) ---
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("UK");
  const [selectedPlatform, setSelectedPlatform] = useState("facebook");

  // Alag Alag prices database structures
  const [countryPrices, setCountryPrices] = useState({
    UK: "40",
    Canada: "50",
  });

  const [platformPrices, setPlatformPrices] = useState({
    facebook: "15",
    twitter: "10",
    reddit: "5",
  });

  // Temporary local states edit mode ke liye
  const [tempCountryPrice, setTempCountryPrice] = useState(countryPrices[selectedCountry]);
  const [tempPlatformPrice, setTempPlatformPrice] = useState(platformPrices[selectedPlatform]);

  // Sync temp values when selections shift naturally during view mode
  useEffect(() => {
    if (!isEditingPrice) {
      setTempCountryPrice(countryPrices[selectedCountry]);
      setTempPlatformPrice(platformPrices[selectedPlatform]);
    }
  }, [selectedCountry, selectedPlatform, countryPrices, platformPrices, isEditingPrice]);

  const handleSavePrice = () => {
    setCountryPrices((prev) => ({ ...prev, [selectedCountry]: tempCountryPrice }));
    setPlatformPrices((prev) => ({ ...prev, [selectedPlatform]: tempPlatformPrice }));
    setIsEditingPrice(false);
  };

  // --- STATE 2: API CONFIGURATION CARD ---
  const [isEditingApi, setIsEditingApi] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiConfig, setApiConfig] = useState({
    platformName: "SmsActivate Gateway",
    apiName: "Global_SMS_v4",
    apiKey: "61a938bc827d11ec9b550242ac130003",
  });
  const [tempApi, setTempApi] = useState({ ...apiConfig });

  const handleSaveApi = () => {
    setApiConfig({ ...tempApi });
    setIsEditingApi(false);
  };

  // --- STATE 3: EMERGENCY SYSTEM STOP CARD ---
  const [isGeneratingNumbers, setIsGeneratingNumbers] = useState(true);

  // Total calculated helper display
  const totalCalculated = (Number(countryPrices[selectedCountry]) || 0) + (Number(platformPrices[selectedPlatform]) || 0);

  return (
    <div className="min-h-screen bg-[#f8fafc] w-full pb-28 md:pb-12 selection:bg-blue-100">
      
      {/* Target Width aligned with HistoryView Layout */}
      <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6 animate-fadeIn">
        
        {/* Main Section Header Banner */}
        <div className="flex items-center gap-3 bg-white border border-slate-100 rounded-xl sm:rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.02)] mb-6">
          <div className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-md">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Admin Control Center</h2>
            <p className="text-slate-400 text-xs font-semibold">Manage worldwide virtual numbers prices and status</p>
          </div>
        </div>

        {/* ROW 1: EQUAL TOP CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
          
          {/* CARD 1: SPLIT PRICING CONTROLLER (STRICT HIDDEN DROPDOWNS) */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm relative group hover:border-blue-100 transition-all flex flex-col justify-between">
            <div>
              {/* Header inside card with Edit toggler */}
              <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pricing Matrix</span>
                
                <button
                  onClick={() => {
                    if (isEditingPrice) {
                      setTempCountryPrice(countryPrices[selectedCountry]);
                      setTempPlatformPrice(platformPrices[selectedPlatform]);
                    }
                    setIsEditingPrice(!isEditingPrice);
                  }}
                  className={`p-2 rounded-xl transition-all ${
                    isEditingPrice ? "bg-amber-50 text-amber-600 border border-amber-100" : "bg-slate-50 hover:bg-slate-100 text-slate-600"
                  }`}
                  title={isEditingPrice ? "Cancel Editing" : "Edit Settings"}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.3" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                  </svg>
                </button>
              </div>

              {/* Form Controls / Static Preview Panels */}
              <div className="space-y-4">
                
                {/* 1. Country Setting Section */}
                <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1">Country Base Price</label>
                  {isEditingPrice ? (
                    <div className="space-y-2 mt-1.5">
                      <div className="relative">
                        <select
                          value={selectedCountry}
                          onChange={(e) => setSelectedCountry(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none appearance-none cursor-pointer"
                        >
                          <option value="UK">🇬🇧 United Kingdom (UK)</option>
                          <option value="Canada">🇨🇦 Canada</option>
                        </select>
                        <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-slate-400">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-slate-500">Rs.</span>
                        <input
                          type="number"
                          value={tempCountryPrice}
                          onChange={(e) => setTempCountryPrice(e.target.value)}
                          className="w-full px-2 py-1.5 text-xs font-bold border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                        {selectedCountry === "UK" ? "🇬🇧" : "🇨🇦"} {selectedCountry === "UK" ? "United Kingdom" : "Canada"}
                      </span>
                      <span className="text-xs sm:text-sm font-black text-slate-700">Rs. {countryPrices[selectedCountry]}</span>
                    </div>
                  )}
                </div>

                {/* 2. Platform Setting Section */}
                <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1">Platform Service Fee</label>
                  {isEditingPrice ? (
                    <div className="space-y-2 mt-1.5">
                      <div className="relative">
                        <select
                          value={selectedPlatform}
                          onChange={(e) => setSelectedPlatform(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none appearance-none cursor-pointer"
                        >
                          <option value="facebook">Facebook App</option>
                          <option value="twitter">Twitter / X</option>
                          <option value="reddit">Reddit Forum</option>
                        </select>
                        <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-slate-400">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-slate-500">Rs.</span>
                        <input
                          type="number"
                          value={tempPlatformPrice}
                          onChange={(e) => setTempPlatformPrice(e.target.value)}
                          className="w-full px-2 py-1.5 text-xs font-bold border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs sm:text-sm font-bold text-slate-800 capitalize">
                        {selectedPlatform}
                      </span>
                      <span className="text-xs sm:text-sm font-black text-slate-700">Rs. {platformPrices[selectedPlatform]}</span>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Total Dynamic Display Box */}
            <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">End User Total Price</span>
                <span className="text-lg font-black text-blue-600 tracking-tight block mt-0.5">
                  Rs. {totalCalculated}
                </span>
              </div>

              {isEditingPrice && (
                <button
                  onClick={handleSavePrice}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-[0.98]"
                >
                  Save All Prices
                </button>
              )}
            </div>
          </div>

          {/* CARD 2: API CONNECTOR MANAGER */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm relative group hover:border-blue-100 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">API Connection</span>
                
                <button
                  onClick={() => {
                    if (isEditingApi) setTempApi({ ...apiConfig });
                    setIsEditingApi(!isEditingApi);
                  }}
                  className={`p-2 rounded-xl transition-all ${
                    isEditingApi ? "bg-amber-50 text-amber-600 border border-amber-100" : "bg-slate-50 hover:bg-slate-100 text-slate-600"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.3" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                  </svg>
                </button>
              </div>

              <div className="space-y-3.5">
                {/* Platform Name */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide">Platform Name</label>
                  {isEditingApi ? (
                    <input
                      type="text"
                      value={tempApi.platformName}
                      onChange={(e) => setTempApi({ ...tempApi, platformName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 mt-1 focus:outline-none"
                    />
                  ) : (
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 mt-0.5">{apiConfig.platformName}</p>
                  )}
                </div>

                {/* API Name */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide">API Gateway Title</label>
                  {isEditingApi ? (
                    <input
                      type="text"
                      value={tempApi.apiName}
                      onChange={(e) => setTempApi({ ...tempApi, apiName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 mt-1 focus:outline-none"
                    />
                  ) : (
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 mt-0.5">{apiConfig.apiName}</p>
                  )}
                </div>

                {/* API Key */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide">Secret API Key</label>
                  <div className="relative mt-1">
                    {isEditingApi ? (
                      <input
                        type="text"
                        value={tempApi.apiKey}
                        onChange={(e) => setTempApi({ ...tempApi, apiKey: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-2.5 pr-8 py-1.5 text-xs font-mono font-medium text-slate-700 focus:outline-none"
                      />
                    ) : (
                      <>
                        <p className="text-xs font-mono bg-slate-50 border border-slate-100 px-2.5 py-2 rounded-lg text-slate-600 truncate pr-10">
                          {showApiKey ? apiConfig.apiKey : "••••••••••••••••••••••••••••••••"}
                        </p>
                        <button
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          type="button"
                        >
                          {showApiKey ? (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 1-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {isEditingApi && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleSaveApi}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-[0.98]"
                >
                  Save API Config
                </button>
              </div>
            )}
          </div>

        </div>

        {/* ROW 2: CENTERED EMERGENCY SERVER CONTROLLER CARD */}
        <div className="flex justify-center w-full">
          <div className="w-full max-w-md bg-white border border-slate-100 rounded-2xl p-5 shadow-sm text-center relative overflow-hidden hover:border-red-100 transition-all">
            
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className={`w-2.5 h-2.5 rounded-full ${isGeneratingNumbers ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`}></span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                System Generator Status: {isGeneratingNumbers ? "Active" : "Paused"}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mb-1">
              Virtual Numbers Dispatcher
            </h3>
            <p className="text-slate-400 text-xs max-w-xs mx-auto leading-relaxed mb-5">
              Emergency kill-switch mechanism. Stopping this will halt all new real-time online virtual number pools allocations instantly.
            </p>

            <button
              onClick={() => setIsGeneratingNumbers(!isGeneratingNumbers)}
              className={`w-full py-3 px-4 font-bold rounded-xl transition-all text-xs sm:text-sm active:scale-[0.99] border ${
                isGeneratingNumbers
                  ? "bg-red-50 hover:bg-red-100 text-red-600 border-red-200/60 shadow-sm shadow-red-50"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white border-transparent shadow-md shadow-emerald-100"
              }`}
            >
              {isGeneratingNumbers ? (
                <div className="flex items-center justify-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z" /></svg>
                  <span>Stop Numbers Generation</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" /></svg>
                  <span>Resume Numbers Generation</span>
                </div>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}