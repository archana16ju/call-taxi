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

      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: transcript }),
      })

      const data = await response.json()
      speak(data.reply || 'Booking confirmed')
    }

    recognition.onend = () => setListening(false)

    recognition.start()
    recognitionRef.current = recognition
  }

  const stop = () => recognitionRef.current?.stop()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
        {/* HEADER */}
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-semibold">Voice Booking System</h1>
          <p className="text-xs text-gray-500">AI-powered ride assistant</p>
        </div>

        {/* BODY */}
        <div className="p-5 space-y-4">
          <select
            className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-3 rounded-lg"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en-US">English</option>
            <option value="ta-IN">Tamil</option>
            <option value="hi-IN">Hindi</option>
          </select>

          <div className="text-xs text-gray-500">
            Status:{' '}
            <span className={listening ? 'text-red-500' : 'text-green-500'}>
              {listening ? 'Listening...' : 'Idle'}
            </span>
          </div>

          <div className="min-h-[80px] p-3 rounded-lg bg-gray-100 dark:bg-gray-900 text-sm">
            {text || 'Speak a command...'}
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => (listening ? stop() : start())}
              className={`w-20 h-20 rounded-full flex items-center justify-center border transition ${
                listening ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
              }`}
            >
              <Mic size={28} />
            </button>
          </div>

          <button
            onClick={() => speak(text)}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 py-3 rounded-lg"
          >
            <Volume2 size={16} />
            Play Response
          </button>
        </div>
      </div>
    </div>
  )
}
