"use client";

import React, { useEffect, useState } from "react";

export default function HistoryView() {
  const [selectedSms, setSelectedSms] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);

  const [historyLogs, setHistoryLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNumbers, setActiveNumbers] = useState([]);
  const [error, setError] = useState(null);

  const calculateTimeLeft = (expiresAt) => {
    if (!expiresAt) return "N/A";
    const expiry = new Date(expiresAt);
    const now = new Date();
    const diff = expiry - now;
    if (diff <= 0) return "Expired";
    const minutes = Math.floor(diff / 60000);
    return `${minutes}m left`;
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const id = user?.id || user?._id;
    setUserId(id);
  }, []);

  useEffect(() => {
    if (userId) fetchActiveNumbers();
  }, [userId]);

  const fetchActiveNumbers = async () => {
    if (!userId) {
      setError("User not logged in.");
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
      setError(err.message || "Failed to load numbers. Please wait 10 mins");
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    if (activeNumbers.length === 0) {
      setHistoryLogs([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const results = await Promise.all(
        activeNumbers.map(async (num) => {
          const res = await fetch("/api/check-sms", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ activationId: num.activationId }),
          });
          return res.json();
        })
      );

      const formatted = results
        .filter((r) => r.success)
        .map((r) => {
          const num = r.number || {};
          return {
            id: num.id || Math.random(),
            phoneNumber: num.phoneNumber,
            service: num.service || "Unknown",
            date: num.receivedAt ? new Date(num.receivedAt).toLocaleString() : "-",
            cost: r.cost?  `Rs. ${r.cost}` : "Rs. 0",
            smsText: r.otp || "Waiting for SMS...",
            status: r.status || num.status,
          };
        });

      setHistoryLogs(formatted);
    } catch (err) {
      console.error("History fetch error:", err);
      setHistoryLogs([]);
      setError("Failed to fetch history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeNumbers.length > 0) fetchHistory();
  }, [activeNumbers]);

  const openModal = (text) => {
    setSelectedSms(text);
    setIsModalOpen(true);
  };

  const renderSmsCell = (text) => {
    if (!text) return <span className="text-slate-400">No SMS</span>;
    if (text.length > 20) {
      return (
        <button
          onClick={() => openModal(text)}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-[11px] sm:text-xs rounded-lg border border-blue-100"
        >
          View Message
        </button>
      );
    }
    return <span className="text-slate-500 italic">"{text}"</span>;
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 py-5">
      <div className="flex items-center justify-between bg-white border rounded-2xl p-4 mb-5">
        <h2 className="text-lg font-bold text-black">Usage History</h2>
        <button
          onClick={fetchHistory}
          className="px-4 py-2 text-sm text-black border rounded-xl hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4">{error}</div>}

      {loading ? (
        <div className="text-center py-10 text-black">Loading history...</div>
      ) : historyLogs.length === 0 ? (
        <div className="text-center py-20 text-slate-400 font-semibold">No history found</div>
      ) : (
        <div className="bg-white border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px]">
              <thead>
                <tr className="bg-slate-50 text-xs text-slate-500">
                  <th className="p-4 text-left">Phone</th>
                  <th className="p-4 text-left">Service</th>
                  <th className="p-4 text-left">SMS</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Cost</th>
                </tr>
              </thead>
              <tbody>
                {historyLogs.map((log) => (
                  <tr key={log.id} className="border-t hover:bg-slate-50">
                    <td className="p-4 font-semibold text-black">{log.phoneNumber}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 text-black rounded text-xs">{log.service}</span>
                    </td>
                    <td className="p-4">{renderSmsCell(log.smsText)}</td>
                    <td className="p-4 text-xs text-slate-500">{log.date}</td>
                    <td className="p-4 font-bold text-emerald-600">{log.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-slate-500"
            >
              ✕
            </button>
            <h3 className="font-bold mb-3">Full SMS Message</h3>
            <div className="bg-slate-50 p-4 rounded-lg text-sm whitespace-pre-wrap">{selectedSms}</div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 w-full bg-slate-900 text-white py-2 rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}