'use client'

import React, { useState } from 'react'

type Preset = {
  presetName: string
  acLevel: string
  music: string
  notes?: string
}

const RidePreferencesPage: React.FC = () => {
  const [preferences, setPreferences] = useState({
    childSeat: false,
    extraLuggage: false,
    petFriendly: false,
    wheelchairAccess: false,
    acLevel: 'medium',
    music: 'soft',
  })

  const [presets, setPresets] = useState<Preset[]>([
    { presetName: 'Office Mode', acLevel: 'low', music: 'off' },
    { presetName: 'Relax Mode', acLevel: 'high', music: 'soft' },
  ])

  const [selectedPreset, setSelectedPreset] = useState<string>('')

  const toggle = (key: string) => {
    setPreferences((prev: any) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const applyPreset = (presetName: string) => {
    const preset = presets.find((p) => p.presetName === presetName)
    if (!preset) return

    setPreferences((prev) => ({
      ...prev,
      acLevel: preset.acLevel,
      music: preset.music,
    }))

    setSelectedPreset(presetName)
  }

  return (
    <div style={styles.container}>
      <h2>🚗 Smart Ride Personalization</h2>

      {/* Preferences */}
      <div style={styles.card}>
        <h3>Travel Preferences</h3>

        {[
          ['childSeat', 'Child Seat'],
          ['extraLuggage', 'Extra Luggage'],
          ['petFriendly', 'Pet Friendly'],
          ['wheelchairAccess', 'Wheelchair Access'],
        ].map(([key, label]) => (
          <div key={key} style={styles.row}>
            <span>{label}</span>
            <input
              type="checkbox"
              checked={(preferences as any)[key]}
              onChange={() => toggle(key)}
            />
          </div>
        ))}
      </div>

      {/* Comfort */}
      <div style={styles.card}>
        <h3>Comfort Settings</h3>

        <div style={styles.row}>
          <span>AC Level</span>
          <select
            value={preferences.acLevel}
            onChange={(e) => setPreferences({ ...preferences, acLevel: e.target.value })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div style={styles.row}>
          <span>Music</span>
          <select
            value={preferences.music}
            onChange={(e) => setPreferences({ ...preferences, music: e.target.value })}
          >
            <option value="off">Off</option>
            <option value="soft">Soft</option>
            <option value="loud">Loud</option>
          </select>
        </div>
      </div>

      {/* Presets */}
      <div style={styles.card}>
        <h3>Ride Presets</h3>

        {presets.map((preset, i) => (
          <button
            key={i}
            style={{
              ...styles.presetBtn,
              background: selectedPreset === preset.presetName ? '#4cafef' : '#eee',
            }}
            onClick={() => applyPreset(preset.presetName)}
          >
            {preset.presetName}
          </button>
        ))}
      </div>

      {/* Save */}
      <button style={styles.saveBtn}>Save Preferences</button>
    </div>
  )
}

const styles: any = {
  container: {
    padding: 20,
    fontFamily: 'Arial',
  },
  card: {
    background: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  presetBtn: {
    marginRight: 10,
    padding: '8px 12px',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
  },
  saveBtn: {
    padding: '12px 20px',
    background: '#4cafef',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
  },
}

export default RidePreferencesPage
