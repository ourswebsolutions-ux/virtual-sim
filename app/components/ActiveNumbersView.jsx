"use client";

import React, { useState, useEffect } from "react";

export default function ActiveNumbersView({ setActiveTab }) {
  const [activeNumbers, setActiveNumbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [filter, setFilter] = useState("active");

  // Get userId from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const id = user?.id || user?._id;
    console.log("User from localStorage:", user);
    console.log("Extracted userId:", id);
    setUserId(id);
  }, []);

  const fetchActiveNumbers = async () => {
    if (!userId) {
      setError("User not logged in. Please login again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/get-number?userId=${userId}`);

      if (!res.ok) throw new Error("Failed to fetch numbers");

      const data = await res.json();

      if (data.success) {
        const mapped = data.numbers.map((num) => {
          const timeLeft = calculateTimeLeft(num.expiresAt);
          const isExpired = timeLeft === "Expired";
          
          return {
            id: num.id,
            phoneNumber: num.phoneNumber || num.number,
            service: num.service || "Unknown Service",
            timeLeft,
            status: isExpired ? "Expired" : (num.status || "Waiting for SMS..."),
            activationId: num.activationId,
            // Only ACTIVE + not expired can be cancelled
            isCancellable: (num.status === "ACTIVE" || !num.status) && !isExpired,
            isActive: (num.status === "ACTIVE" || !num.status) && !isExpired,
          };
        });

        setActiveNumbers(mapped);
      } else {
        setError(data.message || "Failed to load numbers");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const calculateTimeLeft = (expiresAt) => {
    if (!expiresAt) return "30:00";
    const diffMs = new Date(expiresAt).getTime() - Date.now();
    if (diffMs <= 0) return "Expired";

    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Cancel Number (only for non-expired active numbers)
  const handleCancel = async (numberId, activationId) => {
    if (!confirm("Are you sure you want to cancel this number?")) return;

    try {
      const res = await fetch("/api/cancel-number", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activationId }),
      });

      if (res.ok) {
        alert("Number cancelled successfully");
        fetchActiveNumbers();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to cancel");
      }
    } catch (err) {
      alert("Error cancelling number");
    }
  };

  // Permanent Delete
  const handleDelete = async (numberId) => {
    if (!confirm("Delete this number permanently from history?")) return;

    try {
      const res = await fetch("/api/cancel-number", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numberId, userId }),
      });

      if (res.ok) {
        alert("Number deleted permanently");
        fetchActiveNumbers();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete");
      }
    } catch (err) {
      alert("Error deleting number");
    }
  };

  useEffect(() => {
    if (userId) fetchActiveNumbers();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    const interval = setInterval(fetchActiveNumbers, 10000);
    return () => clearInterval(interval);
  }, [userId]);

  const filteredNumbers = activeNumbers.filter((num) => {
    if (filter === "active") return num.isActive;
    if (filter === "inactive") return !num.isActive;
    return true;
  });

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl text-center">
          Error: {error}
          <button onClick={fetchActiveNumbers} className="mt-3 text-sm underline hover:no-underline">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6 animate-fadeIn">
      
      {/* Filter Buttons */}
      <div className="mb-4 flex flex-wrap gap-3 justify-between">
        <div className="flex gap-2">
          <button onClick={() => setFilter("active")} className={`px-4 py-1.5 text-sm font-medium rounded-xl transition-all ${filter === "active" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"}`}>Active</button>
          <button onClick={() => setFilter("inactive")} className={`px-4 py-1.5 text-sm font-medium rounded-xl transition-all ${filter === "inactive" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"}`}>Inactive</button>
          <button onClick={() => setFilter("all")} className={`px-4 py-1.5 text-sm font-medium rounded-xl transition-all ${filter === "all" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"}`}>All</button>
        </div>

        <button onClick={() => activeNumbers.length > 0 ? setActiveNumbers([]) : fetchActiveNumbers()} className="text-[10px] sm:text-xs bg-slate-200 text-slate-700 font-medium px-2.5 py-1.5 rounded-lg hover:bg-slate-300 transition-all">Toggle Empty</button>
      </div>

      {/* Original Header - Unchanged */}
      <div className="flex items-center justify-between bg-white border border-slate-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-[0_4px_12px_rgba(0,0,0,0.02)] mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.557-5.144-3.874-6.703-6.7l1.293-.97.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
            </svg>
          </div>
          <h2 className="hidden sm:block text-lg sm:text-xl font-bold text-slate-900">Active Numbers</h2>
        </div>
        
        <button onClick={() => setActiveTab("home")} className="flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto gap-1 text-slate-500 hover:text-slate-800 transition-colors border border-slate-100 sm:border-0 rounded-lg sm:rounded-none bg-slate-50/50 sm:bg-transparent" title="Back to Home">
          <svg className="w-5 h-5 sm:w-3.5 sm:h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          <span className="hidden sm:inline text-xs sm:text-sm font-bold">Back</span>
        </button>
      </div>

      {filteredNumbers.length === 0 ? (
        <div className="w-full bg-white border border-dashed border-slate-200 rounded-[24px] sm:rounded-[32px] py-14 sm:py-20 px-4 text-center flex flex-col items-center justify-center shadow-sm">
          <div className="w-16 h-16 sm:w-24 sm:h-24 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
            <svg className="w-7 h-7 sm:w-10 sm:h-10 text-slate-300" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.557-5.144-3.874-6.703-6.7l1.293-.97.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
            </svg>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">No active numbers</h3>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xs sm:max-w-sm leading-relaxed mb-6 sm:mb-8">You don't have any active numbers at the moment. Get one to start receiving SMS.</p>
          <button onClick={() => setActiveTab("home")} className="px-6 py-3 sm:px-8 sm:py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl sm:rounded-2xl shadow-md shadow-blue-500/10 hover:opacity-95 active:scale-[0.99] transition-all text-xs sm:text-sm">Get a Number</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {filteredNumbers.map((num) => (
            <div key={num.id} className="bg-white border border-slate-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 relative overflow-hidden group hover:border-blue-100 transition-all">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-50 rounded-lg sm:rounded-xl flex items-center justify-center text-blue-600 font-bold text-xs sm:text-sm shrink-0">
                  {num.service.charAt(0)}
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">{num.phoneNumber}</h4>
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1 text-[11px] sm:text-xs font-semibold text-slate-400">
                    <span className="text-slate-600">{num.service}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                      {num.timeLeft} min left
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 border-t border-slate-50 pt-2.5 sm:border-0 sm:pt-0">
                <div className="text-left sm:text-right sm:mr-2">
                  <p className={`text-xs sm:text-sm font-bold ${num.isActive ? "text-emerald-600 animate-pulse" : "text-slate-500"}`}>
                    {num.status}
                  </p>
                </div>

                {num.isCancellable ? (
                  <button 
                    onClick={() => handleCancel(num.id, num.activationId)}
                    className="px-3.5 py-1.5 sm:px-4 sm:py-2 bg-slate-50 hover:bg-red-50 hover:text-red-600 hover:border-red-100 text-slate-700 text-[11px] sm:text-xs font-bold rounded-xl border border-slate-100 transition-all active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                ) : (
                  <button 
                    onClick={() => handleDelete(num.id)}
                    className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all active:scale-95"
                    title="Delete permanently"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.75">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.595 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.595-1.858L5 7m5 4v6m4-6v6m1-10V9a1 1 0 00-1 1v1M12 4v6m2-6V9" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}