"use client";

import React, { useState, useEffect } from "react";
import { Phone, Clock, XCircle, Trash2, Search, Filter, ChevronDown, Check } from "lucide-react";

export default function ActiveNumbersView({ setActiveTab }) {
  const [activeNumbers, setActiveNumbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Default: Show ALL
  const [selectedFilters, setSelectedFilters] = useState(["All"]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const filterOptions = [
    { value: "All", label: "All Status", icon: Filter, color: "slate" },
    { value: "active", label: "Active", icon: Phone, color: "emerald" },
    { value: "cancelled", label: "Cancelled", icon: XCircle, color: "slate" },
    { value: "completed", label: "Completed", icon: Check, color: "blue" },
  ];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const id = user?.id || user?._id;
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

          const isCancelled = num.status === "CANCELLED";
          const isCompleted = num.status === "COMPLETED";
          const isActive = !isCancelled && !isCompleted;

          const createdTime = num.createdAt ? new Date(num.createdAt).getTime() : 0;
          const timeSinceCreation = Date.now() - createdTime;
          const isFrozen = timeSinceCreation < 3 * 60 * 1000;

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
          };
        });

        setActiveNumbers(mapped);
      } else {
        setError(data.message || "Failed to load numbers");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load numbers. Please retry.");
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

  const handleCancel = async (numberId, activationId) => {
    if (!confirm("Are you sure you want to cancel this number?")) return;
    try {
      const res = await fetch("/api/cancel-number", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activationId, userId }),
      });
      if (res.ok) {
        alert("Number cancelled successfully");
        fetchActiveNumbers();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to cancel number");
      }
    } catch (err) {
      alert("Failed to cancel number");
    }
  };

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

  // Multi-filter logic with "All" support
  const filteredNumbers = activeNumbers
    .filter((num) => {
      const matchesSearch =
        num.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        num.service.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedFilters.includes("All")) return true;

      const activeMatch = selectedFilters.includes("active") && num.isActive;
      const cancelledMatch = selectedFilters.includes("cancelled") && num.isCancelled;
      const completedMatch = selectedFilters.includes("completed") && num.isCompleted;

      return activeMatch || cancelledMatch || completedMatch;
    })
    .sort((a, b) => (a.isActive && !b.isActive ? -1 : 1));

  const toggleFilter = (value) => {
    if (value === "All") {
      setSelectedFilters(["All"]);
      return;
    }

    // Remove "All" when selecting specific filters
    let newFilters = selectedFilters.filter((f) => f !== "All");

    if (newFilters.includes(value)) {
      if (newFilters.length === 1) return; // prevent emptying all
      newFilters = newFilters.filter((f) => f !== value);
    } else {
      newFilters = [...newFilters, value];
    }

    // If all specific filters are selected, switch to "All"
    if (newFilters.length === 3) {
      setSelectedFilters(["All"]);
    } else {
      setSelectedFilters(newFilters);
    }
  };

  const getSelectedLabels = () => {
    if (selectedFilters.includes("All")) return "All Status";
    if (selectedFilters.length === 0) return "No Filter";
    return selectedFilters
      .map((val) => filterOptions.find((opt) => opt.value === val)?.label)
      .join(", ");
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2563EB]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-3xl text-center shadow-sm">
          <p className="font-medium">Error: {error}</p>
          <button 
            onClick={fetchActiveNumbers} 
            className="mt-4 px-5 py-2 bg-[#2563EB] text-white rounded-xl hover:bg-[#1e40af] transition-all text-sm font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-[#0F172A]">Active Numbers</h2>
          <p className="text-slate-500 mt-1">Manage your virtual numbers</p>
        </div>
        <div className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-2xl text-slate-500 font-mono">
          {filteredNumbers.length} total
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search phone or service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border text-black border-slate-200 rounded-2xl focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] text-sm placeholder:text-slate-400"
          />
        </div>

        {/* Multi-Select Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="flex items-center gap-2 px-5 py-3 bg-white border text-black border-slate-200 rounded-2xl hover:border-[#2563EB] transition-all text-sm font-semibold min-w-[200px]"
          >
            <Filter size={18} className="text-[#2563EB]" />
            <span className="truncate">{getSelectedLabels()}</span>
            <ChevronDown size={16} className={`ml-auto transition-transform ${showFilterDropdown ? "rotate-180" : ""}`} />
          </button>

          {showFilterDropdown && (
            <div className="absolute mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 max-h-80 overflow-auto">
              {filterOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedFilters.includes(option.value);
                return (
                  <div
                    key={option.value}
                    onClick={() => toggleFilter(option.value)}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50  text-black cursor-pointer"
                  >
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? "bg-[#06B6D4] border-[#2563EB]" : "border-slate-300"}`}>
                      {isSelected && <Check size={14} className="text-white" />}
                    </div>
                    <Icon size={18} className={`text-${option.color}-600`} />
                    <span className="font-medium">{option.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* List */}
      {filteredNumbers.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl py-20 text-center">
          <div className="mx-auto w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
            <Phone className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-700">No numbers found</h3>
          <p className="text-slate-500 mt-2">Try changing your filters or search term</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNumbers.map((num) => (
            <div
              key={num.id}
              className="group bg-white border border-slate-100 hover:border-[#06B6D4]/30 rounded-3xl p-6 shadow-sm hover:shadow transition-all duration-200 flex flex-col sm:flex-row sm:items-center gap-6 relative overflow-hidden"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#06B6D4] flex items-center justify-center text-white flex-shrink-0">
                    <Phone size={22} strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-mono text-2xl font-bold tracking-tighter text-[#0F172A] break-all">
                      {num.phoneNumber}
                    </h4>
                    <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{num.service}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:items-end gap-3 sm:gap-4 w-full sm:w-auto">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs bg-slate-100 px-3 py-1 rounded-xl text-slate-500">
                    <Clock size={14} />
                    {num.timeLeft}
                  </div>

                  <div
                    className={`px-3 py-1 text-xs font-bold rounded-xl ${
                      num.isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : num.isCompleted
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {num.status}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {num.isCancellable ? (
                    <button
                      onClick={() => handleCancel(num.id, num.activationId)}
                      className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-2xl border border-red-200 hover:bg-red-50 hover:text-red-600 text-red-600 transition-all active:scale-[0.985]"
                    >
                      <XCircle size={17} />
                      Cancel
                    </button>
                  ) : num.canDelete ? (
                    <button
                      onClick={() => handleDelete(num.id)}
                      className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-2xl transition-all active:scale-[0.985]"
                    >
                      <Trash2 size={17} />
                      Delete
                    </button>
                  ) : (
                    <div className="px-4 py-2.5 text-xs text-amber-600 bg-amber-50 rounded-2xl font-medium">
                      Frozen (3 min)
                    </div>
                  )}
                </div>
              </div>

              <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-[#06B6D4]/30 to-transparent" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}