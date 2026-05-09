'use client'

import React, { useRef, useState } from 'react'
import { Mic, Volume2 } from 'lucide-react'

export default function VoiceUI() {
  const recognitionRef = useRef<any>(null)

  const [text, setText] = useState('')
  const [listening, setListening] = useState(false)
  const [language, setLanguage] = useState('en-US')

  const speak = (msg: string) => {
    const speech = new SpeechSynthesisUtterance(msg)
    speech.lang = language
    window.speechSynthesis.speak(speech)
  }

  const start = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      speak('Speech recognition not supported')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = language

    recognition.onstart = () => setListening(true)

    recognition.onerror = () => {
      setListening(false)
      speak('Microphone error. Please try again.')
    }

    recognition.onresult = async (e: any) => {
      const transcript = e.results[0][0].transcript
      setText(transcript)

      try {
        const response = await fetch('/api/ai-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: transcript }),
        })

        const data = await response.json()
        speak(data.reply || 'Booking confirmed')
      } catch {
        speak('Error processing request')
      }
    }

    recognition.onend = () => setListening(false)

    recognition.start()
    recognitionRef.current = recognition
  }

  const stop = () => {
    recognitionRef.current?.stop()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a] text-white px-4">
      {/* MAIN PANEL */}
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111827] shadow-xl">
        {/* HEADER */}
        <div className="p-5 border-b border-white/10">
          <h1 className="text-xl font-semibold">Voice Booking System</h1>
          <p className="text-xs text-gray-400 mt-1">AI-powered ride assistant control panel</p>
        </div>

        {/* BODY */}
        <div className="p-5 space-y-4">
          {/* LANGUAGE */}
          <div>
            <label className="text-xs text-gray-400">Language</label>
            <select
              className="w-full mt-1 bg-[#0f172a] border border-white/10 p-3 rounded-lg outline-none"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en-US">English</option>
              <option value="ta-IN">Tamil</option>
              <option value="hi-IN">Hindi</option>
            </select>
          </div>

          {/* STATUS */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Status</span>

            <span
              className={`text-xs px-3 py-1 rounded-full border ${
                listening
                  ? 'bg-red-500/20 border-red-400 text-red-300'
                  : 'bg-green-500/10 border-green-400 text-green-300'
              }`}
            >
              {listening ? 'Listening...' : 'Idle'}
            </span>
          </div>

          {/* TEXT OUTPUT */}
          <div className="min-h-[80px] bg-[#0f172a] border border-white/10 rounded-lg p-3 text-sm text-gray-200">
            {text || 'Speak a command to start booking...'}
          </div>

          {/* MIC BUTTON */}
          <div className="flex justify-center pt-2">
            <button
              onClick={() => (listening ? stop() : start())}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 border ${
                listening
                  ? 'bg-red-500 border-red-400 shadow-lg scale-105'
                  : 'bg-cyan-500 border-cyan-400 hover:scale-105'
              }`}
            >
              <Mic size={30} />
            </button>
          </div>

          {/* SPEAK BUTTON */}
          <button
            onClick={() => speak(text)}
            className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-lg text-sm"
          >
            <Volume2 size={16} />
            Play Response
          </button>
        </div>
      </div>
    </div>
  )
}
