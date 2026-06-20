"use client";

import React, { useEffect, useState } from "react";

export default function HistoryView() {
  const [selectedSms, setSelectedSms] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [historyLogs, setHistoryLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Open modal
  const openModal = (text) => {
    setSelectedSms(text);
    setIsModalOpen(true);
  };

  // Fetch history from API
  const fetchHistory = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/check-sms");
      const json = await res.json();

      if (json.success) {
        const formatted = json.data.map((item) => ({
          id: item.id,
          phoneNumber: item.phoneNumber,
          service: item.service || "Unknown",
          date: item.receivedAt
            ? new Date(item.receivedAt).toLocaleString()
            : "-",
          cost: item.cost ? `Rs. ${item.cost}` : "Rs. 0",
          smsText: item.otpCode || "Waiting for SMS...",
          status: item.status,
        }));

        setHistoryLogs(formatted);
      } else {
        setHistoryLogs([]);
      }
    } catch (err) {
      console.error("History fetch error:", err);
      setHistoryLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Optional auto refresh (real-time SMS updates)
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     fetchHistory();
  //   }, 5000);
  //   return () => clearInterval(interval);
  // }, []);

  // SMS renderer
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

      {/* HEADER */}
      <div className="flex items-center justify-between bg-white border rounded-2xl p-4 mb-5">
        <h2 className="text-lg font-bold">Usage History</h2>

        <button
          onClick={fetchHistory}
          className="px-4 py-2 text-sm border rounded-xl hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="text-center py-10 text-slate-400">
          Loading history...
        </div>
      ) : historyLogs.length === 0 ? (
        <div className="text-center py-20 text-slate-400 font-semibold">
          No history found
        </div>
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
                    <td className="p-4 font-semibold">
                      {log.phoneNumber}
                    </td>

                    <td className="p-4">
                      <span className="px-2 py-1 bg-slate-100 rounded text-xs">
                        {log.service}
                      </span>
                    </td>

                    <td className="p-4">
                      {renderSmsCell(log.smsText)}
                    </td>

                    <td className="p-4 text-xs text-slate-500">
                      {log.date}
                    </td>

                    <td className="p-4 font-bold text-emerald-600">
                      {log.cost}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL */}
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

            <div className="bg-slate-50 p-4 rounded-lg text-sm whitespace-pre-wrap">
              {selectedSms}
            </div>

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