"use client";

import React, { useEffect, useState } from "react";

export default function CombinedNumbersView() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      setUserId(user?.id || user?._id);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const calculateTimeLeft = (expiresAt) => {
    if (!expiresAt) return "30:00";

    const diff =
      new Date(expiresAt).getTime() - Date.now();

    if (diff <= 0) return "Expired";

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor(
      (diff % 60000) / 1000
    );

    return `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const fetchData = async () => {
    if (!userId) return;

    try {
      setLoading(true);

      const [numbersRes, historyRes] =
        await Promise.all([
          fetch(
            `/api/get-number?userId=${userId}`
          ),
          fetch("/api/check-sms"),
        ]);

      let numbersData = {};
      let historyData = {};

      try {
        numbersData = await numbersRes.json();
      } catch {
        numbersData = {};
      }

      try {
        historyData = await historyRes.json();
      } catch {
        historyData = {};
      }

      const activeNumbers =
        numbersData?.success
          ? numbersData.numbers || []
          : [];

      const historyLogs =
        historyData?.success
          ? historyData.data || []
          : [];

      const merged = activeNumbers.map((num) => {
        const sms = historyLogs.find(
          (h) =>
            h.phoneNumber ===
              num.phoneNumber ||
            h.phoneNumber === num.number
        );

        const timeLeft =
          calculateTimeLeft(num.expiresAt);

        const isExpired =
          timeLeft === "Expired";

        return {
          id: num.id,
          activationId: num.activationId,
          phoneNumber:
            num.phoneNumber || num.number,
          otpCode:
            sms?.otpCode ||
            sms?.smsText ||
            "Waiting...",
          status: isExpired
            ? "Expired"
            : num.status || "ACTIVE",
          timeLeft,
          isActive:
            !isExpired &&
            (num.status === "ACTIVE" ||
              !num.status),
        };
      });

      setRows(merged);
    } catch (error) {
      console.error(
        "Fetch Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (
    activationId
  ) => {
    try {
      await fetch("/api/cancel-number", {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          activationId,
        }),
      });

      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (
    numberId
  ) => {
    try {
      await fetch("/api/cancel-number", {
        method: "DELETE",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          numberId,
          userId,
        }),
      });

      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const interval = setInterval(() => {
      fetchData();
    }, 10000);

    return () =>
      clearInterval(interval);
  }, [userId]);

  const filteredRows = rows.filter(
    (row) => {
      if (filter === "active")
        return row.isActive;

      if (filter === "inactive")
        return !row.isActive;

      return true;
    }
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-5">

      <div className="flex items-center  text-black justify-between bg-white border rounded-2xl p-4 mb-4">
        <h2 className="text-lg font-bold">
          Active Numbers
        </h2>

        <button
          onClick={fetchData}
          className="px-4 py-2 text-sm border rounded-xl hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      <div className="flex gap-2 mb-5">
        <button
          onClick={() =>
            setFilter("all")
          }
          className={`px-4 py-2 rounded-xl text-sm ${
            filter === "all"
              ? "bg-slate-900 text-white"
              : "bg-slate-100"
          }`}
        >
          All
        </button>

        <button
          onClick={() =>
            setFilter("active")
          }
          className={`px-4 py-2 rounded-xl text-sm ${
            filter === "active"
              ? "bg-slate-900 text-white"
              : "bg-slate-100"
          }`}
        >
          Active
        </button>

        <button
          onClick={() =>
            setFilter("inactive")
          }
          className={`px-4 py-2 rounded-xl text-sm ${
            filter === "inactive"
              ? "bg-slate-900 text-white"
              : "bg-slate-100"
          }`}
        >
          Inactive
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">
          Loading...
        </div>
      ) : filteredRows.length === 0 ? (
        <div className="bg-white border rounded-2xl p-10 text-center text-slate-400">
          No Numbers Found
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRows.map((row) => (
            <div
              key={row.id}
              className="bg-white border rounded-2xl p-4"
            >
              <div className="flex items-center justify-between gap-4">

                <div className="flex-1">
                  <h3 className="font-bold text-base">
                    {row.phoneNumber}
                  </h3>

                  <div className="flex flex-wrap gap-2 mt-2 text-sm">

                    <span className="px-2 py-1 bg-slate-100 rounded-lg">
                      OTP: {row.otpCode}
                    </span>

                    <span className="px-2 py-1 bg-slate-100 rounded-lg">
                      {row.status}
                    </span>

                    <span className="px-2 py-1 bg-slate-100 rounded-lg">
                      {row.timeLeft}
                    </span>

                  </div>
                </div>

                {row.isActive ? (
                  <button
                    onClick={() =>
                      handleCancel(
                        row.activationId
                      )
                    }
                    className="px-4 py-2 rounded-xl bg-red-500 text-white"
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      handleDelete(
                        row.id
                      )
                    }
                    className="px-4 py-2 rounded-xl bg-slate-600 text-white"
                  >
                    Delete
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