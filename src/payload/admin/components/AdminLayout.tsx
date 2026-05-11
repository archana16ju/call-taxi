'use client'

import React from 'react'
import { Box } from '@mui/material'
import { CustomNav } from './CustomNav'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        background: '#f8fafc',
        overflow: 'hidden',
      }}
    >
      <CustomNav />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          width: '100%',
        }}
      >
        {children}
      </Box>
    </Box>
  )
}