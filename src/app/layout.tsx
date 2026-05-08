import '@/lib/leafletFix'
import './globals.css'
import { Box } from '@mui/material'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          {/* Sidebar */}
          <Box
            sx={{
              width: '240px',
              backgroundColor: 'primary.main',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Sidebar content */}
            <Box component="nav">
              {/* Sidebar items */}
            </Box>
          </Box>

          {/* Main content */}
          <Box
            sx={{
              flexGrow: 1,
              backgroundColor: 'background.default',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Main content */}
            {children}
          </Box>
        </Box>
      </body>
    </html>
  )
}