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
      } catch (err) {
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
    <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
      <div className="w-[420px] p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">

        <h1 className="text-xl font-bold mb-4">
          Voice AI Booking
        </h1>

        {/* LANGUAGE */}
        <select
          className="w-full mb-4 bg-black/30 p-2 rounded-xl"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="en-US">English</option>
          <option value="ta-IN">Tamil</option>
          <option value="hi-IN">Hindi</option>
        </select>

        {/* TEXT */}
        <div className="p-4 bg-black/30 rounded-xl mb-4 text-sm">
          {text || "Speak something..."}
        </div>

        {text && (
          <div className="mt-4 p-3 bg-green-500/20 rounded-xl text-sm">
            🚖 Processing booking: {text}
          </div>
        )}

        {/* MIC BUTTON */}
        <button
          onClick={() => (listening ? stop() : start())}
          className={`w-full h-24 rounded-full flex items-center justify-center transition ${
            listening ? "bg-red-500 animate-pulse" : "bg-cyan-400"
          }`}
        >
          <Mic size={36} />
        </button>

        {/* SPEAK BUTTON */}
        <button
          onClick={() => speak(text)}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-white/10 py-3 rounded-xl"
        >
          <Volume2 size={18} />
          Play Response
        </button>

      </div>
    </div>
  );
}