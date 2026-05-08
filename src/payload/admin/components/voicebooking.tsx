
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Mic,
  Play,
  Search,
  Filter,
  Waves,
  Car,
  Clock3,
  MapPin,
  ShieldCheck,
} from "lucide-react";

interface VoiceBooking {
  _id: string;
  bookingId: string;

  status: "confirmed" | "pending" | "flagged" | "archived";

  transcript: string;

  pickup: {
    address: string;
  };

  dropoff: {
    address: string;
  };

  fare: {
    amount: number;
    currency: string;
  };

  driver: {
    id: string;
    name: string;
    vehicle?: string;
  };

  allocatedTime: string;

  estimatedArrival: string;

  ai: {
    confidence: number;
  };

  bookingType: "standard" | "premium" | "luxury";

  createdAt: string;
}

const statusStyles = {
  confirmed:
    "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",

  pending:
    "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",

  flagged:
    "bg-red-500/15 text-red-400 border-red-500/30",

  archived:
    "bg-slate-500/15 text-slate-300 border-slate-500/30",
};

export default function VoiceBookingDashboard() {
  const [bookings, setBookings] = useState<VoiceBooking[]>([]);
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState<
    "all" | "confirmed" | "pending" | "flagged" | "archived"
  >("all");
  const [isCreating, setIsCreating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/voice-bookings");

      const data = await response.json();

      setBookings(data);
    } catch (error) {
      console.error(error);
    }
  };

  const createBooking = async () => {
    setIsCreating(true);
    try {
      const response = await fetch("/api/voice-bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transcript: "Book me a premium taxi to Heathrow Airport at 6 PM.",
          status: "confirmed",
        }),
      });

      if (response.ok) {
        await fetchBookings();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" });
        setAudioBlob(blob);
        // In a real app, you would now send this blob to /api/voice-bookings
        createBooking(); 
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      console.error("Mic access denied:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch =
        booking.bookingId
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        booking.driver.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        booking.pickup.address
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        booking.dropoff.address
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        activeStatus === "all"
          ? true
          : booking.status === activeStatus;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, activeStatus]);

  return (
    <div className="min-h-screen bg-[#050816] text-white p-6">
      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
        {/* LEFT PANEL */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-6">
          {/* HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Voice Booking Dashboard
              </h1>

              <p className="text-slate-400 mt-1 text-sm">
                AI-powered smart taxi booking system with
                voice automation.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-4 py-3">
                <Search size={16} className="text-slate-400" />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search bookings..."
                  className="bg-transparent outline-none text-sm placeholder:text-slate-500"
                />
              </div>

              <button className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 hover:bg-white/10 transition">
                <Filter size={16} />
              </button>
            </div>
          </div>

          {/* FILTERS */}
          <div className="flex flex-wrap gap-3 mb-6">
            {[
              "all",
              "confirmed",
              "pending",
              "flagged",
              "archived",
            ].map((status) => (
              <button
                key={status}
                onClick={() =>
                  setActiveStatus(
                    status as
                      | "all"
                      | "confirmed"
                      | "pending"
                      | "flagged"
                      | "archived"
                  )
                }
                className={`px-4 py-2 rounded-full border text-sm capitalize transition ${
                  activeStatus === status
                    ? "bg-cyan-400 text-black border-cyan-400"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* BOOKINGS */}
          <div className="space-y-4 max-h-[82vh] overflow-auto pr-2">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="rounded-3xl border border-white/10 bg-[#0B1222] p-5 hover:border-cyan-400/40 transition-all duration-300"
              >
                <div className="flex gap-4">
                  {/* AUDIO */}
                  <button className="h-12 w-12 rounded-full bg-cyan-400 text-black flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.45)]">
                    <Play size={18} fill="black" />
                  </button>

                  {/* CONTENT */}
                  <div className="flex-1">
                    {/* TOP */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="font-bold text-lg">
                          {booking.bookingId}
                        </h2>

                        <span
                          className={`px-3 py-1 rounded-full border text-xs font-medium capitalize ${
                            statusStyles[booking.status]
                          }`}
                        >
                          {booking.status}
                        </span>

                        <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs capitalize">
                          {booking.bookingType}
                        </span>
                      </div>

                      <div className="text-sm text-slate-400">
                        {new Date(
                          booking.createdAt
                        ).toLocaleString()}
                      </div>
                    </div>

                    {/* TRANSCRIPT */}
                    <div className="rounded-2xl bg-black/20 border border-white/5 p-4 mb-5">
                      <p className="text-slate-300 italic leading-relaxed">
                        "{booking.transcript}"
                      </p>
                    </div>

                    {/* DETAILS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                      {/* PICKUP */}
                      <div className="rounded-2xl bg-white/5 border border-white/5 p-4">
                        <div className="flex items-center gap-2 mb-2 text-cyan-300">
                          <MapPin size={16} />
                          <span className="text-xs uppercase">
                            Pickup
                          </span>
                        </div>

                        <p className="font-medium text-sm">
                          {booking.pickup.address}
                        </p>
                      </div>

                      {/* DROPOFF */}
                      <div className="rounded-2xl bg-white/5 border border-white/5 p-4">
                        <div className="flex items-center gap-2 mb-2 text-cyan-300">
                          <MapPin size={16} />
                          <span className="text-xs uppercase">
                            Dropoff
                          </span>
                        </div>

                        <p className="font-medium text-sm">
                          {booking.dropoff.address}
                        </p>
                      </div>

                      {/* DRIVER */}
                      <div className="rounded-2xl bg-white/5 border border-white/5 p-4">
                        <div className="flex items-center gap-2 mb-2 text-cyan-300">
                          <Car size={16} />
                          <span className="text-xs uppercase">
                            Driver
                          </span>
                        </div>

                        <p className="font-semibold text-sm">
                          {booking.driver.name}
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          {booking.driver.id}
                        </p>

                        {booking.driver.vehicle && (
                          <p className="text-xs text-slate-500 mt-1">
                            {booking.driver.vehicle}
                          </p>
                        )}
                      </div>

                      {/* TIME */}
                      <div className="rounded-2xl bg-white/5 border border-white/5 p-4">
                        <div className="flex items-center gap-2 mb-2 text-cyan-300">
                          <Clock3 size={16} />
                          <span className="text-xs uppercase">
                            Allocated
                          </span>
                        </div>

                        <p className="font-semibold text-sm">
                          {booking.allocatedTime}
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          ETA: {booking.estimatedArrival}
                        </p>
                      </div>
                    </div>

                    {/* BOTTOM */}
                    <div className="mt-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* FARE */}
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-xs text-slate-500 uppercase mb-1">
                            Fare
                          </p>

                          <h3 className="text-2xl font-bold text-cyan-300">
                            {booking.fare.currency}
                            {booking.fare.amount}
                          </h3>
                        </div>
                      </div>

                      {/* CONFIDENCE */}
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16">
                          <svg
                            className="h-16 w-16 rotate-[-90deg]"
                            viewBox="0 0 120 120"
                          >
                            <circle
                              cx="60"
                              cy="60"
                              r="50"
                              stroke="#1E293B"
                              strokeWidth="10"
                              fill="none"
                            />

                            <circle
                              cx="60"
                              cy="60"
                              r="50"
                              stroke="#22D3EE"
                              strokeWidth="10"
                              fill="none"
                              strokeDasharray={314}
                              strokeDashoffset={
                                314 -
                                (314 *
                                  booking.ai.confidence) /
                                  100
                              }
                              strokeLinecap="round"
                            />
                          </svg>

                          <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                            {booking.ai.confidence}%
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 text-emerald-400">
                            <ShieldCheck size={18} />

                            <span className="font-medium">
                              AI Verified
                            </span>
                          </div>

                          <p className="text-xs text-slate-400 mt-1">
                            Voice booking confidence score
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-[#08111F] via-[#091224] to-[#04070D] p-8 flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.15),transparent_70%)]" />

          <div className="relative z-10 w-full max-w-sm rounded-[32px] border border-cyan-500/20 bg-white/5 backdrop-blur-2xl p-6 shadow-[0_0_80px_rgba(34,211,238,0.12)]">
            {/* STATUS */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />

                <span className="text-sm text-cyan-300">
                  AI Listening
                </span>
              </div>

              <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300">
                Voice Active
              </div>
            </div>

            {/* VOICE TEXT */}
            <div className="mb-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-3">
                Voice Input
              </p>

              <h2 className="text-2xl font-bold leading-relaxed text-cyan-300">
                “Book me a premium taxi to Heathrow
                Airport at 6 PM.”
              </h2>
            </div>

            {/* AI RESPONSE */}
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5 mb-8">
              <p className="text-sm text-slate-300 leading-relaxed">
                Searching nearby executive drivers and
                calculating estimated fare. Your ride will
                arrive in approximately 5 minutes.
              </p>
            </div>

            {/* MIC */}
            <div className="flex justify-center mb-8">
              <button 
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                className={`relative flex h-28 w-28 items-center justify-center rounded-full transition-all duration-300 ${
                  isRecording 
                    ? "bg-red-500 text-white shadow-[0_0_70px_rgba(239,68,68,0.65)]" 
                    : "bg-cyan-400 text-black shadow-[0_0_70px_rgba(34,211,238,0.65)]"
                }`}
              >
                {isRecording && (
                  <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
                )}
                {!isRecording && (
                  <div className="absolute inset-0 rounded-full bg-cyan-400/20 animate-ping" />
                )}

                <Mic size={40} />
              </button>
            </div>

            {/* BUTTON */}
            <button 
              onClick={createBooking}
              disabled={isCreating}
              className="w-full rounded-2xl bg-cyan-400 py-4 font-bold text-black hover:bg-cyan-300 transition-all duration-300 disabled:opacity-50"
            >
              {isCreating ? "PROCESSING..." : "CONFIRM BOOKING"}
            </button>

            {/* SOUND */}
            <div className="mt-8 flex justify-center">
              <Waves
                size={42}
                className="text-cyan-400 animate-pulse"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}