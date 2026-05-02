"use client";

import React, { useState } from "react";

export default function GeneralSettings() {
  const [systemName, setSystemName] = useState("WhatsApp Support");
  const [supportNumber, setSupportNumber] = useState("12025550178");
  const [supportEmail, setSupportEmail] = useState("support@whatsapp.com");
  const [currencySymbol, setCurrencySymbol] = useState("$");

  const handleSave = () => {
    const payload = {
      systemName,
      supportNumber,
      supportEmail,
      currencySymbol,
    };

    console.log("Saved Config:", payload);
    alert("Configuration Saved Successfully");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            WhatsApp Support Configuration
          </h1>

          <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-600">
            Live Sync Active
          </span>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          Update global support parameters for the consumer platform.
        </p>

        {/* Form */}
        <div className="space-y-5">
          
          {/* System Name */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              System Name
            </label>
            <input
              type="text"
              value={systemName}
              onChange={(e) => setSystemName(e.target.value)}
              className="w-full mt-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Support Number */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              WhatsApp Support Number
            </label>
            <input
              type="text"
              value={supportNumber}
              onChange={(e) => setSupportNumber(e.target.value)}
              className="w-full mt-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <p className="text-xs text-gray-400 mt-1">
              Include country code (e.g. 91XXXXXXXXXX)
            </p>
          </div>

          {/* Support Email */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Support Email
            </label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full mt-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Currency Symbol */}
          <div className="w-32">
            <label className="text-sm font-medium text-gray-600">
              Currency Symbol
            </label>
            <input
              type="text"
              value={currencySymbol}
              onChange={(e) => setCurrencySymbol(e.target.value)}
              className="w-full mt-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-gray-100 rounded-lg text-sm text-gray-600">
          Real-time database sync is enabled. Changes will reflect instantly
          across the platform.
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
          >
            Discard
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}