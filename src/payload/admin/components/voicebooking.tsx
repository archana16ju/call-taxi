"use client";

import React, { useEffect, useState } from "react";

interface VoiceBooking {
  _id: string;
  bookingId: string;
  status: "confirmed" | "pending" | "flagged" | "archived";
  transcript: string;
  pickup: { address: string };
  dropoff: { address: string };
  fare: { amount: number; currency: string };
  driver: { id: string; name: string };
  ai: { confidence: number };
  createdAt: string;
}

export default function VoiceBookingPage() {
  const [data, setData] = useState<VoiceBooking[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/voice-bookings")
      .then((res) => res.json())
      .then(setData);
  }, []);

  const filtered = data.filter((b) =>
    b.bookingId.toLowerCase().includes(search.toLowerCase()) ||
    b.driver.name.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "flagged":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* HEADER */}
      <div className="flex justify-between items-center p-6 border-b bg-white">
        <h1 className="text-xl font-bold">Voice Booking Data Store</h1>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by ID or driver..."
          className="px-4 py-2 border rounded-lg w-72"
        />
      </div>

      {/* CONTENT */}
      <div className="p-6 space-y-4">

        {filtered.map((b) => (
          <div
            key={b._id}
            className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition"
          >

            <div className="flex flex-col lg:flex-row gap-6">

              {/* LEFT */}
              <div className="flex-1 space-y-2">

                <div className="flex items-center gap-3">
                  <button className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    ▶
                  </button>

                  <span className="font-mono text-sm">{b.bookingId}</span>

                  <span
                    className={`text-xs px-2 py-1 rounded-full ${statusColor(
                      b.status
                    )}`}
                  >
                    {b.status}
                  </span>
                </div>

                <p className="text-sm text-slate-600 italic">
                  {b.transcript}
                </p>

                <div className="text-xs text-slate-500 flex gap-4">
                  <span>Driver: {b.driver.name}</span>
                  <span>
                    Confidence: {b.ai.confidence}%
                  </span>
                </div>
              </div>

              {/* ROUTE */}
              <div className="flex-1 grid grid-cols-2 gap-4 border-l pl-6">

                <div>
                  <p className="text-xs text-slate-400">Pickup</p>
                  <p className="font-medium">{b.pickup.address}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Dropoff</p>
                  <p className="font-medium">{b.dropoff.address}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Fare</p>
                  <p className="font-bold">
                    {b.fare.currency} {b.fare.amount}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Driver ID</p>
                  <p>{b.driver.id}</p>
                </div>
              </div>

              {/* AI SCORE CIRCLE */}
              <div className="w-24 flex items-center justify-center border-l pl-6">

                <div className="relative w-16 h-16">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="#e5e7eb"
                      strokeWidth="4"
                      fill="none"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="#3b82f6"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray="176"
                      strokeDashoffset={
                        176 - (176 * b.ai.confidence) / 100
                      }
                    />
                  </svg>

                  <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                    {b.ai.confidence}%
                  </div>
                </div>

              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-center text-slate-500">
            No bookings found
          </p>
        )}

      </div>
    </div>
  );
}