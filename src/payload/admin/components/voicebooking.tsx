"use client";

import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Play,
  MapPin,
  Car,
  ShieldCheck,
  Calendar,
  Clock3,
} from "lucide-react";

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
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetch("/api/voice-bookings")
      .then((res) => res.json())
      .then(setData);
  }, []);

  const filtered = data.filter((b) => {
    const matchesSearch =
      b.bookingId.toLowerCase().includes(search.toLowerCase()) ||
      b.driver.name.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      activeTab === "all" || b.status === activeTab;

    return matchesSearch && matchesStatus;
  });

  const statusStyles = {
    confirmed:
      "bg-emerald-100 text-emerald-700 border border-emerald-200",

    pending:
      "bg-amber-100 text-amber-700 border border-amber-200",

    flagged:
      "bg-red-100 text-red-700 border border-red-200",

    archived:
      "bg-slate-100 text-slate-600 border border-slate-200",
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900 p-6">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">

        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Voice Booking Dashboard
          </h1>

          <p className="text-slate-500 mt-2">
            AI-powered smart taxi booking system
          </p>
        </div>

        {/* SEARCH */}
        <div className="flex items-center gap-3">

          <div className="relative">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search bookings..."
              className="w-[280px] bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 outline-none text-sm text-slate-700 shadow-sm focus:border-cyan-400"
            />
          </div>

          <button className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-slate-200 hover:border-cyan-400 transition shadow-sm">
            <Filter size={16} />
            Filter
          </button>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex gap-3 mb-8 flex-wrap">

        {[
          "all",
          "confirmed",
          "pending",
          "flagged",
          "archived",
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-xl capitalize transition-all ${
              activeTab === tab
                ? "bg-cyan-500 text-white font-semibold"
                : "bg-white border border-slate-200 text-slate-600 hover:border-cyan-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* BOOKINGS */}
      <div className="space-y-6">

        {filtered.map((b) => (
          <div
            key={b._id}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition"
          >

            {/* TOP */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">

              {/* LEFT */}
              <div className="flex items-start gap-4">

                <button className="w-14 h-14 rounded-full bg-cyan-100 border border-cyan-200 flex items-center justify-center hover:scale-105 transition">
                  <Play
                    size={20}
                    className="text-cyan-600 fill-cyan-600"
                  />
                </button>

                <div>

                  <div className="flex items-center gap-3 flex-wrap">

                    <h2 className="text-xl font-semibold text-slate-900">
                      {b.bookingId}
                    </h2>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusStyles[b.status]
                      }`}
                    >
                      {b.status}
                    </span>

                    <span className="px-3 py-1 rounded-full text-xs bg-cyan-100 text-cyan-700 border border-cyan-200">
                      Premium
                    </span>
                  </div>

                  <p className="text-slate-600 italic mt-3 text-lg">
                    "{b.transcript}"
                  </p>
                </div>
              </div>

              {/* DATE */}
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Calendar size={16} />
                {new Date(b.createdAt).toLocaleString()}
              </div>
            </div>

            {/* DETAILS */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-6">

              {/* PICKUP */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-cyan-600 mb-2">
                  <MapPin size={16} />
                  Pickup
                </div>

                <p className="text-slate-700 text-sm">
                  {b.pickup.address}
                </p>
              </div>

              {/* DROPOFF */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-cyan-600 mb-2">
                  <MapPin size={16} />
                  Dropoff
                </div>

                <p className="text-slate-700 text-sm">
                  {b.dropoff.address}
                </p>
              </div>

              {/* DRIVER */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-cyan-600 mb-2">
                  <Car size={16} />
                  Driver
                </div>

                <p className="text-slate-700 text-sm">
                  {b.driver.name}
                </p>

                <p className="text-slate-400 text-xs mt-1">
                  {b.driver.id}
                </p>
              </div>

              {/* TIME */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-cyan-600 mb-2">
                  <Clock3 size={16} />
                  Allocated
                </div>

                <p className="text-slate-700 text-sm">
                  {new Date(
                    b.createdAt
                  ).toLocaleTimeString()}
                </p>

                <p className="text-slate-400 text-xs mt-1">
                  ETA: 10 mins
                </p>
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mt-6 border-t border-slate-200 pt-5">

              {/* FARE */}
              <div>
                <p className="text-slate-500 text-sm mb-1">
                  Fare
                </p>

                <div className="flex items-center gap-2">

                  <span className="text-3xl font-bold text-cyan-600">
                    {b.fare.currency}
                    {b.fare.amount}
                  </span>

                  <span className="px-2 py-1 rounded-md bg-slate-100 text-xs text-slate-600">
                    GBP
                  </span>
                </div>
              </div>

              {/* AI SCORE */}
              <div className="flex items-center gap-5">

                <div className="relative w-20 h-20">

                  <svg
                    className="w-full h-full -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      stroke="#e2e8f0"
                      strokeWidth="8"
                      fill="none"
                    />

                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      stroke="#06b6d4"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray="264"
                      strokeDashoffset={
                        264 -
                        (264 * b.ai.confidence) / 100
                      }
                    />
                  </svg>

                  <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-slate-800">
                    {b.ai.confidence}%
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-cyan-600 font-semibold">
                    <ShieldCheck size={18} />
                    AI Verified
                  </div>

                  <p className="text-slate-500 text-sm mt-1">
                    Voice booking confidence score
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            No bookings found
          </div>
        )}
      </div>
    </div>
  );
}