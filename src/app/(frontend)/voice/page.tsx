'use client'

import React, { useRef, useState } from 'react'
import { Mic, Globe, Car, MessageCircle, Play, Volume2, ChevronDown } from 'lucide-react'

export default function VoicePage() {
  const recognitionRef = useRef<any>(null)

  const [listening, setListening] = useState(false)

  const [userText, setUserText] = useState('')

  const [aiReply, setAiReply] = useState('Your AI assistant is ready.')

  const [status, setStatus] = useState('Idle')

  // LANGUAGE STATE
  const [language, setLanguage] = useState('en-US')

  // SUPPORTED LANGUAGES
  const languages = [
    { label: 'English (US)', value: 'en-US' },
    { label: 'Hindi', value: 'hi-IN' },
    { label: 'Tamil', value: 'ta-IN' },
    { label: 'Telugu', value: 'te-IN' },
    { label: 'Malayalam', value: 'ml-IN' },
    { label: 'Kannada', value: 'kn-IN' },
    { label: 'Spanish', value: 'es-ES' },
    { label: 'French', value: 'fr-FR' },
  ]

  // TEXT TO SPEECH
  const speak = (msg: string) => {
    const speech = new SpeechSynthesisUtterance(msg)

    speech.lang = language

    window.speechSynthesis.speak(speech)
  }

  // START VOICE
  const startVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert('Speech recognition not supported')
      return
    }

    const recognition = new SpeechRecognition()

    recognition.lang = language

    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => {
      setListening(true)
      setStatus('Listening...')
    }

    recognition.onend = () => {
      setListening(false)
      setStatus('Idle')
    }

    recognition.onerror = () => {
      setListening(false)
      setStatus('Error')
    }

    // CONVERT VOICE TO TEXT
    recognition.onresult = async (e: any) => {
      const transcript = e.results[0][0].transcript

      // STORE TRANSCRIPT
      setUserText(transcript)

      setStatus('Processing...')

      try {
        // OPTIONAL AI API CALL
        const res = await fetch('/api/ai-chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: transcript,
            language,
          }),
        })

        const data = await res.json()

        setAiReply(data.reply || 'Booking confirmed')

        speak(data.reply)

        setStatus('Done')
      } catch {
        setAiReply('Error processing request')
        setStatus('Failed')
      }
    }

    recognition.start()

    recognitionRef.current = recognition
  }

  // STOP LISTENING
  const stopVoice = () => {
    recognitionRef.current?.stop()

    setListening(false)

    setStatus('Stopped')
  }

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-white relative overflow-hidden">
      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,255,0.08),transparent_40%)]" />

      {/* MAIN CARD */}
      <div className="relative w-full max-w-5xl rounded-[36px] border border-cyan-400/20 bg-[#071028]/90 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,255,255,0.08)] p-8 md:p-10">
        {/* HEADER */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full border border-cyan-400/30 bg-cyan-400/10 flex items-center justify-center">
              <Mic className="text-cyan-300" size={36} />
            </div>

            <div>
              <h1 className="text-4xl font-bold">Voice Booking System</h1>

              <p className="text-gray-400 text-lg mt-1">AI Powered Ride Assistant</p>
            </div>
          </div>

          {/* ONLINE */}
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-green-400/20 bg-green-400/10 text-green-300">
            <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
            Online
          </div>
        </div>

        {/* AI READY */}
        <div className="rounded-3xl border border-cyan-400/10 bg-[#0b1733] px-6 py-5 flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-cyan-400/10 flex items-center justify-center">
              <Car className="text-cyan-300" size={30} />
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-cyan-300">Your AI Assistant is Ready</h2>

              <p className="text-gray-400 mt-1">Speak naturally and book your ride easily.</p>
            </div>
          </div>

          {/* WAVE */}
          <div className="hidden md:flex items-end gap-2 h-16">
            {[18, 28, 40, 60, 30, 50, 22, 38].map((h, i) => (
              <div
                key={i}
                className="w-1 rounded-full bg-cyan-300 animate-pulse"
                style={{
                  height: `${h}px`,
                }}
              />
            ))}
          </div>
        </div>

        {/* LANGUAGE SELECT */}
        <div className="mb-6">
          <p className="text-2xl font-semibold mb-4">Language</p>

          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full h-20 rounded-2xl border border-cyan-400/15 bg-[#081329] px-6 text-xl text-white appearance-none outline-none"
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value} className="bg-[#081329]">
                  {lang.label}
                </option>
              ))}
            </select>

            <div className="absolute left-5 top-1/2 -translate-y-1/2">
              <Globe className="text-cyan-300" />
            </div>

            <div className="absolute right-5 top-1/2 -translate-y-1/2">
              <ChevronDown className="text-gray-400" />
            </div>
          </div>
        </div>

        {/* STATUS */}
        <div className="mb-6">
          <p className="text-2xl font-semibold mb-4">Listening Status</p>

          <div className="h-20 rounded-2xl border border-cyan-400/15 bg-[#081329] flex items-center justify-between px-6">
            <div className="flex items-center gap-3 text-green-400 font-medium text-lg">
              <span className="w-4 h-4 rounded-full border-4 border-green-400 animate-pulse" />
              {status}
            </div>

            <span className="text-gray-400">Click microphone to start</span>
          </div>
        </div>

        {/* TRANSCRIBED TEXT */}
        <div className="mb-10">
          <p className="text-2xl font-semibold mb-4">Voice Booking Text</p>

          <div className="min-h-[120px] rounded-2xl border border-cyan-400/15 bg-[#081329] p-6 flex gap-4">
            <div className="w-14 h-14 rounded-full bg-indigo-500/10 flex items-center justify-center">
              <MessageCircle className="text-indigo-300" />
            </div>

            <div className="flex-1">
              <p className="text-lg text-gray-200">
                {userText || 'Your voice will appear here...'}
              </p>

              <p className="text-sm text-gray-500 mt-4">AI Response: {aiReply}</p>
            </div>
          </div>
        </div>

        {/* MAIN MIC */}
        <div className="flex flex-col items-center justify-center py-8 relative">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-3xl scale-125 animate-pulse" />

            <button
              onClick={() => (listening ? stopVoice() : startVoice())}
              className={`relative w-52 h-52 rounded-full flex items-center justify-center border-4 transition-all duration-300 shadow-2xl ${
                listening
                  ? 'bg-red-500 border-red-300 scale-105'
                  : 'bg-gradient-to-br from-cyan-300 to-blue-500 border-cyan-200 hover:scale-105'
              }`}
            >
              <Mic size={70} className="text-white" />
            </button>
          </div>

          <h2 className="text-4xl font-bold mt-8">Tap to Start Listening</h2>

          <p className="text-gray-400 text-xl mt-2">
            Speech converts into booking text automatically
          </p>
        </div>

        {/* PLAY RESPONSE */}
        <div className="mt-10 rounded-3xl border border-cyan-400/10 bg-[#0b1733] p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Volume2 className="text-purple-300" />
            </div>

            <div>
              <h3 className="text-2xl font-semibold">Play AI Response</h3>

              <p className="text-gray-400">Listen to AI assistant response</p>
            </div>
          </div>

          <button
            onClick={() => speak(aiReply)}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center hover:scale-105 transition"
          >
            <Play className="text-white fill-white" size={30} />
          </button>
        </div>
      </div>
    </div>
  )
}
