'use client'

import 'leaflet/dist/leaflet.css'

let L: any

export const loadLeaflet = async () => {
  if (typeof window === 'undefined') return null

  if (!L) {
    L = await import('leaflet')
  }

  // fix default icons
  const DefaultIcon = L.Icon.Default.prototype as any
  delete DefaultIcon._getIconUrl

  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl:
      'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl:
      'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })

  return L
}