'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Card,
  CardMedia,
  CardContent,
  Chip,
  IconButton,
  Drawer,
  LinearProgress,
  Avatar,
  Divider,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'


import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import CloseIcon from '@mui/icons-material/Close'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import FilterListIcon from '@mui/icons-material/FilterList'
import InfoIcon from '@mui/icons-material/Info'
import LinkIcon from '@mui/icons-material/Link'
import Grid from '@mui/material/Grid'


type MediaAsset = {
  id: string
  title?: string
  alt: string
  category: 'drivers' | 'vehicles' | 'sliders' | 'other'
  filename: string
  mimeType: string
  filesize: number
  width: number
  height: number
  url: string
  updatedAt: string
}

export default function MediaLibrary() {
  const [assets, setAssets] = useState<MediaAsset[]>([])
  const [tabValue, setTabValue] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [openDrawer, setOpenDrawer] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [bulkFiles, setBulkFiles] = useState<File[]>([])


  const [form, setForm] = useState({
    title: '',
    alt: '',
    category: 'other',
    file: null as File | null,
    preview: '',
  })

  useEffect(() => {
    fetchAssets()
  }, [])

  const fetchAssets = async () => {
    try {
      const res = await fetch('/api/media?limit=100&sort=-createdAt')
      const data = await res.json()
      if (data.docs) setAssets(data.docs)
    } catch (e) { console.error(e) }
  }

  const filteredAssets = useMemo(() => {
    const categories = ['all', 'vehicles', 'drivers', 'banners']
    const selectedCat = categories[tabValue]
    
    return assets.filter(a => {
      const matchesSearch = a.filename.toLowerCase().includes(searchTerm.toLowerCase()) || (a.title && a.title.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesCat = selectedCat === 'all' || a.category === selectedCat
      return matchesSearch && matchesCat
    })
  }, [assets, tabValue, searchTerm])

 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  const previewUrl = URL.createObjectURL(file)

  setForm(prev => ({
    ...prev,
    file,
    preview: previewUrl,
  }))
}

  const handleUpload = async () => {
  if (!form.file) return

  setUploading(true)

  const formData = new FormData()

  const altValue =
    form.alt && form.alt.trim() !== ''
      ? form.alt
      : form.file.name || 'image'

  formData.append('file', form.file)
  formData.append('title', form.title || form.file.name)
  formData.append('alt', altValue)
  formData.append('category', form.category)

  try {
    const res = await fetch('/api/media', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    })

    if (!res.ok) {
      console.error(await res.text())
    }
  } finally {
    setUploading(false)
  }
}

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const handleDelete = async (id: string) => {
  const confirm = window.confirm('Delete this asset?')
  if (!confirm) return

  try {
    const res = await fetch(`/api/media/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })

    if (res.ok) {
      setAssets(prev => prev.filter(a => a.id !== id))
    } else {
      console.error(await res.text())
    }
  } catch (err) {
    console.error(err)
  }
}
const handleBulkFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files || [])
  setBulkFiles(files)
}
const handleBulkUpload = async () => {
  if (!bulkFiles.length) return

  setUploading(true)

  try {
    for (const file of bulkFiles) {
      const formData = new FormData()

      formData.append('file', file)
      formData.append('title', file.name)
      formData.append('alt', file.name)
      formData.append('category', 'other')

      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (!res.ok) {
        console.error(await res.text())
      }
    }

    await fetchAssets()
    setBulkFiles([])
  } finally {
    setUploading(false)
  }
}

  return (
    <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* HEADER */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h6" fontWeight={800} color="#0f172a">MEDIA ASSETS</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            size="small"
            placeholder="Search by File Name..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            sx={{ width: 300, '& .MuiOutlinedInput-root': { bgcolor: '#fff', borderRadius: 2 } }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
          />
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => setOpenDrawer(true)}
            sx={{ bgcolor: '#0f172a', color: '#fff', textTransform: 'none', fontWeight: 600, px: 3, borderRadius: 2 }}
          >
            Add Asset
          </Button>
          <IconButton size="small"><SearchIcon /></IconButton>
        </Stack>
      </Stack>

      {/* TOP CARDS */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h5" fontWeight={800} color="#0f172a" mb={1}>Fleet Asset Library</Typography>
              <Typography variant="body2" color="#64748b">Manage and optimize high-resolution vehicle and logistics media.</Typography>
            </Box>
             <Button
  variant="contained"
  component="label"
   sx={{ bgcolor: '#0f172a', color: '#fff', textTransform: 'none', fontWeight: 600, px: 3, borderRadius: 2 }}
  startIcon={<CloudUploadIcon />}
>
  Bulk Upload
  <input
    type="file"
    hidden
    multiple
    onChange={handleBulkFileChange}
    accept="image/*"
  />
</Button>

{/* 👇 THIS GOES HERE */}
{bulkFiles.length > 0 && (
  <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
    {bulkFiles.map((file, i) => (
      <img
        key={i}
        src={URL.createObjectURL(file)}
        style={{
          width: 60,
          height: 60,
          objectFit: 'cover',
          borderRadius: 6,
        }}
      />
    ))}
  </Stack>
)}
          </Paper>
        </Grid>
      </Grid>

      {/* TABS & SORT */}

     <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>

  <Tabs
    value={tabValue}
    onChange={(_, val) => setTabValue(val)}
    sx={{
      '& .MuiTabs-indicator': { display: 'none' },
      '& .MuiTab-root': {
        textTransform: 'none',
        fontWeight: 700,
        color: '#64748b',
        px: 3,
        borderRadius: 2,
        mr: 1,
        '&.Mui-selected': { bgcolor: '#0f172a', color: '#fff' }
      }
    }}
  >
    <Tab label="All Assets" />
    <Tab label="Vehicles" />
    <Tab label="Drivers" />
    <Tab label="Banners" />
  </Tabs>

  {/* VIEW TOGGLE */}
  <Stack direction="row" spacing={1}>
    <Button
      variant={viewMode === 'grid' ? 'contained' : 'outlined'}
      onClick={() => setViewMode('grid')}
      sx={{ textTransform: 'none' }}
    >
      Grid
    </Button>

    <Button
      variant={viewMode === 'list' ? 'contained' : 'outlined'}
      onClick={() => setViewMode('list')}
      sx={{ textTransform: 'none' }}
    >
      List
    </Button>
  </Stack>

</Stack>

      {/* GRID */}
      
        {/* ASSETS VIEW */}
{viewMode === 'grid' ? (
  <Grid container spacing={3}>
    {filteredAssets.map(asset => (
       <Grid xs={12} sm={6} md={3} key={asset.id}>
        <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
          <CardMedia
            component="img"
            height="160"
            image={asset.url}
            alt={asset.alt}
          />

          <CardContent>
            <Typography fontWeight={700} noWrap>
              {asset.title || asset.filename}
            </Typography>

            <Stack direction="row" justifyContent="space-between" mt={1}>
              <Typography variant="caption">
                {formatSize(asset.filesize)}
              </Typography>
              <Typography variant="caption">
                {asset.width} × {asset.height}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} mt={2}>
              <Button size="small" variant="outlined">
                Edit
              </Button>

              <Button
                size="small"
                color="error"
                variant="outlined"
                onClick={() => handleDelete(asset.id)}
              >
                Delete
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
) : (

  <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Preview</TableCell>
        <TableCell>Title</TableCell>
        <TableCell>Size</TableCell>
        <TableCell>Dimensions</TableCell>
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {filteredAssets.map(asset => (
        <TableRow key={asset.id}>
          <TableCell>
            <img
              src={asset.url}
              style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }}
            />
          </TableCell>

          <TableCell>{asset.title || asset.filename}</TableCell>

          <TableCell>{formatSize(asset.filesize)}</TableCell>

          <TableCell>
            {asset.width} × {asset.height}
          </TableCell>

          <TableCell>
            <Stack direction="row" spacing={1}>
              <Button size="small" variant="outlined">Edit</Button>
              <Button
                size="small"
                color="error"
                variant="outlined"
                onClick={() => handleDelete(asset.id)}
              >
                Delete
              </Button>
            </Stack>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
)}

      {/* CREATE ASSET DRAWER */}
      <Drawer anchor="right" open={openDrawer} onClose={() => setOpenDrawer(false)} PaperProps={{ sx: { width: '85%', bgcolor: '#f8fafc' } }}>
        <Box sx={{ p: 4 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
            <Box>
              <Typography variant="caption" color="#64748b" fontWeight={600}>Content &gt; Media Library &gt; <Typography component="span" variant="caption" color="#3b82f6" fontWeight={700}>Create New Asset</Typography></Typography>
              <Typography variant="h4" fontWeight={800} mt={1}>Create New Asset</Typography>
              <Typography variant="body2" color="#64748b">Upload and configure a new visual asset for the logistics portal.</Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" onClick={() => setOpenDrawer(false)} sx={{ textTransform: 'none', borderRadius: 2, px: 3, fontWeight: 700, borderColor: '#e2e8f0', color: '#0f172a' }}>Cancel</Button>
              <Button variant="contained" onClick={handleUpload} disabled={uploading} sx={{ bgcolor: '#0f172a', textTransform: 'none', borderRadius: 2, px: 3, fontWeight: 700 }}>Save Asset</Button>
            </Stack>
          </Stack>

          <Grid container spacing={4}>
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none', mb: 4 }}>
                <Typography variant="subtitle1" fontWeight={700} mb={3}>Asset Upload</Typography>
                <Box 
                  sx={{ 
                    border: '2px dashed #cbd5e1', 
                    borderRadius: 3, 
                    p: 6, 
                    textAlign: 'center',
                    bgcolor: '#f1f5f9',
                    position: 'relative'
                  }}
                >
                  <FileUploadIcon sx={{ fontSize: 48, color: '#94a3b8', mb: 2 }} />
                  <Typography variant="subtitle1" fontWeight={700} color="#0f172a">Drag and drop your file here</Typography>
                  <Typography variant="caption" color="#64748b" display="block" mb={4}>Supports JPEG, PNG, SVC up to 10MB</Typography>
                  <Stack direction="row" spacing={2} justifyContent="center">
                    <Button variant="contained" component="label" sx={{ bgcolor: '#0f172a', textTransform: 'none', borderRadius: 2 }}>
                      Select file
                      <input
                       type="file"
                      hidden
                      multiple
                      onChange={handleBulkFileChange}
                      accept="image/*"
                      />
                    </Button>
                    <Button variant="outlined" startIcon={<LinkIcon />} sx={{ borderColor: '#e2e8f0', color: '#0f172a', textTransform: 'none', borderRadius: 2 }}>Paste URL</Button>
                  </Stack>
                  {form.preview && (
                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                      <img src={form.preview} style={{ maxHeight: 200, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                    </Box>
                  )}
                </Box>
              </Paper>

              <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                <Typography variant="subtitle1" fontWeight={700} mb={3}>Asset Details</Typography>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="caption" fontWeight={700} color="#64748b" display="block" mb={1}>TITLE</Typography>
                    <TextField fullWidth size="small" placeholder="e.g. Heavy Duty Fleet 2024" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                  </Box>
                  <Box>
                    <Typography variant="caption" fontWeight={700} color="#64748b" display="block" mb={1}>ALT TEXT (REQUIRED)</Typography>
                    <TextField fullWidth multiline rows={2} placeholder="Describe the image content..." value={form.alt} onChange={e => setForm({...form, alt: e.target.value})} />
                    <Typography variant="caption" color="#94a3b8" mt={0.5} display="block">Used for accessibility and SEO. Be descriptive.</Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Drawer>

    </Box>
  )
}
