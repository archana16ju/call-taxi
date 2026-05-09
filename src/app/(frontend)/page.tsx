import React from 'react'
import { Box } from '@mui/material'
import { getPayload } from 'payload'
import config from '../../payload.config'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import TariffSection from './components/TariffSection'
import ReviewsSection from './components/ReviewsSection'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'
import PartnerSection from './components/PartnerSection'
import { TariffDoc } from './types'

import Link from 'next/link'
import { Button, Stack, Paper, Typography } from '@mui/material'

export const dynamic = 'force-dynamic'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Kani Taxi',
  image: 'https://bucghzn379yrpbdu.public.blob.vercel-storage.com/Banner/kanitaxi-location.png',
  telephone: '+919488104888',
  email: 'kanitaxi5555@gmail.com',
  url: 'https://kanitaxi.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '33 Chetti street subramaniyapuram sawyerpuram',
    addressLocality: 'Thoothukudi',
    addressRegion: 'Tamil Nadu',
    postalCode: '628251',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 8.7642,
    longitude: 78.1348,
  },
  areaServed: [
    {
      '@type': 'City',
      name: 'Thoothukudi',
    },
    {
      '@type': 'City',
      name: 'Sawyerpuram',
    },
    {
      '@type': 'City',
      name: 'Tirunelveli',
    },
  ],
  priceRange: '₹',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
  ],
  sameAs: [
    'https://www.facebook.com/kanitaxi', // Example, can be removed if not known
    // Add other social profiles if available
  ],
}

export default async function Page() {
  const payload = await getPayload({ config })
  const tariffsRes = await payload.find({
    collection: 'tariffs',
    limit: 100,
    sort: '-updatedAt',
    depth: 2,
  })

  // Normalize data for client components
  const tariffs = tariffsRes.docs
    .filter((doc) => {
      const vehicle = doc.vehicleType
      if (typeof vehicle === 'object' && vehicle !== null) {
        return vehicle.category === 'tariff'
      }
      return false
    })
    .map((doc) => {
      return {
        id: doc.id,
        vehicle: doc.vehicleType,
        oneway: doc.oneway,
        roundtrip: doc.roundtrip,
        packages: doc.packages,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      } as TariffDoc
    })

  return (
    <main style={{ backgroundColor: '#e0f2fe', minHeight: '100vh' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <HeroSection />
      <AboutSection />

      {/* Unified Background for Tariffs & Packages */}
      <Box
        sx={{
          position: 'relative',
          backgroundImage:
            'url(https://bucghzn379yrpbdu.public.blob.vercel-storage.com/Banner/kanitaxi-location.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed', // Parallax effect
        }}
      >
        {/* White overlay for readability */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'linear-gradient(to bottom, #e0f2fe 0%, rgba(224, 242, 254, 0.98) 15%, rgba(224, 242, 254, 0.98) 100%)',
            bgcolor: 'transparent', // fallback
            zIndex: 0,
          }}
        />

        <Box position="relative" zIndex={1}>
          <TariffSection tariffs={tariffs} />
        </Box>
      </Box>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at top, #1a1a2e, #0f0f1a, #050510)',
          px: 2,
        }}
      >
        <Paper
          elevation={10}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 5,
            maxWidth: 500,
            width: '100%',
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: '0 0 30px rgba(0,255,255,0.15)',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#ffffff',
              mb: 1,
            }}
          >
            🚖 Book Your Taxi Instantly
          </Typography>

          <Typography sx={{ color: '#b0b0b0', mb: 4 }}>
            Choose AI or Voice booking powered by smart automation
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
            {/* AI Booking */}
            <Link href="/aichat">
              <Button
                sx={{
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  color: '#fff',
                  background: 'linear-gradient(45deg, #00f5ff, #007cf0)',
                  borderRadius: 3,
                  transition: '0.3s',
                  boxShadow: '0 0 10px rgba(0,255,255,0.3)',
                  '&:hover': {
                    transform: 'scale(1.08)',
                    boxShadow: '0 0 20px rgba(0,255,255,0.8), 0 0 40px rgba(0,124,240,0.6)',
                  },
                }}
              >
                AI Booking ✨
              </Button>
            </Link>

            {/* Voice Booking */}
            <Link href="/voice">
              <Button
                sx={{
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  color: '#fff',
                  background: 'linear-gradient(45deg, #ff00cc, #3333ff)',
                  borderRadius: 3,
                  transition: '0.3s',
                  boxShadow: '0 0 10px rgba(255,0,204,0.3)',
                  '&:hover': {
                    transform: 'scale(1.08)',
                    boxShadow: '0 0 20px rgba(255,0,204,0.8), 0 0 40px rgba(51,51,255,0.6)',
                  },
                }}
              >
                Voice Booking 🎤
              </Button>
            </Link>
          </Stack>
        </Paper>
      </Box>
      <ReviewsSection />

      <PartnerSection />

      <ContactSection />
      <Footer />
    </main>
  )
}
