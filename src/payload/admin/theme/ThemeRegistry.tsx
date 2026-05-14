'use client'

import React, { useMemo } from 'react'
import {
  ThemeProvider,
  CssBaseline,
  createTheme,
  alpha,
} from '@mui/material'

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode
}) {
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'dark',

          primary: {
            main: '#FFCC00',
            light: '#FFD633',
            dark: '#E6B800',
            contrastText: '#000000',
          },

          secondary: {
            main: '#00E676',
          },

          background: {
            default: '#020817',
            paper: '#081226',
          },

          text: {
            primary: '#FFFFFF',
            secondary: '#94A3B8',
          },

          success: {
            main: '#00C853',
          },

          error: {
            main: '#FF4D4F',
          },

          divider: 'rgba(255,255,255,0.08)',
        },

        typography: {
          fontFamily: [
            'Inter',
            'system-ui',
            'sans-serif',
          ].join(','),

          h1: {
            fontWeight: 800,
            letterSpacing: '-0.04em',
          },

          h2: {
            fontWeight: 700,
            letterSpacing: '-0.03em',
          },

          h3: {
            fontWeight: 700,
          },

          h4: {
            fontWeight: 700,
          },

          h5: {
            fontWeight: 600,
          },

          h6: {
            fontWeight: 600,
          },

          button: {
            textTransform: 'none',
            fontWeight: 600,
          },
        },

        shape: {
          borderRadius: 18,
        },

        shadows: [
          'none',
          '0 4px 12px rgba(0,0,0,0.20)',
          '0 6px 16px rgba(0,0,0,0.22)',
          '0 8px 20px rgba(0,0,0,0.24)',
          '0 10px 24px rgba(0,0,0,0.26)',
          '0 12px 28px rgba(0,0,0,0.28)',
          '0 14px 32px rgba(0,0,0,0.30)',
          '0 16px 36px rgba(0,0,0,0.32)',
          '0 18px 40px rgba(0,0,0,0.34)',
          '0 20px 44px rgba(0,0,0,0.36)',
          '0 22px 48px rgba(0,0,0,0.38)',
          '0 24px 52px rgba(0,0,0,0.40)',
          '0 26px 56px rgba(0,0,0,0.42)',
          '0 28px 60px rgba(0,0,0,0.44)',
          '0 30px 64px rgba(0,0,0,0.46)',
          '0 32px 68px rgba(0,0,0,0.48)',
          '0 34px 72px rgba(0,0,0,0.50)',
          '0 36px 76px rgba(0,0,0,0.52)',
          '0 38px 80px rgba(0,0,0,0.54)',
          '0 40px 84px rgba(0,0,0,0.56)',
          '0 42px 88px rgba(0,0,0,0.58)',
          '0 44px 92px rgba(0,0,0,0.60)',
          '0 46px 96px rgba(0,0,0,0.62)',
          '0 48px 100px rgba(0,0,0,0.64)',
          '0 50px 104px rgba(0,0,0,0.66)',
        ],

        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                background:
                  'linear-gradient(135deg, #020817 0%, #04112b 45%, #020617 100%)',
                color: '#ffffff',
                minHeight: '100vh',
              },

              '*::-webkit-scrollbar': {
                width: '8px',
                height: '8px',
              },

              '*::-webkit-scrollbar-track': {
                background: '#081226',
              },

              '*::-webkit-scrollbar-thumb': {
                background: '#1E293B',
                borderRadius: '10px',
              },

              '*::-webkit-scrollbar-thumb:hover': {
                background: '#334155',
              },
            },
          },

          MuiPaper: {
            styleOverrides: {
              root: {
                background:
                  'linear-gradient(180deg, rgba(8,18,38,0.98) 0%, rgba(5,12,25,0.98) 100%)',
                border: '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
              },
            },
          },

          MuiCard: {
            styleOverrides: {
              root: {
                background:
                  'linear-gradient(180deg, rgba(8,18,38,0.98) 0%, rgba(5,12,25,0.98) 100%)',
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: '0 12px 30px rgba(0,0,0,0.30)',
              },
            },
          },

          MuiDrawer: {
            styleOverrides: {
              paper: {
                background:
                  'linear-gradient(180deg, #071225 0%, #08182f 100%)',
                borderRight: '1px solid rgba(255,255,255,0.05)',
              },
            },
          },

          MuiAppBar: {
            styleOverrides: {
              root: {
                background: alpha('#081226', 0.9),
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                boxShadow: 'none',
              },
            },
          },

          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 14,
                paddingInline: 18,
                paddingBlock: 10,
                fontWeight: 700,
              },

              containedPrimary: {
                background:
                  'linear-gradient(135deg, #FFCC00 0%, #F59E0B 100%)',
                color: '#000',

                '&:hover': {
                  background:
                    'linear-gradient(135deg, #FFD633 0%, #FBBF24 100%)',
                },
              },

              outlined: {
                borderColor: 'rgba(255,255,255,0.12)',

                '&:hover': {
                  borderColor: '#FFCC00',
                  background: 'rgba(255,204,0,0.08)',
                },
              },
            },
          },

          MuiChip: {
            styleOverrides: {
              root: {
                borderRadius: 10,
                fontWeight: 600,
                background: 'rgba(255,255,255,0.05)',
                color: '#E2E8F0',
              },

              colorSuccess: {
                background: 'rgba(0,230,118,0.12)',
                color: '#00E676',
              },

              colorPrimary: {
                background: 'rgba(255,204,0,0.14)',
                color: '#FFCC00',
              },

              colorError: {
                background: 'rgba(255,77,79,0.12)',
                color: '#FF4D4F',
              },
            },
          },

          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: 14,

                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.08)',
                  },

                  '&:hover fieldset': {
                    borderColor: 'rgba(255,204,0,0.5)',
                  },

                  '&.Mui-focused fieldset': {
                    borderColor: '#FFCC00',
                    boxShadow: '0 0 0 4px rgba(255,204,0,0.10)',
                  },
                },
              },
            },
          },

          MuiTableContainer: {
            styleOverrides: {
              root: {
                borderRadius: 18,
                border: '1px solid rgba(255,255,255,0.06)',
              },
            },
          },

          MuiTableHead: {
            styleOverrides: {
              root: {
                background: 'rgba(255,255,255,0.03)',
              },
            },
          },

          MuiTableCell: {
            styleOverrides: {
              root: {
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                color: '#E2E8F0',
              },

              head: {
                color: '#94A3B8',
                fontWeight: 700,
                fontSize: '0.8rem',
                textTransform: 'uppercase',
              },
            },
          },

          MuiListItemButton: {
            styleOverrides: {
              root: {
                borderRadius: 14,
                marginBottom: 6,
                color: '#CBD5E1',

                '&:hover': {
                  background: 'rgba(255,255,255,0.05)',
                },

                '&.Mui-selected': {
                  background:
                    'linear-gradient(90deg, rgba(255,204,0,0.18) 0%, rgba(255,204,0,0.05) 100%)',
                  color: '#FFCC00',

                  '& .MuiListItemIcon-root': {
                    color: '#FFCC00',
                  },
                },
              },
            },
          },

          MuiListItemIcon: {
            styleOverrides: {
              root: {
                color: '#94A3B8',
                minWidth: 40,
              },
            },
          },

          MuiAvatar: {
            styleOverrides: {
              root: {
                background:
                  'linear-gradient(135deg, #FFCC00 0%, #F59E0B 100%)',
                color: '#000',
                fontWeight: 700,
              },
            },
          },
        },
      }),
    []
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}