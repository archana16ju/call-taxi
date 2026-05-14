'use client'

import React from 'react'
import ThemeRegistry from './theme/ThemeRegistry'

export default function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  return <ThemeRegistry>{children}</ThemeRegistry>
}