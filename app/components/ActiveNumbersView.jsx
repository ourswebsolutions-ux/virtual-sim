"use client";

import React, { useState, useEffect } from "react";
import { 
  Phone, 
  Clock, 
  XCircle, 
  Trash2, 
  Search, 
  Filter, 
  ChevronDown, 
  CheckCircle, 
  AlertCircle 
} from "lucide-react";

export default function Inbox({ setActiveTab, activeShow }) {
  const [numbers, setNumbers] = useState([]);
  const [history, setHistory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState(["All"]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const filterOptions = [
    { value: "All", label: "All", icon: Filter, color: "slate" },
    { value: "active", label: "Active", icon: Phone, color: "emerald" },
    { value: "cancelled", label: "Cancelled", icon: XCircle, color: "slate" },
    { value: "completed", label: "Completed", icon: CheckCircle, color: "blue" },
  ];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUserId(user?.id || user?._id);
  }, []);

  const fetchData = async () => {
    if (!userId) return;
    try {
      // setLoading(true);
      const res = await fetch(`/api/get-number?userId=${userId}`);
      const data = await res.json();
      if (data.success) {
        const mapped = data.numbers.map(num => {
          const timeLeft = calculateTimeLeft(num.expiresAt);
          const isCancelled = num.status === "CANCELLED";
          const isCompleted = num.status === "COMPLETED";
          const isActive = !isCancelled && !isCompleted;
          const createdTime = num.createdAt ? new Date(num.createdAt).getTime() : 0;
          const isFrozen = Date.now() - createdTime < 3 * 60 * 1000;

          return {
            id: num.id,
            phoneNumber: num.phoneNumber || num.number,
            service: num.service || "Unknown Service",
            timeLeft,
            status: isCancelled ? "Cancelled" : isCompleted ? "Completed" : num.status || "Waiting for SMS...",
            activationId: num.activationId,
            isCancelled,
            isCompleted,
            isActive,
            isCancellable: !isCancelled && !isCompleted && !isFrozen,
            canDelete: isCancelled || isCompleted,
            cost: num.cost || "0.00",
          };
        });
        setNumbers(mapped);
        fetchHistory(mapped);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateTimeLeft = (expiresAt) => {
    if (!expiresAt) return "30:00";
    const diffMs = new Date(expiresAt).getTime() - Date.now();
    if (diffMs <= 0) return null;
    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const fetchHistory = async (activeNums) => {
    if (!activeNums?.length) return;
    try {
      const results = await Promise.all(
        activeNums.map(async (num) => {
          const res = await fetch("/api/check-sms", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ activationId: num.activationId }),
          });
          return res.json();
        })
      );
      const hist = {};
      results.forEach((r, i) => {
        if (r.success) hist[activeNums[i].id] = r.otp || r.smsText || "Waiting...";
      });
      setHistory(hist);
    } catch (_) {}
  };

  useEffect(() => { if (userId) fetchData(); }, [userId]);
  useEffect(() => { 
    if (userId) { 
      const i = setInterval(fetchData, 10000); 
      return () => clearInterval(i); 
    } 
  }, [userId]);

  const handleCancel = async (id, activationId) => {
    if (!confirm("Cancel this number?")) return;
    const res = await fetch("/api/cancel-number", { 
      method: "POST", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({ activationId, userId }) 
    });
    if (res.ok) fetchData();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this record?")) return;
    const res = await fetch("/api/cancel-number", { 
      method: "DELETE", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({ numberId: id, userId }) 
    });
    if (res.ok) fetchData();
  };

  const filtered = numbers
    .filter(num => {
      // If activeShow is true, only show active numbers (ignore other filters)
      if (activeShow) {
        return num.isActive;
      }

      // Existing logic remains unchanged when activeShow is false/undefined
      const otp = history[num.id] || "";
      const matchesSearch = 
        num.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
        num.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
        otp.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;
      if (selectedFilters.includes("All")) return true;
      return (selectedFilters.includes("active") && num.isActive) ||
             (selectedFilters.includes("cancelled") && num.isCancelled) ||
             (selectedFilters.includes("completed") && num.isCompleted);
    })
    .sort((a, b) => (a.isActive && !b.isActive ? -1 : b.isActive && !a.isActive ? 1 : 0));

  const toggleFilter = (value) => {
    if (value === "All") {
      setSelectedFilters(["All"]);
      return;
    }
    let newF = selectedFilters.filter(f => f !== "All");
    if (newF.includes(value)) {
      if (newF.length === 1) return;
      newF = newF.filter(f => f !== value);
    } else {
      newF = [...newF, value];
    }
    setSelectedFilters(newF.length === 3 ? ["All"] : newF);
  };

  const getLabel = () => 
    selectedFilters.includes("All") 
      ? "All Status" 
      : selectedFilters.map(v => filterOptions.find(o => o.value === v)?.label).join(", ");

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-50 p-6 text-red-600 rounded-3xl">Error: {error}</div>;
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Header & Search/Filter - unchanged */}
      <div className="flex justify-between items-start mb-8">
        <div>
          {/* <h2 className="text-3xl font-bold text-black tracking-tight">Inbox</h2> */}
          <p className="text-slate-600 mt-1">Manage your numbers and received OTPs</p>
        </div>
        <div className="text-sm px-4 py-1.5 bg-white border border-slate-200 rounded-2xl text-slate-500">
          {filtered.length} records
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search by number, service or OTP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-3.5 bg-white border border-slate-200 rounded-3xl focus:border-sky-500 text-black placeholder:text-slate-400"
          />
        </div>

        <div className="relative min-w-[200px]">
          <button 
            onClick={() => setShowFilterDropdown(!showFilterDropdown)} 
            className="flex items-center text-black justify-between w-full px-5 py-3.5 bg-white border border-slate-200 rounded-3xl hover:border-sky-500 transition-all"
          >
            <div className="flex items-center gap-3">
              <Filter size={19} className="text-sky-600" />
              <span className="font-medium">{getLabel()}</span>
            </div>
            <ChevronDown size={18} className={`transition-transform ${showFilterDropdown ? "rotate-180" : ""}`} />
          </button>

          {showFilterDropdown && (
            <div className="absolute mt-2 w-full bg-white border text-black border-slate-200 rounded-3xl shadow-xl py-2 z-50">
              {filterOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedFilters.includes(opt.value);
                return (
                  <div 
                    key={opt.value} 
                    onClick={() => toggleFilter(opt.value)} 
                    className="flex items-center gap-3 px-6 py-3 hover:bg-slate-50 cursor-pointer"
                  >
                    <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${isSelected ? "bg-sky-600 border-sky-600" : "border-slate-300"}`}>
                      {isSelected && <CheckCircle size={13} className="text-white" />}
                    </div>
                    <Icon size={18} />
                    <span>{opt.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl py-20 text-center">
          <div className="mx-auto w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-5">
            <Phone className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-black">No matching records</h3>
          <p className="text-slate-500 mt-1">Try changing your search or filter</p>
        </div>
      ) : (
        <div className="space-y-5">
          {filtered.map((num) => {
            const otp = history[num.id];
            const hasOtp = !!otp && otp !== "Waiting...";
            const isCompleted = num.isCompleted;
            const showTimer = num.timeLeft && !isCompleted && !num.isCancelled;

            return (
              <div 
                key={num.id} 
                className="group bg-white border border-slate-100 hover:border-sky-200 rounded-3xl p-6 transition-all duration-300 hover:shadow-lg flex flex-col lg:flex-row gap-6 items-start"
              >
                {/* Phone & Service */}
                <div className="flex-1">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-gradient-to-br from-sky-600 to-blue-600 rounded-2xl flex items-center justify-center text-white flex-shrink-0">
                      <Phone size={24} />
                    </div>
                    <div>
                      <div className="font-mono text-3xl font-bold text-black tracking-tight">
                        {num.phoneNumber}
                      </div>
                      <div className="text-slate-600 mt-0.5">{num.service}</div>
                    </div>
                  </div>
                </div>

                {/* OTP Display (Completed) */}
                {isCompleted && hasOtp && (
                  <div className="flex-1 flex flex-col items-center py-2">
                    <div className="text-xs uppercase tracking-widest text-slate-500 mb-2 font-medium">OTP</div>
                    <div className="font-mono text-5xl font-bold tracking-widest text-black bg-slate-50 px-8 py-4 rounded-2xl border border-slate-100">
                      {otp}
                    </div>
                    {num.cost && (
                      <div className="text-sm text-slate-500 mt-2">Cost: ${num.cost}</div>
                    )}
                  </div>
                )}

                {/* RIGHT SIDE - SINGLE HORIZONTAL ROW */}
                <div className="flex items-center gap-3 flex-wrap justify-end lg:min-w-[380px]">
                  {/* 1. Waiting for OTP Badge (Active + no OTP) */}
                  {num.isActive && !hasOtp && (
                    <div className="px-4 py-1.5 text-sm font-medium rounded-2xl bg-amber-100 text-amber-700 whitespace-nowrap">
                      Waiting for OTP...
                    </div>
                  )}

                  {/* 2. Main Status Badge */}
                  <div className={`px-4 py-1.5 text-sm font-medium rounded-2xl flex items-center gap-2 whitespace-nowrap ${
                    num.isActive ? "bg-emerald-100 text-emerald-700" : 
                    num.isCompleted ? "bg-blue-100 text-blue-700" : 
                    "bg-slate-100 text-slate-600"
                  }`}>
                    {num.isActive && <Phone size={16} />}
                    {num.isCompleted && <CheckCircle size={16} />}
                    {num.isCancelled && <AlertCircle size={16} />}
                    {num.status}
                  </div>

                  {/* 3. Timer (Active + time remaining) */}
                  {showTimer && (
                    <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-1.5 rounded-2xl text-sm font-medium whitespace-nowrap">
                      <Clock size={16} />
                      {num.timeLeft}
                    </div>
                  )}

                  {/* 4. Action Button */}
                  <div>
                    {num.isCancellable ? (
                      <button 
                        onClick={() => handleCancel(num.id, num.activationId)}
                        className="flex items-center gap-2 px-5 py-2.5 text-red-600 hover:bg-red-50 border border-red-200 rounded-2xl transition-all hover:border-red-300 whitespace-nowrap"
                      >
                        <XCircle size={17} />
                        Cancel
                      </button>
                    ) : num.canDelete ? (
                      <button 
                        onClick={() => handleDelete(num.id)}
                        className="flex items-center gap-2 px-5 py-2.5 text-red-600 hover:bg-red-50 border border-red-200 rounded-2xl transition-all hover:border-red-300 whitespace-nowrap"
                      >
                        <Trash2 size={17} />
                        Delete
                      </button>
                    ) : (
                      <div className="px-5 py-2.5 text-xs bg-amber-50 text-amber-700 rounded-2xl whitespace-nowrap">
                        Frozen • 3 min
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}