"use client";

import React, { useState } from "react";

export default function HistoryView() {
  // Modal states for popup
  const [selectedSms, setSelectedSms] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dummy data list jo history hone par table mein dikhegi
  const [historyLogs, setHistoryLogs] = useState([
    {
      id: "1",
      phoneNumber: "+1 (202) 555-0143",
      service: "WhatsApp",
      date: "2026-06-18 14:22",
      cost: "Rs. 55",
      smsText: "Your WhatsApp code is 482-910. Please do not share this secret OTP with anyone for security purposes.",
      status: "Completed"
    },
    {
      id: "2",
      phoneNumber: "+1 (650) 443-9821",
      service: "Google",
      date: "2026-06-15 09:12",
      cost: "Rs. 55",
      smsText: "G-102938 is your Google verification code.",
      status: "Completed"
    }
  ]);

  // Open modal handler
  const openModal = (text) => {
    setSelectedSms(text);
    setIsModalOpen(true);
  };

  // Helper function to handle SMS Cell layout based on CHARACTER count
  const renderSmsCell = (text) => {
    // Agar text ki total character length 20 se zyada hai toh seedha button dikhao
    if (text.length > 20) {
      return (
        <button
          onClick={() => openModal(text)}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-[11px] sm:text-xs rounded-lg transition-all border border-blue-100 active:scale-[0.98]"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
          <span>View Message</span>
        </button>
      );
    }
    
    // Agar chota message ho (jaise sirf OTP digit "482910") toh normal dikhao
    return <span className="text-slate-500 italic">"{text}"</span>;
  };

  const toggleMockHistory = () => {
    if (historyLogs.length > 0) {
      setHistoryLogs([]);
    } else {
      setHistoryLogs([
        { id: "1", phoneNumber: "+1 (202) 555-0143", service: "WhatsApp", date: "2026-06-18 14:22", cost: "Rs. 55", smsText: "Your WhatsApp code is 482-910. Please do not share this secret OTP with anyone for security purposes.", status: "Completed" },
        { id: "2", phoneNumber: "+1 (650) 443-9821", service: "Google", date: "2026-06-15 09:12", cost: "Rs. 55", smsText: "G-102938 is your Google verification code.", status: "Completed" }
      ]);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6 animate-fadeIn relative">
      
      {/* Test Switcher Badge */}
      <div className="mb-4 flex justify-end">
        <button 
          onClick={toggleMockHistory} 
          className="text-[10px] sm:text-xs bg-slate-200 text-slate-700 font-medium px-2.5 py-1.5 rounded-lg hover:bg-slate-300 transition-all"
        >
          Toggle: {historyLogs.length > 0 ? "Show Empty History" : "Show Filled History"}
        </button>
      </div>

      {/* Top Header Panel */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 items-start sm:items-center justify-between bg-white border border-slate-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-[0_4px_12px_rgba(0,0,0,0.02)] mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#0f172a] rounded-lg sm:rounded-xl flex items-center justify-center text-white shadow-md">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">Usage History</h2>
        </div>
        
        <button className="flex items-center justify-center gap-1.5 w-full sm:w-auto px-4 py-2 border border-slate-200 rounded-xl text-slate-600 text-xs sm:text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm">
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          <span>Refresh</span>
        </button>
      </div>

      {/* CONDITIONAL RENDERING LOGIC */}
      {historyLogs.length === 0 ? (
        
        <div className="w-full bg-white border border-dashed border-slate-200 rounded-[24px] sm:rounded-[32px] py-20 sm:py-28 px-4 text-center flex flex-col items-center justify-center shadow-sm">
          <p className="text-[#94a3b8] text-sm sm:text-base font-bold tracking-wide">
            No history found.
          </p>
        </div>

      ) : (

        <div className="bg-white border border-slate-100 rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto selection:bg-blue-100">
            <table className="w-full text-left border-collapse min-w-[650px] sm:min-w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                  <th className="py-3 sm:py-4 px-4 sm:px-6">Phone Number</th>
                  <th className="py-3 sm:py-4 px-4 sm:px-6">Service</th>
                  <th className="py-3 sm:py-4 px-4 sm:px-6">SMS Content</th>
                  <th className="py-3 sm:py-4 px-4 sm:px-6">Date</th>
                  <th className="py-3 sm:py-4 px-4 sm:px-6">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs sm:text-sm font-medium text-slate-700">
                {historyLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 sm:py-4 px-4 sm:px-6 font-bold text-slate-900 whitespace-nowrap">{log.phoneNumber}</td>
                    <td className="py-3 sm:py-4 px-4 sm:px-6 whitespace-nowrap">
                      <span className="bg-slate-100 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-semibold text-slate-700">
                        {log.service}
                      </span>
                    </td>
                    <td className="py-3 sm:py-4 px-4 sm:px-6 min-w-[140px]">
                      {renderSmsCell(log.smsText)}
                    </td>
                    <td className="py-3 sm:py-4 px-4 sm:px-6 text-slate-400 text-[11px] sm:text-xs whitespace-nowrap">{log.date}</td>
                    <td className="py-3 sm:py-4 px-4 sm:px-6 text-emerald-600 font-bold whitespace-nowrap">{log.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      )}

      {/* Pagination Footer */}
      <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:gap-0 items-center justify-between text-xs sm:text-sm font-semibold text-slate-400">
        <div>
          <span>Page 1 of 1</span>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <button className="flex items-center justify-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 border border-slate-200/60 bg-white text-slate-300 rounded-xl cursor-not-allowed text-[11px] sm:text-xs font-bold flex-1 sm:flex-none">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            <span>Previous</span>
          </button>
          <button className="flex items-center justify-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 border border-slate-200/60 bg-white text-slate-300 rounded-xl cursor-not-allowed text-[11px] sm:text-xs font-bold flex-1 sm:flex-none">
            <span>Next</span>
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* FULL RESPONSIVE POPUP MODAL COMPONENT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="absolute inset-0" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="bg-white border border-slate-100 rounded-2xl w-full max-w-md p-5 sm:p-6 shadow-2xl relative z-10 scale-[1] transition-transform animate-scaleIn">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                </svg>
                <span>Full SMS Message</span>
              </div>
              
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-5 max-h-60 overflow-y-auto">
              <p className="text-slate-800 text-xs sm:text-sm font-semibold leading-relaxed select-all">
                {selectedSms}
              </p>
            </div>

            <div className="flex justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:opacity-90 active:scale-[0.98] transition-all"
              >
                Close View
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}