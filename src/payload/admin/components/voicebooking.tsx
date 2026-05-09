"use client";

import React, { useEffect, useMemo, useState } from "react";

interface VoiceBooking {
  _id: string;
  bookingId: string;
  status: "confirmed" | "pending" | "flagged" | "archived";
  transcript: string;

  pickup: { address: string };
  dropoff: { address: string };

  fare: { amount: number; currency: string };

  driver: {
    id: string;
    name: string;
    vehicle?: string;
  };

  allocatedTime: string;
  estimatedArrival: string;

  ai: { confidence: number };

  bookingType: "standard" | "premium" | "luxury";

  createdAt: string;
}

const statusStyles = {
  confirmed: "bg-emerald-500/15 text-emerald-400",
  pending: "bg-yellow-500/15 text-yellow-400",
  flagged: "bg-red-500/15 text-red-400",
  archived: "bg-slate-500/15 text-slate-300",
};

export default function VoiceBookingDashboard() {
  const [bookings, setBookings] = useState<VoiceBooking[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    fetch("/api/voice-bookings")
      .then((r) => r.json())
      .then(setBookings);
  }, []);

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const matchSearch =
        b.bookingId.toLowerCase().includes(search.toLowerCase()) ||
        b.driver.name.toLowerCase().includes(search.toLowerCase()) ||
        b.pickup.address.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        status === "all" ? true : b.status === status;

      return matchSearch && matchStatus;
    });
  }, [bookings, search, status]);

  return (
    <div className="min-h-screen bg-[#050816] text-white p-6">
      <h1 className="text-3xl font-bold mb-6">
        Voice Booking Dashboard
      </h1>

      {/* FILTERS */}
      <div className="flex gap-3 mb-5">
        {["all", "confirmed", "pending", "flagged"].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-4 py-2 rounded-full text-sm ${
              status === s
                ? "bg-cyan-400 text-black"
                : "bg-white/10"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {filtered.map((b) => (
          <div
            key={b._id}
            className="p-5 rounded-2xl bg-white/5 border border-white/10"
          >
            <div className="flex justify-between">
              <h2 className="font-bold">{b.bookingId}</h2>

              <span
                className={`px-3 py-1 rounded-full text-xs ${statusStyles[b.status]}`}
              >
                {b.status}
              </span>
            </div>

            <p className="text-slate-400 mt-2 text-sm">
              {b.transcript}
            </p>

            <div className="grid grid-cols-2 gap-3 mt-4 text-sm text-slate-300">
              <p>📍 {b.pickup.address}</p>
              <p>📍 {b.dropoff.address}</p>
              <p>🚗 {b.driver.name}</p>
              <p>💰 {b.fare.currency}{b.fare.amount}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}