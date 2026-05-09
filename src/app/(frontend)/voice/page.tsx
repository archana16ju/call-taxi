"use client";

import React, { useRef, useState } from "react";
import { Mic, Volume2 } from "lucide-react";

export default function VoiceUI() {
  const recognitionRef = useRef<any>(null);

  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [language, setLanguage] = useState("en-US");

  const speak = (msg: string) => {
    const speech = new SpeechSynthesisUtterance(msg);
    speech.lang = language;
    window.speechSynthesis.speak(speech);
  };

  const start = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      speak("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language;

    recognition.onstart = () => setListening(true);

    recognition.onerror = () => {
      setListening(false);
      speak("Microphone error. Please try again.");
    };

    recognition.onresult = async (e: any) => {
      const transcript = e.results[0][0].transcript;
      setText(transcript);

      try {
        const response = await fetch("/api/ai-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: transcript }),
        });

        const data = await response.json();
        speak(data.reply || "Your booking is confirmed");
      } catch {
        speak("Error processing booking. Please try again.");
      }
    };

    recognition.onend = () => setListening(false);

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stop = () => {
    recognitionRef.current?.stop();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050816] relative overflow-hidden text-white">

      {/* glowing background effects */}
      <div className="absolute w-[400px] h-[400px] bg-cyan-500/30 blur-[120px] top-10 left-10 rounded-full"></div>
      <div className="absolute w-[400px] h-[400px] bg-purple-500/30 blur-[120px] bottom-10 right-10 rounded-full"></div>

      <div className="w-[420px] p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl z-10">

        {/* TITLE */}
        <h1 className="text-2xl font-bold text-center mb-2">
          🎤 Voice AI Booking
        </h1>
        <p className="text-center text-gray-400 text-sm mb-5">
          Speak naturally — AI will handle your ride 🚖
        </p>

        {/* LANGUAGE */}
        <select
          className="w-full mb-4 bg-black/40 p-3 rounded-xl outline-none border border-white/10"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="en-US">English</option>
          <option value="ta-IN">Tamil</option>
          <option value="hi-IN">Hindi</option>
        </select>

        {/* TRANSCRIPT BOX */}
        <div className="p-4 bg-black/40 rounded-xl mb-5 min-h-[80px] text-sm border border-white/10">
          {text || "🎧 Waiting for your voice command..."}
        </div>

        {/* STATUS */}
        {text && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-400/20 rounded-xl text-sm">
            🚖 AI Processing: <span className="text-green-300">{text}</span>
          </div>
        )}

        {/* MIC BUTTON (GLOW ORB STYLE) */}
        <div className="flex justify-center mb-5">
          <button
            onClick={() => (listening ? stop() : start())}
            className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 ${
              listening
                ? "bg-red-500 shadow-[0_0_40px_rgba(255,0,0,0.6)] animate-pulse"
                : "bg-cyan-400 shadow-[0_0_40px_rgba(0,255,255,0.4)] hover:scale-110"
            }`}
          >
            <Mic size={34} />

            {/* pulse ring */}
            <span
              className={`absolute inset-0 rounded-full ${
                listening ? "animate-ping bg-red-400/30" : ""
              }`}
            ></span>
          </button>
        </div>

        {/* SPEAK BUTTON */}
        <button
          onClick={() => speak(text)}
          className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 transition py-3 rounded-xl border border-white/10"
        >
          <Volume2 size={18} />
          Play AI Response
        </button>
      </div>
    </div>
  );
}