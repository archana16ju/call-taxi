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

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = language;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;

      setText(transcript);

      // AI response simulation
      speak("Booking received. Processing your request.");
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

        {/* MIC BUTTON */}
        <button
          onMouseDown={start}
          onMouseUp={stop}
          className={`w-full h-24 rounded-full flex items-center justify-center transition ${
            listening
              ? "bg-red-500 animate-pulse"
              : "bg-cyan-400"
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