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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  IconButton,
  Drawer,
  Rating,
  Pagination,
  Select,
  MenuItem,
  Grid,
} from '@mui/material'

import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import FilterListIcon from '@mui/icons-material/FilterList'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import CloseIcon from '@mui/icons-material/Close'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

type Review = {
  id: string
  booking: any
  user: any
  rating: number
  comment: string
  createdAt: string
}

export default function ReviewManagement() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [ratingFilter, setRatingFilter] = useState('All Ratings')
  
  const [openDrawer, setDrawerOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Review>>({
    rating: 5,
    comment: '',
    user: '',
    booking: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/reviews?limit=100&depth=2')
      const data = await res.json()
      if (data.docs) {
        setReviews(data.docs)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleEdit = (r: Review) => {
    setEditingId(r.id)
    setForm({
      rating: r.rating,
      comment: r.comment,
      user: typeof r.user === 'object' ? r.user?.id : r.user,
      booking: typeof r.booking === 'object' ? r.booking?.id : r.booking,
    })
    setDrawerOpen(true)
  }

  const handleCreate = () => {
    setEditingId(null)
    setForm({
      rating: 5,
      comment: '',
      user: '',
      booking: '',
    })
    setDrawerOpen(true)
  }

  const handleSave = async () => {
    try {
      const url = editingId ? `/api/reviews/${editingId}` : '/api/reviews'
      const method = editingId ? 'PATCH' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      if (!res.ok) {
        const err = await res.json()
        alert('Error saving review: ' + JSON.stringify(err))
        return
      }

      setDrawerOpen(false)
      fetchData()
    } catch (e) {
      console.error(e)
      alert('Error saving review')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' })
      if (res.ok) fetchData()
    } catch (e) {
      console.error(e)
    }
  }

  const filteredReviews = useMemo(() => {
    return reviews.filter(r => {
      const q = searchTerm.toLowerCase()
      const userName = typeof r.user === 'object' ? r.user?.name || '' : ''
      const comment = r.comment || ''
      return userName.toLowerCase().includes(q) || comment.toLowerCase().includes(q)
    })
  }, [reviews, searchTerm])

  const stats = useMemo(() => {
    const total = reviews.length
    const avg = total > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / total : 0
    return { total, avg }
  }, [reviews])

  return (
    <Box sx={{ p: 4, bgcolor: '#f4f6f8', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* HEADER TABS (MOCK) */}
      <Stack direction="row" spacing={4} sx={{ mb: 4, borderBottom: '1px solid #e2e8f0', pb: 2 }}>
        <Typography variant="h5" fontWeight={600}>
                      Review Management
         </Typography>
      </Stack>

      <Paper sx={{ p: 4, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={4}>
          <Box>
            <Typography variant="h5" fontWeight={800} color="#0f172a" mb={0.5}>Passenger Reviews</Typography>
            <Typography variant="body2" color="#64748b">Monitor and manage feedback from your customers.</Typography>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleCreate}
            sx={{ bgcolor: '#0f172a', color: '#fff', textTransform: 'none', fontWeight: 600, px: 3, borderRadius: 1 }}
          >
            ADD REVIEW
          </Button>
        </Stack>

        {/* SUMMARY CARDS */}
        <Grid container spacing={3} mb={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc' }}>
              <Typography variant="caption" fontWeight={700} color="#64748b">TOTAL REVIEWS</Typography>
              <Typography variant="h4" fontWeight={800} color="#0f172a">{stats.total}</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc' }}>
              <Typography variant="caption" fontWeight={700} color="#64748b">AVERAGE RATING</Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="h4" fontWeight={800} color="#3b82f6">{stats.avg.toFixed(1)}</Typography>
                <Rating value={stats.avg} readOnly precision={0.5} size="small" />
              </Stack>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc' }}>
              <Typography variant="caption" fontWeight={700} color="#64748b">5-STAR RATING</Typography>
              <Typography variant="h4" fontWeight={800} color="#10b981">
                {reviews.filter(r => r.rating === 5).length}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* TOOLBAR */}
        <Stack direction="row" spacing={2} mb={3}>
          <TextField
            size="small"
            placeholder="Search by name or comment..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1, '& .MuiOutlinedInput-root': { bgcolor: '#f8fafc' } }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
            }}
          />
          <Select size="small" value={ratingFilter} onChange={e => setRatingFilter(e.target.value)} sx={{ minWidth: 140, bgcolor: '#f8fafc' }}>
            <MenuItem value="All Ratings">All Ratings</MenuItem>
            <MenuItem value="5 Stars">5 Stars</MenuItem>
            <MenuItem value="4 Stars">4 Stars</MenuItem>
          </Select>
          <Button variant="outlined" sx={{ minWidth: 40, p: 0, borderColor: '#e2e8f0', bgcolor: '#f8fafc' }}>
            <FilterListIcon fontSize="small" sx={{ color: '#475569' }} />
          </Button>
        </Stack>

        {/* TABLE */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: 11 }}>USER</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: 11 }}>RATING</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: 11 }}>COMMENT</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: 11 }}>DATE</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#475569', fontSize: 11 }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReviews.map((r, idx) => {
                const userName = typeof r.user === 'object' ? r.user?.name || 'Unknown' : 'Unknown'
                return (
                  <TableRow key={r.id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: '#f1f5f9', color: '#475569', width: 36, height: 36, fontSize: 14, fontWeight: 700 }} variant="rounded">
                          {userName.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600} color="#0f172a">{userName}</Typography>
                          <Typography variant="caption" color="text.secondary">Passenger</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Rating value={r.rating} readOnly size="small" sx={{ color: '#3b82f6' }} />
                    </TableCell>
                    <TableCell sx={{ maxWidth: 300 }}>
                      <Typography variant="body2" color="#475569" noWrap>{r.comment}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="#475569">{new Date(r.createdAt).toLocaleDateString()}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton size="small" onClick={() => handleEdit(r)}>
                          <EditIcon fontSize="small" sx={{ color: '#94a3b8' }} />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDelete(r.id)}>
                          <DeleteIcon fontSize="small" sx={{ color: '#ef4444' }} />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Stack direction="row" justifyContent="space-between" alignItems="center" mt={3}>
          <Typography variant="body2" color="text.secondary">Showing 1 to {filteredReviews.length} of {filteredReviews.length} reviews</Typography>
          <Pagination count={1} shape="rounded" size="small" />
        </Stack>
      </Paper>

      {/* ADD/EDIT DRAWER */}
      <Drawer anchor="right" open={openDrawer} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: { width: { xs: '100%', md: 450 }, bgcolor: '#f8fafc' } }}>
        <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
          
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h6" fontWeight={800} color="#0f172a">
              {editingId ? 'Edit Review' : 'Add New Review'}
            </Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>

          <Stack spacing={3}>
            <Box>
              <Typography variant="caption" fontWeight={700} color="#64748b" display="block" mb={1}>Rating</Typography>
              <Rating 
                value={form.rating} 
                onChange={(_, val) => setForm({...form, rating: val || 5})} 
                size="large"
                sx={{ color: '#3b82f6' }}
              />
            </Box>

            <Box>
              <Typography variant="caption" fontWeight={700} color="#64748b" display="block" mb={1}>Comment</Typography>
              <TextField 
                fullWidth 
                multiline 
                rows={4} 
                placeholder="Share your experience..." 
                value={form.comment} 
                onChange={e => setForm({...form, comment: e.target.value})}
                sx={{ bgcolor: '#fff' }}
              />
            </Box>

            {/* In a real app, these would be dropdowns populated from API */}
            <Box>
              <Typography variant="caption" fontWeight={700} color="#64748b" display="block" mb={1}>User ID</Typography>
              <TextField 
                fullWidth 
                size="small" 
                placeholder="Paste User ID" 
                value={form.user} 
                onChange={e => setForm({...form, user: e.target.value})}
                sx={{ bgcolor: '#fff' }}
              />
            </Box>

            <Box>
              <Typography variant="caption" fontWeight={700} color="#64748b" display="block" mb={1}>Booking ID</Typography>
              <TextField 
                fullWidth 
                size="small" 
                placeholder="Paste Booking ID" 
                value={form.booking} 
                onChange={e => setForm({...form, booking: e.target.value})}
                sx={{ bgcolor: '#fff' }}
              />
            </Box>

            <Button 
              variant="contained" 
              fullWidth 
              onClick={handleSave}
              sx={{ bgcolor: '#0f172a', color: '#fff', py: 1.5, textTransform: 'none', fontWeight: 600, mt: 2 }}
            >
              {editingId ? 'Update Review' : 'Submit Review'}
            </Button>
          </Stack>

        </Box>
      </Drawer>
    </Box>
  )
}