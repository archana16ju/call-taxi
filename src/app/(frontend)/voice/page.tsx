"use client";

import React, { useRef, useState } from "react";
import { Mic, X } from "lucide-react";

export default function VoicePage() {
  const recognitionRef = useRef<any>(null);

  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState(
    "I need a premium car for the airport at 6 PM."
  );
  const [aiReply, setAiReply] = useState(
    "Searching for the nearest executive sedans for 6:00 PM. Would you like to confirm the booking?"
  );
  const [status, setStatus] = useState("Searching...");

  const speak = (msg: string) => {
    const speech = new SpeechSynthesisUtterance(msg);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
  };

  const startVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      speak("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setListening(true);
      setStatus("Listening...");
    };

    recognition.onend = () => {
      setListening(false);
      setStatus("Searching...");
    };

    recognition.onerror = () => {
      setListening(false);
      setStatus("Error");
    };

    recognition.onresult = async (e: any) => {
      const transcript = e.results[0][0].transcript;
      setUserText(transcript);

      setStatus("Processing...");

      try {
        const res = await fetch("/api/ai-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: transcript }),
        });

        const data = await res.json();
        setAiReply(data.reply || "Booking confirmed");
        setStatus("Done");

        speak(data.reply);
      } catch {
        setAiReply("Error processing request");
        setStatus("Failed");
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopVoice = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  return (
    <div className="min-h-screen bg-[#131315] text-white flex flex-col items-center justify-center relative overflow-hidden">

      {/* BACKGROUND BLUR */}
      <div className="absolute inset-0 opacity-30 blur-2xl bg-gradient-to-b from-cyan-500/20 via-purple-500/10 to-black" />

      {/* HEADER */}
      <header className="absolute top-0 w-full flex justify-between items-center px-6 py-4 border-b border-white/10 backdrop-blur-xl">
        <h1 className="text-cyan-300 font-bold tracking-widest">
          AeroTaxi AI
        </h1>
        <button className="text-gray-400 hover:text-white">
          <X />
        </button>
      </header>

      {/* MAIN CARD */}
      <div className="relative z-10 w-full max-w-md glass-panel rounded-3xl p-8 border border-cyan-400/20 shadow-xl">

        {/* STATUS */}
        <div className="flex justify-between text-xs mb-8">
          <span className="text-cyan-300 animate-pulse">● Voice Active</span>
          <span className="text-purple-300">{status}</span>
        </div>

        {/* USER TEXT */}
        <div className="mb-6">
          <p className="text-xs text-gray-400 mb-2">User Input</p>
          <p className="text-lg font-semibold text-white">
            "{userText}"
          </p>
        </div>

        {/* AI RESPONSE */}
        <div className="flex gap-3 bg-white/5 p-4 rounded-xl border border-white/10 mb-10">
          <div className="text-cyan-300">✨</div>
          <p className="text-sm text-gray-200">{aiReply}</p>
        </div>

        {/* VOICE BUTTON */}
        <div className="flex justify-center mb-6 relative">
          <div className="absolute w-28 h-28 bg-cyan-400/20 blur-3xl rounded-full animate-pulse" />

          <button
            onClick={() => (listening ? stopVoice() : startVoice())}
            className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-lg ${
              listening
                ? "bg-red-500 scale-110"
                : "bg-cyan-400 hover:scale-105"
            }`}
          >
            <Mic size={36} className="text-black" />
          </button>
        </div>

        {/* CONFIRM BUTTON */}
        <button className="w-full py-4 bg-cyan-400 text-black font-bold rounded-2xl hover:bg-cyan-300 transition">
          CONFIRM BOOKING
        </button>
      </div>

      {/* BOTTOM NAV */}
      <nav className="absolute bottom-0 w-full flex justify-around items-center py-4 border-t border-white/10 backdrop-blur-xl text-gray-400">
        <button className="text-cyan-300">🎤 Listen</button>
        <button>📜 History</button>
        <button>🗺 Map</button>
        <button>⚙ Settings</button>
      </nav>

      {/* AUDIO VISUALIZER */}
      <div className="absolute bottom-20 flex gap-1 opacity-40">
        {[4, 8, 12, 6, 10, 14, 8, 5].map((h, i) => (
          <div
            key={i}
            className="w-1 bg-cyan-400 rounded-full animate-bounce"
            style={{ height: `${h * 2}px`, animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>

      {/* GLASS STYLE */}
      <style jsx>{`
        .glass-panel {
          backdrop-filter: blur(24px);
          background: rgba(255, 255, 255, 0.03);
        }
      `}</style>
    </div>
  );
}