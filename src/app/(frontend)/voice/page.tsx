"use client";

import React, { useRef, useState } from "react";
import {
  Mic,
  Globe,
  Car,
  MessageCircle,
  Play,
  Volume2,
  ChevronDown,
} from "lucide-react";

export default function VoicePage() {
  const recognitionRef = useRef<any>(null);

  const [listening, setListening] = useState(false);
  const [status, setStatus] = useState("Idle");

  const [language, setLanguage] = useState("en-US");

  const [userText, setUserText] = useState("");
  const [aiReply, setAiReply] = useState(
    "Your AI assistant is ready."
  );

  const languages = [
    { label: "English (US)", value: "en-US" },
    { label: "Hindi", value: "hi-IN" },
    { label: "Tamil", value: "ta-IN" },
    { label: "Telugu", value: "te-IN" },
    { label: "Malayalam", value: "ml-IN" },
  ];

  const speak = (msg: string) => {
    const speech = new SpeechSynthesisUtterance(msg);
    speech.lang = language;
    window.speechSynthesis.speak(speech);
  };

  const startVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = language;

    recognition.onstart = () => {
      setListening(true);
      setStatus("Listening...");
    };

    recognition.onend = () => {
      setListening(false);
      setStatus("Idle");
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
          body: JSON.stringify({ message: transcript, language }),
        });

        const data = await res.json();

        setAiReply(data.reply || "Booking confirmed");
        speak(data.reply);

        setStatus("Completed");
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
    setStatus("Stopped");
  };

  return (
    <div className="min-h-screen bg-[#05060A] flex items-center justify-center px-4 relative overflow-hidden">

      {/* BACKGROUND GLOW ORBS */}
      <div className="absolute w-[600px] h-[600px] bg-cyan-500/10 blur-[150px] rounded-full top-[-200px] left-[-200px]" />
      <div className="absolute w-[600px] h-[600px] bg-purple-500/10 blur-[150px] rounded-full bottom-[-200px] right-[-200px]" />

      {/* FLOATING CENTER CARD */}
      <div className="relative w-full max-w-3xl">

        <div className="rounded-[32px] border border-cyan-400/20 bg-[#0B0F1A]/80 backdrop-blur-2xl shadow-[0_0_80px_rgba(0,255,255,0.08)] p-8 md:p-10 animate-float">

          {/* HEADER */}
          <div className="text-center mb-8">

            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Voice Booking AI
            </h1>

            <p className="text-cyan-300 mt-2">
              Futuristic Ride Assistant System
            </p>

            <div className="mt-3 inline-flex items-center gap-2 text-green-400 text-sm">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Online
            </div>
          </div>

          {/* STATUS */}
          <div className="bg-[#0F172A] border border-cyan-400/10 rounded-2xl p-4 mb-6 flex justify-between items-center text-sm text-slate-300">

            <span className="text-green-400">{status}</span>

            <span className="text-slate-400">AI Connected</span>
          </div>

          {/* LANGUAGE */}
          <div className="mb-6 relative">

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full h-14 rounded-2xl bg-[#0F172A] border border-cyan-400/10 px-4 text-white outline-none"
            >
              {languages.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>

            <Globe className="absolute right-4 top-4 text-cyan-400" />
          </div>

          {/* COMMAND BOX */}
          <div className="bg-[#0F172A] border border-cyan-400/10 rounded-2xl p-4 mb-6">

            <p className="text-slate-400 text-sm">User Command</p>

            <p className="text-white mt-2">
              {userText || "Speak something..."}
            </p>

            <p className="text-cyan-300 text-sm mt-3">
              AI: {aiReply}
            </p>
          </div>

          {/* MIC BUTTON CENTER */}
          <div className="flex flex-col items-center justify-center relative">

            <div className="absolute w-40 h-40 bg-cyan-400/20 blur-3xl rounded-full animate-pulse" />

            <button
              onClick={() =>
                listening ? stopVoice() : startVoice()
              }
              className={`relative w-40 h-40 rounded-full flex items-center justify-center border-4 transition-all ${
                listening
                  ? "bg-red-500 border-red-300 scale-110"
                  : "bg-gradient-to-br from-cyan-400 to-purple-500 border-cyan-300 hover:scale-105"
              }`}
            >
              <Mic size={60} className="text-white" />
            </button>

            <p className="text-slate-400 mt-4 text-center">
              Tap to start voice assistant
            </p>
          </div>

          {/* PLAY RESPONSE */}
          <div className="mt-8 flex justify-between items-center bg-[#0F172A] border border-cyan-400/10 p-4 rounded-2xl">

            <div className="flex items-center gap-3">

              <Volume2 className="text-purple-400" />

              <span className="text-white text-sm">
                Play AI Response
              </span>
            </div>

            <button
              onClick={() => speak(aiReply)}
              className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center"
            >
              <Play className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* FLOAT ANIMATION */}
      <style jsx>{`
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
}