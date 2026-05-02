'use client'

import React from 'react'

export default function LocationTracker() {
  const [driverId, setDriverId] = React.useState<string | null>(null)
  const [isTracking, setIsTracking] = React.useState(false)

  // 1. Find the driver ID associated with the current logged-in user
  React.useEffect(() => {
    async function initTracker() {
      try {
        const userRes = await fetch('/api/users/me').then(res => res.json())
        if (userRes && userRes.user) {
          const userId = userRes.user.id
          const driverRes = await fetch(`/api/drivers?where[user][equals]=${userId}&limit=1`).then(res => res.json())
          
          if (driverRes.docs.length > 0) {
            setDriverId(driverRes.docs[0].id)
          }
        }
      } catch (error) {
        console.error('LocationTracker: Error initializing:', error)
      }
    }
    initTracker()
  }, [])

  // 2. Start watching position when driverId is found
  React.useEffect(() => {
    if (!driverId) return

    let watchId: number

    if ('geolocation' in navigator) {
      setIsTracking(true)
      watchId = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          try {
            await fetch(`/api/drivers/${driverId}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                location: [longitude, latitude], // Payload point: [lng, lat]
              }),
            })
            // console.log(`Location updated: ${latitude}, ${longitude}`)
          } catch (error) {
            console.error('LocationTracker: Error updating location:', error)
          }
        },
        (error) => {
          console.error('LocationTracker: Geolocation error:', error)
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 5000,
        }
      )
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId)
    }
  }, [driverId])

  // This component doesn't render anything visible, it works in the background
  return null
}
