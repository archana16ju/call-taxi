'use client'

import React from 'react'
import { Box } from '@mui/material'
import { CustomNav } from './CustomNav'

export default function AdminShell({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        overflow: 'hidden',
        background: '#f8fafc',
      }}
    >
      {/* Sidebar */}
      <CustomNav />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          width: '100%',
          minWidth: 0,
          overflowX: 'auto',
          overflowY: 'auto',
          p: 0,
          background: '#f8fafc',
        }}
      >
        {children}
      </Box>
    </Box>
  )
}