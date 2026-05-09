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
  driver: { id: string; name: string; vehicle?: string };
  allocatedTime: string;
  estimatedArrival: string;
  ai: { confidence: number };
  bookingType: "standard" | "premium" | "luxury";
  createdAt: string;
}

const statusStyles: any = {
  confirmed: "bg-green-500/15 text-green-400",
  pending: "bg-yellow-500/15 text-yellow-400",
  flagged: "bg-red-500/15 text-red-400",
  archived: "bg-gray-500/15 text-gray-300",
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

      const matchStatus = status === "all" ? true : b.status === status;

      return matchSearch && matchStatus;
    });
  }, [bookings, search, status]);

  return (
    <div className="min-h-screen bg-[#050816] text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          🚖 Voice Booking Collection
        </h1>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search bookings..."
          className="px-4 py-2 rounded-lg bg-white/10 border border-white/10 outline-none"
        />
      </div>

      {/* FILTERS */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", "confirmed", "pending", "flagged", "archived"].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-4 py-2 rounded-full text-xs border transition ${
              status === s
                ? "bg-cyan-400 text-black"
                : "bg-white/5 border-white/10"
            }`}
          >
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-gray-300">
            <tr>
              <th className="p-3 text-left">Booking ID</th>
              <th className="p-3 text-left">Driver</th>
              <th className="p-3 text-left">Pickup</th>
              <th className="p-3 text-left">Dropoff</th>
              <th className="p-3 text-left">Fare</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">AI Score</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((b) => (
              <tr
                key={b._id}
                className="border-t border-white/10 hover:bg-white/5 transition"
              >
                <td className="p-3 font-semibold">{b.bookingId}</td>

                <td className="p-3">
                  {b.driver.name}
                  <div className="text-xs text-gray-400">
                    {b.driver.vehicle}
                  </div>
                </td>

                <td className="p-3 text-gray-300">
                  {b.pickup.address}
                </td>

                <td className="p-3 text-gray-300">
                  {b.dropoff.address}
                </td>

                <td className="p-3">
                  {b.fare.currency} {b.fare.amount}
                </td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${statusStyles[b.status]}`}
                  >
                    {b.status}
                  </span>
                </td>

                <td className="p-3 text-cyan-300">
                  {b.ai.confidence}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EMPTY STATE */}
      {filtered.length === 0 && (
        <div className="text-center text-gray-400 mt-10">
          No bookings found
        </div>
      )}
    </div>
  );
}