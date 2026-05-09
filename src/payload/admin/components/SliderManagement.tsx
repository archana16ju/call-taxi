'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Button,
  Stack,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  Tooltip,
  CircularProgress
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CloseIcon from '@mui/icons-material/Close'
import ArrowBackIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos'

export default function SliderManagement() {
  const [bulkFiles, setBulkFiles] = useState<File[]>([])
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)
  const [loading, setLoading] = useState(true)
  const [images, setImages] = useState<any[]>([])
  const [editItem, setEditItem] = useState<any>(null)
  const [formData, setFormData] = useState<{ alt: string, file: File | null }>({ alt: '', file: null })
  const [open, setOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const fetchImages = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/slider-images?limit=100&sort=-createdAt')
      const data = await res.json()
      setImages(data.docs || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [])

  const handleOpen = (item: any = null) => {
    if (item) {
      setEditItem(item)
      setFormData({ alt: item.alt || '', file: null })
      setBulkFiles([])
    } else {
      setEditItem(null)
      setFormData({ alt: '', file: null })
      setBulkFiles([])
    }
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setEditItem(null)
    setFormData({ alt: '', file: null })
    setBulkFiles([])
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      if (files.length > 1) {
        setBulkFiles(files)
        setFormData(prev => ({ ...prev, file: null }))
      } else if (files.length === 1) {
        setFormData(prev => ({ ...prev, file: files[0] }))
        setBulkFiles([])
      }
    }
  }

  const handleSave = async () => {
    if (!editItem && bulkFiles.length > 0) {
      // BULK UPLOAD
      setIsUploading(true)
      try {
        for (const file of bulkFiles) {
          const data = new FormData()
          data.append('alt', file.name.split('.')[0])
          data.append('file', file)
          await fetch('/api/slider-images', { method: 'POST', body: data })
        }
        await fetchImages()
        handleClose()
      } catch (e) {
        console.error(e)
        alert('Bulk upload partially failed')
      } finally {
        setIsUploading(false)
      }
      return
    }

    if (!formData.alt) return alert('Alt text is required')
    if (!editItem && !formData.file) return alert('Image file is required')

    setIsUploading(true)
    try {
      const data = new FormData()
      data.append('alt', formData.alt)
      if (formData.file) {
        data.append('file', formData.file)
      }

      const url = editItem ? `/api/slider-images/${editItem.id}` : '/api/slider-images'
      const method = editItem ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        body: data
      })

      if (res.ok) {
        await fetchImages()
        handleClose()
      } else {
        const err = await res.json()
        alert('Failed to save: ' + JSON.stringify(err))
      }
    } catch (e) {
      console.error(e)
      alert('Error saving image')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this slider image?')) return
    
    try {
      const res = await fetch(`/api/slider-images/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setImages(prev => prev.filter(img => img.id !== id))
      }
    } catch (e) {
      console.error(e)
    }
  }

  const nextSlide = () => setActiveSlide(prev => (prev + 1) % images.length)
  const prevSlide = () => setActiveSlide(prev => (prev - 1 + images.length) % images.length)

  return (
    <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={900} color="#0f172a">Slider Management</Typography>
          <Typography color="text.secondary">Manage homepage banners and promotional sliders</Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button 
            variant="outlined"
            startIcon={<PhotoLibraryIcon />}
            onClick={() => setIsPreviewOpen(true)}
            disabled={images.length === 0}
            sx={{ borderRadius: 2, borderColor: '#e2e8f0', color: '#0f172a' }}
          >
            Live Preview
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => handleOpen()}
            sx={{ borderRadius: 2, bgcolor: '#0f172a', '&:hover': { bgcolor: '#1e293b' } }}
          >
            Upload Images
          </Button>
        </Stack>
      </Stack>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {images.map((img) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={img.id}>
              <Card sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: 'none', transition: '0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 20px -10px rgba(0,0,0,0.1)' } }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={img.url}
                  alt={img.alt}
                  sx={{ bgcolor: '#f1f5f9', objectFit: 'cover' }}
                />
                <CardContent sx={{ pb: 1 }}>
                  <Typography variant="subtitle1" fontWeight={700} noWrap>{img.alt}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    Uploaded on {new Date(img.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
                  <IconButton size="small" color="primary" onClick={() => handleOpen(img)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(img.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
          {images.length === 0 && (
            <Grid size={12}>
              <Paper sx={{ p: 10, textAlign: 'center', borderRadius: 4, border: '2px dashed #e2e8f0', bgcolor: 'transparent' }}>
                <PhotoLibraryIcon sx={{ fontSize: 60, color: '#cbd5e1', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">No slider images found</Typography>
                <Button sx={{ mt: 2 }} onClick={() => handleOpen()}>Upload your first image</Button>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}

      {/* UPLOAD DIALOG */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>{editItem ? 'Edit Slider' : 'Add Slider Assets'}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {!editItem && bulkFiles.length > 0 ? (
              <Box sx={{ p: 2, bgcolor: '#f0f9ff', borderRadius: 2, border: '1px solid #bae6fd' }}>
                <Typography variant="body2" fontWeight={700} color="#0369a1">
                  Bulk Upload Ready: {bulkFiles.length} images selected
                </Typography>
                <Typography variant="caption" color="#0369a1">
                  File names will be used as alt titles automatically.
                </Typography>
              </Box>
            ) : (
              <TextField
                label="Alt Text / Title"
                fullWidth
                value={formData.alt}
                onChange={e => setFormData(prev => ({ ...prev, alt: e.target.value }))}
                helperText="Describe the image for accessibility and SEO"
                disabled={bulkFiles.length > 0}
              />
            )}
            
            <Box>
              <Typography variant="caption" fontWeight={700} color="#475569" display="block" mb={1}>
                {editItem ? 'CHANGE IMAGE' : 'SELECT FILES (SUPPORT BULK)'}
              </Typography>
              <Button
                component="label"
                variant="outlined"
                fullWidth
                startIcon={<CloudUploadIcon />}
                sx={{ height: 120, borderStyle: 'dashed', borderRadius: 2, borderColor: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: 1 }}
              >
                <Typography variant="body2" fontWeight={600}>
                  {formData.file ? formData.file.name : (bulkFiles.length > 0 ? `${bulkFiles.length} files selected` : 'Drop files here or click to browse')}
                </Typography>
                <Typography variant="caption" color="text.secondary">PNG, JPG, WEBP supported</Typography>
                <input type="file" hidden accept="image/*" multiple={!editItem} onChange={handleFileChange} />
              </Button>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} disabled={isUploading}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSave} 
            disabled={isUploading}
            sx={{ bgcolor: '#0f172a', px: 4, borderRadius: 2 }}
          >
            {isUploading ? <CircularProgress size={24} color="inherit" /> : (editItem ? 'Save Changes' : (bulkFiles.length > 1 ? `Upload ${bulkFiles.length} Images` : 'Upload Slider'))}
          </Button>
        </DialogActions>
      </Dialog>

      {/* PREVIEW CAROUSEL DIALOG */}
      <Dialog 
        open={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        maxWidth="lg" 
        fullWidth 
        PaperProps={{ sx: { borderRadius: 4, bgcolor: '#000', overflow: 'hidden' } }}
      >
        <Box sx={{ position: 'relative', height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {images.length > 0 && (
            <>
              <Box 
                component="img"
                src={images[activeSlide].url}
                sx={{ width: '100%', height: '100%', objectFit: 'contain', transition: '0.3s ease-in-out' }}
              />
              
              {/* CONTROLS */}
              <IconButton 
                onClick={prevSlide}
                sx={{ position: 'absolute', left: 20, bgcolor: 'rgba(255,255,255,0.1)', color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
              >
                <ArrowBackIcon />
              </IconButton>
              <IconButton 
                onClick={nextSlide}
                sx={{ position: 'absolute', right: 20, bgcolor: 'rgba(255,255,255,0.1)', color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
              >
                <ArrowForwardIcon />
              </IconButton>

              {/* OVERLAY INFO */}
              <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: 4, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', color: '#fff' }}>
                <Typography variant="h5" fontWeight={800}>{images[activeSlide].alt}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>Slide {activeSlide + 1} of {images.length}</Typography>
              </Box>
            </>
          )}
          <IconButton 
            onClick={() => setIsPreviewOpen(false)}
            sx={{ position: 'absolute', top: 20, right: 20, color: '#fff' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Dialog>
    </Box>
  )
}
