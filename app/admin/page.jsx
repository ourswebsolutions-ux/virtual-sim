"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShowError, ShowSuccess } from "@/lib/toast";

export default function AdminPriceManager() {
  const router = useRouter();

  // Route protection authentication logic
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location = "/";
    }
  }, [router]);

  // ========================================================
  // 🚫 COMMITTED / COMMENTED OUT: OLD PRICING LOGIC (CARD 1 OLD)
  // ========================================================
  /*
  const [selectedCountry, setSelectedCountry] = useState("UK");
  const [selectedPlatform, setSelectedPlatform] = useState("facebook");

  const [countryPrices, setCountryPrices] = useState({
    UK: "40",
    Canada: "50",
  });

  const [platformPrices, setPlatformPrices] = useState({
    facebook: "15",
    twitter: "10",
    reddit: "5",
  });

  const [tempCountryPrice, setTempCountryPrice] = useState(countryPrices[selectedCountry]);
  const [tempPlatformPrice, setTempPlatformPrice] = useState(platformPrices[selectedPlatform]);

  useEffect(() => {
    if (!isEditingPrice) {
      setTempCountryPrice(countryPrices[selectedCountry]);
      setTempPlatformPrice(platformPrices[selectedPlatform]);
    }
  }, [selectedCountry, selectedPlatform, countryPrices, platformPrices, isEditingPrice]);

  const totalCalculated = (Number(countryPrices[selectedCountry]) || 0) + (Number(platformPrices[selectedPlatform]) || 0);
  */
  // ========================================================


  // ========================================================
  // 🚫 COMMITTED / COMMENTED OUT: EMERGENCY SYSTEM STOP LOGIC (CARD 3 OLD)
  // ========================================================
  /*
  const [isGeneratingNumbers, setIsGeneratingNumbers] = useState(true);
  */
  // ========================================================


  // --- STATE 1: NEW SIMPLIFIED PRICING CARD MANAGEMENT ---
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [globalPrice, setGlobalPrice] = useState("50"); // Main absolute system price
  const [tempPrice, setTempPrice] = useState(globalPrice);
const [isSavingPrice, setIsSavingPrice] = useState(false); // ← ADD THIS LINE

  // ← ADD THIS HOOK
  useEffect(() => {
    const fetchCurrentPrice = async () => {
      try {
        const res = await fetch("/api/update-price", { method: "GET" });
        const data = await res.json();
        
        if (data.success) {
          setGlobalPrice(String(data.price));
          setTempPrice(String(data.price));  
        }
      } catch (err) {
        console.error("Failed fetching database price configuration:", err);
      }
    };
    
    fetchCurrentPrice();
  }, []);
  // Sync back if edit mode is closed without saving
  useEffect(() => {
    if (!isEditingPrice) {
      setTempPrice(globalPrice);
    }
  }, [globalPrice, isEditingPrice]);

  // ← REPLACE OLD FUNCTION WITH THIS
  const handleSavePrice = async () => {
    if (!tempPrice || isNaN(Number(tempPrice))) {
      ShowError("Please enter a valid price amount.");
      return;
    }

    try {
      setIsSavingPrice(true);
      
      const res = await fetch("/api/update-price", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price: Number(tempPrice),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update price.");
      }

      setGlobalPrice(String(data.price));
      setIsEditingPrice(false);
      ShowSuccess("Global system price updated successfully!");
    } catch (err) {
      ShowError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSavingPrice(false);
    }
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

  // --- STATE 3: NEW ADMIN EMAIL & BALANCE ALLOCATION CARD ---
  const [adminAllocation, setAdminAllocation] = useState({
    userEmail: "",
    topUpAmount: "",
  });
  const [allocationStatus, setAllocationStatus] = useState({ type: "", message: "" });
  const [isSubmittingBalance, setIsSubmittingBalance] = useState(false);

  const handleAllocateBalance = async (e) => {
  e.preventDefault();

  if (!adminAllocation.userEmail || !adminAllocation.topUpAmount) {
    ShowError("Please fill all required inputs.");
    return;
  }

  try {
    setIsSubmittingBalance(true);
    setAllocationStatus({ type: "", message: "" });

    const res = await fetch("/api/price", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: adminAllocation.userEmail,
        amount: Number(adminAllocation.topUpAmount),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to update balance");
    }

    // ✅ SUCCESS
    ShowSuccess(`Rs. ${adminAllocation.topUpAmount} credited to ${adminAllocation.userEmail}`);

    setAllocationStatus({
      type: "success",
      message: data.message || "Balance updated successfully",
    });

    setAdminAllocation({ userEmail: "", topUpAmount: "" });

  } catch (err) {
    const message = err.message || "Something went wrong";

    // ❌ ERROR TOAST
    ShowError(message);

    setAllocationStatus({
      type: "error",
      message,
    });

  } finally {
    setIsSubmittingBalance(false);
  }
};

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
          
          {/* CARD 1: PRICE CONTROLLER */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm relative group hover:border-blue-100 transition-all flex flex-col justify-between">
            <div>
              {/* Header with Switcher Icon */}
              <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Rate Settings</span>
                
                <button
                  onClick={() => setIsEditingPrice(!isEditingPrice)}
                  className={`p-2 rounded-xl transition-all ${
                    isEditingPrice ? "bg-amber-50 text-amber-600 border border-amber-100" : "bg-slate-50 hover:bg-slate-100 text-slate-600"
                  }`}
                  title={isEditingPrice ? "Cancel" : "Edit Price"}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.3" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                  </svg>
                </button>
              </div>

              {/* Strict Dynamic Form View Render */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Standard Numbers Unit Cost
                </label>
                
                {isEditingPrice ? (
                  <div className="flex items-center gap-2 mt-2 max-w-xs animate-fadeIn">
                    <span className="text-sm font-bold text-slate-600">Rs.</span>
                    <input
                      type="number"
                      value={tempPrice}
                      onChange={(e) => setTempPrice(e.target.value)}
                      className="w-full bg-slate-50 border border-blue-400 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 focus:outline-none"
                      placeholder="Enter amount"
                      autoFocus
                    />
                  </div>
                ) : (
                  <div className="py-2 animate-fadeIn">
                    <span className="text-3xl font-black text-slate-950 tracking-tight">
                      Rs. {globalPrice}
                    </span>
                    <span className="text-[11px] block font-semibold text-slate-400 mt-1">
                      * Active baseline consumer rate across all terminals.
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Context Actions Row */}
            {isEditingPrice && (
              <div className="mt-6 pt-3.5 border-t border-slate-50 flex justify-end">
                <button
                  onClick={handleSavePrice}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-[0.98]"
                >
                  Save New Price
                </button>
              </div>
            )}
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

        {/* ROW 2: NEW CENTERED MANUAL USER BALANCE ALLOCATOR CARD */}
        <div className="flex justify-center w-full">
          <div className="w-full max-w-lg bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden hover:border-blue-100 transition-all">
            
            <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Credit Core System
                </span>
              </div>
              <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-bold uppercase">
                Manual Panel
              </span>
            </div>

            <div className="text-center mb-5">
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mb-1">
                Allocate User Balance
              </h3>
              <p className="text-slate-400 text-xs max-w-xs mx-auto leading-relaxed">
                Directly deposit financial tokens into client balance pools using official registered credentials.
              </p>
            </div>

            {/* Allocation Form Layout */}
            <form onSubmit={handleAllocateBalance} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Email Address Input */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                    User Account Email
                  </label>
                  <input
                    type="email"
                    value={adminAllocation.userEmail}
                    onChange={(e) => setAdminAllocation({ ...adminAllocation, userEmail: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    placeholder="user@example.com"
                  />
                </div>

                {/* Balance Amount Input */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                    Amount to Add (Rs.)
                  </label>
                  <input
                    type="number"
                    value={adminAllocation.topUpAmount}
                    onChange={(e) => setAdminAllocation({ ...adminAllocation, topUpAmount: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-black text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    placeholder="e.g. 500"
                  />
                </div>
              </div>

              {/* Status Alert feedback loop messages */}
              {allocationStatus.message && (
                <div className={`p-3 rounded-xl text-xs font-semibold text-center animate-fadeIn ${
                  allocationStatus.type === "success" 
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                    : "bg-red-50 text-red-700 border border-red-100"
                }`}>
                  {allocationStatus.message}
                </div>
              )}

              {/* Submit Button Trigger */}
              <button
                type="submit"
                disabled={isSubmittingBalance}
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold rounded-xl transition-all text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                {isSubmittingBalance ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Processing Deposit...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    <span>Update & Credit Balance</span>
                  </>
                )}
              </button>
            </form>

          </div>
        </div>

        {/* =======================================================
            🚫 COMMITTED / COMMENTED OUT: OLD CARD 3 UI STRUCTURE 
            (Agar apko emergency button dobara chalana ho to isko uncomment kr skte hain)
            =======================================================
        {false && (
          <div className="flex justify-center w-full mt-6">
            <div className="w-full max-w-md bg-white border border-slate-100 rounded-2xl p-5 shadow-sm text-center">
               <h3>Virtual Numbers Dispatcher (Old Card 3)</h3>
            </div>
          </div>
        )}
        ======================================================= */}

      </div>
    </div>
  );
}